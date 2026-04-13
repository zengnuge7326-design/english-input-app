#!/usr/bin/env python3
"""
Extract high school English textbook word lists from PDFs using pdftotext + Gemma 4b (ollama).
Outputs: src/data/hs_words.json

Run: python3 scripts/parse_high_school.py
Resume-safe: skips already-processed books on re-run.
"""
import json, re, os, subprocess, sys, time

DATA_DIR = os.path.join(os.path.dirname(__file__), '../src/data')
BOOK_DIR  = os.path.expanduser('~/Desktop/课本')
OUT_FILE  = os.path.join(DATA_DIR, 'hs_words.json')
MODEL     = 'gemma3:4b'

BOOKS = [
    {'file': '普通高中教科书·英语必修 第一册.pdf',      'bookName': '必修第一册',     'sem': 'required1', 'units': 5},
    {'file': '普通高中教科书·英语必修 第二册.pdf',      'bookName': '必修第二册',     'sem': 'required2', 'units': 5},
    {'file': '普通高中教科书·英语必修 第三册.pdf',      'bookName': '必修第三册',     'sem': 'required3', 'units': 5},
    {'file': '普通高中教科书·英语选择性必修 第一册.pdf', 'bookName': '选择性必修第一册', 'sem': 'optional1', 'units': 4},
    {'file': '普通高中教科书·英语选择性必修 第二册.pdf', 'bookName': '选择性必修第二册', 'sem': 'optional2', 'units': 4},
    {'file': '普通高中教科书·英语选择性必修 第三册.pdf', 'bookName': '选择性必修第三册', 'sem': 'optional3', 'units': 4},
    {'file': '普通高中教科书·英语选择性必修 第四册.pdf', 'bookName': '选择性必修第四册', 'sem': 'optional4', 'units': 4},
]

# ── PDF extraction ────────────────────────────────────────────────────────────
def pdf_to_text(pdf_path):
    r = subprocess.run(['pdftotext', '-layout', pdf_path, '-'], capture_output=True)
    return r.stdout.decode('utf-8', errors='ignore')

def find_wordlist_section(text):
    """
    The real word list appears at the SECOND occurrence of the header.
    The first is the table of contents entry.
    The section ends at 'Vocabulary' (alpha index) or 'Irregular Verbs'.
    """
    marker = 'Words and Expressions in Each Unit'
    first  = text.find(marker)
    second = text.find(marker, first + 1) if first >= 0 else -1
    start  = second if second >= 0 else (first if first >= 0 else 0)

    # Find end of word list section
    section = text[start:]
    end_markers = ['Irregular Verbs', 'Vocabulary\n', 'VOCABULARY\n', '不规则动词']
    end = len(section)
    for em in end_markers:
        idx = section.find(em, 200)  # skip the header itself
        if 0 < idx < end:
            end = idx
    return section[:end]

def split_into_unit_chunks(section, num_units):
    """Split word list section into per-unit text chunks."""
    # Match "Welcome Unit", "Unit 1" ... "Unit N"
    pat = re.compile(r'\b(Welcome\s+Unit|Unit\s+\d+)\b', re.I)
    boundaries = [(m.start(), m.group(0)) for m in pat.finditer(section)]

    # Keep only unique, in-range labels
    seen, kept = set(), []
    for pos, label in boundaries:
        key = re.sub(r'\s+', ' ', label.strip().lower())
        if key not in seen:
            seen.add(key)
            kept.append((pos, label))

    if len(kept) < 2:
        return [('All', section)]

    chunks = []
    for i, (pos, label) in enumerate(kept):
        end = kept[i+1][0] if i+1 < len(kept) else len(section)
        chunks.append((label.strip(), section[pos:end]))
    return chunks

# ── Gemma via ollama CLI ──────────────────────────────────────────────────────
PROMPT = """\
You are extracting vocabulary from a Chinese high school English textbook word list.

The text was extracted via pdftotext and the IPA phonetics are CORRUPTED (wrong characters).
Ignore the garbled IPA in the text — generate correct standard IPA yourself for each word.

Extract every English word/phrase and its Chinese meaning. Output ONLY a raw JSON array, no explanation, no markdown fences.

Format:
[
  {{"word": "exchange", "ipa": "/ɪksˈtʃeɪndʒ/", "zh": "交换；交流"}},
  {{"word": "look forward to", "ipa": "/lʊk ˈfɔːwəd tə/", "zh": "盼望；期待"}}
]

Rules:
- word: exact English word or phrase
- ipa: YOUR generated standard IPA in /slashes/
- zh: Chinese definition only (no English pos labels like n./vt./adj.)
- Include derived forms and collocations that appear as separate entries
- Skip: headings, page numbers, proper nouns (names/countries)
- Output ONLY the JSON array

Text ({unit_label}):
---
{chunk}
---
"""

def call_gemma(prompt):
    try:
        result = subprocess.run(
            ['ollama', 'run', MODEL, '--nowordwrap'],
            input=prompt.encode('utf-8'),
            capture_output=True,
            timeout=240,
        )
        return result.stdout.decode('utf-8', errors='ignore')
    except subprocess.TimeoutExpired:
        print(" [timeout]", end='')
        return ''

def extract_json(text):
    # Strip ANSI escape sequences (color, cursor, etc.)
    text = re.sub(r'\x1b\[[0-9;]*[A-Za-z]', '', text)
    text = re.sub(r'\x1b\][^\x07]*\x07', '', text)
    # Strip markdown code fences
    text = re.sub(r'```(?:json)?\s*', '', text)
    # Fix unquoted IPA values: "ipa": /xxx/ → "ipa": "/xxx/"
    text = re.sub(r'("ipa"\s*:\s*)(/[^,}\n"]+/)', r'\1"\2"', text)
    # Find JSON array
    m = re.search(r'\[[\s\S]*\]', text)
    if not m:
        return []
    raw = m.group(0).strip()
    # Try to parse
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # Fix trailing commas
        raw = re.sub(r',\s*([\]}])', r'\1', raw)
        if not raw.rstrip().endswith(']'):
            # Truncated — recover complete entries
            entries = re.findall(r'\{[^{}]+\}', raw)
            try:
                return json.loads('[' + ','.join(entries) + ']')
            except:
                return []
        try:
            return json.loads(raw)
        except:
            return []

def validate(words):
    out = []
    for w in words:
        if not isinstance(w, dict):
            continue
        word = str(w.get('word', '')).strip()
        zh   = str(w.get('zh',   '')).strip()
        ipa  = str(w.get('ipa',  '')).strip()
        if not word or not zh or len(word) > 80:
            continue
        out.append({"word": word, "ipa": ipa, "zh": zh})
    return out

# ── Process one book ──────────────────────────────────────────────────────────
def process_book(book):
    pdf_path = os.path.join(BOOK_DIR, book['file'])
    if not os.path.exists(pdf_path):
        print(f"  [MISSING] {book['file']}")
        return None

    print(f"\n{'='*60}")
    print(f"  {book['bookName']}")
    text    = pdf_to_text(pdf_path)
    section = find_wordlist_section(text)
    chunks  = split_into_unit_chunks(section, book['units'])
    print(f"  {len(chunks)} unit chunks found")

    MAX_CHUNK = 2500  # chars — keeps Gemma response fast and reliable

    units = []
    for label, chunk in chunks:
        unit_num = 0 if 'welcome' in label.lower() else int(re.search(r'\d+', label).group())

        # Skip header noise at start of Welcome Unit chunk
        if 'welcome' in label.lower():
            # Advance past any non-word lines (headers, notes)
            lines = chunk.splitlines()
            start = 0
            for i, line in enumerate(lines):
                if re.search(r'[a-z]{3,}\s+/[^\n/]+/', line) or re.search(r'[a-z]{4,}', line):
                    start = i
                    break
            chunk = '\n'.join(lines[start:])

        # Split large chunks into sub-chunks
        sub_chunks = [chunk[i:i+MAX_CHUNK] for i in range(0, len(chunk), MAX_CHUNK)]
        all_words = []

        for si, sub in enumerate(sub_chunks):
            suffix = f" part {si+1}/{len(sub_chunks)}" if len(sub_chunks) > 1 else ""
            print(f"  {label}{suffix}: {len(sub)} chars → Gemma...", end='', flush=True)
            prompt   = PROMPT.format(unit_label=label, chunk=sub)
            response = call_gemma(prompt)
            words    = validate(extract_json(response))
            print(f" {len(words)} words")
            all_words.extend(words)
            time.sleep(0.3)

        if all_words:
            units.append({"unit": unit_num, "title": label, "words": all_words})

    return {
        "grade":    "高中",
        "sem":      book['sem'],
        "bookName": book['bookName'],
        "units":    units,
    }

# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    # Verify ollama is available
    r = subprocess.run(['ollama', 'list'], capture_output=True, timeout=5)
    if r.returncode != 0:
        print("ERROR: ollama not available"); sys.exit(1)
    if MODEL.split(':')[0] not in r.stdout.decode():
        print(f"ERROR: model {MODEL} not found. Run: ollama pull {MODEL}"); sys.exit(1)

    # Load existing results (resume support)
    results = []
    done_sems = set()
    if os.path.exists(OUT_FILE):
        results    = json.load(open(OUT_FILE, encoding='utf-8'))
        done_sems  = {b['sem'] for b in results}
        print(f"Resuming — already done: {done_sems}")

    for book in BOOKS:
        if book['sem'] in done_sems:
            print(f"[skip] {book['bookName']}")
            continue
        entry = process_book(book)
        if entry:
            results.append(entry)
            json.dump(results, open(OUT_FILE, 'w', encoding='utf-8'),
                      ensure_ascii=False, indent=2)
            print(f"  ✓ saved {book['bookName']}")

    total = sum(len(b['units']) for b in results)
    print(f"\n✓ Done. {len(results)} books, {total} units → {OUT_FILE}")

if __name__ == '__main__':
    main()
