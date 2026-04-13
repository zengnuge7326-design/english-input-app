/**
 * IPA phoneme utilities for natural phonics (自然拼读)
 *
 * Audio source: espeak-ng X-SAMPA isolated phoneme synthesis
 * Files: /audio/phonemes/{symbol}.mp3  (44 phonemes, generated offline)
 *
 * Provides:
 *  - IPA_TO_FILE  → IPA symbol → MP3 filename (without extension)
 *  - splitIPA(ipa)  → array of {symbol} tokens
 *  - playPhoneme(symbol)  → plays the isolated phoneme MP3
 */

// ── IPA symbol → audio filename ───────────────────────────────────────────────
export const IPA_TO_FILE = {
  // Plosives
  'p': 'p',   'b': 'b',   't': 't',   'd': 'd',
  'k': 'k',   'ɡ': 'g',   'g': 'g',   // ɡ = voiced velar (Unicode g-variant)
  // Fricatives
  'f': 'f',   'v': 'v',   's': 's',   'z': 'z',
  'θ': 'th',  'ð': 'dh',  'ʃ': 'sh',  'ʒ': 'zh',
  'h': 'h',
  // Affricates
  'tʃ': 'ch', 'dʒ': 'dj',
  // Nasals
  'm': 'm',   'n': 'n',   'ŋ': 'ng',
  // Liquids + approximants
  'l': 'l',   'r': 'r',   'w': 'w',   'j': 'j',
  // Short vowels
  'æ': 'ae',  'e': 'e',   'ɪ': 'ih',  'ɒ': 'oh',
  'ʌ': 'uh',  'ʊ': 'uu',  'ə': 'schwa',
  // Long vowels
  'iː': 'ee', 'uː': 'oo', 'ɑː': 'ar', 'ɔː': 'aw', 'ɜː': 'er',
  // Diphthongs
  'eɪ': 'ay',    'aɪ': 'eye', 'ɔɪ': 'oy',
  'əʊ': 'oh_dip','aʊ': 'ow',
  'ɪə': 'ear',   'eə': 'air', 'ʊə': 'oor',
}

/**
 * Split an IPA string into individual phoneme tokens.
 * Tries longest match first (3→2→1 chars) to handle multi-char symbols
 * like tʃ, dʒ, iː, eɪ, etc.
 *
 * Input:  "/ˈstɑːrt/"  or  "stɑːrt"
 * Output: [{symbol:"s"}, {symbol:"t"}, {symbol:"ɑː"}, {symbol:"r"}, {symbol:"t"}]
 */
export function splitIPA(ipa) {
  if (!ipa) return []
  const cleaned = ipa
    .replace(/^\/|\/$/g, '')  // strip /slashes/
    .replace(/[ˈˌ]/g, '')     // remove stress marks
    .replace(/\./g, '')        // remove syllable dots

  const tokens = []
  let i = 0
  const chars = [...cleaned] // unicode-safe

  while (i < chars.length) {
    let matched = false
    for (const len of [3, 2, 1]) {
      const sym = chars.slice(i, i + len).join('')
      if (IPA_TO_FILE[sym] !== undefined) {
        tokens.push({ symbol: sym })
        i += len
        matched = true
        break
      }
    }
    if (!matched) i++ // unknown IPA char — skip
  }
  return tokens
}

// ── Audio playback ─────────────────────────────────────────────────────────────

// Pre-load audio objects for instant tap response
const _cache = {}

function _getAudio(sym) {
  const file = IPA_TO_FILE[sym]
  if (!file) return null
  if (!_cache[sym]) {
    const src = `${import.meta.env.BASE_URL}audio/phonemes/${file}.mp3`
    _cache[sym] = new Audio(src)
    _cache[sym].load() // preload
  }
  return _cache[sym]
}

export function preloadPhonemes(symbols) {
  symbols.forEach(sym => _getAudio(sym))
}

export function playPhoneme(symbol) {
  const file = IPA_TO_FILE[symbol]
  if (!file) return

  const src = `${import.meta.env.BASE_URL}audio/phonemes/${file}.mp3`

  // Always create a fresh Audio for reliable re-trigger
  // (reusing same object and resetting currentTime can stutter on iOS/Safari)
  const audio = new Audio(src)
  audio.play().catch(() => {
    // Retry once — user gesture should have unlocked AudioContext
    setTimeout(() => new Audio(src).play().catch(() => {}), 80)
  })
}

/**
 * Map phoneme index → approximate letter range in word spelling (proportional fallback).
 */
export function mapPhonemesToLetters(word, phonemes) {
  const total = phonemes.length
  const wlen  = word.length
  return phonemes.map((_, i) => {
    const start = Math.round((i / total) * wlen)
    const end   = Math.round(((i + 1) / total) * wlen)
    return [start, Math.max(start + 1, end)]
  })
}
