#!/usr/bin/env python3
"""
Parse 单词表 txt/rtf files → pep_words.json entries.
Handles grade5下, grade6上, grade6下.
Run: python3 scripts/parse_small_school.py
"""
import json, re, sys, os

DATA_DIR = os.path.join(os.path.dirname(__file__), '../src/data')
WORDLIST_DIR = os.path.expanduser('~/Desktop/单词表')
PEP_FILE = os.path.join(DATA_DIR, 'pep_words.json')

# ── RTF decoder ──────────────────────────────────────────────────────────────
def rtf_to_text(rtf_bytes):
    r"""Strip RTF markup, decode \uNNNN? sequences to plain text."""
    text = rtf_bytes.decode('latin-1', errors='replace')
    # \uNNNN? → Unicode char
    def repl_u(m):
        n = int(m.group(1))
        if n < 0: n += 65536
        return chr(n)
    text = re.sub(r'\\u(-?\d+)\?', repl_u, text)
    # Remove RTF control words and groups
    text = re.sub(r'\\\w+(?:\s|-?\d+)?', ' ', text)
    text = re.sub(r'[{}]', '', text)
    # Clean up whitespace
    text = re.sub(r'\r\n|\r', '\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

# ── Word line parser ─────────────────────────────────────────────────────────
# Format: "word phrase /ipa/ chinese" or "word /ipa/ chinese"
WORD_LINE = re.compile(
    r'^(.+?)\s+(/[^/]+/)\s+(.+)$'
)

def parse_word_line(line):
    line = line.strip()
    if not line:
        return None
    m = WORD_LINE.match(line)
    if not m:
        return None
    word, ipa, zh = m.group(1).strip(), m.group(2).strip(), m.group(3).strip()
    # Skip lines that look like unit headers or garbage
    if re.match(r'^(Unit|第|uni)', word, re.I):
        return None
    return {"word": word, "ipa": ipa, "zh": zh}

# ── Parse txt/rtf into units list ────────────────────────────────────────────
def parse_wordlist_text(text):
    """Return list of {unit: N, title:'', words:[...]}"""
    # Split on "Unit N" boundaries (first segment is book title, skip it)
    parts = re.split(r'\bUnit\s+(\d+)\b', text, flags=re.I)
    # parts = [pre_text, '1', unit1_body, '2', unit2_body, ...]
    units = []
    for i in range(1, len(parts) - 1, 2):
        unit_num = int(parts[i])
        body = parts[i + 1]
        words = []
        for line in body.splitlines():
            w = parse_word_line(line)
            if w:
                words.append(w)
        if words:
            units.append({"unit": unit_num, "title": "", "words": words})
    return units

# ── Book definitions ─────────────────────────────────────────────────────────
BOOKS = [
    {
        "grade": 5, "sem": "down", "bookName": "五年级下册",
        "file": "单词表5下.txt", "encoding": "utf-8", "is_rtf": False,
    },
    {
        "grade": 6, "sem": "up", "bookName": "六年级上册",
        "file": "单词表6上.rtf", "encoding": None, "is_rtf": True,
    },
    {
        "grade": 6, "sem": "down", "bookName": "六年级下册",
        "file": "单词表6下.txt", "encoding": "utf-8", "is_rtf": False,
    },
]

# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    with open(PEP_FILE, 'r', encoding='utf-8') as f:
        pep = json.load(f)

    existing_books = {(b['grade'], b['sem']) for b in pep}
    added = 0

    for book in BOOKS:
        key = (book['grade'], book['sem'])
        if key in existing_books:
            print(f"[skip] {book['bookName']} already in pep_words.json")
            continue

        fpath = os.path.join(WORDLIST_DIR, book['file'])
        if not os.path.exists(fpath):
            print(f"[missing] {fpath}")
            continue

        raw = open(fpath, 'rb').read()
        if book['is_rtf']:
            text = rtf_to_text(raw)
        else:
            text = raw.decode(book['encoding'])

        units = parse_wordlist_text(text)
        total_words = sum(len(u['words']) for u in units)
        print(f"[parsed] {book['bookName']}: {len(units)} units, {total_words} words")

        entry = {
            "grade": book['grade'],
            "sem": book['sem'],
            "bookName": book['bookName'],
            "units": units,
        }
        pep.append(entry)
        added += 1

    if added:
        with open(PEP_FILE, 'w', encoding='utf-8') as f:
            json.dump(pep, f, ensure_ascii=False, indent=2)
        print(f"\n✓ Wrote {added} new books to pep_words.json")
    else:
        print("\nNothing to add.")

if __name__ == '__main__':
    main()
