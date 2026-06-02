#!/usr/bin/env python3
"""
Normalize IPA strings in vocab JSON used by the「单词」tab.

仁爱 PDF → JSON：增补平面私用区占位符、拉丁字母 I 误代 ɪ / aɪ / eɪ 等。
PEP：仅做空音标与字符体检（不做批量改写）。

用法：
  python3 scripts/fix_vocab_ipa.py [--write]

默认 dry-run，仅打印统计；加 --write 写回文件。
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REN_PATH = ROOT / "src" / "data" / "renai_junior_words.json"
PEP_PATH = ROOT / "src" / "data" / "pep_words.json"
BSDA_PATH = ROOT / "src" / "data" / "bsda_words.json"

# 仁爱教材 PDF 映射到 IPA 的占位符（Supplementary Private Use Area）
C77 = "\U00100c77"
C79 = "\U00100c79"
C7A = "\U00100c7a"
C7B = "\U00100c7b"


def strip_category_co(s: str) -> str:
    """去掉仍为 Co（私用）类别的字符。"""
    return "".join(c for c in s if unicodedata.category(c) != "Co")


def replace_renai_pua(ipa: str) -> str:
    """按上下文把 PDF 占位符替换为标准 IPA。"""
    s = ipa
    # 双写优先（教材排版多为双字映射一个音位）
    s = s.replace(C77 + C77 + "ː", "ɑː")
    s = s.replace(C79 + C79, "ɡ")
    s = s.replace(C7A + C7A, "θ")
    s = s.replace(C7B + C7B, "ŋ")
    # 折行等原因残留的单字符
    s = s.replace(C77 + "ː", "ɑː")
    s = re.sub(C77 + "+", "ɑ", s)
    s = re.sub(C79 + "+", "ɡ", s)
    s = re.sub(C7A + "+", "θ", s)
    s = re.sub(C7B + "+", "ŋ", s)
    return s


def fix_latin_i_in_body(body: str) -> str:
    """
    PDF 转文本时常把 ɪ/aɪ/eɪ 打成拉丁 I。
    仅在音标内部（已去掉两侧 /）操作。
    """
    s = body
    # PRICE / FACE 等双元音（第二成分误为 I）
    s = re.sub(r"aI(?=[bcdfghjklmnpqrstvwzxθðʃŋʒ]|$)", "aɪ", s)
    s = re.sub(r"eI(?=[bcdfghjklmnpqrstvwzxθðʃŋʒ]|$)", "eɪ", s)
    s = re.sub(r"oI(?=[bcdfghjklmnpqrstvwzxθðʃŋʒ]|$)", "ɔɪ", s)
    # 剩余大写 I → ɪ（教材不使用 ASCII I 作为合法 IPA）
    s = s.replace("I", "ɪ")
    return s


def normalize_ipa(ipa: str) -> str:
    raw = ipa.strip()
    if not raw:
        return raw
    if not raw.startswith("/"):
        raw = "/" + raw
    if not raw.endswith("/"):
        raw = raw + "/"
    body = raw[1:-1]
    body = unicodedata.normalize("NFKC", body)
    body = replace_renai_pua(body)
    body = strip_category_co(body)
    body = re.sub(r"\s+", "", body)
    body = fix_latin_i_in_body(body)
    return f"/{body}/"


# 机械替换后仍明显不符的常见词（英式课堂发音为主）
REN_MANUAL_IPA: dict[str, str] = {
    # progress：破损串曾解析成 prɑːɡres；教材多用 əʊ
    "progress": "/ˈprəʊɡres/",
}

# PEP 多词短语历史上留空音标，补英式课堂常用标注（仅针对 audit 发现的条目）
PEP_PHRASE_IPA: dict[str, str] = {
    "get up": "/ˈɡet ʌp/",
    "go home": "/ɡəʊ ˈhəʊm/",
    "watch TV": "/wɒtʃ ˌtiːˈviː/",
    "do homework": "/duː ˈhəʊmwɜːk/",
    "read books": "/riːd bʊks/",
    "play football": "/pleɪ ˈfʊtbɔːl/",
    "play sports": "/pleɪ spɔːts/",
    "draw cartoons": "/drɔː kɑːˈtuːnz/",
    "play basketball": "/pleɪ ˈbɑːskɪtbɔːl/",
    "speak English": "/spiːk ˈɪŋɡlɪʃ/",
    "no problem": "/nəʊ ˈprɒbləm/",
    "water bottle": "/ˈwɔːtə ˈbɒtl/",
    "lots of": "/lɒts əv/",
    "go boating": "/ɡəʊ ˈbəʊtɪŋ/",
}


def fill_pep_empty_ipa(data: list[dict]) -> int:
    n = 0
    for book in data:
        for unit in book["units"]:
            for w in unit["words"]:
                if (w.get("ipa") or "").strip():
                    continue
                phrase = w["word"]
                if phrase in PEP_PHRASE_IPA:
                    w["ipa"] = PEP_PHRASE_IPA[phrase]
                    n += 1
    return n


def process_renai(data: list[dict], apply_manual: bool = True) -> tuple[int, int, list[str]]:
    changed = 0
    total = 0
    notes: list[str] = []
    for book in data:
        for unit in book["units"]:
            for w in unit["words"]:
                total += 1
                old = w.get("ipa") or ""
                new = normalize_ipa(old)
                if apply_manual and w["word"] in REN_MANUAL_IPA:
                    new = REN_MANUAL_IPA[w["word"]]
                if new != old:
                    changed += 1
                w["ipa"] = new
                # 复检：不应再含私用区或拉丁 I
                inner = new[1:-1] if new.startswith("/") else new
                if "I" in inner:
                    notes.append(f"latin-I remains: {book['bookName']} | {w['word']} | {new}")
                if any(unicodedata.category(c) == "Co" for c in new):
                    notes.append(f"Co remains: {book['bookName']} | {w['word']} | {new}")
    return changed, total, notes


def audit_pep(data: list[dict]) -> tuple[list[str], list[str]]:
    """返回 (空音标列表, 可疑音标列表)。"""
    empty: list[str] = []
    suspicious: list[str] = []
    for book in data:
        for unit in book["units"]:
            for w in unit["words"]:
                ipa = (w.get("ipa") or "").strip()
                if not ipa:
                    empty.append(f"{book['bookName']} u{unit['unit']} {w['word']}")
                    continue
                inner = ipa[1:-1] if ipa.startswith("/") and ipa.endswith("/") else ipa
                if "I" in inner or any(unicodedata.category(c) == "Co" for c in ipa):
                    suspicious.append(f"{book['bookName']} | {w['word']} | {ipa}")
                # 粗检：仍含裸 ASCII 元音字母 aeiou 极少见于规范 IPA（多为录入错误）
    return empty, suspicious


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true", help="写回 JSON 文件")
    ap.add_argument("--bsda", action="store_true", help="同时处理北师大 bsda_words.json")
    args = ap.parse_args()

    ren = json.loads(REN_PATH.read_text(encoding="utf-8"))
    changed, total, notes = process_renai(ren)
    print(f"仁爱: {changed}/{total} 条 ipa 已规范化")
    if notes:
        print(f"仁爱 复检疑点 {len(notes)}（请人工扫一眼）:")
        for line in notes[:40]:
            print(" ", line)
        if len(notes) > 40:
            print(f"  … 另有 {len(notes) - 40} 条")

    pep = json.loads(PEP_PATH.read_text(encoding="utf-8"))
    pep_filled = fill_pep_empty_ipa(pep)
    empty, suspicious = audit_pep(pep)
    print(f"PEP: 已补全音标 {pep_filled}；剩余空音标 {len(empty)}，可疑 {len(suspicious)}")
    if empty[:15]:
        for line in empty[:15]:
            print("  empty:", line)
    if suspicious[:15]:
        for line in suspicious[:15]:
            print("  suspicious:", line)

    if args.bsda and BSDA_PATH.is_file():
        bsda = json.loads(BSDA_PATH.read_text(encoding="utf-8"))
        b_changed, b_total, b_notes = process_renai(bsda)
        print(f"北师大: {b_changed}/{b_total} 条 ipa 已规范化")
        if b_notes:
            print(f"北师大 复检疑点 {len(b_notes)}（请人工扫一眼）:")
            for line in b_notes[:20]:
                print(" ", line)
        if args.write:
            BSDA_PATH.write_text(
                json.dumps(bsda, ensure_ascii=False, indent=2), encoding="utf-8"
            )
            print(f"已写入 {BSDA_PATH}")

    if args.write:
        REN_PATH.write_text(json.dumps(ren, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"已写入 {REN_PATH}")
        PEP_PATH.write_text(json.dumps(pep, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"已写入 {PEP_PATH}")
    else:
        print("（dry-run：未写文件，确认无误后加 --write）")
    return 0


if __name__ == "__main__":
    sys.exit(main())
