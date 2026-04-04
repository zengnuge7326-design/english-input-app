import { useCallback } from 'react'

function getCtx() {
  if (!window._audioCtx) {
    window._audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    window._noiseBuffer = null // reset buffer when ctx is recreated
  }
  if (window._audioCtx.state === 'suspended') {
    window._audioCtx.resume()
  }
  return window._audioCtx
}

function getNoiseBuffer(ctx) {
  if (!window._noiseBuffer) {
    const len = ctx.sampleRate * 0.1
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buf.getChannelData(0)
    const fadeLen = Math.floor(ctx.sampleRate * 0.005) // 5ms fade
    for (let i = 0; i < len; i++) {
      let s = Math.random() * 2 - 1
      if (i < fadeLen) s *= i / fadeLen
      else if (i > len - fadeLen) s *= (len - i) / fadeLen
      data[i] = s
    }
    window._noiseBuffer = buf
  }
  return window._noiseBuffer
}

// ── Keypress sounds ──────────────────────────────────────────

function playBlackPBT(ctx) {
  const t = ctx.currentTime
  const noise = ctx.createBufferSource()
  noise.buffer = getNoiseBuffer(ctx)
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'; bp.frequency.value = 260; bp.Q.value = 1.8
  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'; hp.frequency.value = 120
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.55, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.065)
  noise.connect(bp); bp.connect(hp); hp.connect(gain); gain.connect(ctx.destination)
  noise.start(t); noise.stop(t + 0.07)
  // transient click
  const click = ctx.createBufferSource()
  click.buffer = getNoiseBuffer(ctx)
  const chp = ctx.createBiquadFilter()
  chp.type = 'highpass'; chp.frequency.value = 3000
  const cg = ctx.createGain()
  cg.gain.setValueAtTime(0.3, t)
  cg.gain.exponentialRampToValueAtTime(0.001, t + 0.008)
  click.connect(chp); chp.connect(cg); cg.connect(ctx.destination)
  click.start(t); click.stop(t + 0.01)
}

function playClicky(ctx) {
  const t = ctx.currentTime
  // Sharp click: high-freq noise burst
  const noise = ctx.createBufferSource()
  noise.buffer = getNoiseBuffer(ctx)
  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'; hp.frequency.value = 4000
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.5, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.018)
  noise.connect(hp); hp.connect(gain); gain.connect(ctx.destination)
  noise.start(t); noise.stop(t + 0.02)
  // Low body thud
  const osc = ctx.createOscillator()
  osc.type = 'sine'; osc.frequency.setValueAtTime(1200, t)
  osc.frequency.exponentialRampToValueAtTime(400, t + 0.015)
  const og = ctx.createGain()
  og.gain.setValueAtTime(0.25, t)
  og.gain.exponentialRampToValueAtTime(0.001, t + 0.02)
  osc.connect(og); og.connect(ctx.destination)
  osc.start(t); osc.stop(t + 0.02)
}

function playTypewriter(ctx) {
  const t = ctx.currentTime
  const noise = ctx.createBufferSource()
  noise.buffer = getNoiseBuffer(ctx)
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.8
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.6, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09)
  noise.connect(bp); bp.connect(gain); gain.connect(ctx.destination)
  noise.start(t); noise.stop(t + 0.1)
  // metallic ping
  const osc = ctx.createOscillator()
  osc.type = 'square'; osc.frequency.value = 1800
  const og = ctx.createGain()
  og.gain.setValueAtTime(0.12, t)
  og.gain.exponentialRampToValueAtTime(0.001, t + 0.04)
  osc.connect(og); og.connect(ctx.destination)
  osc.start(t); osc.stop(t + 0.04)
}

function playSoft(ctx) {
  const t = ctx.currentTime
  const noise = ctx.createBufferSource()
  noise.buffer = getNoiseBuffer(ctx)
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'; lp.frequency.value = 300
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.2, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035)
  noise.connect(lp); lp.connect(gain); gain.connect(ctx.destination)
  noise.start(t); noise.stop(t + 0.04)
}

// ── Feedback sounds ──────────────────────────────────────────

function playChime(ctx, isVictory) {
  const notes = isVictory ? [523, 659, 784, 1047] : [523, 659, 784]
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.type = 'sine'
    const t = ctx.currentTime + i * (isVictory ? 0.12 : 0.1)
    osc.frequency.setValueAtTime(freq, t)
    gain.gain.setValueAtTime(isVictory ? 0.3 : 0.25, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + (isVictory ? 0.3 : 0.2))
    osc.start(t); osc.stop(t + (isVictory ? 0.3 : 0.2))
  })
}

function playCoin(ctx, isVictory) {
  // Mario-style coin: square wave freq sweep up
  const sequences = isVictory
    ? [[988, 0], [1319, 0.08], [1568, 0.16], [2093, 0.26]]
    : [[988, 0], [1319, 0.07]]
  sequences.forEach(([freq, delay]) => {
    const osc = ctx.createOscillator()
    osc.type = 'square'
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    const t = ctx.currentTime + delay
    osc.frequency.setValueAtTime(freq, t)
    osc.frequency.exponentialRampToValueAtTime(freq * 1.3, t + 0.06)
    gain.gain.setValueAtTime(0.18, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
    osc.start(t); osc.stop(t + 0.09)
  })
}

function playPop(ctx, isVictory) {
  const count = isVictory ? 4 : 1
  for (let i = 0; i < count; i++) {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    const t = ctx.currentTime + i * 0.1
    const baseFreq = isVictory ? 600 + i * 120 : 700
    osc.frequency.setValueAtTime(baseFreq, t)
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.3, t + 0.06)
    gain.gain.setValueAtTime(0.35, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07)
    osc.start(t); osc.stop(t + 0.08)
  }
}

function playRetro(ctx, isVictory) {
  const notes = isVictory
    ? [262, 330, 392, 523, 659, 784]
    : [440, 554]
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    osc.type = 'square'
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    const t = ctx.currentTime + i * 0.07
    osc.frequency.setValueAtTime(freq, t)
    gain.gain.setValueAtTime(0.15, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06)
    osc.start(t); osc.stop(t + 0.07)
  })
}

function playFart(ctx, isVictory) {
  const count = isVictory ? 3 : 1
  for (let i = 0; i < count; i++) {
    const t = ctx.currentTime + i * 0.18
    const noise = ctx.createBufferSource()
    noise.buffer = getNoiseBuffer(ctx)
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.setValueAtTime(isVictory ? 180 - i * 20 : 160, t)
    bp.frequency.exponentialRampToValueAtTime(60, t + 0.15)
    bp.Q.value = 0.6
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.7, t)
    gain.gain.setValueAtTime(0.7, t + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18)
    noise.connect(bp); bp.connect(gain); gain.connect(ctx.destination)
    noise.start(t); noise.stop(t + 0.2)
  }
}

function playDrum(ctx, isVictory) {
  const hits = isVictory
    ? [[0, 120], [0.18, 100], [0.32, 90], [0.44, 80]]
    : [[0, 110]]
  hits.forEach(([delay, freq]) => {
    const t = ctx.currentTime + delay
    // Kick: sine sweep down
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq * 2.5, t)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.4, t + 0.08)
    const og = ctx.createGain()
    og.gain.setValueAtTime(0.9, t)
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
    osc.connect(og); og.connect(ctx.destination)
    osc.start(t); osc.stop(t + 0.13)
    // Transient snap
    const noise = ctx.createBufferSource()
    noise.buffer = getNoiseBuffer(ctx)
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'; hp.frequency.value = 1500
    const ng = ctx.createGain()
    ng.gain.setValueAtTime(0.4, t)
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.02)
    noise.connect(hp); hp.connect(ng); ng.connect(ctx.destination)
    noise.start(t); noise.stop(t + 0.025)
  })
}

function playCheer(ctx) {
  const t = ctx.currentTime
  // 上行琶音：C大调五声音阶，竖琴风格
  const harpNotes = [523, 659, 784, 988, 1175, 1319, 1568, 1976]
  harpNotes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    const gain = ctx.createGain()
    // 叠加一个泛音让音色更丰富
    const osc2 = ctx.createOscillator()
    osc2.type = 'triangle'
    osc2.frequency.value = freq * 2
    const gain2 = ctx.createGain()
    const start = t + i * 0.07
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(0.18, start + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.55)
    gain2.gain.setValueAtTime(0, start)
    gain2.gain.linearRampToValueAtTime(0.06, start + 0.015)
    gain2.gain.exponentialRampToValueAtTime(0.001, start + 0.35)
    osc.connect(gain); gain.connect(ctx.destination)
    osc2.connect(gain2); gain2.connect(ctx.destination)
    osc.start(start); osc.stop(start + 0.6)
    osc2.start(start); osc2.stop(start + 0.4)
  })
  // 结尾：一个清脆的高音铃
  const bell = ctx.createOscillator()
  bell.type = 'sine'
  bell.frequency.value = 2093
  const bellGain = ctx.createGain()
  const bs = t + harpNotes.length * 0.07 + 0.05
  bellGain.gain.setValueAtTime(0, bs)
  bellGain.gain.linearRampToValueAtTime(0.22, bs + 0.01)
  bellGain.gain.exponentialRampToValueAtTime(0.001, bs + 0.8)
  bell.connect(bellGain); bellGain.connect(ctx.destination)
  bell.start(bs); bell.stop(bs + 0.85)
}

function playBubblePop(ctx) {
  const t = ctx.currentTime
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(720, t)
  osc.frequency.exponentialRampToValueAtTime(180, t + 0.07)
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.13, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
  osc.connect(gain); gain.connect(ctx.destination)
  osc.start(t); osc.stop(t + 0.09)
}

export function useSound(settings) {
  const enabled = settings?.soundEnabled !== false
  const volume = settings?.volume ?? 1
  const keypressSound = settings?.keypressSound ?? 'black-pbt'
  const correctSound = settings?.correctSound ?? 'chime'
  const victorySound = settings?.victorySound ?? 'chime'
  const errorSound = settings?.errorSound ?? 'buzz'

  const playKeypress = useCallback(() => {
    if (!enabled || keypressSound === 'none') return
    try {
      const ctx = getCtx()
      if (keypressSound === 'black-pbt') playBlackPBT(ctx)
      else if (keypressSound === 'clicky') playClicky(ctx)
      else if (keypressSound === 'typewriter') playTypewriter(ctx)
      else if (keypressSound === 'soft') playSoft(ctx)
    } catch {}
  }, [enabled, keypressSound])

  const playError = useCallback(() => {
    if (!enabled || errorSound === 'none') return
    try {
      const ctx = getCtx()
      const t = ctx.currentTime
      if (errorSound === 'buzz') {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain); gain.connect(ctx.destination)
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(220, t)
        osc.frequency.exponentialRampToValueAtTime(110, t + 0.2)
        gain.gain.setValueAtTime(0.3, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25)
        osc.start(t); osc.stop(t + 0.25)
      }
      else if (errorSound === 'chime') playChime(ctx, false)
      else if (errorSound === 'coin') playCoin(ctx, false)
      else if (errorSound === 'pop') playPop(ctx, false)
      else if (errorSound === 'retro') playRetro(ctx, false)
      else if (errorSound === 'fart') playFart(ctx, false)
      else if (errorSound === 'drum') playDrum(ctx, false)
    } catch {}
  }, [enabled, errorSound])

  const playCorrect = useCallback(() => {
    if (!enabled || correctSound === 'none') return
    try {
      const ctx = getCtx()
      if (correctSound === 'chime') playChime(ctx, false)
      else if (correctSound === 'coin') playCoin(ctx, false)
      else if (correctSound === 'pop') playPop(ctx, false)
      else if (correctSound === 'retro') playRetro(ctx, false)
      else if (correctSound === 'fart') playFart(ctx, false)
      else if (correctSound === 'drum') playDrum(ctx, false)
    } catch {}
  }, [enabled, correctSound])

  const playVictory = useCallback(() => {
    if (!enabled || victorySound === 'none') return
    try {
      const ctx = getCtx()
      if (victorySound === 'chime') playChime(ctx, true)
      else if (victorySound === 'coin') playCoin(ctx, true)
      else if (victorySound === 'pop') playPop(ctx, true)
      else if (victorySound === 'retro') playRetro(ctx, true)
      else if (victorySound === 'fart') playFart(ctx, true)
      else if (victorySound === 'drum') playDrum(ctx, true)
    } catch {}
  }, [enabled, victorySound])

  const playBubble = useCallback(() => {
    if (!enabled) return
    try { playBubblePop(getCtx()) } catch {}
  }, [enabled])

  const playFireworks = useCallback(() => {
    if (settings?.fireworksSound === false) return
    try { playCheer(getCtx()) } catch {}
  }, [settings?.fireworksSound])

  return { playKeypress, playError, playCorrect, playVictory, playBubble, playFireworks }
}
