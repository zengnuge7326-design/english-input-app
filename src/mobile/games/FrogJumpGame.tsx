import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { VocabWord } from '../data/unit1Vocab'
import type { CrystalEarnFn } from '../types'
import { useMobileTTS } from '../hooks/useMobileTTS'
import { useMobileSfx } from '../hooks/useMobileSfx'
import {
  CartoonComboBolt, CartoonFrog, CartoonHeart,
  DefeatScene, IntroScene, LilyPad, LotusGoal,
  TrophyScene, WaterSplash,
} from './FrogJumpSprites'
import './frogJump.css'

interface Props {
  words: VocabWord[]
  unitLabel?: string
  onExit: () => void
  onComplete: (result: { hit: number; total: number; combo: number; accuracy: number; won: boolean }) => void
  onNextLevel?: () => void
  onCrystalEarn?: CrystalEarnFn
  onCrystalSpend?: (color: string, amount: number, reason: string) => void
}

type Phase = 'intro' | 'playing' | 'over' | 'win'

interface PadState {
  word: VocabWord
  pool: string[]
  picked: number[]
  sink: number
  sinkRate: number
  landed: boolean
  sunk: boolean
}

const HEARTS_START = 5
const SINK_MAX = 100
const BASE_SINK = 7.5
const SINK_INCREMENT = 0.55
const SPEED_STORAGE_KEY = 'fjg-speed-tier'

// World layout constants
const PAD_SPACING = 150     // vertical px between pad levels
const ARC_HEIGHT = 100      // peak of jump arc
const JUMP_DURATION = 680   // ms for frog jump animation
const FROG_SCREEN_FRAC = 0.58  // frog stays at this fraction from top of arena
const PAD_LEFT_PCT = 26     // % left column
const PAD_RIGHT_PCT = 70    // % right column

const SPEED_TIERS = [
  { label: '很慢', mult: 0.45 },
  { label: '慢',   mult: 0.7  },
  { label: '标准', mult: 1.0  },
  { label: '快',   mult: 1.35 },
  { label: '极快', mult: 1.85 },
] as const

function readSpeedTier(): number {
  try { const n = parseInt(localStorage.getItem(SPEED_STORAGE_KEY) ?? '3', 10); return n >= 1 && n <= 5 ? n : 3 } catch { return 3 }
}

const DISTRACTORS = 'abcdefghijklmnopqrstuvwxyz'.split('')
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}
function buildLetterPool(word: string, dc: number): string[] {
  const lower = word.toLowerCase(), letters = lower.split(''), used = new Set(letters), extras: string[] = []
  while (extras.length < dc) { const c = DISTRACTORS[Math.floor(Math.random() * DISTRACTORS.length)]; if (!used.has(c)) { extras.push(c); used.add(c) } }
  return shuffle([...letters, ...extras])
}
function makePad(word: VocabWord, level: number): PadState {
  return { word, pool: buildLetterPool(word.en, word.en.length <= 5 ? 2 : 1), picked: [], sink: 0, sinkRate: BASE_SINK + SINK_INCREMENT * level, landed: false, sunk: false }
}

// World coordinate helpers
// level 0 = start (bottom), 1..n = word pads, n+1 = goal (top)
function padXPct(level: number, total: number): number {
  if (level === 0 || level === total + 1) return 50
  return level % 2 === 1 ? PAD_LEFT_PCT : PAD_RIGHT_PCT
}
function padWorldY(level: number, total: number): number {
  // Goal at small Y (near top), start at large Y (near bottom)
  return (total + 1 - level) * PAD_SPACING
}
function worldH(total: number): number {
  return (total + 2) * PAD_SPACING
}
function computeWorldTranslateY(frogY: number, arenaH: number, total: number): number {
  const ideal = arenaH * FROG_SCREEN_FRAC - frogY
  return Math.max(-(worldH(total) - arenaH), Math.min(0, ideal))
}

// ─── Speed button ────────────────────────────────────────────────────────────
function SpeedButton({ tier, onCycle }: { tier: number; onCycle: () => void }) {
  const meta = SPEED_TIERS[tier - 1]
  return (
    <button type="button" className={`fjg__speed fjg__speed--tier-${tier}`} onClick={onCycle} title={`${meta.label} (${tier}/5)`}>
      <svg className="fjg__speed-icon" viewBox="0 0 20 20" width="16" height="16" aria-hidden>
        <path d="M10 3 C5 9 4 13 10 17 C16 13 15 9 10 3 Z" fill="currentColor" opacity="0.9" />
      </svg>
      <span className="fjg__speed-bars" aria-hidden>
        {SPEED_TIERS.map((_, i) => <span key={i} className={`fjg__speed-bar${i < tier ? ' fjg__speed-bar--on' : ''}`} />)}
      </span>
      <span className="fjg__speed-num">{tier}</span>
    </button>
  )
}

// ─── Main game component ──────────────────────────────────────────────────────
export default function FrogJumpGame({ words, unitLabel = 'Unit 1', onExit, onComplete, onNextLevel, onCrystalEarn, onCrystalSpend }: Props) {
  const { speak } = useMobileTTS()
  const sfx = useMobileSfx()
  const queue = useMemo(() => shuffle(words.filter(w => w.en && /^[a-zA-Z]+$/.test(w.en))), [words])
  const total = queue.length

  // ── Game state ──────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>('intro')
  const [idx, setIdx] = useState(0)
  const [pad, setPad] = useState<PadState | null>(null)
  const [hearts, setHearts] = useState(HEARTS_START)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [hit, setHit] = useState(0)
  const [taps, setTaps] = useState(0)
  const [correctTaps, setCorrectTaps] = useState(0)
  const [shake, setShake] = useState(false)
  const [flash, setFlash] = useState<'good' | 'bad' | null>(null)
  const [comboPulse, setComboPulse] = useState(false)
  const [lastTapIdx, setLastTapIdx] = useState<number | null>(null)
  const [speedTier, setSpeedTier] = useState(readSpeedTier)
  const [missParticles, setMissParticles] = useState<number[]>([])
  const [showSplash, setShowSplash] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  // ── World / camera state ────────────────────────────────────────────────────
  // frogLevel = which pad the frog currently sits on (0=start, 1..n=word pads, n+1=goal)
  const [frogLevel, setFrogLevel] = useState(0)
  // frogPos: used for React render when NOT jumping
  const [frogPos, setFrogPos] = useState({ x: 0.5, y: 0 })
  const [isJumping, setIsJumping] = useState(false)

  // ── Refs ────────────────────────────────────────────────────────────────────
  const rafRef     = useRef<number | null>(null)
  const jumpRafRef = useRef<number | null>(null)
  const lastTickRef    = useRef<number>(0)
  const padRef         = useRef(pad)
  const phaseRef       = useRef(phase)
  const idxRef         = useRef(idx)
  const speedTierRef   = useRef(speedTier)
  const frogLevelRef   = useRef(frogLevel)
  const isPausedRef    = useRef(false)
  const worldRef       = useRef<HTMLDivElement>(null)
  const frogElemRef    = useRef<HTMLDivElement>(null)
  const arenaRef       = useRef<HTMLDivElement>(null)
  const arenaHRef      = useRef(500)  // live arena height for DOM path

  useEffect(() => { padRef.current = pad }, [pad])
  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { idxRef.current = idx }, [idx])
  useEffect(() => { speedTierRef.current = speedTier }, [speedTier])
  useEffect(() => { frogLevelRef.current = frogLevel }, [frogLevel])
  useEffect(() => { isPausedRef.current = isPaused }, [isPaused])

  // Measure arena height
  useEffect(() => {
    const el = arenaRef.current; if (!el) return
    arenaHRef.current = el.clientHeight
    const ro = new ResizeObserver(() => { arenaHRef.current = el.clientHeight })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const cycleSpeed = useCallback(() => {
    sfx.playTap()
    setSpeedTier(t => { const next = t >= 5 ? 1 : t + 1; try { localStorage.setItem(SPEED_STORAGE_KEY, String(next)) } catch {} return next })
  }, [sfx])

  // Apply frog + world transform directly to DOM (used during jump RAF)
  function applyFrogDOM(x: number, y: number) {
    if (frogElemRef.current) {
      frogElemRef.current.style.left = `${x * 100}%`
      frogElemRef.current.style.top  = `${y}px`
    }
    if (worldRef.current) {
      const ty = computeWorldTranslateY(y, arenaHRef.current, total)
      worldRef.current.style.transform = `translateY(${ty}px)`
    }
  }

  // Arc jump: moves frog from (fromX,fromY) to (toX,toY) with parabolic arc
  const animateJump = useCallback((
    fromX: number, fromY: number,
    toX: number,   toY: number,
    onDone: () => void,
  ) => {
    if (jumpRafRef.current) cancelAnimationFrame(jumpRafRef.current)
    const t0 = performance.now()
    setIsJumping(true)
    applyFrogDOM(fromX, fromY)

    function frame(now: number) {
      const raw = (now - t0) / JUMP_DURATION
      const t = Math.min(raw, 1)
      // ease-in-out cubic
      const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      const arc  = -ARC_HEIGHT * 4 * t * (1 - t)   // parabola: 0 → peak → 0
      const x = fromX + (toX - fromX) * ease
      const y = fromY + (toY - fromY) * ease + arc
      applyFrogDOM(x, y)
      if (t < 1) {
        jumpRafRef.current = requestAnimationFrame(frame)
      } else {
        setIsJumping(false)
        setFrogPos({ x: toX, y: toY })   // sync React state
        onDone()
      }
    }
    jumpRafRef.current = requestAnimationFrame(frame)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total])

  const spawnNext = useCallback((nextIdx: number) => {
    if (nextIdx >= total) {
      // Jump to goal
      const fromX = padXPct(frogLevelRef.current, total) / 100
      const fromY = padWorldY(frogLevelRef.current, total)
      const goalLv = total + 1
      const toX = padXPct(goalLv, total) / 100
      const toY = padWorldY(goalLv, total)
      animateJump(fromX, fromY, toX, toY, () => {
        setFrogLevel(goalLv)
        setPhase('win')
      })
      return
    }
    setIdx(nextIdx)
    setPad(makePad(queue[nextIdx], nextIdx))
  }, [total, queue, animateJump])

  const respawnSame = useCallback(() => {
    const i = idxRef.current
    if (i < total) setPad(makePad(queue[i], i))
  }, [queue, total])

  function startGame() {
    setHearts(HEARTS_START); setCombo(0); setMaxCombo(0)
    setHit(0); setTaps(0); setCorrectTaps(0)
    const startY = padWorldY(0, total)
    const startX = padXPct(0, total) / 100
    setFrogLevel(0)
    setFrogPos({ x: startX, y: startY })
    setPhase('playing')
    spawnNext(0)
  }

  // ── Sink timer ──────────────────────────────────────────────────────────────
  const onPadSink = useCallback(() => {
    sfx.playDamage()
    setShake(true); setTimeout(() => setShake(false), 250)
    setCombo(0)
    setHearts(h => {
      const nh = h - 1
      if (nh <= 0) { setPhase('over'); return 0 }
      setTimeout(() => respawnSame(), 500)
      return nh
    })
  }, [sfx, respawnSame])

  useEffect(() => {
    if (phase !== 'playing' || !pad || pad.landed) return
    lastTickRef.current = performance.now()
    function tick(t: number) {
      const dt = Math.min((t - lastTickRef.current) / 1000, 0.1)
      lastTickRef.current = t
      setPad(p => {
        if (!p || p.landed || p.sunk || isPausedRef.current) return p
        const mult = SPEED_TIERS[speedTierRef.current - 1].mult
        const ns = p.sink + p.sinkRate * mult * dt
        if (ns >= SINK_MAX) { queueMicrotask(() => onPadSink()); return { ...p, sink: SINK_MAX, sunk: true } }
        return { ...p, sink: ns }
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [phase, pad?.word.id, pad?.landed])  // eslint-disable-line

  // ── Letter tap ──────────────────────────────────────────────────────────────
  const handleLetterTap = useCallback((poolIdx: number) => {
    const p = padRef.current
    if (!p || p.landed || phaseRef.current !== 'playing') return
    if (p.picked.includes(poolIdx)) return
    setTaps(t => t + 1)
    setLastTapIdx(poolIdx); setTimeout(() => setLastTapIdx(null), 200)
    const expected = p.word.en[p.picked.length]?.toLowerCase()
    const got = p.pool[poolIdx]

    if (expected === got) {
      sfx.playTap(); sfx.playCorrect()
      setCorrectTaps(c => c + 1)
      setFlash('good'); setTimeout(() => setFlash(null), 150)
      const nextPicked = [...p.picked, poolIdx]
      const isComplete = nextPicked.length >= p.word.en.length
      setPad({ ...p, picked: nextPicked, landed: isComplete })

      if (isComplete) {
        sfx.playShoot()
        onCrystalEarn?.('green', 1, 'frog_word_hit')
        setHit(h => h + 1)
        setCombo(c => {
          const nc = c + 1; setMaxCombo(m => Math.max(m, nc))
          if (nc >= 3 && nc % 3 === 0) { sfx.playCombo(); setComboPulse(true); setTimeout(() => setComboPulse(false), 400) }
          return nc
        })
        setTimeout(() => speak(p.word.en, 0.9), 300)
        setShowSplash(true); setTimeout(() => setShowSplash(false), 700)

        // Jump frog from current level to next level
        const curLv = frogLevelRef.current
        const nextLv = curLv + 1
        const fromX = padXPct(curLv, total) / 100
        const fromY = padWorldY(curLv, total)
        const toX   = padXPct(nextLv, total) / 100
        const toY   = padWorldY(nextLv, total)
        animateJump(fromX, fromY, toX, toY, () => {
          setFrogLevel(nextLv)
          setTimeout(() => spawnNext(idxRef.current + 1), 150)
        })
      }
    } else {
      sfx.playWrong()
      setFlash('bad'); setTimeout(() => setFlash(null), 200)
      setCombo(0)
      onCrystalSpend?.('green', 1, 'frog_word_miss')
      const pid = Date.now() + Math.random()
      setMissParticles(m => [...m, pid]); setTimeout(() => setMissParticles(m => m.filter(x => x !== pid)), 1200)
      setPad({ ...p, sink: Math.min(SINK_MAX - 1, p.sink + 14) })
    }
  }, [sfx, speak, spawnNext, onCrystalEarn, onCrystalSpend, animateJump, total])

  const handleUndo = useCallback(() => {
    const p = padRef.current
    if (!p || p.landed || p.picked.length === 0 || phaseRef.current !== 'playing') return
    setPad({ ...p, picked: p.picked.slice(0, -1) })
  }, [])

  const handleHint = useCallback(() => {
    const p = padRef.current
    if (!p || p.landed || phaseRef.current !== 'playing' || isJumping) return
    if (hearts <= 1) return   // keep at least 1 heart
    const nextCharIdx = p.picked.length
    if (nextCharIdx >= p.word.en.length) return
    const expected = p.word.en[nextCharIdx].toLowerCase()
    const poolIdx = p.pool.findIndex((c, i) => c === expected && !p.picked.includes(i))
    if (poolIdx < 0) return
    sfx.playDamage()
    setHearts(h => h - 1)
    handleLetterTapRef.current(poolIdx)
  }, [hearts, sfx, isJumping])

  const handleLetterTapRef = useRef(handleLetterTap); handleLetterTapRef.current = handleLetterTap
  const handleUndoRef       = useRef(handleUndo);       handleUndoRef.current       = handleUndo

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (phaseRef.current !== 'playing') return
      const p = padRef.current; if (!p || p.landed) return
      if (e.key === 'Backspace') { e.preventDefault(); handleUndoRef.current(); return }
      if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        e.preventDefault()
        const ch = e.key.toLowerCase()
        const poolIdx = p.pool.findIndex((c, i) => c.toLowerCase() === ch && !p.picked.includes(i))
        if (poolIdx >= 0) handleLetterTapRef.current(poolIdx)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => { if (phase === 'win') sfx.playVictory() }, [phase, sfx])

  // Auto-advance to next level 3 seconds after win
  useEffect(() => {
    if (phase !== 'win' || !onNextLevel) return
    const t = setTimeout(() => onNextLevel(), 3000)
    return () => clearTimeout(t)
  }, [phase, onNextLevel])
  useEffect(() => {
    if (phase !== 'win' && phase !== 'over') return
    const acc = taps > 0 ? Math.round((correctTaps / taps) * 100) : 0
    onComplete({ hit, total, combo: maxCombo, accuracy: acc, won: phase === 'win' })
  }, [phase])  // eslint-disable-line

  // ── Camera: compute world translateY from React frogPos (non-jump frames) ──
  const [arenaHState, setArenaHState] = useState(500)
  useEffect(() => {
    const el = arenaRef.current; if (!el) return
    setArenaHState(el.clientHeight)
    const ro = new ResizeObserver(() => setArenaHState(el.clientHeight))
    ro.observe(el); return () => ro.disconnect()
  }, [])

  const worldTranslateY = isJumping
    ? undefined   // during jump: DOM-controlled (no React style)
    : computeWorldTranslateY(frogPos.y, arenaHState, total)

  // ── Derived render values ────────────────────────────────────────────────────
  const activeLv     = frogLevel + 1   // the next pad the frog will jump to
  const sinkPct      = pad ? pad.sink : 0
  const sinkOffsetPx = (sinkPct / 100) * 28  // max 28px downward sink

  // ── Intro screen ─────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="fjg flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden">
        <div className="fjg__intro flex-1 flex flex-col items-center justify-center px-6 gap-4 text-center">
          <div className="fjg__intro-top">
            <button className="fjg__close-abs" onClick={onExit} aria-label="返回">✕</button>
            <SpeedButton tier={speedTier} onCycle={cycleSpeed} />
          </div>
          <IntroScene />
          <h1 className="fjg__intro-title">青蛙跳</h1>
          <p className="fjg__intro-sub">{unitLabel} · {queue.length} 个单词</p>
          <ul className="fjg__intro-rules">
            <li><span className="fjg__rule-icon fjg__rule-icon--pad" />荷叶显示汉语，会慢慢下沉</li>
            <li><span className="fjg__rule-icon fjg__rule-icon--key" />按顺序拼出英文（可键盘输入）</li>
            <li><span className="fjg__rule-icon fjg__rule-icon--frog" />拼完整词，青蛙跳上荷叶前进</li>
            <li><span className="fjg__rule-icon fjg__rule-icon--heart" />荷叶沉没扣 1 血，5 血结束</li>
            <li><span className="fjg__rule-icon fjg__rule-icon--gem" />输入错误扣 1 💎 且加速下沉</li>
          </ul>
          <button className="fjg__btn-primary" onClick={startGame}>出发跳跃</button>
        </div>
      </div>
    )
  }

  // ── Win / Over screen ─────────────────────────────────────────────────────────
  if (phase === 'win' || phase === 'over') {
    const acc   = taps > 0 ? Math.round((correctTaps / taps) * 100) : 0
    const stars = phase === 'win' ? (acc >= 95 ? 3 : acc >= 75 ? 2 : 1) : 0
    return (
      <div className="fjg flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden">
        <div className="fjg__intro flex-1 flex flex-col items-center justify-center px-6 gap-3 text-center">
          {phase === 'win' ? <TrophyScene /> : <DefeatScene />}
          <h1 className="fjg__intro-title">{phase === 'win' ? '到达终点！' : '落水了'}</h1>
          <div className="fjg__stars" aria-hidden>
            {[1, 2, 3].map(i => <span key={i} className={`fjg__star${stars >= i ? ' fjg__star--on' : ''}`}>★</span>)}
          </div>
          <div className="fjg__stats">
            <div><span>跳跃</span><strong>{hit}/{queue.length}</strong></div>
            <div><span>准度</span><strong>{acc}%</strong></div>
            <div><span>最高连击</span><strong>{maxCombo}</strong></div>
          </div>
          <div className="flex gap-3 mt-2">
            <button className="fjg__btn-secondary" onClick={onExit}>返回</button>
            <button className="fjg__btn-primary" onClick={startGame}>再跳一次</button>
            {phase === 'win' && onNextLevel && (
              <button className="fjg__btn-primary fjg__btn-next" onClick={onNextLevel}>下一关 →</button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Playing screen ────────────────────────────────────────────────────────────
  const progressPct = total ? Math.round((hit / total) * 100) : 0

  return (
    <div className={`fjg flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden${shake ? ' fjg--shake' : ''}${flash ? ` fjg--flash-${flash}` : ''}`}>
      {/* HUD */}
      <header className="fjg__hud shrink-0 safe-top">
        <div className="fjg__hud-left">
          <button className="fjg__close" onClick={onExit} aria-label="返回">✕</button>
          <SpeedButton tier={speedTier} onCycle={cycleSpeed} />
          <button
            type="button"
            className={`fjg__pause${isPaused ? ' fjg__pause--active' : ''}`}
            onClick={() => setIsPaused(p => !p)}
            aria-label={isPaused ? '继续' : '暂停'}
          >
            {isPaused ? '▶' : '⏸'}
          </button>
          <button
            type="button"
            className="fjg__hint"
            onClick={handleHint}
            disabled={hearts <= 1 || !pad || pad.landed || isJumping}
            aria-label="提示答案"
          >
            💡<span>提示</span>
          </button>
        </div>
        <div className="fjg__hearts">
          {Array.from({ length: HEARTS_START }).map((_, i) => (
            <CartoonHeart key={i} filled={i < hearts} className={i >= hearts ? 'fjg__heart-lost' : ''} />
          ))}
        </div>
        <div className="fjg__hud-right">
          <span className={`fjg__combo${comboPulse ? ' fjg__combo--pulse' : ''}`}>
            <CartoonComboBolt /> {combo}
          </span>
          <span className="fjg__score">{hit}/{total}</span>
        </div>
      </header>

      {/* Arena (scrollable world viewport) */}
      <div ref={arenaRef} className="fjg__arena flex-1 relative">
        {/* Water background (fixed to arena) */}
        <div className="fjg__water" aria-hidden />
        <div className="fjg__water fjg__water--ripple" aria-hidden />

        {/* Progress bar (right side, fixed to arena) */}
        <div className="fjg__prog-rail" aria-hidden>
          <div className="fjg__prog-fill" style={{ height: `${progressPct}%` }} />
          <span className="fjg__prog-label">{progressPct}%</span>
        </div>

        {/* World container — transforms to follow frog */}
        <div
          ref={worldRef}
          className="fjg__world"
          style={{
            height: worldH(total),
            transform: worldTranslateY !== undefined ? `translateY(${worldTranslateY}px)` : undefined,
          }}
        >
          {/* ── Goal (lotus) ── */}
          <div
            className="fjg__wpad fjg__wpad--goal"
            style={{ left: `${padXPct(total + 1, total)}%`, top: padWorldY(total + 1, total) }}
          >
            <LotusGoal />
            <div className="fjg__goal-reach">终点</div>
          </div>

          {/* ── Ghost pads (upcoming, not yet reached) ── */}
          {Array.from({ length: Math.min(3, total - activeLv) }, (_, i) => activeLv + 1 + i).map(lv => (
            lv <= total && (
              <div
                key={`ghost-${lv}`}
                className="fjg__wpad fjg__wpad--ghost"
                style={{ left: `${padXPct(lv, total)}%`, top: padWorldY(lv, total) }}
              >
                <LilyPad />
              </div>
            )
          ))}

          {/* ── Active pad (sinking, current target) ── */}
          {pad && !pad.landed && phase === 'playing' && activeLv <= total && (
            <div
              className="fjg__wpad fjg__wpad--active"
              style={{
                left: `${padXPct(activeLv, total)}%`,
                top: padWorldY(activeLv, total) + sinkOffsetPx,
              }}
            >
              <div className="fjg__pad-label">{pad.word.zh}</div>
              <div className="fjg__pad-wrap">
                <LilyPad glow={sinkPct < 30} />
                <div className="fjg__pad-waterline" style={{ height: `${sinkPct}%` }} />
              </div>
              <div className="fjg__sink-meter">
                <div className="fjg__sink-fill" style={{ width: `${sinkPct}%` }} />
              </div>
            </div>
          )}

          {/* ── Completed pads (stable) ── */}
          {Array.from({ length: frogLevel }, (_, i) => i + 1).map(lv => (
            <div
              key={`done-${lv}`}
              className="fjg__wpad fjg__wpad--done"
              style={{ left: `${padXPct(lv, total)}%`, top: padWorldY(lv, total) }}
            >
              <div className="fjg__wpad-word">{queue[lv - 1]?.en}</div>
              <LilyPad />
            </div>
          ))}

          {/* ── Start pad ── */}
          <div
            className="fjg__wpad fjg__wpad--start"
            style={{ left: `${padXPct(0, total)}%`, top: padWorldY(0, total) }}
          >
            <LilyPad />
          </div>

          {/* ── Frog ── */}
          {phase === 'playing' && (
            <div
              ref={frogElemRef}
              className={`fjg__wfrog${isJumping ? ' fjg__wfrog--jumping' : ''}`}
              style={{ left: `${frogPos.x * 100}%`, top: `${frogPos.y}px` }}
            >
              <CartoonFrog
                jumping={isJumping}
                tongue={!isJumping && !!pad && pad.picked.length > 0 && !pad.landed}
              />
            </div>
          )}

          {/* ── Splash at landing pad ── */}
          {showSplash && activeLv <= total && (
            <div
              className="fjg__wpad"
              style={{
                left: `${padXPct(activeLv, total)}%`,
                top: padWorldY(activeLv, total),
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 8,
              }}
            >
              <WaterSplash />
            </div>
          )}
        </div>

        {/* Miss particles (screen-fixed) */}
        {missParticles.map(pid => (
          <div key={pid} className="fjg__cmiss">
            <span className="fjg__cmiss-shard fjg__cmiss-shard--a">💎</span>
            <span className="fjg__cmiss-shard fjg__cmiss-shard--b">💎</span>
            <span className="fjg__cmiss-shard fjg__cmiss-shard--c">💎</span>
            <span className="fjg__cmiss-label">-1</span>
          </div>
        ))}
      </div>

      {/* Bottom input panel */}
      <div className="fjg__bottom shrink-0 safe-bottom">
        <div className="fjg__progress">
          {pad && pad.word.en.split('').map((_, i) => {
            const filled = pad.picked[i] != null
            return (
              <span key={i} className={`fjg__slot${filled ? ' fjg__slot--filled fjg__slot--pop' : ''}`}>
                {filled ? pad.pool[pad.picked[i]] : '_'}
              </span>
            )
          })}
        </div>
        <div className="fjg__pool">
          {pad?.pool.map((c, i) => (
            <button
              key={i}
              type="button"
              className={`fjg__tile${pad.picked.includes(i) ? ' fjg__tile--used' : ''}${lastTapIdx === i ? ' fjg__tile--tap' : ''}`}
              onClick={() => handleLetterTap(i)}
              disabled={pad.picked.includes(i) || pad.landed || isJumping}
            >{c}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
