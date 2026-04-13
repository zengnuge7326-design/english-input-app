#!/usr/bin/env python3
"""
Scrape Collins for IPA, syllabify via MOP, generate per-syllable MP3.
Usage: python3 scrape_collins.py word1 word2 ...
"""
import sys, os, re, json, subprocess, tempfile

AUDIO_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio', 'syllables')

IPA_XSAMPA = {
    'tʃ':'tS','dʒ':'dZ',
    'iː':'i:','uː':'u:','ɑː':'A:','ɔː':'O:','ɜː':'3:',
    'eɪ':'eI','aɪ':'aI','ɔɪ':'OI','əʊ':'@U','aʊ':'aU',
    'ɪə':'I@','eə':'e@','ʊə':'U@',
    'p':'p','b':'b','t':'t','d':'d','k':'k','ɡ':'g','g':'g',
    'f':'f','v':'v','s':'s','z':'z','θ':'T','ð':'D',
    'ʃ':'S','ʒ':'Z','h':'h','m':'m','n':'n','ŋ':'N',
    'l':'l','r':'r','w':'w','j':'j',
    'æ':'{','e':'e','ɪ':'I','ɒ':'Q','ʌ':'V','ʊ':'U','ə':'@',
    'i':'i','u':'u','y':'j',  # Collins uses 'y' for /j/
}
PHONEMES_SORTED = sorted(IPA_XSAMPA.keys(), key=len, reverse=True)
VOWELS = {'æ','e','ɪ','ɒ','ʌ','ʊ','ə','i','u',
          'iː','uː','ɑː','ɔː','ɜː','eɪ','aɪ','ɔɪ','əʊ','aʊ','ɪə','eə','ʊə'}
# Valid English onset clusters (for MOP), including C+glide
ONSETS = {'pl','pr','tr','dr','kl','kr','gl','gr','fr','fl','br','bl','sl','sm','sn',
          'sp','st','sk','sw','θr','ʃr','tʃ','dʒ','tw','dw','kw','gw',
          'mj','bj','pj','fj','vj','kj','gj','nj','lj','tj','dj','sj','hj','rj'}

def tokenize(ipa):
    """Tokenize IPA into (phoneme, is_vowel) list, stripping all markers."""
    s = re.sub(r'[/\\ˈˌ·.\s]', '', ipa)
    tokens = []
    i = 0
    while i < len(s):
        matched = False
        for ph in PHONEMES_SORTED:
            if s[i:].startswith(ph):
                tokens.append((ph, ph in VOWELS))
                i += len(ph)
                matched = True
                break
        if not matched:
            i += 1
    return tokens

def syllabify(ipa):
    """Split IPA into syllables using pure MOP (stress markers stripped)."""
    tokens = tokenize(ipa)
    nuclei = [i for i, (_, is_v) in enumerate(tokens) if is_v]
    if not nuclei:
        return [''.join(t for t,_ in tokens)]

    bounds = {0}
    for a, b in zip(nuclei, nuclei[1:]):
        consonants = [tokens[i][0] for i in range(a+1, b)]
        if not consonants:
            continue
        split = a + 1  # default: all to left
        for n in range(len(consonants), 0, -1):
            onset = ''.join(consonants[-n:])
            if n == 1 or onset in ONSETS:
                split = b - n
                break
        bounds.add(split)

    bounds = sorted(bounds)
    syllables = []
    for i, start in enumerate(bounds):
        end = bounds[i+1] if i+1 < len(bounds) else len(tokens)
        syl = ''.join(t for t,_ in tokens[start:end])
        if syl:
            syllables.append(syl)
    return syllables

def ipa_to_xsampa(syl):
    tokens = tokenize(syl)
    return ''.join(IPA_XSAMPA.get(t, '') for t, _ in tokens)

def gen_mp3(xsampa, out_path):
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as f:
        wav = f.name
    try:
        subprocess.run(['espeak-ng','-v','en-us','-s','130','-a','180','-w',wav,f'[[{xsampa}]]'],
                       check=True, capture_output=True)
        subprocess.run(['ffmpeg','-y','-i',wav,'-af','afade=t=out:st=0.6:d=0.15',
                        '-ar','44100','-ab','64k',out_path],
                       check=True, capture_output=True)
    finally:
        os.unlink(wav)

def scrape_collins(word):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        br = p.chromium.launch(headless=True)
        pg = br.new_page(user_agent=(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
            'AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'))
        pg.goto(f'https://www.collinsdictionary.com/dictionary/english/{word}',
                wait_until='domcontentloaded', timeout=15000)
        pg.wait_for_timeout(2000)
        # prefer second .pron which usually has stress marks
        ipa = None
        els = pg.query_selector_all('.pron')
        for el in reversed(els):
            txt = el.inner_text().strip()
            if txt:
                ipa = txt; break
        br.close()
    return ipa

def process(word):
    print(f'\n▶ {word}')
    ipa = scrape_collins(word)
    if not ipa:
        print('  ✗ IPA not found'); return None
    print(f'  IPA: {ipa}')
    syllables = syllabify(ipa)
    print(f'  Syllables: {syllables}')

    out_dir = os.path.join(AUDIO_DIR, word)
    os.makedirs(out_dir, exist_ok=True)

    for i, syl in enumerate(syllables):
        xs = ipa_to_xsampa(syl)
        if not xs:
            print(f'  [{i}] {syl} → skip'); continue
        out = os.path.join(out_dir, f'{i}.mp3')
        gen_mp3(xs, out)
        print(f'  [{i}] {syl} → [[{xs}]] ✓')

    return {'word': word, 'ipa': ipa, 'syllables': syllables}

if __name__ == '__main__':
    words = sys.argv[1:] or ['community']
    results = [r for w in words if (r := process(w))]
    print('\n' + json.dumps(results, ensure_ascii=False, indent=2))
