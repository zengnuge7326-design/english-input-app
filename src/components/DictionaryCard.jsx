import { useState, useEffect, useRef } from 'react'
import { analyzeSyntax } from '../utils/syntaxAnalysis'
import { GRAMMAR_LEARNING_UI_ENABLED } from '../config/grammarUi'

// Play a single word using the dictionaryapi.dev audio first, then TTS fallback
async function speakWord(word) {
  if (!word) return
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    if (res.ok) {
      const data = await res.json()
      const audioUrl = data[0]?.phonetics?.find(p => p.audio)?.audio
      if (audioUrl) {
        const url = audioUrl.startsWith('http') ? audioUrl : 'https:' + audioUrl
        const a = new Audio(url)
        a.play().catch(() => ttsFallback(word))
        return
      }
    }
  } catch { /* fall through */ }
  ttsFallback(word)
}

const TTS_API = 'https://okenglish.site/api/tts'

async function ttsFallback(word) {
  // Try server neural TTS first
  try {
    const url = `${TTS_API}?text=${encodeURIComponent(word)}&voice=en-US-AvaNeural`
    const a = new Audio(url)
    await a.play()
    return
  } catch { /* fall through */ }
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(word)
  u.lang = 'en-US'
  u.rate = 0.85
  window.speechSynthesis.speak(u)
}

const COLORS = [
  'border-blue-400 text-blue-300',
  'border-purple-400 text-purple-300',
  'border-green-400 text-green-300',
  'border-yellow-400 text-yellow-300',
  'border-pink-400 text-pink-300',
]

function parseTokens(en) {
  return (en.match(/[a-zA-Z']+[^a-zA-Z\s]*|\S/g) || []).map(token => {
    const word = token.match(/^[a-zA-Z']+/)?.[0] || ''
    const punct = token.slice(word.length)
    return { word: word.toLowerCase(), punct, raw: token }
  })
}

const phoneticCache = {}

async function fetchPhonetic(word, signal) {
  if (phoneticCache[word] !== undefined) return phoneticCache[word]
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, { signal })
    if (!res.ok) { phoneticCache[word] = ''; return '' }
    const data = await res.json()
    const result = data[0]?.phonetic || data[0]?.phonetics?.find(p => p.text)?.text || ''
    phoneticCache[word] = result
    return result
  } catch {
    return ''
  }
}

const wordInfoCache = {}

async function fetchWordInfo(word) {
  if (wordInfoCache[word] !== undefined) return wordInfoCache[word]
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      { signal: AbortSignal.timeout(8000) })
    if (!res.ok) { wordInfoCache[word] = null; return null }
    const data = await res.json()
    const entry = data[0]
    if (!entry) { wordInfoCache[word] = null; return null }
    const meanings = (entry.meanings || []).slice(0, 3).map(m => ({
      pos: m.partOfSpeech,
      defs: (m.definitions || []).slice(0, 2).map(d => ({
        def: d.definition,
        example: d.example || '',
      })),
    }))
    const result = { phonetic: entry.phonetic || entry.phonetics?.find(p => p.text)?.text || '', meanings }
    wordInfoCache[word] = result
    return result
  } catch {
    return null
  }
}

const POS_LABEL = {
  noun: '名词', verb: '动词', adjective: '形容词', adverb: '副词',
  pronoun: '代词', preposition: '介词', conjunction: '连词',
  interjection: '感叹词', article: '冠词', determiner: '限定词',
  numeral: '数词', exclamation: '感叹词',
}

function WordCard({ token, color }) {
  const [phonetic, setPhonetic] = useState(
    token.word && phoneticCache[token.word] !== undefined ? phoneticCache[token.word] : null
  )

  useEffect(() => {
    if (!token.word) return
    if (phoneticCache[token.word] !== undefined) {
      setPhonetic(phoneticCache[token.word])
      return
    }
    setPhonetic(null)
    const controller = new AbortController()
    fetchPhonetic(token.word, controller.signal).then(p => {
      if (!controller.signal.aborted) setPhonetic(p)
    })
    return () => controller.abort()
  }, [token.word])

  if (!token.word) return (
    <span className="text-white text-xl font-bold self-end pb-1">{token.punct}</span>
  )

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-gray-400 text-xs h-4 text-center">
        {phonetic === null ? '…' : phonetic}
      </div>
      <span className={`text-2xl font-bold border-b-2 pb-0.5 ${color}`}>
        {token.word}{token.punct}
      </span>
    </div>
  )
}

function MorphPanel({ sentence, onClose }) {
  const tokens = parseTokens(sentence.en).filter(t => t.word)
  const [selected, setSelected] = useState(null)
  const [info, setInfo] = useState({})
  const [loading, setLoading] = useState(false)

  async function loadWord(word) {
    if (selected === word) { setSelected(null); return }
    setSelected(word)
    if (info[word] !== undefined) return
    setLoading(true)
    const result = await fetchWordInfo(word)
    setInfo(prev => ({ ...prev, [word]: result }))
    setLoading(false)
  }

  const current = selected ? info[selected] : null

  return (
    <div className="fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 pb-2" onClick={onClose}>
      <div
        className="bg-slate-800 border border-gray-700 rounded-2xl p-5 w-full max-w-2xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-xs text-gray-500 mb-2 text-center">点击单词查看词法</div>
        <div className="flex flex-wrap gap-2 justify-center mb-3">
          {tokens.map((t, i) => (
            <button
              key={i}
              onClick={() => loadWord(t.word)}
              className={`px-2.5 py-1 rounded-lg text-sm font-mono border transition-colors ${
                selected === t.word
                  ? 'bg-blue-700 border-blue-500 text-white'
                  : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {t.word}
            </button>
          ))}
        </div>
        {selected && (
          <div className="bg-gray-800 rounded-xl p-3 text-sm">
            {loading ? (
              <div className="text-gray-500 text-center py-2">加载中…</div>
            ) : current === null ? (
              <div className="text-gray-500 text-center py-2">未找到词条</div>
            ) : current ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-300 font-bold text-base">{selected}</span>
                  {current.phonetic && <span className="text-gray-400 text-xs">{current.phonetic}</span>}
                </div>
                {current.meanings.map((m, mi) => (
                  <div key={mi} className="mb-2">
                    <span className="text-yellow-400 text-xs font-semibold mr-1">
                      {POS_LABEL[m.pos] || m.pos}
                    </span>
                    {m.defs.map((d, di) => (
                      <div key={di} className="ml-2">
                        <div className="text-gray-200">{d.def}</div>
                        {d.example && <div className="text-gray-500 text-xs italic mt-0.5">"{d.example}"</div>}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

export default function DictionaryCard({ sentence, onClose, grammarTopicMeta }) {
  const tokens = parseTokens(sentence.en)
  const [showMorph, setShowMorph] = useState(false)
  const [showSyntax, setShowSyntax] = useState(false)
  const syntaxInfo = analyzeSyntax(sentence.en)
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    const text = `此句语法：\n"${sentence.en}"`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  if (showMorph) {
    return <MorphPanel sentence={sentence} onClose={() => setShowMorph(false)} />
  }

  return (
    <div className="fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 pb-2" onClick={onClose}>
      <div
        className="bg-slate-800 border border-gray-700 rounded-2xl p-5 w-full max-w-2xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {GRAMMAR_LEARNING_UI_ENABLED && grammarTopicMeta && (
          <div className="mb-4 pb-3 border-b border-slate-700 text-left space-y-2">
            <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">本课语法</div>
            <div className="text-sm font-semibold text-white">
              {grammarTopicMeta.titleZh}
              {grammarTopicMeta.titleEn && (
                <span className="text-gray-500 font-normal text-xs ml-1.5">{grammarTopicMeta.titleEn}</span>
              )}
            </div>
            {grammarTopicMeta.grammarPurpose?.length > 0 && (
              <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4 leading-relaxed">
                {grammarTopicMeta.grammarPurpose.slice(0, 2).map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            )}
            {grammarTopicMeta.coreRules?.length > 0 && (
              <div>
                <div className="text-[10px] font-semibold text-amber-500/90 uppercase tracking-wider mb-0.5">核心规则</div>
                <ul className="text-xs text-gray-400 space-y-0.5 list-decimal pl-4">
                  {grammarTopicMeta.coreRules.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {/* Words row */}
        <div className="flex flex-wrap gap-x-6 gap-y-4 justify-center">
          {tokens.map((t, i) => (
            <WordCard key={i} token={t} color={COLORS[i % COLORS.length]} />
          ))}
        </div>

        {/* Bottom action row */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMorph(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              词法
            </button>
            <button
              onClick={() => {
                setShowSyntax(v => !v)
                setShowMorph(false)
              }}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                showSyntax ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              句法
            </button>
          </div>
          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              copied ? 'bg-green-800 text-green-300' : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {copied ? '已复制' : '复制'}
          </button>
        </div>

        {showSyntax && (
          <div className="mt-3 flex flex-col gap-2">
            {syntaxInfo.map((item, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-blue-400 text-xs font-bold shrink-0 mt-0.5 px-1.5 py-0.5 bg-blue-900/40 rounded">{item.label}</span>
                {item.desc && <span className="text-gray-300 text-sm">{item.desc}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
