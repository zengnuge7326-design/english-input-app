/**
 * parseGraphemes.js
 *
 * Longest-match grapheme-phoneme correspondence parser.
 *
 * Usage:
 *   parseGraphemes("light")  → [{g:"l", p:"l"}, {g:"igh", p:"aɪ"}, {g:"t", p:"t"}]
 *   parseGraphemes("ship")   → [{g:"sh", p:"ʃ"}, {g:"i", p:"ɪ"}, {g:"p", p:"p"}]
 *   parseGraphemes("ring")   → [{g:"r", p:"r"}, {g:"i", p:"ɪ"}, {g:"ng", p:"ŋ"}]
 *
 * Each token: { g: grapheme_string, p: IPA_phoneme_string }
 *
 * Architecture:
 *  - Ordered rules: longer/more specific patterns checked before shorter
 *  - Context-sensitive where needed (e.g. "c" before e/i/y → /s/)
 *  - Silent letters: { g: "gh", p: "" } (empty IPA = silent)
 *  - Vowel teams, digraphs, trigraphs all handled
 */

// ── Grapheme → IPA phoneme rules ──────────────────────────────────────────────
//
// Each rule: { g, p, after?, before?, word_final?, word_initial? }
//   g      = grapheme string to match (case-insensitive)
//   p      = IPA phoneme(s) — empty string = silent
//   after  = regex the preceding characters must match (lookbehind simulation)
//   before = regex the following characters must match (lookahead simulation)
//   final  = only match at end of word
//   initial = only match at start of word
//
// Rules are tested in ORDER — first match wins.
// Longer graphemes MUST come before shorter ones.

const RULES = [
  // ── Trigraphs / 3-letter graphemes ────────────────────────────────────────
  { g: 'tch',  p: 'tʃ' },   // match, watch, catch
  { g: 'dge',  p: 'dʒ' },   // bridge, edge, judge (final)
  { g: 'igh',  p: 'aɪ' },   // light, night, fight
  { g: 'igh',  p: 'aɪ' },   // (duplicate for clarity)
  { g: 'eau',  p: 'əʊ' },   // beau, plateau
  { g: 'oor',  p: 'ɔː' },   // floor, door (before r)
  { g: 'our',  p: 'aʊə' },  // our, hour
  { g: 'air',  p: 'eə' },   // fair, chair, pair
  { g: 'ear',  p: 'ɪə' },   // ear, near, fear
  { g: 'eer',  p: 'ɪə' },   // beer, deer, steer
  { g: 'are',  p: 'eə', final: true },  // care, share
  { g: 'ore',  p: 'ɔː', final: true },  // more, store, core
  { g: 'ure',  p: 'ʊə', final: true },  // cure, sure, pure
  { g: 'ire',  p: 'aɪə', final: true }, // fire, hire, tire
  { g: 'igh',  p: 'aɪ' },

  // ── Digraphs ──────────────────────────────────────────────────────────────
  // Consonant digraphs
  { g: 'sh', p: 'ʃ' },     // ship, fish, shell
  { g: 'ch', p: 'tʃ' },    // chip, church, much
  { g: 'ch', p: 'k', before: /[^aeiou]/ }, // character, school — context later
  { g: 'th', p: 'θ' },     // thin, thick, think (voiceless default)
  { g: 'wh', p: 'w' },     // when, where, white
  { g: 'ph', p: 'f' },     // phone, graph, photo
  { g: 'gh', p: '' },      // night, light (silent after vowel digraph)
  { g: 'gh', p: 'g', initial: true }, // ghost, ghastly (initial)
  { g: 'kn', p: 'n', initial: true }, // know, knight, knee
  { g: 'wr', p: 'r', initial: true }, // write, wrong, wrap
  { g: 'gn', p: 'n', initial: true }, // gnome, gnat
  { g: 'mb', p: 'm', final: true },  // lamb, comb, bomb (silent b)
  { g: 'ng', p: 'ŋ' },     // ring, sing, song
  { g: 'nk', p: 'ŋk' },    // think, pink, sink
  { g: 'ck', p: 'k' },     // back, duck, kick
  { g: 'qu', p: 'kw' },    // queen, quick, quiet
  { g: 'ss', p: 's' },     // miss, less, boss
  { g: 'll', p: 'l' },     // all, bell, fill
  { g: 'ff', p: 'f' },     // off, cliff, stuff
  { g: 'zz', p: 'z' },     // buzz, fizz, jazz

  // Vowel digraphs (long vowel teams)
  { g: 'ai', p: 'eɪ' },    // rain, sail, wait
  { g: 'ay', p: 'eɪ' },    // day, play, say
  { g: 'ee', p: 'iː' },    // see, tree, feet
  { g: 'ea', p: 'iː' },    // eat, sea, team  (default — /ɛ/ in bread handled below)
  { g: 'oa', p: 'əʊ' },    // goat, boat, road
  { g: 'oe', p: 'əʊ' },    // toe, hoe, foe
  { g: 'ow', p: 'əʊ', before: /[^aeiou]|$/ }, // snow, grow, low
  { g: 'ow', p: 'aʊ' },    // cow, now, how (before vowel or end of word)
  { g: 'oi', p: 'ɔɪ' },    // oil, coin, noise
  { g: 'oy', p: 'ɔɪ' },    // boy, joy, toy
  { g: 'ou', p: 'aʊ' },    // out, cloud, found
  { g: 'oo', p: 'uː' },    // moon, food, boot
  { g: 'oo', p: 'ʊ', before: /[dk]/ }, // book, cook, look (short oo before k/d)
  { g: 'ew', p: 'juː' },   // new, few, dew
  { g: 'ue', p: 'juː' },   // blue, clue, true
  { g: 'ui', p: 'uː' },    // fruit, suit, juice
  { g: 'au', p: 'ɔː' },    // caught, sauce, autumn
  { g: 'aw', p: 'ɔː' },    // saw, draw, claw

  // R-controlled vowels
  { g: 'ar', p: 'ɑː' },    // car, bar, farm
  { g: 'er', p: 'ɜː' },    // her, fern, verb
  { g: 'ir', p: 'ɜː' },    // bird, first, girl
  { g: 'ur', p: 'ɜː' },    // burn, hurt, turn
  { g: 'or', p: 'ɔː' },    // for, born, corn

  // Split digraphs (magic e / vowel-consonant-e)
  // Handled below in post-processing

  // ── Single consonants ─────────────────────────────────────────────────────
  { g: 'b', p: 'b' },
  { g: 'c', p: 's', before: /[eiy]/ },  // city, cell, cycle
  { g: 'c', p: 'k' },                    // cat, cup, cut
  { g: 'd', p: 'd' },
  { g: 'f', p: 'f' },
  { g: 'g', p: 'dʒ', before: /[ei]/ },  // gem, giant (soft g)
  { g: 'g', p: 'g' },                    // get, go, bag
  { g: 'h', p: 'h' },
  { g: 'j', p: 'dʒ' },
  { g: 'k', p: 'k' },
  { g: 'l', p: 'l' },
  { g: 'm', p: 'm' },
  { g: 'n', p: 'n' },
  { g: 'p', p: 'p' },
  { g: 'r', p: 'r' },
  { g: 's', p: 's' },
  { g: 't', p: 't' },
  { g: 'v', p: 'v' },
  { g: 'w', p: 'w' },
  { g: 'x', p: 'ks' },   // box, fox, mix
  { g: 'y', p: 'j', initial: true },   // yes, yet (consonant y at start)
  { g: 'y', p: 'aɪ', final: true },    // fly, sky, my (vowel y at end)
  { g: 'y', p: 'ɪ' },                  // gym, system (vowel y in middle)
  { g: 'z', p: 'z' },
  { g: 'q', p: 'k' },                   // fallback for q without u

  // ── Single vowels ─────────────────────────────────────────────────────────
  // Short vowels (default)
  { g: 'a', p: 'æ' },    // cat, bat, map
  { g: 'e', p: 'e' },    // bed, set, hen
  { g: 'i', p: 'ɪ' },    // sit, bin, lip
  { g: 'o', p: 'ɒ' },    // hot, log, top
  { g: 'u', p: 'ʌ' },    // cup, run, sun
]

// ── Parser ────────────────────────────────────────────────────────────────────

/**
 * Parse a word into grapheme-phoneme tokens.
 *
 * @param {string} word
 * @returns {Array<{g: string, p: string}>}
 *   g = grapheme (original letters), p = IPA phoneme(s)
 */
export function parseGraphemes(word) {
  if (!word) return []
  const lower = word.toLowerCase().replace(/[^a-z]/g, '')
  const tokens = []
  let i = 0

  while (i < lower.length) {
    let matched = false

    // Try rules from longest grapheme match down
    // Sort rules by grapheme length descending so longer patterns win
    const sortedRules = [...RULES].sort((a, b) => b.g.length - a.g.length)

    for (const rule of sortedRules) {
      const gLen = rule.g.length
      if (i + gLen > lower.length) continue
      const slice = lower.slice(i, i + gLen)
      if (slice !== rule.g) continue

      // Context checks
      if (rule.initial && i !== 0) continue
      if (rule.final && i + gLen !== lower.length) continue
      if (rule.before) {
        const rest = lower.slice(i + gLen)
        if (!rule.before.test(rest.charAt(0) || '')) continue
      }
      if (rule.after) {
        const prev = lower.slice(0, i)
        if (!rule.after.test(prev.slice(-1) || '')) continue
      }

      tokens.push({ g: lower.slice(i, i + gLen), p: rule.p })
      i += gLen
      matched = true
      break
    }

    if (!matched) {
      // Unknown character — pass through as-is with empty phoneme
      tokens.push({ g: lower[i], p: '' })
      i++
    }
  }

  // Post-process: Magic-E (split digraph) — a_e, e_e, i_e, o_e, u_e
  // Pattern: vowel + consonant(s) + 'e' (final) → long vowel, silent e
  return applyMagicE(tokens)
}

function applyMagicE(tokens) {
  // Find pattern: short-vowel token, 1-2 consonant tokens, final 'e'
  const LONG_MAP = {
    'æ': 'eɪ',  // a→ay  (cake, name, tape)
    'e': 'iː',  // e→ee  (theme, these)
    'ɪ': 'aɪ',  // i→igh (bike, pine, time)
    'ɒ': 'əʊ',  // o→oa  (bone, home, note)
    'ʌ': 'juː', // u→ue  (cube, tune, mute)
  }

  const out = [...tokens]
  // Only apply when last token is literal 'e' (final)
  if (out.length >= 3 &&
      out[out.length - 1].g === 'e' &&
      out[out.length - 1].p === 'e') {
    // Look back for vowel separated by 1-2 consonants
    const eLast = out.length - 1
    for (let back = 1; back <= 2; back++) {
      const vowelIdx = eLast - 1 - back
      if (vowelIdx < 0) break
      const vowelTok = out[vowelIdx]
      if (LONG_MAP[vowelTok.p]) {
        // Check all tokens between vowel and 'e' are consonants
        let allCons = true
        for (let c = vowelIdx + 1; c < eLast; c++) {
          if ('aeiouæɪɒʌ'.includes(out[c].p[0] || '')) { allCons = false; break }
        }
        if (allCons) {
          out[vowelIdx] = { ...vowelTok, p: LONG_MAP[vowelTok.p] }
          out[eLast] = { g: 'e', p: '' } // silent e
          break
        }
      }
    }
  }
  return out
}

/**
 * Get all unique IPA phonemes from a list of tokens.
 * Splits multi-phoneme tokens (e.g. "ks" from x → ['k','s']).
 */
export function getPhonemes(tokens) {
  const all = []
  for (const tok of tokens) {
    // split multi-phoneme strings like "ks", "kw", "tʃ" etc.
    const parts = splitMultiPhoneme(tok.p)
    all.push(...parts.filter(Boolean))
  }
  return all
}

function splitMultiPhoneme(p) {
  if (!p) return []
  // Known multi-phoneme sequences
  const multi = ['tʃ', 'dʒ', 'ŋk', 'ks', 'kw', 'aɪə', 'juː']
  for (const m of multi) {
    if (p === m) return [m]
  }
  // Otherwise split character by character (handles simple IPA)
  return [p]
}
