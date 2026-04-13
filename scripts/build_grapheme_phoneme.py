#!/usr/bin/env python3
"""
Grapheme-Phoneme Alignment Pipeline
Input : src/data/pep_words.json  (870 words, each has word + ipa)
Output: src/data/grapheme_phoneme_map.json
        { "nice": [{"g":"n","p":"n"},{"g":"i","p":""},{"g":"ce","p":"s"}], ... }
        ( g=grapheme, p=IPA phoneme(s) it produces )

Algorithm
---------
1. Segment word → graphemes  (longest-match on GRAPHEME_SET)
2. Tokenize IPA string        → phoneme list  (IPA_TOKENS regex)
3. DP alignment               → best (grapheme, phoneme_seq) pairs
4. Write JSON

Run:  python3 scripts/build_grapheme_phoneme.py
"""

import re, json, sys
from pathlib import Path

# ── 1. Grapheme priority list (longest first) ────────────────────────────────
GRAPHEME_SET = [
    # 4-letter
    "ight","eigh","ough","tion","ture",
    # 3-letter
    "igh","tch","dge","ing","ous","ful","air","ear","our","eau",
    # 2-letter
    "ch","sh","th","wh","ph","gh","qu",
    "ai","ay","au","aw","ae",
    "ea","ee","ei","ey","eu",
    "ie","oe","oi","oy",
    "oa","ou","ow","oo",
    "ar","er","ir","or","ur",
    "ck","ng","nk","wr","kn",
    "bb","dd","ff","gg","ll","mm","nn","pp","rr","ss","tt","zz",
    # 1-letter (catch-all)
    *list("abcdefghijklmnopqrstuvwxyz")
]

def segment(word: str) -> list[str]:
    chunks, rem = [], word.lower()
    while rem:
        for g in GRAPHEME_SET:
            if rem.startswith(g):
                chunks.append(g); rem = rem[len(g):]
                break
        else:
            chunks.append(rem[0]); rem = rem[1:]
    return chunks

# ── 2. IPA tokenizer ─────────────────────────────────────────────────────────
# Covers all IPA symbols that appear in PEP word data
IPA_TOKEN_RE = re.compile(
    r'(?:'
    # Long vowels & diphthongs first (longest match)
    r'iː|uː|ɑː|ɔː|ɜː|eɪ|aɪ|ɔɪ|aʊ|əʊ|ɪə|eə|ʊə|æ|ɑ|ɒ|ɔ|ə|ɪ|ʊ|ʌ|ɛ|e|i|u|a|o|'
    # Affricates before stops
    r'tʃ|dʒ|'
    # Consonants
    r'[pbtdkgfvszʃʒθðmnnŋlrhjw]'
    r')'
)

def tokenize_ipa(ipa: str) -> list[str]:
    # Strip slashes, stress marks, syllable dots
    ipa = re.sub(r"[/\\'ˈˌ.]", "", ipa)
    return IPA_TOKEN_RE.findall(ipa)

# ── 3. DP alignment ──────────────────────────────────────────────────────────
# Each grapheme can consume 0, 1, 2, or 3 phonemes.
# Cost function: known_cost if grapheme has a prior match, else penalty.
#
# Prior: maps grapheme -> set of plausible IPA sequences (tuples)
PRIOR: dict[str, set] = {
    # Silent
    "e":    {("",), ("e",), ("ɪ",)},
    "gh":   {("",), ("f",)},
    "ght":  {("t",)},      # ight etc handled below
    "ck":   {("k",)},
    "kn":   {("n",)},
    "wr":   {("r",)},
    "mb":   {("m",)},
    # Digraphs
    "ch":   {("tʃ",), ("k",), ("ʃ",)},
    "sh":   {("ʃ",)},
    "th":   {("θ",), ("ð",)},
    "ph":   {("f",)},
    "wh":   {("w",), ("h",)},
    "ng":   {("ŋ",)},
    "nk":   {("ŋk",)},
    "qu":   {("kw",)},
    "tch":  {("tʃ",)},
    "dge":  {("dʒ",)},
    # Vowel digraphs
    "ai":   {("eɪ",)},
    "ay":   {("eɪ",)},
    "au":   {("ɔː",)},
    "aw":   {("ɔː",)},
    "eau":  {("juː",), ("əʊ",)},
    "ea":   {("iː",), ("ɛ",), ("eɪ",)},
    "ee":   {("iː",)},
    "ei":   {("eɪ",), ("iː",)},
    "ey":   {("eɪ",), ("iː",)},
    "ie":   {("iː",), ("aɪ",)},
    "oa":   {("əʊ",)},
    "ou":   {("aʊ",), ("uː",), ("ə",), ("ɒ",)},
    "ow":   {("əʊ",), ("aʊ",)},
    "oo":   {("uː",), ("ʊ",)},
    "oi":   {("ɔɪ",)},
    "oy":   {("ɔɪ",)},
    "ar":   {("ɑː",)},
    "er":   {("ɜː",), ("ə",)},
    "ir":   {("ɜː",)},
    "or":   {("ɔː",)},
    "ur":   {("ɜː",)},
    "air":  {("eə",)},
    "ear":  {("ɪə",), ("ɜː",), ("eə",)},
    "our":  {("aʊə",), ("ɔː",), ("ə",)},
    "igh":  {("aɪ",)},
    "ight": {("aɪt",)},
    "eigh": {("eɪ",)},
    "ough": {("ɒf",), ("uː",), ("ɔː",), ("aʊ",), ("ə",)},
    # Single vowels
    "a":    {("æ",), ("eɪ",), ("ɑː",), ("ə",), ("ɒ",)},
    "e":    {("ɛ",), ("e",), ("iː",), ("",)},
    "i":    {("ɪ",), ("aɪ",)},
    "o":    {("ɒ",), ("əʊ",), ("ʌ",), ("uː",)},
    "u":    {("ʌ",), ("ʊ",), ("uː",), ("juː",)},
    "y":    {("ɪ",), ("aɪ",), ("j",)},
    # Common consonants
    "c":    {("k",), ("s",)},
    "g":    {("g",), ("dʒ",)},
    "s":    {("s",), ("z",)},
    "x":    {("ks",), ("gz",)},
}

def align(graphemes: list[str], phonemes: list[str]) -> list[tuple[str,str]]:
    """
    DP: graphemes[i] eats 0..MAX_P phonemes.
    State: (gi, pi) -> min_cost, back_pointer
    Returns list of (grapheme, ipa_fragment) pairs.
    """
    MAX_P = 3  # max phonemes one grapheme can consume
    G, P = len(graphemes), len(phonemes)
    INF = 10**9

    # dp[gi][pi] = min cost to align graphemes[:gi] with phonemes[:pi]
    dp   = [[INF]*(P+1) for _ in range(G+1)]
    back = [[None]*(P+1) for _ in range(G+1)]
    dp[0][0] = 0

    def cost(g, ph_seq):
        """Cost for grapheme g consuming phoneme sequence ph_seq (tuple)."""
        prior = PRIOR.get(g, set())
        if ph_seq in prior:          return 0   # perfect prior match
        if len(ph_seq) == 0:         return 2   # silent grapheme (moderate penalty)
        # Partial match: at least one phoneme looks plausible
        ph_str = "".join(ph_seq)
        for known in prior:
            if "".join(known) == ph_str: return 0
        return 3  # unknown mapping

    for gi in range(G):
        g = graphemes[gi]
        for pi in range(P+1):
            if dp[gi][pi] == INF:
                continue
            # Try consuming n_p phonemes (0 = silent)
            for n_p in range(MAX_P+1):
                if pi + n_p > P:
                    break
                ph_seq = tuple(phonemes[pi:pi+n_p])
                c = cost(g, ph_seq)
                new_cost = dp[gi][pi] + c
                if new_cost < dp[gi+1][pi+n_p]:
                    dp[gi+1][pi+n_p] = new_cost
                    back[gi+1][pi+n_p] = (gi, pi, n_p)

    # Traceback from (G, P)
    result = []
    gi, pi = G, P
    while gi > 0:
        prev_gi, prev_pi, n_p = back[gi][pi]
        ph_frag = "".join(phonemes[prev_pi:prev_pi+n_p])
        result.append((graphemes[prev_gi], ph_frag))
        gi, pi = prev_gi, prev_pi
    result.reverse()
    return result

# ── 4. Main pipeline ─────────────────────────────────────────────────────────
def main():
    base = Path(__file__).parent.parent / "src" / "data"
    files = [base / "pep_words.json"]
    hs = base / "hs_words.json"
    if hs.exists():
        files.append(hs)

    words = {}  # word -> ipa
    for f in files:
        for book in json.loads(f.read_text()):
            for unit in book.get("units", []):
                for w in unit.get("words", []):
                    wd = w.get("word","").strip().lower()
                    ip = w.get("ipa","").strip()
                    if wd and ip and wd not in words:
                        words[wd] = ip

    print(f"Total unique words: {len(words)}")

    out = {}
    errors = []
    for word, ipa_raw in sorted(words.items()):
        graphemes = segment(word)
        phonemes  = tokenize_ipa(ipa_raw)

        if not phonemes:
            # No IPA data or parse failed
            out[word] = [{"g": g, "p": ""} for g in graphemes]
            continue

        try:
            pairs = align(graphemes, phonemes)
            out[word] = [{"g": g, "p": p} for g, p in pairs]
        except Exception as e:
            errors.append(f"{word}: {e}")
            out[word] = [{"g": g, "p": ""} for g in graphemes]

    # Write output
    out_path = base / "grapheme_phoneme_map.json"
    out_path.write_text(json.dumps(out, ensure_ascii=False, indent=2))
    print(f"Written: {out_path}  ({len(out)} words)")

    if errors:
        print(f"\nErrors ({len(errors)}):")
        for e in errors[:10]:
            print(" ", e)

    # Quick sanity check
    checks = ["nice", "snow", "show", "great", "night", "teacher", "children"]
    print("\nSpot checks:")
    for w in checks:
        if w in out:
            pairs = [(d["g"], d["p"]) for d in out[w]]
            print(f"  {w:12} → {pairs}")

if __name__ == "__main__":
    main()
