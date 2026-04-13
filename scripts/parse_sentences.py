#!/usr/bin/env python3
"""
Extract English sentences + Chinese translations from PEP primary school PDFs.
Uses pdftotext + Gemma 4b (ollama).

Outputs per book: src/data/grade5_down.json, grade6_up.json, grade6_down.json
Format: [{id, en, zh}, ...]   (flat array, same as grade5_up.json)

Run: python3 scripts/parse_sentences.py
Resume-safe: skips already-done output files.
"""
import json, re, os, subprocess, sys, time

DATA_DIR = os.path.join(os.path.dirname(__file__), '../src/data')
BOOK_DIR = os.path.expanduser('~/Desktop/课本')
MODEL    = 'gemma3:4b'

BOOKS = [
    {
        'file':    '义务教育教科书·英语（三年级起点）五年级下册.pdf',
        'out':     'grade5_down.json',
        'units':   6,
        'grade':   '5',
        'sem':     'down',
    },
    {
        'file':    '义务教育教科书·英语（PEP）（三年级起点）六年级上册.pdf',
        'out':     'grade6_up.json',
        'units':   6,
        'grade':   '6',
        'sem':     'up',
    },
    {
        'file':    '义务教育教科书·英语（三年级起点）六年级下册.pdf',
        'out':     'grade6_down.json',
        'units':   4,
        'grade':   '6',
        'sem':     'down',
    },
]

# ── PDF helpers ────────────────────────────────────────────────────────────────
def pdf_to_text(pdf_path):
    r = subprocess.run(['pdftotext', '-layout', pdf_path, '-'], capture_output=True)
    return r.stdout.decode('utf-8', errors='ignore')

# Key section headers that contain real sentences
SECTION_MARKERS = re.compile(
    r"Let[\u2019']?s\s+(?:talk|learn|try|spell|chant|check|read|sing)|"
    r"Read\s+and\s+(?:write|tick|match)|"
    r"Listen\s+and\s+(?:chant|match|number|tick)|"
    r"Role.play|"
    r"Reading\s+time|"
    r"Make\s+a\s+list|"
    r"Story\s+time|"
    r"Self\s+check",
    re.I
)

ORDINALS = {'one':'1','two':'2','three':'3','four':'4','five':'5','six':'6','seven':'7','eight':'8'}
UNIT_HEADER = re.compile(
    r'^\s*(?:Unit\s+(\d+)|Unit\s+(One|Two|Three|Four|Five|Six|Seven|Eight)|Recycle\s+\d+)\b',
    re.I | re.M
)

def normalize_unit_label(label):
    """Normalize 'Unit One' → 'Unit 1' for dedup."""
    def rep(m):
        word = m.group(1).lower()
        return 'Unit ' + ORDINALS.get(word, word)
    return re.sub(r'Unit\s+(One|Two|Three|Four|Five|Six|Seven|Eight)', rep, label, flags=re.I)

def split_by_unit(text, num_units):
    """Split PDF text into per-unit chunks."""
    boundaries = [(m.start(), normalize_unit_label(m.group(0).strip())) for m in UNIT_HEADER.finditer(text)]

    # De-duplicate: for each unit number, keep the SECOND occurrence (skip TOC, avoid appendix)
    # Strategy: collect all, then keep the one that has section markers in its following text
    by_unit = {}
    for pos, label in boundaries:
        key = re.sub(r'\s+', ' ', label.lower())
        if key not in by_unit:
            by_unit[key] = []
        by_unit[key].append((pos, label))

    # For each unit, pick the occurrence whose following text has section markers
    resolved = {}
    for key, occurrences in by_unit.items():
        # Try each occurrence; pick the first one with section content
        chosen = occurrences[-1]  # default: last
        for pos, label in occurrences:
            # Look ahead 3000 chars for section markers
            lookahead = text[pos:pos+3000]
            if SECTION_MARKERS.search(lookahead):
                chosen = (pos, label)
                break
        resolved[key] = chosen

    ordered = sorted(resolved.values(), key=lambda x: x[0])

    chunks = []
    for i, (pos, label) in enumerate(ordered):
        end = ordered[i+1][0] if i+1 < len(ordered) else len(text)
        chunk = text[pos:end]
        # Only keep sections with real sentence content (has section markers)
        if SECTION_MARKERS.search(chunk):
            chunks.append((label, chunk))
    return chunks

def extract_sections(chunk):
    """Pull out text from teaching sections only, skip activity instructions."""
    lines = chunk.splitlines()
    in_section = False
    kept = []
    for line in lines:
        stripped = line.strip()
        if SECTION_MARKERS.match(stripped):
            in_section = True
            continue
        # Stop at student activity prompts / appendix-like lines
        if re.match(r'^(Appendix|Words\s+in|Vocabulary|Songs\s+in|Ask\s+and|Write\s+and|Practise|Look\s+and|Draw\s+and|Work\s+with|rds$|Wo$)', stripped, re.I):
            in_section = False
        if in_section and stripped:
            kept.append(stripped)
    return '\n'.join(kept)

# ── Gemma ─────────────────────────────────────────────────────────────────────
PROMPT = """\
You are processing text from a Chinese primary school English textbook (People's Education Press, PEP).

The text below is extracted from one unit's teaching sections (Let's talk, Let's learn, Reading time, etc.).

Your job:
1. Find every complete English sentence (dialogue lines, reading text, key expressions).
2. For each sentence, provide a natural Chinese translation suitable for elementary students.
3. Skip: single words, headings, page numbers, instructions like "Listen and tick", student activity prompts.
4. Keep: full English sentences with subject+verb (or clear imperative), dialogue exchanges.

Output ONLY a raw JSON array, no markdown fences, no explanation.

Format:
[
  {{"en": "When do you get up?", "zh": "你什么时候起床？"}},
  {{"en": "I often get up at 7 o'clock.", "zh": "我经常在7点起床。"}}
]

Rules:
- en: the exact English sentence as it appears
- zh: natural, accurate Chinese translation
- Preserve all sentences; include both sides of dialogues
- Skip purely Chinese text
- Output ONLY the JSON array

Unit text:
---
{text}
---
"""

def call_gemma(prompt):
    try:
        result = subprocess.run(
            ['ollama', 'run', MODEL, '--nowordwrap'],
            input=prompt.encode('utf-8'),
            capture_output=True,
            timeout=300,
        )
        return result.stdout.decode('utf-8', errors='ignore')
    except subprocess.TimeoutExpired:
        print(" [timeout]", end='', flush=True)
        return ''

def extract_json(text):
    # Strip ANSI escape sequences
    text = re.sub(r'\x1b\[[0-9;]*[A-Za-z]', '', text)
    text = re.sub(r'\x1b\][^\x07]*\x07', '', text)
    # Strip markdown fences
    text = re.sub(r'```(?:json)?\s*', '', text)
    m = re.search(r'\[[\s\S]*\]', text)
    if not m:
        return []
    raw = m.group(0).strip()
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # Fix trailing commas
        raw = re.sub(r',\s*([\]}])', r'\1', raw)
        # Recover partial entries
        entries = re.findall(r'\{[^{}]+\}', raw)
        try:
            return json.loads('[' + ','.join(entries) + ']')
        except:
            return []

def validate(items):
    out = []
    seen_en = set()
    for item in items:
        if not isinstance(item, dict):
            continue
        en = str(item.get('en', '')).strip()
        zh = str(item.get('zh', '')).strip()
        # Must be a real sentence: has a space, not too short/long, not duplicate
        if not en or not zh or len(en) < 5 or len(en) > 300:
            continue
        if ' ' not in en and "'" not in en:
            continue  # single word
        if en in seen_en:
            continue
        seen_en.add(en)
        out.append({'en': en, 'zh': zh})
    return out

# ── Process one book ──────────────────────────────────────────────────────────
MAX_CHUNK = 2000  # chars per Gemma call

def process_book(book):
    pdf_path = os.path.join(BOOK_DIR, book['file'])
    if not os.path.exists(pdf_path):
        print(f"  [MISSING] {book['file']}")
        return None

    print(f"\n{'='*60}")
    print(f"  Grade {book['grade']} {'上' if book['sem']=='up' else '下'}册  →  {book['out']}")

    text   = pdf_to_text(pdf_path)
    chunks = split_by_unit(text, book['units'])
    print(f"  {len(chunks)} unit sections found")

    all_sentences = []
    id_counter = 1

    for unit_label, unit_chunk in chunks:
        section_text = extract_sections(unit_chunk)
        if not section_text.strip():
            print(f"  [{unit_label}] no usable text, skipping")
            continue

        # Split into sub-chunks if large
        sub_chunks = [section_text[i:i+MAX_CHUNK]
                      for i in range(0, len(section_text), MAX_CHUNK)]

        unit_sentences = []
        for si, sub in enumerate(sub_chunks):
            sfx = f" p{si+1}/{len(sub_chunks)}" if len(sub_chunks) > 1 else ""
            print(f"  {unit_label}{sfx}: {len(sub)}c → Gemma...", end='', flush=True)
            prompt   = PROMPT.format(text=sub)
            response = call_gemma(prompt)
            items    = validate(extract_json(response))
            print(f" {len(items)} sentences")
            unit_sentences.extend(items)
            time.sleep(0.3)

        # Add id fields
        for item in unit_sentences:
            item['id'] = id_counter
            id_counter += 1
        all_sentences.extend(unit_sentences)

    print(f"  Total: {len(all_sentences)} sentences")
    return all_sentences

# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    # Check ollama
    r = subprocess.run(['ollama', 'list'], capture_output=True, timeout=5)
    if r.returncode != 0:
        print("ERROR: ollama not available"); sys.exit(1)

    for book in BOOKS:
        out_path = os.path.join(DATA_DIR, book['out'])
        if os.path.exists(out_path):
            existing = json.load(open(out_path, encoding='utf-8'))
            print(f"[skip] {book['out']} already exists ({len(existing)} sentences)")
            continue

        sentences = process_book(book)
        if sentences:
            json.dump(sentences, open(out_path, 'w', encoding='utf-8'),
                      ensure_ascii=False, indent=2)
            print(f"  ✓ saved → {out_path}")

    print("\n✓ All done.")

if __name__ == '__main__':
    main()
