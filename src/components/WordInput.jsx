import { useState, useRef, useEffect, useMemo } from 'react'
import { useWordTranslate } from '../hooks/useWordTranslate'
import { recordError } from '../hooks/useProgress'
import { fetchWordPhonetic, getSentencePOS, getFunctionWordTranslation } from '../utils/wordInfo'

const POS_COLORS = {
  noun:        { badge: 'bg-blue-500/80 text-blue-100', underline: 'bg-blue-400/70', label: '名词' },
  verb:        { badge: 'bg-red-500/80 text-red-100', underline: 'bg-red-400/70', label: '动词' },
  adjective:   { badge: 'bg-orange-500/80 text-orange-100', underline: 'bg-orange-400/70', label: '形容词' },
  adverb:      { badge: 'bg-orange-500/80 text-orange-100', underline: 'bg-orange-400/70', label: '副词' },
  pronoun:     { badge: 'bg-green-500/80 text-green-100', underline: 'bg-green-400/70', label: '代词' },
  preposition: { badge: 'bg-gray-500/80 text-gray-100', underline: 'bg-gray-400/60', label: '介词' },
  conjunction: { badge: 'bg-gray-500/80 text-gray-100', underline: 'bg-gray-400/60', label: '连词' },
  other:       { badge: 'bg-gray-500/80 text-gray-100', underline: 'bg-gray-400/60', label: '其他' },
}

const YUANTI_FONT = '"Yuanti SC", "Yuanti TC", "PingFang SC", "Microsoft YaHei", sans-serif'

function getWordAnnotation(sentence, wordStr) {
  if (!sentence.words) return null
  const [core] = splitPunct(wordStr)
  return sentence.words.find(w => w.w.toLowerCase() === core.toLowerCase()) || null
}

function tokenize(en) {
  return en.trim().split(/\s+/).filter(Boolean)
}

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9']/g, '')
}

function splitPunct(word) {
  const m = word.match(/^([a-zA-Z0-9']+)([^a-zA-Z0-9']*)$/)
  if (m) return [m[1], m[2]]
  return [word, '']
}

export default function WordInput({ sentence, onComplete, speakWord, learningLevel = 2, showHintOnError = true, hintTriggerCount = 1, errorRetryCount = 2, onError, onWordCorrect, onKeypress, onBubble, onCurrentChange, totalRetryCount, userId }) {
  const words = tokenize(sentence.en)
  const [current, setCurrent] = useState(0)
  const [inputs, setInputs] = useState(() => words.map(() => ''))
  const [statuses, setStatuses] = useState(() => words.map(() => 'pending'))
  const [retryCount, setRetryCount] = useState(() => words.map(() => 0))
  const [errorCount, setErrorCount] = useState(() => words.map(() => 0))
  const [shaking, setShaking] = useState(false)
  const [wordBubbles, setWordBubbles] = useState([])
  const bubbleIdRef = useRef(0)
  const inputRefs = useRef([])
  const { translate } = useWordTranslate()
  const [translations, setTranslations] = useState({})
  const [phonetics, setPhonetics] = useState({})

  const posMap = useMemo(() => getSentencePOS(sentence.en), [sentence.id])

  useEffect(() => {
    setCurrent(0)
    setInputs(words.map(() => ''))
    setStatuses(words.map(() => 'pending'))
    setRetryCount(words.map(() => 0))
    setErrorCount(words.map(() => 0))
    setShaking(false)
    setTranslations({})
    setPhonetics({})
    onCurrentChange?.(0, words.length)
  }, [sentence.id])

  // Pre-fetch translations for ALL words when sentence changes
  useEffect(() => {
    words.forEach((wordStr, i) => {
      const [core] = splitPunct(wordStr)
      if (!core) return
      const ann = getWordAnnotation(sentence, wordStr)
      if (ann) { setTranslations(prev => ({ ...prev, [i]: ann.zh })); return }

      const pos = posMap[core.toLowerCase()]
      const funcTranslation = getFunctionWordTranslation(core, pos)
      if (funcTranslation) {
        setTranslations(prev => ({ ...prev, [i]: funcTranslation }))
        return
      }

      translate(core).then(text => {
        if (text) setTranslations(prev => ({ ...prev, [i]: text }))
      })
    })
  }, [sentence.id, posMap])

  // Pre-fetch phonetics for ALL words
  useEffect(() => {
    words.forEach((wordStr, i) => {
      const [core] = splitPunct(wordStr)
      if (!core) return
      fetchWordPhonetic(core).then(ph => {
        if (ph) setPhonetics(prev => ({ ...prev, [i]: ph }))
      })
    })
  }, [sentence.id])

  useEffect(() => {
    if (speakWord && words[current]) {
      const [core] = splitPunct(words[current])
      if (core) speakWord(core)
    }
  }, [current, sentence.id])


  useEffect(() => {
    const t = setTimeout(() => {
      const el = inputRefs.current[current]
      if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length) }
    }, 30)
    return () => clearTimeout(t)
  }, [current, sentence.id])

  useEffect(() => {
    function handleGlobalSpace(e) {
      if (e.key === ' ' && e.target.tagName !== 'INPUT') {
        e.preventDefault()
        const el = inputRefs.current[current]
        if (el) el.focus()
      }
    }
    window.addEventListener('keydown', handleGlobalSpace)
    return () => window.removeEventListener('keydown', handleGlobalSpace)
  }, [current])

  function jumpTo(i) {
    if (i < 0 || i >= words.length) return
    setCurrent(i)
    onCurrentChange?.(i, words.length)
    setTimeout(() => {
      const el = inputRefs.current[i]
      if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length) }
    }, 0)
  }

  function advanceAfter(nextStatuses, fromIdx) {
    if (nextStatuses.every(s => s === 'correct')) { onComplete(); return }
    let ni = fromIdx + 1
    while (ni < words.length && nextStatuses[ni] === 'correct') ni++
    if (ni >= words.length) ni = nextStatuses.findIndex(s => s !== 'correct')
    if (ni >= 0) jumpTo(ni)
  }

  function spawnWordBubbles(idx) {
    const sizes = [12, 36, 16, 30, 10, 34, 18, 26]
    const newBubbles = sizes.map((size, j) => ({
      id: bubbleIdRef.current++,
      idx,
      size,
      left: -10 + j * 17,
      dx: (Math.random() - 0.5) * 30,
      delay: j * 0.15,
    }))
    setWordBubbles(b => [...b, ...newBubbles])
    setTimeout(() => setWordBubbles(b => b.filter(x => !newBubbles.some(n => n.id === x.id))), 1600)
  }

  function submitWord(idx) {
    if (shaking) return
    const [core] = splitPunct(words[idx])
    const val = inputs[idx]
    const next = [...statuses]

    if (normalize(val) === normalize(core)) {
      // 检查是否需要加练
      if (retryCount[idx] > 0) {
        const nextRetry = [...retryCount]
        nextRetry[idx]--
        setRetryCount(nextRetry)

        if (nextRetry[idx] === 0) {
          // 加练完成
          next[idx] = 'correct'
          setStatuses(next)
          onWordCorrect?.()
          spawnWordBubbles(idx)
          advanceAfter(next, idx)
        } else {
          // 还需要继续加练，播放单词读音
          onWordCorrect?.()
          if (speakWord) speakWord(core)
          const nextI = [...inputs]
          nextI[idx] = ''
          setInputs(nextI)
          setTimeout(() => {
            const el = inputRefs.current[idx]
            if (el) el.focus()
          }, 0)
        }
      } else {
        // 正常完成
        next[idx] = 'correct'
        setStatuses(next)
        onWordCorrect?.()
        spawnWordBubbles(idx)
        advanceAfter(next, idx)
      }
    } else {
      // 输错了
      const nextRetry = [...retryCount]
      nextRetry[idx] = errorRetryCount
      setRetryCount(nextRetry)

      // 增加错误计数
      const nextError = [...errorCount]
      nextError[idx]++
      setErrorCount(nextError)

      setShaking(true)
      onError?.()
      recordError(sentence.id, sentence.en, core, userId)
      setTimeout(() => {
        setShaking(false)

        // 错误加练时始终显示提示，或者根据设置判断
        const shouldShowHint = true  // 加练时始终显示
        const shouldShowHintForOthers = showHintOnError && nextError[idx] >= hintTriggerCount

        const nextS = statuses.map((s, j) => {
          if (s === 'correct') return 'correct'
          if (j === idx) return 'hinting'  // 当前错误的单词始终显示提示
          return shouldShowHintForOthers ? 'hinting' : 'pending'
        })
        setStatuses(nextS)
        const nextI = inputs.map((v, j) => nextS[j] === 'hinting' || nextS[j] === 'pending' ? '' : v)
        setInputs(nextI)
        setTimeout(() => {
          const el = inputRefs.current[idx]
          if (el) el.focus()
        }, 0)
      }, 500)
    }
  }

  function handleKeyDown(e, i) {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitWord(i)
      return
    }
    if (e.key === ' ') {
      if (e.target.selectionStart === e.target.value.length) {
        e.preventDefault()
        submitWord(i)
      }
      return
    }
    if (e.key === 'ArrowLeft') { e.preventDefault(); jumpTo(i - 1); return }
    if (e.key === 'ArrowRight') { e.preventDefault(); jumpTo(i + 1); return }
  }

  function getHint(word) {
    const [core] = splitPunct(word)
    const vowels = 'aeiouyAEIOUY'

    // learningLevel: 1=全词, 2=首字母, 3=隐藏元音, 4=隐藏辅音, 5=全隐藏
    if (learningLevel === 1) return core
    if (learningLevel === 2) return core[0] || ''
    if (learningLevel === 3) {
      // 隐藏元音，显示辅音
      return core.split('').map(c => vowels.includes(c) ? '_' : c).join('')
    }
    if (learningLevel === 4) {
      // 隐藏辅音，显示元音
      return core.split('').map(c => vowels.includes(c) ? c : '_').join('')
    }
    if (learningLevel === 5) return ''
    return core[0] || ''
  }

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-4 items-end justify-center mt-3">
      {words.map((word, i) => {
        const [core, punct] = splitPunct(word)
        const status = statuses[i]
        const isCurrent = i === current
        const isShaking = shaking && isCurrent
        const val = inputs[i]
        const hint = getHint(word)
        const isHinting = status === 'hinting'
        const showHint = isHinting && val === ''

        // 输入中：蓝色；输入完成(correct)：蓝色；提示：绿色；错误：红色；其他：白色
        const textColor = status === 'correct' ? 'text-blue-400'
          : isShaking ? 'text-red-400'
          : showHint ? 'text-green-400'
          : val ? 'text-blue-400'
          : 'text-white'

        const retryColors = ['#ef4444','#f97316','#eab308','#84cc16','#22c55e','#3b82f6']

        const pos = posMap[core.toLowerCase()] || 'other'
        const posStyle = POS_COLORS[pos] || POS_COLORS.other

        const underlineColor = status === 'correct' ? 'bg-transparent'
          : isShaking ? 'bg-red-500'
          : isCurrent ? 'bg-blue-400'
          : posStyle.underline

        const showPlaceholder = status === 'pending' && val === '' && isCurrent && hint

        return (
          <div key={i} className="relative flex items-end gap-0">
            <div className="relative flex flex-col items-center" style={{ minWidth: `${Math.max(core.length * 1.2, 4)}ch` }}>
              {wordBubbles.filter(b => b.idx === i).map(b => (
                <div key={b.id} className="word-bubble" style={{ width: b.size, height: b.size, left: `${b.left}%`, '--dx': `${b.dx}px`, animationDelay: `${b.delay}s` }} />
              ))}

              {/* phonetic */}
              <div className="h-4 flex items-center justify-center w-full">
                {phonetics[i] && (
                  <span className="text-gray-400 text-[10px] sm:text-xs whitespace-nowrap leading-none">{phonetics[i]}</span>
                )}
              </div>

              {/* text display */}
              <div className={`text-4xl tracking-wide min-h-8 flex items-end w-full ${isShaking ? 'shake' : ''}`}
                style={{ fontFamily: 'AI Nile, monospace', fontWeight: 'normal' }}>
                <span className={textColor}>
                  {status === 'correct'
                    ? core
                    : showHint
                    ? core
                    : val
                    ? val
                    : showPlaceholder
                    ? <span className="opacity-25">{hint}</span>
                    : null
                  }
                </span>
              </div>

              {/* underline / retry progress bar */}
              {retryCount[i] > 0 ? (
                <div className="w-full h-1 mt-0.5 flex overflow-hidden rounded-full">
                  {Array.from({ length: errorRetryCount }).map((_, j) => {
                    const filled = j < retryCount[i]
                    const color = retryColors[Math.min(j, retryColors.length - 1)]
                    return (
                      <div key={j} className="flex-1 transition-all duration-300"
                        style={{ background: filled ? color : 'rgba(255,255,255,0.1)', marginRight: j < errorRetryCount - 1 ? '1px' : 0 }} />
                    )
                  })}
                </div>
              ) : (
                <div className={`w-full h-1 mt-0.5 rounded-full transition-colors duration-150 ${underlineColor}`} />
              )}

              {/* POS badge */}
              <div className="h-4 flex items-center justify-center mt-0.5 w-full">
                <span className={`text-[9px] sm:text-[10px] px-1.5 py-px rounded-full leading-none font-medium ${posStyle.badge}`}>
                  {posStyle.label}
                </span>
              </div>

              {/* translation */}
              <div className="h-5 flex items-center justify-center overflow-hidden w-full">
                {translations[i] && (
                  <span className={`text-base whitespace-nowrap ${isShaking ? 'text-red-400' : 'text-white/90'}`}
                    style={{ fontFamily: YUANTI_FONT, fontWeight: 'normal' }}>
                    {translations[i]}
                  </span>
                )}
              </div>

              {/* invisible input */}
              <input
                ref={el => inputRefs.current[i] = el}
                value={status === 'correct' ? core : val}
                onChange={e => {
                  if (status === 'correct') return
                  onKeypress?.()
                  const next = [...inputs]
                  next[i] = e.target.value
                  setInputs(next)
                }}
                onKeyDown={e => handleKeyDown(e, i)}
                onFocus={() => { setCurrent(i); onCurrentChange?.(i, words.length) }}
                readOnly={status === 'correct'}
                className="absolute opacity-0 w-full h-full top-0 left-0 cursor-default"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>
            {punct && (
              <span className="font-mono text-4xl text-white/60 mb-0.5">{punct}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
