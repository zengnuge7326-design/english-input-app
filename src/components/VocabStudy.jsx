import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import pepWords from '../data/pep_words.json'
import renaiJuniorWords from '../data/renai_junior_words.json'
import { IconSpeaker, IconArrowLeft } from './Icons'
import PageBackBar from './PageBackBar'

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
    word.split(' ').forEach((w, i) => { if (i > 0) raw.push(' '); syllabifyOne(w).forEach(s => raw.push(s)) })
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
  }, [rawIPASyls, realSyls.length])

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
        if (s.isSep) return <span key={i} className="text-gray-500">{s.text}</span>
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

function IPASyllableStrip({ ipaSyllables, activeSylIdx, onPlayWord }) {
  if (!ipaSyllables?.length) return null
  return (
    <button
      onClick={e => { e.stopPropagation(); onPlayWord?.() }}
      className="flex items-center gap-0 flex-wrap justify-center cursor-pointer select-none"
    >
      {ipaSyllables.map((syl, i) => {
        const col = SYL_COLORS[i % SYL_COLORS.length]
        const active = activeSylIdx === i
        return (
          <span key={i} className="flex items-center">
            {i > 0 && <span className="text-gray-500 select-none" style={{ fontSize: '0.4em', margin: '0 0.2em', lineHeight: 1 }}>·</span>}
            <span className={`text-2xl font-mono transition-all duration-150
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

const VOCAB_BOOKS = [...pepWords, ...renaiJuniorWords]

const GRADE_COLORS = {
  3: 'from-green-700 to-green-900',
  4: 'from-blue-700 to-blue-900',
  5: 'from-purple-700 to-purple-900',
  6: 'from-orange-700 to-orange-900',
  7: 'from-teal-700 to-teal-900',
  8: 'from-cyan-700 to-cyan-900',
  9: 'from-indigo-700 to-indigo-900',
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
            <div className="text-sm text-white/60 mb-1">{book.grade}年级 · {book.sem === 'up' ? '上' : '下'}册</div>
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

function UnitGrid({ book, progress, onSelect, onBack }) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <PageBackBar onBack={onBack} label="返回选册" />
      <h2 className="text-white text-xl font-bold mb-4">{book.bookName}</h2>
      <div className="grid grid-cols-2 gap-4">
        {book.units.flatMap((unit, ui) => {
          const parts = chunkUnitWords(unit.words)
          return parts.map((half, hi) => {
            const label = unitChunkLabel(unit.unit, hi, parts.length)
            const total = half.words.length
            const known = half.words.filter((_, wi) => (progress[`vocab_${book.bookName}_${ui}_${half.offset + wi}`] || 0) >= 2).length
            const pct = total ? Math.round(known / total * 100) : 0
            return (
              <button key={`${ui}-${hi}`} onClick={() => onSelect({ ...unit, words: half.words }, ui, half.offset)}
                className="rounded-xl bg-slate-800 border border-slate-700 hover:border-gray-600 p-5 text-left transition-all active:scale-95">
                <div className="text-xs text-gray-500 mb-1">{label}</div>
                <div className="text-white font-semibold text-base mb-3">{unit.title}</div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-1.5">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <div className="text-xs text-gray-500">{known}/{total} 已掌握</div>
              </button>
            )
          })
        })}
      </div>
    </div>
  )
}

// ── Flash card ────────────────────────────────────────────────────────────────

function FlashCards({ book, unit, unitIdx, wordOffset = 0, progress, onBack, onProgressChange }) {
  const [idx, setIdx]             = useState(0)
  const [speed, setSpeed]         = useState(1.0)
  const [localSeen, setLocalSeen] = useState({})
  const [moXie, setMoXie]         = useState(false)
  const [moXieDone, setMoXieDone] = useState({}) // idx → true, tracks correct dictations
  const [moInput, setMoInput]     = useState('')
  const [moResult, setMoResult]   = useState(null)
  const moInputRef                = useRef()
  const { recState, recErr, startRec, stopRec, playRec, reset: resetRec } = useRecorder()
  const word = unit.words[idx]
  const pendingPlayRef = useRef(false)
  const { syllables, ipaSyllables, activeSylIdx, loading, playFull, playSyl, playIPASyl } = useWordAudio(word.word, word.ipa || '', speed)

  // Preload current + next word audio buffers to eliminate click-to-play delay
  useEffect(() => {
    fetchUrl(word.word).then(url => { if (url) fetchBuffer(url) })
    const next = unit.words[idx + 1]
    if (next?.word) fetchUrl(next.word).then(url => { if (url) fetchBuffer(url) })
  }, [idx])

  const SPEEDS = [0.7, 1.0, 1.3]
  const cycleSpeed = () => setSpeed(s => SPEEDS[(SPEEDS.indexOf(s) + 1) % SPEEDS.length])

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

  useEffect(() => { resetRec(); setMoInput(''); setMoResult(null) }, [idx])

  useEffect(() => {
    if (pendingPlayRef.current) { pendingPlayRef.current = false; playFull() }
  }, [idx])

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

  function handleRecord() {
    if (recState === 'recording') { stopRec(); return }
    if (recState === 'recorded')  { playRec(); return }
    if (recState === 'preparing') return
    startRec()
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

  const recCls = recState === 'recording' ? 'bg-red-700 border-red-500 text-white animate-pulse'
               : recState === 'recorded'   ? 'bg-green-800 border-green-600 text-green-200'
               : recState === 'preparing'  ? 'bg-gray-700 border-gray-600 text-gray-400 opacity-60'
               :                             'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'

  const seen = (progress[`vocab_${book.bookName}_${unitIdx}_${wordOffset + idx}`] || 0) >= 1
  const gridRows = Math.ceil(unit.words.length / 3)

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-2 flex flex-col gap-2" style={{ height: 'calc(100vh - 110px)' }}>

      {/* Header: 进度 | 已学习badge */}
      <div className="flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          aria-label="返回单元列表"
        >
          <IconArrowLeft size={18} />
        </button>
        <span className="text-gray-500 text-sm">{idx + 1} / {unit.words.length}</span>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${seen ? 'bg-blue-900/50 text-blue-400' : 'bg-gray-800 text-gray-600'}`}>
          {seen ? '已学习' : '未学习'}
        </span>
      </div>

      {/* 主卡 — 紧凑布局 */}
      {!moXie ? (
        <div
          className="shrink-0 w-full bg-slate-800 border border-gray-700 rounded-xl flex flex-col items-center gap-1.5 py-3 px-4 transition-all">

          {/* mic | word | speed× | 默写 */}
          <div className="flex justify-center items-center gap-2" onClick={e => e.stopPropagation()}>
            <button onClick={handleRecord}
              disabled={recState === 'preparing'}
              className={`flex items-center justify-center w-11 h-11 rounded-xl border transition-all active:scale-95 shrink-0 ${recCls}`}>
              {recState === 'recording' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>
              ) : recState === 'recorded' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
              ) : recState === 'preparing' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin opacity-60"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              )}
            </button>
            <SyllableWord syllables={syllables} activeSylIdx={activeSylIdx} onSylClick={playSyl} size="text-5xl" />
            <button onClick={e => { e.stopPropagation(); cycleSpeed() }}
              className="w-11 h-11 flex items-center justify-center bg-gray-800 hover:bg-gray-700 border border-gray-700 text-yellow-400 rounded-xl text-sm font-mono font-bold transition-all active:scale-95 shrink-0">
              {speed}×
            </button>
            <button onClick={e => { e.stopPropagation(); toggleMoXie() }}
              className={`min-h-11 px-2.5 flex items-center justify-center rounded-xl border text-xs font-bold transition-all active:scale-95 shrink-0 leading-tight text-center
                ${moXie ? 'bg-purple-700 border-purple-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'}`}>
              默写
            </button>
          </div>

          <IPASyllableStrip ipaSyllables={ipaSyllables} activeSylIdx={activeSylIdx} onPlayWord={playFull} />
          {loading && <div className="text-blue-400 text-xs animate-pulse">加载音频…</div>}
          {recState === 'preparing' && <div className="text-gray-400 text-xs animate-pulse">准备录音…</div>}
          {recState === 'recording' && <div className="text-red-400 text-xs animate-pulse">● 录音中（最长4秒）</div>}
          {recState === 'recorded' && <div className="text-green-400 text-xs">已录音 · 点麦克风播放</div>}
          {recErr && <div className="text-orange-400 text-xs">{recErr}</div>}
          <div className="text-xl text-blue-300 font-medium">{word.zh}</div>
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
          return (
            <button key={i} onClick={() => {
                setMoInput(''); setMoResult(null)
                if (i === idx) { playFull(); return }
                pendingPlayRef.current = true
                setIdx(i)
              }}
              className={`rounded-xl font-medium transition-all active:scale-95 flex items-center justify-center overflow-hidden ${
                i === idx ? 'bg-blue-600 text-white ring-2 ring-blue-400' :
                lvl >= 2  ? 'bg-green-900/60 text-green-300' :
                lvl === 1 ? 'bg-blue-900/30 text-blue-400' :
                            'bg-gray-800/80 text-gray-400 hover:bg-gray-700'}`}>
              {hidden
                ? <span className="text-gray-600 text-lg tracking-widest">···</span>
                : <span className="text-3xl font-semibold truncate px-2">{w.word}</span>
              }
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

export default function VocabStudy({ onClose }) {
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

  if (view === 'books') return <BookGrid onSelect={b => { setBook(b); setView('units') }} onBack={onClose} />
  if (view === 'units') return <UnitGrid book={book} progress={progress} onBack={() => setView('books')} onSelect={(u, ui, offset) => { setUnit(u); setUnitIdx(ui); setWordOffset(offset || 0); setView('cards') }} />
  if (view === 'cards') return <FlashCards book={book} unit={unit} unitIdx={unitIdx} wordOffset={wordOffset} progress={progress} onBack={() => setView('units')} onProgressChange={refreshProgress} />
  if (view === 'quiz')  return <QuizView book={book} unit={unit} unitIdx={unitIdx} wordOffset={wordOffset} onBack={() => setView('cards')} onProgressChange={refreshProgress} />
  return null
}
