import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { IconArrowLeft, IconArrowRight } from './Icons'
import ReadingAudioToolbar from './ReadingAudioToolbar'
import ReadingParagraphInput from './ReadingParagraphInput'
import WordInput from './WordInput'
import DictionaryCard from './DictionaryCard'
import GrammarLearningStrip from './GrammarLearningStrip'
import { GRAMMAR_LEARNING_UI_ENABLED } from '../config/grammarUi'
import { getGrammarTopicMeta } from '../data/grammar_tenses/grammarTopicMeta'
import { useTTS } from '../hooks/useTTS'
import { useSound } from '../hooks/useSound'
import { buildSplitChunksLevel } from '../utils/splitSentence'
import { ensureMic } from '../utils/micGate'

const API = 'https://okenglish.site/api'

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


export default function ExerciseView({ sentences, progress, onMarkMastered, onMarkReview, onIncrementAttempts, settings, onPatchSettings, initialIndex = 0, onProgressChange, onNav, userId, token, showChineseGuide = true, onToggleChineseGuide, hasNextLesson = false, onNextLesson, onBack, grammarContext = null, onSentenceDone, onWordDone, onXp, onCrystal }) {
  const readingMode = grammarContext?.source === 'gutenberg'
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

  const [showCard, setShowCard]         = useState(false)
  const [showList, setShowList]         = useState(false)
  const [chunkIndex, setChunkIndex]     = useState(0)
  const [splitLevel, setSplitLevel]     = useState(0) // 0=off, 1=初级, 2=中级, 3=高级
  const splitMode = splitLevel > 0
  const [chunkTranslations, setChunkTranslations] = useState([])
  const { speak, prefetch, cancel } = useTTS(settings)
  const { playError, playCorrect, playVictory, playKeypress, playBubble, playFireworks } = useSound(settings)
  const leadCount = Math.min(5, Math.max(1, Number(settings?.leadReadCount) || 1))
  const leadTimersRef = useRef([])
  const [readingTtsOn, setReadingTtsOn] = useState(false)
  useEffect(() => () => leadTimersRef.current.forEach(clearTimeout), [])

  const stopReadingTts = useCallback(() => {
    cancel()
    leadTimersRef.current.forEach(clearTimeout)
    leadTimersRef.current = []
    setReadingTtsOn(false)
  }, [cancel])

  /** 按全局 leadReadCount 领读整句（换句自动播放、手动点选次数均走此逻辑） */
  const runLeadRead = useCallback((text, count = leadCount) => {
    if (!text) return
    stopReadingTts()
    const n = Math.min(5, Math.max(1, Number(count) || 1))
    const rate = settings?.rate || 1.0
    const gap = Math.max(2000, Math.round((text.trim().split(/\s+/).length * 450 / rate) + 900))
    speak(text)
    for (let i = 1; i < n; i++) {
      leadTimersRef.current.push(setTimeout(() => speak(text), gap * i))
    }
  }, [leadCount, speak, settings?.rate, stopReadingTts])
  const [currentWordIndex, setCurrentWordIndex] = useState({ idx: 0, total: 0 })
  const [completeBubbles, setCompleteBubbles]   = useState([])
  const [fwSparks, setFwSparks] = useState([])
  const [xpFloats, setXpFloats] = useState([])   // 完成时飘出的 +XP
  const [praise, setPraise] = useState('')        // 完成横幅的随机鼓励语
  const PRAISES = ['太棒了！', '完美！', '继续保持！', '答对啦！', '真厉害！', '漂亮！', '就是这样！']
  const comboRef = useRef(0)                       // 连续答对计数（不触发重渲染）
  const [comboFloats, setComboFloats] = useState([]) // 里程碑连击飘字
  const sentenceErrorRef = useRef(0)                // 本句出错次数（用于钻石判断）
  const completedRef = useRef(false)
  const [itemBalance, setItemBalance] = useState({ hint_balance: 0, skip_balance: 0 })
  const [revealHintNonce, setRevealHintNonce] = useState(0)
  const [itemToast, setItemToast] = useState('')

  const FW_COLORS = ['#ff4d4d','#ffcc00','#4dff88','#4db8ff','#ff80ff','#ff9933','#fff','#c084fc']

  const chunks = useMemo(() => {
    const sentence = sentences[index]
    if (!sentence || !splitMode) return null
    return buildSplitChunksLevel(sentence.en, splitLevel)
  }, [index, sentences, splitMode, splitLevel])

  // Fetch Chinese translation for each chunk when chunks change
  useEffect(() => {
    if (!chunks || chunks.length === 0) { setChunkTranslations([]); return }
    setChunkTranslations(chunks.map(() => ''))
    chunks.forEach((chunk, i) => {
      fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=en|zh`, {
        signal: AbortSignal.timeout(5000)
      })
        .then(r => r.json())
        .then(json => {
          const text = json?.responseData?.translatedText || ''
          if (text && !/[a-zA-Z]{5,}/.test(text)) {
            setChunkTranslations(prev => { const n = [...prev]; n[i] = text; return n })
          }
        })
        .catch(() => {})
    })
  }, [chunks])

  const activeSentence = useMemo(() => {
    const s = sentences[index]
    if (!s) return s
    if (chunks) {
      const zh = chunkTranslations[chunkIndex] || ''
      return { ...s, en: chunks[chunkIndex], zh: zh || s.zh }
    }
    return s
  }, [sentences, index, chunks, chunkIndex, chunkTranslations])

  const readingAutoplayEn = useMemo(() => {
    if (!readingMode || !sentences[index]?.en) return ''
    return sentences[index].en
  }, [readingMode, index, sentences])

  const currentReadingWord = useMemo(() => {
    if (!readingMode || !activeSentence?.en) return ''
    const tokens = activeSentence.en.trim().split(/\s+/).filter(Boolean)
    const idx = currentWordIndex.idx
    if (idx < 0 || idx >= tokens.length) return ''
    const m = tokens[idx].match(/^([a-zA-Z0-9']+)/)
    return m ? m[1] : tokens[idx]
  }, [readingMode, activeSentence, currentWordIndex.idx])

  useEffect(() => () => {
    cancel()
    leadTimersRef.current.forEach(clearTimeout)
    leadTimersRef.current = []
  }, [cancel])

  // Reset combo on new sentence or retry
  useEffect(() => {
    comboRef.current = 0
    setComboFloats([])
    sentenceErrorRef.current = 0
  }, [index, key])

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

  // Auto-accept after N failed speak attempts (configurable, default 3)
  const speakFailLimit = settings?.speakFailLimit || 3
  useEffect(() => {
    if (speakAttempts >= speakFailLimit && speakActive) setSpeakUnlocked(true)
  }, [speakAttempts, speakFailLimit])

  // Auto-play on new sentence (no gate)
  useEffect(() => {
    const sentence = sentences[index]
    if (!sentence || gateEnabled || completed) return
    const speakEn = readingMode ? readingAutoplayEn : sentence.en
    if (!speakEn) return
    prefetch(speakEn)
    if (settings.sentenceSpeak) setTimeout(() => runLeadRead(speakEn, leadCount), 300)
  }, [index, key, readingMode, readingAutoplayEn, gateEnabled, completed, settings.sentenceSpeak, settings.leadReadCount, leadCount, prefetch, runLeadRead])

  // Auto-play when speak gate activates (so child hears sentence before reading)
  useEffect(() => {
    if (!speakActive || !sentences[index]) return
    const textToSpeak = (splitMode && chunks) ? chunks[chunkIndex] : sentences[index].en
    prefetch(textToSpeak)
    setTimeout(() => runLeadRead(textToSpeak, leadCount), 700)
  }, [speakActive, index, sentences, splitMode, chunks, chunkIndex, leadCount, prefetch, runLeadRead])

  useEffect(() => {
    onProgressChange?.(index, sentences.length)
  }, [index, sentences.length])

  useEffect(() => {
    onNav?.({
      prev: goPrev,
      next: goNext,
      retry: () => { completedRef.current = false; setCompleted(false); setKey(k => k + 1) },
      mastered: () => onMarkMastered(sentence?.id),
      review: () => onMarkReview(sentence?.id),
      speak: () => speak(sentence?.en),
      toggleCard: () => setShowCard(v => !v),
      toggleList: () => setShowList(v => !v),
      toggleSplit: () => { setSplitLevel(v => v > 0 ? 0 : 2); setChunkIndex(0); setKey(k => k + 1) },
      setSplitLevel: (level) => { setSplitLevel(v => v === level ? 0 : level); setChunkIndex(0); setKey(k => k + 1) },
      splitMode,
      splitLevel,
      showList,
      attempts: progress[`sentence_${sentences[index]?.id}`]?.attempts || 0,
      status: progress[`sentence_${sentences[index]?.id}`]?.status || 'new',
      canPrev: index > 0,
      canNext: index < sentences.length - 1,
      readingMode,
    })
  }, [index, sentences.length, completed, progress, splitMode, splitLevel, showCard, showList, readingMode])

  const sentence = sentences[index]

  const goNext = useCallback(() => {
    completedRef.current = false
    setCompleted(false); setKey(k => k + 1); setChunkIndex(0)
    setIndex(i => Math.min(i + 1, sentences.length - 1))
  }, [sentences.length])

  const goPrev = useCallback(() => {
    completedRef.current = false
    setCompleted(false); setKey(k => k + 1); setChunkIndex(0)
    setIndex(i => Math.max(i - 1, 0))
  }, [])

  const restartLesson = useCallback(() => {
    completedRef.current = false
    setCompleted(false)
    setChunkIndex(0)
    setIndex(0)
    setKey(k => k + 1)
  }, [])

  const fetchItemBalance = useCallback(() => {
    if (!token) {
      setItemBalance({ hint_balance: 0, skip_balance: 0 })
      return
    }
    fetch(`${API}/user/balance`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        if (!d.error) {
          setItemBalance({
            hint_balance: d.hint_balance ?? 0,
            skip_balance: d.skip_balance ?? 0,
          })
        }
      })
      .catch(() => {})
  }, [token])

  useEffect(() => { fetchItemBalance() }, [fetchItemBalance])

  const showItemToast = useCallback((msg) => {
    setItemToast(msg)
    setTimeout(() => setItemToast(''), 2500)
  }, [])

  const useHint = useCallback(async () => {
    if (!token || itemBalance.hint_balance <= 0 || completed || speakActive) return
    setRevealHintNonce(n => n + 1)
    try {
      const res = await fetch(`${API}/user/use-hint`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.ok !== false && data.hint_balance !== undefined) {
        setItemBalance(b => ({ ...b, hint_balance: data.hint_balance }))
      } else if (!data.error) {
        setItemBalance(b => ({ ...b, hint_balance: Math.max(0, b.hint_balance - 1) }))
      } else {
        showItemToast(data.message || '提示卡使用失败')
        fetchItemBalance()
      }
    } catch {
      showItemToast('网络错误')
    }
  }, [token, itemBalance.hint_balance, completed, speakActive, showItemToast, fetchItemBalance])

  const useSkip = useCallback(async () => {
    if (!token || itemBalance.skip_balance <= 0 || speakActive) return
    if (index >= sentences.length - 1) {
      showItemToast('已是最后一句')
      return
    }
    try {
      const res = await fetch(`${API}/user/use-skip`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.ok !== false && data.skip_balance !== undefined) {
        setItemBalance(b => ({ ...b, skip_balance: data.skip_balance }))
      } else if (!data.error) {
        setItemBalance(b => ({ ...b, skip_balance: Math.max(0, b.skip_balance - 1) }))
      } else {
        showItemToast(data.message || '跳过卡使用失败')
        fetchItemBalance()
        return
      }
    } catch {
      showItemToast('网络错误')
      return
    }
    completedRef.current = false
    setCompleted(false)
    setSpeakUnlocked(!gateEnabled)
    setSpeakPhase('idle')
    goNext()
    showItemToast('已跳到下一句')
  }, [token, itemBalance.skip_balance, speakActive, index, sentences.length, goNext, gateEnabled, showItemToast, fetchItemBalance, completedRef])

  const isLastSentence = index === sentences.length - 1

  const handleReadingContinue = useCallback(() => {
    setFwSparks([])
    if (!isLastSentence) {
      goNext()
      return
    }
    if (hasNextLesson) onNextLesson?.()
    else onBack?.()
  }, [isLastSentence, goNext, hasNextLesson, onNextLesson, onBack])

  const continueBtnRef = useRef(null)
  const isLastSentenceForFocus = index === sentences.length - 1
  useEffect(() => {
    if (completed && isLastSentenceForFocus && hasNextLesson && continueBtnRef.current) {
      const btn = continueBtnRef.current
      const t = setTimeout(() => {
        try { btn.focus({ preventScroll: true }) } catch { /* button may be unmounted */ }
      }, 60)
      return () => clearTimeout(t)
    }
  }, [completed, isLastSentenceForFocus, hasNextLesson])

  // Recording handler
  const micReadyRef = useRef(false)
  const handleRecordToggle = useCallback(() => {
    if (speakPhase === 'success') return
    if (isRecording && recognitionRef.current) { recognitionRef.current.stop(); return }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setSpeakPhase('fail')
      setRecResult('此浏览器不支持语音识别，请使用 Chrome')
      return
    }

    // 预检闸门：首次录音先确保麦克风权限（统一引导浮层），授权后重入
    if (!micReadyRef.current) {
      ensureMic('评测你的发音').then((res) => {
        if (!res.ok) {
          setSpeakPhase('fail')
          setRecResult(res.reason === 'unsupported' ? '此浏览器不支持语音识别，请使用 Chrome' : '请允许麦克风权限后重试')
          return
        }
        micReadyRef.current = true
        handleRecordToggle()
      })
      return
    }

    // Cancel any playing TTS first — prevents speaker audio from being captured by mic
    if (settings?.blockTTSDuringRec !== false) {
      window.speechSynthesis?.cancel()
      window.nativeTTS?.cancel()
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
      const targetText = (splitMode && chunks) ? chunks[chunkIndex] : sentence.en
      const scored = alts.map(t => ({ t, ...calcMatch(targetText, t) })).sort((a, b) => b.score - a.score)
      const best = scored[0]
      if (best.score > 0.5) {
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
  }, [isRecording, speakPhase, sentence, playCorrect, splitMode, chunks, chunkIndex])

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
    if (completedRef.current) return   // 防止重复触发
    completedRef.current = true
    setCompleted(true)
    onIncrementAttempts(sentence.id)
    onSentenceDone?.()
    onXp?.(2)
    // 钻石：本句无错→绿，有错坚持完成→红（鼓励错题坚持）
    if (sentenceErrorRef.current === 0) {
      onCrystal?.('green', 1, 'sentence_clean', { id: sentence.id })
    } else if (sentenceErrorRef.current >= 2) {
      onCrystal?.('red', 1, 'sentence_recover', { id: sentence.id, errs: sentenceErrorRef.current })
    }
    // 完成整个单元（最后一句）→ 蓝钻石
    if (index === sentences.length - 1) {
      onCrystal?.('blue', 1, 'unit_complete', { lesson: grammarContext?.name || '' })
    }
    setPraise(PRAISES[Math.floor(Math.random() * PRAISES.length)])
    const floatId = Date.now()
    setXpFloats(f => [...f, { id: floatId }])
    setTimeout(() => setXpFloats(f => f.filter(x => x.id !== floatId)), 1000)
    playVictory()
    const W = window.innerWidth, H = window.innerHeight
    // 3组×12粒=36个粒子，避免过多动画导致卡顿
    const sparks = [0, 0.2, 0.4].flatMap((delay, bi) => {
      const cx = W * 0.2 + Math.random() * W * 0.6
      const cy = H * 0.1 + Math.random() * H * 0.3
      return Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.3
        const dist = 80 + Math.random() * 150
        return { id: `${bi}-${i}-${Date.now()}`, cx, cy, fx: Math.cos(angle) * dist, fy: Math.sin(angle) * dist - 50, size: 4 + Math.random() * 5, color: FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)], duration: 0.6 + Math.random() * 0.5, delay }
      })
    })
    setFwSparks(sparks)
    setTimeout(() => setFwSparks([]), 1600)
    playFireworks()
    if (settings.autoSpeak && !splitMode) setTimeout(() => speak(sentence.en), 600)
  }, [sentence, chunks, chunkIndex, settings.autoSpeak, speak, onIncrementAttempts, playVictory, playFireworks, splitMode, onCrystal, onSentenceDone, onXp, index, sentences.length, grammarContext])

  const prevKeyRef = useRef(null)
  useEffect(() => {
    if (!splitMode || !chunks) return
    if (prevKeyRef.current === null) { prevKeyRef.current = key; return }
    prevKeyRef.current = key
    const chunk = chunks[chunkIndex]
    if (chunk) setTimeout(() => speak(chunk), 100)
  }, [chunkIndex, key])

  useEffect(() => {
    if (!completed) { setCompleteBubbles([]); return }
    const colors = ['#ff6b9d','#4ecdc4','#ffe66d','#a8e6cf','#ff8b94','#c7ceea','#ffd93d','#6bcb77','#74b9ff','#fd79a8','#55efc4','#fdcb6e']
    setCompleteBubbles(Array.from({length: 12}, (_, i) => ({
      id: i, glow: colors[i % colors.length],
      size: 18 + Math.random() * 28, left: 2 + Math.random() * 96,
      dx: (Math.random() - 0.5) * 120, duration: 1.4 + Math.random() * 1.0, delay: i * 0.04,
    })))
  }, [completed])

  useEffect(() => {
    if (!completed) return
    if (isLastSentence) return
    if (readingMode) return
    function handleNextKey(e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); goNext() }
    }
    window.addEventListener('keydown', handleNextKey)
    return () => window.removeEventListener('keydown', handleNextKey)
  }, [completed, goNext, isLastSentence, readingMode])

  /** 输入阅读：完成后按 Enter 等同点击「继续」（捕获阶段避免与按钮重复触发） */
  useEffect(() => {
    if (!readingMode || !completed || speakActive) return
    function onEnterContinue(e) {
      if (e.key !== 'Enter') return
      e.preventDefault()
      handleReadingContinue()
    }
    window.addEventListener('keydown', onEnterContinue, true)
    return () => window.removeEventListener('keydown', onEnterContinue, true)
  }, [readingMode, completed, speakActive, handleReadingContinue])

  const speakWordRepeat = useCallback((word, count) => {
    if (settings.wordSpeak === false || !word) return
    stopReadingTts()
    const n = Math.min(5, Math.max(1, Number(count) || 1))
    const rate = settings?.rate || 1.0
    const gap = Math.max(450, Math.round(700 / rate))
    speak(word)
    for (let i = 1; i < n; i++) {
      leadTimersRef.current.push(setTimeout(() => speak(word), gap * i))
    }
  }, [speak, settings.wordSpeak, settings?.rate, stopReadingTts])

  const speakWord = useCallback((word) => {
    speakWordRepeat(word, settings.leadReadCount || 1)
  }, [speakWordRepeat, settings.leadReadCount])

  const speakCurrentReadingWord = useCallback((count) => {
    speakWordRepeat(currentReadingWord, count ?? settings.leadReadCount ?? 1)
  }, [speakWordRepeat, currentReadingWord, settings.leadReadCount])

  useEffect(() => {
    function handleKey(e) {
      if (e.target.tagName === 'INPUT') {
        if (e.key === 'ArrowRight' && e.ctrlKey) { goNext(); return }
        if (e.key === 'ArrowLeft'  && e.ctrlKey) { goPrev(); return }
      } else {
        if (e.key === 'ArrowRight') { goNext(); return }
        if (e.key === 'ArrowLeft')  { goPrev(); return }
      }
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault()
        const a = readingMode && activeSentence?.en ? activeSentence.en : sentence.en
        speak(a)
        return
      }
      if (e.ctrlKey && e.key === 'm') { e.preventDefault(); onMarkMastered(sentence.id); return }
      if (e.ctrlKey && e.key === 'q') { e.preventDefault(); onMarkReview(sentence.id); return }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [sentence, speak, goNext, goPrev, onMarkMastered, onMarkReview, readingMode, activeSentence])

  const grammarTopicMeta = useMemo(() => {
    if (!GRAMMAR_LEARNING_UI_ENABLED) return null
    if (!grammarContext || grammarContext.source !== 'grammar' || !grammarContext.tenseId) return null
    return getGrammarTopicMeta(grammarContext.tenseId)
  }, [grammarContext])

  useEffect(() => {
    if (!readingMode) return
    setSplitLevel(0)
    setChunkIndex(0)
  }, [readingMode])

  useEffect(() => {
    if (readingMode) stopReadingTts()
  }, [index, readingMode, stopReadingTts])

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
      {!readingMode && (
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
      )}

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

      {/* 连击里程碑飘字 */}
      {comboFloats.map(f => (
        <div key={f.id} className="fixed left-1/2 top-1/3 -translate-x-1/2 pointer-events-none xp-float" style={{ zIndex: 9998 }}>
          <div className="bg-orange-500/90 text-white font-extrabold text-2xl px-5 py-2 rounded-2xl shadow-xl shadow-orange-900/50 whitespace-nowrap flex items-center gap-2">
            🔥 {f.combo}连击！<span className="text-amber-200 text-lg font-bold">+5 XP</span>
          </div>
        </div>
      ))}

      <div className={`flex flex-col items-center mx-auto px-4 relative transition-all duration-200 w-full ${readingMode ? 'max-w-4xl gap-2' : 'max-w-2xl gap-3'}`} style={{zIndex:10}}>
        {readingMode && !speakActive && (
          <div className="w-full self-start rounded-xl border border-cyan-500/25 bg-slate-900/75 backdrop-blur-md shadow-lg shadow-cyan-950/25 overflow-hidden">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-2 px-3 py-2">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-600/60 bg-slate-800/80 px-2 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors shrink-0"
                >
                  <IconArrowLeft size={16} />
                  返回
                </button>
              )}
              <div className="flex items-center gap-0.5 rounded-lg border border-slate-600/60 bg-slate-800/60 p-0.5 shrink-0">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={index <= 0}
                  title="上一段"
                  aria-label="上一段"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-slate-200 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <IconArrowLeft size={16} />
                </button>
                <span className="px-1.5 text-sm tabular-nums text-cyan-200/90 font-semibold min-w-[2.75rem] text-center">
                  {index + 1}/{sentences.length}
                </span>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={index >= sentences.length - 1}
                  title="下一段"
                  aria-label="下一段"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-slate-200 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <IconArrowRight size={16} />
                </button>
              </div>
              <div className="hidden sm:block w-px h-6 bg-slate-600/50 shrink-0" />
              <ReadingAudioToolbar
                isSpeaking={readingTtsOn}
                onStopSpeak={stopReadingTts}
                onSpeakFull={() => {
                  if (!activeSentence?.en) return
                  stopReadingTts()
                  setReadingTtsOn(true)
                  speak(activeSentence.en)
                  const rate = settings?.rate || 1.0
                  const words = activeSentence.en.trim().split(/\s+/).length
                  const ms = Math.max(2500, Math.round((words * 450 / rate) + 1200))
                  leadTimersRef.current.push(setTimeout(() => setReadingTtsOn(false), ms))
                }}
                wordSpeakOn={settings.wordSpeak !== false}
                onWordSpeakChange={(v) => onPatchSettings?.({ wordSpeak: v })}
                onSpeakCurrentWord={speakCurrentReadingWord}
                onPatchSettings={onPatchSettings}
                leadReadCount={leadCount}
                speakDisabled={isRecording && settings?.blockTTSDuringRec !== false}
              />
            </div>
          </div>
        )}
        {/* 语法卡先于进度条显示（用户要求） */}
        {grammarTopicMeta && !readingMode && <GrammarLearningStrip meta={grammarTopicMeta} />}
        {!readingMode && (() => {
          const frac = Math.min(1, (index + (completed ? 1 : (currentWordIndex.total > 0 ? currentWordIndex.idx / currentWordIndex.total : 0))) / Math.max(1, sentences.length))
          const full = frac >= 0.999
          return (
            <div className="relative w-full mt-1 flex items-center gap-3" style={{ zIndex: 2 }}>
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors shrink-0"
                  aria-label="返回"
                >
                  <IconArrowLeft size={18} />
                </button>
              )}
              <div className="flex-1 min-w-0 relative">
                <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden">
                  <div
                    className="h-full rounded-full relative"
                    style={{
                      width: `${frac * 100}%`,
                      background: full
                        ? 'linear-gradient(90deg,#f59e0b,#fbbf24)'
                        : 'linear-gradient(90deg,#3b82f6,#22d3ee)',
                      transition: 'width .45s cubic-bezier(.34,1.56,.64,1), background .3s',
                    }}
                  >
                    <div className="absolute left-1 right-1 top-[2px] h-[3px] rounded-full bg-white/30" />
                  </div>
                </div>
                {xpFloats.map(f => (
                  <div key={f.id} className="xp-float absolute right-0 -top-1 text-amber-400 font-bold text-lg drop-shadow">
                    +2 XP
                  </div>
                ))}
              </div>
              <span className="text-gray-500 text-sm tabular-nums shrink-0">{index + 1}/{sentences.length}</span>
            </div>
          )
        })()}
        {showCard && (
          <DictionaryCard
            sentence={sentence}
            onClose={() => setShowCard(false)}
            grammarTopicMeta={grammarTopicMeta || undefined}
          />
        )}

        {/* Sentence list drawer */}
        {showList && (
          <div className="fixed inset-0 z-40 flex" onClick={() => setShowList(false)}>
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative ml-auto w-80 max-w-full h-full bg-slate-900 border-l border-slate-700 flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
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
                      className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors border-b border-slate-700/50
                        ${isCurrent ? 'bg-blue-900/30' : 'hover:bg-slate-700/50'}`}
                    >
                      <span className={`shrink-0 text-xs font-mono mt-0.5 w-6 text-right ${isCurrent ? 'text-blue-400' : 'text-gray-600'}`}>#{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-base leading-snug ${isCurrent ? 'text-white' : 'text-gray-300'}`}>{s.zh}</div>
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

        {/* 默认练习：中文在上 + 朗读；输入阅读：独立工具栏在输入区上方 */}
        {!readingMode && (
        <div className="flex items-start justify-center gap-3 mt-0 w-full transition-all duration-200">
          <div className="flex flex-col items-center gap-1 shrink-0 mt-1">
            <button
              onClick={() => speak(chunks && splitMode ? chunks[chunkIndex] : sentence.en)}
              disabled={isRecording && settings?.blockTTSDuringRec !== false}
              className={`w-10 h-10 rounded-lg border transition-colors flex items-center justify-center
                ${isRecording && settings?.blockTTSDuringRec !== false ? 'bg-slate-800 border-slate-700 text-gray-700 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white border-gray-700'}`}
              title="朗读整句 (Ctrl+A)"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            </button>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => { onPatchSettings?.({ leadReadCount: n }); runLeadRead(sentence.en, n) }}
                  className={`w-5 h-5 rounded text-[10px] font-bold transition-colors ${leadCount === n ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-500 hover:bg-gray-700 hover:text-white'}`}
                  title={`领读 ${n} 次`}
                >{n}</button>
              ))}
            </div>
          </div>
          <div className="text-center flex-1">
            <div className="flex items-start justify-center gap-3">
              {showChineseGuide && (
                <div className="text-white leading-relaxed transition-all duration-200" style={{ fontFamily: '"Kaiti SC", "STKaiti", "KaiTi", serif', fontSize: '30px', letterSpacing: '0.18em', fontWeight: 'normal' }}>
                  {chunks && chunkTranslations[chunkIndex] ? chunkTranslations[chunkIndex] : sentence.zh}
                </div>
              )}
              <button
                type="button"
                onClick={onToggleChineseGuide}
                className="mt-1 px-2.5 py-1 rounded-lg text-xs border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 transition-colors"
                title={showChineseGuide ? '隐藏中文引导句' : '显示中文引导句'}
              >
                {showChineseGuide ? '隐藏中文' : '显示中文'}
              </button>
            </div>
            {chunks && (
              <div className="flex gap-1.5 justify-center mt-1.5">
                {chunks.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i < chunkIndex ? 'bg-gradient-to-r from-green-400 to-emerald-500' : i === chunkIndex ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gray-600'}`} />
                ))}
              </div>
            )}
          </div>
        </div>
        )}

        {/* Speak gate — shown when settings.requireSpeak is on */}
        {speakActive && (
          <div className="flex flex-col items-center gap-4 py-6 w-full max-w-md mx-auto bg-slate-800/90 rounded-3xl border border-slate-700 shadow-2xl px-6">
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
                <div className="text-green-400 font-mono text-lg">{splitMode && chunks ? chunks[chunkIndex] : sentence.en}</div>
              ) : (
                <div className="text-green-400 font-mono text-xl font-semibold leading-relaxed">{splitMode && chunks ? chunks[chunkIndex] : sentence.en}</div>
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

            {!gateEnabled && (
              <button
                onClick={() => setSpeakUnlocked(true)}
                className={`text-xs underline transition-colors ${speakAttempts >= 2 ? 'text-gray-400 hover:text-white' : 'text-gray-700 hover:text-gray-500'}`}
              >
                {speakAttempts >= 2 ? '跳过（已多次尝试）' : '跳过'}
              </button>
            )}
          </div>
        )}

        {/* 道具：提示卡 / 跳过卡 */}
        {!readingMode && token && (itemBalance.hint_balance > 0 || itemBalance.skip_balance > 0) && !speakActive && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            {itemBalance.hint_balance > 0 && (
              <button
                type="button"
                onClick={useHint}
                disabled={completed}
                className="px-3 py-1.5 rounded-xl text-sm font-semibold border border-amber-600/50 bg-amber-900/40 text-amber-200 hover:bg-amber-800/50 disabled:opacity-40 transition-colors"
              >
                💡 提示 ({itemBalance.hint_balance})
              </button>
            )}
            {itemBalance.skip_balance > 0 && (
              <button
                type="button"
                onClick={useSkip}
                className="px-3 py-1.5 rounded-xl text-sm font-semibold border border-purple-600/50 bg-purple-900/40 text-purple-200 hover:bg-purple-800/50 transition-colors"
              >
                🪄 跳过 ({itemBalance.skip_balance})
              </button>
            )}
          </div>
        )}
        {itemToast && (
          <div className="text-center text-xs text-emerald-400 mb-2">{itemToast}</div>
        )}

        {/* Word input — 默认练习单行；输入阅读为卡片堆叠 + 当前句内嵌输入 */}
        {!readingMode && (
          <div className="w-full min-h-20" style={{ display: speakActive ? 'none' : undefined }}>
            <WordInput
              key={`${sentence.id}-${key}-${speakActive}`}
              sentence={activeSentence}
              onComplete={handleComplete}
              speakWord={speakWord}
              learningLevel={settings.learningLevel || 2}
              showHintOnError={settings.showHintOnError !== false}
              hintTriggerCount={settings.hintTriggerCount || 1}
              revealHintNonce={revealHintNonce}
              errorRetryCount={settings.errorRetryCount || 2}
              onError={() => { playError(); comboRef.current = 0; sentenceErrorRef.current += 1 }}
              onWordCorrect={() => { onWordDone?.() }}
              onWordFinal={() => {
                const c = ++comboRef.current
                playCorrect(c)
                if (c > 0 && c % 5 === 0) {
                  onXp?.(5)
                  // 钻石：5连击给1紫，10连击给2紫
                  onCrystal?.('purple', c >= 10 ? 2 : 1, c >= 10 ? 'combo_10' : 'combo_5', { combo: c })
                  const fid = Date.now()
                  setComboFloats(f => [...f, { id: fid, combo: c }])
                  setTimeout(() => setComboFloats(f => f.filter(x => x.id !== fid)), 1400)
                }
              }}
              onKeypress={playKeypress}
              onBubble={playBubble}
              onCurrentChange={(idx, total) => setCurrentWordIndex({ idx, total })}
              userId={userId}
              readingMode={false}
              phoneticControl={null}
            />
          </div>
        )}

        {readingMode && !speakActive && (
          <div className="w-full space-y-4">
            <ReadingParagraphInput
              key={`${sentence.id}-${key}`}
              sentence={activeSentence}
              onComplete={handleComplete}
              showChinese={showChineseGuide}
              frozen={completed}
              learningLevel={settings.learningLevel || 2}
              speakWord={speakWord}
              onKeypress={playKeypress}
              onError={playError}
              onWordCorrect={() => { playCorrect(); onWordDone?.() }}
              errorRetryCount={settings.errorRetryCount || 2}
              hintTriggerCount={settings.hintTriggerCount || 1}
              showHintOnError={settings.showHintOnError !== false}
              userId={userId}
              onCurrentChange={(idx, total) => setCurrentWordIndex({ idx, total })}
            />
            {completed && (
              <div className="flex flex-col items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleReadingContinue}
                  title="继续（Enter）"
                  className="min-w-[200px] px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-base font-semibold shadow-lg shadow-purple-900/40 ring-2 ring-purple-400/30 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400/80"
                >
                  {isLastSentence ? (hasNextLesson ? '进入下一课' : '完成阅读') : '继续'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Completion banner（默认练习；输入阅读用底部「继续」） */}
        {completed && !readingMode && (
          <div className="pop w-full bg-green-900/50 border border-green-600 rounded-xl px-6 py-3 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-green-300 text-lg font-bold">🎉 {praise || '答对啦！'}</span>
              <span className="text-amber-400 text-sm font-bold bg-amber-500/15 border border-amber-500/40 px-2 py-0.5 rounded-full">+2 XP</span>
            </div>
            <div className="text-green-300 text-2xl font-semibold">✓ {sentence.en}</div>
            {isLastSentence ? (
              <div className="mt-3 flex flex-col items-center gap-2">
                <div className="text-green-400 text-base font-medium">🎉 本课全部完成！</div>
                <div className="flex items-center justify-center gap-3 mt-1 flex-wrap">
                  <button
                    type="button"
                    onClick={restartLesson}
                    className="min-w-[140px] px-5 py-2.5 rounded-xl bg-green-900/40 hover:bg-green-800/60 text-green-200 text-base font-semibold border border-green-600/70 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400/80"
                  >
                    🔄 重新练习
                  </button>
                  {hasNextLesson && (
                    <button
                      ref={continueBtnRef}
                      type="button"
                      autoFocus
                      onClick={() => onNextLesson?.()}
                      className="min-w-[140px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 active:from-green-600 active:to-emerald-600 text-white text-base font-semibold shadow-lg shadow-emerald-500/40 ring-2 ring-emerald-300/90 ring-offset-2 ring-offset-slate-900 transition-all animate-pulse focus:outline-none"
                    >
                      继续下一课 →
                    </button>
                  )}
                </div>
                {hasNextLesson && (
                  <div className="text-xs text-green-700 mt-1">按 Enter 继续下一课</div>
                )}
              </div>
            ) : (
              <div className="text-green-600 text-sm mt-1">按空格 / Enter 继续下一句</div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
