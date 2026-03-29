import { useCallback, useRef, useEffect, useState } from 'react'

// Find the best English voice available on the system
function getBestEnglishVoice() {
  const voices = window.speechSynthesis?.getVoices() || []
  // Prefer high-quality voices (macOS premium voices have "Premium" or "Enhanced" in name)
  const premium = voices.find(v => /en[-_](US|GB)/i.test(v.lang) && /premium|enhanced/i.test(v.name))
  if (premium) return premium
  // macOS good default voices
  const preferred = ['Samantha', 'Karen', 'Daniel', 'Moira', 'Tessa', 'Rishi']
  for (const name of preferred) {
    const v = voices.find(v => v.name === name)
    if (v) return v
  }
  // Any en-US or en-GB voice
  const enVoice = voices.find(v => /en[-_](US|GB)/i.test(v.lang))
  if (enVoice) return enVoice
  // Any English voice
  return voices.find(v => /en/i.test(v.lang)) || null
}

export function useTTS(settings) {
  const utteranceRef = useRef(null)
  const [voicesReady, setVoicesReady] = useState(false)

  useEffect(() => {
    if (!window.speechSynthesis) return
    const update = () => setVoicesReady(true)
    window.speechSynthesis.addEventListener?.('voiceschanged', update)
    // Voices might already be loaded
    if (window.speechSynthesis.getVoices().length > 0) update()
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', update)
  }, [])

  const speak = useCallback((text) => {
    const cleanText = text.trim().split(/\s+/).length === 1 ? text.toLowerCase() : text
    const rate = settings.rate || 1.0

    // In Electron: use macOS native say command
    if (window.nativeTTS) {
      window.nativeTTS.speak(cleanText, rate)
      return
    }

    // Web Speech API with best available voice
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = settings.lang || 'en-US'
    utterance.rate = rate
    const bestVoice = getBestEnglishVoice()
    if (bestVoice) utterance.voice = bestVoice
    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [settings.lang, settings.rate, voicesReady])

  const cancel = useCallback(() => {
    if (window.nativeTTS) {
      window.nativeTTS.cancel()
      return
    }
    window.speechSynthesis?.cancel()
  }, [])

  return { speak, cancel }
}
