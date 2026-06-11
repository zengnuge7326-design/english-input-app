/**
 * phonicsAudio.js — 自然拼读 / 字母 / 音标 音频
 * 优先 Edge 神经 TTS（与单词卡、练习页一致）
 */

import { ipaToAudioFile, IPA_TO_FILE } from './phonemes.js'
import { PHONEME_EXAMPLES } from '../data/phonemeChart.js'
import { warmAudio } from './audioPrefetch.js'

const TTS_API = 'https://okenglish.site/api/tts'
const SETTINGS_KEY = 'english_input_settings'

let _wordMap = null
let _loading = null
let _neuralAudio = null
let _phonemeAudio = null

const PHONEME_AUDIO_BASE = '/audio/phonemes'

export function loadTtsVoice() {
  try {
    const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')
    return s.edgeVoice || 'en-US-AvaNeural'
  } catch {
    return 'en-US-AvaNeural'
  }
}

export function loadTtsRate() {
  try {
    const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')
    return typeof s.rate === 'number' ? s.rate : 1.0
  } catch {
    return 1.0
  }
}

function stopPhoneme() {
  if (_phonemeAudio) {
    _phonemeAudio.pause()
    _phonemeAudio.currentTime = 0
    _phonemeAudio = null
  }
}

function stopNeural() {
  if (_neuralAudio) {
    _neuralAudio.pause()
    _neuralAudio.currentTime = 0
    _neuralAudio = null
  }
  window.speechSynthesis?.cancel()
}

function stopLetter() {
  if (_letterAudioRef.current) {
    _letterAudioRef.current.pause()
    _letterAudioRef.current.currentTime = 0
  }
}

function stopAllAudio() {
  stopNeural()
  stopPhoneme()
  stopLetter()
}

/** Edge 神经音（Web API / Electron hybrid / 系统音回退） */
export async function speakNeural(text, options = {}) {
  const clean = String(text || '').replace(/_+/g, '').replace(/\s{2,}/g, ' ').trim()
  if (!clean) return false

  const voice = options.voice || loadTtsVoice()
  const rate = options.rate ?? loadTtsRate()

  stopAllAudio()

  if (window.nativeTTS?.speakHybrid) {
    try {
      const result = await window.nativeTTS.speakHybrid({ text: clean, rate, voice })
      if (result?.audioUrl) {
        _neuralAudio = new Audio(result.audioUrl)
        _neuralAudio.playbackRate = rate
        await _neuralAudio.play()
        return true
      }
      if (result?.layer === 'L3-system') return false
    } catch {
      /* fall through */
    }
  }

  try {
    const url = `${TTS_API}?text=${encodeURIComponent(clean)}&voice=${encodeURIComponent(voice)}`
    _neuralAudio = new Audio(url)
    _neuralAudio.playbackRate = rate
    await _neuralAudio.play()
    return true
  } catch {
    const synth = window.speechSynthesis
    if (!synth) return false
    const u = new SpeechSynthesisUtterance(clean)
    u.lang = 'en-US'
    u.rate = rate
    synth.speak(u)
    return false
  }
}

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

export async function playWordAudio(word, rate = 0.88) {
  const key = String(word || '').toLowerCase().replace(/[^a-z'-]/g, '')
  if (!key) return
  await speakNeural(word, { rate })
}

/** 字母名 — 预生成 Edge MP3；播放逻辑对齐 useTTS（Blob 内存缓存 + 单例 Audio） */
const LETTER_AUDIO_BASE = '/audio/letters'
const _letterBlobCache = new Map()   // url → blob object URL（与 useTTS audioBlobCache 同思路）
const _letterPrefetching = new Set()
const _letterAudioRef = { current: null }
let _letterSpeakId = 0

const LETTER_SPOKEN_NAMES = {
  A: 'ay', B: 'bee', C: 'see', D: 'dee', E: 'ee', F: 'eff', G: 'gee',
  H: 'aitch', I: 'eye', J: 'jay', K: 'kay', L: 'ell', M: 'em', N: 'en',
  O: 'oh', P: 'pee', Q: 'cue', R: 'ar', S: 'ess', T: 'tee', U: 'you',
  V: 'vee', W: 'double you', X: 'ex', Y: 'why', Z: 'zee',
}

function letterMp3Url(upper) {
  return `${LETTER_AUDIO_BASE}/${upper}.mp3`
}

export function letterSpokenName(letter) {
  const upper = String(letter || '').trim()[0]?.toUpperCase()
  return LETTER_SPOKEN_NAMES[upper] || upper || ''
}

/** 预取单字母 MP3 进内存 Blob（对齐 useTTS.prefetch） */
async function prefetchLetterUrl(url) {
  if (!url || _letterBlobCache.has(url) || _letterPrefetching.has(url)) return
  _letterPrefetching.add(url)
  try {
    const res = await fetch(url, { credentials: 'omit' })
    if (!res.ok) throw new Error(String(res.status))
    const blob = await res.blob()
    const old = _letterBlobCache.get(url)
    if (old) URL.revokeObjectURL(old)
    _letterBlobCache.set(url, URL.createObjectURL(blob))
  } catch {
    _letterPrefetching.delete(url)
  }
}

async function playLetterFromCache(url, rate) {
  if (!url) return false
  try {
    if (!_letterAudioRef.current) _letterAudioRef.current = new Audio()
    const audio = _letterAudioRef.current
    audio.pause()
    audio.currentTime = 0
    audio.src = _letterBlobCache.get(url) || url
    audio.playbackRate = Math.min(1.2, Math.max(0.8, rate))
    audio.volume = 1
    await audio.play()
    return true
  } catch {
    return false
  }
}

function playLetterMp3(upper, rate, spoken) {
  if (!/^[A-Z]$/.test(upper)) return false
  const url = letterMp3Url(upper)
  const id = ++_letterSpeakId
  stopAllAudio()

  ;(async () => {
    if (_letterSpeakId !== id) return
    if (await playLetterFromCache(url, rate)) return
    if (_letterSpeakId !== id) return
    void prefetchLetterUrl(url)
    if (_letterSpeakId !== id) return
    speakNeural(spoken, { rate })
  })()
  return true
}

// 进入字母模块即并行预取 26 个 MP3 到内存（不等 idle）
export function preloadLetterAudio() {
  for (let i = 0; i < 26; i++) {
    void prefetchLetterUrl(letterMp3Url(String.fromCharCode(65 + i)))
  }
}

// 预加载音标 IPA（进入音标模块时调用）— 去重后预热全部真人切片
export function preloadPhonemeAudio() {
  const files = new Set(Object.values(IPA_TO_FILE))
  return warmAudio([...files].map((f) => `${PHONEME_AUDIO_BASE}/${f}.mp3`))
}

export function speakLetter(letter, rate = 0.95) {
  const ch = String(letter || '').trim()
  if (!ch) return
  const upper = ch[0].toUpperCase()
  const spoken = letterSpokenName(upper)
  if (!/^[A-Z]$/.test(upper)) {
    speakNeural(spoken, { rate })
    return
  }

  if (!playLetterMp3(upper, rate, spoken)) void speakNeural(spoken, { rate })
}

/** 音标 → 本地 MP3（Wikimedia 真人 IPA 录音），失败则 TTS 示例词兜底 */
export async function playPhoneme(symbol, rate = 1.0) {
  const sym = String(symbol || '').trim()
  const fileKey = ipaToAudioFile(sym)

  stopAllAudio()

  if (fileKey) {
    try {
      const audio = new Audio(`${PHONEME_AUDIO_BASE}/${fileKey}.mp3`)
      _phonemeAudio = audio
      audio.playbackRate = Math.min(1.2, Math.max(0.85, rate))
      await audio.play()
      return true
    } catch {
      stopPhoneme()
    }
  }

  // 兜底：TTS 示例词（0.82x 稍慢）
  const ex = PHONEME_EXAMPLES[sym]
  if (ex?.word) {
    await speakNeural(ex.word, { rate: 0.82 })
    return true
  }
  return false
}

/** 听含该音标的示例词（神经语音，可选） */
export async function playPhonemeExample(symbol, rate = 0.88) {
  const sym = String(symbol || '').trim()
  const ex = PHONEME_EXAMPLES[sym]
  if (!ex?.word) return false
  await speakNeural(ex.word, { rate })
  return true
}

export function getPhonemeExample(symbol) {
  return PHONEME_EXAMPLES[String(symbol || '').trim()] ?? null
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
