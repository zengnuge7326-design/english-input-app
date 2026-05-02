#!/usr/bin/env node
// fix-data.mjs — auto-fix JSON data format issues
// Usage:  node fix-data.mjs           (apply fixes)
//         node fix-data.mjs --dry-run (preview only)
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, relative } from 'path'

const DRY_RUN = process.argv.includes('--dry-run')
const ROOT = new URL('.', import.meta.url).pathname
const DATA_DIR = join(ROOT, 'src/data')

const SMART_QUOTE_MAP = {
  '“': '"', '”': '"', // "" → "
  '‘': "'", '’': "'", // '' → '
}

// enOnly: smart quotes are correct Chinese punctuation in zh, so only fix in en
function fixString(val, enOnly = false) {
  if (typeof val !== 'string') return val
  let s = val

  // Trim whitespace
  s = s.trim()

  // Replace smart quotes — only for English fields (Chinese uses "" as standard punctuation)
  if (enOnly) {
    for (const [from, to] of Object.entries(SMART_QUOTE_MAP)) {
      s = s.split(from).join(to)
    }
  }

  // Replace ellipsis char with three dots (both fields)
  s = s.split('…').join('...')

  // Collapse double spaces
  s = s.replace(/  +/g, ' ')

  // Strip HTML tags (simple cases like <b>, </b>, <br>, etc.)
  s = s.replace(/<[a-zA-Z\/][^>]*>/g, '')

  // Decode common HTML entities
  s = s.replace(/&amp;/g, '&')
       .replace(/&lt;/g, '<')
       .replace(/&gt;/g, '>')
       .replace(/&quot;/g, '"')

  return s
}

function walk(dir) {
  const results = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) results.push(...walk(full))
    else if (entry.endsWith('.json')) results.push(full)
  }
  return results
}

let totalFixed = 0

for (const file of walk(DATA_DIR)) {
  const rel = relative(ROOT, file)
  let data
  try {
    data = JSON.parse(readFileSync(file, 'utf8'))
  } catch (e) {
    console.error(`❌ JSON parse error in ${rel}: ${e.message}`)
    continue
  }

  if (!Array.isArray(data)) continue

  let fileChanged = false
  const fixed = data.map(item => {
    const newItem = { ...item }
    for (const field of ['en', 'zh']) {
      if (typeof newItem[field] === 'string') {
        const orig = newItem[field]
        newItem[field] = fixString(orig, field === 'en')
        if (newItem[field] !== orig) {
          console.log(`  ${rel} id=${item.id ?? '?'} [${field}]`)
          console.log(`    before: ${orig.slice(0, 80)}`)
          console.log(`    after:  ${newItem[field].slice(0, 80)}`)
          fileChanged = true
          totalFixed++
        }
      }
    }
    return newItem
  })

  if (fileChanged) {
    if (!DRY_RUN) {
      writeFileSync(file, JSON.stringify(fixed, null, 2), 'utf8')
      console.log(`  ✅ Written: ${rel}`)
    } else {
      console.log(`  [dry-run] Would write: ${rel}`)
    }
  }
}

console.log(`\n${DRY_RUN ? '[DRY RUN] ' : ''}✅ Done. Fixed ${totalFixed} field(s) across all files.`)
