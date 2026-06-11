import { useState, useEffect, useMemo, useRef } from 'react'
import PageBackBar from './PageBackBar'
import UnlockConfirmModal from './UnlockConfirmModal'
import OceanBg from './OceanBg'
import PandaMascot from './PandaMascot'
import { IconArrowLeft } from './Icons'
import { useSound } from '../hooks/useSound'
import { useSpeechRecognition, matchWord } from '../hooks/useSpeechRecognition'
import { PHONEME_GROUPS, PHONEME_EXAMPLES, MINIMAL_PAIRS, themeOfGroup, symbolToGroup } from '../data/phonemeChart.js'
import { playPhoneme, playPhonemeExample, playWordAudio, preloadPhonemeAudio } from '../utils/phonicsAudio.js'
import { unlockAudio } from '../utils/audioUnlock.js'

// ─── 持久化掌握度 ────────────────────────────────────────────
function loadPhonMastery() {
  try { return JSON.parse(localStorage.getItem('phoneme_mastery') || '{}') } catch { return {} }
}
function savePhonMastery(m) { try { localStorage.setItem('phoneme_mastery', JSON.stringify(m)) } catch {} }
function phonStars(mastery, symbol) {
  return Object.values(mastery[symbol] || {}).filter(Boolean).length
}
function phonFullyMastered(mastery, symbol) {
  return phonStars(mastery, symbol) >= 4
}
function groupProgress(mastery, group) {
  let stars = 0
  group.symbols.forEach(s => { stars += phonStars(mastery, s) })
  return { stars, total: group.symbols.length * 4 }
}

// ─── 撒花 / 火花 ─────────────────────────────────────────────
const CONFETTI_COLORS = ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#fb7185']
function spawnConfetti(setConfetti, n = 30) {
  const items = Array.from({ length: n }, () => ({
    id: Math.random().toString(36).slice(2),
    left: Math.random() * 100, delay: Math.random() * 0.4,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rot: Math.random() * 360,
  }))
  setConfetti(c => [...c, ...items])
  setTimeout(() => setConfetti(c => c.filter(x => !items.find(it => it.id === x.id))), 2500)
}
function ConfettiLayer({ items }) {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 220 }}>
      {items.map(c => (
        <div key={c.id} className="confetti"
          style={{ left: `${c.left}%`, background: c.color, transform: `rotate(${c.rot}deg)`, animationDelay: `${c.delay}s` }} />
      ))}
    </div>
  )
}
function SparkleBurst({ trigger }) {
  if (!trigger) return null
  const pts = [
    { dx: '-90px', dy: '-90px' }, { dx: '90px',  dy: '-90px' },
    { dx: '-110px', dy: '0px' },  { dx: '110px', dy: '0px' },
    { dx: '-80px', dy: '90px' },  { dx: '80px',  dy: '90px' },
    { dx: '0px',   dy: '-120px' },{ dx: '0px',   dy: '110px' },
  ]
  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      {pts.map((p, i) => (
        <span key={`${trigger}-${i}`} className="sparkle"
          style={{ '--dx': p.dx, '--dy': p.dy, color: i % 2 ? '#fbbf24' : '#facc15' }}>★</span>
      ))}
    </div>
  )
}

// ─── 顶部进度条 ──────────────────────────────────────────────
function TopProgressBar({ stars, total, label }) {
  const frac = total > 0 ? Math.min(1, stars / total) : 0
  const full = frac >= 0.999
  return (
    <div className="flex-1 min-w-0">
      <div className="w-full h-3 rounded-full bg-slate-800/60 overflow-hidden backdrop-blur-sm">
        <div className="h-full rounded-full"
          style={{
            width: `${frac * 100}%`,
            background: full ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#3b82f6,#22d3ee)',
            transition: 'width .45s cubic-bezier(.34,1.56,.64,1)',
          }}>
          <div className="h-[3px] mt-[2px] mx-1 rounded-full bg-white/30" />
        </div>
      </div>
      <div className="mt-1 text-[11px] text-slate-500 flex justify-between">
        <span>{label}</span>
        <span>⭐ {stars}/{total}</span>
      </div>
    </div>
  )
}

// ───────────────────────────────────────────────────────────
// 层 1：8 个分类封面
// ───────────────────────────────────────────────────────────
function GroupGrid({ mastery, onPick, onClose, lockedBack = false, onUnlockBack }) {
  const totalStarsAll = PHONEME_GROUPS.reduce((s, g) => s + groupProgress(mastery, g).stars, 0)
  const totalAll = PHONEME_GROUPS.reduce((s, g) => s + groupProgress(mastery, g).total, 0)
  return (
    <div className="w-full max-w-5xl mx-auto px-3 py-4 relative" style={{ minHeight: 'calc(100vh - 110px)' }}>
      <OceanBg />
      <div className="relative z-10 flex items-center gap-3 mb-4">
        <button onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white transition-colors shrink-0">
          <IconArrowLeft size={18} />
        </button>
        <TopProgressBar stars={totalStarsAll} total={totalAll} label="音标学习 · 8 分类" />
      </div>
      <h2 className="relative z-10 text-white text-lg font-bold mb-3">选择音标分类</h2>
      {lockedBack && (
        <div className="relative z-10 mb-3">
          <button
            type="button"
            onClick={onUnlockBack}
            className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white text-sm font-bold shadow-lg hover:scale-[1.01] transition-transform flex items-center justify-center gap-2 border border-purple-400/40"
          >
            <span>💎 20</span>
            <span>解锁后 4 个分类（含双元音、塞擦音、鼻音、流音）</span>
          </button>
        </div>
      )}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {PHONEME_GROUPS.map((group, gIdx) => {
          const t = themeOfGroup(group)
          const { stars, total } = groupProgress(mastery, group)
          const pct = total ? Math.round((stars / total) * 100) : 0
          const sample = group.symbols.slice(0, 3).join(' · ')
          const allDone = stars >= total
          const groupLocked = lockedBack && gIdx >= 4
          return (
            <button key={group.id} onClick={() => groupLocked ? onUnlockBack?.() : onPick(group)}
              style={groupLocked ? { filter: 'grayscale(0.85) brightness(0.55)' } : undefined}
              className={`relative rounded-3xl bg-gradient-to-br ${t.from} ${t.to} ${t.glow} p-4 sm:p-5
                backdrop-blur-xl backdrop-saturate-150 border border-white/15
                flex flex-col gap-2 text-left transition-all active:scale-95 hover:scale-[1.03] shadow-md
                ${allDone ? 'ring-2 ring-white/60' : ''}`}>
              {allDone && <span className="absolute -top-2 -right-2 text-xl">👑</span>}
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl">{group.emoji}</span>
                <span className="text-[10px] text-white/85 bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  {group.symbols.length} 个
                </span>
              </div>
              <div className="text-white text-lg sm:text-xl font-extrabold drop-shadow leading-tight">{group.title}</div>
              <div className="text-white/80 text-[10px] sm:text-xs leading-snug">{group.hint}</div>
              <div className="font-mono text-white/90 text-sm font-bold tracking-wider mt-1">{sample}</div>
              <div className="mt-2 w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                <div className="h-full bg-white/85 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <div className="text-[10px] text-white/85 tabular-nums">⭐ {stars}/{total}</div>
            </button>
          )
        })}
      </div>
      <div className="relative z-10 mt-4 text-center text-[11px] text-slate-500">
        点分类进入 · 每音标 4 关挑战 · 4 颗⭐ = 掌握 🌟
      </div>
    </div>
  )
}

// ───────────────────────────────────────────────────────────
// 层 2：单分类下的音标列表
// ───────────────────────────────────────────────────────────
function PhonRing({ stars }) {
  const total = 4
  const radius = 14
  const C = 2 * Math.PI * radius
  return (
    <div className="absolute top-1 right-1 w-7 h-7">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <circle cx="18" cy="18" r={radius} fill="rgba(15,23,42,0.85)" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
        {Array.from({ length: stars }).map((_, i) => (
          <circle key={i} cx="18" cy="18" r={radius} fill="none"
            stroke="rgba(255,255,255,0.95)" strokeWidth="3"
            strokeDasharray={`${C / total} ${C}`}
            strokeDashoffset={-i * C / total} />
        ))}
      </svg>
    </div>
  )
}
function PhonemeGrid({ group, mastery, onPick, onBack }) {
  const t = themeOfGroup(group)
  const { stars, total } = groupProgress(mastery, group)
  return (
    <div className="w-full max-w-5xl mx-auto px-3 py-4 relative" style={{ minHeight: 'calc(100vh - 110px)' }}>
      <OceanBg />
      <div className="relative z-10 flex items-center gap-3 mb-4">
        <button onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white transition-colors shrink-0">
          <IconArrowLeft size={18} />
        </button>
        <TopProgressBar stars={stars} total={total} label={`${group.title} · ${group.hint}`} />
      </div>
      <div className={`relative z-10 rounded-2xl bg-gradient-to-r ${t.from} ${t.to} ${t.glow} backdrop-blur-xl backdrop-saturate-150 border border-white/10 p-4 mb-4 flex items-center gap-3`}>
        <span className="text-3xl">{group.emoji}</span>
        <div>
          <div className="text-white text-xl font-extrabold">{group.title}</div>
          <div className="text-white/85 text-xs">{group.hint} · {group.symbols.length} 个音标 · ⭐ {stars}/{total}</div>
        </div>
      </div>
      <div className="relative z-10 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {group.symbols.map(symbol => {
          const ex = PHONEME_EXAMPLES[symbol] || { word: '', zh: '' }
          const s = phonStars(mastery, symbol)
          const done = s >= 4
          return (
            <button key={symbol} onClick={() => onPick(symbol)}
              className={`relative rounded-2xl bg-gradient-to-br ${t.from} ${t.to} backdrop-blur-xl backdrop-saturate-150 border border-white/10
                p-3 flex flex-col items-center gap-1 active:scale-95 hover:scale-105 transition-all
                ${done ? 'ring-2 ring-yellow-300' : ''}`}>
              <PhonRing stars={s} />
              <span className="font-mono text-white text-2xl sm:text-3xl font-extrabold drop-shadow tracking-tight">/{symbol}/</span>
              <span className="text-white/85 text-xs font-medium">{ex.word}</span>
              {done && <span className="absolute -top-1 -right-1 text-xs">⭐</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── 关卡 Tab 配置 ──────────────────────────────────────────
const LEVELS = [
  { id: 1, label: '听辨', icon: '🎧', desc: '听音 · 选 IPA', from: 'from-rose-500',    to: 'to-pink-400' },
  { id: 2, label: '配词', icon: '🔤', desc: '听音 · 选词',   from: 'from-blue-500',    to: 'to-cyan-400' },
  { id: 3, label: '跟读', icon: '🎤', desc: '朗读例词',      from: 'from-purple-600',  to: 'to-fuchsia-400' },
  { id: 4, label: '辨音', icon: '👂', desc: '最小对立对',    from: 'from-emerald-500', to: 'to-teal-400' },
]

function pickDistractors(group, target, count = 3) {
  const pool = group.symbols.filter(s => s !== target)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, count)
}

// ───────────────────────────────────────────────────────────
// Level 1：听辨
// ───────────────────────────────────────────────────────────
function LevelListenIPA({ symbol, group, sounds, onXp, onCrystal, onPass }) {
  const [options, setOptions] = useState([])
  const [pick, setPick] = useState(null)
  const [pandaMood, setPandaMood] = useState('idle')
  const [round, setRound] = useState(0)
  const [streak, setStreak] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)

  function playTarget() {
    unlockAudio(); playPhoneme(symbol)
    setPandaMood('listening'); setTimeout(() => setPandaMood('idle'), 1300)
  }

  useEffect(() => {
    const distract = pickDistractors(group, symbol, 3)
    const opts = [symbol, ...distract]
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));[opts[i], opts[j]] = [opts[j], opts[i]]
    }
    setOptions(opts); setPick(null)
    setTimeout(playTarget, 400)
  }, [symbol, round])

  function onPick(i) {
    if (pick !== null) return
    setPick(i)
    if (options[i] === symbol) {
      setPandaMood('correct'); sounds.playCorrect?.(); sounds.playBubble?.()
      onXp?.(3)
      const ns = streak + 1; setStreak(ns)
      const cc = correctCount + 1; setCorrectCount(cc)
      if (ns === 5) onCrystal?.('purple', 1, 'phoneme_l1_streak5', { symbol, level: 1 })
      if (ns === 10) onCrystal?.('purple', 2, 'phoneme_l1_streak10', { symbol, level: 1 })
      if (cc === 5) onPass?.()
      setTimeout(() => { setPandaMood('idle'); setRound(r => r + 1) }, 1000)
    } else {
      setPandaMood('wrong'); sounds.playError?.(); setStreak(0)
      setTimeout(() => { setPick(null); setPandaMood('idle') }, 900)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <PandaMascot mood={pandaMood} size={110} />
        <div className="text-center">
          <button onClick={playTarget}
            className="px-5 py-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white text-base font-bold shadow-lg ring-2 ring-cyan-300/50 active:scale-95 transition-all">
            🔊 再听一次
          </button>
          <div className="text-xs text-slate-300 mt-2">第 {round + 1} 题 · 连击 {streak} 🔥 · 累计 {correctCount}/5</div>
          <div className="text-[10px] text-slate-500 mt-0.5">听音标音 → 选对应 IPA</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {options.map((opt, i) => {
          const isCorrect = opt === symbol
          const showRight = pick !== null && isCorrect
          const showWrong = pick === i && !isCorrect
          return (
            <button key={i} onClick={() => onPick(i)} disabled={pick !== null}
              className={`aspect-[4/3] rounded-2xl bg-slate-800/60 backdrop-blur-xl border-2 border-white/15
                font-mono text-3xl sm:text-4xl font-extrabold text-white transition-all active:scale-95
                ${showRight ? 'ring-4 ring-green-300 letter-bounce border-green-400 shadow-[0_0_22px_rgba(34,197,94,0.55)]' : ''}
                ${showWrong ? 'opacity-50 ring-4 ring-red-400 border-red-400' : ''}
                ${pick === null ? 'hover:scale-105 hover:bg-slate-700/60' : ''}`}>
              /{opt}/
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ───────────────────────────────────────────────────────────
// Level 2：配词
// ───────────────────────────────────────────────────────────
function LevelListenWord({ symbol, group, sounds, onXp, onCrystal, onPass }) {
  const [options, setOptions] = useState([])
  const [pick, setPick] = useState(null)
  const [pandaMood, setPandaMood] = useState('idle')
  const [round, setRound] = useState(0)
  const [streak, setStreak] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)

  const targetWord = PHONEME_EXAMPLES[symbol]?.word || ''

  function playTarget() {
    unlockAudio(); playPhoneme(symbol)
    setPandaMood('listening'); setTimeout(() => setPandaMood('idle'), 1300)
  }

  useEffect(() => {
    const distractSyms = pickDistractors(group, symbol, 3)
    const distractWords = distractSyms.map(s => PHONEME_EXAMPLES[s]?.word).filter(Boolean)
    const seen = new Set(); const uniq = []
    ;[targetWord, ...distractWords].forEach(w => { if (w && !seen.has(w)) { uniq.push(w); seen.add(w) } })
    while (uniq.length < 4) {
      const rndSym = group.symbols[Math.floor(Math.random() * group.symbols.length)]
      const w = PHONEME_EXAMPLES[rndSym]?.word
      if (w && !seen.has(w)) { uniq.push(w); seen.add(w) }
      if (uniq.length === 4) break
      if (seen.size >= group.symbols.length) break
    }
    for (let i = uniq.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));[uniq[i], uniq[j]] = [uniq[j], uniq[i]]
    }
    setOptions(uniq); setPick(null)
    setTimeout(playTarget, 400)
  }, [symbol, round])

  function onPick(i) {
    if (pick !== null) return
    setPick(i)
    if (options[i] === targetWord) {
      setPandaMood('correct'); sounds.playCorrect?.(); sounds.playBubble?.()
      onXp?.(3)
      const ns = streak + 1; setStreak(ns)
      const cc = correctCount + 1; setCorrectCount(cc)
      if (ns === 5) onCrystal?.('purple', 1, 'phoneme_l2_streak5', { symbol, level: 2 })
      if (cc === 5) onPass?.()
      setTimeout(() => { setPandaMood('idle'); setRound(r => r + 1) }, 1000)
    } else {
      setPandaMood('wrong'); sounds.playError?.(); setStreak(0)
      setTimeout(() => { setPick(null); setPandaMood('idle') }, 900)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <PandaMascot mood={pandaMood} size={110} />
        <div className="text-center">
          <button onClick={playTarget}
            className="px-5 py-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white text-base font-bold shadow-lg ring-2 ring-cyan-300/50 active:scale-95 transition-all">
            🔊 再听一次
          </button>
          <div className="text-xs text-slate-300 mt-2">第 {round + 1} 题 · 连击 {streak} 🔥 · 累计 {correctCount}/5</div>
          <div className="text-[10px] text-slate-500 mt-0.5">听音标音 → 选含该音的例词</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {options.map((opt, i) => {
          const isCorrect = opt === targetWord
          const showRight = pick !== null && isCorrect
          const showWrong = pick === i && !isCorrect
          return (
            <button key={i} onClick={() => onPick(i)} disabled={pick !== null}
              className={`aspect-[5/3] rounded-2xl bg-slate-800/60 backdrop-blur-xl border-2 border-white/15
                text-2xl sm:text-3xl font-extrabold text-white transition-all active:scale-95
                ${showRight ? 'ring-4 ring-green-300 letter-bounce border-green-400 shadow-[0_0_22px_rgba(34,197,94,0.55)]' : ''}
                ${showWrong ? 'opacity-50 ring-4 ring-red-400 border-red-400' : ''}
                ${pick === null ? 'hover:scale-105 hover:bg-slate-700/60' : ''}`}>
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ───────────────────────────────────────────────────────────
// Level 3：跟读
// ───────────────────────────────────────────────────────────
function LevelSpeak({ symbol, group, sounds, sr, onXp, onCrystal, onPass }) {
  const [pandaMood, setPandaMood] = useState('idle')
  const [duMsg, setDuMsg] = useState('')
  const [flipped, setFlipped] = useState(false)
  const [showSparkle, setShowSparkle] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const cancelTokenRef = useRef(0)
  const ex = PHONEME_EXAMPLES[symbol] || { word: '', zh: '' }
  const t = themeOfGroup(group)

  function onTap() {
    unlockAudio()
    const myToken = ++cancelTokenRef.current
    setPandaMood('listening'); setDuMsg('🔊 听例词…')
    playWordAudio(ex.word)
    let fails = 0; let softTries = 0
    function startListen() {
      if (cancelTokenRef.current !== myToken) return
      if (!sr.supported) { setDuMsg('请用 Chrome 浏览器开启麦克风'); setPandaMood('idle'); return }
      setDuMsg(`🎤 跟我读：${ex.word}`)
      sr.listen({
        onResult: (text, alts) => {
          if (cancelTokenRef.current !== myToken) return
          if (typeof window !== 'undefined') console.debug('[音标]', { target: ex.word, heard: text, alts })
          if (matchWord(ex.word, alts && alts.length ? alts : [text])) {
            softTries = 0; fails = 0
            setPandaMood('correct'); sounds.playCorrect?.(); sounds.playBubble?.()
            onXp?.(3); setFlipped(true); setShowSparkle(s => s + 1); setDuMsg(`🎉 棒！听到「${text}」`)
            const ns = streak + 1; setStreak(ns)
            const cc = correctCount + 1; setCorrectCount(cc)
            if (ns === 5) onCrystal?.('purple', 1, 'phoneme_l3_streak5', { symbol, level: 3 })
            if (cc === 5) onPass?.()
            setTimeout(() => {
              if (cancelTokenRef.current !== myToken) return
              setFlipped(false); setPandaMood('idle'); setDuMsg('')
            }, 1500)
          } else {
            softTries = 0; fails += 1
            sounds.playError?.(); setStreak(0)
            if (fails >= 3) {
              setPandaMood('wrong'); setDuMsg(`听到「${text}」· 多试几次哦`)
              setTimeout(() => { if (cancelTokenRef.current === myToken) { setPandaMood('idle'); setDuMsg('') } }, 1600)
            } else {
              setPandaMood('wrong'); setDuMsg(`听到「${text}」再来 (${fails}/3)`)
              setTimeout(() => { if (cancelTokenRef.current === myToken) startListen() }, 950)
            }
          }
        },
        onError: (err) => {
          if (cancelTokenRef.current !== myToken) return
          if (err === 'unsupported') { setDuMsg('换台 Chrome 浏览器'); setPandaMood('idle'); return }
          if (err === 'not-allowed' || err === 'service-not-allowed') { setDuMsg('请允许麦克风权限'); setPandaMood('idle'); return }
          if (err === 'aborted') return
          if (err === 'no-speech' || err === 'audio-capture' || err === 'network') {
            if (softTries < 2) {
              softTries += 1
              setDuMsg(`🔇 没听到，大声点 (${softTries}/2)`)
              setTimeout(() => { if (cancelTokenRef.current === myToken) startListen() }, 350)
              return
            }
            softTries = 0; setPandaMood('wrong'); setDuMsg('🔇 一直没听到')
            setTimeout(() => { if (cancelTokenRef.current === myToken) { setPandaMood('idle'); setDuMsg('') } }, 1500)
          }
        },
      })
    }
    setTimeout(startListen, 1500)
  }

  useEffect(() => () => { cancelTokenRef.current += 1; sr.stop() }, [])
  useEffect(() => { setFlipped(false); setPandaMood('idle'); setDuMsg(''); cancelTokenRef.current += 1; sr.stop() }, [symbol])

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="relative du-flip-card w-full mx-auto" style={{ minHeight: 200 }}>
        <div className={`du-flip-inner ${flipped ? 'is-flipped' : ''}`}>
          <div className={`du-flip-front rounded-3xl bg-gradient-to-br ${t.from} ${t.to} ${t.glow} p-5`}>
            <div className="flex items-center gap-4">
              <PandaMascot mood={pandaMood} size={110} />
              <button onClick={onTap}
                className="flex-1 rounded-2xl bg-white/12 hover:bg-white/20 active:scale-95 transition-all p-3">
                <div className="flex items-baseline justify-center gap-3">
                  <span className="font-mono text-white text-[80px] sm:text-[96px] font-black leading-none drop-shadow-[0_5px_7px_rgba(0,0,0,0.4)]">/{symbol}/</span>
                </div>
                <div className="text-center text-white text-2xl sm:text-3xl font-extrabold mt-1">{ex.word}</div>
                <div className="text-center text-white/80 text-xs">👆 点听 + 跟读</div>
              </button>
            </div>
            {duMsg && <div className="mt-2 text-center text-sm font-semibold text-white drop-shadow">{duMsg}</div>}
            {sr.listening && sr.heard && (
              <div className="mt-1 text-center text-xs text-white/85">
                听到: <span className="font-mono font-bold">{sr.heard}</span>
              </div>
            )}
            <SparkleBurst trigger={showSparkle} />
          </div>
          <div className={`du-flip-back rounded-3xl bg-gradient-to-br ${t.from} ${t.to} p-5 flex flex-row items-center justify-center gap-5`}>
            <div className="text-5xl">✨</div>
            <div className="flex flex-col items-start">
              <div className="font-mono text-white text-3xl font-extrabold">/{symbol}/</div>
              <div className="text-white text-2xl font-bold">{ex.word}</div>
              <div className="text-white/90 text-sm">{ex.zh}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-slate-300">连击 {streak} 🔥 · 累计正确 {correctCount}/5</div>
    </div>
  )
}

// ───────────────────────────────────────────────────────────
// Level 4：辨音
// ───────────────────────────────────────────────────────────
function LevelMinimalPair({ symbol, group, sounds, onXp, onCrystal, onPass }) {
  const pair = MINIMAL_PAIRS[symbol] || { pair: null, words: [] }
  const [pick, setPick] = useState(null)
  const [pandaMood, setPandaMood] = useState('idle')
  const [round, setRound] = useState(0)
  const [streak, setStreak] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [target, setTarget] = useState(symbol)
  const [shuffled, setShuffled] = useState([symbol, pair.pair || symbol])

  useEffect(() => {
    if (!pair.pair) return
    const newTarget = Math.random() < 0.5 ? symbol : pair.pair
    setTarget(newTarget)
    const opts = Math.random() < 0.5 ? [symbol, pair.pair] : [pair.pair, symbol]
    setShuffled(opts); setPick(null)
  }, [symbol, round, pair.pair])

  useEffect(() => { if (pair.pair) setTimeout(() => playPhoneme(target), 350) }, [target, round, pair.pair])

  if (!pair.pair) {
    return <div className="text-center text-slate-400 py-8">该音标暂无对立对训练 · 请尝试其他音标</div>
  }

  function playTarget() {
    unlockAudio(); playPhoneme(target)
    setPandaMood('listening'); setTimeout(() => setPandaMood('idle'), 1300)
  }

  function onPick(i) {
    if (pick !== null) return
    setPick(i)
    if (shuffled[i] === target) {
      setPandaMood('correct'); sounds.playCorrect?.(); sounds.playBubble?.()
      onXp?.(5)
      const ns = streak + 1; setStreak(ns)
      const cc = correctCount + 1; setCorrectCount(cc)
      if (ns === 5) onCrystal?.('purple', 1, 'phoneme_l4_streak5', { symbol, level: 4 })
      if (ns === 10) onCrystal?.('purple', 2, 'phoneme_l4_streak10', { symbol, level: 4 })
      if (cc === 5) onPass?.()
      setTimeout(() => { setPandaMood('idle'); setRound(r => r + 1) }, 1000)
    } else {
      setPandaMood('wrong'); sounds.playError?.(); setStreak(0)
      setTimeout(() => { setPick(null); setPandaMood('idle') }, 1000)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <PandaMascot mood={pandaMood} size={110} />
        <div className="text-center">
          <button onClick={playTarget}
            className="px-5 py-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white text-base font-bold shadow-lg ring-2 ring-teal-300/50 active:scale-95 transition-all">
            🔊 再听一次
          </button>
          <div className="text-xs text-slate-300 mt-2">第 {round + 1} 题 · 连击 {streak} 🔥 · 累计 {correctCount}/5</div>
          <div className="text-[10px] text-slate-500 mt-0.5">最小对立对：/{symbol}/ vs /{pair.pair}/</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        {shuffled.map((sym, i) => {
          const isCorrect = sym === target
          const showRight = pick !== null && isCorrect
          const showWrong = pick === i && !isCorrect
          const w = sym === symbol ? pair.words[0] : pair.words[1]
          return (
            <button key={i} onClick={() => onPick(i)} disabled={pick !== null}
              className={`aspect-[5/4] rounded-2xl bg-slate-800/60 backdrop-blur-xl border-2 border-white/15
                flex flex-col items-center justify-center gap-2 transition-all active:scale-95
                ${showRight ? 'ring-4 ring-green-300 letter-bounce border-green-400 shadow-[0_0_22px_rgba(34,197,94,0.55)]' : ''}
                ${showWrong ? 'opacity-50 ring-4 ring-red-400 border-red-400' : ''}
                ${pick === null ? 'hover:scale-105 hover:bg-slate-700/60' : ''}`}>
              <span className="font-mono text-3xl sm:text-4xl font-extrabold text-white">/{sym}/</span>
              <span className="text-white/85 text-sm sm:text-base">{w}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ───────────────────────────────────────────────────────────
// 层 3：单音标主练习
// ───────────────────────────────────────────────────────────
function PhonemeFlashCard({ group, symbol, mastery, setMastery, onBack, sounds, sr, onXp, onCrystal, setConfetti }) {
  const [level, setLevel] = useState(1)
  const ex = PHONEME_EXAMPLES[symbol] || { word: '', zh: '' }
  const stars = phonStars(mastery, symbol)
  const total = 4

  function markStar(lv) {
    setMastery(prev => {
      const wasFull = phonFullyMastered(prev, symbol)
      const next = { ...prev, [symbol]: { ...(prev[symbol] || {}), [lv]: true } }
      savePhonMastery(next)
      const newStars = Object.values(next[symbol] || {}).filter(Boolean).length
      if (newStars === 4 && !wasFull) {
        sounds.playFireworks?.(); sounds.playVictory?.()
        onCrystal?.('blue', 1, 'phoneme_mastered', { symbol })
        spawnConfetti(setConfetti, 36)
      }
      return next
    })
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-3 py-4 relative" style={{ minHeight: 'calc(100vh - 110px)' }}>
      <OceanBg />
      <div className="relative z-10 flex items-center gap-3 mb-3">
        <button onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white transition-colors shrink-0">
          <IconArrowLeft size={18} />
        </button>
        <TopProgressBar stars={stars} total={total} label={`${group.title} · /${symbol}/ · ${ex.word}`} />
      </div>

      <div className="relative z-10 grid grid-cols-4 gap-2 sm:gap-3 mb-3">
        {LEVELS.map(lv => (
          <button key={lv.id} onClick={() => setLevel(lv.id)}
            className={`rounded-2xl px-2 py-2 bg-gradient-to-br ${lv.from} ${lv.to} text-white text-center transition-all
              ${level === lv.id ? 'ring-4 ring-white/60 shadow-lg -translate-y-0.5' : 'opacity-70 hover:opacity-100'}`}>
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-lg sm:text-xl">{lv.icon}</span>
              <span className="text-sm sm:text-base font-bold">{lv.label}</span>
            </div>
            <div className="text-[10px] opacity-85 leading-tight mt-0.5">{lv.desc}</div>
          </button>
        ))}
      </div>

      <div className="relative z-10">
        {level === 1 && <LevelListenIPA   key={`l1-${symbol}`} symbol={symbol} group={group} sounds={sounds} onXp={onXp} onCrystal={onCrystal} onPass={() => markStar(1)} />}
        {level === 2 && <LevelListenWord  key={`l2-${symbol}`} symbol={symbol} group={group} sounds={sounds} onXp={onXp} onCrystal={onCrystal} onPass={() => markStar(2)} />}
        {level === 3 && <LevelSpeak       key={`l3-${symbol}`} symbol={symbol} group={group} sounds={sounds} sr={sr} onXp={onXp} onCrystal={onCrystal} onPass={() => markStar(3)} />}
        {level === 4 && <LevelMinimalPair key={`l4-${symbol}`} symbol={symbol} group={group} sounds={sounds} onXp={onXp} onCrystal={onCrystal} onPass={() => markStar(4)} />}
      </div>
    </div>
  )
}

// ───────────────────────────────────────────────────────────
// 顶层导出
// ───────────────────────────────────────────────────────────
export default function PhonemeLearn({ onClose, settings, onXp, onCrystal, isMember = false, unlocks, crystalBalance = 0, onGoShop }) {
  const [groupSel, setGroupSel] = useState(null)
  const [symbolSel, setSymbolSel] = useState(null)
  const [mastery, setMastery] = useState(loadPhonMastery)
  const [confetti, setConfetti] = useState([])
  const [backConfirm, setBackConfirm] = useState(false)
  const sounds = useSound(settings)
  const sr = useSpeechRecognition()

  // 前 4 组（短元音/长元音/双元音/爆破音）每组至少有 1 个掌握 → 自动解锁后 4 组
  const front4Started = PHONEME_GROUPS.slice(0, 4).every(g =>
    g.symbols.some(s => (mastery[s] && Object.values(mastery[s]).some(Boolean)))
  )
  const lockedBack = !(isMember || front4Started || unlocks?.isUnlocked?.('phoneme', 'back10'))

  // 进入音标模块即空闲预热全部 IPA 切片，消除首次点击的网络往返
  useEffect(() => preloadPhonemeAudio(), [])

  useEffect(() => {
    const allDone = PHONEME_GROUPS.every(g => g.symbols.every(s => phonFullyMastered(mastery, s)))
    const flagKey = 'phoneme_full_celebrated'
    if (allDone && !localStorage.getItem(flagKey)) {
      try {
        localStorage.setItem(flagKey, '1')
        onCrystal?.('gold', 3, 'phoneme_all_groups', { groups: 8 })
        onXp?.(100)
        sounds.playFireworks?.(); sounds.playVictory?.()
        spawnConfetti(setConfetti, 80)
      } catch {}
    }
  }, [mastery])

  return (
    <>
      <ConfettiLayer items={confetti} />
      {!groupSel && (
        <GroupGrid
          mastery={mastery}
          onPick={g => setGroupSel(g)}
          onClose={onClose}
          lockedBack={lockedBack}
          onUnlockBack={() => setBackConfirm(true)}
        />
      )}
      {backConfirm && (
        <UnlockConfirmModal
          title="后 4 组音标"
          reason="前 4 组每组各掌握 1 个音标可自动解锁，或花钻石提前开启"
          crystalBalance={crystalBalance}
          cost={20}
          onCancel={() => setBackConfirm(false)}
          onConfirm={async () => {
            const r = await unlocks?.unlock?.('phoneme', 'back10', 20, 'blue')
            if (r?.ok) setBackConfirm(false)
            return r
          }}
          onGoShop={() => { setBackConfirm(false); onGoShop?.() }}
        />
      )}
      {groupSel && !symbolSel && (
        <PhonemeGrid group={groupSel} mastery={mastery}
          onPick={sym => setSymbolSel(sym)}
          onBack={() => setGroupSel(null)} />
      )}
      {groupSel && symbolSel && (
        <PhonemeFlashCard group={groupSel} symbol={symbolSel}
          mastery={mastery} setMastery={setMastery}
          sounds={sounds} sr={sr}
          onXp={onXp} onCrystal={onCrystal}
          setConfetti={setConfetti}
          onBack={() => setSymbolSel(null)} />
      )}
    </>
  )
}
