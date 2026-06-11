/**
 * useMobileSfx — 手机端答题音效（Web Audio 合成，无资源文件）
 *
 * playCorrect / playWrong / playVictory
 * 与桌面 useSound 风格对齐：correct=上行双音，wrong=低频降音，victory=琶音
 */
import { useCallback, useRef } from 'react'

function getCtx(ref: React.MutableRefObject<AudioContext | null>): AudioContext | null {
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

  return { playCorrect, playWrong, playVictory }
}
