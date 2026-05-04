#!/usr/bin/env node
// cleanup-empty-tts.mjs — remove 0-byte MP3s and purge their entries from ttsAudioMap.json
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, unlinkSync } from 'fs'
import { join } from 'path'

const ROOT = new URL('.', import.meta.url).pathname
const OUT_DIR = join(ROOT, 'public/tts')
const MAP_FILE = join(ROOT, 'src/data/ttsAudioMap.json')

let audioMap = {}
try { audioMap = JSON.parse(readFileSync(MAP_FILE, 'utf8')) } catch {}

const emptyHashes = new Set()
let removed = 0
for (const f of readdirSync(OUT_DIR)) {
  if (!f.endsWith('.mp3')) continue
  const full = join(OUT_DIR, f)
  if (statSync(full).size === 0) {
    unlinkSync(full)
    emptyHashes.add(f)
    removed++
  }
}

let purged = 0
for (const key of Object.keys(audioMap)) {
  if (emptyHashes.has(audioMap[key])) {
    delete audioMap[key]
    purged++
  }
}

writeFileSync(MAP_FILE, JSON.stringify(audioMap, null, 2))
console.log(`Deleted ${removed} empty MP3 files.`)
console.log(`Purged ${purged} entries from ttsAudioMap.json.`)
console.log(`Map now has ${Object.keys(audioMap).length} valid entries.`)
console.log(`Next: re-run 'node prebuild-tts.mjs' to regenerate the missing audio.`)
