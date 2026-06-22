import { useCallback, useEffect, useRef, useState } from 'react'
import { playWordImmediate, preloadWords } from '../../utils/wordAudio.js'
import { unlockAudio } from '../../utils/audioUnlock'
import './alphabet.css'

const CW = 450
const CH = 800

// ── Audio ─────────────────────────────────────────────────────────────────
let _ac: AudioContext | null = null
function getAC() {
  if (!_ac) _ac = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  if (_ac.state === 'suspended') void _ac.resume()
  return _ac
}
function playTone(freq: number, type: OscillatorType = 'sine', dur = 0.18, vol = 0.22) {
  try {
    const ctx = getAC(); const o = ctx.createOscillator(); const g = ctx.createGain()
    o.connect(g); g.connect(ctx.destination); o.type = type
    o.frequency.setValueAtTime(freq, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(freq * 0.6, ctx.currentTime + dur)
    g.gain.setValueAtTime(vol, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur + 0.04)
    o.start(); o.stop(ctx.currentTime + dur + 0.08)
  } catch { /* ignore */ }
}
function playPop() { playTone(880, 'sine', 0.14, 0.26); setTimeout(() => playTone(1100, 'sine', 0.1, 0.14), 60) }
function playWrong() { playTone(200, 'sawtooth', 0.28, 0.14) }
function playSuccess() {
  [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 'sine', 0.32, 0.18), i * 110))
}
function playStroke() { playTone(660, 'sine', 0.1, 0.12) }

// Use the neural server voice (same as the rest of the app) instead of the
// browser's robotic speechSynthesis. Single capital letters are read as their
// names ("A" → "ay"); falls back to speechSynthesis only if the network voice
// is unavailable (handled inside playWordImmediate).
function speak(text: string) {
  const t = text?.trim()
  if (!t) return
  try {
    unlockAudio()
    playWordImmediate(t, { rate: 0.92 })
  } catch { /* ignore */ }
}

// ── Particles ─────────────────────────────────────────────────────────────
interface Pt { x: number; y: number }
interface Particle { x: number; y: number; vx: number; vy: number; r: number; color: string; life: number; maxLife: number; rect?: boolean; spin?: number; spinV?: number }

function burst(arr: Particle[], x: number, y: number, colors: string[], n = 14, rect = false) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
    const spd = 2.5 + Math.random() * 5
    arr.push({ x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd - 2, r: 3 + Math.random() * 5, color: colors[i % colors.length], life: 55 + Math.random() * 25, maxLife: 80, rect, spin: Math.random() * Math.PI * 2, spinV: (Math.random() - 0.5) * 0.28 })
  }
}
function tickParticles(arr: Particle[], spf: number, gravity = 0.12) {
  for (let i = arr.length - 1; i >= 0; i--) {
    const p = arr[i]; p.x += p.vx * spf; p.y += p.vy * spf; p.vy += gravity * spf
    if (p.spin !== undefined) p.spin += (p.spinV ?? 0) * spf
    p.life -= spf
    if (p.life <= 0) arr.splice(i, 1)
  }
}
function drawParticles(ctx: CanvasRenderingContext2D, arr: Particle[]) {
  for (const p of arr) {
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife)
    ctx.fillStyle = p.color; ctx.shadowBlur = 6; ctx.shadowColor = p.color
    if (p.rect) {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.spin ?? 0)
      ctx.fillRect(-p.r, -p.r * 0.5, p.r * 2, p.r); ctx.restore()
    } else {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill()
    }
    ctx.shadowBlur = 0
  }
  ctx.globalAlpha = 1
}

interface Confetto { x: number; y: number; vx: number; vy: number; r: number; color: string; spin: number; spinV: number }
const CONFETTI_COLORS = ['#ff6b9d', '#4ecdc4', '#ffd93d', '#6bcb77', '#4d96ff', '#c77dff', '#ff6b35']
function makeConfetti(): Confetto[] {
  return Array.from({ length: 80 }, () => ({
    x: Math.random() * CW, y: -40 - Math.random() * 80,
    vx: (Math.random() - 0.5) * 3.5, vy: 2.5 + Math.random() * 2.5,
    r: 4 + Math.random() * 7, color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    spin: Math.random() * Math.PI * 2, spinV: (Math.random() - 0.5) * 0.2,
  }))
}
function tickConfetti(arr: Confetto[], spf: number) {
  for (const c of arr) { c.x += c.vx * spf; c.y += c.vy * spf; c.spin += c.spinV * spf }
}
function drawConfetti(ctx: CanvasRenderingContext2D, arr: Confetto[]) {
  for (const c of arr) {
    ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.spin)
    ctx.fillStyle = c.color; ctx.fillRect(-c.r * 0.5, -c.r, c.r, c.r * 2); ctx.restore()
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  MODULE 1 — BUBBLE POP
// ══════════════════════════════════════════════════════════════════════════
const BUBBLE_LEVELS = [
  { letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], name: 'A – G', color: '#4ecdc4' },
  { letters: ['H', 'I', 'J', 'K', 'L', 'M', 'N'], name: 'H – N', color: '#6bcb77' },
  { letters: ['O', 'P', 'Q', 'R', 'S', 'T', 'U'], name: 'O – U', color: '#4d96ff' },
  { letters: ['V', 'W', 'X', 'Y', 'Z'],            name: 'V – Z', color: '#c77dff' },
]
const B_COLS = [
  ['#ff6b9d', '#ffb3cc'], ['#4ecdc4', '#b2f0ec'], ['#ffd93d', '#fff5b0'],
  ['#6bcb77', '#b8f0be'], ['#4d96ff', '#b3d4ff'], ['#c77dff', '#e8b3ff'],
  ['#ff7849', '#ffb899'], ['#f0abfc', '#e9d5ff'],
]
let _bId = 0
interface Bubble { id: number; x: number; y: number; r: number; letter: string; ci: number; speedY: number; ang: number; dX: number; wiggle: number; popping: boolean; popT: number; alpha: number }
interface BubbleGS { level: number; target: string; score: number; bubbles: Bubble[]; particles: Particle[]; spawnT: number; guardT: number; done: boolean; advT: number; confetti: Confetto[] }

function initBubble(level = 0): BubbleGS {
  const pool = BUBBLE_LEVELS[level].letters
  return { level, target: pool[0], score: 0, bubbles: [], particles: [], spawnT: 0, guardT: 0, done: false, advT: 0, confetti: [] }
}
function mkBubble(letter: string, level: number): Bubble {
  return { id: ++_bId, x: 44 + Math.random() * (CW - 88), y: CH + 50, r: 32 + Math.random() * 20, letter, ci: Math.floor(Math.random() * B_COLS.length), speedY: 0.7 + Math.random() * 0.55 + level * 0.15, ang: Math.random() * Math.PI * 2, dX: 0.45 + Math.random() * 0.95, wiggle: 0, popping: false, popT: 0, alpha: 0 }
}
function updateBubble(gs: BubbleGS, dt: number, spf: number): 'advance' | 'complete' | null {
  if (gs.done) { gs.advT -= dt; tickConfetti(gs.confetti, spf); return gs.advT <= 0 ? (gs.level < 3 ? 'advance' : 'complete') : null }
  gs.spawnT -= dt; gs.guardT -= dt
  if (gs.spawnT <= 0) {
    gs.spawnT = 900 + Math.random() * 700
    const hasT = gs.bubbles.some(b => b.letter === gs.target && !b.popping)
    const ltr = (!hasT && gs.guardT <= 0) ? (gs.guardT = 3500, gs.target) : BUBBLE_LEVELS[gs.level].letters[Math.floor(Math.random() * BUBBLE_LEVELS[gs.level].letters.length)]
    gs.bubbles.push(mkBubble(ltr, gs.level))
  }
  for (let i = gs.bubbles.length - 1; i >= 0; i--) {
    const b = gs.bubbles[i]
    if (b.alpha < 1) b.alpha = Math.min(1, b.alpha + 0.055 * spf)
    if (b.popping) { b.popT += 0.072 * spf; if (b.popT >= 1) gs.bubbles.splice(i, 1); continue }
    b.y -= b.speedY * spf; b.ang += 0.018 * spf
    b.x = Math.max(b.r, Math.min(CW - b.r, b.x + Math.sin(b.ang) * b.dX * spf))
    if (b.wiggle > 0) b.wiggle -= spf
    if (b.y < -b.r) gs.bubbles.splice(i, 1)
  }
  tickParticles(gs.particles, spf)
  return null
}
function drawBubble(ctx: CanvasRenderingContext2D, gs: BubbleGS, ts: number) {
  // BG
  const bg = ctx.createLinearGradient(0, 0, 0, CH)
  bg.addColorStop(0, '#050d1a'); bg.addColorStop(1, '#0b2444')
  ctx.fillStyle = bg; ctx.fillRect(0, 0, CW, CH)
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = `rgba(78,205,196,${0.018 + Math.sin(ts * 0.0008 + i) * 0.008})`
    ctx.beginPath(); ctx.arc(CW * (0.25 + i * 0.25), CH * 0.45 + Math.sin(ts * 0.001 + i) * 55, 95, 0, Math.PI * 2); ctx.fill()
  }
  // Bubbles
  for (const b of gs.bubbles) {
    ctx.save(); ctx.globalAlpha = b.alpha
    const sx = b.wiggle > 0 ? 1 + Math.sin(b.wiggle * 0.5) * 0.16 : 1
    const sy = b.wiggle > 0 ? 1 - Math.sin(b.wiggle * 0.5) * 0.09 : 1
    if (b.popping) {
      ctx.globalAlpha *= (1 - b.popT * 1.1)
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r * (1 + b.popT * 1.5), 0, Math.PI * 2)
      ctx.strokeStyle = B_COLS[b.ci][0]; ctx.lineWidth = 3 * (1 - b.popT); ctx.stroke()
      ctx.restore(); continue
    }
    ctx.translate(b.x, b.y); ctx.scale(sx, sy)
    const g = ctx.createRadialGradient(-b.r * 0.3, -b.r * 0.35, b.r * 0.08, 0, 0, b.r)
    g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(0.4, B_COLS[b.ci][1] + 'cc'); g.addColorStop(1, B_COLS[b.ci][0] + 'aa')
    ctx.beginPath(); ctx.arc(0, 0, b.r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill()
    const sh = ctx.createRadialGradient(-b.r * 0.28, -b.r * 0.38, 0, -b.r * 0.18, -b.r * 0.28, b.r * 0.5)
    sh.addColorStop(0, 'rgba(255,255,255,0.75)'); sh.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.beginPath(); ctx.arc(-b.r * 0.18, -b.r * 0.28, b.r * 0.5, 0, Math.PI * 2); ctx.fillStyle = sh; ctx.fill()
    ctx.beginPath(); ctx.arc(0, 0, b.r, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 2; ctx.stroke()
    ctx.font = `bold ${Math.round(b.r * 0.92)}px 'Courier New',monospace`
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillText(b.letter, 0, 2)
    ctx.fillStyle = '#fff'; ctx.fillText(b.letter, 0, 0)
    ctx.restore()
  }
  drawParticles(ctx, gs.particles)
  if (gs.done) {
    drawConfetti(ctx, gs.confetti)
    ctx.fillStyle = 'rgba(0,0,0,0.52)'; ctx.fillRect(0, CH / 2 - 68, CW, 136)
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.font = 'bold 36px system-ui'; ctx.fillStyle = '#ffd93d'
    ctx.shadowBlur = 22; ctx.shadowColor = '#ffd93d'
    ctx.fillText(gs.level < 3 ? '✓ 过关！' : '🎉 全部完成！', CW / 2, CH / 2 - 14)
    ctx.shadowBlur = 0; ctx.font = '17px system-ui'; ctx.fillStyle = 'rgba(255,255,255,0.65)'
    ctx.fillText(gs.level < 3 ? `下一组: ${BUBBLE_LEVELS[gs.level + 1]?.name ?? ''}` : '太棒了！', CW / 2, CH / 2 + 30)
  }
  // HUD
  ctx.fillStyle = 'rgba(0,0,0,0.48)'; ctx.fillRect(0, 0, CW, 86)
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
  ctx.font = 'bold 13px system-ui'; ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.fillText(`关卡 ${gs.level + 1}/4 · ${BUBBLE_LEVELS[gs.level].name}`, 14, 20)
  ctx.textAlign = 'right'; ctx.fillText(`${gs.score}/10`, CW - 14, 20)
  ctx.textAlign = 'center'; ctx.font = '13px system-ui'; ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillText('点击正确的字母气泡', CW / 2, 40)
  ctx.font = `bold 34px 'Courier New',monospace`; ctx.fillStyle = '#ffd93d'
  ctx.shadowBlur = 16; ctx.shadowColor = '#ffd93d'; ctx.fillText(gs.target, CW / 2, 66); ctx.shadowBlur = 0
}

// ══════════════════════════════════════════════════════════════════════════
//  MODULE 2 — GREEDY MONSTER
// ══════════════════════════════════════════════════════════════════════════
const ALL_PAIRS: [string, string][] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(c => [c, c.toLowerCase()])
const CANDY_COLS = ['#ff6b9d', '#4ecdc4', '#ffd93d', '#6bcb77', '#4d96ff', '#c77dff', '#ff7849', '#ff8fab']
const MX_R = 50
const MX_Y = CH - 105
type MState = 'IDLE' | 'OPEN' | 'CHEW' | 'SHAKE'
let _mId = 0
interface Candy { id: number; x: number; y: number; letter: string; isTarget: boolean; vy: number; vx: number; alive: boolean; alpha: number }
interface MonsterGS { mx: number; my: number; mstate: MState; stT: number; mouthO: number; gazeX: number; gazeY: number; wigA: number; pairIdx: number; score: number; candies: Candy[]; particles: Particle[]; spawnT: number; done: boolean; confetti: Confetto[] }

function initMonster(): MonsterGS {
  return { mx: CW / 2, my: MX_Y, mstate: 'IDLE', stT: 0, mouthO: 0, gazeX: 0, gazeY: -1, wigA: 0, pairIdx: 0, score: 0, candies: [], particles: [], spawnT: 70, done: false, confetti: [] }
}
function spawnCandiePair(gs: MonsterGS) {
  const tgt = ALL_PAIRS[gs.pairIdx][1]
  const pool = 'abcdefghijklmnopqrstuvwxyz'.split('').filter(c => c !== tgt)
  const dists: string[] = []; while (dists.length < 3) { const r = pool[Math.floor(Math.random() * pool.length)]; if (!dists.includes(r)) dists.push(r) }
  const all = [tgt, ...dists].sort(() => Math.random() - 0.5)
  all.forEach((lt, i) => { const sp = CW / (all.length + 1); gs.candies.push({ id: ++_mId, x: sp * (i + 1), y: -28 - Math.random() * 40, letter: lt, isTarget: lt === tgt, vy: 1.1 + Math.random() * 0.85, vx: 0, alive: true, alpha: 1 }) })
}
function updateMonster(gs: MonsterGS, dt: number, spf: number): 'complete' | null {
  if (gs.done) { tickConfetti(gs.confetti, spf); tickParticles(gs.particles, spf); return null }
  gs.stT += spf
  if ((gs.mstate === 'CHEW' || gs.mstate === 'SHAKE') && gs.stT > 65) { gs.mstate = 'IDLE'; gs.stT = 0 }
  gs.spawnT -= spf
  if (gs.spawnT <= 0 && gs.candies.filter(c => c.alive).length < 4) { gs.spawnT = 120 + Math.random() * 80; spawnCandiePair(gs) }
  let closestT: Candy | null = null; let closestD = Infinity
  for (let i = gs.candies.length - 1; i >= 0; i--) {
    const c = gs.candies[i]
    if (!c) continue // 数组可能在本轮被清空（吃到目标时），守护越界
    if (!c.alive) { c.x += c.vx * spf; c.y += c.vy * spf; c.vy += 0.35 * spf; c.alpha = Math.max(0, c.alpha - 0.042 * spf); if (c.y > CH + 60 || c.alpha <= 0) gs.candies.splice(i, 1); continue }
    c.y += c.vy * spf
    if (c.isTarget) { const d = Math.hypot(c.x - gs.mx, c.y - gs.my); if (d < closestD) { closestD = d; closestT = c } }
    const inX = Math.abs(c.x - gs.mx) < MX_R * 1.2; const inY = c.y > gs.my - MX_R && c.y < gs.my + 24
    if (inX && inY) {
      if (c.isTarget && gs.mstate !== 'SHAKE') {
        gs.mstate = 'CHEW'; gs.stT = 0
        burst(gs.particles, c.x, gs.my - 8, CANDY_COLS, 16, true); playPop(); speak(ALL_PAIRS[gs.pairIdx][0])
        gs.candies.splice(i, 1); gs.score++
        if (gs.score >= 13) { gs.done = true; playSuccess(); gs.confetti = makeConfetti(); speak('Amazing! You matched them all!'); return null }
        gs.pairIdx = gs.score % ALL_PAIRS.length; gs.spawnT = 32; gs.candies = []
        setTimeout(() => speak(`Find little ${ALL_PAIRS[gs.pairIdx][0].toLowerCase()}`), 700)
        break // candies 已清空，跳出本轮遍历
      } else if (!c.isTarget && gs.mstate !== 'SHAKE') {
        gs.mstate = 'SHAKE'; gs.stT = 0; playWrong()
        speak(`Oops! That is ${c.letter}. Find little ${ALL_PAIRS[gs.pairIdx][0].toLowerCase()}.`)
        c.alive = false; c.vy = -5 - Math.random() * 2; c.vx = (c.x < gs.mx ? -1 : 1) * (2.5 + Math.random() * 3)
      }
    }
    if (c.y > CH + 60) { gs.candies.splice(i, 1) }
  }
  if (gs.mstate === 'IDLE' || gs.mstate === 'OPEN') { const near = gs.candies.find(c => c.isTarget && c.alive && c.y > gs.my - 210 && Math.abs(c.x - gs.mx) < MX_R * 1.7); gs.mstate = near ? 'OPEN' : 'IDLE' }
  if (closestT) { const dx = closestT.x - gs.mx; const dy = closestT.y - gs.my; const len = Math.hypot(dx, dy) || 1; gs.gazeX += ((dx / len) - gs.gazeX) * 0.11 * spf; gs.gazeY += ((dy / len) - gs.gazeY) * 0.11 * spf } else { gs.gazeX *= 0.93; gs.gazeY *= 0.93 }
  gs.wigA = gs.mstate === 'SHAKE' ? Math.sin(gs.stT * 0.42) * 0.15 : gs.wigA * 0.88
  const tMouth = gs.mstate === 'OPEN' ? 1 : gs.mstate === 'CHEW' ? 0.42 : 0
  gs.mouthO += (tMouth - gs.mouthO) * 0.14 * spf
  tickParticles(gs.particles, spf)
  return null
}
function drawMonsterFace(ctx: CanvasRenderingContext2D, gs: MonsterGS) {
  const { mx, my, mouthO, wigA, mstate, gazeX, gazeY } = gs
  ctx.save(); ctx.translate(mx, my); ctx.rotate(wigA)
  ctx.beginPath(); ctx.ellipse(0, MX_R + 5, MX_R * 0.85, 10, 0, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.fill()
  const bg = ctx.createRadialGradient(-MX_R * 0.25, -MX_R * 0.3, MX_R * 0.08, 0, 0, MX_R * 1.05)
  bg.addColorStop(0, '#86efac'); bg.addColorStop(0.6, '#4ade80'); bg.addColorStop(1, '#16a34a')
  ctx.beginPath(); ctx.arc(0, 0, MX_R, 0, Math.PI * 2); ctx.fillStyle = bg; ctx.fill()
  ctx.strokeStyle = '#14532d'; ctx.lineWidth = 3; ctx.stroke()
  ctx.fillStyle = 'rgba(21,128,61,0.35)'; ctx.beginPath(); ctx.arc(-MX_R * 0.52, MX_R * 0.12, MX_R * 0.18, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(MX_R * 0.44, -MX_R * 0.38, MX_R * 0.12, 0, Math.PI * 2); ctx.fill()
  const chew = mstate === 'CHEW'
  for (const s of [-1, 1] as const) {
    const ex = s * MX_R * 0.33, ey = -MX_R * 0.22, er = MX_R * 0.23
    if (chew) {
      ctx.beginPath(); ctx.arc(ex, ey, er, Math.PI * 0.08, Math.PI * 0.92)
      ctx.strokeStyle = '#14532d'; ctx.lineWidth = 3; ctx.stroke()
    } else {
      ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill()
      ctx.beginPath(); ctx.arc(ex + gazeX * er * 0.42, ey + gazeY * er * 0.42, er * 0.52, 0, Math.PI * 2); ctx.fillStyle = '#0f172a'; ctx.fill()
      ctx.beginPath(); ctx.arc(ex + gazeX * er * 0.42 - er * 0.15, ey + gazeY * er * 0.42 - er * 0.15, er * 0.15, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill()
    }
  }
  if (mstate === 'SHAKE') {
    ctx.beginPath(); ctx.moveTo(-MX_R * 0.4, MX_R * 0.28); ctx.lineTo(MX_R * 0.4, MX_R * 0.28)
    ctx.strokeStyle = '#14532d'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.stroke()
  } else if (mouthO > 0.04) {
    const ms = MX_R * 0.52 * mouthO
    ctx.beginPath(); ctx.arc(0, MX_R * 0.22, ms, 0.1, Math.PI - 0.1); ctx.fillStyle = '#991b1b'; ctx.fill()
    if (mouthO > 0.35) {
      ctx.fillStyle = '#fafafa'
      ;[-1, 0, 1].forEach(t => {
        const tw = ms * 0.35
        ctx.beginPath(); ctx.moveTo(t * tw, MX_R * 0.22); ctx.lineTo(t * tw - tw * 0.5, MX_R * 0.22 + 10 * mouthO); ctx.lineTo(t * tw + tw * 0.5, MX_R * 0.22 + 10 * mouthO); ctx.closePath(); ctx.fill()
      })
    }
    if (mstate === 'OPEN' && mouthO > 0.55) {
      ctx.beginPath(); ctx.ellipse(0, MX_R * 0.22 + ms * 0.5, ms * 0.4, ms * 0.25, 0, 0, Math.PI * 2)
      ctx.fillStyle = '#dc2626'; ctx.fill()
    }
  } else {
    ctx.beginPath(); ctx.moveTo(-MX_R * 0.38, MX_R * 0.22); ctx.quadraticCurveTo(0, MX_R * 0.44, MX_R * 0.38, MX_R * 0.22)
    ctx.strokeStyle = '#14532d'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.stroke()
  }
  ctx.restore()
}
function drawMonster(ctx: CanvasRenderingContext2D, gs: MonsterGS) {
  const bg = ctx.createLinearGradient(0, 0, 0, CH)
  bg.addColorStop(0, '#1a0035'); bg.addColorStop(1, '#2e0060')
  ctx.fillStyle = bg; ctx.fillRect(0, 0, CW, CH)
  for (let i = 0; i < 35; i++) { ctx.fillStyle = 'rgba(255,255,255,0.32)'; ctx.beginPath(); ctx.arc((i * 137.5) % CW, (i * 97.3) % CH, 0.7 + (i % 3) * 0.45, 0, Math.PI * 2); ctx.fill() }
  for (const c of gs.candies) {
    ctx.save(); ctx.globalAlpha = c.alpha
    const r = 26; const col = CANDY_COLS[c.letter.charCodeAt(0) % CANDY_COLS.length]
    const cg = ctx.createRadialGradient(c.x - r * 0.25, c.y - r * 0.28, 2, c.x, c.y, r)
    cg.addColorStop(0, col + 'ff'); cg.addColorStop(0.5, col); cg.addColorStop(1, col + 'cc')
    ctx.beginPath()
    const rr = 10; ctx.moveTo(c.x - r + rr, c.y - r); ctx.arcTo(c.x + r, c.y - r, c.x + r, c.y + r, rr); ctx.arcTo(c.x + r, c.y + r, c.x - r, c.y + r, rr); ctx.arcTo(c.x - r, c.y + r, c.x - r, c.y - r, rr); ctx.arcTo(c.x - r, c.y - r, c.x + r, c.y - r, rr); ctx.closePath()
    ctx.fillStyle = cg; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.28)'; ctx.lineWidth = 2; ctx.stroke()
    ctx.font = `bold 20px 'Courier New',monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillText(c.letter, c.x, c.y + 2)
    ctx.fillStyle = '#fff'; ctx.fillText(c.letter, c.x, c.y)
    ctx.restore()
  }
  drawParticles(ctx, gs.particles)
  drawMonsterFace(ctx, gs)
  if (gs.done) { drawConfetti(ctx, gs.confetti); ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0, CH / 2 - 62, CW, 124); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = 'bold 34px system-ui'; ctx.fillStyle = '#ffd93d'; ctx.shadowBlur = 20; ctx.shadowColor = '#ffd93d'; ctx.fillText('🎉 配对完成！', CW / 2, CH / 2); ctx.shadowBlur = 0 }
  ctx.fillStyle = 'rgba(0,0,0,0.48)'; ctx.fillRect(0, 0, CW, 86)
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.font = '13px system-ui'; ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.fillText('滑动移动小怪兽，吞下对应的小写字母', CW / 2, 18)
  ctx.font = `bold 32px 'Courier New',monospace`; ctx.fillStyle = '#ffd93d'
  ctx.shadowBlur = 10; ctx.shadowColor = '#ffd93d'
  ctx.fillText(`${ALL_PAIRS[gs.pairIdx][0]}  →  ${ALL_PAIRS[gs.pairIdx][1]}`, CW / 2, 56)
  ctx.shadowBlur = 0; ctx.textAlign = 'right'; ctx.font = '13px system-ui'; ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.fillText(`${gs.score}/13`, CW - 14, 56)
}

// ══════════════════════════════════════════════════════════════════════════
//  MODULE 3 — TRACING
// ══════════════════════════════════════════════════════════════════════════
const OX = 90, OY = 110, SW = 270, SH = 545
const NEONS = ['#ff2d78', '#00e5ff', '#39ff14', '#ff6b35', '#c77dff', '#ffd93d', '#4ecdc4']
const TRACE_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

const STROKES: Record<string, Pt[][]> = {
  A: [[{x:.5,y:.02},{x:.35,y:.38},{x:.18,y:.96}],[{x:.5,y:.02},{x:.65,y:.38},{x:.82,y:.96}],[{x:.24,y:.58},{x:.76,y:.58}]],
  B: [[{x:.28,y:.04},{x:.28,y:.96}],[{x:.28,y:.04},{x:.6,y:.05},{x:.74,y:.15},{x:.74,y:.43},{x:.6,y:.5},{x:.28,y:.5}],[{x:.28,y:.5},{x:.63,y:.51},{x:.8,y:.63},{x:.8,y:.84},{x:.63,y:.96},{x:.28,y:.96}]],
  C: [[{x:.78,y:.18},{x:.6,y:.04},{x:.38,y:.03},{x:.18,y:.15},{x:.08,y:.33},{x:.07,y:.5},{x:.08,y:.67},{x:.18,y:.85},{x:.38,y:.97},{x:.6,y:.96},{x:.78,y:.82}]],
  D: [[{x:.28,y:.04},{x:.28,y:.96}],[{x:.28,y:.04},{x:.58,y:.05},{x:.82,y:.22},{x:.87,y:.5},{x:.82,y:.78},{x:.58,y:.95},{x:.28,y:.96}]],
  E: [[{x:.28,y:.04},{x:.28,y:.96}],[{x:.28,y:.04},{x:.78,y:.04}],[{x:.28,y:.5},{x:.64,y:.5}],[{x:.28,y:.96},{x:.78,y:.96}]],
  F: [[{x:.28,y:.04},{x:.28,y:.96}],[{x:.28,y:.04},{x:.76,y:.04}],[{x:.28,y:.5},{x:.63,y:.5}]],
  G: [[{x:.78,y:.18},{x:.6,y:.04},{x:.38,y:.03},{x:.18,y:.15},{x:.08,y:.33},{x:.07,y:.5},{x:.08,y:.67},{x:.18,y:.85},{x:.38,y:.97},{x:.6,y:.96},{x:.78,y:.82},{x:.78,y:.52}],[{x:.78,y:.52},{x:.5,y:.52}]],
}

function scaleStrokes(letter: string): Pt[][] {
  return (STROKES[letter] ?? []).map(st => st.map(p => ({ x: OX + p.x * SW, y: OY + p.y * SH })))
}
interface TracingGS { letterIdx: number; strokeIdx: number; nodeIdx: number; drawing: boolean; curPath: Pt[]; donePaths: Pt[][]; doneColors: string[]; particles: Particle[]; confetti: Confetto[]; done: boolean }

function initTracing(letterIdx = 0): TracingGS {
  return { letterIdx, strokeIdx: 0, nodeIdx: 0, drawing: false, curPath: [], donePaths: [], doneColors: [], particles: [], confetti: [], done: false }
}
// Catmull-Rom spline → cubic béziers. Produces a genuinely smooth curve through
// every point instead of stiff straight segments, even with few/uneven samples.
function smoothPath(ctx: CanvasRenderingContext2D, pts: Pt[]) {
  if (pts.length < 2) return
  if (pts.length === 2) { ctx.moveTo(pts[0].x, pts[0].y); ctx.lineTo(pts[1].x, pts[1].y); return }
  ctx.moveTo(pts[0].x, pts[0].y)
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const cp1x = p1.x + (p2.x - p0.x) / 6, cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6, cp2y = p2.y - (p3.y - p1.y) / 6
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y)
  }
}

function drawTracing(ctx: CanvasRenderingContext2D, gs: TracingGS, ts: number) {
  const letter = TRACE_LETTERS[gs.letterIdx]; const strokes = scaleStrokes(letter)
  const bg = ctx.createLinearGradient(0, 0, 0, CH); bg.addColorStop(0, '#0f0c29'); bg.addColorStop(1, '#1e1b4b')
  ctx.fillStyle = bg; ctx.fillRect(0, 0, CW, CH)
  ctx.fillStyle = 'rgba(255,255,255,0.04)'
  for (let x = 0; x < CW; x += 28) for (let y = 0; y < CH; y += 28) ctx.fillRect(x, y, 1.5, 1.5)
  ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 1
  for (let y = OY; y <= OY + SH; y += SH / 4) { ctx.beginPath(); ctx.moveTo(OX - 18, y); ctx.lineTo(OX + SW + 18, y); ctx.stroke() }
  // Ghost guide — clearer so kids can see the path to trace
  ctx.strokeStyle = 'rgba(255,255,255,0.16)'; ctx.lineWidth = 40; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
  for (const st of strokes) { ctx.beginPath(); smoothPath(ctx, st); ctx.stroke() }
  // Dashed centerline hint over the ghost
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.28)'; ctx.lineWidth = 2; ctx.setLineDash([6, 10])
  for (const st of strokes) { ctx.beginPath(); smoothPath(ctx, st); ctx.stroke() }
  ctx.restore()
  // Done strokes
  gs.donePaths.forEach((path, i) => {
    if (path.length < 2) return
    const col = gs.doneColors[i] ?? NEONS[i % NEONS.length]
    ctx.shadowBlur = 18; ctx.shadowColor = col; ctx.strokeStyle = col; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    ctx.beginPath(); smoothPath(ctx, path); ctx.stroke(); ctx.shadowBlur = 0
  })
  // Current path
  if (gs.curPath.length > 1) {
    ctx.strokeStyle = '#bf5fff'; ctx.shadowBlur = 12; ctx.shadowColor = '#bf5fff'; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    ctx.beginPath(); smoothPath(ctx, gs.curPath); ctx.stroke(); ctx.shadowBlur = 0
  }
  // Waypoints
  if (!gs.done && gs.strokeIdx < strokes.length) {
    const st = strokes[gs.strokeIdx]; const ep = st[st.length - 1]
    ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = '#ff4757'; ctx.lineWidth = 2.5
    ctx.beginPath(); ctx.arc(ep.x, ep.y, 20, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]); ctx.restore()
    const sp = st[0]; const pulse = 1 + Math.sin(ts * 0.007) * 0.28
    ctx.globalAlpha = 0.25; ctx.fillStyle = '#00ff88'
    ctx.beginPath(); ctx.arc(sp.x, sp.y, 32 * pulse, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1
    ctx.fillStyle = '#00ff88'; ctx.shadowBlur = 16; ctx.shadowColor = '#00ff88'
    ctx.beginPath(); ctx.arc(sp.x, sp.y, 17, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0
    ctx.font = 'bold 13px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillStyle = '#000'; ctx.fillText(`${gs.strokeIdx + 1}`, sp.x, sp.y)
  }
  drawParticles(ctx, gs.particles)
  if (gs.done) {
    drawConfetti(ctx, gs.confetti)
    ctx.fillStyle = 'rgba(0,0,0,0.48)'; ctx.fillRect(0, CH / 2 - 58, CW, 116)
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.font = 'bold 34px system-ui'; ctx.fillStyle = '#ffd93d'; ctx.shadowBlur = 20; ctx.shadowColor = '#ffd93d'
    ctx.fillText(gs.letterIdx >= TRACE_LETTERS.length - 1 ? '🎉 全部完成！' : `✓ 字母 ${letter} 完成！`, CW / 2, CH / 2 - 8)
    ctx.shadowBlur = 0; if (gs.letterIdx < TRACE_LETTERS.length - 1) { ctx.font = '16px system-ui'; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillText(`下一个: ${TRACE_LETTERS[gs.letterIdx + 1]}`, CW / 2, CH / 2 + 32) }
  }
  // HUD
  ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0, 0, CW, 82)
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.font = '13px system-ui'; ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillText('从绿圈出发，描出字母', CW / 2, 18)
  ctx.font = `bold 44px 'Courier New',monospace`; ctx.fillStyle = '#ffd93d'; ctx.shadowBlur = 14; ctx.shadowColor = '#ffd93d'
  ctx.fillText(letter, CW / 2, 54); ctx.shadowBlur = 0
  const dBase = CW / 2 - (TRACE_LETTERS.length * 14) / 2
  TRACE_LETTERS.forEach((_, i) => {
    ctx.beginPath(); ctx.arc(dBase + i * 14 + 7, CH - 22, 5, 0, Math.PI * 2)
    ctx.fillStyle = i < gs.letterIdx ? '#ffd93d' : i === gs.letterIdx ? '#fff' : 'rgba(255,255,255,0.16)'; ctx.fill()
  })
}

// ══════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════
type AlgScreen = 'menu' | 'bubble' | 'monster' | 'trace'

interface Props { onExit: () => void; onComplete?: () => void }

export default function AlphabetGame({ onExit, onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [screen, setScreen] = useState<AlgScreen>('menu')
  const screenRef = useRef<AlgScreen>('menu')
  const bubbleRef = useRef<BubbleGS | null>(null)
  const monsterRef = useRef<MonsterGS | null>(null)
  const tracingRef = useRef<TracingGS | null>(null)
  const rafRef = useRef(0)
  const lastTsRef = useRef(0)
  const touchStartXRef = useRef(0)
  const touchStartYRef = useRef(0)
  // Stable ref so RAF loop doesn't restart when parent re-renders with new inline fn
  const onCompleteRef = useRef(onComplete)
  useEffect(() => { onCompleteRef.current = onComplete }, [onComplete])

  // Warm the neural-voice cache so the FIRST time a letter is spoken it already
  // uses the high-quality server voice instead of the robotic browser fallback.
  useEffect(() => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    preloadWords([...upper, 'Great job!', 'Amazing! You matched them all!'])
  }, [])

  const goScreen = useCallback((s: AlgScreen) => {
    screenRef.current = s; setScreen(s)
    if (s === 'bubble') { bubbleRef.current = initBubble(0); setTimeout(() => speak('Find the letter A'), 400) }
    if (s === 'monster') { monsterRef.current = initMonster(); setTimeout(() => speak('Find little a'), 400) }
    if (s === 'trace') { tracingRef.current = initTracing(0); setTimeout(() => speak('Trace the letter A'), 400) }
  }, [])

  // RAF loop — deps=[inGame] so the loop only restarts on menu↔game transitions,
  // NOT on every screen change within the game (bubble/monster/trace).
  // This prevents a parent re-render from cancelling the RAF permanently in production.
  const inGame = screen !== 'menu'
  useEffect(() => {
    if (!inGame) return
    const canvas = canvasRef.current!
    canvas.width = CW; canvas.height = CH
    const ctx = canvas.getContext('2d')!
    lastTsRef.current = performance.now()
    let alive = true

    function loop(ts: number) {
      if (!alive) return
      // 先调度下一帧，再绘制：即使本帧 update/draw 抛错，循环也不会被打死（避免黑屏/卡死）
      rafRef.current = requestAnimationFrame(loop)
      try {
        const dt = Math.min(48, ts - lastTsRef.current); lastTsRef.current = ts
        const spf = dt / (1000 / 60)
        const s = screenRef.current
        if (s === 'bubble' && bubbleRef.current) {
          const res = updateBubble(bubbleRef.current, dt, spf)
          drawBubble(ctx, bubbleRef.current, ts)
          if (res === 'advance') { const next = bubbleRef.current.level + 1; bubbleRef.current = initBubble(next); speak(`Level ${next + 1}! ${BUBBLE_LEVELS[next].name}`) }
          else if (res === 'complete') { onCompleteRef.current?.() }
        } else if (s === 'monster' && monsterRef.current) {
          updateMonster(monsterRef.current, dt, spf); drawMonster(ctx, monsterRef.current)
        } else if (s === 'trace' && tracingRef.current) {
          tickParticles(tracingRef.current.particles, spf, 0.08)
          if (tracingRef.current.done) tickConfetti(tracingRef.current.confetti, spf)
          drawTracing(ctx, tracingRef.current, ts)
        }
      } catch (e) {
        console.error('[AlphabetGame] loop error', e)
      }
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => { alive = false; cancelAnimationFrame(rafRef.current) }
  }, [inGame])

  // Bubble tap
  useEffect(() => {
    if (screen !== 'bubble') return
    const canvas = canvasRef.current!
    let lastTouchT = 0  // dedupe: ignore the click that follows a touchend
    function tap(e: TouchEvent | MouseEvent) {
      e.preventDefault()
      const now = performance.now()
      if (e instanceof TouchEvent) lastTouchT = now
      else if (now - lastTouchT < 600) return  // synthesized click after touch — skip
      // Map client → canvas coords with INDEPENDENT x/y scale (canvas is stretched to fill,
      // so its display aspect ratio differs from the 450×800 buffer).
      const rect = canvas.getBoundingClientRect()
      const scX = CW / rect.width, scY = CH / rect.height
      const clientX = e instanceof TouchEvent ? e.changedTouches[0].clientX : e.clientX
      const clientY = e instanceof TouchEvent ? e.changedTouches[0].clientY : e.clientY
      const cx = (clientX - rect.left) * scX
      const cy = (clientY - rect.top) * scY
      const gs = bubbleRef.current; if (!gs || gs.done) return
      // Pick the CLOSEST bubble within a forgiving radius (fat-finger tolerance).
      const TOL = 18
      let best = -1, bestD = Infinity
      for (let i = 0; i < gs.bubbles.length; i++) {
        const b = gs.bubbles[i]; if (b.popping) continue
        const d = Math.hypot(cx - b.x, cy - b.y)
        if (d < b.r + TOL && d < bestD) { bestD = d; best = i }
      }
      if (best < 0) return
      const b = gs.bubbles[best]
      if (b.letter === gs.target) {
        b.popping = true; burst(gs.particles, b.x, b.y, [B_COLS[b.ci][0], B_COLS[b.ci][1], '#fff', '#ffd93d'], 15); playPop(); speak(b.letter); gs.score++
        if (gs.score >= 10) { gs.done = true; gs.advT = 2700; playSuccess(); gs.confetti = makeConfetti(); speak('Great job!') }
        else { const others = BUBBLE_LEVELS[gs.level].letters.filter(l => l !== gs.target); gs.target = others[Math.floor(Math.random() * others.length)]; setTimeout(() => speak(gs.target), 900) }
      } else { b.wiggle = 28; playWrong(); speak(`That is ${b.letter}. Find ${gs.target}.`) }
    }
    canvas.addEventListener('touchend', tap as EventListener, { passive: false })
    canvas.addEventListener('click', tap as EventListener)
    return () => { canvas.removeEventListener('touchend', tap as EventListener); canvas.removeEventListener('click', tap as EventListener) }
  }, [screen])

  // Monster drag
  useEffect(() => {
    if (screen !== 'monster') return
    const canvas = canvasRef.current!
    const MY_MIN = 260, MY_MAX = CH - 30
    const onTS = (e: TouchEvent) => { e.preventDefault(); touchStartXRef.current = e.touches[0].clientX; touchStartYRef.current = e.touches[0].clientY }
    const onTM = (e: TouchEvent) => {
      e.preventDefault()
      const dx = e.touches[0].clientX - touchStartXRef.current; touchStartXRef.current = e.touches[0].clientX
      const dy = e.touches[0].clientY - touchStartYRef.current; touchStartYRef.current = e.touches[0].clientY
      const gs = monsterRef.current; if (!gs) return
      const r = canvas.getBoundingClientRect(); const scX = CW / r.width; const scY = CH / r.height
      gs.mx = Math.max(MX_R, Math.min(CW - MX_R, gs.mx + dx * scX))
      gs.my = Math.max(MY_MIN, Math.min(MY_MAX, gs.my + dy * scY))
    }
    const onMD = (e: MouseEvent) => { touchStartXRef.current = e.clientX; touchStartYRef.current = e.clientY }
    const onMM = (e: MouseEvent) => {
      if (!(e.buttons & 1)) return
      const dx = e.clientX - touchStartXRef.current; touchStartXRef.current = e.clientX
      const dy = e.clientY - touchStartYRef.current; touchStartYRef.current = e.clientY
      const gs = monsterRef.current; if (!gs) return
      const r = canvas.getBoundingClientRect(); const scX = CW / r.width; const scY = CH / r.height
      gs.mx = Math.max(MX_R, Math.min(CW - MX_R, gs.mx + dx * scX))
      gs.my = Math.max(MY_MIN, Math.min(MY_MAX, gs.my + dy * scY))
    }
    canvas.addEventListener('touchstart', onTS, { passive: false }); canvas.addEventListener('touchmove', onTM, { passive: false })
    canvas.addEventListener('mousedown', onMD); canvas.addEventListener('mousemove', onMM)
    return () => { canvas.removeEventListener('touchstart', onTS); canvas.removeEventListener('touchmove', onTM); canvas.removeEventListener('mousedown', onMD); canvas.removeEventListener('mousemove', onMM) }
  }, [screen])

  // Tracing touch + mouse
  useEffect(() => {
    if (screen !== 'trace') return
    const canvas = canvasRef.current!
    // Independent x/y scale — canvas buffer (450×800) is stretched to fill its box.
    function cvPos(clientX: number, clientY: number): Pt {
      const r = canvas.getBoundingClientRect()
      const scX = CW / r.width, scY = CH / r.height
      return { x: (clientX - r.left) * scX, y: (clientY - r.top) * scY }
    }
    const START_TOL = 54   // forgiving start zone
    const NODE_TOL = 52    // forgiving node-advance zone
    function finishStroke(gs: TracingGS, strokes: Pt[][]) {
      const col = NEONS[gs.strokeIdx % NEONS.length]
      gs.donePaths.push([...gs.curPath]); gs.doneColors.push(col); gs.curPath = []; gs.drawing = false; gs.strokeIdx++; gs.nodeIdx = 0
      burst(gs.particles, CW / 2, CH / 2, [col, '#fff', '#ffd93d'], 12); playStroke()
      if (gs.strokeIdx >= strokes.length) {
        gs.done = true; playSuccess(); gs.confetti = makeConfetti(); speak(TRACE_LETTERS[gs.letterIdx])
        setTimeout(() => {
          if (!tracingRef.current) return
          const ni = tracingRef.current.letterIdx + 1
          if (ni < TRACE_LETTERS.length) { tracingRef.current = initTracing(ni); speak('Now trace ' + TRACE_LETTERS[ni]) }
          else { onCompleteRef.current?.(); speak('Amazing! You finished all the letters!') }
        }, 2300)
      }
    }
    function startTrace(pos: Pt) {
      const gs = tracingRef.current; if (!gs || gs.done) return
      const strokes = scaleStrokes(TRACE_LETTERS[gs.letterIdx]); if (gs.strokeIdx >= strokes.length) return
      const sp = strokes[gs.strokeIdx][0]
      if (Math.hypot(pos.x - sp.x, pos.y - sp.y) < START_TOL) { gs.drawing = true; gs.curPath = [pos]; gs.nodeIdx = 1 }
    }
    function moveTrace(pos: Pt) {
      const gs = tracingRef.current; if (!gs || !gs.drawing || gs.done) return
      gs.curPath.push(pos)
      const strokes = scaleStrokes(TRACE_LETTERS[gs.letterIdx]); const st = strokes[gs.strokeIdx]; if (!st || gs.nodeIdx >= st.length) return
      // Greedily advance through every upcoming node we are now close to, so quick
      // strokes that skip past several nodes still register instead of stalling.
      while (gs.nodeIdx < st.length && Math.hypot(pos.x - st[gs.nodeIdx].x, pos.y - st[gs.nodeIdx].y) < NODE_TOL) {
        gs.nodeIdx++
      }
      if (gs.nodeIdx >= st.length) finishStroke(gs, strokes)
    }
    function endTrace() { const gs = tracingRef.current; if (gs?.drawing) { gs.drawing = false; gs.curPath = []; gs.nodeIdx = 0 } }
    const onTS = (e: TouchEvent) => { e.preventDefault(); startTrace(cvPos(e.touches[0].clientX, e.touches[0].clientY)) }
    const onTM = (e: TouchEvent) => { e.preventDefault(); moveTrace(cvPos(e.touches[0].clientX, e.touches[0].clientY)) }
    const onTE = (e: TouchEvent) => { e.preventDefault(); endTrace() }
    const onMD = (e: MouseEvent) => startTrace(cvPos(e.clientX, e.clientY))
    const onMM = (e: MouseEvent) => { if (e.buttons & 1) moveTrace(cvPos(e.clientX, e.clientY)) }
    const onMU = () => endTrace()
    canvas.addEventListener('touchstart', onTS, { passive: false }); canvas.addEventListener('touchmove', onTM, { passive: false }); canvas.addEventListener('touchend', onTE, { passive: false })
    canvas.addEventListener('mousedown', onMD); canvas.addEventListener('mousemove', onMM); canvas.addEventListener('mouseup', onMU)
    return () => {
      canvas.removeEventListener('touchstart', onTS); canvas.removeEventListener('touchmove', onTM); canvas.removeEventListener('touchend', onTE)
      canvas.removeEventListener('mousedown', onMD); canvas.removeEventListener('mousemove', onMM); canvas.removeEventListener('mouseup', onMU)
    }
  }, [screen])

  if (screen === 'menu') {
    return (
      <div className="alg__menu">
        <div className="alg__menu-head">
          <button className="alg__back" onClick={onExit}>← 返回</button>
          <h2 className="alg__menu-title">26 字母乐园</h2>
        </div>
        <div className="alg__menu-cards">
          <button className="alg__mcard alg__mcard--1" onClick={() => goScreen('bubble')}>
            <span className="alg__mcard-icon">🫧</span>
            <div className="alg__mcard-info">
              <div className="alg__mcard-name">字母泡泡乐</div>
              <div className="alg__mcard-desc">听音辨形 · 点击正确字母气泡 · 4关共40分</div>
            </div>
            <span className="alg__mcard-arrow">▶</span>
          </button>
          <button className="alg__mcard alg__mcard--2" onClick={() => goScreen('monster')}>
            <span className="alg__mcard-icon">👾</span>
            <div className="alg__mcard-info">
              <div className="alg__mcard-name">贪吃小怪兽</div>
              <div className="alg__mcard-desc">大小写配对 · 滑动喂食怪兽 · 13对字母</div>
            </div>
            <span className="alg__mcard-arrow">▶</span>
          </button>
          <button className="alg__mcard alg__mcard--3" onClick={() => goScreen('trace')}>
            <span className="alg__mcard-icon">✍️</span>
            <div className="alg__mcard-info">
              <div className="alg__mcard-name">字母描红</div>
              <div className="alg__mcard-desc">笔画书写 · 按序描出 A–G · 按绿圈起笔</div>
            </div>
            <span className="alg__mcard-arrow">▶</span>
          </button>
        </div>
      </div>
    )
  }

  const titleMap: Record<AlgScreen, string> = { menu: '', bubble: '字母泡泡乐', monster: '贪吃小怪兽', trace: '字母描红' }
  return (
    <div className="alg__wrap">
      <div className="alg__bar">
        <button className="alg__bar-btn" onClick={() => goScreen('menu')}>← 菜单</button>
        <span className="alg__bar-title">{titleMap[screen]}</span>
        <button className="alg__bar-btn" onClick={onExit}>退出</button>
      </div>
      <canvas ref={canvasRef} className="alg__canvas" />
    </div>
  )
}
