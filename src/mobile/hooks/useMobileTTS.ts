import { useCallback, useEffect } from 'react'
import { unlockAudio } from '../../utils/audioUnlock'
import { playWordAsync, playWordImmediate, preloadWords, stopWordAudio } from '../../utils/wordAudio.js'

export function useMobileTTS() {
  const speak = useCallback((text: string, rate = 0.92) => {
    if (!text?.trim()) return
    unlockAudio()
    playWordImmediate(text, { rate })
  }, [])

  const speakAndWait = useCallback((text: string, rate = 0.85): Promise<void> => {
    if (!text?.trim()) return Promise.resolve()
    unlockAudio()
    return playWordAsync(text, { rate })
  }, [])

  const prefetch = useCallback((texts: string[]) => {
    preloadWords(texts.filter(Boolean))
  }, [])

  const stop = useCallback(() => {
    stopWordAudio()
  }, [])

  useEffect(() => () => stop(), [stop])

  return { speak, speakAndWait, prefetch, stop }
}
