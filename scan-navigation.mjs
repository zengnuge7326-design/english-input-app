#!/usr/bin/env node
// scan-navigation.mjs — audit navigation/back-button logic in JSX files
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, relative } from 'path'

const ROOT = new URL('.', import.meta.url).pathname
const SRC_DIR = join(ROOT, 'src')

const PATTERNS = [
  { name: 'navigateTo call',        re: /navigateTo\(['"`]([^'"`]+)['"`]\)/g },
  { name: 'navigateFromMenu call',  re: /navigateFromMenu\(['"`]([^'"`]+)['"`]\)/g },
  { name: 'onBack prop usage',      re: /onBack\s*\(/g },
  { name: 'onSetBack call',         re: /onSetBack\?\.\(/g },
  { name: 'tabHistory reference',   re: /tabHistory/g },
  { name: 'handleBack call/def',    re: /handleBack/g },
  { name: 'canGoBack reference',    re: /canGoBack/g },
  { name: 'setTab direct call',     re: /setTab\(/g },
]

function walk(dir) {
  const results = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) results.push(...walk(full))
    else if (entry.endsWith('.jsx') || entry.endsWith('.js')) results.push(full)
  }
  return results
}

for (const file of walk(SRC_DIR)) {
  const rel = relative(ROOT, file)
  const src = readFileSync(file, 'utf8')
  const lines = src.split('\n')

  const hits = []
  for (const pat of PATTERNS) {
    const re = new RegExp(pat.re.source, 'g')
    let m
    while ((m = re.exec(src)) !== null) {
      const lineNo = src.slice(0, m.index).split('\n').length
      hits.push({ pattern: pat.name, lineNo, snippet: lines[lineNo - 1]?.trim().slice(0, 100) })
    }
  }

  if (hits.length > 0) {
    console.log(`\n📄 ${rel}`)
    for (const h of hits) {
      console.log(`  L${h.lineNo} [${h.pattern}]`)
      console.log(`    ${h.snippet}`)
    }
  }
}

console.log('\n✅ Navigation scan complete.')
