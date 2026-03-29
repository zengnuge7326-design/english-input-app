import nlp from 'compromise'

function stripPunct(str) {
  return str.replace(/[^a-zA-Z0-9'\s]/g, '').trim()
}

function unique(arr) {
  const seen = new Set()
  return arr.filter(s => {
    const k = stripPunct(s).toLowerCase().trim()
    if (!k || seen.has(k)) return false
    seen.add(k)
    return true
  })
}

// Function words not worth practicing alone
const SKIP_ALONE = new Set([
  'a', 'an', 'the', 'to', 'of', 'in', 'on', 'at', 'by', 'for',
  'with', 'from', 'up', 'as', 'is', 'it', 'its', 'be', 'do',
  'not', 'no', 'so', 'or', 'and', 'but', 'yet', 'nor',
])

const SUBORD = new Set(['because', 'although', 'though', 'while', 'when',
  'if', 'unless', 'until', 'since', 'after', 'before', 'that', 'which', 'who'])
const COORD = new Set(['and', 'but', 'or', 'so', 'yet'])

export function buildUpChunks(en) {
  const tokens = en.trim().split(/\s+/).filter(Boolean)
  if (tokens.length <= 1) return [en]
  if (tokens.length === 2) return [tokens[0], en]

  const doc = nlp(en)
  const chunks = []

  // --- 1. Individual words in sentence order, skip trivial function words ---
  tokens.forEach(tok => {
    const clean = stripPunct(tok)
    if (!clean) return
    if (SKIP_ALONE.has(clean.toLowerCase())) return
    chunks.push(clean)
  })

  // --- 2. Noun phrases (multi-word only, in doc order) ---
  doc.nouns().forEach(n => {
    const t = stripPunct(n.text())
    if (t && t.split(' ').length > 1) chunks.push(t)
  })

  // --- 3. Verb phrases (multi-word only) ---
  doc.verbs().forEach(v => {
    const t = stripPunct(v.text())
    if (t && t.split(' ').length > 1) chunks.push(t)
  })

  // --- 4. Clauses split by conjunction/comma boundaries ---
  let clauseTokens = []
  const clauses = []
  for (let i = 0; i < tokens.length; i++) {
    const word = stripPunct(tokens[i]).toLowerCase()
    const isBreak = (SUBORD.has(word) || COORD.has(word)) && clauseTokens.length >= 2
    const prevComma = clauseTokens.length > 0 && /[,;]$/.test(clauseTokens[clauseTokens.length - 1])
    if ((isBreak || prevComma) && clauseTokens.length >= 2) {
      clauses.push(clauseTokens.join(' '))
      clauseTokens = [tokens[i]]
    } else {
      clauseTokens.push(tokens[i])
    }
  }
  if (clauseTokens.length) clauses.push(clauseTokens.join(' '))

  if (clauses.length > 1) {
    clauses.forEach(c => {
      if (stripPunct(c).split(' ').length > 1) chunks.push(c)
    })
  }

  // --- 5. Full sentence ---
  chunks.push(en)

  return unique(chunks)
}
