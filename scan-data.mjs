#!/usr/bin/env node
// scan-data.mjs — scan all JSON data files for format issues
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, relative } from 'path'

const ROOT = new URL('.', import.meta.url).pathname
const DATA_DIR = join(ROOT, 'src/data')

const PATTERNS = [
  { name: 'HTML tags',        re: /<[a-zA-Z\/][^>]*>/g },
  { name: 'Smart quotes',     re: /[“”‘’]/g },
  { name: 'Ellipsis char',    re: /…/g },
  { name: 'Slash as space',   re: /\s\/\s/g },
  { name: 'Leading/trailing whitespace in en/zh', re: null }, // handled below
  { name: 'Timestamp in text', re: /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/g },
  { name: 'Double spaces',    re: /  +/g },
  { name: 'Escaped HTML entities', re: /&amp;|&lt;|&gt;|&quot;|&#\d+;/g },
]

function walk(dir) {
  const results = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) results.push(...walk(full))
    else if (entry.endsWith('.json')) results.push(full)
  }
  return results
}

let totalIssues = 0

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

  const fileIssues = []

  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    const id = item.id ?? i
    const fields = ['en', 'zh']

    for (const field of fields) {
      const val = item[field]
      if (typeof val !== 'string') continue

      // Check named patterns
      for (const pat of PATTERNS) {
        if (!pat.re) continue
        const matches = val.match(pat.re)
        if (matches) {
          fileIssues.push({ id, field, issue: pat.name, sample: val.slice(0, 80), matches: matches.slice(0, 3) })
        }
      }

      // Leading/trailing whitespace
      if (val !== val.trim()) {
        fileIssues.push({ id, field, issue: 'Leading/trailing whitespace', sample: JSON.stringify(val.slice(0, 40)) })
      }
    }
  }

  if (fileIssues.length > 0) {
    console.log(`\n📄 ${rel} — ${fileIssues.length} issue(s)`)
    for (const iss of fileIssues) {
      console.log(`  id=${iss.id} [${iss.field}] ${iss.issue}`)
      console.log(`    → ${iss.sample}`)
      if (iss.matches) console.log(`    matches: ${JSON.stringify(iss.matches)}`)
    }
    totalIssues += fileIssues.length
  }
}

console.log(`\n✅ Scan complete. Total issues found: ${totalIssues}`)
