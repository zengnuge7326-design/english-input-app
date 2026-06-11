import { useState, useRef, useEffect, useMemo } from 'react'
import { recordError } from '../hooks/useProgress'
import { hasRealSentenceZh } from '../utils/gutenbergTextCleanup.js'

const INPUT_PALETTE = {
  pinkCoral: '#E38A95',
  sandGold: '#A58F63',
  caramel: '#A67A24',
  silver: '#CFCFCF',
  lime: '#B7B400',
  lakeBlue: '#2A9BD9',
  skyBlue: '#67C6F4',
  lavender: '#A38BEA',
  violet: '#A349D6',
  turquoise: '#2FB9B0',
  magenta: '#B23A6E',
  salmonRed: '#DB6A6A',
  ivory: '#EADDC1',
}

const RETRY_SEGMENT_COLORS = [
  INPUT_PALETTE.pinkCoral,
  INPUT_PALETTE.sandGold,
  INPUT_PALETTE.caramel,
  INPUT_PALETTE.silver,
  INPUT_PALETTE.lime,
  INPUT_PALETTE.lakeBlue,
  INPUT_PALETTE.skyBlue,
  INPUT_PALETTE.lavender,
  INPUT_PALETTE.violet,
  INPUT_PALETTE.turquoise,
  INPUT_PALETTE.magenta,
  INPUT_PALETTE.salmonRed,
  INPUT_PALETTE.ivory,
]

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9']/g, '')
}

function splitPunct(word) {
  const m = word.match(/^([a-zA-Z0-9']+)([^a-zA-Z0-9']*)$/)
  if (m) return [m[1], m[2]]
  return [word, '']
}

function splitParagraphs(en) {
  return en
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

function tokenizeLine(line) {
  return line.trim().split(/\s+/).filter(Boolean)
}

/** 按英文词字母权重切分本段中文，使译文列与词列大致对齐 */
function splitZhByEnglishWeights(zhLine, secWords) {
  const z = (zhLine || '').trim()
  const n = secWords.length
  if (!z || n === 0) return secWords.map(() => '')
  const weights = secWords.map((w) => {
    const [c] = splitPunct(w)
    const alpha = c.replace(/[^a-zA-Z']/g, '').length
    return Math.max(alpha || 1, 1)
  })
  const sum = weights.reduce((a, b) => a + b, 0)
  const parts = []
  let start = 0
  const zLen = z.length
  for (let i = 0; i < n; i++) {
    if (i === n - 1) {
      parts.push(z.slice(start))
      break
    }
    const share = weights[i] / sum
    let end = start + Math.round(share * zLen)
    end = Math.min(Math.max(end, start + 1), zLen - (n - i - 1))
    parts.push(z.slice(start, end))
    start = end
  }
  return parts
}

/**
 * 输入阅读：框内逐词原位输入；未完成词位灰字对照；译文拆列对齐英文；支持 \n\n 两段。
 */
export default function ReadingParagraphInput({
  sentence,
  onComplete,
  showChinese = true,
  /** 本段练完后冻结展示（点「继续」前） */
  frozen = false,
  learningLevel = 2,
  speakWord,
  onKeypress,
  onError,
  onWordCorrect,
  errorRetryCount = 2,
  hintTriggerCount = 1,
  showHintOnError = true,
  userId,
  onCurrentChange,
}) {
  const { en, zh } = sentence
  const showWordZh = showChinese && hasRealSentenceZh(zh)

  const sections = useMemo(() => {
    const enParas = splitParagraphs(en)
    const zhParas = showWordZh && zh ? splitParagraphs(zh) : []
    if (enParas.length === 0) return []
    return enParas.map((text, i) => ({
      words: tokenizeLine(text),
      zhLine: zhParas[i] ?? (i === 0 ? zh || '' : ''),
    }))
  }, [en, zh, showWordZh])

  const words = useMemo(() => sections.flatMap((s) => s.words), [sections])

  const zhFragmentsPerSection = useMemo(() => {
    if (!showWordZh) return sections.map((sec) => sec.words.map(() => ''))
    return sections.map((sec) => splitZhByEnglishWeights(sec.zhLine, sec.words))
  }, [sections, showWordZh])

  const [current, setCurrent] = useState(0)
  const [inputs, setInputs] = useState(() => words.map(() => ''))
  const [statuses, setStatuses] = useState(() => words.map(() => 'pending'))
  const [retryCount, setRetryCount] = useState(() => words.map(() => 0))
  const [errorCount, setErrorCount] = useState(() => words.map(() => 0))
  const [shaking, setShaking] = useState(false)
  const inputRefs = useRef([])

  useEffect(() => {
    setCurrent(0)
    setInputs(words.map(() => ''))
    setStatuses(words.map(() => 'pending'))
    setRetryCount(words.map(() => 0))
    setErrorCount(words.map(() => 0))
    setShaking(false)
    onCurrentChange?.(0, words.length)
  }, [sentence.id, words.length])

  useEffect(() => {
    if (!frozen && speakWord && words[current]) {
      const [core] = splitPunct(words[current])
      if (core) speakWord(core)
    }
  }, [current, sentence.id, frozen])

  useEffect(() => {
    const t = setTimeout(() => {
      if (frozen) return
      const el = inputRefs.current[current]
      if (el) {
        el.focus()
        el.setSelectionRange(el.value.length, el.value.length)
      }
    }, 30)
    return () => clearTimeout(t)
  }, [current, sentence.id, frozen])

  useEffect(() => {
    if (frozen) return
    function handleGlobalSpace(e) {
      if (e.key === ' ' && e.target.tagName !== 'INPUT') {
        e.preventDefault()
        const el = inputRefs.current[current]
        if (el) el.focus()
      }
    }
    window.addEventListener('keydown', handleGlobalSpace)
    return () => window.removeEventListener('keydown', handleGlobalSpace)
  }, [current, frozen])

  function jumpTo(i) {
    if (i < 0 || i >= words.length) return
    setCurrent(i)
    onCurrentChange?.(i, words.length)
    setTimeout(() => {
      const el = inputRefs.current[i]
      if (el) {
        el.focus()
        el.setSelectionRange(el.value.length, el.value.length)
      }
    }, 0)
  }

  function advanceAfter(nextStatuses, fromIdx) {
    if (nextStatuses.every((s) => s === 'correct')) {
      onComplete?.()
      return
    }
    let ni = fromIdx + 1
    while (ni < words.length && nextStatuses[ni] === 'correct') ni++
    if (ni >= words.length) ni = nextStatuses.findIndex((s) => s !== 'correct')
    if (ni >= 0) jumpTo(ni)
  }

  function submitWord(idx) {
    if (frozen || shaking) return
    const [core] = splitPunct(words[idx])
    const val = inputs[idx]
    const next = [...statuses]

    if (normalize(val) === normalize(core)) {
      if (retryCount[idx] > 0) {
        const nextRetry = [...retryCount]
        nextRetry[idx]--
        setRetryCount(nextRetry)
        if (nextRetry[idx] === 0) {
          next[idx] = 'correct'
          setStatuses(next)
          onWordCorrect?.()
          advanceAfter(next, idx)
        } else {
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
        next[idx] = 'correct'
        setStatuses(next)
        onWordCorrect?.()
        advanceAfter(next, idx)
      }
    } else {
      const nextRetry = [...retryCount]
      nextRetry[idx] = errorRetryCount
      setRetryCount(nextRetry)
      const nextError = [...errorCount]
      nextError[idx]++
      setErrorCount(nextError)
      setShaking(true)
      onError?.()
      recordError(sentence.id, sentence.en, core, userId)
      setTimeout(() => {
        setShaking(false)
        const shouldShowHintForOthers = showHintOnError && nextError[idx] >= hintTriggerCount
        const nextS = statuses.map((s, j) => {
          if (s === 'correct') return 'correct'
          if (j === idx) return 'hinting'
          return shouldShowHintForOthers ? 'hinting' : 'pending'
        })
        setStatuses(nextS)
        const nextI = inputs.map((v, j) => (nextS[j] === 'hinting' || nextS[j] === 'pending' ? '' : v))
        setInputs(nextI)
        setTimeout(() => {
          const el = inputRefs.current[idx]
          if (el) el.focus()
        }, 0)
      }, 500)
    }
  }

  function handleKeyDown(e, i) {
    if (frozen) return
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
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      jumpTo(i - 1)
      return
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      jumpTo(i + 1)
      return
    }
  }

  const wordGap = 'gap-x-1 gap-y-3'
  const wordTextSize = 'text-3xl sm:text-4xl md:text-[2.65rem] leading-tight'

  if (sections.length === 0 || words.length === 0) {
    return (
      <div className="w-full rounded-xl border border-slate-700 bg-slate-900/50 p-4 text-center text-gray-500 text-sm">
        暂无英文内容
      </div>
    )
  }

  function renderWordCell(wordStr, globalIdx, si, wi, zhFrag) {
    const [core] = splitPunct(wordStr)
    const status = statuses[globalIdx]
    const isCurrent = globalIdx === current
    const isShaking = shaking && isCurrent
    const val = inputs[globalIdx]
    const isHinting = status === 'hinting'
    const done = frozen || status === 'correct'
    const typed = !done && val.length > 0

    const underlineColor =
      status === 'correct'
        ? 'rgba(255,255,255,0.45)'
        : isShaking
          ? INPUT_PALETTE.salmonRed
          : isCurrent
            ? INPUT_PALETTE.skyBlue
            : 'rgba(74,222,128,0.35)'

    const rc = retryCount[globalIdx]

    let displayCls = 'text-emerald-400'
    if (isShaking) displayCls = 'text-red-400'
    else if (done || typed) displayCls = 'text-white font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'
    else if (isHinting) displayCls = 'text-teal-300'

    return (
      <div key={`${si}-${wi}`} className="relative inline-flex items-end max-w-full">
        <div className="relative inline-flex flex-col items-center max-w-full">
          <div
            className={`${wordTextSize} min-h-[3rem] sm:min-h-[3.25rem] flex items-end justify-center max-w-full ${isShaking ? 'shake' : ''} ${displayCls}`}
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontWeight: 'normal',
              hyphens: 'auto',
              WebkitHyphens: 'auto',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
            }}
            lang="en"
          >
            <span className="text-center px-0.5">
              {done ? core : val || core}
            </span>
          </div>
          {/* 与教材 WordInput 一致：有错待加时显示分段进度条，否则单色下划线 */}
          {rc > 0 ? (
            <div className="w-full h-1 mt-1.5 flex overflow-hidden rounded-full">
              {Array.from({ length: errorRetryCount }).map((_, j) => {
                const filled = j < rc
                const color = RETRY_SEGMENT_COLORS[(globalIdx + j) % RETRY_SEGMENT_COLORS.length]
                return (
                  <div
                    key={j}
                    className="flex-1 transition-all duration-300"
                    style={{
                      background: filled ? color : `${INPUT_PALETTE.silver}26`,
                      marginRight: j < errorRetryCount - 1 ? '1px' : 0,
                    }}
                  />
                )
              })}
            </div>
          ) : (
            <div
              className={`w-full h-0.5 mt-1.5 rounded-full transition-colors duration-150 ${done ? 'bg-emerald-500/55' : ''}`}
              style={done ? undefined : { backgroundColor: underlineColor }}
            />
          )}
          {showWordZh && zhFrag ? (
            <span
              className="mt-1 block w-full max-w-[min(100%,18ch)] text-center text-xs sm:text-[13px] leading-snug text-slate-400 px-0.5"
              style={{ fontFamily: '"Kaiti SC", "STKaiti", "KaiTi", serif', wordBreak: 'break-all' }}
            >
              {zhFrag}
            </span>
          ) : null}
          {!frozen && (
            <input
              ref={(el) => { inputRefs.current[globalIdx] = el }}
              value={status === 'correct' ? core : val}
              onChange={(e) => {
                if (status === 'correct') return
                onKeypress?.()
                const next = [...inputs]
                next[globalIdx] = e.target.value.replace(/[^a-zA-Z']/g, '')
                setInputs(next)
              }}
              onKeyDown={(e) => handleKeyDown(e, globalIdx)}
              onFocus={() => {
                setCurrent(globalIdx)
                onCurrentChange?.(globalIdx, words.length)
              }}
              readOnly={status === 'correct'}
              className="absolute opacity-0 w-full h-full top-0 left-0 cursor-default"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="rounded-xl border border-cyan-400/30 bg-slate-950/55 backdrop-blur-sm overflow-hidden shadow-[0_0_24px_-12px_rgba(34,211,238,0.28)]">
        <div className="p-3 sm:p-4 space-y-5">
          {sections.map((sec, si) => {
            const wordBase = sections.slice(0, si).reduce((acc, s) => acc + s.words.length, 0)
            return (
              <div key={si} className="space-y-3">
                <div className={`flex flex-wrap ${wordGap} items-end justify-start w-full`}>
                  {sec.words.map((raw, wi) =>
                    renderWordCell(raw, wordBase + wi, si, wi, zhFragmentsPerSection[si]?.[wi] ?? ''),
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
