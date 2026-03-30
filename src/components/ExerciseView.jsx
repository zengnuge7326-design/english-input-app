import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import WordInput from './WordInput'
import DictionaryCard from './DictionaryCard'
import { useTTS } from '../hooks/useTTS'
import { useSound } from '../hooks/useSound'
import { buildUpChunks } from '../utils/splitSentence'

// Fuzzy match: score 0-1 based on content words
function calcMatch(targetSentence, spokenText) {
  const STOP = new Set(['a','an','the','of','to','in','on','at','is','are','was','were',
    'be','do','does','did','i','you','he','she','it','we','they','my','your','his',
    'her','our','this','that','and','but','or','so','for','as'])
  const norm = s => s.toLowerCase().replace(/[^a-z0-9\s]/g,'').trim()
  const targetWords = norm(targetSentence).split(/\s+/).filter(Boolean)
  const spokenWords  = norm(spokenText).split(/\s+/).filter(Boolean)
  const matched      = targetWords.filter(w => spokenWords.includes(w))
  const content      = targetWords.filter(w => !STOP.has(w))
  const matchedContent = content.filter(w => spokenWords.includes(w))
  const score = content.length >= 2
    ? matchedContent.length / content.length
    : matched.length / (targetWords.length || 1)
  return { score, targetWords, spokenWords, matched }
}

export default function ExerciseView({ sentences, progress, onMarkMastered, onMarkReview, onIncrementAttempts, settings, initialIndex = 0, onProgressChange, onNav, userId }) {
  const [index, setIndex] = useState(initialIndex)
  const [completed, setCompleted] = useState(false)
  const [key, setKey] = useState(0)

  // ---- speak gate (controlled by settings.requireSpeak only) ----
  const srSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  const gateEnabled = !!settings?.requireSpeak
  const [speakUnlocked, setSpeakUnlocked] = useState(!gateEnabled)
  const [isRecording, setIsRecording]     = useState(false)
  const [speakPhase, setSpeakPhase]       = useState('idle') // idle | recording | success | fail
  const [speakAttempts, setSpeakAttempts] = useState(0)
  const [recResult, setRecResult]         = useState('')
  const [recWords, setRecWords]           = useState({ target: [], spoken: [], matched: [] })
  const recognitionRef = useRef(null)

  const speakActive = gateEnabled && !speakUnlocked

  const [showCard, setShowCard]     = useState(false)
  const [showList, setShowList]     = useState(false)
  const [chunkIndex, setChunkIndex] = useState(0)
  const [splitMode, setSplitMode]   = useState(false)
  const { speak } = useTTS(settings)
  const { playError, playCorrect, playVictory, playKeypress, playBubble, playFireworks } = useSound(settings)
  const [currentWordIndex, setCurrentWordIndex] = useState({ idx: 0, total: 0 })
  const [completeBubbles, setCompleteBubbles]   = useState([])
  const [fwSparks, setFwSparks] = useState([])

  const FW_COLORS = ['#ff4d4d','#ffcc00','#4dff88','#4db8ff','#ff80ff','#ff9933','#fff','#c084fc']

  const chunks = useMemo(() => {
    const sentence = sentences[index]
    if (!sentence || !splitMode) return null
    const parts = buildUpChunks(sentence.en)
    return parts.length > 1 ? parts : null
  }, [index, sentences, splitMode])

  const activeSentence = useMemo(() => {
    const s = sentences[index]
    if (!s) return s
    if (chunks) return { ...s, en: chunks[chunkIndex] }
    return s
  }, [sentences, index, chunks, chunkIndex])

  // Reset speak gate on new sentence / retry / setting change
  useEffect(() => {
    setSpeakUnlocked(!gateEnabled)
    setIsRecording(false)
    setRecResult('')
    setSpeakAttempts(0)
    setSpeakPhase('idle')
    setRecWords({ target: [], spoken: [], matched: [] })
    if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null }
  }, [index, key, settings?.requireSpeak])

  // Auto-play on new sentence (no gate)
  useEffect(() => {
    const sentence = sentences[index]
    if (!sentence || gateEnabled || completed) return
    if (settings.sentenceSpeak) setTimeout(() => speak(sentence.en), 300)
  }, [index, key])

  // Auto-play when speak gate activates (so child hears sentence before reading)
  useEffect(() => {
    if (speakActive && sentence) {
      const textToSpeak = (splitMode && chunks) ? chunks[chunkIndex] : sentence.en
      setTimeout(() => speak(textToSpeak), 700)
    }
  }, [speakActive])

  useEffect(() => {
    onProgressChange?.(index, sentences.length)
  }, [index, sentences.length])

  useEffect(() => {
    onNav?.({
      prev: goPrev,
      next: goNext,
      retry: () => { setCompleted(false); setKey(k => k + 1) },
      mastered: () => onMarkMastered(sentence?.id),
      review: () => onMarkReview(sentence?.id),
      speak: () => speak(sentence?.en),
      toggleCard: () => setShowCard(v => !v),
      toggleList: () => setShowList(v => !v),
      toggleSplit: () => { setSplitMode(v => !v); setChunkIndex(0); setKey(k => k + 1) },
      splitMode,
      showList,
      attempts: progress[`sentence_${sentences[index]?.id}`]?.attempts || 0,
      status: progress[`sentence_${sentences[index]?.id}`]?.status || 'new',
      canPrev: index > 0,
      canNext: index < sentences.length - 1,
    })
  }, [index, sentences.length, completed, progress, splitMode, showCard, showList])

  const sentence = sentences[index]

  const goNext = useCallback(() => {
    setCompleted(false); setKey(k => k + 1); setChunkIndex(0)
    setIndex(i => Math.min(i + 1, sentences.length - 1))
  }, [sentences.length])

  const goPrev = useCallback(() => {
    setCompleted(false); setKey(k => k + 1); setChunkIndex(0)
    setIndex(i => Math.max(i - 1, 0))
  }, [])

  // Recording handler
  const handleRecordToggle = useCallback(() => {
    if (speakPhase === 'success') return
    if (isRecording && recognitionRef.current) { recognitionRef.current.stop(); return }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setSpeakPhase('fail')
      setRecResult('此浏览器不支持语音识别，请使用 Chrome')
      return
    }

    const rec = new SR()
    recognitionRef.current = rec
    rec.lang = 'en-US'
    rec.interimResults = false
    rec.maxAlternatives = 5

    rec.onstart = () => { setIsRecording(true); setSpeakPhase('recording'); setRecResult('') }
    rec.onend   = () => { setIsRecording(false); recognitionRef.current = null }
    rec.onerror = (e) => {
      setIsRecording(false)
      setSpeakPhase('fail')
      if (e.error === 'not-allowed') {
        setRecResult('请在浏览器地址栏允许麦克风权限后重试')
      } else if (e.error === 'network') {
        setRecResult('网络错误，语音识别需要联网')
      } else {
        setRecResult(`识别出错（${e.error}），请重试`)
      }
    }
    rec.onresult = (e) => {
      const alts = Array.from({ length: e.results[0].length }, (_, i) => e.results[0][i].transcript)
      const scored = alts.map(t => ({ t, ...calcMatch(sentence.en, t) })).sort((a, b) => b.score - a.score)
      const best = scored[0]
      if (best.score >= 0.6) {
        setSpeakPhase('success')
        setRecResult('')
        setRecWords({ target: [], spoken: [], matched: [] })
        playCorrect()
        setTimeout(() => setSpeakUnlocked(true), 1200)
      } else {
        setSpeakAttempts(n => n + 1)
        setSpeakPhase('fail')
        setRecWords({ target: best.targetWords, spoken: best.spokenWords, matched: best.matched })
        setRecResult(`听到："${best.t}"`)
      }
    }
    rec.start()
  }, [isRecording, speakPhase, sentence, playCorrect])

  // Spacebar → toggle recording (only when gate is blocking)
  useEffect(() => {
    if (!speakActive) return
    function onSpace(e) {
      if (e.key === ' ' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault(); handleRecordToggle()
      }
    }
    window.addEventListener('keydown', onSpace)
    return () => window.removeEventListener('keydown', onSpace)
  }, [speakActive, handleRecordToggle])

  const handleComplete = useCallback(() => {
    if (chunks && chunkIndex < chunks.length - 1) {
      setChunkIndex(i => i + 1); setKey(k => k + 1); return
    }
    setCompleted(true)
    onIncrementAttempts(sentence.id)
    playVictory()
    const W = window.innerWidth, H = window.innerHeight
    const sparks = [0, 0.15, 0.3, 0.45, 0.6, 0.75].flatMap((delay, bi) => {
      const cx = W * 0.2 + Math.random() * W * 0.6
      const cy = H * 0.1 + Math.random() * H * 0.3
      return Array.from({ length: 26 }, (_, i) => {
        const angle = (i / 26) * Math.PI * 2 + Math.random() * 0.3
        const dist = 80 + Math.random() * 150
        return { id: `${bi}-${i}-${Date.now()}`, cx, cy, fx: Math.cos(angle) * dist, fy: Math.sin(angle) * dist - 50, size: 4 + Math.random() * 5, color: FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)], duration: 0.6 + Math.random() * 0.5, delay }
      })
    })
    setFwSparks(sparks)
    setTimeout(() => setFwSparks([]), 1800)
    playFireworks()
    if (settings.autoSpeak && !splitMode) setTimeout(() => speak(sentence.en), 600)
  }, [sentence, chunks, chunkIndex, settings.autoSpeak, speak, onIncrementAttempts, playVictory, splitMode])

  const prevKeyRef = useRef(null)
  useEffect(() => {
    if (!splitMode || !chunks) return
    if (prevKeyRef.current === null) { prevKeyRef.current = key; return }
    prevKeyRef.current = key
    const chunk = chunks[chunkIndex]
    if (chunk) setTimeout(() => speak(chunk), 100)
  }, [chunkIndex, key])

  const isLastSentence = index === sentences.length - 1

  useEffect(() => {
    if (!completed) { setCompleteBubbles([]); return }
    const colors = ['#ff6b9d','#4ecdc4','#ffe66d','#a8e6cf','#ff8b94','#c7ceea','#ffd93d','#6bcb77','#74b9ff','#fd79a8','#55efc4','#fdcb6e']
    setCompleteBubbles(Array.from({length: 25}, (_, i) => ({
      id: i, glow: colors[i % colors.length],
      size: 18 + Math.random() * 28, left: 2 + Math.random() * 96,
      dx: (Math.random() - 0.5) * 120, duration: 1.4 + Math.random() * 1.0, delay: i * 0.04,
    })))
  }, [completed])

  useEffect(() => {
    if (!completed) return
    if (isLastSentence) return
    function handleNextKey(e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); goNext() }
    }
    window.addEventListener('keydown', handleNextKey)
    return () => window.removeEventListener('keydown', handleNextKey)
  }, [completed, goNext, isLastSentence])

  const speakWord = useCallback((word) => {
    if (splitMode) return
    if (settings.wordSpeak !== false) speak(word)
  }, [speak, settings.wordSpeak, splitMode])

  useEffect(() => {
    function handleKey(e) {
      if (e.target.tagName === 'INPUT') {
        if (e.key === 'ArrowRight' && e.ctrlKey) { goNext(); return }
        if (e.key === 'ArrowLeft'  && e.ctrlKey) { goPrev(); return }
      } else {
        if (e.key === 'ArrowRight') { goNext(); return }
        if (e.key === 'ArrowLeft')  { goPrev(); return }
      }
      if (e.ctrlKey && e.key === 'a') { e.preventDefault(); speak(sentence.en); return }
      if (e.ctrlKey && e.key === 'm') { e.preventDefault(); onMarkMastered(sentence.id); return }
      if (e.ctrlKey && e.key === 'q') { e.preventDefault(); onMarkReview(sentence.id); return }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [sentence, speak, goNext, goPrev, onMarkMastered, onMarkReview])

  if (!sentence) return <div className="text-gray-400 text-center mt-20">没有句子，请先导入数据。</div>

  const BUBBLES = [
    { left: '7%',  size: 10, duration: 9,  delay: 0 },
    { left: '18%', size: 18, duration: 13, delay: 2 },
    { left: '33%', size: 8,  duration: 7,  delay: 4.5 },
    { left: '50%', size: 22, duration: 15, delay: 1 },
    { left: '63%', size: 12, duration: 10, delay: 3 },
    { left: '76%', size: 16, duration: 11, delay: 6 },
    { left: '88%', size: 9,  duration: 8,  delay: 2 },
    { left: '94%', size: 20, duration: 14, delay: 7 },
  ]
  const FISH = [
    { top: '18%', fontSize: '1.6rem', duration: 20, delay: 0,  emoji: '🐠' },
    { top: '52%', fontSize: '1.2rem', duration: 28, delay: 9,  emoji: '🐟' },
    { top: '33%', fontSize: '1.8rem', duration: 24, delay: 16, emoji: '🐡' },
  ]
  const STARS = [
    { left: '5%',  top: '8%',  size: 1.5, duration: 2.8, delay: 0 },
    { left: '12%', top: '22%', size: 1,   duration: 3.5, delay: 0.7 },
    { left: '20%', top: '5%',  size: 2,   duration: 2.2, delay: 1.2 },
    { left: '28%', top: '15%', size: 1,   duration: 4.0, delay: 0.3 },
    { left: '38%', top: '9%',  size: 1.5, duration: 3.1, delay: 1.8 },
    { left: '47%', top: '3%',  size: 1,   duration: 2.6, delay: 0.5 },
    { left: '55%', top: '18%', size: 2,   duration: 3.8, delay: 1.0 },
    { left: '64%', top: '7%',  size: 1,   duration: 2.4, delay: 2.1 },
    { left: '72%', top: '13%', size: 1.5, duration: 3.3, delay: 0.9 },
    { left: '80%', top: '4%',  size: 1,   duration: 4.2, delay: 1.5 },
    { left: '88%', top: '20%', size: 2,   duration: 2.9, delay: 0.2 },
    { left: '93%', top: '10%', size: 1,   duration: 3.6, delay: 1.7 },
    { left: '15%', top: '40%', size: 1,   duration: 5.0, delay: 2.5 },
    { left: '42%', top: '35%', size: 1.5, duration: 4.5, delay: 1.3 },
    { left: '70%', top: '42%', size: 1,   duration: 3.9, delay: 0.6 },
    { left: '85%', top: '38%', size: 1.5, duration: 2.7, delay: 2.0 },
  ]

  const status   = progress[`sentence_${sentence.id}`]?.status || 'new'
  const attempts = progress[`sentence_${sentence.id}`]?.attempts || 0

  return (
    <>
      {/* Space decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{zIndex:1}}>
        <div className="milky-way" style={{ left: '-10%', top: '10%', width: '120%', height: '35%' }} />
        {STARS.map((s, i) => (
          <div key={i} className="star" style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s` }} />
        ))}
        {BUBBLES.map((b, i) => (
          <div key={i} className="ocean-bubble" style={{ left: b.left, bottom: '-5%', width: b.size, height: b.size, animationDuration: `${b.duration}s`, animationDelay: `${b.delay}s` }} />
        ))}
        {FISH.map((f, i) => (
          <div key={i} className="ocean-fish" style={{ top: f.top, animationDuration: `${f.duration}s`, animationDelay: `${f.delay}s` }}>
            <span style={{ display: 'inline-block', transform: 'scaleX(-1)', fontSize: f.fontSize }}>{f.emoji}</span>
          </div>
        ))}
      </div>

      {/* Completion bubbles */}
      {completeBubbles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{zIndex: 15}}>
          {completeBubbles.map(b => (
            <div key={b.id} className="color-bubble" style={{
              width: b.size, height: b.size,
              boxShadow: `0 0 10px ${b.glow}66, inset 0 0 8px ${b.glow}22`,
              left: `${b.left}%`, bottom: '100px',
              '--dx': `${b.dx}px`,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
            }} />
          ))}
        </div>
      )}

      {fwSparks.length > 0 && (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
          {fwSparks.map(s => (
            <div key={s.id} className="fw-spark" style={{ left: s.cx, top: s.cy, width: s.size, height: s.size, background: s.color, boxShadow: `0 0 6px ${s.color}`, '--fx': `${s.fx}px`, '--fy': `${s.fy}px`, animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s` }} />
          ))}
        </div>
      )}

      <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto px-4 relative" style={{zIndex:10}}>
        {showCard && <DictionaryCard sentence={sentence} onClose={() => setShowCard(false)} />}

        {/* Sentence list drawer */}
        {showList && (
          <div className="fixed inset-0 z-40 flex" onClick={() => setShowList(false)}>
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative ml-auto w-80 max-w-full h-full bg-gray-950 border-l border-gray-800 flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <span className="text-white text-sm font-semibold">本课句子 ({sentences.length})</span>
                <button onClick={() => setShowList(false)} className="text-gray-500 hover:text-white text-lg leading-none">✕</button>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                {sentences.map((s, i) => {
                  const st = progress[`sentence_${s.id}`]?.status || 'new'
                  const att = progress[`sentence_${s.id}`]?.attempts || 0
                  const isCurrent = i === index
                  return (
                    <button key={s.id}
                      onClick={() => { setIndex(i); setCompleted(false); setKey(k => k + 1); setChunkIndex(0); setShowList(false) }}
                      className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors border-b border-gray-800/50
                        ${isCurrent ? 'bg-blue-900/30' : 'hover:bg-gray-800/50'}`}
                    >
                      <span className={`shrink-0 text-xs font-mono mt-0.5 w-6 text-right ${isCurrent ? 'text-blue-400' : 'text-gray-600'}`}>#{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm leading-snug ${isCurrent ? 'text-white' : 'text-gray-300'}`}>{s.zh}</div>
                        <div className="text-xs text-gray-600 mt-0.5 truncate">{s.en}</div>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        {st === 'mastered' && <span className="text-xs text-green-500">✓</span>}
                        {st === 'review' && <span className="text-xs text-yellow-500">★</span>}
                        {att > 0 && <span className="text-xs text-gray-600">{att}次</span>}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Chinese sentence + TTS button */}
        <div className="flex items-start justify-center gap-3 mt-1">
          <button
            onClick={() => speak(sentence.en)}
            className="shrink-0 w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white border border-gray-700 transition-colors flex items-center justify-center mt-1"
            title="朗读整句 (Ctrl+A)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          </button>

          {/* Chinese text */}
          <div className="text-center">
            <div className="text-white leading-relaxed" style={{ fontFamily: '"Kaiti SC", "STKaiti", "KaiTi", serif', fontSize: '34px', letterSpacing: '0.18em', fontWeight: 'normal' }}>
              {sentence.zh}
            </div>
            {chunks && (
              <div className="flex gap-1.5 justify-center mt-2">
                {chunks.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i < chunkIndex ? 'bg-green-500' : i === chunkIndex ? 'bg-blue-400' : 'bg-gray-600'}`} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Speak gate — shown when settings.requireSpeak is on */}
        {speakActive && (
          <div className="flex flex-col items-center gap-4 py-6 w-full max-w-md mx-auto bg-gray-900/90 rounded-3xl border border-gray-800 shadow-2xl px-6">
            <div className="text-xs uppercase tracking-widest font-semibold">
              {speakPhase === 'success'   && <span className="text-green-400">✓ 朗读正确！</span>}
              {speakPhase === 'recording' && <span className="text-red-400 animate-pulse">🎤 录音中…</span>}
              {speakPhase === 'fail'      && <span className="text-yellow-400">再试一次{speakAttempts > 0 ? `（第 ${speakAttempts + 1} 次）` : ''}</span>}
              {speakPhase === 'idle'      && <span className="text-purple-400">请先朗读这句话</span>}
            </div>

            <div className="text-center min-h-8 px-2">
              {speakPhase === 'fail' && recWords.target.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
                  {recWords.target.map((w, i) => (
                    <span key={i} className={`font-mono text-sm font-bold ${recWords.matched.includes(w) ? 'text-green-400' : 'text-red-400/80'}`}>{w}</span>
                  ))}
                </div>
              ) : speakPhase === 'success' ? (
                <div className="text-green-400 font-mono text-sm">{splitMode && chunks ? chunks[chunkIndex] : sentence.en}</div>
              ) : (
                <div className="text-green-400 font-mono text-base font-semibold leading-relaxed">{splitMode && chunks ? chunks[chunkIndex] : sentence.en}</div>
              )}
            </div>

            <div className="relative flex items-center justify-center my-1">
              {isRecording && (
                <>
                  <div className="absolute w-20 h-20 rounded-full border-2 border-red-400/40 animate-ping" />
                  <div className="absolute w-28 h-28 rounded-full border border-red-400/20 animate-ping" style={{ animationDelay: '0.25s' }} />
                </>
              )}
              {speakPhase === 'success' && (
                <div className="absolute w-20 h-20 rounded-full border-2 border-green-400/40 animate-ping" />
              )}
              <button
                onClick={handleRecordToggle}
                disabled={speakPhase === 'success'}
                className={`relative w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-xl transition-all duration-300
                  ${speakPhase === 'success' ? 'bg-green-500 scale-90 cursor-default'
                    : isRecording ? 'bg-red-500 scale-110'
                    : 'bg-purple-600 hover:bg-purple-500 active:scale-95'}`}
              >
                {speakPhase === 'success' ? '✓' : '🎤'}
              </button>
            </div>

            <div className="text-center text-sm min-h-5">
              {speakPhase === 'idle'      && <span className="text-gray-400">点击或按 <kbd className="px-1.5 py-0.5 text-xs bg-gray-800 rounded border border-gray-700 font-mono">空格</kbd> 开始朗读</span>}
              {speakPhase === 'recording' && <span className="text-gray-300">再按 <kbd className="px-1.5 py-0.5 text-xs bg-gray-800 rounded border border-gray-700 font-mono">空格</kbd> 停止录音</span>}
              {speakPhase === 'success'   && <span className="text-green-400/80">正在切换到输入模式…</span>}
              {speakPhase === 'fail' && recResult && <span className="text-yellow-400/80 text-xs">{recResult}</span>}
            </div>

            <button
              onClick={() => setSpeakUnlocked(true)}
              className={`text-xs underline transition-colors ${speakAttempts >= 2 ? 'text-gray-400 hover:text-white' : 'text-gray-700 hover:text-gray-500'}`}
            >
              {speakAttempts >= 2 ? '跳过（已多次尝试）' : '跳过'}
            </button>
          </div>
        )}

        {/* Word input — hidden while gate is blocking */}
        <div className="w-full min-h-20" style={{ display: speakActive ? 'none' : undefined }}>
          <WordInput
            key={`${sentence.id}-${key}`}
            sentence={activeSentence}
            onComplete={handleComplete}
            speakWord={speakWord}
            learningLevel={settings.learningLevel || 2}
            showHintOnError={settings.showHintOnError !== false}
            hintTriggerCount={settings.hintTriggerCount || 1}
            errorRetryCount={settings.errorRetryCount || 2}
            onError={playError}
            onWordCorrect={playCorrect}
            onKeypress={playKeypress}
            onBubble={playBubble}
            onCurrentChange={(idx, total) => setCurrentWordIndex({ idx, total })}
            userId={userId}
          />
        </div>

        {/* Completion banner */}
        {completed && (
          <div className="pop w-full bg-green-900/50 border border-green-600 rounded-xl px-6 py-3 text-center">
            <div className="text-green-300 text-lg font-semibold">✓ {sentence.en}</div>
            {isLastSentence ? (
              <div className="text-green-500 text-sm mt-1">🎉 本课全部完成！</div>
            ) : (
              <div className="text-green-600 text-sm mt-1">按空格 / Enter 继续下一句</div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
