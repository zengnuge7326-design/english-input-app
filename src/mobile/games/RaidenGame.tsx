import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { VocabWord } from '../data/unit1Vocab'
import type { CrystalEarnFn } from '../types'
import { useMobileSfx } from '../hooks/useMobileSfx'
import { useMobileTTS } from '../hooks/useMobileTTS'
import './raiden.css'

// ── Props ─────────────────────────────────────────────────────────────────────
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
type FlashType = 'correct' | 'wrong' | null

// ── Speed tiers (mirrors FrogJump) ────────────────────────────────────────────
const SPEED_TIERS = [
  { label: '很慢', mult: 0.45 },
  { label: '慢',   mult: 0.7  },
  { label: '标准', mult: 1.0  },
  { label: '快',   mult: 1.35 },
  { label: '极快', mult: 1.85 },
] as const
const SPEED_STORAGE_KEY = 'rdn-speed-tier'
function readSpeedTier(): number {
  try { const n = parseInt(localStorage.getItem(SPEED_STORAGE_KEY) ?? '2', 10); return n >= 1 && n <= 5 ? n : 2 } catch { return 2 }
}

// ── Entity types ──────────────────────────────────────────────────────────────
interface Star { x: number; y: number; size: number; speed: number; color: string }
interface Cloud { x: number; y: number; width: number; height: number; speed: number; opacity: number }
interface Island { x: number; y: number; width: number; height: number; speed: number }
interface Particle { x: number; y: number; vx: number; vy: number; color: string; size: number; alpha: number; decay: number; debris: boolean }
interface FloatText { x: number; y: number; text: string; color: string; vx: number; vy: number; alpha: number }
interface Laser { x1: number; y1: number; x2: number; y2: number; alpha: number }
interface EnemyState {
  x: number; y: number
  word: VocabWord
  kind: 'small' | 'mid'
  color: string
  sinePhase: number
  flashTimer: number
  escaped: boolean
}

// ── Palette & sprites (from original raiden-storm) ────────────────────────────
const PALETTE = {
  playerMain: '#00ffff',
  playerSide: '#00aaff',
  playerExhaust: '#ffaa00',
  enemySmall: '#ff3333',
  enemyMid: '#ff7700',
}

const SPRITES = {
  player: [
    [0,0,0,0,0,3,3,3,0,0,0,0,0],
    [0,0,0,0,0,3,3,3,0,0,0,0,0],
    [0,0,0,0,1,1,3,1,1,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,4,4,1,4,4,1,1,0,0],
    [0,1,1,1,4,4,4,4,4,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,2,2,4,4,4,4,4,2,2,1,1],
    [0,1,1,0,2,2,2,2,2,0,1,1,0],
    [0,0,1,0,5,5,0,5,5,0,1,0,0],
    [0,0,0,0,5,0,0,0,5,0,0,0,0],
  ],
  smallEnemy: [
    [0,0,1,1,1,1,1,0,0],
    [0,1,1,2,2,2,1,1,0],
    [1,1,1,2,4,2,1,1,1],
    [1,4,1,1,1,1,1,4,1],
    [0,1,1,1,1,1,1,1,0],
    [0,0,4,4,0,4,4,0,0],
    [0,0,1,0,0,0,1,0,0],
  ],
  midEnemy: [
    [0,0,0,0,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,4,4,4,1,1,0,0,0],
    [0,0,1,1,2,2,2,2,2,1,1,0,0],
    [0,1,1,4,4,4,4,4,4,4,1,1,0],
    [1,1,1,2,2,2,1,2,2,2,1,1,1],
    [1,4,1,1,1,1,1,1,1,1,1,4,1],
    [1,1,1,1,4,4,4,4,4,1,1,1,1],
    [0,1,1,0,1,1,4,1,1,0,1,1,0],
    [0,0,0,0,2,2,0,2,2,0,0,0,0],
    [0,0,0,0,5,5,0,5,5,0,0,0,0],
  ],
}

// ── Canvas draw helpers ───────────────────────────────────────────────────────
function drawSprite(ctx: CanvasRenderingContext2D, x: number, y: number, grid: number[][], primary: string, ps: number) {
  const rows = grid.length, cols = grid[0].length
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = grid[r][c]; if (!v) continue
      let color = '#ffffff'
      if (v === 1) color = primary
      else if (v === 2) color = PALETTE.playerSide
      else if (v === 3) color = '#ffffff'
      else if (v === 4) color = '#555566'
      else if (v === 5) color = PALETTE.playerExhaust
      ctx.fillStyle = color
      ctx.fillRect(Math.floor(x + c * ps), Math.floor(y + r * ps), Math.ceil(ps), Math.ceil(ps))
    }
  }
}

function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// ── Utilities ─────────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}

function makeChoices(correct: VocabWord, pool: VocabWord[]): string[] {
  const opts = shuffle(pool.filter(w => w.id !== correct.id && w.en.toLowerCase() !== correct.en.toLowerCase()))
    .slice(0, 3).map(w => w.en.toLowerCase())
  return shuffle([correct.en.toLowerCase(), ...opts])
}

function makeExplosion(x: number, y: number, color: string, count = 22): Particle[] {
  return Array.from({ length: count }, () => {
    const a = Math.random() * Math.PI * 2
    const spd = Math.random() * 130 + 30
    const debris = Math.random() < 0.3
    return {
      x, y,
      vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
      color: debris ? '#444444' : [color, '#ff5500', '#ffaa00', '#ffffff'][Math.floor(Math.random() * 4)],
      size: Math.random() * 3 + 2, alpha: 1, decay: Math.random() * 1.5 + 0.8, debris,
    }
  })
}

function initStars(W: number, H: number): Star[] {
  const cols = ['#ffffff', '#88ffff', '#aaaaaa', '#ffddff']
  return Array.from({ length: 80 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    size: Math.random() * 2 + 0.5, speed: Math.random() * 1.5 + 0.5,
    color: cols[Math.floor(Math.random() * cols.length)],
  }))
}
function initClouds(W: number, H: number): Cloud[] {
  return Array.from({ length: 4 }, () => ({
    x: Math.random() * W, y: Math.random() * H - H,
    width: Math.random() * 80 + 60, height: Math.random() * 40 + 30,
    speed: Math.random() * 0.8 + 0.4, opacity: Math.random() * 0.15 + 0.05,
  }))
}
function initIslands(W: number): Island[] {
  return [
    { x: W * 0.1, y: 150, width: 120, height: 90, speed: 0.3 },
    { x: W * 0.55, y: -100, width: 160, height: 110, speed: 0.3 },
    { x: W * 0.2, y: -450, width: 140, height: 100, speed: 0.3 },
  ]
}

const PIXEL_SCALE = 3
const HEARTS_MAX = 5
const ENEMY_BASE_SPEED = 42     // px/s — calm baseline, tuned by speed tier
const ESCAPE_FRAC = 0.95        // enemy "escapes" only near the very bottom (the word area)
const PLAYER_PATROL_SPEED = 70  // px/s — slow steady left/right drift, keeps ship lively

// ── Speed button ──────────────────────────────────────────────────────────────
function SpeedButton({ tier, onCycle }: { tier: number; onCycle: () => void }) {
  const meta = SPEED_TIERS[tier - 1]
  return (
    <button type="button" className={`rdn__speed rdn__speed--tier-${tier}`} onClick={onCycle} title={`${meta.label} (${tier}/5)`}>
      <svg viewBox="0 0 20 20" width="13" height="13" aria-hidden>
        <path d="M11 2 L4 11 L9 11 L8 18 L16 8 L11 8 Z" fill="currentColor" />
      </svg>
      <span className="rdn__speed-bars" aria-hidden>
        {SPEED_TIERS.map((_, i) => <span key={i} className={`rdn__speed-bar${i < tier ? ' rdn__speed-bar--on' : ''}`} />)}
      </span>
      <span className="rdn__speed-num">{tier}</span>
    </button>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function RaidenGame({ words, unitLabel = 'Unit 1', onExit, onComplete, onNextLevel, onCrystalEarn, onCrystalSpend }: Props) {
  const sfx = useMobileSfx()
  const { speak } = useMobileTTS()

  const queue = useMemo(() => shuffle(words.filter(w => w.en && w.zh)), [words])
  const total = queue.length

  // ── React state (UI) ─────────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>('intro')
  const [hearts, setHearts] = useState(HEARTS_MAX)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [hit, setHit] = useState(0)
  const [taps, setTaps] = useState(0)
  const [correctTaps, setCorrectTaps] = useState(0)
  const [choices, setChoices] = useState<string[]>([])
  const [currentWord, setCurrentWord] = useState<VocabWord | null>(null)
  const [flash, setFlash] = useState<FlashType>(null)
  const [choiceResult, setChoiceResult] = useState<{ idx: number; ok: boolean } | null>(null)
  const [speedTier, setSpeedTier] = useState(readSpeedTier)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // ── Game-loop refs ───────────────────────────────────────────────────────
  const starsRef   = useRef<Star[]>([])
  const cloudsRef  = useRef<Cloud[]>([])
  const islandsRef = useRef<Island[]>([])
  const enemyRef   = useRef<EnemyState | null>(null)
  const partsRef   = useRef<Particle[]>([])
  const textsRef   = useRef<FloatText[]>([])
  const laserRef   = useRef<Laser | null>(null)
  const shakeRef   = useRef(0)
  const phaseRef   = useRef<Phase>('intro')
  const heartsRef  = useRef(HEARTS_MAX)
  const comboRef   = useRef(0)
  const hitRef     = useRef(0)
  const scoreRef   = useRef(0)
  const idxRef     = useRef(0)
  const lockedRef  = useRef(false)
  const speedRef   = useRef(speedTier)
  const rafRef     = useRef<number | null>(null)
  const lastTRef   = useRef(0)
  const canvasWRef = useRef(390)
  const canvasHRef = useRef(700)
  const playerXRef = useRef(195)   // live ship x — auto-patrols left/right
  const playerDirRef = useRef(1)   // +1 → right, -1 → left

  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { speedRef.current = speedTier }, [speedTier])

  // ── Canvas resize ────────────────────────────────────────────────────────
  // Depends on `phase` so it (re)attaches when the canvas actually mounts in the
  // playing phase — the canvas element does not exist during intro/result.
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (ctx) ctx.imageSmoothingEnabled = false
    function resize() {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      if (rect.width < 2 || rect.height < 2) return
      canvas.width = Math.round(rect.width)
      canvas.height = Math.round(rect.height)
      canvasWRef.current = canvas.width
      canvasHRef.current = canvas.height
      starsRef.current = initStars(canvas.width, canvas.height)
      cloudsRef.current = initClouds(canvas.width, canvas.height)
      islandsRef.current = initIslands(canvas.width)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [phase])

  const cycleSpeed = useCallback(() => {
    sfx.playTap?.()
    setSpeedTier(t => { const next = t >= 5 ? 1 : t + 1; try { localStorage.setItem(SPEED_STORAGE_KEY, String(next)) } catch {} return next })
  }, [sfx])

  const playerXY = useCallback(() => {
    const H = canvasHRef.current
    return { x: playerXRef.current, y: H - 64 }
  }, [])

  const spawnEnemy = useCallback((idx: number) => {
    const W = canvasWRef.current
    const word = queue[idx]
    const kind: 'small' | 'mid' = idx % 3 === 2 ? 'mid' : 'small'
    enemyRef.current = {
      x: W * (0.28 + Math.random() * 0.44), y: -60,
      word, kind,
      color: kind === 'mid' ? PALETTE.enemyMid : PALETTE.enemySmall,
      sinePhase: Math.random() * Math.PI * 2, flashTimer: 0, escaped: false,
    }
    setCurrentWord(word)
    setChoices(makeChoices(word, queue))
    lockedRef.current = false
    typedRef.current = ''
  }, [queue])

  function resetGameVars() {
    heartsRef.current = HEARTS_MAX; comboRef.current = 0
    hitRef.current = 0; scoreRef.current = 0; idxRef.current = 0; lockedRef.current = false
    enemyRef.current = null; partsRef.current = []; textsRef.current = []; laserRef.current = null; shakeRef.current = 0
  }

  function startGame() {
    resetGameVars()
    playerXRef.current = canvasWRef.current / 2; playerDirRef.current = Math.random() < 0.5 ? -1 : 1
    setHearts(HEARTS_MAX); setScore(0); setCombo(0); setMaxCombo(0)
    setHit(0); setTaps(0); setCorrectTaps(0)
    setFlash(null); setChoiceResult(null)
    starsRef.current = initStars(canvasWRef.current, canvasHRef.current)
    cloudsRef.current = initClouds(canvasWRef.current, canvasHRef.current)
    islandsRef.current = initIslands(canvasWRef.current)
    setPhase('playing')
    spawnEnemy(0)
  }

  function advanceOrWin(nextIdx: number) {
    if (nextIdx >= total) {
      setTimeout(() => setPhase('win'), 450)
    } else {
      idxRef.current = nextIdx
      setTimeout(() => { if (phaseRef.current === 'playing') spawnEnemy(nextIdx) }, 700)
    }
  }

  function loseHeart() {
    heartsRef.current = Math.max(0, heartsRef.current - 1)
    setHearts(heartsRef.current)
    comboRef.current = 0; setCombo(0)
    shakeRef.current = 14
    setFlash('wrong'); setTimeout(() => setFlash(null), 350)
    sfx.playDamage()
    if (heartsRef.current <= 0) setPhase('over')
    return heartsRef.current
  }

  // ── Answer handler ────────────────────────────────────────────────────────
  const handleAnswer = useCallback((choiceIdx: number, en: string) => {
    if (phaseRef.current !== 'playing' || lockedRef.current) return
    const word = currentWord; if (!word) return
    const enemy = enemyRef.current; if (!enemy) return

    setTaps(t => t + 1)
    const correct = en === word.en.toLowerCase()

    if (correct) {
      lockedRef.current = true
      setCorrectTaps(c => c + 1)
      setChoiceResult({ idx: choiceIdx, ok: true })

      // Laser from ship to enemy
      const p = playerXY()
      laserRef.current = { x1: p.x, y1: p.y - 20, x2: enemy.x, y2: enemy.y, alpha: 1 }
      sfx.playShoot()

      // Explosion + score popup + shake
      partsRef.current.push(...makeExplosion(enemy.x, enemy.y, enemy.color, enemy.kind === 'mid' ? 30 : 22))
      shakeRef.current = enemy.kind === 'mid' ? 12 : 6
      comboRef.current++; setCombo(c => { const nc = c + 1; setMaxCombo(m => Math.max(m, nc)); return nc })
      const gained = 100 * Math.max(1, comboRef.current)
      scoreRef.current += gained; setScore(scoreRef.current)
      textsRef.current.push({ x: enemy.x, y: enemy.y, text: `+${gained}`, color: comboRef.current > 1 ? '#ffff00' : '#ffffff', vx: 0, vy: -45, alpha: 1 })
      enemyRef.current = null
      hitRef.current++; setHit(h => h + 1)

      setFlash('correct'); setTimeout(() => setFlash(null), 260)
      setTimeout(() => { setChoiceResult(null); speak(word.en, 0.9) }, 280)
      onCrystalEarn?.('green', 1, 'raiden_hit')

      advanceOrWin(idxRef.current + 1)
    } else {
      sfx.playWrong()
      setChoiceResult({ idx: choiceIdx, ok: false })
      setTimeout(() => setChoiceResult(null), 350)
      onCrystalSpend?.('green', 1, 'raiden_miss')
      loseHeart()
    }
  }, [currentWord, playerXY, sfx, speak, onCrystalEarn, onCrystalSpend]) // eslint-disable-line

  // ── Game loop ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    ctx.imageSmoothingEnabled = false
    lastTRef.current = performance.now()

    function loop(now: number) {
      const dt = Math.min((now - lastTRef.current) / 1000, 0.05)
      lastTRef.current = now
      const W = canvas!.width, H = canvas!.height

      // ── UPDATE ─────────────────────────────────────────────────────────
      for (const s of starsRef.current) {
        s.y += s.speed * 60 * dt
        if (s.y > H) { s.y = 0; s.x = Math.random() * W }
      }
      for (const isl of islandsRef.current) {
        isl.y += isl.speed * 110 * dt
        if (isl.y > H + 150) { isl.y = -200; isl.x = Math.random() * (W - isl.width) }
      }
      for (const cl of cloudsRef.current) {
        cl.y += cl.speed * 120 * dt
        if (cl.y > H + 80) { cl.y = -100; cl.x = Math.random() * (W - cl.width) }
      }

      // Ship patrols left/right at a calm constant speed (not stiff)
      {
        const margin = (SPRITES.player[0].length * PIXEL_SCALE) / 2 + 10
        playerXRef.current += playerDirRef.current * PLAYER_PATROL_SPEED * dt
        if (playerXRef.current <= margin) { playerXRef.current = margin; playerDirRef.current = 1 }
        else if (playerXRef.current >= W - margin) { playerXRef.current = W - margin; playerDirRef.current = -1 }
      }

      const en = enemyRef.current
      if (en) {
        const mult = SPEED_TIERS[speedRef.current - 1].mult
        en.y += ENEMY_BASE_SPEED * mult * dt
        en.x += Math.sin(en.sinePhase + en.y * 0.012) * 1.0
        en.x = Math.max(48, Math.min(W - 48, en.x))
        if (en.flashTimer > 0) en.flashTimer -= dt
        if (en.y > H * ESCAPE_FRAC && !en.escaped && !lockedRef.current) {
          en.escaped = true
          partsRef.current.push(...makeExplosion(en.x, en.y, en.color, 18))
          enemyRef.current = null
          const hp = loseHeart()
          if (hp <= 0) { if (rafRef.current) cancelAnimationFrame(rafRef.current); return }
          advanceOrWin(idxRef.current + 1)
        }
      }

      partsRef.current = partsRef.current.filter(p => {
        p.x += p.vx * dt; p.y += p.vy * dt
        if (p.debris) p.vy += 120 * dt
        p.alpha -= p.decay * dt
        return p.alpha > 0
      })
      textsRef.current = textsRef.current.filter(t => {
        t.x += t.vx * dt; t.y += t.vy * dt; t.alpha -= dt * 1.2
        return t.alpha > 0
      })
      if (laserRef.current) {
        laserRef.current.alpha -= dt * 6
        if (laserRef.current.alpha <= 0) laserRef.current = null
      }
      if (shakeRef.current > 0) shakeRef.current *= 0.9
      if (shakeRef.current < 0.4) shakeRef.current = 0

      // ── DRAW ────────────────────────────────────────────────────────────
      ctx!.save()
      if (shakeRef.current > 0) {
        ctx!.translate((Math.random() - 0.5) * shakeRef.current, (Math.random() - 0.5) * shakeRef.current)
      }

      // A. cosmic background
      ctx!.fillStyle = '#0a0b12'
      ctx!.fillRect(0, 0, W, H)

      // B. procedural islands
      for (const isl of islandsRef.current) {
        ctx!.fillStyle = '#0f1f1d'
        ctx!.fillRect(Math.floor(isl.x), Math.floor(isl.y), isl.width, isl.height)
        ctx!.fillStyle = '#1e3823'
        ctx!.fillRect(Math.floor(isl.x + 8), Math.floor(isl.y + 12), Math.max(10, isl.width - 20), Math.max(10, isl.height - 24))
        ctx!.strokeStyle = '#28462b'; ctx!.lineWidth = 1
        ctx!.strokeRect(Math.floor(isl.x), Math.floor(isl.y), isl.width, isl.height)
      }

      // C. stars
      for (const s of starsRef.current) {
        ctx!.fillStyle = s.color
        ctx!.fillRect(Math.floor(s.x), Math.floor(s.y), Math.round(s.size), Math.round(s.size))
      }

      // D. enemy + word pill
      if (enemyRef.current) {
        const e = enemyRef.current
        const grid = e.kind === 'mid' ? SPRITES.midEnemy : SPRITES.smallEnemy
        const ps = e.kind === 'mid' ? 3.5 : 3
        const gw = grid[0].length * ps, gh = grid.length * ps
        if (e.flashTimer > 0) { ctx!.save(); ctx!.globalAlpha = 0.3 + Math.abs(Math.sin(e.flashTimer * 25)) * 0.7 }
        drawSprite(ctx!, e.x - gw / 2, e.y - gh / 2, grid, e.color, ps)
        if (e.flashTimer > 0) ctx!.restore()

        // Chinese word pill above
        const label = e.word.zh
        const fontSize = Math.max(13, ps * 4.2)
        ctx!.font = `bold ${fontSize}px sans-serif`
        ctx!.textAlign = 'center'; ctx!.textBaseline = 'middle'
        const tw = ctx!.measureText(label).width
        const pw = tw + 20, ph = fontSize + 10
        const px = e.x - pw / 2, py = e.y - gh / 2 - ph - 6
        ctx!.fillStyle = 'rgba(0,0,0,0.78)'; rrect(ctx!, px, py, pw, ph, 6); ctx!.fill()
        ctx!.strokeStyle = e.color; ctx!.lineWidth = 1.5; rrect(ctx!, px, py, pw, ph, 6); ctx!.stroke()
        ctx!.fillStyle = '#fff'; ctx!.fillText(label, e.x, py + ph / 2 + 1)
      }

      // E. particles
      for (const p of partsRef.current) {
        ctx!.globalAlpha = Math.max(0, p.alpha)
        ctx!.fillStyle = p.color
        ctx!.fillRect(Math.floor(p.x), Math.floor(p.y), Math.round(p.size), Math.round(p.size))
      }
      ctx!.globalAlpha = 1

      // F. laser
      if (laserRef.current) {
        const l = laserRef.current
        ctx!.save(); ctx!.globalAlpha = l.alpha
        ctx!.strokeStyle = '#00e5ff'; ctx!.lineWidth = 5; ctx!.shadowColor = '#00e5ff'; ctx!.shadowBlur = 14
        ctx!.beginPath(); ctx!.moveTo(l.x1, l.y1); ctx!.lineTo(l.x2, l.y2); ctx!.stroke()
        ctx!.strokeStyle = '#fff'; ctx!.lineWidth = 2; ctx!.shadowBlur = 0
        ctx!.beginPath(); ctx!.moveTo(l.x1, l.y1); ctx!.lineTo(l.x2, l.y2); ctx!.stroke()
        ctx!.restore()
      }

      // G. player ship + engine flame
      const pp = playerXY()
      const grid = SPRITES.player, ps = PIXEL_SCALE
      drawSprite(ctx!, pp.x - (grid[0].length * ps) / 2, pp.y - (grid.length * ps) / 2, grid, PALETTE.playerMain, ps)
      const fh = Math.abs(Math.sin(now * 0.008)) * 9 + 6
      ctx!.globalAlpha = 0.7; ctx!.fillStyle = '#ffaa00'
      ctx!.beginPath(); ctx!.ellipse(pp.x - 8, pp.y + 18, 2.6, fh / 2, 0, 0, Math.PI * 2); ctx!.fill()
      ctx!.beginPath(); ctx!.ellipse(pp.x + 8, pp.y + 18, 2.6, fh / 2, 0, 0, Math.PI * 2); ctx!.fill()
      ctx!.globalAlpha = 1

      // H. clouds
      ctx!.fillStyle = '#ffffff'
      for (const cl of cloudsRef.current) {
        ctx!.globalAlpha = cl.opacity
        ctx!.beginPath()
        ctx!.arc(Math.floor(cl.x), Math.floor(cl.y), Math.round(cl.width * 0.35), 0, Math.PI * 2)
        ctx!.arc(Math.floor(cl.x + cl.width * 0.25), Math.floor(cl.y - 10), Math.round(cl.width * 0.4), 0, Math.PI * 2)
        ctx!.arc(Math.floor(cl.x + cl.width * 0.5), Math.floor(cl.y), Math.round(cl.width * 0.3), 0, Math.PI * 2)
        ctx!.fill()
      }
      ctx!.globalAlpha = 1

      // I. floating score text
      for (const t of textsRef.current) {
        ctx!.save(); ctx!.globalAlpha = Math.max(0, t.alpha)
        ctx!.fillStyle = t.color; ctx!.font = 'bold 14px monospace'
        ctx!.textAlign = 'center'; ctx!.textBaseline = 'middle'
        ctx!.fillText(t.text, t.x, t.y); ctx!.restore()
      }

      // J. danger line (where enemies crash — near the bottom / word area)
      const dy = H * ESCAPE_FRAC
      ctx!.save(); ctx!.globalAlpha = 0.25; ctx!.strokeStyle = '#ff0055'; ctx!.lineWidth = 1
      ctx!.setLineDash([6, 6]); ctx!.beginPath(); ctx!.moveTo(0, dy); ctx!.lineTo(W, dy); ctx!.stroke()
      ctx!.restore()

      ctx!.restore() // shake

      // K. CRT scanlines + vignette (always on top, no shake)
      ctx!.save()
      ctx!.globalAlpha = 0.08; ctx!.fillStyle = '#000'
      for (let y = 0; y < H; y += 3) ctx!.fillRect(0, y, W, 1.2)
      const grad = ctx!.createRadialGradient(W / 2, H / 2, W / 2, W / 2, H / 2, H * 0.72)
      grad.addColorStop(0, 'rgba(0,0,0,0)'); grad.addColorStop(0.7, 'rgba(0,0,0,0.1)'); grad.addColorStop(1, 'rgba(0,0,0,0.35)')
      ctx!.globalAlpha = 0.45; ctx!.fillStyle = grad; ctx!.fillRect(0, 0, W, H)
      ctx!.restore()

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [phase]) // eslint-disable-line

  // ── Side effects ──────────────────────────────────────────────────────────
  useEffect(() => { if (phase === 'win') sfx.playVictory() }, [phase, sfx])
  useEffect(() => {
    if (phase !== 'win' && phase !== 'over') return
    const acc = taps > 0 ? Math.round((correctTaps / taps) * 100) : 0
    onComplete({ hit, total, combo: maxCombo, accuracy: acc, won: phase === 'win' })
  }, [phase]) // eslint-disable-line
  useEffect(() => {
    if (phase !== 'win' || !onNextLevel) return
    const t = setTimeout(() => onNextLevel(), 3000)
    return () => clearTimeout(t)
  }, [phase, onNextLevel])

  const onNextLevelRef  = useRef(onNextLevel); onNextLevelRef.current = onNextLevel
  const startGameRef    = useRef(startGame);   startGameRef.current   = startGame
  const currentWordRef  = useRef(currentWord); currentWordRef.current = currentWord
  const choicesRef      = useRef(choices);     choicesRef.current     = choices
  const handleAnswerRef = useRef(handleAnswer); handleAnswerRef.current = handleAnswer
  const typedRef        = useRef('')

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const ph = phaseRef.current
      if (e.key === 'Enter') {
        if (ph === 'win' && onNextLevelRef.current) { onNextLevelRef.current(); return }
        if (ph === 'win' || ph === 'over') startGameRef.current()
        return
      }
      // Type-to-shoot: when a physical keyboard is present, typing the full
      // English word destroys the enemy — same effect as picking the right choice.
      if (ph !== 'playing' || lockedRef.current) return
      const word = currentWordRef.current; if (!word) return
      const answer = word.en.toLowerCase()
      if (e.key === 'Backspace') { typedRef.current = typedRef.current.slice(0, -1); return }
      if (e.key.length !== 1 || !/[a-zA-Z]/.test(e.key)) return
      let typed = typedRef.current + e.key.toLowerCase()
      // keep only the longest suffix that is still a prefix of the answer
      while (typed && !answer.startsWith(typed)) typed = typed.slice(1)
      typedRef.current = typed
      if (typed === answer) {
        typedRef.current = ''
        const idx = choicesRef.current.indexOf(answer)
        handleAnswerRef.current(idx, answer)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ── Intro ─────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="rdn rdn--intro">
        <div className="rdn__intro-top">
          <button className="rdn__x" onClick={onExit} aria-label="返回">✕</button>
          <SpeedButton tier={speedTier} onCycle={cycleSpeed} />
        </div>
        <div className="rdn__ship-icon" aria-hidden>🚀</div>
        <h1 className="rdn__title">雷电单词战</h1>
        <p className="rdn__sub">{unitLabel} · {queue.length} 个单词</p>
        <ul className="rdn__rules">
          <li>👾 敌机携带中文词义从上方飞来</li>
          <li>🎯 点击正确的英文翻译击落它</li>
          <li>❤️ 答错或敌机突破红线各扣 1 血</li>
          <li>⚡ 连续击落触发加分连击</li>
          <li>🐢 左上角速度按钮可调 5 档快慢</li>
        </ul>
        <button className="rdn__btn-primary" onClick={startGame}>出击！</button>
      </div>
    )
  }

  // ── Win / Over ────────────────────────────────────────────────────────────
  if (phase === 'win' || phase === 'over') {
    const acc = taps > 0 ? Math.round((correctTaps / taps) * 100) : 0
    const stars = phase === 'win' ? (acc >= 95 ? 3 : acc >= 75 ? 2 : 1) : 0
    return (
      <div className="rdn rdn--result">
        <div className="rdn__result-icon">{phase === 'win' ? '🏆' : '💥'}</div>
        <h1 className="rdn__title">{phase === 'win' ? '任务完成！' : '战机坠毁'}</h1>
        <div className="rdn__stars">
          {[1, 2, 3].map(i => <span key={i} className={`rdn__star${stars >= i ? ' rdn__star--on' : ''}`}>★</span>)}
        </div>
        <div className="rdn__stats">
          <div><span>击落</span><strong>{hit}/{total}</strong></div>
          <div><span>命中率</span><strong>{acc}%</strong></div>
          <div><span>最高连击</span><strong>{maxCombo}</strong></div>
          <div><span>得分</span><strong>{score}</strong></div>
        </div>
        <div className="rdn__result-btns">
          <button className="rdn__btn-secondary" onClick={onExit}>返回</button>
          <button className="rdn__btn-primary" onClick={startGame}>再来一次</button>
          {phase === 'win' && onNextLevel && (
            <button className="rdn__btn-primary rdn__btn-next" onClick={onNextLevel}>下一关 →</button>
          )}
        </div>
      </div>
    )
  }

  // ── Playing ───────────────────────────────────────────────────────────────
  return (
    <div className={`rdn rdn--playing${flash ? ` rdn--flash-${flash}` : ''}`}>
      <header className="rdn__hud safe-top">
        <button className="rdn__x" onClick={onExit} aria-label="返回">✕</button>
        <SpeedButton tier={speedTier} onCycle={cycleSpeed} />
        <div className="rdn__hearts">
          {Array.from({ length: HEARTS_MAX }, (_, i) => (
            <span key={i} className={`rdn__heart${i < hearts ? '' : ' rdn__heart--lost'}`}>♥</span>
          ))}
        </div>
        <div className="rdn__hud-r">
          {combo >= 2 && <span className="rdn__combo">⚡{combo}x</span>}
          <span className="rdn__score">{score}</span>
        </div>
      </header>

      <canvas ref={canvasRef} className="rdn__canvas" />

      <div className="rdn__panel safe-bottom">
        {currentWord && <p className="rdn__hint">「{currentWord.zh}」的英文是？</p>}
        <div className="rdn__choices">
          {choices.map((c, i) => {
            let cls = 'rdn__choice'
            if (choiceResult?.idx === i) cls += choiceResult.ok ? ' rdn__choice--ok' : ' rdn__choice--bad'
            return (
              <button key={`${c}-${i}`} type="button" className={cls} onClick={() => handleAnswer(i, c)}>
                {c}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
