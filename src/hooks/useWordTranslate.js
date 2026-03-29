const SKIP_WORDS = new Set([
  'a','an','the','is','are','was','were','be','been','being',
  'to','of','in','on','at','for','with','by','from','as','into',
  'and','or','but','so','yet','nor','if','not','no','do','does',
  'did','has','have','had','can','could','will','would','shall',
  'should','may','might','must','i','you','he','she','it','we',
  'they','me','him','her','us','them','my','your','his','its',
  'our','their','this','that','these','those','up','out','just',
])

const cache = new Map()

export function useWordTranslate() {
  async function translate(word) {
    const key = word.toLowerCase()
    if (SKIP_WORDS.has(key)) return null

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
      // mymemory sometimes returns the original word or garbage
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
