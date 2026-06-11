import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { matchWord, useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import { useMobileTTS } from '../hooks/useMobileTTS'
import type { PhonicsRepeatQuestionData } from '../types'
import QuizAvatar from './QuizAvatar'
import QuizPlayButton from './QuizPlayButton'
import QuestionShell from './QuestionShell'
import MicHelpLink from './MicHelpLink'
import { showMicGuide } from '../../utils/micGate'

interface Props {
  data: PhonicsRepeatQuestionData
  step: number
  total: number
  lessonTitle: string
  onExit: () => void
  onAnswer: (correct: boolean) => void
}

export default function PhonicsRepeatQuestion({
  data,
  step,
  total,
  lessonTitle,
  onExit,
  onAnswer,
}: Props) {
  const { speak, prefetch } = useMobileTTS()
  const { supported, listening, heard, listen, stop } = useSpeechRecognition()
  const [phase, setPhase] = useState<'idle' | 'listening' | 'success' | 'fail'>('idle')
  const [msg, setMsg] = useState('')
  const failsRef = useRef(0)
  const doneRef = useRef(false)
  const autoListenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const characterRole = data.characterRole ?? 'student'

  useEffect(() => {
    prefetch([data.word])
    const t = setTimeout(() => speak(data.word, 0.88), 400)
    return () => {
      clearTimeout(t)
      stop()
    }
  }, [data.word, prefetch, speak, stop])

  function clearAutoListen() {
    if (autoListenTimerRef.current) {
      clearTimeout(autoListenTimerRef.current)
      autoListenTimerRef.current = null
    }
  }

  function scheduleAutoListen(delay = 700) {
    clearAutoListen()
    autoListenTimerRef.current = setTimeout(() => startListen(), delay)
  }

  function handleMicTap() {
    if (!supported) {
      showMicGuide({ purpose: '跟读练习' })
      return
    }
    startListen()
  }

  function startListen() {
    if (doneRef.current || phase === 'listening' || listening) return
    clearAutoListen()
    setPhase('listening')
    setMsg('')
    listen({
      onResult: (text, alts) => {
        if (doneRef.current) return
        const ok = matchWord(data.word, alts?.length ? alts : [text])
        if (ok) {
          doneRef.current = true
          setPhase('success')
          setMsg('说得真不错！')
          setTimeout(() => onAnswer(true), 700)
        } else {
          failsRef.current += 1
          if (failsRef.current >= 3) {
            doneRef.current = true
            setPhase('fail')
            setMsg(`听到「${text || '…'}」· 自动跳过`)
            setTimeout(() => onAnswer(false), 700)
          } else {
            setPhase('idle')
            setMsg(`听到「${text || '…'}」再来 (${failsRef.current}/3)`)
            scheduleAutoListen(800)
          }
        }
      },
      onError: (err) => {
        if (doneRef.current || err === 'aborted') return
        if (err === 'not-allowed' || err === 'service-not-allowed') {
          setPhase('idle')
          setMsg('请允许麦克风权限后点麦克风')
          return
        }
        if (err === 'unsupported') {
          setPhase('idle')
          setMsg('请用 Chrome 浏览器')
          return
        }
        if (err === 'no-speech') {
          failsRef.current += 1
          if (failsRef.current >= 3) {
            doneRef.current = true
            setPhase('fail')
            setMsg('没听到声音，先继续吧')
          } else {
            setPhase('idle')
            setMsg(`大声点！(${failsRef.current}/3)`)
            scheduleAutoListen(800)
          }
          return
        }
        setPhase('idle')
        setMsg('识别出错，再试一次')
        scheduleAutoListen(800)
      },
    })
  }

  useEffect(() => {
    if (!supported) return
    scheduleAutoListen(1200)
    return clearAutoListen
  }, [data.word, supported]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => clearAutoListen(), [])

  function skip() {
    if (!doneRef.current) {
      doneRef.current = true
      clearAutoListen()
      stop()
      onAnswer(false)
    }
  }

  function finishFail() {
    if (!doneRef.current) {
      doneRef.current = true
      onAnswer(false)
    }
  }

  const isListening = listening || phase === 'listening'

  return (
    <QuestionShell
      layout="compact"
      lessonTitle={lessonTitle}
      title={data.prompt}
      step={step}
      total={total}
      onExit={onExit}
      adaptiveDeps={[phase, msg, listening]}
      prompt={
        <div className="mobile-quiz__phonics-repeat-scene w-full flex flex-col items-center gap-3">
          <div className="mobile-quiz__phonics-repeat-bubble">
            <button type="button" onClick={() => speak(data.word, 0.88)} className="flex items-center gap-2">
              <QuizPlayButton size={18} />
              <span className="font-black mobile-quiz__text-xl">{data.word}</span>
            </button>
          </div>
          <QuizAvatar role={characterRole} name="跟读" size={36} />
          {data.ipa && (
            <p className="mobile-quiz__text-muted font-mono text-sm">{data.ipa}</p>
          )}
        </div>
      }
      interact={
        <div className="flex flex-col items-center gap-4 w-full">
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={handleMicTap}
            disabled={phase === 'success' || isListening}
            className={`mobile-quiz__phonics-repeat-mic
              ${isListening ? 'mobile-quiz__phonics-repeat-mic--active' : ''}
              ${phase === 'success' ? 'mobile-quiz__phonics-repeat-mic--success' : ''}
              disabled:opacity-45`}
            aria-label="开始说话"
          >
            {phase === 'success' ? '✓' : isListening ? '🎙️' : '🎤'}
          </motion.button>
          <p className={`text-center text-sm font-semibold px-2 min-h-[1.25em]
            ${phase === 'success' ? 'text-[#6ee7b7]' : phase === 'fail' ? 'text-[#fbbf24]' : 'mobile-quiz__text-muted'}`}>
            {!supported && 'Safari 需先开启麦克风权限'}
            {supported && !msg && isListening && '正在听你说…'}
            {supported && !msg && !isListening && phase === 'idle' && '跟着读出来'}
            {msg}
          </p>
          {(!supported || msg.includes('麦克风')) && (
            <MicHelpLink purpose="跟读练习" />
          )}
          {listening && heard && (
            <p className="mobile-quiz__text-muted text-xs text-center">
              听到：<span className="font-mono font-bold text-white">{heard}</span>
            </p>
          )}
          <button
            type="button"
            onClick={phase === 'fail' ? finishFail : skip}
            className="mobile-quiz__dictation-skip text-center mobile-quiz__text-muted py-1"
            style={{ fontSize: '0.875em' }}
          >
            {phase === 'fail' ? '继续' : '现在不做口语题'}
          </button>
        </div>
      }
    />
  )
}
