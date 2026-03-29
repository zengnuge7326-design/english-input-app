import { useState, useEffect } from 'react'

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

async function fetchPhonetic(word) {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    if (!res.ok) return ''
    const data = await res.json()
    return data[0]?.phonetic || data[0]?.phonetics?.find(p => p.text)?.text || ''
  } catch {
    return ''
  }
}

async function fetchWordInfo(word) {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    if (!res.ok) return null
    const data = await res.json()
    const entry = data[0]
    if (!entry) return null
    const meanings = (entry.meanings || []).slice(0, 3).map(m => ({
      pos: m.partOfSpeech,
      defs: (m.definitions || []).slice(0, 2).map(d => ({
        def: d.definition,
        example: d.example || '',
      })),
    }))
    return { phonetic: entry.phonetic || entry.phonetics?.find(p => p.text)?.text || '', meanings }
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
  const [phonetic, setPhonetic] = useState(null)

  useEffect(() => {
    if (!token.word) return
    setPhonetic(null)
    fetchPhonetic(token.word).then(setPhonetic)
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
        className="bg-gray-900 border border-gray-700 rounded-2xl p-5 w-full max-w-2xl shadow-2xl"
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

export default function DictionaryCard({ sentence, onClose }) {
  const tokens = parseTokens(sentence.en)
  const [showMorph, setShowMorph] = useState(false)
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
        className="bg-gray-900 border border-gray-700 rounded-2xl p-5 w-full max-w-2xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Words row */}
        <div className="flex flex-wrap gap-x-6 gap-y-4 justify-center">
          {tokens.map((t, i) => (
            <WordCard key={i} token={t} color={COLORS[i % COLORS.length]} />
          ))}
        </div>

        {/* Bottom action row */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
          <button
            onClick={() => setShowMorph(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            词法
          </button>
          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              copied ? 'bg-green-800 text-green-300' : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {copied ? '已复制' : '复制'}
          </button>
        </div>
      </div>
    </div>
  )
}
