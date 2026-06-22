/**
 * wordAudio.js — 单词卡瞬时发音（对齐 useTTS / 26 字母逻辑）
 * Blob 内存缓存 + 单例 Audio + speakId 取消 + 先播后预取
 */

import ttsAudioMap from '../data/ttsAudioMap.json'

function getTtsApiBase() {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host === '127.0.0.1' || host === 'localhost') return '/api/tts'
  }
  return 'https://okenglish.site/api/tts'
}

function buildTtsApiUrl(text, voice = loadTtsVoice()) {
  const clean = String(text || '').replace(/_+/g, '').replace(/\s{2,}/g, ' ').trim()
  if (!clean) return null
  return `${getTtsApiBase()}?text=${encodeURIComponent(clean)}&voice=${encodeURIComponent(voice)}`
}
const SETTINGS_KEY = 'english_input_settings'

const _wordBlobCache = new Map()
const _wordPrefetching = new Set()
const _wordPrefetchPromises = new Map()
const _wordAudioRef = { current: null }
let _wordSpeakId = 0

const PLAY_TIMEOUT_MS = 1200

// ── Persistent audio cache (Cache Storage) ────────────────────────────────
// The server synthesizes audio on the fly (Edge-TTS), which is slow the FIRST
// time per phrase. We persist each fetched clip in Cache Storage so that on any
// later session it loads instantly from disk instead of re-hitting the network.
const TTS_CACHE_NAME = 'tts-audio-v1'
let _ttsCachePromise = null
function getTtsCache() {
  if (_ttsCachePromise) return _ttsCachePromise
  if (typeof caches === 'undefined') { _ttsCachePromise = Promise.resolve(null); return _ttsCachePromise }
  _ttsCachePromise = caches.open(TTS_CACHE_NAME).catch(() => null)
  return _ttsCachePromise
}

/** fetch() that reads from / writes to the persistent Cache Storage. */
async function cachedAudioFetch(url) {
  const cache = await getTtsCache()
  if (cache) {
    try {
      const hit = await cache.match(url)
      if (hit && hit.ok) return hit
    } catch { /* ignore */ }
  }
  const res = await fetch(url, { credentials: 'omit' })
  if (cache && res.ok) {
    try { await cache.put(url, res.clone()) } catch { /* quota/opaque — ignore */ }
  }
  return res
}

function normalizeKey(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function resolveMappedAudio(text) {
  const key = normalizeKey(text)
  if (!key) return null
  const direct = ttsAudioMap?.[key]
  if (direct) return direct
  const parts = key.split(' ').filter(Boolean)
  if (parts.length === 1) return ttsAudioMap?.[parts[0]] || null
  return null
}

function normalizeAudioUrl(url) {
  if (!url || typeof url !== 'string') return null
  const value = url.trim()
  if (!value) return null
  if (/^https?:\/\//i.test(value) || value.startsWith('/')) return value
  return `/tts/${value.replace(/^\.?\//, '')}`
}

function loadTtsVoice() {
  try {
    const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')
    return s.edgeVoice || 'en-US-AvaNeural'
  } catch {
    return 'en-US-AvaNeural'
  }
}

export function resolveWordAudioUrl(text, voice = loadTtsVoice()) {
  const clean = String(text || '').replace(/_+/g, '').replace(/\s{2,}/g, ' ').trim()
  if (!clean) return null
  const mapped = resolveMappedAudio(clean)
  if (mapped) return normalizeAudioUrl(mapped)
  return buildTtsApiUrl(clean, voice)
}

function fallbackUrlsFor(text, voice, primaryUrl) {
  const urls = [primaryUrl]
  const apiUrl = buildTtsApiUrl(text, voice)
  if (apiUrl && apiUrl !== primaryUrl) urls.push(apiUrl)
  return urls.filter(Boolean)
}

function prefetchWordUrl(url) {
  if (!url || _wordBlobCache.has(url)) return Promise.resolve()
  const pending = _wordPrefetchPromises.get(url)
  if (pending) return pending

  _wordPrefetching.add(url)
  const p = cachedAudioFetch(url)
    .then(res => {
      if (!res.ok) throw new Error(String(res.status))
      return res.blob()
    })
    .then(blob => {
      const old = _wordBlobCache.get(url)
      if (old) URL.revokeObjectURL(old)
      _wordBlobCache.set(url, URL.createObjectURL(blob))
    })
    .catch(() => {})
    .finally(() => {
      _wordPrefetching.delete(url)
      _wordPrefetchPromises.delete(url)
    })

  _wordPrefetchPromises.set(url, p)
  return p
}

function ensureWordAudio() {
  if (!_wordAudioRef.current) _wordAudioRef.current = new Audio()
  return _wordAudioRef.current
}

function applyWordAudioSettings(audio, rate, volume) {
  audio.playbackRate = Math.min(1.5, Math.max(0.5, rate))
  audio.volume = Math.max(0, Math.min(1, volume))
}

/** Blob 命中：在点击栈内同步起播（保留用户手势） */
function playWordBlobSync(url, rate = 1.0, volume = 1) {
  const blobUrl = _wordBlobCache.get(url)
  if (!blobUrl) return false
  try {
    const audio = ensureWordAudio()
    audio.pause()
    audio.currentTime = 0
    audio.src = blobUrl
    applyWordAudioSettings(audio, rate, volume)
    void audio.play()
    return true
  } catch {
    return false
  }
}

async function playWordFromUrl(url, rate = 1.0, volume = 1) {
  if (!url) return false
  try {
    const audio = ensureWordAudio()
    audio.pause()
    audio.currentTime = 0
    audio.src = _wordBlobCache.get(url) || url
    applyWordAudioSettings(audio, rate, volume)
    await Promise.race([
      audio.play(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('play-timeout')), PLAY_TIMEOUT_MS)),
    ])
    return true
  } catch {
    return false
  }
}

function speakWordFallback(text, rate = 1.0) {
  const clean = String(text || '').trim()
  if (!clean) return
  window.speechSynthesis?.cancel()
  const u = new SpeechSynthesisUtterance(clean)
  u.lang = 'en-US'
  u.rate = rate
  window.speechSynthesis?.speak(u)
}

export function stopWordAudio() {
  if (_wordAudioRef.current) {
    _wordAudioRef.current.pause()
    _wordAudioRef.current.currentTime = 0
  }
  window.speechSynthesis?.cancel()
}

/** 点击即播：Blob 同步起播；未缓存则网络/预取/系统音兜底 */
export function playWordImmediate(text, options = {}) {
  const clean = String(text || '').replace(/_+/g, '').replace(/\s{2,}/g, ' ').trim()
  if (!clean) return

  const rate = options.rate ?? 1.0
  const volume = options.volume ?? 1
  const voice = options.voice || loadTtsVoice()
  const url = resolveWordAudioUrl(clean, voice)
  if (!url) return

  const id = ++_wordSpeakId
  stopWordAudio()

  if (playWordBlobSync(url, rate, volume)) return

  // No cached audio: speak immediately inside the user-gesture stack.
  speakWordFallback(clean, rate)

  const urls = fallbackUrlsFor(clean, voice, url)
  ;(async () => {
    for (const candidate of urls) {
      if (_wordSpeakId !== id) return
      await prefetchWordUrl(candidate)
    }
  })()
}

/**
 * 顺序连播专用：fetch 音频 → Audio element 播放 → onended 后 resolve
 * 不依赖 speechSynthesis，不受用户手势上下文限制
 */
export function playWordAsync(text, options = {}) {
  const clean = String(text || '').replace(/_+/g, '').replace(/\s{2,}/g, ' ').trim()
  if (!clean) return Promise.resolve()

  const rate   = options.rate   ?? 0.92
  const volume = options.volume ?? 1
  const voice  = options.voice  || loadTtsVoice()
  const url    = resolveWordAudioUrl(clean, voice)
  if (!url) return Promise.resolve()

  return new Promise(resolve => {
    const maxMs = Math.max(3000, clean.length * 110)
    let settled = false
    function done() {
      if (settled) return
      settled = true
      clearTimeout(tid)
      audio.removeEventListener('ended',  done)
      audio.removeEventListener('error',  done)
      setTimeout(resolve, 220) // 句间停顿
    }
    const tid = setTimeout(done, maxMs)

    const audio = ensureWordAudio()
    audio.pause()
    audio.currentTime = 0
    audio.removeEventListener('ended', done) // 清旧监听
    audio.removeEventListener('error', done)
    audio.addEventListener('ended', done)
    audio.addEventListener('error', done)
    applyWordAudioSettings(audio, rate, volume)

    const cached = _wordBlobCache.get(url)
    if (cached) {
      audio.src = cached
      audio.play().catch(done)
    } else {
      cachedAudioFetch(url)
        .then(r => { if (!r.ok) throw new Error(String(r.status)); return r.blob() })
        .then(blob => {
          const blobUrl = URL.createObjectURL(blob)
          _wordBlobCache.set(url, blobUrl)
          if (settled) return // 已超时
          audio.src = blobUrl
          audio.play().catch(done)
        })
        .catch(() => {
          if (settled) return
          speakWordFallback(clean, rate)
          // speechSynthesis 无可靠 ended 回调，按字数估时
          setTimeout(done, Math.max(1200, clean.length * 90))
        })
    }
  })
}

/** 进入单词单元时预取；currentIdx 对应词优先 */
export function preloadWords(words, options = {}) {
  const voice = options.voice || loadTtsVoice()
  const list = Array.isArray(words) ? words : []
  const currentIdx = Number.isInteger(options.currentIdx) ? options.currentIdx : 0
  const ordered = [
    ...list.slice(currentIdx, currentIdx + 1),
    ...list.slice(currentIdx + 1),
    ...list.slice(0, currentIdx),
  ]
  for (const item of ordered) {
    const text = typeof item === 'string' ? item : item?.word
    const url = resolveWordAudioUrl(text, voice)
    if (url) void prefetchWordUrl(url)
  }
}
