import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import pepWords from '../data/pep_words.json'
import renaiJuniorWords from '../data/renai_junior_words.json'
import bsdaWords from '../data/bsda_words.json'
import { IconSpeaker, IconArrowLeft } from './Icons'
import PageBackBar from './PageBackBar'
import WordMatch from './WordMatch'
import OceanBg from './OceanBg'
import { useSpeechRecognition, matchWord } from '../hooks/useSpeechRecognition'
import { useSound } from '../hooks/useSound'

// 蓝色声波动画（跟读 listening 时显示）
function SoundWave({ active }) {
  const delays = [0, 0.15, 0.3, 0.15, 0]
  return (
    <span className="flex items-center justify-center gap-[3px] h-5">
      {delays.map((d, i) => (
        <span key={i} className="du-wave-bar" style={{
          height: '100%',
          animationDelay: `${d}s`,
          animationPlayState: active ? 'running' : 'paused',
        }} />
      ))}
    </span>
  )
}

// ── IPA syllabification (MOP) — mirrors gen_syllable_audio.py ────────────────

const IPA_VOWELS = new Set(['æ','e','ɪ','ɒ','ʌ','ʊ','ə','i','u',
  'iː','uː','ɑː','ɔː','ɜː','eɪ','aɪ','ɔɪ','əʊ','aʊ','ɪə','eə','ʊə'])
const IPA_PHONEMES = ['tʃ','dʒ','iː','uː','ɑː','ɔː','ɜː','eɪ','aɪ','ɔɪ',
  'əʊ','aʊ','ɪə','eə','ʊə','ŋ','ʃ','ʒ','θ','ð','p','b','t','d','k','g','ɡ',
  'f','v','s','z','h','m','n','l','r','w','j','y','æ','e','ɪ','ɒ','ʌ','ʊ','ə','i','u']
const IPA_ONSETS = new Set(['pl','pr','tr','dr','kl','kr','gl','gr','fr','fl',
  'br','bl','sl','sm','sn','sp','st','sk','sw','θr','ʃr','tʃ','dʒ','tw','dw',
  'kw','gw','mj','bj','pj','fj','vj','kj','gj','nj','lj','tj','dj','sj','hj'])

function tokenizeIPA(ipa) {
  const s = ipa.replace(/[/\\ˈˌ·.()\s]/g, '')
  const tokens = []
  let i = 0
  while (i < s.length) {
    let matched = false
    for (const ph of IPA_PHONEMES) {
      if (s.startsWith(ph, i)) {
        tokens.push({ ph, isV: IPA_VOWELS.has(ph) })
        i += ph.length; matched = true; break
      }
    }
    if (!matched) i++
  }
  return tokens
}

function syllabifyIPA(ipa) {
  if (!ipa) return []
  const tokens = tokenizeIPA(ipa)
  const nuclei = tokens.map((t, i) => t.isV ? i : -1).filter(i => i >= 0)
  if (!nuclei.length) return [tokens.map(t => t.ph).join('')]
  const bounds = new Set([0])
  for (let n = 0; n < nuclei.length - 1; n++) {
    const a = nuclei[n], b = nuclei[n + 1]
    const cons = tokens.slice(a + 1, b).map(t => t.ph)
    if (!cons.length) continue
    let split = a + 1
    for (let k = cons.length; k >= 1; k--) {
      const onset = cons.slice(-k).join('')
      if (k === 1 || IPA_ONSETS.has(onset)) { split = b - k; break }
    }
    bounds.add(split)
  }
  const sorted = [...bounds].sort((a, b) => a - b)
  return sorted.map((start, i) => {
    const end = sorted[i + 1] ?? tokens.length
    return tokens.slice(start, end).map(t => t.ph).join('')
  }).filter(Boolean)
}

// ── Orthographic syllabification (visual only) ────────────────────────────────

function syllabifyOne(word) {
  if (!word) return []
  const clean = word.replace(/[^a-zA-Z]/g, '')
  if (clean.length <= 3) return [word]
  const lower = clean.toLowerCase()
  const isVowel = c => 'aeiou'.includes(c)

  // Step1: 把 digraph 视为单一辅音单元
  const DIGRAPHS = ['tch', 'ch', 'sh', 'th', 'ph', 'wh', 'ng', 'ck', 'qu']
  const units = []
  let i = 0
  while (i < lower.length) {
    let matched = false
    for (const dg of DIGRAPHS) {
      if (lower.startsWith(dg, i)) {
        units.push({ chars: dg, start: i, isVowel: false })
        i += dg.length; matched = true; break
      }
    }
    if (!matched) {
      const c = lower[i]
      units.push({ chars: c, start: i, isVowel: isVowel(c) })
      i++
    }
  }

  // Step2: 找元音组起始位置
  const vStarts = []
  for (let j = 0; j < units.length; j++) {
    if (units[j].isVowel && (j === 0 || !units[j - 1].isVowel)) vStarts.push(j)
  }
  if (vStarts.length <= 1) return [word]

  // Step3: 按最大起始原则（MOP）确定切点
  const VALID_ONSETS = new Set([
    'bl','br','cl','cr','dr','fl','fr','gl','gr','pl','pr',
    'sk','sl','sm','sn','sp','st','sw','tr','tw','sc',
    'str','spr','spl','scr'
  ])
  const splits = []
  for (let v = 0; v < vStarts.length - 1; v++) {
    let v1End = vStarts[v]
    while (v1End + 1 < units.length && units[v1End + 1].isVowel) v1End++
    const v2Start = vStarts[v + 1]
    const cons = []
    for (let k = v1End + 1; k < v2Start; k++) cons.push(k)

    let splitPoint
    if (cons.length === 0) {
      splitPoint = units[v2Start].start
    } else if (cons.length === 1) {
      // 单辅音：归下一音节起始（MOP）
      splitPoint = units[cons[0]].start
    } else {
      // 多辅音：找最长合法起始簇，其余留作韵尾
      let onsetStart = cons.length - 1
      for (let k = 0; k < cons.length; k++) {
        const sfx = cons.slice(k).map(idx => units[idx].chars).join('')
        if (VALID_ONSETS.has(sfx)) { onsetStart = k; break }
      }
      splitPoint = units[cons[onsetStart]].start
    }
    splits.push(splitPoint)
  }

  const result = []; let prev = 0
  for (const sp of splits) { if (sp > prev) result.push(word.slice(prev, sp)); prev = sp }
  if (prev < word.length) result.push(word.slice(prev))
  return result.filter(s => s.length > 0)
}

// Returns [{text, isSep, idx}] — idx is index among real (non-sep) syllables
function syllabify(word) {
  let raw = []
  if (word.includes(' ')) {
    // Phrase: each space-separated token is ONE colored unit — no intra-word syllabification
    word.split(' ').forEach((w, i) => { if (i > 0) raw.push(' '); if (w) raw.push(w) })
  } else if (word.includes('-')) {
    word.split('-').forEach((w, i) => { if (i > 0) raw.push('-'); syllabifyOne(w).forEach(s => raw.push(s)) })
  } else {
    raw = syllabifyOne(word)
  }
  let idx = 0
  return raw.map(text => ({ text, isSep: text === ' ' || text === '-', idx: (text === ' ' || text === '-') ? -1 : idx++ }))
}

// ── Web Audio globals ─────────────────────────────────────────────────────────

let _audioCtx = null
function getCtx() {
  if (!_audioCtx || _audioCtx.state === 'closed') {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (_audioCtx.state === 'suspended') _audioCtx.resume()
  return _audioCtx
}

const urlCache = new Map()   // word -> mp3 url | null
const bufCache = new Map()   // url  -> AudioBuffer

async function fetchUrl(word) {
  // Multi-word phrases (e.g. "eat breakfast") → skip dict API, always use TTS
  if (word.includes(' ')) return null
  const key = word.toLowerCase().split(' ')[0]
  if (urlCache.has(key)) return urlCache.get(key)
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(key)}`,
      { signal: AbortSignal.timeout(5000) })
    if (!res.ok) throw new Error()
    const data = await res.json()
    const raw = data[0]?.phonetics?.find(p => p.audio)?.audio || null
    const url = raw ? (raw.startsWith('http') ? raw : 'https:' + raw) : null
    urlCache.set(key, url); return url
  } catch { return null }
}

async function fetchBuffer(url) {
  if (bufCache.has(url)) return bufCache.get(url)
  try {
    const ab = await fetch(url).then(r => r.arrayBuffer())
    const buf = await getCtx().decodeAudioData(ab)
    bufCache.set(url, buf); return buf
  } catch { return null }
}

let _currentSource = null
function stopAudio() {
  try { _currentSource?.stop() } catch {}
  _currentSource = null
}

function playBuffer(buffer, startSec = 0, endSec = null, rate = 1.0) {
  stopAudio()
  const ctx = getCtx()
  const src = ctx.createBufferSource()
  src.buffer = buffer
  src.playbackRate.value = rate
  src.connect(ctx.destination)
  const dur = endSec != null ? endSec - startSec : buffer.duration - startSec
  src.start(0, startSec, dur)
  _currentSource = src
  return src
}

// ── TTS fallback ──────────────────────────────────────────────────────────────

const TTS_API = 'https://okenglish.site/api/tts'

async function speak(text, rate = 0.82) {
  // Try server neural TTS first
  try {
    const url = `${TTS_API}?text=${encodeURIComponent(text)}&voice=en-US-AvaNeural`
    const a = new Audio(url)
    await a.play()
    return
  } catch { /* fall through to system voice */ }
  window.speechSynthesis?.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'; u.rate = rate; u.pitch = 1.0
  window.speechSynthesis?.speak(u)
}

// ── useWordAudio hook ─────────────────────────────────────────────────────────

function useWordAudio(word, ipa = '', speed = 1.0) {
  const syllables    = useMemo(() => syllabify(word), [word])
  const realSyls     = useMemo(() => syllables.filter(s => !s.isSep), [syllables])
  const rawIPASyls   = useMemo(() => syllabifyIPA(ipa), [ipa])
  // Force IPA chunk count to match word chunk count
  const ipaSyllables = useMemo(() => {
    // Phrase: show IPA as a single unsplit string
    if (word.includes(' ')) return rawIPASyls.length ? [rawIPASyls.join('')] : []
    const n = realSyls.length
    if (!rawIPASyls.length || n === 0) return rawIPASyls
    if (rawIPASyls.length === n) return rawIPASyls
    const full = rawIPASyls.join('')
    if (n === 1) return [full]
    const chars = [...full]
    const chunkSize = chars.length / n
    return Array.from({ length: n }, (_, i) => {
      const start = Math.round(i * chunkSize)
      const end   = Math.round((i + 1) * chunkSize)
      return chars.slice(start, end).join('')
    }).filter(Boolean)
  }, [rawIPASyls, realSyls.length, word])

  const [activeSylIdx, setActiveSylIdx] = useState(-1)
  const [loading, setLoading]           = useState(false)
  const timersRef = useRef([])
  const bufRef    = useRef(null)  // 预加载缓冲，playFull/playSyl 同步读取，消除延迟

  function clearTimers() { timersRef.current.forEach(clearTimeout); timersRef.current = [] }
  function reset() { clearTimers(); stopAudio(); setActiveSylIdx(-1) }

  // word 变化时预加载音频缓冲 → bufRef.current
  useEffect(() => {
    bufRef.current = null
    let alive = true
    setLoading(true)
    fetchUrl(word)
      .then(url => {
        if (!url || !alive) { if (alive) setLoading(false); return }
        return fetchBuffer(url).then(buf => {
          if (alive) { bufRef.current = buf; setLoading(false) }
        })
      })
      .catch(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [word])

  // 均等分配高亮，wallClockMs 已是实际播放时长
  function scheduleHighlight(wallClockMs) {
    const n = realSyls.length
    if (n === 0) return
    const perSyl = wallClockMs / n
    realSyls.forEach((s, i) => {
      timersRef.current.push(setTimeout(() => setActiveSylIdx(s.idx), i * perSyl))
    })
    timersRef.current.push(setTimeout(() => setActiveSylIdx(-1), wallClockMs + 400))
  }

  // 播全词，顺序点亮音节 — 同步读取 bufRef，无 await 延迟
  function playFull() {
    reset()
    const buf = bufRef.current
    if (buf) {
      const wallMs = (buf.duration / speed) * 1000
      scheduleHighlight(wallMs)
      playBuffer(buf, 0, null, speed)
    } else {
      const fallbackMs = realSyls.length * (420 / speed)
      scheduleHighlight(fallbackMs)
      speak(word, 0.5 * speed)
    }
  }

  // 点音节也播全词，只高亮该音节 — 同步
  function playSyl(sylIdx) {
    reset()
    setActiveSylIdx(sylIdx)
    timersRef.current.push(setTimeout(() => setActiveSylIdx(-1), 1500))
    const buf = bufRef.current
    if (buf) { playBuffer(buf, 0, null, speed); return }
    speak(word, 0.5 * speed)
  }

  async function playIPASyl(i) {
    reset()
    setActiveSylIdx(i)
    timersRef.current.push(setTimeout(() => setActiveSylIdx(-1), 1500))
    const src = `${import.meta.env.BASE_URL}audio/syllables/${word.toLowerCase().replace(/\s+/g,'_')}/${i}.mp3`
    const audio = new Audio(src)
    const ok = await audio.play().then(() => true).catch(() => false)
    if (!ok) speak(word, 0.5 * speed)
  }

  useEffect(() => { return reset }, [word])
  return { syllables, ipaSyllables, activeSylIdx, loading, playFull, playSyl, playIPASyl }
}

// ── SyllableWord ──────────────────────────────────────────────────────────────

const SYL_COLORS = [
  { base: 'text-blue-300',   active: 'text-blue-100'   },
  { base: 'text-orange-300', active: 'text-orange-100' },
  { base: 'text-emerald-300',active: 'text-emerald-100'},
  { base: 'text-pink-300',   active: 'text-pink-100'   },
]

function SyllableWord({ syllables, activeSylIdx, onSylClick, size = 'text-4xl' }) {
  return (
    <span className={`${size} font-bold tracking-wide select-none inline-flex items-baseline flex-wrap`}>
      {syllables.map((s, i) => {
        if (s.isSep) return <span key={i} className="inline-block" style={{ width: '0.28em' }} />
        const col = SYL_COLORS[s.idx % SYL_COLORS.length]
        const active = activeSylIdx === s.idx
        const prevIsRealSyl = i > 0 && !syllables[i - 1].isSep
        return (
          <span key={i} className="inline-flex items-baseline">
            {prevIsRealSyl && (
              <span className="text-gray-500 select-none" style={{ fontSize: '0.4em', margin: '0 0.2em', lineHeight: 1 }}>·</span>
            )}
            <span
              onClick={e => { e.stopPropagation(); onSylClick(s.idx) }}
              className={`cursor-pointer transition-all duration-150
                ${active
                  ? `${col.active} scale-110 underline underline-offset-4 drop-shadow-[0_0_10px_currentColor]`
                  : `${col.base} hover:opacity-75`}`}>
              {s.text}
            </span>
          </span>
        )
      })}
    </span>
  )
}

// ── IPA Syllable Strip ────────────────────────────────────────────────────────

const IPA_PAL = [
  { idle:'text-teal-300 hover:text-teal-100',   active:'text-teal-100 scale-110' },
  { idle:'text-violet-300 hover:text-violet-100',active:'text-violet-100 scale-110' },
  { idle:'text-amber-300 hover:text-amber-100',  active:'text-amber-100 scale-110' },
  { idle:'text-rose-300 hover:text-rose-100',    active:'text-rose-100 scale-110' },
]

// ɪ 和 ʊ 在普通字体下太像 i/u，加特殊样式区分
function renderIPAText(text) {
  const parts = text.split(/(ɪ|ʊ)/)
  if (parts.length === 1) return text
  return parts.map((p, i) => {
    if (p === 'ɪ') return <span key={i} className="font-bold text-yellow-300">ɪ</span>
    if (p === 'ʊ') return <span key={i} className="font-bold text-yellow-300">ʊ</span>
    return p
  })
}

function IPASyllableStrip({ ipaSyllables, activeSylIdx, onPlayWord, size = 'text-lg' }) {
  if (!ipaSyllables?.length) return null
  return (
    <button
      onClick={e => { e.stopPropagation(); onPlayWord?.() }}
      className="flex items-center gap-0 flex-wrap justify-center cursor-pointer select-none leading-tight"
    >
      {ipaSyllables.map((syl, i) => {
        const col = SYL_COLORS[i % SYL_COLORS.length]
        const active = activeSylIdx === i
        return (
          <span key={i} className="flex items-center">
            {i > 0 && <span className="text-gray-500 select-none" style={{ fontSize: '0.4em', margin: '0 0.2em', lineHeight: 1 }}>·</span>}
            <span className={`${size} font-mono transition-all duration-150
              ${active
                ? `${col.active} scale-110 underline underline-offset-4 drop-shadow-[0_0_10px_currentColor]`
                : col.base}`}>
              {renderIPAText(syl)}
            </span>
          </span>
        )
      })}
    </button>
  )
}

// ── Progress helpers ──────────────────────────────────────────────────────────

function loadProgress() { try { return JSON.parse(localStorage.getItem('vocab_progress') || '{}') } catch { return {} } }
function saveProgress(bookName, unitIdx, wordIdx, val) {
  try { const s = loadProgress(); s[`vocab_${bookName}_${unitIdx}_${wordIdx}`] = val; localStorage.setItem('vocab_progress', JSON.stringify(s)) } catch {}
}
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}
function makeBlank(w) {
  if (w.includes(' ')) return w.split(' ').map(p => p.length <= 2 ? p : p[0] + '_'.repeat(p.length - 2) + p[p.length - 1]).join(' ')
  return w.length <= 2 ? w : w[0] + '_'.repeat(w.length - 2) + w[w.length - 1]
}

// ── Recording hook ────────────────────────────────────────────────────────────

function useRecorder() {
  const [recState, setRecState] = useState('idle')
  const [recUrl, setRecUrl]     = useState(null)
  const [recErr, setRecErr]     = useState(null)
  const mrRef = useRef(null); const chunksRef = useRef([]); const timerRef = useRef(null)

  function reset() {
    clearTimeout(timerRef.current)
    try { mrRef.current?.stop() } catch {}
    mrRef.current?.stream?.getTracks().forEach(t => t.stop())
    mrRef.current = null
    setRecState('idle')
    setRecErr(null)
    setRecUrl(prev => { if (prev) URL.revokeObjectURL(prev); return null })
  }
  async function startRec() {
    // 先停掉其他音频，但不重置录音状态（避免闪烁）
    stopAudio(); window.speechSynthesis?.cancel()
    setRecErr(null)
    // 显示"准备中"防止重复点击
    setRecState('preparing')
    let stream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      setRecState('idle')
      setRecErr('需要麦克风权限')
      return
    }
    // 清理上一次录音
    if (mrRef.current) {
      try { mrRef.current.stop() } catch {}
      mrRef.current?.stream?.getTracks().forEach(t => t.stop())
    }
    setRecUrl(prev => { if (prev) URL.revokeObjectURL(prev); return null })
    chunksRef.current = []
    const mr = new MediaRecorder(stream); mrRef.current = mr
    mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    mr.onstop = () => {
      stream.getTracks().forEach(t => t.stop())
      if (chunksRef.current.length > 0) {
        setRecUrl(URL.createObjectURL(new Blob(chunksRef.current, { type: 'audio/webm' })))
        setRecState('recorded')
      } else {
        setRecState('idle')
      }
    }
    mr.start(); setRecState('recording')
    timerRef.current = setTimeout(() => { if (mr.state === 'recording') mr.stop() }, 4000)
  }
  function stopRec() { clearTimeout(timerRef.current); if (mrRef.current?.state === 'recording') mrRef.current.stop() }
  function playRec() { if (recUrl) { stopAudio(); window.speechSynthesis?.cancel(); new Audio(recUrl).play() } }
  useEffect(() => () => { clearTimeout(timerRef.current); reset() }, [])
  return { recState, recUrl, recErr, startRec, stopRec, playRec, reset }
}

// ── Book selector ─────────────────────────────────────────────────────────────

const VOCAB_BOOKS = [...pepWords, ...renaiJuniorWords, ...bsdaWords]

const GRADE_COLORS = {
  3: 'from-green-700 to-green-900',
  4: 'from-blue-700 to-blue-900',
  5: 'from-purple-700 to-purple-900',
  6: 'from-orange-700 to-orange-900',
  7: 'from-teal-700 to-teal-900',
  8: 'from-cyan-700 to-cyan-900',
  9: 'from-indigo-700 to-indigo-900',
  '高中': 'from-rose-700 to-rose-900',
}

function bookSubtitle(book) {
  if (typeof book.grade !== 'number') return `${book.grade} · 北师大版`
  return `${book.grade}年级 · ${book.sem === 'up' ? '上' : '下'}册`
}

function BookGrid({ onSelect, onBack }) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      {onBack && <PageBackBar onBack={onBack} label="返回练习" />}
      <h2 className="text-white text-xl font-bold mb-5">选择年级册次</h2>
      <div className="grid grid-cols-2 gap-4">
        {VOCAB_BOOKS.map(book => (
          <button key={book.bookName} onClick={() => onSelect(book)}
            className={`rounded-2xl bg-gradient-to-br ${GRADE_COLORS[book.grade] || 'from-slate-700 to-slate-900'} p-6 text-left hover:opacity-90 active:scale-95 transition-all`}>
            <div className="text-sm text-white/60 mb-1">{bookSubtitle(book)}</div>
            <div className="text-white font-bold text-lg">{book.bookName}</div>
            <div className="text-white/50 text-sm mt-2">{book.units.length} 单元 · {book.units.reduce((s, u) => s + u.words.length, 0)} 词</div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Unit selector ─────────────────────────────────────────────────────────────
/** Max words per flash-card session (bottom grid is 3 cols × 4 rows at most). */
const WORDS_PER_CARD = 12

function chunkUnitWords(words, maxPerChunk = WORDS_PER_CARD) {
  const chunks = []
  let offset = 0
  for (let i = 0; i < words.length; i += maxPerChunk) {
    const slice = words.slice(i, i + maxPerChunk)
    chunks.push({ words: slice, offset })
    offset += slice.length
  }
  return chunks
}

function unitChunkLabel(unitNum, chunkIndex, totalChunks) {
  if (totalChunks <= 1) return `Unit ${unitNum}`
  if (totalChunks === 2) return `Unit ${unitNum}${chunkIndex === 0 ? 'A' : 'B'}`
  return `Unit ${unitNum} · ${chunkIndex + 1}/${totalChunks}`
}

function UnitGrid({ book, progress, onSelect, onBack, isMember = true, onShowLogin }) {
  const allChunks = book.units.flatMap((unit, ui) => {
    const parts = chunkUnitWords(unit.words)
    return parts.map((half, hi) => ({ unit, ui, half, hi, parts }))
  })
  const halfIdx = Math.ceil(allChunks.length / 2)
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <PageBackBar onBack={onBack} label="返回选册" />
      <h2 className="text-white text-xl font-bold mb-4">{book.bookName}</h2>
      {!isMember && (
        <p className="text-xs text-gray-500 mb-4">前半部分单元免费体验，开通会员解锁全部单元</p>
      )}
      <div className="grid grid-cols-2 gap-4">
        {allChunks.map(({ unit, ui, half, hi, parts }, idx) => {
          const label = unitChunkLabel(unit.unit, hi, parts.length)
          const total = half.words.length
          const known = half.words.filter((_, wi) => (progress[`vocab_${book.bookName}_${ui}_${half.offset + wi}`] || 0) >= 2).length
          const pct = total ? Math.round(known / total * 100) : 0
          const locked = !isMember && idx >= halfIdx
          return (
            <button key={`${ui}-${hi}`}
              onClick={() => locked ? onShowLogin?.() : onSelect({ ...unit, words: half.words }, ui, half.offset)}
              className={`rounded-xl bg-slate-800 border border-slate-700 hover:border-gray-600 p-5 text-left transition-all active:scale-95 relative ${locked ? 'opacity-60' : ''}`}>
              <div className="text-xs text-gray-500 mb-1">{label} {locked && '🔒'}</div>
              <div className="text-white font-semibold text-base mb-3">{unit.title}</div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-1.5">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <div className="text-xs text-gray-500">{known}/{total} 已掌握</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Flash card ────────────────────────────────────────────────────────────────

function FlashCards({ book, unit, unitIdx, wordOffset = 0, progress, onBack, onProgressChange, settings, onXp, onCrystal }) {
  const [idx, setIdx]             = useState(0)
  const [localSeen, setLocalSeen] = useState({})
  const [moXie, setMoXie]         = useState(false)
  const [moXieDone, setMoXieDone] = useState({}) // idx → true, tracks correct dictations
  const [moInput, setMoInput]     = useState('')
  const [moResult, setMoResult]   = useState(null)
  const [showMatch, setShowMatch]  = useState(false)
  const moInputRef                = useRef()
  // 跟读 / 译读 模式（读单词→识别→翻卡）
  const [duMode, setDuMode]   = useState(null)    // null | 'read'（看英文读英文） | 'translate'（看中文读英文）
  const [flipped, setFlipped] = useState(false)   // 当前卡是否已翻面
  const [duResult, setDuResult] = useState(null)  // 'pass' | 'fail' | 'skip' | null
  const [duMsg, setDuMsg]     = useState('')
  const [duMarks, setDuMarks] = useState({})      // idx → 'pass' | 'skip'
  const { supported: srSupported, listening: srListening, heard: srHeard, listen: srListen, stop: srStop } = useSpeechRecognition()
  const duOn = duMode != null
  const cancelTokenRef = useRef(0)
  // ── 奖励相关 ────────────────────────────────────────
  const comboRef = useRef(0)
  const statsRef = useRef({ pass: 0, skip: 0 })
  const [xpFlies, setXpFlies] = useState([])

  function flyXp(amount, color = '#fde68a') {
    const id = Date.now() + Math.random()
    setXpFlies(f => [...f, { id, amount, color }])
    setTimeout(() => setXpFlies(f => f.filter(x => x.id !== id)), 1100)
  }
  function rewardPass() {
    statsRef.current.pass += 1
    comboRef.current += 1
    const combo = comboRef.current
    const base = 2 + (combo >= 3 ? 1 : 0)
    onXp?.(base)
    flyXp(base, combo >= 3 ? '#c4b5fd' : '#fde68a')
    try { playBubble?.() } catch {}
    if (combo === 5) onCrystal?.('purple', 1, 'combo_5', { combo, source: 'vocab_read', book: book.bookName, unit: unitIdx })
    else if (combo === 10) onCrystal?.('purple', 2, 'combo_10', { combo, source: 'vocab_read', book: book.bookName, unit: unitIdx })
  }
  function rewardSkip() {
    statsRef.current.skip += 1
    comboRef.current = 0
  }
  function rewardUnitComplete() {
    const { pass, skip } = statsRef.current
    const total = unit.words.length
    onXp?.(5)
    flyXp(5, '#60a5fa')
    onCrystal?.('blue', 1, 'vocab_read_done', { book: book.bookName, unit: unitIdx, pass, skip, total })
    try { playFireworks?.() } catch {}
    if (skip === 0 && pass === total) {
      onXp?.(10)
      setTimeout(() => flyXp(10, '#86efac'), 300)
      onCrystal?.('green', 2, 'vocab_read_perfect', { book: book.bookName, unit: unitIdx, total })
    }
  }
  // 进入跟读时重置 combo / stats
  useEffect(() => {
    if (duOn) { comboRef.current = 0; statsRef.current = { pass: 0, skip: 0 } }
  }, [duOn])
  const { playCorrect, playError, playVictory, playFireworks, playBubble } = useSound(settings)
  const word = unit.words[idx]
  const pendingPlayRef = useRef(false)
  const { syllables, ipaSyllables, activeSylIdx, loading, playFull, playSyl, playIPASyl } = useWordAudio(word.word, word.ipa || '')

  // Preload current + next word audio buffers to eliminate click-to-play delay
  useEffect(() => {
    fetchUrl(word.word).then(url => { if (url) fetchBuffer(url) })
    const next = unit.words[idx + 1]
    if (next?.word) fetchUrl(next.word).then(url => { if (url) fetchBuffer(url) })
  }, [idx])

  // 默写完成判断
  const allMoXieDone = Object.keys(moXieDone).length >= unit.words.length

  useEffect(() => {
    const key = `vocab_${book.bookName}_${unitIdx}_${wordOffset + idx}`
    if (!(progress[key] >= 1) && !localSeen[idx]) {
      saveProgress(book.bookName, unitIdx, wordOffset + idx, 1)
      setLocalSeen(m => ({ ...m, [idx]: true }))
      onProgressChange()
    }
  }, [idx])

  useEffect(() => { setMoInput(''); setMoResult(null); if (!duOn) { setFlipped(false); setDuResult(null); setDuMsg('') } }, [idx])

  useEffect(() => {
    if (pendingPlayRef.current) { pendingPlayRef.current = false; playFull() }
  }, [idx])

  // ── 跟读 / 译读 会话驱动：识别→翻卡，3 次失败跳过；无声自动重试 2 次不计失败 ──
  // alive 通过 cancelToken 双重保险：组件卸载、idx/duMode 变化、或手动按钮中断都会 cancel。
  useEffect(() => {
    if (!duMode) return
    const w = unit.words[idx]
    const myToken = ++cancelTokenRef.current
    let fails = 0          // 真正没读对的次数（满 3 跳过）
    let softTries = 0      // 无声/中断软重试次数（不计失败）
    let timer

    function alive() { return cancelTokenRef.current === myToken }

    function nextCard() {
      if (!alive()) return
      if (idx < unit.words.length - 1) setIdx(i => i + 1)
      else {
        rewardUnitComplete()
        setDuMode(null); setFlipped(false); setDuResult('pass'); setDuMsg('🎉 全部读完！'); playVictory?.()
      }
    }

    function attempt() {
      if (!alive()) return
      setDuResult(null)
      setDuMsg('🎤 看中文，读出英文…')
      srListen({
        onResult: (text, alts) => {
          if (!alive()) return
          if (typeof window !== 'undefined') console.debug('[跟读]', { target: w.word, heard: text, alts })
          const ok = matchWord(w.word, alts && alts.length ? alts : [text])
          if (ok) {
            softTries = 0
            playCorrect?.()
            rewardPass()
            setFlipped(true); setDuResult('pass'); setDuMsg('✓ 读对了！')
            setDuMarks(m => ({ ...m, [idx]: 'pass' }))
            saveProgress(book.bookName, unitIdx, wordOffset + idx, 2)
            onProgressChange()
            timer = setTimeout(() => { if (alive()) { setFlipped(false); nextCard() } }, 1200)
          } else {
            softTries = 0
            miss(`没听清「${text || '…'}」`)
          }
        },
        onError: (err) => {
          if (!alive()) return
          if (err === 'unsupported') { setDuMsg('此浏览器不支持语音识别，请用 Chrome 打开'); setDuMode(null); return }
          if (err === 'not-allowed' || err === 'service-not-allowed') { setDuMsg('请允许麦克风权限后重试'); setDuMode(null); return }
          if (err === 'aborted') return
          if (err === 'no-speech' || err === 'audio-capture' || err === 'network') {
            if (softTries < 2) {
              softTries += 1
              setDuMsg(`🔇 没听到声音，请大声一点（重试 ${softTries}/2）`)
              timer = setTimeout(attempt, 300)
              return
            }
            softTries = 0
            miss('一直没听到声音')
            return
          }
          softTries = 0
          miss('识别出错')
        },
      })
    }

    function miss(reason) {
      if (!alive()) return
      fails += 1
      playError?.()
      if (fails >= 3) {
        rewardSkip()
        setDuResult('skip'); setDuMsg(`${reason}，已跳过：${w.word}`)
        setDuMarks(m => ({ ...m, [idx]: m[idx] || 'skip' }))
        timer = setTimeout(() => { if (alive()) nextCard() }, 1300)
      } else {
        setDuResult('fail'); setDuMsg(`${reason}，再读一次 (${fails}/3)`)
        timer = setTimeout(() => { if (alive()) attempt() }, 950)
      }
    }

    timer = setTimeout(attempt, 450)
    return () => { cancelTokenRef.current += 1; clearTimeout(timer); srStop() }
  }, [idx, duMode])

  // 手动判定（兜底）：识别卡住时，用户可点"我读对了"或"跳过"立即推进
  function manualVerdict(verdict) {
    if (!duOn) return
    cancelTokenRef.current += 1   // 中断当前识别链
    srStop()
    const w = unit.words[idx]
    const goNextOrEnd = () => {
      if (idx < unit.words.length - 1) setIdx(i => i + 1)
      else { rewardUnitComplete(); setDuMode(null); setFlipped(false); playVictory?.() }
    }
    if (verdict === 'pass') {
      playCorrect?.()
      rewardPass()
      setDuMarks(m => ({ ...m, [idx]: 'pass' }))
      saveProgress(book.bookName, unitIdx, wordOffset + idx, 2)
      onProgressChange()
      setFlipped(true); setDuResult('pass'); setDuMsg('✓ 标记为已会')
      setTimeout(() => { setFlipped(false); goNextOrEnd() }, 750)
    } else {
      playError?.()
      rewardSkip()
      setDuMarks(m => ({ ...m, [idx]: 'skip' }))
      setDuResult('skip'); setDuMsg(`已跳过：${w.word}`)
      setTimeout(goNextOrEnd, 650)
    }
  }

  useEffect(() => {
    if (moXie && moInputRef.current) moInputRef.current.focus()
  }, [moXie, idx])

  function toggleMoXie() {
    const next = !moXie
    setMoXie(next)
    setMoInput(''); setMoResult(null)
    if (next) setMoXieDone({}) // 开启时重置默写进度
  }

  function goNext() {
    if (idx < unit.words.length - 1) setIdx(i => i + 1)
    else onBack()
  }

  function startDu(mode) {
    if (!srSupported) { setDuMsg('此浏览器不支持语音识别，请用 Chrome 打开'); return }
    if (moXie) setMoXie(false)
    setDuMarks({}); setDuResult(null); setDuMode(mode)
  }
  function stopDu() {
    setDuMode(null); srStop(); setFlipped(false); setDuResult(null); setDuMsg('')
  }
  function toggleDu(mode) {
    if (duMode === mode) stopDu()
    else if (duMode) { stopDu(); setTimeout(() => startDu(mode), 60) }
    else startDu(mode)
  }

  function checkMoXie() {
    if (!moInput.trim()) return
    const ok = moInput.trim().toLowerCase() === word.word.toLowerCase()
    setMoResult(ok ? 'correct' : 'wrong')
    if (ok) {
      saveProgress(book.bookName, unitIdx, wordOffset + idx, 2)
      onProgressChange()
      setMoXieDone(prev => ({ ...prev, [idx]: true }))
      // 答对后 600ms 自动跳下一个
      setTimeout(() => { setMoInput(''); setMoResult(null); goNext() }, 600)
    }
  }

  const duBtnCls = !duOn
    ? 'bg-blue-500/25 backdrop-blur-md border-blue-300/50 text-blue-100 shadow-[0_0_14px_rgba(59,130,246,0.35)] hover:bg-blue-500/40'
    : duResult === 'fail' || duResult === 'skip'
    ? 'bg-red-500/35 backdrop-blur-md border-red-300/55 text-red-50 shadow-[0_0_14px_rgba(239,68,68,0.45)]'
    : duResult === 'pass'
    ? 'bg-emerald-500/35 backdrop-blur-md border-emerald-300/55 text-emerald-50 shadow-[0_0_14px_rgba(16,185,129,0.45)]'
    : 'bg-cyan-500/40 backdrop-blur-md border-cyan-200/60 text-white shadow-[0_0_18px_rgba(34,211,238,0.55)]'

  const seen = (progress[`vocab_${book.bookName}_${unitIdx}_${wordOffset + idx}`] || 0) >= 1
  const gridRows = Math.ceil(unit.words.length / 3)

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-1.5 flex flex-col gap-1.5" style={{ height: 'calc(100vh - 110px)' }}>

      {/* 配对弹窗（放在最外层，避免被 du-flip-card 的 perspective 困住） */}
      {showMatch && (
        <WordMatch
          words={unit.words}
          onClose={() => setShowMatch(false)}
          settings={settings}
          onXp={onXp}
          onCrystal={onCrystal}
        />
      )}

      {/* XP 飞向顶部 🔥 徽章 */}
      {xpFlies.map(f => (
        <div key={f.id}
          className="xp-fly pointer-events-none fixed text-2xl font-extrabold select-none z-[200]"
          style={{
            color: f.color,
            textShadow: '0 0 12px rgba(251,191,36,0.9), 0 2px 6px rgba(0,0,0,0.6)',
            left: '50%',
            top: '38%',
          }}>
          +{f.amount} XP
        </div>
      ))}

      {/* Header: back | 大渐变进度条 | 计数 + 状态 */}
      {(() => {
        const total = unit.words.length
        const masteredCount = unit.words.filter((_, i) => (progress[`vocab_${book.bookName}_${unitIdx}_${wordOffset + i}`] || 0) >= 2).length
        const sessionMarked = Object.keys(duMarks).length
        const frac = Math.min(1, Math.max(masteredCount, sessionMarked, idx + 1) / Math.max(1, total))
        const full = frac >= 0.999
        return (
          <div className="flex items-center gap-3 shrink-0 relative" style={{ zIndex: 2 }}>
            <button
              type="button"
              onClick={onBack}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors shrink-0"
              aria-label="返回单元列表"
            >
              <IconArrowLeft size={18} />
            </button>
            {/* 渐变进度条（与 ExerciseView 一致） */}
            <div className="flex-1 min-w-0">
              <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden">
                <div className="h-full rounded-full relative"
                  style={{
                    width: `${frac * 100}%`,
                    background: full
                      ? 'linear-gradient(90deg,#f59e0b,#fbbf24)'
                      : 'linear-gradient(90deg,#3b82f6,#22d3ee)',
                    transition: 'width .45s cubic-bezier(.34,1.56,.64,1), background .3s',
                  }}>
                  <div className="absolute left-1 right-1 top-[2px] h-[3px] rounded-full bg-white/30" />
                </div>
              </div>
            </div>
            <span className="text-gray-500 text-sm tabular-nums shrink-0">{idx + 1} / {total}</span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${seen ? 'bg-blue-900/50 text-blue-400' : 'bg-gray-800 text-gray-600'}`}>
              {seen ? '已学习' : '未学习'}
            </span>
          </div>
        )
      })()}

      {/* 主卡 — 跟读翻卡 */}
      {!moXie ? (
        <div className={`du-flip-card shrink-0 w-full ${duResult === 'fail' || duResult === 'skip' ? 'du-shake' : ''}`} key={`flip-${idx}-${duResult}`}>
          <div className={`du-flip-inner ${flipped ? 'is-flipped' : ''}`}>
            {/* 正面 */}
            <div className="du-flip-front w-full bg-slate-800 border border-gray-700 rounded-xl flex flex-col py-1 px-3 transition-all">

          {/* 左：单词+音标+释义（紧凑居中）| 右：三按钮 */}
          <div className="flex w-full items-start gap-2" onClick={e => e.stopPropagation()}>
            <div className="flex-1 min-w-0 flex flex-col items-center text-center">
              {duOn ? (
                <>
                  <span className="text-2xl sm:text-3xl font-bold text-blue-300 px-1 min-w-0 break-words leading-tight">{word.zh}</span>
                  {loading && <div className="text-blue-400 text-xs animate-pulse mt-1">加载音频…</div>}
                  {duMsg && (
                    <div className={`text-xs font-medium mt-1 ${
                      duResult === 'pass' ? 'text-green-400'
                      : duResult === 'fail' || duResult === 'skip' ? 'text-red-400'
                      : 'text-blue-300 animate-pulse'}`}>
                      {duMsg}
                    </div>
                  )}
                  {srListening && srHeard && (
                    <div className="text-xs text-gray-500 mt-1">听到：<span className="text-gray-300 font-mono font-semibold">{srHeard}</span></div>
                  )}
                  {duResult !== 'pass' && (
                    <div className="flex items-center justify-center gap-2 mt-1" onClick={e => e.stopPropagation()}>
                      <button onClick={() => manualVerdict('pass')}
                        className="text-xs font-semibold px-3 py-1 rounded-full bg-green-700/60 hover:bg-green-600 text-green-100 border border-green-600/70 transition-colors active:scale-95">
                        ✓ 我读对了
                      </button>
                      <button onClick={() => manualVerdict('skip')}
                        className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-700/80 hover:bg-gray-600 text-gray-100 border border-gray-600 transition-colors active:scale-95">
                        ⏭ 跳过
                      </button>
                    </div>
                  )}
                  <div className="text-[10px] leading-snug text-emerald-300/80 mt-1">看中文 · 读出英文（读对翻卡显示单词；连续 3 次没通过自动跳过）</div>
                </>
              ) : (
                <div className="flex flex-col items-center leading-none">
                  <SyllableWord syllables={syllables} activeSylIdx={activeSylIdx} onSylClick={playSyl} size="text-5xl" />
                  <div className="mt-0.5">
                    <IPASyllableStrip ipaSyllables={ipaSyllables} activeSylIdx={activeSylIdx} onPlayWord={playFull} />
                  </div>
                  <div className="text-base text-blue-300 font-medium leading-snug mt-0.5">{word.zh}</div>
                  {loading && <div className="text-blue-400 text-xs animate-pulse mt-1">加载音频…</div>}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 shrink-0 self-start">
              <button onClick={e => { e.stopPropagation(); toggleDu('translate') }}
                title="跟读：看中文，读出英文；读对自动翻卡显示单词"
                className={`min-h-9 min-w-[2.75rem] px-2 flex items-center justify-center rounded-lg border text-[11px] font-extrabold tracking-wide transition-all active:scale-95 leading-tight text-center drop-shadow-[0_0_6px_rgba(255,255,255,0.35)] ${duBtnCls}`}>
                {duOn && !duResult && srListening ? <SoundWave active={srListening} /> : '跟读'}
              </button>
              <button onClick={e => { e.stopPropagation(); setShowMatch(true) }}
                disabled={duOn}
                className="min-h-9 min-w-[2.75rem] px-2 flex items-center justify-center rounded-lg border text-[11px] font-extrabold tracking-wide transition-all active:scale-95 leading-tight text-center backdrop-blur-md bg-teal-500/25 border-teal-300/50 text-teal-100 shadow-[0_0_12px_rgba(20,184,166,0.4)] hover:bg-teal-500/40 drop-shadow-[0_0_6px_rgba(45,212,191,0.45)] disabled:opacity-40">
                配对
              </button>
              <button onClick={e => { e.stopPropagation(); toggleMoXie() }}
                disabled={duOn}
                className={`min-h-9 min-w-[2.75rem] px-2 flex items-center justify-center rounded-lg border text-[11px] font-extrabold tracking-wide transition-all active:scale-95 leading-tight text-center backdrop-blur-md drop-shadow-[0_0_6px_rgba(255,255,255,0.3)] disabled:opacity-40
                  ${moXie
                    ? 'bg-violet-500/40 border-violet-200/60 text-violet-50 shadow-[0_0_14px_rgba(139,92,246,0.5)]'
                    : 'bg-amber-500/20 border-amber-300/45 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.35)] hover:bg-amber-500/35'}`}>
                默写
              </button>
            </div>
          </div>
            </div>
            {/* 背面：识别正确翻出 */}
            <div className="du-flip-back w-full bg-green-900/40 border-2 border-green-500 rounded-xl flex flex-col items-center justify-center gap-1 py-3 px-4">
              <div className="text-4xl">✅</div>
              <div className="text-4xl font-bold text-green-200">{word.word}</div>
              <div className="text-lg text-blue-200">{word.zh}</div>
              <div className="text-xs text-green-400">读对了！</div>
            </div>
          </div>
        </div>
      ) : (
        /* 默写模式主卡：顶栏仅「默写模式」按钮退出；左中文+右音标同行；右列大输入；逻辑不变 */
        <div className="shrink-0 w-full bg-slate-800 border border-purple-800/60 rounded-xl py-3 px-3 sm:px-4">
          <div className="flex flex-col gap-3 w-full min-w-0">
            <div className="flex justify-start">
              <button
                type="button"
                onClick={toggleMoXie}
                className="px-3 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 border border-purple-400/80 text-white text-xs font-semibold tracking-wide shadow-md transition-colors active:scale-[0.98]"
              >
                默写模式
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-2 items-center min-w-0">
              <div className="min-w-0 flex flex-row flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
                <span className="text-blue-300 text-lg sm:text-xl font-semibold shrink-0">{word.zh}</span>
                <span className="text-amber-200 font-mono text-base sm:text-lg md:text-xl font-bold tracking-wide drop-shadow-[0_0_10px_rgba(251,191,36,0.35)] break-all">
                  {renderIPAText(word.ipa || '')}
                </span>
              </div>
              <div className="min-w-0 flex items-center">
                <input ref={moInputRef}
                  value={moInput}
                  onChange={e => { setMoInput(e.target.value); if (moResult === 'wrong') setMoResult(null) }}
                  onKeyDown={e => {
                    if (e.key === ' ' && !moInput.trim()) { e.preventDefault(); playFull(); return }
                    if (e.key === 'Enter' && !moResult) checkMoXie()
                  }}
                  disabled={moResult === 'correct'}
                  placeholder="输入英文… (空格键听音)"
                  autoComplete="off" autoCapitalize="off" spellCheck="false"
                  className={`w-full min-w-0 min-h-[3.5rem] sm:min-h-[4rem] bg-gray-800 border-2 rounded-xl px-3 py-3 sm:px-4 sm:py-3.5 text-white text-left text-lg sm:text-xl font-mono outline-none transition-colors box-border
                    ${moResult === 'correct' ? 'border-green-500 bg-green-900/20' : moResult === 'wrong' ? 'border-red-500' : 'border-purple-500/50 focus:border-purple-400'}`}
                />
              </div>
            </div>

            {moResult === 'correct' && (
              <div className="text-green-400 text-sm font-semibold text-center">✓ 正确！跳转中…</div>
            )}
            {moResult === 'wrong' && (
              <div className="flex flex-wrap items-center justify-center gap-2 text-center">
                <span className="text-red-400 text-xs">
                  ✗ 正确答案：<span className="text-white font-bold">{word.word}</span>
                </span>
                <button type="button" onClick={checkMoXie} className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded shrink-0">
                  再试
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 单词格 — 填满剩余高度，无滚动 */}
      <div className="min-h-0" style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: `repeat(${gridRows}, 1fr)`,
        gap: '6px',
      }}>
        {unit.words.map((w, i) => {
          const lvl = progress[`vocab_${book.bookName}_${unitIdx}_${wordOffset + i}`] || 0
          const hidden = moXie && !allMoXieDone && !moXieDone[i]
          const mark = duMarks[i]
          const isCur = i === idx
          let cls
          if (isCur && duOn) cls = 'bg-blue-600 text-white ring-2 ring-blue-400 animate-pulse'
          else if (isCur)    cls = 'bg-blue-600 text-white ring-2 ring-blue-400'
          else if (mark === 'pass') cls = 'bg-green-700/70 text-green-100 ring-1 ring-green-500'
          else if (mark === 'skip') cls = 'bg-amber-800/50 text-amber-200 ring-1 ring-amber-600'
          else if (lvl >= 2) cls = 'bg-green-900/60 text-green-300'
          else if (lvl === 1) cls = 'bg-blue-900/30 text-blue-400'
          else cls = 'bg-gray-800/80 text-gray-400 hover:bg-gray-700'
          const showZh = duOn
          const shouldFlip = duOn && (mark === 'pass' || mark === 'skip')
          const backCls = mark === 'pass'
            ? 'bg-green-700 border-2 border-green-400 text-white shadow-[0_0_12px_rgba(34,197,94,0.5)]'
            : 'bg-amber-800/90 border-2 border-amber-500 text-amber-100'
          return (
            <button key={i} disabled={duOn} onClick={() => {
                if (duOn) return
                setMoInput(''); setMoResult(null)
                if (i === idx) { playFull(); return }
                pendingPlayRef.current = true
                setIdx(i)
              }}
              className={`du-tile-flip relative rounded-xl font-medium transition-all active:scale-95 ${shouldFlip ? '' : cls}`}>
              <div className={`du-tile-flip-inner ${shouldFlip ? 'is-flipped' : ''}`}>
                {/* 前面：默认显示英文；跟读时显示中文 */}
                <div className="du-tile-face flex items-center justify-center">
                  {hidden ? (
                    <span className="text-gray-600 text-lg tracking-widest">···</span>
                  ) : showZh ? (
                    <span className="text-sm sm:text-base font-semibold px-2 text-center leading-tight line-clamp-2">{w.zh}</span>
                  ) : (
                    <span className="text-3xl font-semibold truncate px-2">{w.word}</span>
                  )}
                </div>
                {/* 背面：读对/跳过 翻面显示英文答案 */}
                <div className={`du-tile-face du-tile-back flex items-center justify-center ${backCls}`}>
                  <span className="text-2xl sm:text-3xl font-bold truncate px-2">{w.word}</span>
                  {mark === 'pass' && <span className="absolute top-1 right-1.5 text-xs">✓</span>}
                  {mark === 'skip' && <span className="absolute top-1 right-1.5 text-xs">↷</span>}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Quiz ──────────────────────────────────────────────────────────────────────

function QuizWord({ word, ipa }) {
  const { syllables, activeSylIdx, playFull, playSyl } = useWordAudio(word)
  return (
    <div className="flex flex-col items-center gap-2">
      <SyllableWord syllables={syllables} activeSylIdx={activeSylIdx} onSylClick={playSyl} size="text-4xl" />
      <div className="text-gray-500 text-sm font-mono">{renderIPAText(ipa || '')}</div>
      <button onClick={playFull} className="text-gray-500 hover:text-white text-sm inline-flex items-center gap-1.5">
        <IconSpeaker size={32} /> 发音
      </button>
    </div>
  )
}

function QuizView({ book, unit, unitIdx, wordOffset = 0, onBack, onProgressChange }) {
  const [mode, setMode]     = useState(null)
  const [qIdx, setQIdx]     = useState(0)
  const [options, setOpts]  = useState([])
  const [chosen, setChosen] = useState(null)
  const [input, setInput]   = useState('')
  const [result, setResult] = useState(null)
  const [score, setScore]   = useState({ right: 0, wrong: 0 })
  const [order, setOrder]   = useState([])
  const inputRef = useRef()
  const allWords = VOCAB_BOOKS.flatMap(b => b.units.flatMap(u => u.words))

  const backToModePicker = useCallback(() => {
    setMode(null)
    setQIdx(0)
    setChosen(null)
    setResult(null)
    setInput('')
    setScore({ right: 0, wrong: 0 })
    setOrder([])
  }, [])

  useEffect(() => {
    if (mode) { setOrder(shuffle(unit.words.map((_, i) => i))); setQIdx(0); setScore({ right: 0, wrong: 0 }); setChosen(null); setResult(null); setInput('') }
  }, [mode])
  useEffect(() => { if (mode && order.length > 0) makeOpts() }, [qIdx, order, mode])
  useEffect(() => { if (mode === 'spell' && inputRef.current) inputRef.current.focus() }, [qIdx, mode])

  function makeOpts() {
    const correct = unit.words[order[qIdx]]
    const pool = shuffle(allWords.filter(w => w.word !== correct.word && w.zh !== correct.zh))
    setOpts(shuffle([correct, ...pool.slice(0, 3)])); setChosen(null); setResult(null); setInput('')
  }
  function handleChoice(opt) {
    if (result) return
    const correct = unit.words[order[qIdx]]
    const ok = mode === 'en2zh' ? opt.zh === correct.zh : opt.word === correct.word
    setChosen(opt); setResult(ok ? 'correct' : 'wrong')
    setScore(s => ok ? { ...s, right: s.right + 1 } : { ...s, wrong: s.wrong + 1 })
    if (ok) { saveProgress(book.bookName, unitIdx, wordOffset + order[qIdx], 2); onProgressChange() }
  }
  function handleSpell(e) {
    e.preventDefault(); if (result) return
    const correct = unit.words[order[qIdx]]
    const ok = input.trim().toLowerCase() === correct.word.toLowerCase()
    setResult(ok ? 'correct' : 'wrong')
    setScore(s => ok ? { ...s, right: s.right + 1 } : { ...s, wrong: s.wrong + 1 })
    if (ok) { saveProgress(book.bookName, unitIdx, wordOffset + order[qIdx], 2); onProgressChange() }
  }
  function next() { qIdx < order.length - 1 ? setQIdx(i => i + 1) : setQIdx(-1); setResult(null); setInput(''); setChosen(null) }

  if (!mode) return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">
      <PageBackBar onBack={onBack} label="返回单词卡" />
      <h2 className="text-white text-xl font-bold">{unit.title} — 练习模式</h2>
      {[{ id: 'en2zh', label: '英 → 中', desc: '看英文选中文', emoji: '🇬🇧' },
        { id: 'zh2en', label: '中 → 英', desc: '看中文选英文', emoji: '🇨🇳' },
        { id: 'spell', label: '拼写',    desc: '看中文输入英文', emoji: '✏️' }
      ].map(m => (
        <button key={m.id} onClick={() => setMode(m.id)}
          className="flex items-center gap-5 bg-slate-800 border border-slate-700 hover:border-gray-600 rounded-xl p-5 text-left transition-all active:scale-95">
          <span className="text-4xl">{m.emoji}</span>
          <div><div className="text-white font-semibold text-lg">{m.label}</div><div className="text-gray-500 text-sm">{m.desc}</div></div>
        </button>
      ))}
    </div>
  )

  if (qIdx === -1) return (
    <div className="w-full max-w-2xl mx-auto px-4 py-12 flex flex-col items-center gap-6">
      <div className="w-full"><PageBackBar onBack={backToModePicker} label="返回模式选择" /></div>
      <div className="text-6xl">🎉</div>
      <div className="text-white text-3xl font-bold">完成！</div>
      <div className="text-gray-400 text-lg">{score.right} 对 · {score.wrong} 错</div>
      <div className="flex gap-3">
        <button onClick={() => setMode(null)} className="px-8 py-4 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-700">换模式</button>
        <button onClick={() => { setOrder(shuffle(unit.words.map((_, i) => i))); setQIdx(0); setScore({ right: 0, wrong: 0 }) }}
          className="px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500">再来一遍</button>
      </div>
    </div>
  )

  const current = unit.words[order[qIdx]]
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 flex flex-col gap-4">
      <PageBackBar onBack={backToModePicker} label="返回模式选择" />
      <div className="flex items-center justify-between">
        <span className="text-gray-600 text-sm w-14" aria-hidden />
        <span className="text-gray-500">{qIdx + 1}/{order.length}</span>
        <span className="text-green-400 font-mono">{score.right}✓ {score.wrong}✗</span>
      </div>
      <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(qIdx / order.length) * 100}%` }} />
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 flex flex-col items-center gap-3 min-h-[180px] justify-center">
        {mode === 'en2zh' && <QuizWord word={current.word} ipa={current.ipa} />}
        {mode !== 'en2zh' && <div className="text-4xl font-bold text-blue-300">{current.zh}</div>}
        {mode === 'spell' && <div className="text-gray-500 font-mono text-xl tracking-widest">{makeBlank(current.word)}</div>}
      </div>

      {mode !== 'spell' && (
        <div className="grid grid-cols-2 gap-3">
          {options.map((opt, i) => {
            const label = mode === 'en2zh' ? opt.zh : opt.word
            const isCorrect = mode === 'en2zh' ? opt.zh === current.zh : opt.word === current.word
            let cls = 'bg-slate-800 border border-slate-700 text-gray-300 hover:border-gray-600'
            if (result && isCorrect) cls = 'bg-green-900/60 border border-green-500 text-green-200'
            else if (result && chosen === opt && !isCorrect) cls = 'bg-red-900/60 border border-red-500 text-red-300'
            return <button key={i} onClick={() => handleChoice(opt)} className={`rounded-xl p-5 text-left text-base font-medium transition-all active:scale-95 ${cls}`}>{label}</button>
          })}
        </div>
      )}
      {mode === 'spell' && (
        <form onSubmit={handleSpell} className="flex flex-col gap-3">
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} disabled={!!result}
            placeholder="输入英文单词…"
            className={`w-full bg-slate-800 border rounded-xl px-5 py-5 text-white text-center text-xl font-mono outline-none transition-colors
              ${result === 'correct' ? 'border-green-500' : result === 'wrong' ? 'border-red-500' : 'border-gray-700 focus:border-blue-500'}`} />
          {result === 'wrong' && <div className="text-center text-red-400">正确答案：<span className="font-bold text-white text-lg">{current.word}</span></div>}
          {!result && <button type="submit" className="py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base">确认</button>}
        </form>
      )}
      {result && (
        <button onClick={next}
          className={`w-full py-4 rounded-xl font-semibold text-white text-base transition-all active:scale-95 ${result === 'correct' ? 'bg-green-700 hover:bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
          {qIdx < order.length - 1 ? '下一题 →' : '查看结果'}
        </button>
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function VocabStudy({ onClose, isMember = true, onShowLogin, settings, onXp, onCrystal }) {
  const [view, setView]           = useState('books')
  const [book, setBook]           = useState(null)
  const [unit, setUnit]           = useState(null)
  const [unitIdx, setUnitIdx]     = useState(0)
  const [wordOffset, setWordOffset] = useState(0)
  const [progress, setProgress]   = useState(loadProgress)

  const refreshProgress = useCallback((signal) => {
    setProgress(loadProgress())
    if (signal === 'goQuiz') setView('quiz')
  }, [])

  return (
    <>
      <OceanBg />
      {view === 'books' && <BookGrid onSelect={b => { setBook(b); setView('units') }} onBack={onClose} />}
      {view === 'units' && <UnitGrid book={book} progress={progress} isMember={isMember} onShowLogin={onShowLogin} onBack={() => setView('books')} onSelect={(u, ui, offset) => { setUnit(u); setUnitIdx(ui); setWordOffset(offset || 0); setView('cards') }} />}
      {view === 'cards' && <FlashCards book={book} unit={unit} unitIdx={unitIdx} wordOffset={wordOffset} progress={progress} onBack={() => setView('units')} onProgressChange={refreshProgress} settings={settings} onXp={onXp} onCrystal={onCrystal} />}
      {view === 'quiz'  && <QuizView book={book} unit={unit} unitIdx={unitIdx} wordOffset={wordOffset} onBack={() => setView('cards')} onProgressChange={refreshProgress} />}
    </>
  )
}
