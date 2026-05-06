/**
 * 指法练习专用键盘音：纯 Web Audio 合成，不加载 mp3，避免 fetch/解码竞态。
 * 需在用户点击「预设」后调用 resumeTypingAudio()，以满足浏览器自动播放策略。
 */

let ctx = null

export const TYPING_SOUND_PRESETS = [
  { id: 'mechanical', label: '机械轴', desc: '段落轴清脆声' },
  { id: 'bubble', label: '水滴', desc: '轻柔弹出感' },
  { id: 'retro', label: '8-bit', desc: '复古游戏音' },
]

export function resumeTypingAudio() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return ctx.resume()
}

function getCtx() {
  if (!ctx) return null
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

function noiseBurst(c, t0, durationMs, highPassHz, peakGain) {
  const len = Math.floor(c.sampleRate * (durationMs / 1000))
  const buf = c.createBuffer(1, len, c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) {
    const fade = Math.min(i, len - 1 - i) / (c.sampleRate * 0.003)
    const f = Number.isFinite(fade) && fade < 1 ? fade : 1
    d[i] = (Math.random() * 2 - 1) * f
  }
  const src = c.createBufferSource()
  src.buffer = buf
  const hp = c.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = highPassHz
  const g = c.createGain()
  g.gain.setValueAtTime(peakGain, t0)
  g.gain.exponentialRampToValueAtTime(0.001, t0 + durationMs / 1000)
  src.connect(hp)
  hp.connect(g)
  g.connect(c.destination)
  src.start(t0)
  src.stop(t0 + durationMs / 1000 + 0.02)
}

/** 预览当前预设（点击 chips 时调用） */
export function previewTypingSound(presetId) {
  playTypingKeySound(presetId, { wrong: false, keyType: 'char', gainMul: 1.15 })
}

/**
 * @param {'mechanical'|'bubble'|'retro'} presetId
 * @param {{ wrong?: boolean, keyType?: 'char'|'space'|'backspace', gainMul?: number }} opts
 */
export function playTypingKeySound(presetId, opts = {}) {
  const c = getCtx()
  if (!c) return

  const wrong = !!opts.wrong
  const keyType = opts.keyType || 'char'
  const gainMul = opts.gainMul ?? 1

  const t0 = c.currentTime
  const durMul = keyType === 'space' ? 1.25 : keyType === 'backspace' ? 0.65 : 1
  const pitchMul = wrong ? 0.82 : 1

  const out = c.createGain()
  out.gain.value = 0.85 * gainMul
  out.connect(c.destination)

  if (presetId === 'mechanical') {
    const ms = (18 + (keyType === 'space' ? 10 : 0)) * durMul
    noiseBurst(c, t0, ms, 4200, wrong ? 0.22 : 0.38)
    const osc = c.createOscillator()
    osc.type = 'sine'
    const f1 = 1350 * pitchMul * (keyType === 'backspace' ? 1.15 : 1)
    const f2 = 380 * pitchMul
    osc.frequency.setValueAtTime(f1, t0)
    osc.frequency.exponentialRampToValueAtTime(Math.max(80, f2), t0 + 0.022 * durMul)
    const g = c.createGain()
    g.gain.setValueAtTime(wrong ? 0.12 : 0.2, t0)
    g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.028 * durMul)
    osc.connect(g)
    g.connect(out)
    osc.start(t0)
    osc.stop(t0 + 0.035 * durMul)
    return
  }

  if (presetId === 'bubble') {
    const osc = c.createOscillator()
    osc.type = 'sine'
    const base = keyType === 'space' ? 340 : keyType === 'backspace' ? 620 : 480
    osc.frequency.setValueAtTime(base * pitchMul, t0)
    osc.frequency.exponentialRampToValueAtTime(base * 0.65 * pitchMul, t0 + 0.06 * durMul)
    const g = c.createGain()
    g.gain.setValueAtTime(wrong ? 0.12 : 0.22, t0)
    g.gain.exponentialRampToValueAtTime(0.001, t0 + (keyType === 'space' ? 0.1 : 0.075) * durMul)
    osc.connect(g)
    g.connect(out)
    osc.start(t0)
    osc.stop(t0 + 0.12 * durMul)
    return
  }

  // retro — 双短方波 blip，打字游戏常见
  const playBlip = (start, freq, lenMs, vol) => {
    const osc = c.createOscillator()
    osc.type = 'square'
    osc.frequency.setValueAtTime(freq * pitchMul, start)
    const g = c.createGain()
    g.gain.setValueAtTime(vol * (wrong ? 0.7 : 1), start)
    g.gain.exponentialRampToValueAtTime(0.001, start + lenMs / 1000)
    osc.connect(g)
    g.connect(out)
    osc.start(start)
    osc.stop(start + lenMs / 1000 + 0.01)
  }
  const v = wrong ? 0.06 : 0.09
  if (wrong) {
    playBlip(t0, 220, 55, v * 1.1)
    playBlip(t0 + 0.045, 233, 50, v * 0.85)
  } else {
    playBlip(t0, keyType === 'space' ? 440 : 523, keyType === 'backspace' ? 35 : 42, v)
    playBlip(t0 + (keyType === 'space' ? 0.055 : 0.04), keyType === 'space' ? 554 : 784, 35, v * 0.75)
  }
}
