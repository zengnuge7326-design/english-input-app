/**
 * useMobileSfx — 手机端答题音效（Web Audio 合成，无资源文件）
 *
 * playCorrect / playWrong / playVictory
 * 与桌面 useSound 风格对齐：correct=上行双音，wrong=低频降音，victory=琶音
 */
import { useCallback, useRef } from 'react'

const SFX_KEY = 'mobile_sfx_enabled'

/** 读取音效开关（默认开） */
export function isMobileSfxEnabled(): boolean {
  try { return localStorage.getItem(SFX_KEY) !== '0' } catch { return true }
}

/** 设置音效开关 */
export function setMobileSfxEnabled(on: boolean) {
  try { localStorage.setItem(SFX_KEY, on ? '1' : '0') } catch { /* ignore */ }
}

function getCtx(ref: React.MutableRefObject<AudioContext | null>): AudioContext | null {
  if (!isMobileSfxEnabled()) return null
  try {
    if (!ref.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AC) return null
      ref.current = new AC()
    }
    if (ref.current.state === 'suspended') void ref.current.resume()
    return ref.current
  } catch {
    return null
  }
}

function tone(ctx: AudioContext, freq: number, start: number, dur: number, gain = 0.18, type: OscillatorType = 'sine') {
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  g.gain.setValueAtTime(0, ctx.currentTime + start)
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.015)
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur)
  osc.connect(g).connect(ctx.destination)
  osc.start(ctx.currentTime + start)
  osc.stop(ctx.currentTime + start + dur + 0.05)
}

function noiseBurst(ctx: AudioContext, start: number, dur: number, gain = 0.08) {
  const bufferSize = Math.floor(ctx.sampleRate * dur)
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
  const src = ctx.createBufferSource()
  src.buffer = buffer
  const g = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 800
  filter.Q.value = 0.6
  g.gain.setValueAtTime(gain, ctx.currentTime + start)
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur)
  src.connect(filter).connect(g).connect(ctx.destination)
  src.start(ctx.currentTime + start)
  src.stop(ctx.currentTime + start + dur + 0.05)
}

export function useMobileSfx() {
  const ctxRef = useRef<AudioContext | null>(null)

  const playCorrect = useCallback(() => {
    const ctx = getCtx(ctxRef)
    if (!ctx) return
    tone(ctx, 660, 0, 0.12, 0.16)
    tone(ctx, 880, 0.1, 0.18, 0.16)
  }, [])

  const playWrong = useCallback(() => {
    const ctx = getCtx(ctxRef)
    if (!ctx) return
    tone(ctx, 220, 0, 0.22, 0.14, 'triangle')
    tone(ctx, 165, 0.16, 0.3, 0.12, 'triangle')
  }, [])

  const playVictory = useCallback(() => {
    const ctx = getCtx(ctxRef)
    if (!ctx) return
    const seq = [523.25, 659.25, 783.99, 1046.5]
    seq.forEach((f, i) => tone(ctx, f, i * 0.12, 0.25, 0.15))
    tone(ctx, 1318.5, seq.length * 0.12, 0.45, 0.12)
  }, [])

  /** 发射激光 */
  const playShoot = useCallback(() => {
    const ctx = getCtx(ctxRef)
    if (!ctx) return
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.12)
    g.gain.setValueAtTime(0.08, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14)
    osc.connect(g).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.16)
  }, [])

  /** UFO 被击毁 */
  const playExplode = useCallback(() => {
    const ctx = getCtx(ctxRef)
    if (!ctx) return
    noiseBurst(ctx, 0, 0.35, 0.12)
    tone(ctx, 120, 0, 0.3, 0.14, 'sawtooth')
    tone(ctx, 80, 0.08, 0.4, 0.1, 'sawtooth')
  }, [])

  /** 飞船触底 */
  const playDamage = useCallback(() => {
    const ctx = getCtx(ctxRef)
    if (!ctx) return
    tone(ctx, 180, 0, 0.25, 0.16, 'sawtooth')
    tone(ctx, 90, 0.12, 0.35, 0.12, 'triangle')
  }, [])

  /** 字母键轻触 */
  const playTap = useCallback(() => {
    const ctx = getCtx(ctxRef)
    if (!ctx) return
    tone(ctx, 520, 0, 0.05, 0.06, 'sine')
  }, [])

  /** 连击里程碑 */
  const playCombo = useCallback(() => {
    const ctx = getCtx(ctxRef)
    if (!ctx) return
    tone(ctx, 784, 0, 0.08, 0.1)
    tone(ctx, 988, 0.06, 0.12, 0.1)
  }, [])

  return { playCorrect, playWrong, playVictory, playShoot, playExplode, playDamage, playTap, playCombo }
}
