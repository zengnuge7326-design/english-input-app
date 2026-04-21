import { FUNCTION_WORDS } from '../utils/wordInfo'

const cache = new Map()

export function useWordTranslate() {
  async function translate(word) {
    const key = word.toLowerCase()

    const funcWord = FUNCTION_WORDS[key]
    if (funcWord) {
      const text = typeof funcWord === 'string' ? funcWord : (funcWord.default || Object.values(funcWord)[0])
      return text
    }

    const cached = cache.get(key) ?? sessionStorage.getItem(`wt_${key}`)
    if (cached !== null && cached !== undefined) {
      if (!cache.has(key)) cache.set(key, cached)
      return cached || null
    }

    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|zh`,
        { signal: AbortSignal.timeout(3000) }
      )
      const json = await res.json()
      const result = json?.responseData?.translatedText || ''
      const clean = result && result.toLowerCase() !== key && !/[a-zA-Z]{4,}/.test(result)
        ? result : ''
      cache.set(key, clean)
      sessionStorage.setItem(`wt_${key}`, clean)
      return clean || null
    } catch {
      return null
    }
  }

  return { translate }
}
