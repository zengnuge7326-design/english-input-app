import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { matchSentence, useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import { useMobileTTS } from '../hooks/useMobileTTS'
import type { SpeakingQuestionData } from '../types'
import MobileSubmitButton from './MobileSubmitButton'
import QuizPlayButton from './QuizPlayButton'
import QuestionShell from './QuestionShell'
import MicHelpLink from './MicHelpLink'
import { showMicGuide } from '../../utils/micGate'

interface Props {
  data: SpeakingQuestionData
  step: number
  total: number
  lessonTitle: string
  onExit: () => void
  onAnswer: (correct: boolean) => void
}

export default function SpeakingQuestion({ data, step, total, lessonTitle, onExit, onAnswer }: Props) {
  const { speak, prefetch } = useMobileTTS()
  const { supported, listening, heard, listen, stop } = useSpeechRecognition()
  const [phase, setPhase] = useState<'idle' | 'listening' | 'success' | 'fail'>('idle')
  const [msg, setMsg] = useState('')
  const failsRef = useRef(0)
  const doneRef = useRef(false)

  useEffect(() => {
    prefetch([data.sentence])
    return () => stop()
  }, [data.sentence, prefetch, stop])

  function handleMicTap() {
    if (!supported) {
      showMicGuide({ purpose: '跟读练习' })
      return
    }
    startListen()
  }

  function startListen() {
    if (doneRef.current || phase === 'listening') return
    setPhase('listening')
    setMsg('🎤 请大声读…')
    listen({
      onResult: (text, alts) => {
        if (doneRef.current) return
        const ok = matchSentence(data.sentence, alts?.length ? alts : [text])
        if (ok) {
          doneRef.current = true
          setPhase('success')
          setMsg('✓ 读对了！')
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
          }
        }
      },
      onError: (err) => {
        if (doneRef.current) return
        if (err === 'aborted') return
        if (err === 'not-allowed' || err === 'service-not-allowed') {
          setPhase('idle')
          setMsg('请允许麦克风权限')
          return
        }
        if (err === 'unsupported') {
          setPhase('idle')
          setMsg('当前浏览器不支持跟读')
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
          }
          return
        }
        setPhase('idle')
        setMsg('识别出错，再试一次')
      },
    })
  }

  function skip() {
    if (!doneRef.current) {
      doneRef.current = true
      onAnswer(false)
    }
  }

  return (
    <QuestionShell
      lessonTitle={lessonTitle}
      title={data.prompt}
      step={step}
      total={total}
      onExit={onExit}
      prompt={
        <div className="mobile-quiz__card w-full text-center">
          <p className="mobile-quiz__text-2xl font-black leading-snug">{data.sentence}</p>
          {data.ipa && <p className="mobile-quiz__text-muted text-sm font-mono mt-2">{data.ipa}</p>}
          <button
            type="button"
            onClick={() => speak(data.sentence, 0.88)}
            className="mt-4 min-h-[44px] px-5 py-2 rounded-xl bg-white/10 text-white text-sm font-bold border border-white/20 active:scale-95"
          >
            <span className="inline-flex items-center gap-2">
              <QuizPlayButton size={18} />
              听示范
            </span>
          </button>
        </div>
      }
      interact={
        <div className="flex flex-col items-center justify-center gap-4 py-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={handleMicTap}
            disabled={phase === 'success' || listening}
            className={`w-[7rem] h-[7rem] min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-5xl shadow-xl border-4
              ${listening || phase === 'listening' ? 'bg-[#ffe0e8] border-[#ff8fab] animate-pulse' : ''}
              ${phase === 'success' ? 'bg-[#d4f8e8] border-[#3ecf8e]' : ''}
              ${phase === 'fail' ? 'bg-[#fff0e0] border-[#f5b942]' : ''}
              ${phase === 'idle' ? 'bg-white border-[#ff8fab]' : ''}
              disabled:opacity-50`}
          >
            {phase === 'success' ? '✓' : listening || phase === 'listening' ? '🎙️' : '🎤'}
          </motion.button>
          <p className={`font-semibold text-center text-sm px-2 ${phase === 'success' ? 'text-[#6ee7b7]' : phase === 'fail' ? 'text-[#fbbf24]' : 'mobile-quiz__text-muted'}`}>
            {!supported && 'Safari 需先开启麦克风权限'}
            {supported && !msg && phase === 'idle' && '点下方按钮开始跟读'}
            {msg}
          </p>
          {(!supported || msg.includes('麦克风')) && (
            <div className="flex flex-col items-center gap-2">
              <MicHelpLink purpose="跟读练习" />
              <button
                type="button"
                onClick={skip}
                className="text-xs text-white/40 active:opacity-70 py-1 px-3"
              >
                跳过此题
              </button>
            </div>
          )}
          {listening && heard && (
            <p className="mobile-quiz__text-muted text-xs">听到：<span className="font-mono font-bold text-white">{heard}</span></p>
          )}
        </div>
      }
      adaptiveDeps={[phase, msg, listening]}
      onEnterSubmit={phase === 'fail' ? skip : handleMicTap}
      enterSubmitDisabled={phase !== 'fail' && (listening || phase === 'success' || phase === 'listening')}
      submit={
        phase === 'fail' ? (
          <MobileSubmitButton onClick={skip}>继续</MobileSubmitButton>
        ) : (
          <MobileSubmitButton
            onClick={handleMicTap}
            disabled={listening || phase === 'success' || phase === 'listening'}
          >
            {phase === 'success' ? '✓ 完成' : listening || phase === 'listening' ? '正在听…' : '开始跟读'}
          </MobileSubmitButton>
        )
      }
    />
  )
}
