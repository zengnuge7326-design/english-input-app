#!/usr/bin/env python3
"""
从桌面「北师大版高中英语」DOCX 提取书后「VOCABULARY IN EACH UNIT」单词表。

PDF 为扫描版无法 pdftotext；DOCX 由教材转存，附录词汇可解析。

用法:
  python3 scripts/build-bsda-vocab.py

输出:
  src/data/bsda_words.json

建议随后运行（北师大音标同样含拉丁 I 等乱码）:
  python3 scripts/fix_vocab_ipa.py --write --bsda
"""
from __future__ import annotations

import json
import re
import sys
import unicodedata
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DESKTOP = Path.home() / "Desktop" / "北师大版高中英语"
OUT_PATH = ROOT / "src" / "data" / "bsda_words.json"

BOOKS = [
    ("必修第一册（北师大版）", "b1", "普通高中教科书·英语必修 第一册.docx"),
    ("必修第二册（北师大版）", "b2", "普通高中教科书·英语必修 第二册.docx"),
    ("必修第三册（北师大版）", "b3", "普通高中教科书·英语必修 第三册.docx"),
    ("选择性必修第一册（北师大版）", "s1", "普通高中教科书·英语选择性必修 第一册.docx"),
    ("选择性必修第二册（北师大版）", "s2", "普通高中教科书·英语选择性必修 第二册.docx"),
    ("选择性必修第三册（北师大版）", "s3", "普通高中教科书·英语选择性必修 第三册.docx"),
    ("选择性必修第四册（北师大版）", "s4", "普通高中教科书·英语选择性必修 第四册.docx"),
]

POS_RE = re.compile(
    r"^\s*("
    r"n\.|v\.|vi\.|vt\.|adj\.|adv\.|prep\.|conj\.|pron\.|det\.|art\.|"
    r"modal\s*v\.|abbr\.|num\.|excl\.|a\.|ad\.|int\."
    r")\s*",
    re.I,
)

CHUNK_SPLIT_RE = re.compile(
    r"\s+(?=[\*＊]?[A-Za-z][A-Za-z'\-]*(?:\s+[a-z][a-z'\-]*)*\s*/)",
    re.I,
)
SINGLE_RE = re.compile(
    r"^[\*＊]?\s*(?P<word>[A-Za-z][A-Za-z'\-]*(?:\s+[a-z][a-z'\-]*)*)\s*/\s*(?P<tail>.+)$",
    re.I,
)
POS_INLINE_RE = re.compile(
    r"\s+(?:n\.|v\.|vi\.|vt\.|adj\.|adv\.|prep\.|conj\.|pron\.|det\.|art\.|modal\s*v\.)",
    re.I,
)

UNIT_HDR_RE = re.compile(r"^UNIT\s+(\d+)\b", re.I)
SECTION_SKIP_RE = re.compile(
    r"^(Topic\s+Talk|Lesson\s+\d+|TAPESCRIPTS|CHECK\s+YOUR|WORKBOOK)\b",
    re.I,
)


def nfkc(s: str) -> str:
    return unicodedata.normalize("NFKC", s)


def strip_pua(s: str) -> str:
    return "".join(c for c in s if not (0xE000 <= ord(c) <= 0xF8FF))


def docx_paras(path: Path) -> list[str]:
    with zipfile.ZipFile(path) as z:
        root = ET.fromstring(z.read("word/document.xml"))
    ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
    out: list[str] = []
    for p in root.findall(".//w:p", ns):
        texts = [t.text or "" for t in p.findall(".//w:t", ns)]
        if texts:
            out.append(nfkc("".join(texts)))
    return out


def find_vocab_range(paras: list[str]) -> tuple[int, int]:
    start = -1
    for i, p in enumerate(paras):
        if p.strip().upper() == "VOCABULARY IN EACH UNIT":
            start = i
            break
    if start < 0:
        raise ValueError("未找到 VOCABULARY IN EACH UNIT")
    end = len(paras)
    for i in range(start + 80, len(paras)):
        if re.fullmatch(r"[A-Z]", paras[i].strip()):
            nxt = paras[i + 1].strip() if i + 1 < len(paras) else ""
            if nxt and re.match(r"^[\*＊]?[a-z]", nxt, re.I) and "/" in nxt:
                if not UNIT_HDR_RE.match(nxt):
                    end = i
                    break
    return start, end


def clean_zh(rest: str) -> str:
    zh = strip_pua(rest).strip()
    zh = re.sub(r"\s*/[^/]+/\s*", " ", zh)
    zh = POS_RE.sub("", zh)
    for _ in range(5):
        zh = re.sub(
            r"^(pron\.|det\.|conj\.|prep\.|adj\.|adv\.|modal\s*v\.|abbr\.|num\.|art\.|v\.|n\.|vi\.|vt\.)\s*,?\s*",
            "",
            zh,
            flags=re.I,
        )
    zh = re.sub(r"\([（]?\s*\d+\s*[）)]?\s*$", "", zh)
    zh = re.sub(r"\s+", " ", zh).strip(" ，；:：;")
    m = re.search(r"[\u4e00-\u9fff]", zh)
    if m:
        zh = zh[m.start() :].strip()
    return zh or "—"


def split_ipa_rest(tail: str) -> tuple[str, str]:
    """从 tail 中分出音标片段与释义剩余。"""
    tail = tail.strip()
    if not tail:
        return "", ""
    zh_i = re.search(r"[\u4e00-\u9fff]", tail)
    pm = POS_INLINE_RE.search(tail)
    cut = len(tail)
    if zh_i:
        cut = min(cut, zh_i.start())
    if pm:
        cut = min(cut, pm.start())
    ipa_raw = re.sub(r"\s+", "", tail[:cut].strip())
    rest = tail[cut:]
    return ipa_raw, rest


def parse_single_chunk(chunk: str) -> dict | None:
    chunk = strip_pua(chunk).strip()
    m = SINGLE_RE.match(chunk)
    if not m:
        return None
    word = m.group("word").strip()
    tail = m.group("tail").strip()
    if tail.endswith("/") and tail.count("/") == 1:
        tail = tail[:-1]
    ipa_raw, rest = split_ipa_rest(tail)
    zh = clean_zh(rest)
    if not word or len(word) > 56:
        return None
    return {"word": word, "ipa": f"/{ipa_raw}/" if ipa_raw else "", "zh": zh}


def parse_entries_from_line(line: str) -> list[dict]:
    line = strip_pua(line).strip()
    if not line or SECTION_SKIP_RE.match(line):
        return []
    if UNIT_HDR_RE.match(line) and len(line) < 80:
        return []
    if "/" not in line:
        return []
    chunks = CHUNK_SPLIT_RE.split(line)
    entries: list[dict] = []
    for chunk in chunks:
        e = parse_single_chunk(chunk)
        if e:
            entries.append(e)
    return entries


def merge_continuation(prev: dict, line: str) -> dict:
    line = strip_pua(line).strip()
    if not line or parse_entries_from_line(line):
        return prev
    if not re.search(r"[\u4e00-\u9fff]", line):
        return prev
    zh_extra = clean_zh(line)
    if zh_extra and zh_extra != "—":
        if prev["zh"] == "—" or not re.search(r"[\u4e00-\u9fff]", prev["zh"]):
            prev["zh"] = zh_extra
        elif zh_extra not in prev["zh"]:
            prev["zh"] = (prev["zh"] + "；" + zh_extra).strip()
    return prev


def parse_vocab_paras(paras: list[str]) -> list[dict]:
    start, end = find_vocab_range(paras)
    units_out: list[dict] = []
    current_unit: dict | None = None
    current_lesson = ""
    pending: dict | None = None

    def flush_pending():
        nonlocal pending
        if pending and current_unit is not None:
            current_unit["words"].append(pending)
            pending = None

    def start_unit(num: int, title: str):
        nonlocal current_unit, current_lesson, pending
        flush_pending()
        if current_unit and current_unit["words"]:
            units_out.append(current_unit)
        current_unit = {
            "unit": num,
            "title": title.strip(),
            "words": [],
        }
        current_lesson = ""

    seen_unit_line = False

    for i in range(start + 1, end):
        line = paras[i].strip()
        if not line:
            continue

        um = UNIT_HDR_RE.match(line)
        if um and len(line) < 120:
            num = int(um.group(1))
            title = re.sub(r"^UNIT\s+\d+\s*", "", line, flags=re.I).strip()
            title = re.sub(r"\s{2,}.*$", "", title).strip()
            if seen_unit_line and i > 0 and UNIT_HDR_RE.match(paras[i - 1].strip() or ""):
                continue
            seen_unit_line = True
            start_unit(num, title or f"Unit {num}")
            continue

        if current_unit is None:
            continue

        if SECTION_SKIP_RE.match(line):
            flush_pending()
            if line.lower().startswith("lesson"):
                current_lesson = line
            continue

        if re.match(r"^UNIT\s+\d+", line, re.I):
            continue

        entries = parse_entries_from_line(line)
        if entries:
            flush_pending()
            for e in entries:
                current_unit["words"].append(e)
            pending = None
        elif pending is not None:
            pending = merge_continuation(pending, line)
        elif current_unit["words"] and not re.search(r"[\u4e00-\u9fff]", current_unit["words"][-1]["zh"]):
            merge_continuation(current_unit["words"][-1], line)

    flush_pending()
    if current_unit and current_unit["words"]:
        units_out.append(current_unit)

    # dedupe words within unit (docx sometimes duplicates headers)
    for u in units_out:
        seen: set[str] = set()
        deduped: list[dict] = []
        for w in u["words"]:
            key = w["word"].lower()
            if key in seen:
                continue
            seen.add(key)
            deduped.append(w)
        u["words"] = deduped

    return units_out


def main() -> int:
    if not DESKTOP.is_dir():
        print(f"缺少文件夹: {DESKTOP}", file=sys.stderr)
        return 1

    preserved: dict[str, dict] = {}
    if OUT_PATH.is_file():
        try:
            for b in json.loads(OUT_PATH.read_text(encoding="utf-8")):
                preserved[b["bookName"]] = b
        except Exception:
            pass

    all_books: list[dict] = []

    for book_name, sem, docx_name in BOOKS:
        docx = DESKTOP / docx_name
        if not docx.is_file():
            print(f"跳过（文件不存在）: {docx_name}", file=sys.stderr)
            if book_name in preserved:
                all_books.append(preserved[book_name])
            continue
        try:
            paras = docx_paras(docx)
            units = parse_vocab_paras(paras)
            n_words = sum(len(u["words"]) for u in units)
            if n_words < 20:
                print(f"警告: {book_name} 仅解析 {n_words} 词", file=sys.stderr)
            all_books.append(
                {
                    "grade": "高中",
                    "sem": sem,
                    "bookName": book_name,
                    "units": units,
                }
            )
            print(f"OK {book_name}: {n_words} 词 → {len(units)} 单元")
        except Exception as e:
            if book_name in preserved:
                all_books.append(preserved[book_name])
                print(f"跳过 {book_name}（{e}），保留现有 JSON", file=sys.stderr)
            else:
                print(f"跳过 {book_name}: {e}", file=sys.stderr)

    if not all_books:
        print("没有任何北师大词汇数据。", file=sys.stderr)
        return 1

    OUT_PATH.write_text(
        json.dumps(all_books, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"写入 {OUT_PATH}（共 {len(all_books)} 册）")
    return 0


if __name__ == "__main__":
    sys.exit(main())
