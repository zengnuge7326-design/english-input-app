import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import pepWords from '../data/pep_words.json'
import { IconSpeaker } from './Icons'

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
  } catch { urlCache.set(key, null); return null }
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

function speak(text, rate = 0.82) {
  window.speechSynthesis?.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'; u.rate = rate; u.pitch = 1.0
  window.speechSynthesis?.speak(u)
}

// ── useWordAudio hook ─────────────────────────────────────────────────────────

function useWordAudio(word, speed = 1.0) {
  const syllables = useMemo(() => syllabify(word), [word])
  const realSyls  = useMemo(() => syllables.filter(s => !s.isSep), [syllables])
  const [activeSylIdx, setActiveSylIdx] = useState(-1)
  const [loading, setLoading]           = useState(false)
  const timersRef = useRef([])

  function clearTimers() { timersRef.current.forEach(clearTimeout); timersRef.current = [] }
  function reset() { clearTimers(); stopAudio(); setActiveSylIdx(-1) }

  async function getBuffer() {
    const url = await fetchUrl(word)
    return url ? fetchBuffer(url) : null
  }

  // 均等分配高亮，wallClockMs 已是实际播放时长
  function scheduleHighlight(wallClockMs) {
    const n = realSyls.length
    if (n === 0) return
    const perSyl = wallClockMs / n
    realSyls.slice(0, n).forEach((s, i) => {
      timersRef.current.push(setTimeout(() => setActiveSylIdx(s.idx), i * perSyl))
    })
    timersRef.current.push(setTimeout(() => setActiveSylIdx(-1), wallClockMs + 400))
  }

  // 播全词，顺序点亮音节
  async function playFull() {
    reset()
    setLoading(true)
    const buf = await getBuffer()
    setLoading(false)
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

  // 点音节也播全词，只高亮该音节
  async function playSyl(sylIdx) {
    reset()
    setActiveSylIdx(sylIdx)
    timersRef.current.push(setTimeout(() => setActiveSylIdx(-1), 1500))
    const buf = await getBuffer()
    if (buf) { playBuffer(buf, 0, null, speed); return }
    speak(word, 0.5 * speed)
  }

  useEffect(() => { reset(); return reset }, [word])
  return { syllables, activeSylIdx, loading, playFull, playSyl }
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
  const mrRef = useRef(null); const chunksRef = useRef([]); const timerRef = useRef(null)

  function reset() {
    setRecState('idle')
    setRecUrl(prev => { if (prev) URL.revokeObjectURL(prev); return null })
    mrRef.current?.stream?.getTracks().forEach(t => t.stop())
  }
  async function startRec() {
    try {
      reset(); stopAudio(); window.speechSynthesis?.cancel()
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream); mrRef.current = mr; chunksRef.current = []
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => { setRecUrl(URL.createObjectURL(new Blob(chunksRef.current, { type: 'audio/webm' }))); setRecState('recorded'); stream.getTracks().forEach(t => t.stop()) }
      mr.start(); setRecState('recording')
      timerRef.current = setTimeout(() => mr.state === 'recording' && mr.stop(), 4000)
    } catch { setRecState('idle'); alert('需要麦克风权限') }
  }
  function stopRec() { clearTimeout(timerRef.current); if (mrRef.current?.state === 'recording') mrRef.current.stop() }
  function playRec() { if (recUrl) { stopAudio(); window.speechSynthesis?.cancel(); new Audio(recUrl).play() } }
  useEffect(() => () => { clearTimeout(timerRef.current); reset() }, [])
  return { recState, recUrl, startRec, stopRec, playRec, reset }
}

// ── Book selector ─────────────────────────────────────────────────────────────

const GRADE_COLORS = { 3: 'from-green-700 to-green-900', 4: 'from-blue-700 to-blue-900', 5: 'from-purple-700 to-purple-900', 6: 'from-orange-700 to-orange-900' }

function BookGrid({ onSelect }) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-white text-xl font-bold mb-5">选择年级册次</h2>
      <div className="grid grid-cols-2 gap-4">
        {pepWords.map(book => (
          <button key={book.bookName} onClick={() => onSelect(book)}
            className={`rounded-2xl bg-gradient-to-br ${GRADE_COLORS[book.grade]} p-6 text-left hover:opacity-90 active:scale-95 transition-all`}>
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

function UnitGrid({ book, progress, onSelect, onBack }) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <button onClick={onBack} className="text-gray-400 hover:text-white text-sm mb-5 block transition-colors">← 返回</button>
      <h2 className="text-white text-xl font-bold mb-4">{book.bookName}</h2>
      <div className="grid grid-cols-2 gap-4">
        {book.units.flatMap((unit, ui) => {
          const mid = Math.ceil(unit.words.length / 2)
          return [
            { label: `Unit ${unit.unit}A`, words: unit.words.slice(0, mid), offset: 0 },
            { label: `Unit ${unit.unit}B`, words: unit.words.slice(mid), offset: mid },
          ].map((half, hi) => {
            const total = half.words.length
            const known = half.words.filter((_, wi) => (progress[`vocab_${book.bookName}_${ui}_${half.offset + wi}`] || 0) >= 2).length
            const pct = total ? Math.round(known / total * 100) : 0
            return (
              <button key={`${ui}-${hi}`} onClick={() => onSelect({ ...unit, words: half.words }, ui, half.offset)}
                className="rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-600 p-5 text-left transition-all active:scale-95">
                <div className="text-xs text-gray-500 mb-1">{half.label}</div>
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
  const [speed, setSpeed]         = useState(0.7)
  const [localSeen, setLocalSeen] = useState({})
  const [moXie, setMoXie]         = useState(false)
  const [moXieDone, setMoXieDone] = useState({}) // idx → true, tracks correct dictations
  const [moInput, setMoInput]     = useState('')
  const [moResult, setMoResult]   = useState(null)
  const moInputRef                = useRef()
  const { recState, startRec, stopRec, playRec, reset: resetRec } = useRecorder()
  const word = unit.words[idx]
  const pendingPlayRef = useRef(false)
  const { syllables, activeSylIdx, loading, playFull, playSyl } = useWordAudio(word.word, speed)

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
               :                             'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'

  const seen = (progress[`vocab_${book.bookName}_${unitIdx}_${wordOffset + idx}`] || 0) >= 1
  const gridRows = Math.ceil(unit.words.length / 3)

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-2 flex flex-col gap-2" style={{ height: 'calc(100vh - 110px)' }}>

      {/* Header: 返回 | 进度 | 已学习badge */}
      <div className="flex items-center justify-between shrink-0">
        <button onClick={onBack} className="text-gray-400 hover:text-white text-sm">← 返回</button>
        <span className="text-gray-500 text-sm">{idx + 1} / {unit.words.length}</span>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${seen ? 'bg-blue-900/50 text-blue-400' : 'bg-gray-800 text-gray-600'}`}>
          {seen ? '已学习' : '未学习'}
        </span>
      </div>

      {/* 主卡 — 紧凑布局 */}
      {!moXie ? (
        <div
          className="shrink-0 w-full bg-gray-900 border border-gray-700 rounded-xl flex flex-col items-center gap-1.5 py-3 px-4 transition-all">

          {/* mic | word | speed× | 默写 */}
          <div className="flex justify-center items-center gap-2" onClick={e => e.stopPropagation()}>
            <button onClick={handleRecord}
              className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-all active:scale-95 shrink-0 ${recCls}`}>
              {recState === 'recording' ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>
              ) : recState === 'recorded' ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              )}
            </button>
            <SyllableWord syllables={syllables} activeSylIdx={activeSylIdx} onSylClick={playSyl} size="text-5xl" />
            <button onClick={e => { e.stopPropagation(); cycleSpeed() }}
              className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 border border-gray-700 text-yellow-400 rounded-lg text-xs font-mono font-bold transition-all active:scale-95 shrink-0">
              {speed}×
            </button>
            <button onClick={e => { e.stopPropagation(); toggleMoXie() }}
              className={`w-8 h-8 flex items-center justify-center rounded-lg border text-xs font-bold transition-all active:scale-95 shrink-0
                ${moXie ? 'bg-purple-700 border-purple-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'}`}>
              写
            </button>
          </div>

          <div className="text-gray-500 text-sm font-mono tracking-wide">{word.ipa}</div>
          {loading && <div className="text-blue-400 text-xs animate-pulse">加载音频…</div>}
          {recState === 'recording' && <div className="text-red-400 text-xs animate-pulse">● 录音中</div>}
          {recState === 'recorded' && <div className="text-green-400 text-xs">已录音 · 点麦克风播放</div>}
          <div className="text-xl text-blue-300 font-medium">{word.zh}</div>
        </div>
      ) : (
        /* 默写模式主卡 */
        <div className="shrink-0 w-full bg-gray-900 border border-purple-800/60 rounded-xl flex flex-col items-center gap-2 py-3 px-4">
          {/* 顶行：标题 + 默写按钮 */}
          <div className="w-full flex items-center justify-between">
            <span className="text-purple-400 text-xs font-semibold tracking-wider">默写模式</span>
            <button onClick={toggleMoXie}
              className="w-7 h-7 flex items-center justify-center bg-purple-700 border border-purple-500 text-white rounded-lg text-xs font-bold">
              写
            </button>
          </div>
          {/* 输入框 */}
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
            className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-white text-center text-xl font-mono outline-none transition-colors
              ${moResult === 'correct' ? 'border-green-500 bg-green-900/20' : moResult === 'wrong' ? 'border-red-500' : 'border-gray-700 focus:border-purple-500'}`}
          />
          {/* 音标 + 中文提示 */}
          <div className="flex items-center gap-3 text-xs">
            <span className="text-gray-500 font-mono">{word.ipa}</span>
            <span className="text-gray-600">·</span>
            <span className="text-blue-400/70">{word.zh}</span>
          </div>
          {/* 反馈 */}
          {moResult === 'correct' && <div className="text-green-400 text-sm font-semibold">✓ 正确！跳转中…</div>}
          {moResult === 'wrong' && (
            <div className="flex items-center gap-2">
              <span className="text-red-400 text-xs">✗ 正确答案：<span className="text-white font-bold">{word.word}</span></span>
              <button onClick={checkMoXie} className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded">再试</button>
            </div>
          )}
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
                : <span className="text-xl font-semibold truncate px-2">{w.word}</span>
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
      <div className="text-gray-500 text-sm font-mono">{ipa}</div>
      <button onClick={playFull} className="text-gray-500 hover:text-white text-sm inline-flex items-center gap-1.5">
        <IconSpeaker size={32} /> 发音
      </button>
    </div>
  )
}

function QuizView({ book, unit, unitIdx, onBack, onProgressChange }) {
  const [mode, setMode]     = useState(null)
  const [qIdx, setQIdx]     = useState(0)
  const [options, setOpts]  = useState([])
  const [chosen, setChosen] = useState(null)
  const [input, setInput]   = useState('')
  const [result, setResult] = useState(null)
  const [score, setScore]   = useState({ right: 0, wrong: 0 })
  const [order, setOrder]   = useState([])
  const inputRef = useRef()
  const allWords = pepWords.flatMap(b => b.units.flatMap(u => u.words))

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
    if (ok) { saveProgress(book.bookName, unitIdx, order[qIdx], 2); onProgressChange() }
  }
  function handleSpell(e) {
    e.preventDefault(); if (result) return
    const correct = unit.words[order[qIdx]]
    const ok = input.trim().toLowerCase() === correct.word.toLowerCase()
    setResult(ok ? 'correct' : 'wrong')
    setScore(s => ok ? { ...s, right: s.right + 1 } : { ...s, wrong: s.wrong + 1 })
    if (ok) { saveProgress(book.bookName, unitIdx, order[qIdx], 2); onProgressChange() }
  }
  function next() { qIdx < order.length - 1 ? setQIdx(i => i + 1) : setQIdx(-1); setResult(null); setInput(''); setChosen(null) }

  if (!mode) return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">
      <button onClick={onBack} className="text-gray-400 hover:text-white text-sm self-start">← 返回</button>
      <h2 className="text-white text-xl font-bold">{unit.title} — 练习模式</h2>
      {[{ id: 'en2zh', label: '英 → 中', desc: '看英文选中文', emoji: '🇬🇧' },
        { id: 'zh2en', label: '中 → 英', desc: '看中文选英文', emoji: '🇨🇳' },
        { id: 'spell', label: '拼写',    desc: '看中文输入英文', emoji: '✏️' }
      ].map(m => (
        <button key={m.id} onClick={() => setMode(m.id)}
          className="flex items-center gap-5 bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-5 text-left transition-all active:scale-95">
          <span className="text-4xl">{m.emoji}</span>
          <div><div className="text-white font-semibold text-lg">{m.label}</div><div className="text-gray-500 text-sm">{m.desc}</div></div>
        </button>
      ))}
    </div>
  )

  if (qIdx === -1) return (
    <div className="w-full max-w-2xl mx-auto px-4 py-12 flex flex-col items-center gap-6">
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
      <div className="flex items-center justify-between">
        <button onClick={() => setMode(null)} className="text-gray-400 hover:text-white text-sm">← 模式</button>
        <span className="text-gray-500">{qIdx + 1}/{order.length}</span>
        <span className="text-green-400 font-mono">{score.right}✓ {score.wrong}✗</span>
      </div>
      <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(qIdx / order.length) * 100}%` }} />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col items-center gap-3 min-h-[180px] justify-center">
        {mode === 'en2zh' && <QuizWord word={current.word} ipa={current.ipa} />}
        {mode !== 'en2zh' && <div className="text-4xl font-bold text-blue-300">{current.zh}</div>}
        {mode === 'spell' && <div className="text-gray-500 font-mono text-xl tracking-widest">{makeBlank(current.word)}</div>}
      </div>

      {mode !== 'spell' && (
        <div className="grid grid-cols-2 gap-3">
          {options.map((opt, i) => {
            const label = mode === 'en2zh' ? opt.zh : opt.word
            const isCorrect = mode === 'en2zh' ? opt.zh === current.zh : opt.word === current.word
            let cls = 'bg-gray-900 border border-gray-800 text-gray-300 hover:border-gray-600'
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
            className={`w-full bg-gray-900 border rounded-xl px-5 py-5 text-white text-center text-xl font-mono outline-none transition-colors
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

export default function VocabStudy({ onSetBack }) {
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

  useEffect(() => {
    if (view === 'books') onSetBack?.(null)
    else if (view === 'units') onSetBack?.(() => () => setView('books'))
    else if (view === 'cards') onSetBack?.(() => () => setView('units'))
    else if (view === 'quiz')  onSetBack?.(() => () => setView('cards'))
  }, [view, onSetBack])

  if (view === 'books') return <BookGrid onSelect={b => { setBook(b); setView('units') }} />
  if (view === 'units') return <UnitGrid book={book} progress={progress} onSelect={(u, ui, offset) => { setUnit(u); setUnitIdx(ui); setWordOffset(offset || 0); setView('cards') }} onBack={() => setView('books')} />
  if (view === 'cards') return <FlashCards book={book} unit={unit} unitIdx={unitIdx} wordOffset={wordOffset} progress={progress} onBack={() => setView('units')} onProgressChange={refreshProgress} />
  if (view === 'quiz')  return <QuizView  book={book} unit={unit} unitIdx={unitIdx} onBack={() => setView('cards')} onProgressChange={refreshProgress} />
  return null
}
