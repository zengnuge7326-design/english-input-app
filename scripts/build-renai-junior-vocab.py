#!/usr/bin/env python3
"""
从桌面「初中仁爱版英语」PDF 中提取「Words in Each Unit」章节（全书后部词汇表），
不包含课文正文提取 JSON。

依赖：系统已安装 pdftotext（poppler）。

用法：
  python3 scripts/build-renai-junior-vocab.py

输出：src/data/renai_junior_words.json

生成后建议再运行一次音标规范化（修正 PDF 占位符与拉丁 I）：
  python3 scripts/fix_vocab_ipa.py --write
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DESKTOP = Path.home() / "Desktop" / "初中仁爱版英语"

BOOKS = [
    ("七年级上册（仁爱科普版）", 7, "up", "1  新版仁爱版英语七上电子教材.pdf"),
    ("七年级下册（仁爱科普版）", 7, "down", "1.新版仁爱英语7下扫描版电子书.pdf"),
    ("八年级上册（仁爱科普版）", 8, "up", "2025年新仁爱科普版八年级英语上册（高清版PDF）.pdf"),
    ("八年级下册（仁爱科普版）", 8, "down", "新教材八年级下册仁爱版英语 高清版 电子课本.pdf"),
    ("九年级上册（仁爱科普版）", 9, "up", "仁爱版九年级_上册_科学普及出版社.pdf"),
    ("九年级下册（仁爱科普版）", 9, "down", "仁爱版九年级_下册_科学普及出版社.pdf"),
]


def nfkc(s: str) -> str:
    return unicodedata.normalize("NFKC", s)


def strip_pua(s: str) -> str:
    """去掉 BMP 私用区占位符（PDF 把部分 IPA 印进私用区时的烂码）。"""
    return "".join(c for c in s if not (0xE000 <= ord(c) <= 0xF8FF))


def pdf_to_text(pdf_path: Path) -> str:
    r = subprocess.run(
        ["pdftotext", str(pdf_path), "-"],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    if r.returncode != 0:
        raise RuntimeError(r.stderr or "pdftotext failed")
    return r.stdout


def extract_words_in_each_unit_section(text: str) -> str:
    """截取「Words in Each Unit」词汇附录（排除目录 TOC 首次命中）。"""
    t = nfkc(text)
    start = -1
    # 优先：正文附录——含独立一行 Unit 1，且紧跟 word /ipa/ 行（目录只有页码无词条）
    for m in re.finditer(r"Words in Each Unit", t):
        window = t[m.start() : m.start() + 1600]
        if re.search(r"(?m)^\s*Unit\s+1\s*$", window) and re.search(
            r"[A-Za-z][A-Za-z'\-]*\s*/\s*[^\s/]", window
        ):
            start = m.start()
            break
    if start < 0:
        for pat in (
            r"Words and Expressions in Each Unit[^\n]*\n",
            r"Words in Each Unit\s+\d+\s*\n",
        ):
            m = re.search(pat, t)
            if m:
                start = m.start()
                break
    if start < 0:
        raise ValueError(
            "未找到附录词汇章节（Words in Each Unit / Words and Expressions in Each Unit）。"
            "若是纯扫描 PDF，请先 OCR 再提取。"
        )
    end_candidates = [
        t.find("\x0cVocabulary", start),
        t.find("\nVocabulary\n注：", start),
        t.find("\nVocabulary\n", start),
    ]
    ends = [e for e in end_candidates if e > start]
    if not ends:
        raise ValueError("未找到附录「Vocabulary」结束锚点")
    end = min(ends)
    return t[start:end]


def split_section_by_unit_headers(section: str) -> list[tuple[int, str]]:
    """按附录标题「Unit 1」「Unit 2」… 切块（NFKC 后匹配）。"""
    t = nfkc(section)
    parts = re.split(r"(?m)^\s*Unit\s+(\d+)\s*$", t)
    if len(parts) < 3:
        return []
    units: list[tuple[int, str]] = []
    preamble = parts[0]
    i = 1
    while i < len(parts):
        num = int(parts[i])
        body = parts[i + 1] if i + 1 < len(parts) else ""
        units.append((num, body))
        i += 2
    if preamble.strip():
        if units and units[0][0] == 1:
            units[0] = (1, preamble + "\n" + units[0][1])
        else:
            units.insert(0, (1, preamble))
    return units


LINE_RE = re.compile(
    r"^[\*＊∗]?\s*(?P<w>[A-Za-z][A-Za-z'\-]*(?:\s+[a-z][a-z]*)*)\s*/\s*(?P<ipa>[^/]+?)\s*/(?P<rest>.*)$"
)


def parse_vocab_lines(section: str) -> list[dict]:
    out: list[dict] = []
    for raw in section.splitlines():
        line = raw.strip()
        if not line:
            continue
        if re.fullmatch(r"([（(]\d+[）)])+", line):
            continue
        if ("Words in Each Unit" in line or "Words and Expressions in Each Unit" in line) and len(line) < 120:
            continue
        if re.fullmatch(r"\d+\s+Words in Each Unit\s*", line):
            continue
        if re.fullmatch(r"Words in Each Unit\s+\d+\s*", line):
            continue
        if line.split()[0:3] in (
            ["Preparing", "for", "the"],
            ["Exploring", "the", "Topic"],
            ["Developing", "the", "Topic"],
            ["Wrapping", "Up", "the"],
        ):
            continue
        if line.startswith("Developing ") or line.startswith("Exploring ") or line.startswith("Wrapping "):
            continue

        m = LINE_RE.match(line)
        if not m:
            continue
        w = m.group("w").strip()
        ipa = strip_pua(m.group("ipa").strip())
        ipa = re.sub(r"\s+", "", ipa)
        rest = strip_pua(m.group("rest"))
        zh = rest.strip()
        # 去掉同一行里次要读音标注「； / … /」再取释义
        zh = re.sub(r"\s*;\s*/[^/]+/\s*", " ", zh)
        zh = re.sub(r"\s*/[^/]+/\s*", " ", zh)
        pos = re.match(
            r"^\s*([nva]\.|adj\.|adv\.|prep\.|conj\.|pron\.|det\.|art\.|modal|excl\.|abbr\.|num\.|modal\s*v\.)\s*",
            zh,
            re.I,
        )
        if pos:
            zh = zh[pos.end() :].strip()
        zh = re.sub(r"\([（]?\d+[）]?\)\s*$", "", zh).strip()
        zh = re.sub(r"^[，；、\s]+", "", zh)
        for _ in range(4):
            zh = re.sub(
                r"^(pron\.|det\.|conj\.|prep\.|adj\.|adv\.|modal\s*v\.|abbr\.|num\.|art\.|v\.|n\.)\s*,?\s*",
                "",
                zh,
                flags=re.I,
            )
            zh = re.sub(r"^[,，;；\s]+", "", zh)
        zh = re.sub(r"\s+", " ", zh).strip(" ，；")
        zh = zh.rstrip(";:：；")
        mzh = re.search(r"[\u4e00-\u9fff]", zh)
        if mzh:
            zh = zh[mzh.start() :].strip()
        if not w or len(w) > 48:
            continue
        out.append({"word": w, "ipa": "/" + strip_pua(ipa) + "/" if ipa else "", "zh": zh or "—"})
    return out


def words_into_units(words: list[dict], n_units: int = 6) -> list[dict]:
    """后备：附录中未识别到 Unit 标题时，均分成 n_units 段（尽量少用）。"""
    if not words:
        return []
    n = max(1, min(n_units, len(words)))
    chunk = (len(words) + n - 1) // n
    units = []
    for i in range(n):
        sl = words[i * chunk : (i + 1) * chunk]
        if not sl:
            break
        units.append({"unit": i + 1, "title": "", "words": sl})
    return units


def units_from_appendix(section: str) -> list[dict]:
    """优先按教材 Unit 1…N 标题切分；失败则均分。"""
    segs = split_section_by_unit_headers(section)
    if len(segs) >= 2:
        units_out: list[dict] = []
        for num, body in segs:
            words = parse_vocab_lines(body)
            if words:
                units_out.append({"unit": num, "title": "", "words": words})
        if units_out:
            return units_out
    flat = parse_vocab_lines(section)
    return words_into_units(flat, n_units=6)


def main() -> int:
    if not DESKTOP.is_dir():
        print(f"缺少文件夹: {DESKTOP}", file=sys.stderr)
        return 1

    out_path = ROOT / "src" / "data" / "renai_junior_words.json"
    preserved: dict[str, dict] = {}
    if out_path.is_file():
        try:
            prev = json.loads(out_path.read_text(encoding="utf-8"))
            for b in prev:
                preserved[b["bookName"]] = b
        except Exception:
            pass

    all_books: list[dict] = []

    for book_name, grade, sem, pdf_name in BOOKS:
        pdf = DESKTOP / pdf_name
        if not pdf.is_file():
            print(f"跳过（文件不存在）: {pdf_name}", file=sys.stderr)
            if book_name in preserved:
                all_books.append(preserved[book_name])
                print(f"保留现有 JSON: {book_name}", file=sys.stderr)
            continue
        try:
            raw_text = pdf_to_text(pdf)
            section = extract_words_in_each_unit_section(raw_text)
            units = units_from_appendix(section)
            n_words = sum(len(u["words"]) for u in units)
            if n_words < 10:
                print(f"警告: {book_name} 解析词条过少 ({n_words})，仍写入。", file=sys.stderr)
            all_books.append(
                {
                    "grade": grade,
                    "sem": sem,
                    "bookName": book_name,
                    "units": units,
                }
            )
            print(f"OK {book_name}: {n_words} 词 → {len(units)} 单元（按教材 Unit 标题）")
        except Exception as e:
            if book_name in preserved:
                all_books.append(preserved[book_name])
                print(f"跳过 PDF {book_name}（{e}），保留现有 JSON", file=sys.stderr)
            else:
                print(f"跳过 {book_name}: {e}", file=sys.stderr)
            continue

    if not all_books:
        print("没有任何可用的初中词汇册数据。", file=sys.stderr)
        return 1

    out_path.write_text(
        json.dumps(all_books, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"写入 {out_path}（共 {len(all_books)} 册）")
    return 0


if __name__ == "__main__":
    sys.exit(main())
