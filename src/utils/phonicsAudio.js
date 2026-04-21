/**
 * phonicsAudio.js — 自然拼读音频工具
 * phonics_master.json 从 /data/ 懒加载（不打进 bundle）
 * 音频: /audio/phonics/words/{word}.mp3  缺失回退 TTS
 *       /audio/phonics/chunks/{chunk}.mp3
 */

let _wordMap = null
let _loading = null

async function getWordMap() {
  if (_wordMap) return _wordMap
  if (_loading) return _loading
  _loading = fetch('/data/phonics_master.json')
    .then(r => r.json())
    .then(arr => {
      _wordMap = Object.create(null)
      for (const e of arr) {
        const w = String(e.word || '').toLowerCase()
        if (!w) continue
        _wordMap[w] = {
          word: w,
          level: e.level ?? null,
          rule: e.rule ?? null,
          chunks: Array.isArray(e.chunks) && e.chunks.length ? e.chunks : [w],
        }
      }
      return _wordMap
    })
  return _loading
}

export function getWordPhonics(word) {
  if (!_wordMap || !word) return null
  return _wordMap[word.toLowerCase()] ?? null
}

export async function fetchWordPhonics(word) {
  const map = await getWordMap()
  return word ? (map[word.toLowerCase()] ?? null) : null
}

export function getAllPhonics() { return _wordMap }

export function preloadPhonicsData() { return getWordMap() }

const _cache = new Map()

function loadAudio(candidates) {
  return new Promise((res, rej) => {
    const try_ = (i) => {
      if (i >= candidates.length) { rej(); return }
      const a = new Audio(candidates[i])
      a.addEventListener('canplaythrough', () => res(a), { once: true })
      a.addEventListener('error', () => try_(i + 1), { once: true })
      a.load()
    }
    try_(0)
  })
}

export async function playWordAudio(word, rate = 0.85) {
  const key = String(word || '').toLowerCase().replace(/[^a-z'-]/g, '')
  if (!key) return
  if (!_cache.has(key)) {
    try {
      const a = await loadAudio([
        `/audio/phonics/words/${key}_us_v1.mp3`,
        `/audio/phonics/words/${key}.mp3`,
      ])
      _cache.set(key, a)
    } catch {
      _cache.set(key, null)
    }
  }
  const audio = _cache.get(key)
  if (audio) { audio.currentTime = 0; audio.play(); return }
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(word)
    u.lang = 'en-US'; u.rate = rate
    window.speechSynthesis.speak(u)
  }
}

export function levelLabel(level) {
  return ({
    L0_exception:           '例外词',
    L1_morphology:          '词素规则',
    L1_morphology_prefix:   '前缀词',
    L1_morphology_suffix:   '后缀词',
    L1_morphology_compound: '复合词',
    L2_special_le:          'LE音节',
    L2_special_vowel_team:  '元音组合',
    L2_special_digraph:     '辅音组合',
    L3_syllable_engine:     '音节规律',
    L4_phonics_fallback:    '基础拼读',
  })[level] ?? (level ?? '')
}
