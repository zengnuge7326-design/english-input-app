import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react'
import TypingHands from './TypingHands'
import { getFingerByChar } from '../typing/KeyboardEngine'
import CloseBadge from './CloseBadge'
import { useHistoryLayer } from '../hooks/useHistoryLayer'

const HOLES = 9
const GAME_DURATION = 60

// 关卡定义：每关一个字母池
const LEVELS = [
  { id: 1, name: '基础位', desc: 'home 行：a s d f j k l',
    pool: ['a','s','d','f','j','k','l'] },
  { id: 2, name: '食指内伸', desc: '+ g h',
    pool: ['a','s','d','f','g','h','j','k','l'] },
  { id: 3, name: '上行食指/中指', desc: '+ e i r u',
    pool: ['a','s','d','f','g','h','j','k','l','e','i','r','u'] },
  { id: 4, name: '完整上行', desc: 'q w e r t y u i o p',
    pool: ['q','w','e','r','t','y','u','i','o','p','a','s','d','f','j','k','l'] },
  { id: 5, name: '下行小指', desc: 'z x c v b n m',
    pool: ['z','x','c','v','b','n','m','a','s','d','f','j','k','l'] },
  { id: 6, name: '全字母', desc: '完整 26 个字母',
    pool: 'abcdefghijklmnopqrstuvwxyz'.split('') },
  { id: 7, name: '全键 + 空格', desc: '字母 + 空格（拇指）',
    pool: [...'abcdefghijklmnopqrstuvwxyz'.split(''), ' '] },
]

// 键盘布局（包含 Tab/Caps/Enter/Shift/Space）
// flex 是 flex-grow 比例，字母键默认 1
const KEYBOARD_LAYOUT = [
  [ {k:'tab', label:'Tab', flex:1.5}, ...'qwertyuiop'.split('').map(k=>({k,label:k.toUpperCase()})), {k:'bksp', label:'⌫', flex:1.5} ],
  [ {k:'caps', label:'Caps', flex:1.8}, ...'asdfghjkl'.split('').map(k=>({k,label:k.toUpperCase()})), {k:'enter', label:'Enter', flex:2.2} ],
  [ {k:'shift-l', label:'⇧ Shift', flex:2.4}, ...'zxcvbnm'.split('').map(k=>({k,label:k.toUpperCase()})), {k:'shift-r', label:'⇧ Shift', flex:2.4} ],
  [ {k:'ctrl-l', label:'Ctrl', flex:1.5}, {k:'alt-l', label:'Alt', flex:1.3}, {k:' ', label:'Space', flex:8}, {k:'alt-r', label:'Alt', flex:1.3}, {k:'ctrl-r', label:'Ctrl', flex:1.5} ],
]

// 每个字母一个鲜亮配色（A→Z 循环 8 色）
const LETTER_COLORS = [
  '#ef4444', '#f97316', '#facc15', '#22c55e',
  '#14b8a6', '#3b82f6', '#a855f7', '#ec4899',
]
const colorFor = (letter) =>
  LETTER_COLORS[(letter.charCodeAt(0) - 97) % LETTER_COLORS.length]

/* =========================================================
 * 音频：Web Audio 合成 SFX + 背景音乐
 * ======================================================= */
function useAudioCtx() {
  const ref = useRef(null)
  const get = useCallback(() => {
    if (!ref.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (Ctx) ref.current = new Ctx()
    }
    return ref.current
  }, [])
  return get
}

function playTone(ctx, { freq = 600, type = 'sine', dur = 0.12, gain = 0.18, freqEnd = null, time = null }) {
  if (!ctx) return
  const t0 = time ?? ctx.currentTime
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (freqEnd != null) osc.frequency.exponentialRampToValueAtTime(freqEnd, t0 + dur)
  g.gain.setValueAtTime(gain, t0)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g); g.connect(ctx.destination)
  osc.start(t0)
  osc.stop(t0 + dur)
}

function playNoise(ctx, { dur = 0.1, gain = 0.2, filterFreq = 600 } = {}) {
  if (!ctx) return
  const buffer = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buffer
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = filterFreq
  const g = ctx.createGain()
  g.gain.setValueAtTime(gain, ctx.currentTime)
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur)
  src.connect(filter); filter.connect(g); g.connect(ctx.destination)
  src.start()
  src.stop(ctx.currentTime + dur)
}

// 砰！打中地鼠：低频 thud + 高频 ping + 噪声
function sfxHit(ctx) {
  playTone(ctx, { freq: 200, freqEnd: 60, type: 'square', dur: 0.18, gain: 0.22 })
  playNoise(ctx, { dur: 0.08, gain: 0.18, filterFreq: 800 })
  setTimeout(() => playTone(ctx, { freq: 1200, freqEnd: 1800, type: 'sine', dur: 0.1, gain: 0.12 }), 50)
}
// 地鼠探头：上扬 chirp
function sfxPop(ctx) {
  playTone(ctx, { freq: 480, freqEnd: 820, type: 'triangle', dur: 0.16, gain: 0.1 })
}
// 没打中（按错键/打空）：低沉 buzz
function sfxMiss(ctx) {
  playTone(ctx, { freq: 160, freqEnd: 110, type: 'sawtooth', dur: 0.12, gain: 0.1 })
}
// 开局：上升 arpeggio
function sfxStart(ctx) {
  const t = ctx.currentTime
  ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
    playTone(ctx, { freq: f, type: 'triangle', dur: 0.18, gain: 0.18, time: t + i * 0.08 })
  })
}
// 终局：下降 fanfare
function sfxEnd(ctx) {
  const t = ctx.currentTime
  ;[783.99, 659.25, 523.25, 392.0].forEach((f, i) => {
    playTone(ctx, { freq: f, type: 'triangle', dur: 0.22, gain: 0.2, time: t + i * 0.12 })
  })
}
// 最后 5 秒滴答声
function sfxTick(ctx) {
  playTone(ctx, { freq: 900, type: 'sine', dur: 0.05, gain: 0.12 })
}

// 简易芯片背景音乐：4/4 节奏，C 大调欢快循环
function startBgm(ctx, isMutedRef) {
  if (!ctx) return () => {}
  const notes = {
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0,
    C3: 130.81, G3: 196.0, F3: 174.61, A3: 220.0,
  }
  // 16 步旋律 + 8 步贝斯（loop）
  const melody = ['C5','E5','G5','E5','D5','F5','A5','F5','E5','G5','C5','G5','D5','F5','E5','C5']
  const bass   = ['C3','C3','G3','G3','F3','F3','C3','G3']
  const tempo = 138
  const step = 60 / tempo / 2 // 八分音符
  let stopped = false
  let i = 0

  // 主混音节点
  const master = ctx.createGain()
  master.gain.value = 0.0
  master.connect(ctx.destination)
  // 渐入
  master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.4)

  function loop() {
    if (stopped) return
    const t = ctx.currentTime
    if (!isMutedRef.current) {
      // 旋律
      const mf = notes[melody[i % melody.length]]
      playMelodyNote(ctx, master, mf, step * 0.85, t)
      // 贝斯每两个 step 一次
      if (i % 2 === 0) {
        const bf = notes[bass[(i / 2) % bass.length]]
        playBassNote(ctx, master, bf, step * 1.7, t)
      }
      // 每 4 步加一个轻鼓
      if (i % 4 === 0) {
        playKick(ctx, master, t)
      } else if (i % 4 === 2) {
        playHat(ctx, master, t)
      }
    }
    i++
    setTimeout(loop, step * 1000)
  }
  loop()
  return () => {
    stopped = true
    try {
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.2)
      setTimeout(() => master.disconnect(), 250)
    } catch {}
  }
}
function playMelodyNote(ctx, dest, freq, dur, t0) {
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = 'triangle'
  osc.frequency.value = freq
  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(0.18, t0 + 0.02)
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur)
  osc.connect(g); g.connect(dest)
  osc.start(t0); osc.stop(t0 + dur + 0.05)
}
function playBassNote(ctx, dest, freq, dur, t0) {
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = 'square'
  osc.frequency.value = freq
  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(0.10, t0 + 0.02)
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur)
  osc.connect(g); g.connect(dest)
  osc.start(t0); osc.stop(t0 + dur + 0.05)
}
function playKick(ctx, dest, t0) {
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(150, t0)
  osc.frequency.exponentialRampToValueAtTime(40, t0 + 0.12)
  g.gain.setValueAtTime(0.25, t0)
  g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.14)
  osc.connect(g); g.connect(dest)
  osc.start(t0); osc.stop(t0 + 0.16)
}
function playHat(ctx, dest, t0) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let k = 0; k < d.length; k++) d[k] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buf
  const f = ctx.createBiquadFilter()
  f.type = 'highpass'; f.frequency.value = 6000
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.08, t0)
  g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.04)
  src.connect(f); f.connect(g); g.connect(dest)
  src.start(t0); src.stop(t0 + 0.06)
}

/* =========================================================
 * 视觉组件
 * ======================================================= */
function Mole({ hit, letter }) {
  const isSpace = letter === ' '
  const color = letter ? (isSpace ? '#60a5fa' : colorFor(letter)) : '#fde047'
  const display = isSpace ? '␣' : (letter || '').toUpperCase()
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full pointer-events-none">
      <ellipse cx="50" cy="58" rx="34" ry="32" fill="#8b5a3c" />
      <ellipse cx="50" cy="62" rx="26" ry="22" fill="#c9926a" />
      {letter && !hit && (
        <text x="50" y="48" textAnchor="middle"
          fontSize="38" fontWeight="900"
          fill={color} stroke="#1a1a1a" strokeWidth="3"
          style={{ paintOrder: 'stroke', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          {display}
        </text>
      )}
      <circle cx="38" cy="58" r="5" fill="#fff" />
      <circle cx="62" cy="58" r="5" fill="#fff" />
      <circle cx="38" cy={hit ? 60 : 58} r={hit ? 1.2 : 2.5} fill="#1a1a1a" />
      <circle cx="62" cy={hit ? 60 : 58} r={hit ? 1.2 : 2.5} fill="#1a1a1a" />
      <ellipse cx="50" cy="68" rx="4.5" ry="3.5" fill="#3d2418" />
      <path d={hit ? "M 42 78 Q 50 74 58 78" : "M 42 76 Q 50 82 58 76"}
        stroke="#3d2418" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="46" y="71" width="3.5" height="5" fill="#fff" />
      <rect x="50.5" y="71" width="3.5" height="5" fill="#fff" />
      <ellipse cx="44" cy="36" rx="3" ry="5" fill="#3d2418" transform="rotate(-20 44 36)" />
      <ellipse cx="56" cy="36" rx="3" ry="5" fill="#3d2418" transform="rotate(20 56 36)" />
    </svg>
  )
}

function Hole({ mole, onWhack }) {
  const active = mole != null
  const hit = mole?.hit
  const letter = mole?.letter
  return (
    <div className="relative aspect-[4/3]" onClick={onWhack}>
      <div className="absolute inset-x-2 bottom-0 h-[55%] rounded-[50%] bg-gradient-to-b from-amber-950 to-black shadow-inner" />
      <div className="absolute inset-0 flex items-end justify-center overflow-hidden pointer-events-none">
        <div
          className="relative h-[92%] aspect-square transition-transform duration-150 ease-out cursor-pointer pointer-events-auto"
          style={{
            transform: active ? (hit ? 'translateY(55%) scale(0.85)' : 'translateY(0%)') : 'translateY(100%)',
          }}
        >
          <Mole hit={hit} letter={letter} />
        </div>
      </div>
      <div className="absolute inset-x-2 bottom-0 h-2 rounded-[50%] bg-black/40 pointer-events-none" />
    </div>
  )
}

function Key({ k, active, flash, letter }) {
  const base = 'inline-flex items-center justify-center rounded-lg font-bold transition-all select-none'
  const size = 'w-10 h-12 sm:w-14 sm:h-14 text-lg sm:text-xl'
  let cls = 'bg-white/95 text-slate-700 shadow'
  if (flash === 'hit') cls = 'bg-emerald-400 text-white scale-95 shadow-inner'
  else if (flash === 'miss') cls = 'bg-rose-300 text-rose-900 shadow-inner'
  else if (active) cls = 'text-white scale-95'
  const style = active && letter ? { background: colorFor(letter), color: '#fff' } : undefined
  return <div className={`${base} ${size} ${cls}`} style={style}>{k.toUpperCase()}</div>
}

/* =========================================================
 * 主组件
 * ======================================================= */
export default function WhackAMole({ onClose }) {
  useHistoryLayer(true, onClose)
  const [state, setState] = useState('select')  // select | playing | over
  const [levelId, setLevelId] = useState(1)
  const level = LEVELS.find(l => l.id === levelId) || LEVELS[0]
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(GAME_DURATION)
  const bestKey = `whack_best_${levelId}`
  const [best, setBest] = useState(() => Number(localStorage.getItem(bestKey) || 0))
  useEffect(() => {
    setBest(Number(localStorage.getItem(`whack_best_${levelId}`) || 0))
  }, [levelId])
  const [moles, setMoles] = useState(() => Array(HOLES).fill(null))
  const molesRef = useRef(moles)
  useEffect(() => { molesRef.current = moles }, [moles])
  const [floats, setFloats] = useState([])
  const [keyFlash, setKeyFlash] = useState({})
  const [muted, setMuted] = useState(() => localStorage.getItem('whack_muted') === '1')
  const mutedRef = useRef(muted)
  useEffect(() => { mutedRef.current = muted }, [muted])
  const getCtx = useAudioCtx()
  const timersRef = useRef([])
  const bgmStopRef = useRef(null)

  // 键盘网格定位（给 TypingHands 用）
  const gridRef = useRef(null)
  const keyRefs = useRef({})
  const [targetPos, setTargetPos] = useState(null)

  // 当前应该打的字母（第一个未被击中的活动地鼠）
  const targetLetter = (moles.find(m => m && !m.hit) || {}).letter || null

  useLayoutEffect(() => {
    if (!targetLetter || !gridRef.current) {
      setTargetPos(null); return
    }
    const keyEl = keyRefs.current[targetLetter]
    if (!keyEl) { setTargetPos(null); return }
    const kRect = keyEl.getBoundingClientRect()
    const gRect = gridRef.current.getBoundingClientRect()
    setTargetPos({
      x: kRect.left - gRect.left + kRect.width / 2,
      y: kRect.top - gRect.top + kRect.height / 2,
      gridWidth: gRect.width,
      gridHeight: gRect.height,
    })
  }, [targetLetter])

  const clearTimers = () => {
    timersRef.current.forEach(t => clearTimeout(t))
    timersRef.current = []
  }

  // 上一次出现的字母 + 洞索引（避免连续重复）
  const lastSpawnRef = useRef({ letter: null, idx: null })
  // 当前分数 ref（让 spawn 不依赖 score 闭包，避免 stale）
  const scoreRef = useRef(0)
  useEffect(() => { scoreRef.current = score }, [score])
  const levelIdRef = useRef(levelId)
  useEffect(() => { levelIdRef.current = levelId }, [levelId])
  // 是否已排队下一只（去重 schedule）
  const nextQueuedRef = useRef(false)

  const lifetimeForScore = (s) => {
    if (s < 4)  return 3500
    if (s < 9)  return 2800
    if (s < 14) return 2300
    if (s < 19) return 1900
    if (s < 25) return 1600
    return 1300
  }

  const spawnRef = useRef(null)

  const scheduleNext = useCallback((delay) => {
    if (nextQueuedRef.current) return
    nextQueuedRef.current = true
    const t = setTimeout(() => {
      nextQueuedRef.current = false
      spawnRef.current?.()
    }, delay)
    timersRef.current.push(t)
  }, [])

  const spawnOne = useCallback(() => {
    // 用 ref 同步读 — 避免 setMoles updater 的异步问题
    const current = molesRef.current
    if (current.some(m => m && !m.hit)) return

    const curScore = scoreRef.current
    const basePool = LEVELS.find(l => l.id === levelIdRef.current)?.pool || LEVELS[0].pool
    const pool = basePool.filter(c => c !== lastSpawnRef.current.letter)
    if (pool.length === 0) return
    const letter = pool[Math.floor(Math.random() * pool.length)]

    // 只在空洞里挑（再尽量避开上一个洞）
    const emptyCells = current.map((m, i) => m == null ? i : -1).filter(i => i >= 0)
    if (emptyCells.length === 0) return
    const preferred = emptyCells.filter(i => i !== lastSpawnRef.current.idx)
    const pickPool = preferred.length > 0 ? preferred : emptyCells
    const idx = pickPool[Math.floor(Math.random() * pickPool.length)]

    lastSpawnRef.current = { letter, idx }
    const mole = { hit: false, letter, id: Math.random().toString(36).slice(2) }

    setMoles(p => {
      const n = [...p]
      n[idx] = mole
      return n
    })
    if (!mutedRef.current) sfxPop(getCtx())

    const life = lifetimeForScore(curScore)
    const t = setTimeout(() => {
      // 只清除「同一只」地鼠（用 id 匹配，避免清错后续替换的地鼠）
      let stillThere = false
      setMoles(p => {
        if (p[idx]?.id === mole.id && !p[idx].hit) {
          stillThere = true
          const n = [...p]; n[idx] = null; return n
        }
        return p
      })
      if (stillThere) scheduleNext(500)
    }, life)
    timersRef.current.push(t)
  }, [getCtx, scheduleNext])

  // 保持 ref 始终指向最新 spawnOne
  useEffect(() => { spawnRef.current = spawnOne }, [spawnOne])

  // 开局触发首只
  useEffect(() => {
    if (state !== 'playing') return
    scheduleNext(500)
    return () => clearTimers()
  }, [state, scheduleNext])

  // 看门狗：若 playing 中场上无任何活动地鼠，1.2s 内必出下一只
  useEffect(() => {
    if (state !== 'playing') return
    const iv = setInterval(() => {
      const hasActive = molesRef.current.some(m => m && !m.hit)
      if (!hasActive && !nextQueuedRef.current) {
        // 强制清掉旧的去重锁，再排一只
        scheduleNext(200)
      }
    }, 1200)
    return () => clearInterval(iv)
  }, [state, scheduleNext])

  // 计时
  useEffect(() => {
    if (state !== 'playing') return
    const iv = setInterval(() => {
      setTime(s => {
        if (s <= 1) {
          clearInterval(iv)
          setState('over')
          clearTimers()
          setMoles(Array(HOLES).fill(null))
          if (!mutedRef.current) sfxEnd(getCtx())
          setScore(sc => {
            setBest(b => {
              if (sc > b) {
                localStorage.setItem(`whack_best_${levelIdRef.current}`, String(sc))
                return sc
              }
              return b
            })
            return sc
          })
          return 0
        }
        if (s <= 6 && !mutedRef.current) sfxTick(getCtx())
        return s - 1
      })
    }, 1000)
    return () => clearInterval(iv)
  }, [state, getCtx])

  // 背景音乐：仅 playing 期间
  useEffect(() => {
    if (state !== 'playing') return
    const ctx = getCtx()
    if (!ctx) return
    try { ctx.resume() } catch {}
    bgmStopRef.current = startBgm(ctx, mutedRef)
    return () => {
      bgmStopRef.current?.()
      bgmStopRef.current = null
    }
  }, [state, getCtx])

  const start = (lvl) => {
    if (lvl) setLevelId(lvl)
    setScore(0); setTime(GAME_DURATION); setMoles(Array(HOLES).fill(null))
    lastSpawnRef.current = { letter: null, idx: null }
    nextQueuedRef.current = false
    setState('playing')
    try {
      const ctx = getCtx()
      ctx?.resume()
      if (!mutedRef.current) sfxStart(ctx)
    } catch {}
  }

  const whackAt = useCallback((i, point) => {
    // 同步读 ref 防止 stale 闭包
    const m = molesRef.current[i]
    if (!m || m.hit) return
    const moleId = m.id
    if (!mutedRef.current) sfxHit(getCtx())
    setScore(s => s + 1)
    if (point) {
      const fid = Math.random().toString(36).slice(2)
      const c = m.letter === ' ' ? '#60a5fa' : colorFor(m.letter)
      setFloats(f => [...f, { id: fid, x: point.x, y: point.y, text: '+1', color: c }])
      setTimeout(() => setFloats(f => f.filter(x => x.id !== fid)), 800)
    }
    setMoles(p => {
      // 仅在同一只地鼠仍在原位时标记 hit
      if (p[i]?.id !== moleId) return p
      const n = [...p]; n[i] = { ...p[i], hit: true }; return n
    })
    const tHide = setTimeout(() => {
      setMoles(p => {
        if (p[i]?.id !== moleId) return p
        const n = [...p]; n[i] = null; return n
      })
      scheduleNext(350)
    }, 200)
    timersRef.current.push(tHide)
  }, [getCtx, scheduleNext])

  const flashKey = useCallback((k, kind) => {
    setKeyFlash(prev => ({ ...prev, [k]: kind }))
    setTimeout(() => setKeyFlash(prev => {
      const n = { ...prev }; delete n[k]; return n
    }), 220)
  }, [])

  const onHoleClick = (i) => (e) => {
    e.stopPropagation()
    if (state !== 'playing') return
    const rect = e.currentTarget.getBoundingClientRect()
    const m = molesRef.current[i]
    if (m && !m.hit) {
      whackAt(i, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
    } else if (!m && !mutedRef.current) {
      sfxMiss(getCtx())
    }
  }

  useEffect(() => {
    if (state !== 'playing') return
    const onKey = (e) => {
      let k = e.key
      if (k === ' ') k = ' '
      else if (/^[a-zA-Z]$/.test(k)) k = k.toLowerCase()
      else return
      e.preventDefault()
      // 用 ref 同步读，避免 React 渲染滞后导致 stale closure
      const idx = molesRef.current.findIndex(m => m && !m.hit && m.letter === k)
      if (idx >= 0) {
        flashKey(k, 'hit')
        const el = document.querySelector(`[data-hole-idx="${idx}"]`)
        const rect = el?.getBoundingClientRect()
        const point = rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : null
        whackAt(idx, point)
      } else {
        flashKey(k, 'miss')
        if (!mutedRef.current) sfxMiss(getCtx())
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state, whackAt, flashKey, getCtx])

  const onVirtualKey = (k) => () => {
    if (state !== 'playing') return
    // 只在字母 / 空格上触发；Tab/Caps/Shift/Enter 仅做视觉装饰
    if (!(k.length === 1 && /^[a-z ]$/.test(k))) return
    window.dispatchEvent(new KeyboardEvent('keydown', { key: k }))
  }

  useEffect(() => () => {
    clearTimers()
    bgmStopRef.current?.()
  }, [])

  const toggleMute = () => {
    const v = !muted
    setMuted(v)
    localStorage.setItem('whack_muted', v ? '1' : '0')
  }

  const targetFinger = targetLetter ? getFingerByChar(targetLetter) : null

  // 当前关卡通关阈值（用于显示 ⭐ 徽章）
  const PASS_THRESHOLD = 12

  return (
    <div className="fixed inset-0 z-[200] bg-gradient-to-b from-sky-400 via-cyan-500 to-emerald-500 flex flex-col items-stretch select-none overflow-hidden"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>

      {/* 顶部胶囊状态栏 */}
      <header className="flex items-center justify-between gap-2 px-3 py-2 sm:py-3 shrink-0">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 shadow text-slate-800">
          <span className="text-base">🐹</span>
          <span className="text-sm font-bold">
            {state === 'playing' || state === 'over' ? `第 ${level.id} 关 · ${level.name}` : '打地鼠 · 打字版'}
          </span>
        </div>
        {state === 'playing' && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/95 shadow">
              <span className="text-xs text-emerald-700">🎯</span>
              <span className="text-sm font-extrabold text-emerald-700 tabular-nums">{score}</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/95 shadow">
              <span className="text-xs text-amber-700">⏱</span>
              <span className="text-sm font-extrabold text-amber-700 tabular-nums">{time}s</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/80 shadow">
              <span className="text-[10px] text-slate-500">最高</span>
              <span className="text-sm font-bold text-slate-700 tabular-nums">{best}</span>
            </div>
          </div>
        )}
        <div className="flex items-center gap-1.5 mr-12">
          {/* mr-12 给右上角的 CloseBadge 让位 */}
          <button onClick={toggleMute}
            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 text-base shadow"
            title={muted ? '开启声音' : '静音'}>
            {muted ? '🔇' : '🔊'}
          </button>
        </div>
      </header>
      <CloseBadge onClose={onClose} />

      {/* 主体区域：根据状态切换 */}
      <main className={`flex-1 flex flex-col items-center min-h-0 px-3 pb-2 gap-3 overflow-auto ${state === 'playing' ? 'justify-center' : 'justify-start pt-2'}`}>
        {state === 'select' && (
          <div className="w-full max-w-2xl bg-white/15 backdrop-blur-md rounded-3xl border border-white/30 p-4 sm:p-6 shadow-xl">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-3 drop-shadow text-center">选择关卡</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {LEVELS.map(lv => {
                const lvBest = Number(localStorage.getItem(`whack_best_${lv.id}`) || 0)
                const passed = lvBest >= PASS_THRESHOLD
                return (
                  <button key={lv.id} onClick={() => start(lv.id)}
                    className="text-left p-3 rounded-xl bg-white hover:bg-amber-50 shadow transition-all hover:scale-[1.03] hover:shadow-lg relative">
                    {passed && (
                      <span className="absolute top-1.5 right-2 text-amber-400 text-base" title="已通关">⭐</span>
                    )}
                    <div className="text-base font-extrabold text-slate-900 leading-tight">
                      第 {lv.id} 关
                    </div>
                    <div className="text-sm font-semibold text-slate-700 mb-1">{lv.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono truncate">{lv.desc}</div>
                    <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full font-bold">
                      最高 {lvBest}
                    </div>
                  </button>
                )
              })}
            </div>
            <p className="text-[11px] text-white/80 text-center mt-3">
              得分 ≥ {PASS_THRESHOLD} 为通关，将获得 ⭐ 徽章
            </p>
          </div>
        )}

        {state === 'playing' && (
          <div className="relative w-full max-w-[560px] bg-emerald-500/40 rounded-3xl p-3 shadow-2xl border-4 border-emerald-700/50"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 0, transparent 50%)' }}>
            <div className="grid grid-cols-3 gap-x-3 gap-y-0 w-full">
              {moles.map((m, i) => (
                <div key={i} data-hole-idx={i}>
                  <Hole mole={m} onWhack={onHoleClick(i)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {state === 'over' && (
          <div className="w-full max-w-md bg-white/15 backdrop-blur-md rounded-3xl border border-white/30 p-5 sm:p-7 shadow-xl flex flex-col items-center">
            <div className="text-5xl mb-1">
              {score >= best && score > 0 ? '🏆' : score >= PASS_THRESHOLD ? '⭐' : '🎉'}
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-1 drop-shadow">第 {level.id} 关 完成</h2>
            <p className="text-white text-3xl font-black mb-1">{score}</p>
            <p className="text-white/85 text-sm mb-4">
              最高 {best}{score === best && score > 0 ? ' (新纪录!)' : ''} ·
              {score >= PASS_THRESHOLD ? ' 通关 ✓' : ` 还需 ${PASS_THRESHOLD - score} 分通关`}
            </p>
            <div className="flex gap-2 flex-wrap justify-center">
              <button onClick={() => start(level.id)}
                className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-amber-900 font-bold text-sm shadow-lg">
                再来一局
              </button>
              {LEVELS.find(l => l.id === level.id + 1) && (
                <button onClick={() => start(level.id + 1)}
                  className="px-5 py-2.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-emerald-900 font-bold text-sm shadow-lg">
                  下一关 ▶
                </button>
              )}
              <button onClick={() => setState('select')}
                className="px-5 py-2.5 rounded-full bg-white/95 hover:bg-white text-slate-700 font-bold text-sm shadow-lg">
                选关
              </button>
            </div>
          </div>
        )}
      </main>

      {/* QWERTY 键盘 + 上方手部轮廓 — 总是显示，方便选关/复盘看键位 */}
      <footer className="w-full bg-slate-900/85 border-t border-white/10 backdrop-blur shadow-2xl shrink-0 px-1.5 sm:px-3 py-2 sm:py-3">
        <div ref={gridRef} className="keyboard-grid relative w-full max-w-4xl mx-auto flex flex-col items-stretch gap-1 sm:gap-1.5">
          {/* 手部浮层 */}
          {state === 'playing' && targetPos && (
            <div className="absolute inset-0 z-10 pointer-events-none">
              <TypingHands activeFinger={targetFinger} targetPos={targetPos} glowHand />
            </div>
          )}
          {/* 手部浮层（仅游戏中显示） */}
          {state === 'playing' && targetPos && (
            <div className="absolute inset-0 z-10 pointer-events-none">
              <TypingHands activeFinger={targetFinger} targetPos={targetPos} glowHand />
            </div>
          )}
          {KEYBOARD_LAYOUT.map((row, ri) => (
            <div key={ri} className="flex gap-1 sm:gap-1.5 w-full">
              {row.map((cell, ci) => {
                const isLetter = cell.k.length === 1 && /^[a-z ]$/.test(cell.k)
                const activeMole = isLetter ? moles.find(m => m && !m.hit && m.letter === cell.k) : null
                const flashState = keyFlash[cell.k]
                // 用 flex 比例分配宽度：字母=1，功能键按 cell.flex
                const flex = cell.flex ?? (isLetter ? 1 : 1.4)
                const colorStyle = activeMole
                  ? { background: cell.k === ' ' ? '#60a5fa' : colorFor(activeMole.letter), color: '#fff' }
                  : undefined
                let cls = 'h-11 sm:h-12 md:h-14 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base font-bold transition-all select-none inline-flex items-center justify-center min-w-0'
                if (flashState === 'hit') cls += ' bg-emerald-400 text-white scale-95 shadow-inner'
                else if (flashState === 'miss') cls += ' bg-rose-300 text-rose-900 shadow-inner'
                else if (activeMole) cls += ' scale-95 shadow ring-2 ring-white/60'
                else cls += isLetter
                  ? ' bg-white/95 text-slate-700 shadow active:scale-95'
                  : ' bg-slate-700/80 text-slate-200 shadow'
                return (
                  <button key={ci} type="button" onClick={onVirtualKey(cell.k)}
                    ref={el => { if (isLetter) keyRefs.current[cell.k] = el }}
                    style={{ flex: `${flex} 1 0`, ...colorStyle }}
                    className={cls}>
                    {cell.label}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </footer>

      {floats.map(f => (
        <div key={f.id} className="fixed pointer-events-none text-3xl font-black drop-shadow-lg z-[210]"
          style={{
            left: f.x, top: f.y,
            transform: 'translate(-50%, -50%)',
            animation: 'mole-float 0.8s ease-out forwards',
            color: f.color || '#fde047',
            WebkitTextStroke: '2px #1a1a1a',
          }}>
          {f.text}
        </div>
      ))}

      <style>{`
        @keyframes mole-float {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -180%) scale(1.6); }
        }
      `}</style>
    </div>
  )
}
