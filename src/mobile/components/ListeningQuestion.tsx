import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useMobileTTS } from '../hooks/useMobileTTS'
import type { ListeningQuestionData } from '../types'
import MobileSubmitButton from './MobileSubmitButton'
import QuizPlayButton from './QuizPlayButton'
import QuestionShell from './QuestionShell'

interface Props {
  data: ListeningQuestionData
  step: number
  total: number
  lessonTitle: string
  onExit: () => void
  onAnswer: (correct: boolean) => void
}

export default function ListeningQuestion({ data, step, total, lessonTitle, onExit, onAnswer }: Props) {
  const { speak, prefetch } = useMobileTTS()
  const [playing, setPlaying] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'idle' | 'right' | 'wrong'>('idle')

  useEffect(() => {
    prefetch([data.audioLabel])
  }, [data.audioLabel, prefetch])

  function playAudio() {
    setPlaying(true)
    speak(data.audioLabel)
    setTimeout(() => setPlaying(false), 1200)
  }

  function submit() {
    if (!picked || feedback !== 'idle') return
    const ok = !!data.options.find(o => o.id === picked)?.correct
    setFeedback(ok ? 'right' : 'wrong')
    setTimeout(() => onAnswer(ok), 600)
  }

  return (
    <QuestionShell
      lessonTitle={lessonTitle}
      title={data.prompt}
      step={step}
      total={total}
      onExit={onExit}
      prompt={
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={playAudio}
          aria-label="播放音频"
          className={`mobile-quiz__card w-full flex-1 min-h-[10em] border-dashed flex flex-col items-center justify-center gap-2
            ${playing ? 'border-[#f5b942] bg-[rgba(245,185,66,0.15)]' : ''}`}
        >
          <QuizPlayButton size={40} active={playing} className={playing ? 'animate-pulse' : ''} />
          <span className="mobile-quiz__text-muted font-semibold" style={{ fontSize: '0.875em' }}>
            {playing ? '播放中…' : '点我播放'}
          </span>
        </motion.button>
      }
      interact={
        <div className="mobile-quiz__interact-inner">
          {data.options.map(opt => {
            const isPicked = picked === opt.id
            const showRight = feedback !== 'idle' && opt.correct
            const showWrong = feedback === 'wrong' && isPicked
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => feedback === 'idle' && setPicked(opt.id)}
                className={`mobile-quiz__option w-full flex items-center text-left border-2
                  ${showRight ? 'bg-[#d4f8e8] border-[#3ecf8e]' : ''}
                  ${showWrong ? 'bg-[#ffe0e0] border-[#ff7b7b]' : ''}
                  ${!showRight && !showWrong && isPicked ? 'mobile-quiz__option--selected border-[#4ecdc4]' : ''}
                  ${!showRight && !showWrong && !isPicked ? 'mobile-quiz__option--idle' : ''}`}
              >
                <span className="mobile-quiz__text-lg font-bold">{opt.label}</span>
              </button>
            )
          })}
        </div>
      }
      adaptiveDeps={[picked, feedback]}
      onEnterSubmit={submit}
      enterSubmitDisabled={!picked || feedback !== 'idle'}
      submit={
        <MobileSubmitButton onClick={submit} disabled={!picked || feedback !== 'idle'}>
          {feedback === 'right' ? '✓ 正确' : feedback === 'wrong' ? '再想想…' : '确认答案'}
        </MobileSubmitButton>
      }
    />
  )
}
