// Conjunctions and subordinators that signal a natural break point
const BREAK_BEFORE = new Set([
  'and', 'but', 'or', 'so', 'because', 'although', 'though',
  'while', 'when', 'if', 'unless', 'since', 'after', 'before',
  'which', 'who', 'that',
])

function splitEvenly(words, maxPerSeg) {
  const segs = []
  for (let i = 0; i < words.length; i += maxPerSeg) {
    segs.push(words.slice(i, i + maxPerSeg).join(' '))
  }
  return segs
}

/**
 * Split a sentence into 2–5 sequential chunks for practice.
 * Rules:
 *   - ≤4 words  → return null (no split needed)
 *   - Each chunk: min 2 words, max 5 words
 *   - At most 5 chunks total
 * Returns null if no split is warranted, otherwise string[].
 */
export function buildSplitChunks(en) {
  const tokens = en.trim().split(/\s+/).filter(Boolean)
  const n = tokens.length
  if (n <= 4) return null

  // Find natural break positions (index to break BEFORE token[i])
  const natural = []
  for (let i = 2; i <= n - 2; i++) {
    const prev = tokens[i - 1]
    const word = tokens[i].replace(/[^a-zA-Z']/g, '').toLowerCase()
    if (/[,;:]$/.test(prev)) natural.push(i)
    else if (BREAK_BEFORE.has(word)) natural.push(i)
  }

  // Valid breaks: at least 2 tokens on each side
  const valid = natural.filter(b => b >= 2 && n - b >= 2)

  // Target segment count: aim for ~4–5 words per chunk
  const target = Math.min(5, Math.max(2, Math.ceil(n / 4)))

  let chosen = []
  if (valid.length > 0) {
    const need = target - 1
    if (valid.length <= need) {
      chosen = valid
    } else {
      // Pick evenly spaced from valid breaks
      chosen = Array.from({ length: need }, (_, i) =>
        valid[Math.round(i * (valid.length - 1) / (need - 1 || 1))]
      )
      chosen = [...new Set(chosen)].sort((a, b) => a - b)
    }
  } else {
    // No natural breaks: split evenly
    const step = Math.ceil(n / target)
    for (let i = step; i < n; i += step) {
      if (i >= 2 && n - i >= 2) chosen.push(i)
    }
    chosen = chosen.slice(0, target - 1)
  }

  if (chosen.length === 0) chosen = [Math.ceil(n / 2)]

  // Build initial segments
  const pts = [0, ...chosen.sort((a, b) => a - b), n]
  let segs = pts.slice(0, -1).map((start, i) =>
    tokens.slice(start, pts[i + 1]).join(' ')
  )

  // Subdivide any segment with >5 words
  const MAX_WORDS = 5
  segs = segs.flatMap(seg => {
    const toks = seg.split(' ')
    if (toks.length <= MAX_WORDS) return [seg]
    return splitEvenly(toks, MAX_WORDS)
  })

  // Merge down to max 5 segments (merge the two shortest adjacent pair)
  while (segs.length > 5) {
    let minLen = Infinity, minIdx = 0
    for (let i = 0; i < segs.length - 1; i++) {
      const combined = segs[i].split(' ').length + segs[i + 1].split(' ').length
      if (combined < minLen) { minLen = combined; minIdx = i }
    }
    segs.splice(minIdx, 2, segs[minIdx] + ' ' + segs[minIdx + 1])
  }

  // Merge any segment with < 2 words into its neighbor
  while (segs.length > 1 && segs.some(s => s.split(' ').length < 2)) {
    const idx = segs.findIndex(s => s.split(' ').length < 2)
    if (idx === 0) {
      segs.splice(0, 2, segs[0] + ' ' + segs[1])
    } else {
      segs.splice(idx - 1, 2, segs[idx - 1] + ' ' + segs[idx])
    }
  }

  return segs.length >= 2 ? segs : null
}

/**
 * Build split chunks for a specific difficulty level.
 *
 * level 1 — 拆句初级: many small chunks, ~3 words each (easiest: type short pieces)
 * level 2 — 拆句中级: standard split, ~4-5 words each (current behavior)
 * level 3 — 拆句高级: just 2 halves at the most natural break (hardest: longer pieces)
 *
 * Returns null when no split is needed/possible.
 */
export function buildSplitChunksLevel(en, level) {
  if (level === 2) return buildSplitChunks(en)

  const tokens = en.trim().split(/\s+/).filter(Boolean)
  const n = tokens.length

  // ── Level 1: aggressive split, max 3 words per chunk ──────────────────────
  if (level === 1) {
    if (n <= 3) return null
    const MAX = 3
    const segs = []
    let start = 0
    while (start < n) {
      let end = Math.min(start + MAX, n)
      // Try to break at a natural point within the window
      for (let i = start + 2; i < end && i < n - 1; i++) {
        const prev = tokens[i - 1]
        const w = tokens[i].replace(/[^a-zA-Z']/g, '').toLowerCase()
        if (/[,;:]$/.test(prev) || BREAK_BEFORE.has(w)) { end = i; break }
      }
      segs.push(tokens.slice(start, end).join(' '))
      start = end
    }
    // Merge any single-word orphans into neighbour
    const merged = []
    for (let i = 0; i < segs.length; i++) {
      if (segs[i].split(' ').length < 2 && merged.length > 0) {
        merged[merged.length - 1] += ' ' + segs[i]
      } else {
        merged.push(segs[i])
      }
    }
    // Cap at 6 segments (merge shortest adjacent pair)
    while (merged.length > 6) {
      let minLen = Infinity, minIdx = 0
      for (let i = 0; i < merged.length - 1; i++) {
        const l = merged[i].split(' ').length + merged[i + 1].split(' ').length
        if (l < minLen) { minLen = l; minIdx = i }
      }
      merged.splice(minIdx, 2, merged[minIdx] + ' ' + merged[minIdx + 1])
    }
    return merged.length >= 2 ? merged : null
  }

  // ── Level 3: just 2 halves ─────────────────────────────────────────────────
  if (level === 3) {
    if (n <= 5) return null
    const mid = Math.floor(n / 2)
    // Find the natural break closest to the middle
    let best = mid
    let bestDist = n
    for (let i = 2; i < n - 2; i++) {
      const prev = tokens[i - 1]
      const w = tokens[i].replace(/[^a-zA-Z']/g, '').toLowerCase()
      const isNatural = /[,;:]$/.test(prev) || BREAK_BEFORE.has(w)
      if (isNatural) {
        const dist = Math.abs(i - mid)
        if (dist < bestDist) { bestDist = dist; best = i }
      }
    }
    // If no natural break or it's too skewed, use exact midpoint
    if (bestDist > n / 3) best = mid
    return [tokens.slice(0, best).join(' '), tokens.slice(best).join(' ')]
  }

  return null
}
