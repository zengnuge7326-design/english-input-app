import { useEffect, useMemo, useState } from 'react'
import { useMobileTTS } from '../hooks/useMobileTTS'
import { useMobileSfx } from '../hooks/useMobileSfx'
import type { MatchingQuestionData } from '../types'
import MobileSubmitButton from './MobileSubmitButton'
import QuizPlayButton from './QuizPlayButton'
import QuestionShell from './QuestionShell'

interface Props {
  data: MatchingQuestionData
  step: number
  total: number
  lessonTitle: string
  onExit: () => void
  onAnswer: (correct: boolean) => void
  onJudge?: (correct: boolean) => void
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function WaveBars({ active }: { active?: boolean }) {
  const heights = [0.45, 0.75, 1, 0.6, 0.85, 0.5, 0.7]
  return (
    <span className={`mobile-quiz__match-wave${active ? ' mobile-quiz__match-wave--active' : ''}`} aria-hidden>
      {heights.map((h, i) => (
        <span
          key={i}
          className="mobile-quiz__match-wave-bar"
          style={{ height: `${h * 100}%`, animationDelay: `${i * 0.07}s` }}
        />
      ))}
    </span>
  )
}

export default function MatchingQuestion({
  data,
  step,
  total,
  lessonTitle,
  onExit,
  onAnswer,
  onJudge,
}: Props) {
  const { speak, prefetch } = useMobileTTS()
  const sfx = useMobileSfx()
  const [audioOrder] = useState(() => shuffle(data.pairs.map(p => p.id)))
  const [zhOrder] = useState(() => shuffle(data.pairs.map(p => p.id)))
  const [matched, setMatched] = useState<Set<string>>(() => new Set())
  const [pickedAudio, setPickedAudio] = useState<string | null>(null)
  const [pickedZh, setPickedZh] = useState<string | null>(null)
  const [wrongFlash, setWrongFlash] = useState(false)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'idle' | 'done'>('idle')

  const pairMap = useMemo(() => new Map(data.pairs.map(p => [p.id, p])), [data.pairs])
  const allMatched = matched.size === data.pairs.length

  useEffect(() => {
    prefetch(data.pairs.map(p => p.audioText))
  }, [data.pairs, prefetch])

  function playAudio(id: string) {
    const pair = pairMap.get(id)
    if (!pair || matched.has(id)) return
    setPlayingId(id)
    speak(pair.audioText)
    setTimeout(() => setPlayingId(null), 1200)
  }

  function pickAudio(id: string) {
    if (matched.has(id) || feedback === 'done') return
    setPickedAudio(id)
    playAudio(id)
    if (pickedZh) tryMatch(id, pickedZh)
  }

  function pickZh(id: string) {
    if (matched.has(id) || feedback === 'done') return
    setPickedZh(id)
    if (pickedAudio) tryMatch(pickedAudio, id)
  }

  function tryMatch(audioId: string, zhId: string) {
    if (audioId === zhId) {
      sfx.playCorrect()
      setMatched(prev => new Set([...prev, audioId]))
      setPickedAudio(null)
      setPickedZh(null)
      setWrongFlash(false)
    } else {
      sfx.playWrong()
      setWrongFlash(true)
      setTimeout(() => {
        setWrongFlash(false)
        setPickedAudio(null)
        setPickedZh(null)
      }, 500)
    }
  }

  function submit() {
    if (!allMatched || feedback === 'done') return
    onJudge?.(true)
    setFeedback('done')
    setTimeout(() => onAnswer(true), 500)
  }

  function skip() {
    if (feedback === 'done') return
    onAnswer(false)
  }

  function audioBtnClass(id: string) {
    const isMatched = matched.has(id)
    const isPicked = pickedAudio === id
    const isPlaying = playingId === id
    return [
      'mobile-quiz__match-btn mobile-quiz__match-btn--audio',
      isMatched ? 'mobile-quiz__match-btn--matched' : '',
      isPicked && !isMatched ? 'mobile-quiz__match-btn--picked' : '',
      isPlaying ? 'mobile-quiz__match-btn--playing' : '',
      wrongFlash && (isPicked || pickedAudio === id) ? 'mobile-quiz__match-btn--wrong' : '',
    ].filter(Boolean).join(' ')
  }

  function zhBtnClass(id: string) {
    const isMatched = matched.has(id)
    const isPicked = pickedZh === id
    return [
      'mobile-quiz__match-btn mobile-quiz__match-btn--zh',
      isMatched ? 'mobile-quiz__match-btn--matched' : '',
      isPicked && !isMatched ? 'mobile-quiz__match-btn--picked' : '',
      wrongFlash && (isPicked || pickedZh === id) ? 'mobile-quiz__match-btn--wrong' : '',
    ].filter(Boolean).join(' ')
  }

  return (
    <QuestionShell
      layout="compact"
      lessonTitle={lessonTitle}
      title={data.prompt}
      step={step}
      total={total}
      onExit={onExit}
      adaptiveDeps={[matched.size, pickedAudio, pickedZh, wrongFlash, playingId, feedback]}
      prompt={<div className="mobile-quiz__match-spacer" aria-hidden />}
      interact={
        <div className="flex flex-col gap-4 w-full">
          <div className="mobile-quiz__match-grid w-full">
            <div className="mobile-quiz__match-col flex flex-col gap-2.5">
              {audioOrder.map(id => {
                const pair = pairMap.get(id)!
                return (
                  <button
                    key={`a-${id}`}
                    type="button"
                    onClick={() => pickAudio(id)}
                    disabled={matched.has(id) || feedback === 'done'}
                    className={audioBtnClass(id)}
                    aria-label="播放音频"
                  >
                    <QuizPlayButton size={20} active={playingId === id} />
                    <WaveBars active={playingId === id} />
                  </button>
                )
              })}
            </div>
            <div className="mobile-quiz__match-col flex flex-col gap-2.5">
              {zhOrder.map(id => {
                const pair = pairMap.get(id)!
                return (
                  <button
                    key={`z-${id}`}
                    type="button"
                    onClick={() => pickZh(id)}
                    disabled={matched.has(id) || feedback === 'done'}
                    className={zhBtnClass(id)}
                  >
                    {pair.labelZh}
                  </button>
                )
              })}
            </div>
          </div>
          <button
            type="button"
            onClick={skip}
            className="mobile-quiz__dictation-skip text-center mobile-quiz__text-muted py-1"
            style={{ fontSize: '0.875em' }}
          >
            现在不做听力题
          </button>
        </div>
      }
      onEnterSubmit={submit}
      enterSubmitDisabled={!allMatched || feedback === 'done'}
      submit={
        <MobileSubmitButton onClick={submit} disabled={!allMatched || feedback === 'done'}>
          检查
        </MobileSubmitButton>
      }
    />
  )
}
