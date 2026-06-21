import { useEffect, useRef, useState } from 'react'
import type { VocabWord } from '../data/unit1Vocab'
import type { CrystalEarnFn } from '../types'
import { useMobileSfx } from '../hooks/useMobileSfx'
import './beeBuster.css'

// ─── Constants ────────────────────────────────────────────────────────────────
const CW = 450
const CH = 800
const HUD_H = 192      // canvas pixels reserved for HUD at top
const PLR_Y_MIN = HUD_H + 24
const BEE_R = 22
const BEE_POOL = 5
const BULLET_SPD = 14
const HEARTS_START = 5
const SPEED_KEY = 'bbg-speed-tier'

const SPEED_TIERS = [
  { label: '很慢', mult: 0.38 },
  { label: '慢',   mult: 0.65 },
  { label: '标准', mult: 1.0  },
  { label: '快',   mult: 1.45 },
  { label: '极快', mult: 2.1  },
] as const

function readSpeedTier() {
  try { const n = parseInt(localStorage.getItem(SPEED_KEY) ?? '3', 10); return n >= 1 && n <= 5 ? n : 3 } catch { return 3 }
}

const DIST = 'abcdefghijklmnopqrstuvwxyz'.split('')

// ─── Types ────────────────────────────────────────────────────────────────────
interface Bee {
  id: number; x: number; y: number
  angle: number; vy: number
  letter: string; isTarget: boolean
  flashT: number; wingT: number
  entering: boolean; targetY: number
}
interface Bullet { id: number; x: number; y: number }
interface Particle { id: number; x: number; y: number; vx: number; vy: number; r: number; color: string; life: number; maxLife: number }
interface Star { x: number; y: number; vy: number; r: number; alpha: number }

interface GS {
  phase: 'playing' | 'win' | 'over'
  px: number; py: number
  bullets: Bullet[]; bees: Bee[]; particles: Particle[]; stars: Star[]
  wordIdx: number; spelled: number
  hearts: number; score: number; combo: number; maxCombo: number
  totalHit: number; totalShot: number
  shakeT: number; seq: number; speedMult: number; lastT: number
  wordDoneT: number   // >0 while celebrating current word (-1 inactive)
}

// ─── State factory ────────────────────────────────────────────────────────────
function initGS(speedMult: number): GS {
  return {
    phase: 'playing', px: CW / 2, py: CH - 100,
    bullets: [], bees: [], particles: [],
    stars: Array.from({ length: 65 }, () => ({
      x: Math.random() * CW, y: Math.random() * CH,
      vy: 0.15 + Math.random() * 0.45,
      r: 0.4 + Math.random() * 1.4,
      alpha: 0.25 + Math.random() * 0.75,
    })),
    wordIdx: 0, spelled: 0,
    hearts: HEARTS_START, score: 0, combo: 0, maxCombo: 0,
    totalHit: 0, totalShot: 0,
    shakeT: 0, seq: 1, speedMult, lastT: 0, wordDoneT: -1,
  }
}

// ─── Bee / wave helpers ───────────────────────────────────────────────────────
function newBee(gs: GS, letter: string, targetChar: string): Bee {
  const col = gs.bees.length % BEE_POOL
  const colW = CW / BEE_POOL
  const x = colW * col + colW * (0.15 + Math.random() * 0.7)
  return {
    id: gs.seq++, x, y: -BEE_R * 2 - Math.random() * 50,
    angle: Math.random() * Math.PI * 2,
    vy: 2.8 + Math.random() * 0.8,
    letter, isTarget: letter === targetChar,
    flashT: 0, wingT: Math.random() * Math.PI * 2,
    entering: true, targetY: HUD_H + 30 + Math.random() * 55,
  }
}

function spawnWave(gs: GS, words: VocabWord[], rnd = false) {
  const word = words[gs.wordIdx]
  if (!word || gs.wordDoneT > 0) return
  const tc = word.en[gs.spelled]?.toLowerCase()
  if (!tc) return

  const needed = Math.max(0, BEE_POOL - gs.bees.length)
  if (needed === 0) return

  const letters: string[] = []

  if (rnd) {
    // Random mode: all letters are random (no guaranteed target in wave)
    let attempts = 0
    while (letters.length < needed && attempts++ < 200) {
      const c = DIST[Math.floor(Math.random() * DIST.length)]
      if (!letters.includes(c)) letters.push(c)
    }
    while (letters.length < needed) letters.push(DIST[Math.floor(Math.random() * DIST.length)])
  } else {
    const hasTarget = gs.bees.some(b => b.isTarget)
    if (!hasTarget) letters.push(tc)
    let attempts = 0
    while (letters.length < needed && attempts++ < 200) {
      const c = DIST[Math.floor(Math.random() * DIST.length)]
      if (c !== tc && !letters.includes(c)) letters.push(c)
    }
    while (letters.length < needed) {
      const c = DIST[Math.floor(Math.random() * DIST.length)]
      if (c !== tc) letters.push(c)
    }
  }

  // shuffle
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]]
  }
  for (let i = 0; i < letters.length; i++) {
    const bee = newBee(gs, letters[i], tc)  // always mark correct letter as target for scoring
    bee.y -= i * 28
    gs.bees.push(bee)
  }
}

function burst(gs: GS, x: number, y: number, color: string, count = 12) {
  for (let i = 0; i < count; i++) {
    const a = (Math.PI * 2 * i) / count + Math.random() * 0.5
    const spd = 1.5 + Math.random() * 3.5
    gs.particles.push({
      id: gs.seq++, x, y,
      vx: Math.cos(a) * spd, vy: Math.sin(a) * spd - 1.5,
      r: 2 + Math.random() * 3,
      color, life: 45 + Math.random() * 25, maxLife: 70,
    })
  }
}

// ─── Drawing helpers ──────────────────────────────────────────────────────────
function hexPath(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6
    const px = x + r * Math.cos(a), py = y + r * Math.sin(a)
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
  }
  ctx.closePath()
}

function drawBee(ctx: CanvasRenderingContext2D, bee: Bee, showTarget = true) {
  const { x, y, wingT, flashT } = bee
  const isTarget = bee.isTarget && showTarget
  const wf = Math.sin(wingT * 1.8) * 10

  // Antennae
  ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.5; ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(x - 6, y - BEE_R + 2); ctx.quadraticCurveTo(x - 16, y - BEE_R - 12, x - 12, y - BEE_R - 20); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(x + 6, y - BEE_R + 2); ctx.quadraticCurveTo(x + 16, y - BEE_R - 12, x + 12, y - BEE_R - 20); ctx.stroke()
  ctx.fillStyle = '#92400e'
  ctx.beginPath(); ctx.arc(x - 12, y - BEE_R - 20, 3, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(x + 12, y - BEE_R - 20, 3, 0, Math.PI * 2); ctx.fill()

  // Wings (flapping)
  ctx.globalAlpha = 0.52
  ctx.fillStyle = isTarget ? 'rgba(220, 240, 255, 1)' : 'rgba(180, 215, 255, 1)'
  ctx.shadowBlur = isTarget ? 12 : 4; ctx.shadowColor = isTarget ? '#bfdbfe' : '#93c5fd'
  ctx.beginPath(); ctx.ellipse(x - 20, y - 10 + wf * 0.35, 16, 8, -0.3, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(x + 20, y - 10 + wf * 0.35, 16, 8,  0.3, 0, Math.PI * 2); ctx.fill()
  // Second wing pair (smaller, behind)
  ctx.globalAlpha = 0.32
  ctx.beginPath(); ctx.ellipse(x - 14, y + 4 - wf * 0.2, 10, 5, -0.4, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(x + 14, y + 4 - wf * 0.2, 10, 5,  0.4, 0, Math.PI * 2); ctx.fill()
  ctx.globalAlpha = 1; ctx.shadowBlur = 0

  // Glow
  ctx.shadowBlur = isTarget ? 22 : 7
  ctx.shadowColor = isTarget ? '#fbbf24' : '#92400e'

  // Body (oval)
  const bw = BEE_R * 0.85, bh = BEE_R * 1.15
  if (flashT > 0) {
    ctx.fillStyle = `rgba(255, 80, 80, ${0.7 + flashT * 0.3})`
  } else {
    ctx.fillStyle = isTarget ? '#fbbf24' : '#b45309'
  }
  ctx.beginPath(); ctx.ellipse(x, y, bw, bh, 0, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = isTarget ? '#fcd34d' : '#78350f'; ctx.lineWidth = 2; ctx.stroke()
  ctx.shadowBlur = 0

  // Black stripes (clipped to body)
  ctx.save()
  ctx.beginPath(); ctx.ellipse(x, y, bw, bh, 0, 0, Math.PI * 2); ctx.clip()
  ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 6; ctx.lineCap = 'butt'
  for (const dy of [-10, 0, 10]) {
    ctx.beginPath(); ctx.moveTo(x - bw - 2, y + dy); ctx.lineTo(x + bw + 2, y + dy); ctx.stroke()
  }
  ctx.restore()

  // Head (small circle on top)
  ctx.fillStyle = '#78350f'
  ctx.shadowBlur = 4; ctx.shadowColor = '#92400e'
  ctx.beginPath(); ctx.ellipse(x, y - bh + 6, bw * 0.52, bw * 0.52, 0, 0, Math.PI * 2); ctx.fill()
  ctx.shadowBlur = 0
  // Eyes
  ctx.fillStyle = '#fff'
  ctx.beginPath(); ctx.arc(x - 5, y - bh + 4, 4, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(x + 5, y - bh + 4, 4, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#1e1b4b'
  ctx.beginPath(); ctx.arc(x - 4.5, y - bh + 4, 2, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(x + 5.5, y - bh + 4, 2, 0, Math.PI * 2); ctx.fill()

  // Stinger
  ctx.fillStyle = '#78350f'
  ctx.beginPath(); ctx.moveTo(x - 4, y + bh - 3); ctx.lineTo(x + 4, y + bh - 3); ctx.lineTo(x, y + bh + 10); ctx.closePath(); ctx.fill()

  // Letter
  ctx.font = "bold 16px 'Courier New', monospace"
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillStyle = isTarget ? '#000' : '#fef3c7'
  ctx.fillText(bee.letter.toUpperCase(), x, y + 2)
}

function drawShip(ctx: CanvasRenderingContext2D, px: number, py: number, t: number) {
  // Engine flame
  const flicker = 0.7 + Math.sin(t * 0.014) * 0.3
  const grad = ctx.createRadialGradient(px, py + 18, 0, px, py + 8, 22 * flicker)
  grad.addColorStop(0, 'rgba(34,211,238,0.65)')
  grad.addColorStop(1, 'rgba(34,211,238,0)')
  ctx.fillStyle = grad
  ctx.fillRect(px - 22, py + 4, 44, 28)

  // Body
  ctx.shadowBlur = 14; ctx.shadowColor = '#22d3ee'
  ctx.fillStyle = '#22d3ee'
  ctx.beginPath()
  ctx.moveTo(px, py - 20)
  ctx.lineTo(px - 15, py + 12)
  ctx.lineTo(px - 7, py + 6)
  ctx.lineTo(px, py + 15)
  ctx.lineTo(px + 7, py + 6)
  ctx.lineTo(px + 15, py + 12)
  ctx.closePath()
  ctx.fill()
  ctx.shadowBlur = 0

  // Cockpit
  ctx.fillStyle = 'rgba(255,255,255,0.28)'
  ctx.beginPath(); ctx.ellipse(px, py - 5, 4, 7.5, 0, 0, Math.PI * 2); ctx.fill()
}

function drawBullet(ctx: CanvasRenderingContext2D, b: Bullet) {
  ctx.shadowBlur = 10; ctx.shadowColor = '#00ffcc'
  ctx.strokeStyle = '#00ffcc'; ctx.lineWidth = 2.5
  ctx.beginPath(); ctx.moveTo(b.x, b.y + 14); ctx.lineTo(b.x, b.y); ctx.stroke()
  ctx.shadowBlur = 0
  ctx.fillStyle = '#fff'
  ctx.beginPath(); ctx.arc(b.x, b.y, 2.5, 0, Math.PI * 2); ctx.fill()
}

function drawHUD(ctx: CanvasRenderingContext2D, gs: GS, words: VocabWord[], unitLabel: string) {
  const word = words[gs.wordIdx]

  // HUD backdrop
  ctx.fillStyle = 'rgba(0,0,0,0.62)'
  ctx.fillRect(0, 0, CW, HUD_H)
  ctx.strokeStyle = 'rgba(0,255,255,0.07)'
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(0, HUD_H); ctx.lineTo(CW, HUD_H); ctx.stroke()

  // Unit label (top-left)
  ctx.textAlign = 'left'; ctx.font = '11px system-ui'; ctx.fillStyle = 'rgba(255,255,255,0.28)'
  ctx.fillText(unitLabel, 14, 22)

  // Score (top-right)
  ctx.textAlign = 'right'; ctx.font = "bold 13px 'Courier New'"
  ctx.fillStyle = '#22d3ee'; ctx.fillText(`${gs.score}`, CW - 14, 22)
  if (gs.combo >= 2) {
    ctx.fillStyle = '#fbbf24'
    ctx.fillText(`×${gs.combo}连击`, CW - 14, 38)
  }

  // Hearts
  ctx.textAlign = 'left'; ctx.font = '22px serif'
  for (let i = 0; i < HEARTS_START; i++) {
    ctx.globalAlpha = i < gs.hearts ? 1 : 0.18
    ctx.fillText('❤', 12 + i * 28, 50)
  }
  ctx.globalAlpha = 1

  if (!word) return

  // Chinese meaning
  ctx.textAlign = 'center'
  ctx.shadowBlur = 8; ctx.shadowColor = 'rgba(255,255,255,0.15)'
  ctx.font = 'bold 30px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = '#f1f5f9'
  ctx.fillText(word.zh, CW / 2, 96)
  ctx.shadowBlur = 0

  // English word progress (underscores + filled letters)
  const letters = word.en.toUpperCase().split('')
  const charW = 28, gap = 6
  const totalW = letters.length * charW + (letters.length - 1) * gap
  const startX = (CW - totalW) / 2 + charW / 2

  for (let i = 0; i < letters.length; i++) {
    const x = startX + i * (charW + gap)
    const done = i < gs.spelled
    const isCur = i === gs.spelled

    // Underline
    ctx.strokeStyle = done ? '#fbbf24' : (isCur ? 'rgba(0,255,255,0.7)' : 'rgba(255,255,255,0.18)')
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(x - 12, 178); ctx.lineTo(x + 12, 178); ctx.stroke()

    if (done) {
      ctx.font = "bold 21px 'Courier New', monospace"
      ctx.textAlign = 'center'; ctx.fillStyle = '#fbbf24'
      ctx.fillText(letters[i], x, 169)
    } else if (isCur) {
      ctx.font = "18px 'Courier New', monospace"
      ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(0,255,255,0.35)'
      ctx.fillText('?', x, 169)
    }
  }
}

// ─── Main draw ────────────────────────────────────────────────────────────────
function draw(ctx: CanvasRenderingContext2D, gs: GS, words: VocabWord[], unitLabel: string, frameT: number, rnd = false) {
  const shaking = gs.shakeT > 0
  if (shaking) {
    ctx.save()
    const amt = Math.min(gs.shakeT / 280, 1) * 5.5
    ctx.translate((Math.random() - 0.5) * amt * 2, (Math.random() - 0.5) * amt * 2)
  }

  // Background
  ctx.fillStyle = '#0a0a1a'
  ctx.fillRect(0, 0, CW, CH)

  // Stars
  for (const s of gs.stars) {
    ctx.globalAlpha = s.alpha
    ctx.fillStyle = '#fff'
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill()
  }
  ctx.globalAlpha = 1

  // Scanlines
  ctx.fillStyle = 'rgba(0,0,20,0.07)'
  for (let y = 0; y < CH; y += 4) ctx.fillRect(0, y, CW, 2)

  // Particles
  for (const p of gs.particles) {
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife)
    ctx.fillStyle = p.color
    ctx.shadowBlur = 5; ctx.shadowColor = p.color
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill()
    ctx.shadowBlur = 0
  }
  ctx.globalAlpha = 1

  if (gs.phase === 'playing' || gs.wordDoneT > 0) {
    for (const bee of gs.bees) drawBee(ctx, bee, !rnd)
    for (const b of gs.bullets) drawBullet(ctx, b)
    drawShip(ctx, gs.px, gs.py, frameT)
    drawHUD(ctx, gs, words, unitLabel)

    // Word-complete celebration overlay
    if (gs.wordDoneT > 0) {
      const a = Math.min(1, gs.wordDoneT / 350)
      const prevWord = words[gs.wordIdx]
      ctx.globalAlpha = a * 0.65
      ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, CW, CH)
      ctx.globalAlpha = a
      ctx.textAlign = 'center'
      ctx.font = 'bold 46px system-ui, -apple-system'
      ctx.fillStyle = '#fbbf24'
      ctx.shadowBlur = 22; ctx.shadowColor = '#fbbf24'
      ctx.fillText('✓ 正确！', CW / 2, CH / 2 - 22)
      ctx.shadowBlur = 0
      if (prevWord) {
        ctx.font = "bold 30px 'Courier New', monospace"
        ctx.fillStyle = '#fff'
        ctx.fillText(prevWord.en.toUpperCase(), CW / 2, CH / 2 + 30)
      }
      ctx.globalAlpha = 1
    }
  }

  if (shaking) ctx.restore()
}

// ─── Update ───────────────────────────────────────────────────────────────────
type Sfx = ReturnType<typeof useMobileSfx>

function update(gs: GS, words: VocabWord[], dt: number, sfx: Sfx, rnd: boolean, invin: boolean) {
  const spf = dt / (1000 / 60)   // scale factor: 1.0 at 60fps

  // Stars
  for (const s of gs.stars) {
    s.y += s.vy * spf
    if (s.y > CH) { s.y = -2; s.x = Math.random() * CW }
  }

  // Particles
  for (let i = gs.particles.length - 1; i >= 0; i--) {
    const p = gs.particles[i]
    p.x += p.vx * spf; p.y += p.vy * spf
    p.vy += 0.13 * spf; p.life -= spf
    if (p.life <= 0) gs.particles.splice(i, 1)
  }

  gs.shakeT = Math.max(0, gs.shakeT - dt)

  // Word-done countdown
  if (gs.wordDoneT > 0) {
    gs.wordDoneT -= dt
    if (gs.wordDoneT <= 0) {
      gs.wordDoneT = -1
      gs.wordIdx++
      gs.spelled = 0
      if (gs.wordIdx >= words.length) { gs.phase = 'win'; return }
      gs.bees = []
      spawnWave(gs, words, rnd)
    }
    return  // freeze game during celebration
  }

  const word = words[gs.wordIdx]
  if (!word) return
  const tc = word.en[gs.spelled]?.toLowerCase()

  // Anti-stuck: ensure pool always has bees
  if (gs.bees.length < BEE_POOL) spawnWave(gs, words, rnd)
  // Anti-stuck: ensure at least 1 target exists (only in normal mode)
  if (!rnd && tc && !gs.bees.some(b => b.isTarget)) {
    const bee = newBee(gs, tc, tc)
    bee.y -= gs.bees.length * 28
    gs.bees.push(bee)
  }

  // Update bees
  for (let i = gs.bees.length - 1; i >= 0; i--) {
    const bee = gs.bees[i]
    bee.wingT += 0.11 * spf
    bee.flashT = Math.max(0, bee.flashT - spf * 0.06)

    if (bee.entering) {
      bee.y += bee.vy * spf
      bee.vy = Math.max(0.5, bee.vy - 0.1 * spf)
      if (bee.y >= bee.targetY) { bee.y = bee.targetY; bee.entering = false; bee.vy = 0 }
    } else {
      bee.angle += 0.022 * spf
      bee.x += Math.sin(bee.angle) * 1.3 * spf
      bee.x = Math.max(BEE_R, Math.min(CW - BEE_R, bee.x))
      bee.y += 0.52 * gs.speedMult * spf
    }

    // Bee exits bottom
    if (bee.y > CH + BEE_R) {
      if (bee.isTarget && !invin) {
        gs.hearts--; gs.combo = 0; gs.shakeT = 280
        sfx.playDamage()
        if (gs.hearts <= 0) { gs.phase = 'over'; return }
      }
      gs.bees.splice(i, 1)
      continue
    }

    // Bee collides with player
    if (Math.hypot(bee.x - gs.px, bee.y - gs.py) < BEE_R + 15) {
      burst(gs, bee.x, bee.y, '#ef4444', 8)
      if (!invin) {
        gs.hearts--; gs.combo = 0; gs.shakeT = 320
        sfx.playDamage()
        gs.bees.splice(i, 1)
        if (gs.hearts <= 0) { gs.phase = 'over'; return }
      } else {
        gs.shakeT = 140
        gs.bees.splice(i, 1)
      }
    }
  }

  // Update bullets
  for (let i = gs.bullets.length - 1; i >= 0; i--) {
    const b = gs.bullets[i]
    b.y -= BULLET_SPD * spf
    if (b.y < -10) { gs.bullets.splice(i, 1); continue }

    // Bullet-bee collision
    let hitBeeIdx = -1
    for (let j = 0; j < gs.bees.length; j++) {
      if (Math.hypot(b.x - gs.bees[j].x, b.y - gs.bees[j].y) < BEE_R + 5) {
        hitBeeIdx = j; break
      }
    }
    if (hitBeeIdx < 0) continue

    gs.bullets.splice(i, 1)
    const bee = gs.bees[hitBeeIdx]

    if (bee.isTarget) {
      burst(gs, bee.x, bee.y, '#fbbf24')
      sfx.playCorrect()
      gs.bees.splice(hitBeeIdx, 1)
      gs.spelled++; gs.score += 10; gs.combo++
      gs.maxCombo = Math.max(gs.maxCombo, gs.combo)
      gs.totalHit++
      if (gs.combo >= 5) sfx.playCombo()

      if (gs.spelled >= word.en.length) {
        // Word complete
        gs.score += 50 + Math.min(gs.combo * 5, 100)
        gs.wordDoneT = 1600
        gs.bees = []
        sfx.playVictory()
      } else {
        // Update target flags on remaining bees
        const nextTc = word.en[gs.spelled].toLowerCase()
        for (const rb of gs.bees) rb.isTarget = rb.letter === nextTc
        spawnWave(gs, words, rnd)
      }
    } else {
      burst(gs, bee.x, bee.y, '#ef4444', 8)
      sfx.playWrong()
      bee.flashT = 1
      gs.bees.splice(hitBeeIdx, 1)
      if (!invin) {
        gs.hearts--; gs.combo = 0; gs.shakeT = 240
        if (gs.hearts <= 0) { gs.phase = 'over'; return }
      } else {
        gs.shakeT = 100
      }
    }
  }
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  words: VocabWord[]
  unitLabel?: string
  onExit: () => void
  onComplete: (r: { hit: number; total: number; combo: number; accuracy: number; won: boolean }) => void
  onNextLevel?: () => void
  onCrystalEarn?: CrystalEarnFn
  onCrystalSpend?: (color: string, amount: number, reason: string) => void
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function BeeBusterGame({ words, unitLabel = '', onExit, onComplete, onNextLevel, onCrystalEarn }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gsRef = useRef<GS>(null as unknown as GS)
  const wordsRef = useRef(words)
  const unitRef = useRef(unitLabel)
  const sfxRef = useRef<Sfx>(null as unknown as Sfx)
  const rafRef = useRef(0)
  const phaseNotifiedRef = useRef(false)
  const onNextLevelRef = useRef(onNextLevel)
  const handleRetryRef = useRef<() => void>(() => {})
  const touchRef = useRef({ startX: 0, startY: 0, lastX: 0, lastY: 0, moved: false, active: false })
  const frameTRef = useRef(0)

  const [speedTier, setSpeedTier] = useState(readSpeedTier)
  const [phase, setPhase] = useState<GS['phase']>('playing')
  const [randomMode, setRandomMode] = useState(false)
  const [invincible, setInvincible] = useState(false)
  const randomModeRef = useRef(false)
  const invincibleRef = useRef(false)
  const sfx = useMobileSfx()

  // keep refs in sync
  useEffect(() => { wordsRef.current = words }, [words])
  useEffect(() => { unitRef.current = unitLabel }, [unitLabel])
  useEffect(() => { sfxRef.current = sfx }, [sfx])
  useEffect(() => { randomModeRef.current = randomMode }, [randomMode])
  useEffect(() => { invincibleRef.current = invincible }, [invincible])

  // persist speed + propagate to running game
  useEffect(() => {
    try { localStorage.setItem(SPEED_KEY, String(speedTier)) } catch { /* ignore */ }
    if (gsRef.current) gsRef.current.speedMult = SPEED_TIERS[speedTier - 1].mult
  }, [speedTier])

  // ─── Game loop (runs once on mount) ───────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current!
    canvas.width = CW
    canvas.height = CH
    const ctx = canvas.getContext('2d')!

    const gs = initGS(SPEED_TIERS[speedTier - 1].mult)
    gsRef.current = gs
    phaseNotifiedRef.current = false
    spawnWave(gs, words)

    function loop(ts: number) {
      frameTRef.current = ts
      const gs = gsRef.current
      if (!gs) return
      const dt = Math.min(50, ts - (gs.lastT || ts))
      gs.lastT = ts

      if (gs.phase === 'playing') update(gs, wordsRef.current, dt, sfxRef.current, randomModeRef.current, invincibleRef.current)
      draw(ctx, gs, wordsRef.current, unitRef.current, ts, randomModeRef.current)

      rafRef.current = requestAnimationFrame(loop)

      // Notify React once when phase leaves 'playing'
      if (gs.phase !== 'playing' && !phaseNotifiedRef.current) {
        phaseNotifiedRef.current = true
        const result = {
          hit: gs.totalHit,
          total: wordsRef.current.length,
          combo: gs.maxCombo,
          accuracy: gs.totalShot > 0 ? Math.round((gs.totalHit / gs.totalShot) * 100) : 0,
          won: gs.phase === 'win',
        }
        onComplete(result)
        if (gs.phase === 'win') {
          if (gs.totalHit > 0) onCrystalEarn?.('blue', 1, 'bee_round')
          if (result.accuracy >= 100 && gs.totalHit > 0) onCrystalEarn?.('green', 1, 'bee_perfect')
          if (gs.maxCombo >= 10) onCrystalEarn?.('purple', 1, 'bee_combo_10')
        }
        setPhase(gs.phase)
      }
    }

    gs.lastT = performance.now()
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Canvas input events ───────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current!

    function fire() {
      const gs = gsRef.current
      if (!gs || gs.phase !== 'playing') return
      gs.bullets.push({ id: gs.seq++, x: gs.px, y: gs.py - 22 })
      gs.totalShot++
      sfxRef.current?.playShoot?.()
    }

    function restartGame() {
      const gs = initGS(SPEED_TIERS[speedTier - 1].mult)
      gsRef.current = gs
      phaseNotifiedRef.current = false
      spawnWave(gs, wordsRef.current)
      setPhase('playing')
    }

    function onTouchStart(e: TouchEvent) {
      e.preventDefault()
      const gs = gsRef.current
      if (!gs) return
      if (gs.phase === 'over') { restartGame(); return }
      if (gs.phase !== 'playing') return
      if (e.touches.length >= 2) { fire(); return }
      const t = e.touches[0]
      const tc = touchRef.current
      tc.startX = tc.lastX = t.clientX
      tc.startY = tc.lastY = t.clientY
      tc.moved = false; tc.active = true
    }

    function onTouchMove(e: TouchEvent) {
      e.preventDefault()
      const gs = gsRef.current
      if (!gs || gs.phase !== 'playing' || !touchRef.current.active) return
      const t = e.touches[0]
      const tc = touchRef.current
      if (Math.hypot(t.clientX - tc.startX, t.clientY - tc.startY) > 5) tc.moved = true
      const r = canvas.getBoundingClientRect()
      const sx = CW / r.width, sy = CH / r.height
      gs.px = Math.max(22, Math.min(CW - 22, gs.px + (t.clientX - tc.lastX) * sx))
      gs.py = Math.max(PLR_Y_MIN, Math.min(CH - 22, gs.py + (t.clientY - tc.lastY) * sy))
      tc.lastX = t.clientX; tc.lastY = t.clientY
    }

    function onTouchEnd(e: TouchEvent) {
      e.preventDefault()
      if (touchRef.current.active && !touchRef.current.moved) fire()
      touchRef.current.active = false
    }

    function onMouseMove(e: MouseEvent) {
      const gs = gsRef.current
      if (!gs || gs.phase !== 'playing') return
      const r = canvas.getBoundingClientRect()
      gs.px = Math.max(22, Math.min(CW - 22, (e.clientX - r.left) * (CW / r.width)))
      gs.py = Math.max(PLR_Y_MIN, Math.min(CH - 22, (e.clientY - r.top) * (CH / r.height)))
    }

    function onClick(e: MouseEvent) {
      e.preventDefault()
      const gs = gsRef.current
      if (!gs) return
      if (gs.phase === 'over') { restartGame(); return }
      if (gs.phase === 'playing') fire()
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.code === 'Space') { e.preventDefault(); fire() }
      if (e.key === 'Enter') {
        const ph = gsRef.current?.phase
        if (ph === 'win' && onNextLevelRef.current) { onNextLevelRef.current(); return }
        if (ph === 'win' || ph === 'over') handleRetryRef.current()
      }
    }

    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd, { passive: false })
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('click', onClick)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('click', onClick)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [speedTier]) // eslint-disable-line react-hooks/exhaustive-deps

  onNextLevelRef.current = onNextLevel

  function handleRetry() {
    const gs = initGS(SPEED_TIERS[speedTier - 1].mult)
    gsRef.current = gs
    phaseNotifiedRef.current = false
    spawnWave(gs, wordsRef.current)
    setPhase('playing')
  }
  handleRetryRef.current = handleRetry

  const gs = gsRef.current

  return (
    <div className="bbg__wrap">
      {/* Top bar */}
      <div className="bbg__topbar">
        <button type="button" className="bbg__exit" onClick={onExit}>
          <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="10,3 5,8 10,13" />
          </svg>
          退出
        </button>
        <div className="bbg__speed-group">
          <span className="bbg__speed-label">速度</span>
          {SPEED_TIERS.map((t, i) => (
            <button key={i} type="button"
              className={`bbg__speed-btn${speedTier === i + 1 ? ' bbg__speed-btn--active' : ''}`}
              onClick={() => setSpeedTier(i + 1)}
            >{t.label}</button>
          ))}
        </div>
        <button type="button"
          className={`bbg__speed-btn${randomMode ? ' bbg__speed-btn--active' : ''}`}
          onClick={() => setRandomMode(v => !v)}
          title="随机模式：蜜蜂不提示目标字母">随机</button>
        <button type="button"
          className={`bbg__speed-btn${invincible ? ' bbg__speed-btn--active' : ''}`}
          onClick={() => setInvincible(v => !v)}
          title="无敌模式：生命不减少">无敌</button>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} width={CW} height={CH} className="bbg__canvas" />

      {/* Win overlay */}
      {phase === 'win' && (
        <div className="bbg__overlay">
          <div className="bbg__overlay-panel">
            <div className="bbg__overlay-emoji">🏆</div>
            <div className="bbg__overlay-title">全部通关！</div>
            <div className="bbg__overlay-score">得分 {gs?.score ?? 0}</div>
            <div className="bbg__overlay-sub">最高连击 ×{gs?.maxCombo ?? 0}</div>
            <div className="bbg__overlay-btns">
              {onNextLevel && (
                <button type="button" className="bbg__btn bbg__btn--next" onClick={onNextLevel}>下一关 →</button>
              )}
              <button type="button" className="bbg__btn bbg__btn--exit" onClick={onExit}>返回</button>
            </div>
          </div>
        </div>
      )}

      {/* Over overlay */}
      {phase === 'over' && (
        <div className="bbg__overlay">
          <div className="bbg__overlay-panel bbg__overlay-panel--over">
            <div className="bbg__overlay-title bbg__overlay-title--over">游戏结束</div>
            <div className="bbg__overlay-score">得分 {gs?.score ?? 0}</div>
            <div className="bbg__overlay-sub">命中 {gs?.totalHit ?? 0} 个 · 连击 ×{gs?.maxCombo ?? 0}</div>
            <div className="bbg__overlay-btns">
              <button type="button" className="bbg__btn bbg__btn--retry" onClick={handleRetry}>再来一次 ↺</button>
              <button type="button" className="bbg__btn bbg__btn--exit" onClick={onExit}>返回</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
