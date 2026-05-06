import { useState, useCallback, useEffect } from 'react'
import PHONICS_LESSONS from '../data/phonicsLessons.js'
import { unlockAudio } from '../utils/audioUnlock.js'
import { getWordPhonics, fetchWordPhonics, playWordAudio, levelLabel } from '../utils/phonicsAudio.js'

// ── Grapheme Button ────────────────────────────────────────────────────────────

const GBUTTON_COLORS = [
  { idle: 'bg-yellow-900/40 text-yellow-200 border-yellow-700/50 hover:bg-yellow-800/60', active: 'bg-yellow-400 text-black border-yellow-300 scale-110 shadow-lg shadow-yellow-400/30' },
  { idle: 'bg-teal-900/40   text-teal-200   border-teal-700/50   hover:bg-teal-800/60',   active: 'bg-teal-400   text-black border-teal-300   scale-110 shadow-lg shadow-teal-400/30'   },
  { idle: 'bg-pink-900/40   text-pink-200   border-pink-700/50   hover:bg-pink-800/60',   active: 'bg-pink-400   text-black border-pink-300   scale-110 shadow-lg shadow-pink-400/30'   },
  { idle: 'bg-emerald-900/40 text-emerald-200 border-emerald-700/50 hover:bg-emerald-800/60', active: 'bg-emerald-400 text-black border-emerald-300 scale-110 shadow-lg shadow-emerald-400/30' },
  { idle: 'bg-orange-900/40 text-orange-200 border-orange-700/50 hover:bg-orange-800/60', active: 'bg-orange-400 text-black border-orange-300 scale-110 shadow-lg shadow-orange-400/30' },
  { idle: 'bg-violet-900/40 text-violet-200 border-violet-700/50 hover:bg-violet-800/60', active: 'bg-violet-400 text-white border-violet-300 scale-110 shadow-lg shadow-violet-400/30' },
]

function GraphemeBtn({ g, colorIdx, active, onClick, size = 'lg' }) {
  const pal = GBUTTON_COLORS[colorIdx % GBUTTON_COLORS.length]
  const sz  = size === 'xl' ? 'text-5xl px-6 py-3.5 min-w-[4rem]'
            : size === 'lg' ? 'text-4xl px-5 py-3   min-w-[3.5rem]'
            :                 'text-2xl px-3 py-2   min-w-[2.5rem]'
  return (
    <button
      onClick={() => { unlockAudio(); onClick() }}
      className={`rounded-2xl border-2 font-bold font-mono transition-all duration-150 active:scale-95 select-none
        ${sz} ${active ? pal.active : pal.idle}`}
    >
      {g}
    </button>
  )
}

// ── New Grapheme Introduction panel ───────────────────────────────────────────

function IntroPanel({ lesson, onDone }) {
  const [activeIdx, setActiveIdx] = useState(null)

  function tap(idx) {
    setActiveIdx(idx)
    unlockAudio()
    // Find a decodable word that contains this grapheme and play it
    const g = lesson.newGraphemes[idx]
    const exampleWord = lesson.decodableWords.find(w => w.toLowerCase().includes(g.toLowerCase()))
      ?? lesson.decodableWords[0]
    if (exampleWord) playWordAudio(exampleWord)
    setTimeout(() => setActiveIdx(null), 600)
  }

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <div className="text-center">
        <div className="text-white font-bold text-xl mb-1">{lesson.title}</div>
        <div className="text-gray-400 text-sm">点击字母听单词发音</div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {lesson.newGraphemes.map((g, i) => (
          <div key={g} className="flex flex-col items-center gap-1.5">
            <GraphemeBtn
              g={g}
              colorIdx={i}
              active={activeIdx === i}
              onClick={() => tap(i)}
              size="xl"
            />
            {lesson.phonemes[i] && (
              <div className="text-gray-300 text-lg font-mono tracking-tight leading-none">/{lesson.phonemes[i]}/</div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onDone}
        className="mt-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
      >
        开始练习 →
      </button>
    </div>
  )
}

// ── Word Tap Mode: tap chunks to highlight while full word audio plays ────────

function TapMode({ lesson, onDone }) {
  const [wordIdx, setWordIdx] = useState(0)
  const [activeChunk, setActiveChunk] = useState(null)
  const [phonicsInfo, setPhonicsInfo] = useState(null)
  const word = lesson.decodableWords[wordIdx]

  useEffect(() => {
    let alive = true
    fetchWordPhonics(word).then(info => { if (alive) setPhonicsInfo(info) })
    return () => { alive = false }
  }, [word])

  const chunks = phonicsInfo?.chunks ?? [word]
  const levelText = levelLabel(phonicsInfo?.level)

  // Clicking a chunk highlights it sequentially across all chunks, then plays full word
  function tapChunk(idx) {
    unlockAudio()
    // Highlight each chunk in sequence, then the tapped one stays lit while word plays
    chunks.forEach((_, ci) => {
      setTimeout(() => setActiveChunk(ci), ci * 160)
    })
    const totalHighlight = chunks.length * 160
    setTimeout(() => {
      playWordAudio(word)
    }, totalHighlight)
    setTimeout(() => setActiveChunk(null), totalHighlight + 900)
  }

  // Clicking the IPA / word area also plays the full word
  const speakWord = useCallback(() => {
    unlockAudio()
    playWordAudio(word)
  }, [word])

  function nextWord() {
    if (wordIdx < lesson.decodableWords.length - 1) {
      setWordIdx(i => i + 1)
      setActiveChunk(null)
    } else {
      onDone()
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <div className="text-gray-400 text-sm">
        {wordIdx + 1} / {lesson.decodableWords.length} — 点击拼读块听整词发音
      </div>

      {/* Grapheme chunks — clicking plays full word with sequential highlight */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {chunks.map((chunk, i) => (
          <GraphemeBtn
            key={`${word}-${chunk}-${i}`}
            g={chunk}
            colorIdx={i}
            active={activeChunk === i}
            onClick={() => tapChunk(i)}
            size="xl"
          />
        ))}
      </div>

      {/* IPA row — display only */}
      {phonicsInfo?.rule && (
        <div
          className="text-gray-300 text-xl font-mono tracking-tight"
        >
          {chunks.map((c, i) => (
            <span key={i}>
              {i > 0 && <span className="text-gray-500 mx-[1px]">·</span>}
              <span className={activeChunk === i ? 'text-yellow-300' : ''}>{c}</span>
            </span>
          ))}
          {levelText && <span className="ml-2 text-xs text-gray-600">({levelText})</span>}
        </div>
      )}

      <button
        onClick={nextWord}
        className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
      >
        {wordIdx < lesson.decodableWords.length - 1 ? '下一个词 →' : '完成 ✓'}
      </button>
    </div>
  )
}

// ── Blend Mode: chunks revealed one at a time, word audio plays throughout ────

function BlendMode({ lesson, onDone }) {
  const [cardIdx, setCardIdx] = useState(0)
  const [revealed, setRevealed] = useState(0)
  const [blending, setBlending] = useState(false)
  const [activeChunk, setActiveChunk] = useState(null)
  const [cardPhonics, setCardPhonics] = useState(null)
  const card = lesson.blendingCards[cardIdx]

  useEffect(() => {
    if (!card?.word) return
    let alive = true
    fetchWordPhonics(card.word).then(info => { if (alive) setCardPhonics(info) })
    return () => { alive = false }
  }, [card?.word])

  const displayChunks = cardPhonics?.chunks ?? card?.chunks ?? [card?.word]

  function nextChunk() {
    unlockAudio()
    if (revealed < displayChunks.length) {
      const newRev = revealed + 1
      setRevealed(newRev)
      // Highlight the newly revealed chunk while playing the full word
      const ci = newRev - 1
      setActiveChunk(ci)
      playWordAudio(card.word, 0.8)
      setTimeout(() => setActiveChunk(null), 900)
    } else {
      // All chunks shown — blend: highlight all sequentially then play word
      setBlending(true)
      displayChunks.forEach((_, ci) => {
        setTimeout(() => setActiveChunk(ci), ci * 160)
      })
      const totalHighlight = displayChunks.length * 160
      setTimeout(() => {
        playWordAudio(card.word, 0.75)
        setActiveChunk(null)
        setTimeout(() => setBlending(false), 1200)
      }, totalHighlight + 100)
    }
  }

  function nextCard() {
    if (cardIdx < lesson.blendingCards.length - 1) {
      setCardIdx(i => i + 1)
      setRevealed(0)
      setBlending(false)
      setActiveChunk(null)
    } else {
      onDone()
    }
  }

  const allRevealed = revealed >= displayChunks.length

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="text-gray-400 text-sm">
        {cardIdx + 1} / {lesson.blendingCards.length} — 逐步拼读
      </div>

      {/* Chunk display */}
      <div className="flex items-center gap-3 min-h-[80px]">
        {displayChunks.map((chunk, i) => {
          const isShown = i < revealed
          const colorIdx = i
          return (
            <div key={i} className={`transition-all duration-300 ${isShown ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              {isShown && Array.from(chunk).map((letter, ti) => (
                <span
                  key={ti}
                  className={`text-5xl font-bold font-mono transition-all duration-150 ${activeChunk === i ? 'scale-110' : ''}`}
                  style={{ color: activeChunk === i
                    ? '#fff'
                    : ['#fbbf24','#2dd4bf','#f472b6','#34d399','#fb923c','#a78bfa'][colorIdx % 6] }}
                >
                  {letter}
                </span>
              ))}
            </div>
          )
        })}
        {allRevealed && !blending && (
          <div className="text-gray-500 text-2xl">·</div>
        )}
        {allRevealed && (
          <button
            onClick={() => { unlockAudio(); playWordAudio(card.word, 0.75) }}
            className={`text-5xl font-bold text-white transition-all duration-300 hover:text-blue-300 ${blending ? 'scale-110 text-blue-300' : ''}`}
          >
            {card.word}
          </button>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={nextChunk}
          disabled={blending}
          className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-600 disabled:opacity-50 text-white font-semibold transition-colors"
        >
          {!allRevealed ? '▶ 下一个音' : blending ? '拼读中…' : '🔊 合并'}
        </button>
        {allRevealed && !blending && (
          <button
            onClick={nextCard}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
          >
            {cardIdx < lesson.blendingCards.length - 1 ? '下一词 →' : '完成 ✓'}
          </button>
        )}
      </div>
    </div>
  )
}

// ── Heart Words panel ─────────────────────────────────────────────────────────

function HeartWordPanel({ lesson, onDone }) {
  const [flipped, setFlipped] = useState({})

  function speakWord(w) {
    unlockAudio()
    playWordAudio(w)
    setFlipped(f => ({ ...f, [w]: true }))
  }

  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <div className="text-center">
        <div className="text-white font-bold text-lg">❤️ 心形词（不规则词）</div>
        <div className="text-gray-400 text-sm mt-1">这些词需要记忆，点击听读音</div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {lesson.heartWords.map(w => (
          <button
            key={w}
            onClick={() => speakWord(w)}
            className={`px-6 py-4 rounded-2xl border-2 text-3xl font-bold transition-all active:scale-95
              ${flipped[w]
                ? 'bg-red-900/40 border-red-500 text-red-200'
                : 'bg-gray-800 border-gray-600 text-gray-200 hover:border-red-500/60'}`}
          >
            {w}
            {flipped[w] && <div className="text-xs text-red-400 font-normal mt-1">❤️ 心形词</div>}
          </button>
        ))}
      </div>

      <div className="bg-slate-800 border border-gray-700 rounded-xl px-6 py-4 text-center max-w-sm">
        <div className="text-gray-400 text-xs mb-2">句子练习</div>
        <div className="text-white text-lg font-medium">{lesson.sentence}</div>
        <button
          onClick={() => { unlockAudio(); const u = new SpeechSynthesisUtterance(lesson.sentence); u.lang='en-US'; u.rate=0.75; window.speechSynthesis?.cancel(); window.speechSynthesis?.speak(u) }}
          className="mt-3 px-4 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors"
        >
          🔊 听句子
        </button>
      </div>

      <button
        onClick={onDone}
        className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
      >
        完成本课 ✓
      </button>
    </div>
  )
}

// ── Lesson Selector ───────────────────────────────────────────────────────────

function LessonSelector({ onSelect }) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-white text-xl font-bold mb-4">自然拼读课程</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PHONICS_LESSONS.map(lesson => (
          <button
            key={lesson.id}
            onClick={() => onSelect(lesson)}
            className="bg-slate-800 border border-gray-700 hover:border-blue-500/60 rounded-2xl p-4 text-left transition-all active:scale-95"
          >
            <div className="text-blue-400 font-bold text-sm mb-2">第 {lesson.id} 课</div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {lesson.newGraphemes.map((g, i) => (
                <span
                  key={g}
                  className="px-2 py-0.5 rounded-lg text-sm font-mono font-bold"
                  style={{ background: ['#92400e','#134e4a','#831843','#064e3b','#7c2d12','#4c1d95'][i%6]+'80', color: ['#fbbf24','#2dd4bf','#f472b6','#34d399','#fb923c','#a78bfa'][i%6] }}
                >
                  {g}
                </span>
              ))}
            </div>
            <div className="text-gray-500 text-xs">{lesson.decodableWords.slice(0,3).join(', ')}…</div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Main PhonicsLesson component ──────────────────────────────────────────────

const MODES = [
  { id: 'intro',   label: '认识字母', emoji: '👀' },
  { id: 'tap',     label: '拼音点击', emoji: '👆' },
  { id: 'blend',   label: '拼读练习', emoji: '🔗' },
  { id: 'heart',   label: '心形词',   emoji: '❤️' },
]

export default function PhonicsLesson({ onSetBack }) {
  const [lesson, setLesson] = useState(null)
  const [mode, setMode]     = useState('intro')
  const [done, setDone]     = useState({})  // which modes completed

  useEffect(() => {
    if (!onSetBack) return
    if (lesson) {
      onSetBack(() => {
        setLesson(null)
        setMode('intro')
        setDone({})
      })
    } else {
      onSetBack(null)
    }
  }, [lesson, onSetBack])

  function selectLesson(l) {
    setLesson(l)
    setMode('intro')
    setDone({})
  }

  function completeMode(modeId) {
    setDone(d => ({ ...d, [modeId]: true }))
    // Auto-advance to next mode
    const idx = MODES.findIndex(m => m.id === modeId)
    if (idx < MODES.length - 1) {
      setMode(MODES[idx + 1].id)
    }
  }

  if (!lesson) {
    return <LessonSelector onSelect={selectLesson} />
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4">
      <div className="flex items-center justify-center mb-4">
        <div className="text-white font-bold text-sm text-center">{lesson.title}</div>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {MODES.map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0
              ${mode === m.id
                ? 'bg-blue-600 text-white'
                : done[m.id]
                  ? 'bg-green-900/40 text-green-400 border border-green-700/50'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          >
            <span>{m.emoji}</span>
            <span>{m.label}</span>
            {done[m.id] && <span>✓</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      {mode === 'intro' && (
        <IntroPanel lesson={lesson} onDone={() => completeMode('intro')} />
      )}
      {mode === 'tap' && (
        <TapMode lesson={lesson} onDone={() => completeMode('tap')} />
      )}
      {mode === 'blend' && (
        <BlendMode lesson={lesson} onDone={() => completeMode('blend')} />
      )}
      {mode === 'heart' && (
        <HeartWordPanel lesson={lesson} onDone={() => completeMode('heart')} />
      )}
    </div>
  )
}
