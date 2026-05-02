#!/usr/bin/env node
// prebuild-tts.mjs — pre-generate Edge Neural TTS audio for all learning sentences
// Usage:  node prebuild-tts.mjs [--voice en-US-AvaNeural] [--rate 1.0] [--limit 50]
// Output: public/tts/<hash>.mp3 + updates src/data/ttsAudioMap.json
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs'
import { join, relative } from 'path'
import { execFile } from 'child_process'
import { promisify } from 'util'
import crypto from 'crypto'

const execFileAsync = promisify(execFile)
const ROOT = new URL('.', import.meta.url).pathname
const DATA_DIR = join(ROOT, 'src/data')
const OUT_DIR = join(ROOT, 'public/tts')
const MAP_FILE = join(ROOT, 'src/data/ttsAudioMap.json')

// Parse args
const args = process.argv.slice(2)
const getArg = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : null }
const VOICE = getArg('--voice') || 'en-US-AvaNeural'
const RATE = getArg('--rate') || '0%'   // edge-tts rate format e.g. "+0%"
const LIMIT = parseInt(getArg('--limit') || '9999', 10)
const DRY = args.includes('--dry-run')

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

function normalizeKey(text = '') {
  return String(text).toLowerCase()
    .replace(/[""]/g, '"').replace(/['']/g, "'")
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ').trim()
}

function hashKey(text) {
  return crypto.createHash('sha256').update(normalizeKey(text)).digest('hex').slice(0, 16)
}

function walk(dir) {
  const results = []
  for (const e of readdirSync(dir)) {
    const full = join(dir, e)
    if (statSync(full).isDirectory()) results.push(...walk(full))
    else if (e.endsWith('.json') && !e.includes('ttsAudioMap') && !e.includes('grammar_tenses')) results.push(full)
  }
  return results
}

// Collect all unique English sentences
const sentences = new Set()
for (const file of walk(DATA_DIR)) {
  let data
  try { data = JSON.parse(readFileSync(file, 'utf8')) } catch { continue }
  if (!Array.isArray(data)) continue
  for (const item of data) {
    if (typeof item.en === 'string' && item.en.trim()) {
      sentences.add(item.en.trim())
    }
  }
}

// Load existing map
let audioMap = {}
try { audioMap = JSON.parse(readFileSync(MAP_FILE, 'utf8')) } catch {}

// Filter: only those not already mapped
const todo = [...sentences].filter(s => {
  const key = normalizeKey(s)
  return !audioMap[key]
}).slice(0, LIMIT)

console.log(`Total unique sentences: ${sentences.size}`)
console.log(`Already in map: ${sentences.size - todo.length}`)
console.log(`To generate: ${todo.length} (limit ${LIMIT})`)
console.log(`Voice: ${VOICE}`)
if (DRY) { console.log('[dry-run] Stopping here.'); process.exit(0) }
console.log()

let done = 0, failed = 0
for (const text of todo) {
  const key = normalizeKey(text)
  const fname = `${hashKey(text)}.mp3`
  const outPath = join(OUT_DIR, fname)

  if (existsSync(outPath)) {
    audioMap[key] = fname
    done++
    continue
  }

  process.stdout.write(`[${done + 1}/${todo.length}] ${text.slice(0, 60)}... `)
  try {
    await execFileAsync('edge-tts', [
      '--voice', VOICE,
      '--text', text,
      '--write-media', outPath,
    ], { timeout: 15000 })
    audioMap[key] = fname
    done++
    process.stdout.write('✓\n')
  } catch (err) {
    failed++
    process.stdout.write(`✗ ${err.message?.slice(0, 50)}\n`)
  }

  // Save map periodically
  if ((done + failed) % 20 === 0) {
    writeFileSync(MAP_FILE, JSON.stringify(audioMap, null, 2))
  }
}

writeFileSync(MAP_FILE, JSON.stringify(audioMap, null, 2))
console.log(`\n✅ Done. Generated ${done}, failed ${failed}. Map saved to ttsAudioMap.json`)
