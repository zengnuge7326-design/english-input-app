import { useCallback, useRef, useEffect, useState } from 'react'
import ttsAudioMap from '../data/ttsAudioMap.json'

function normalizeKey(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function resolveMappedAudio(text) {
  const key = normalizeKey(text)
  if (!key) return null
  const direct = ttsAudioMap?.[key]
  if (direct) return direct
  // Fallback for a single-token lookup if original has punctuation
  const parts = key.split(' ').filter(Boolean)
  if (parts.length === 1) return ttsAudioMap?.[parts[0]] || null
  return null
}

function normalizeAudioUrl(url) {
  if (!url || typeof url !== 'string') return null
  const value = url.trim()
  if (!value) return null
  if (/^https?:\/\//i.test(value) || value.startsWith('/')) return value
  return `/tts/${value.replace(/^\.?\//, '')}`
}

function playAudio(audioRef, url, volume) {
  if (!url) return false
  try {
    if (!audioRef.current) audioRef.current = new Audio()
    const audio = audioRef.current
    audio.pause()
    audio.currentTime = 0
    audio.src = url
    audio.volume = volume
    audio.play().catch(() => {})
    return true
  } catch {
    return false
  }
}

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
  const audioRef = useRef(null)
  const [voicesReady, setVoicesReady] = useState(false)

  useEffect(() => {
    if (!window.speechSynthesis) return
    const update = () => setVoicesReady(true)
    window.speechSynthesis.addEventListener?.('voiceschanged', update)
    // Voices might already be loaded
    if (window.speechSynthesis.getVoices().length > 0) update()
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', update)
  }, [])

  const prefetch = useCallback((text) => {
    const cleanText = String(text || '').trim()
    if (!cleanText) return
    if (!window.nativeTTS?.prefetchHybrid) return
    const rate = settings.rate || 1.0
    const edgeVoice = settings.edgeVoice || 'en-US-AvaNeural'
    window.nativeTTS.prefetchHybrid({ text: cleanText, rate, voice: edgeVoice }).catch(() => {})
  }, [settings.rate, settings.edgeVoice])

  const speak = useCallback((text) => {
    if (!text) return
    const cleanText = text.trim().split(/\s+/).length === 1 ? text.toLowerCase() : text
    const rate = settings.rate || 1.0
    const volume = Math.max(0, Math.min(1, settings.volume ?? 1))
    const engine = settings.ttsEngine || 'hybrid'
    const edgeVoice = settings.edgeVoice || 'en-US-AvaNeural'

    ;(async () => {
      const mappedAudio = resolveMappedAudio(cleanText)
      const mappedUrl = normalizeAudioUrl(mappedAudio)
      if (engine !== 'system' && mappedUrl) {
        if (window.nativeTTS?.resolveAssetUrl) {
          try {
            const resolved = await window.nativeTTS.resolveAssetUrl(mappedUrl)
            if (resolved && playAudio(audioRef, resolved, volume)) return
          } catch {
            // Continue to fallback layers.
          }
        } else if (playAudio(audioRef, mappedUrl, volume)) {
          return
        }
      }

      // In Electron: L2 Edge Neural + cache, then L3 system fallback
      if (window.nativeTTS && engine === 'hybrid' && window.nativeTTS.speakHybrid) {
        try {
          const result = await window.nativeTTS.speakHybrid({ text: cleanText, rate, voice: edgeVoice })
          if (result?.audioUrl) {
            playAudio(audioRef, result.audioUrl, volume)
            return
          }
          if (result?.layer === 'L3-system') return
          window.nativeTTS.speak(cleanText, rate)
          return
        } catch {
          window.nativeTTS.speak(cleanText, rate)
          return
        }
      }

      // In Electron: use macOS native say command
      if (window.nativeTTS) {
        window.nativeTTS.speak(cleanText, rate)
        return
      }

      // Web Speech API with best available voice
      const synth = window.speechSynthesis
      if (!synth) return

      // Chrome bug: speechSynthesis can get stuck in "speaking" state.
      // Cancelling and re-speaking fixes it.
      synth.cancel()

      const doSpeak = () => {
        const utterance = new SpeechSynthesisUtterance(cleanText)
        utterance.lang = settings.lang || 'en-US'
        utterance.rate = rate
        utterance.volume = volume
        const bestVoice = getBestEnglishVoice()
        if (bestVoice) utterance.voice = bestVoice
        utteranceRef.current = utterance
        synth.speak(utterance)
      }

      // If paused (can happen after page regain focus), resume first
      if (synth.paused) {
        synth.resume()
        setTimeout(doSpeak, 50)
      } else {
        doSpeak()
      }
    })()
  }, [settings.lang, settings.rate, settings.volume, settings.ttsEngine, settings.edgeVoice, voicesReady])

  const cancel = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    if (window.nativeTTS) {
      window.nativeTTS.cancel()
      return
    }
    window.speechSynthesis?.cancel()
  }, [])

  return { speak, cancel, prefetch }
}
