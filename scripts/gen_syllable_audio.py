#!/usr/bin/env python3
"""
Batch generate per-syllable MP3 for all words in pep_words.json + hs_words.json.

Strategy:
  1. Use `espeak-ng -q -x word` to get phoneme mnemonics (e.g. "f'amIli")
  2. Apply MOP syllabification on espeak phonemes
  3. Synthesize each syllable with `espeak-ng [[ mnemonic ]]`

No IPA→SAMPA conversion needed. Works for all words including multi-word phrases.
Output: public/audio/syllables/{word_slug}/{n}.mp3
"""
import json, os, re, subprocess, tempfile, sys

BASE      = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(BASE, 'public', 'audio', 'syllables')
DATA_DIR  = os.path.join(BASE, 'src', 'data')

# ── espeak phoneme tables ─────────────────────────────────────────────────────

# Vowel nuclei in espeak -x notation (longer tokens first for greedy match)
ESPEAK_VOWELS = {
    'i:', 'u:', 'A:', 'O:', '3:',        # long vowels
    'eI', 'aI', 'OI', '@U', 'aU',        # diphthongs
    'I@', 'e@', 'U@', 'A@',              # centering diphthongs
    'I', 'E', '{', 'V', 'Q', 'U',        # short vowels
    '@', 'a', '3', 'i', 'u', '0',        # schwa / open / short
}
# Syllabic consonants count as nuclei
ESPEAK_SYLLABIC = {'L', 'N', 'R'}

# Valid onset clusters (espeak mnemonic consonants)
ONSETS = {
    'pl','pr','tr','dr','kl','kr','gl','gr','fr','fl','br','bl',
    'sl','sm','sn','sp','st','sk','sw','Sr','tS','dZ','tw','dw','kw','gw',
    'mj','bj','pj','fj','vj','kj','gj','nj','lj','tj','dj','sj','hj','rj',
}

def tokenize_espeak(phstr):
    """
    Split an espeak -x phoneme string (e.g. "f'amIli") into
    list of (phoneme, is_vowel_nucleus).
    Strips stress/liaison/variant marks.
    """
    # Strip: stress marks ' and ,
    # liaison/boundary markers #, -, ;
    # digit '2' = espeak level-2 stress marker (NOT a phoneme)
    # Keep '0' (/ɒ/) and '3' (/ɜ/) — these ARE phoneme symbols in espeak -x
    s = re.sub(r"[',;#\-\s]", '', phstr)
    s = s.replace('2', '')   # only remove the level-2 marker
    tokens = []
    i = 0
    # Build sorted list: longest first
    all_phons = sorted(ESPEAK_VOWELS | ESPEAK_SYLLABIC, key=len, reverse=True)
    while i < len(s):
        matched = False
        for ph in all_phons:
            if s[i:].startswith(ph):
                tokens.append((ph, True))
                i += len(ph)
                matched = True
                break
        if not matched:
            # consonant (single char)
            tokens.append((s[i], False))
            i += 1
    return tokens

def syllabify_tokens(tokens):
    """MOP syllabification on a token list."""
    nuclei = [i for i, (_, v) in enumerate(tokens) if v]
    if not nuclei:
        return [''.join(t for t, _ in tokens)] or ['']
    bounds = {0}
    for a, b in zip(nuclei, nuclei[1:]):
        cons = [tokens[i][0] for i in range(a + 1, b)]
        if not cons:
            continue
        split = a + 1
        for n in range(len(cons), 0, -1):
            onset = ''.join(cons[-n:])
            if n == 1 or onset in ONSETS:
                split = b - n
                break
        bounds.add(split)
    bounds = sorted(bounds)
    result = []
    for idx, start in enumerate(bounds):
        end = bounds[idx + 1] if idx + 1 < len(bounds) else len(tokens)
        chunk = ''.join(t for t, _ in tokens[start:end])
        if chunk:
            result.append(chunk)
    return result or [''.join(t for t, _ in tokens)]

def get_syllables(word):
    """
    Return list of espeak mnemonic strings, one per syllable.
    Handles multi-word phrases by processing each word separately.
    """
    result = subprocess.run(
        ['espeak-ng', '-q', '-x', '--', word],
        capture_output=True, text=True)
    phstr = result.stdout.strip()
    if not phstr:
        return None, []

    # espeak separates words with spaces in -x output
    word_parts = phstr.split()
    all_syllables = []
    for part in word_parts:
        tokens = tokenize_espeak(part)
        syls = syllabify_tokens(tokens)
        all_syllables.extend(syls)
    return phstr, all_syllables

def gen_mp3(espeak_mnemonic, out_path):
    """Synthesize one syllable to MP3 via espeak-ng [[mnemonic]] notation."""
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as f:
        wav = f.name
    try:
        subprocess.run(
            ['espeak-ng', '-v', 'en-us', '-s', '130', '-a', '180',
             '-w', wav, f'[[{espeak_mnemonic}]]'],
            check=True, capture_output=True)
        subprocess.run(
            ['ffmpeg', '-y', '-i', wav,
             '-af', 'afade=t=out:st=0.6:d=0.15',
             '-ar', '44100', '-ab', '64k', out_path],
            check=True, capture_output=True)
    finally:
        if os.path.exists(wav):
            os.unlink(wav)

# ── Word collection ───────────────────────────────────────────────────────────

def collect_words():
    """Return list of unique words from pep_words.json + hs_words.json."""
    seen = set()
    words = []
    for fname in ['pep_words.json', 'hs_words.json']:
        path = os.path.join(DATA_DIR, fname)
        if not os.path.exists(path):
            continue
        for book in json.load(open(path, encoding='utf-8')):
            for unit in book.get('units', []):
                for w in unit.get('words', []):
                    word = w['word'].lower().strip()
                    if word not in seen:
                        seen.add(word)
                        words.append(word)
    return words

# ── Main ──────────────────────────────────────────────────────────────────────

def process(word, idx, total):
    tag = f'[{idx}/{total}]'
    slug = word.replace(' ', '_')
    out_dir = os.path.join(AUDIO_DIR, slug)

    phstr, syllables = get_syllables(word)
    if not syllables:
        print(f'{tag} {word} — ✗ espeak gave no output')
        return

    os.makedirs(out_dir, exist_ok=True)
    ok = 0
    for i, syl in enumerate(syllables):
        if not syl.strip():
            continue
        try:
            gen_mp3(syl, os.path.join(out_dir, f'{i}.mp3'))
            ok += 1
        except subprocess.CalledProcessError as e:
            print(f'  WARN {word} syl[{i}]={syl!r}: {e}')

    print(f'{tag} {word} [{phstr}] → {syllables} ({ok} mp3)')

if __name__ == '__main__':
    # Flags: --force  regenerate even if files exist
    #        --check  only show mismatches, no generation
    args = [a for a in sys.argv[1:] if a.startswith('--')]
    nums = [a for a in sys.argv[1:] if not a.startswith('--')]
    force = '--force' in args
    check = '--check' in args

    words = collect_words()
    total = len(words)
    print(f'Total unique words: {total}')

    start = int(nums[0]) if len(nums) > 0 else 0
    end   = int(nums[1]) if len(nums) > 1 else total

    for i, word in enumerate(words[start:end], start=start + 1):
        try:
            slug = word.replace(' ', '_')
            out_dir = os.path.join(AUDIO_DIR, slug)
            _, syls = get_syllables(word)
            expected = len(syls)

            if not force and os.path.isdir(out_dir):
                existing = len([f for f in os.listdir(out_dir) if f.endswith('.mp3')])
                if existing == expected:
                    # skip only if count matches
                    continue
                else:
                    if check:
                        print(f'[{i}/{total}] {word} — mismatch: files={existing} expected={expected}')
                        continue
                    print(f'[{i}/{total}] {word} — mismatch files={existing}→{expected}, regenerating')
                    # remove old files
                    for f in os.listdir(out_dir):
                        if f.endswith('.mp3'):
                            os.unlink(os.path.join(out_dir, f))

            process(word, i, total)
        except Exception as e:
            print(f'  ERROR {word}: {e}')
