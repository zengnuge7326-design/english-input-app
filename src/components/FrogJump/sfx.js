// 青蛙跳游戏的合成音效（Web Audio）

let _ctx = null
export function getCtx() {
  if (!_ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (Ctx) _ctx = new Ctx()
  }
  return _ctx
}

function tone(ctx, { freq = 600, type = 'sine', dur = 0.12, gain = 0.18, freqEnd = null, time = null }) {
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
  osc.start(t0); osc.stop(t0 + dur + 0.02)
}

function noise(ctx, { dur = 0.1, gain = 0.15, filterFreq = 600, filterType = 'lowpass' } = {}) {
  if (!ctx) return
  const buf = ctx.createBuffer(1, Math.max(1, ctx.sampleRate * dur), ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buf
  const f = ctx.createBiquadFilter()
  f.type = filterType
  f.frequency.value = filterFreq
  const g = ctx.createGain()
  g.gain.setValueAtTime(gain, ctx.currentTime)
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur)
  src.connect(f); f.connect(g); g.connect(ctx.destination)
  src.start(); src.stop(ctx.currentTime + dur)
}

// 「吨吨」声效 — 青蛙跳跃专用：两个连续的下行气泡音
export function sfxTonTon(ctx = getCtx()) {
  if (!ctx) return
  const t = ctx.currentTime
  // 第一声吨：高频快速下扫 + 短噪声
  tone(ctx, { freq: 700, freqEnd: 220, type: 'sine', dur: 0.09, gain: 0.22, time: t })
  noise(ctx, { dur: 0.05, gain: 0.06, filterFreq: 400 })
  // 第二声吨：稍低（间隔 110ms）
  tone(ctx, { freq: 600, freqEnd: 180, type: 'sine', dur: 0.10, gain: 0.20, time: t + 0.11 })
}

// 按对一个字母：清脆 ping
export function sfxKeyOk(ctx = getCtx()) {
  if (!ctx) return
  tone(ctx, { freq: 1500, freqEnd: 1800, type: 'sine', dur: 0.05, gain: 0.08 })
}

// 按错：低 buzz
export function sfxKeyBad(ctx = getCtx()) {
  if (!ctx) return
  tone(ctx, { freq: 180, freqEnd: 90, type: 'sawtooth', dur: 0.10, gain: 0.13 })
}

// 落到正确荷叶：啪叽水滴
export function sfxLand(ctx = getCtx()) {
  if (!ctx) return
  tone(ctx, { freq: 350, freqEnd: 800, type: 'sine', dur: 0.08, gain: 0.18 })
  noise(ctx, { dur: 0.08, gain: 0.12, filterFreq: 1200 })
}

// 掉水：噗通 + 气泡
export function sfxSplash(ctx = getCtx()) {
  if (!ctx) return
  const t = ctx.currentTime
  tone(ctx, { freq: 200, freqEnd: 50, type: 'sine', dur: 0.30, gain: 0.25, time: t })
  noise(ctx, { dur: 0.40, gain: 0.20, filterFreq: 600 })
  // 气泡冒泡
  for (let i = 0; i < 5; i++) {
    setTimeout(() => tone(ctx, {
      freq: 200 + Math.random() * 400, freqEnd: 600 + Math.random() * 300,
      type: 'sine', dur: 0.05, gain: 0.06
    }), 150 + i * 80)
  }
}

// 通关：欢快上升琶音 + 蛙鸣
export function sfxWin(ctx = getCtx()) {
  if (!ctx) return
  const t = ctx.currentTime
  ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
    tone(ctx, { freq: f, type: 'triangle', dur: 0.16, gain: 0.18, time: t + i * 0.08 })
  })
  // 蛙鸣 (低沉两声)
  setTimeout(() => tone(ctx, { freq: 220, freqEnd: 180, type: 'square', dur: 0.18, gain: 0.14 }), 400)
  setTimeout(() => tone(ctx, { freq: 200, freqEnd: 160, type: 'square', dur: 0.18, gain: 0.14 }), 600)
}

// 失败：下行 fanfare
export function sfxLose(ctx = getCtx()) {
  if (!ctx) return
  const t = ctx.currentTime
  ;[523.25, 392, 329.63, 261.63].forEach((f, i) => {
    tone(ctx, { freq: f, type: 'triangle', dur: 0.20, gain: 0.18, time: t + i * 0.12 })
  })
}

// 心数减少：心碎音
export function sfxHurt(ctx = getCtx()) {
  if (!ctx) return
  tone(ctx, { freq: 800, freqEnd: 300, type: 'square', dur: 0.20, gain: 0.18 })
}

// 钻石奖励：闪光 ding
export function sfxGem(ctx = getCtx()) {
  if (!ctx) return
  const t = ctx.currentTime
  tone(ctx, { freq: 1200, type: 'sine', dur: 0.08, gain: 0.10, time: t })
  tone(ctx, { freq: 1800, type: 'sine', dur: 0.10, gain: 0.08, time: t + 0.05 })
  tone(ctx, { freq: 2400, type: 'sine', dur: 0.12, gain: 0.06, time: t + 0.10 })
}
