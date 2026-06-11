import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useMobileTTS } from '../hooks/useMobileTTS'
import type { StoryListenQuestionData, StoryListenStep } from '../types'
import MobileSubmitButton from './MobileSubmitButton'
import QuizAvatar from './QuizAvatar'
import QuizPlayButton from './QuizPlayButton'
import QuestionShell from './QuestionShell'

interface Props {
  data: StoryListenQuestionData
  step: number
  total: number
  lessonTitle: string
  onExit: () => void
  onAnswer: (correct: boolean) => void
}

function WaveBars({ active }: { active?: boolean }) {
  const heights = [0.4, 0.7, 1, 0.55, 0.9, 0.45, 0.75, 0.6]
  return (
    <span className={`mobile-quiz__story-wave${active ? ' mobile-quiz__story-wave--active' : ''}`} aria-hidden>
      {heights.map((h, i) => (
        <span
          key={i}
          className="mobile-quiz__story-wave-bar"
          style={{ height: `${h * 100}%`, animationDelay: `${i * 0.06}s` }}
        />
      ))}
    </span>
  )
}

function isScorable(step: StoryListenStep) {
  return step.kind !== 'listen'
}

export default function StoryListenQuestion({
  data,
  step,
  total,
  lessonTitle,
  onExit,
  onAnswer,
}: Props) {
  const { speak, prefetch, stop } = useMobileTTS()
  const [subIdx, setSubIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [picked, setPicked] = useState<string[]>([])
  const [pickedChoice, setPickedChoice] = useState<number | null>(null)
  const [pickedTf, setPickedTf] = useState<boolean | null>(null)
  const [feedback, setFeedback] = useState<'idle' | 'right' | 'wrong'>('idle')
  const scoreRef = useRef(0)

  const subStep = data.steps[subIdx]
  const scorableTotal = useMemo(() => data.steps.filter(isScorable).length, [data.steps])

  useEffect(() => {
    const texts = data.steps.flatMap(s => {
      if (s.kind === 'listen') return [s.audioText]
      if (s.kind === 'trueFalse' && s.replayText) return [s.replayText]
      return []
    })
    prefetch(texts)
    return () => stop()
  }, [data.steps, prefetch, stop])

  const playText = useCallback((text: string) => {
    setPlaying(true)
    speak(text, 0.9)
    setTimeout(() => setPlaying(false), Math.min(4000, 800 + text.length * 55))
  }, [speak])

  useEffect(() => {
    if (subStep?.kind !== 'listen') return
    const t = setTimeout(() => playText(subStep.audioText), 500)
    return () => clearTimeout(t)
  }, [subIdx, subStep, playText])

  function advanceSub(ok: boolean) {
    if (!subStep) return
    const next = subIdx + 1
    if (ok && isScorable(subStep)) scoreRef.current += 1
    const newScore = scoreRef.current
    setFeedback('idle')
    setPicked([])
    setPickedChoice(null)
    setPickedTf(null)

    if (next >= data.steps.length) {
      const pass = newScore >= Math.ceil(scorableTotal / 2)
      setTimeout(() => onAnswer(pass), 400)
    } else {
      setSubIdx(next)
    }
  }

  function submitWordPick() {
    if (subStep?.kind !== 'wordPick' || feedback !== 'idle') return
    const selected = new Set(picked.map(w => w.toLowerCase()))
    const needed = new Set(subStep.answers.map(w => w.toLowerCase()))
    const ok = selected.size === needed.size && [...needed].every(w => selected.has(w))
    setFeedback(ok ? 'right' : 'wrong')
    setTimeout(() => advanceSub(ok), ok ? 450 : 800)
  }

  function submitTrueFalse(value: boolean) {
    if (subStep?.kind !== 'trueFalse' || feedback !== 'idle') return
    setPickedTf(value)
    const ok = value === subStep.answer
    setFeedback(ok ? 'right' : 'wrong')
    setTimeout(() => advanceSub(ok), ok ? 450 : 800)
  }

  function submitChoice(index: number) {
    if (subStep?.kind !== 'choice' || feedback !== 'idle') return
    setPickedChoice(index)
    const ok = index === subStep.answerIndex
    setFeedback(ok ? 'right' : 'wrong')
    setTimeout(() => advanceSub(ok), ok ? 450 : 800)
  }

  function toggleWord(word: string) {
    if (subStep?.kind !== 'wordPick' || feedback !== 'idle') return
    setPicked(prev => {
      if (prev.includes(word)) return prev.filter(w => w !== word)
      if (prev.length >= subStep.pickCount) return prev
      return [...prev, word]
    })
  }

  function skipStory() {
    stop()
    onAnswer(false)
  }

  function renderScene(listenText?: string) {
    const speakers = data.speakers ?? [{ name: '老师' }, { name: '学生' }]
    return (
      <div className="mobile-quiz__story-scene w-full">
        <div className="mobile-quiz__story-stage">
          <span className="mobile-quiz__story-desk" aria-hidden>
            <QuizPlayButton size={22} />
          </span>
          <span className="mobile-quiz__story-host" aria-hidden>
            <QuizAvatar role={speakers[0]?.role} name={speakers[0]?.name} emoji={speakers[0]?.emoji} size={32} />
          </span>
          {speakers[1] && (
            <div className="mobile-quiz__story-bubble">
              <QuizAvatar role={speakers[1]?.role} name={speakers[1]?.name} emoji={speakers[1]?.emoji} size={24} />
              {playing && <WaveBars active />}
            </div>
          )}
        </div>
        {listenText && (
          <p className="mobile-quiz__story-caption mobile-quiz__text-muted text-center text-sm mt-2 px-2">
            {data.sceneTitle}
          </p>
        )}
      </div>
    )
  }

  function renderInteract() {
    if (!subStep) return null

    if (subStep.kind === 'listen') {
      return (
        <div className="flex flex-col gap-4 w-full items-center">
          <button
            type="button"
            onClick={() => playText(subStep.audioText)}
            className={`mobile-quiz__story-play w-full flex items-center gap-3 px-4
              ${playing ? 'mobile-quiz__story-play--active' : ''}`}
          >
            <QuizPlayButton size={22} active={playing} />
            <WaveBars active={playing} />
          </button>
          <button
            type="button"
            onClick={skipStory}
            className="mobile-quiz__dictation-skip text-center mobile-quiz__text-muted py-1"
            style={{ fontSize: '0.875em' }}
          >
            现在不做听力题
          </button>
        </div>
      )
    }

    if (subStep.kind === 'wordPick') {
      return (
        <div className="flex flex-col gap-3 w-full">
          <p className="mobile-quiz__story-subprompt text-center font-bold mobile-quiz__text-lg">
            {subStep.prompt}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {subStep.options.map(word => {
              const on = picked.includes(word)
              const showRight = feedback !== 'idle' && subStep.answers.includes(word)
              const showWrong = feedback === 'wrong' && on && !subStep.answers.includes(word)
              return (
                <button
                  key={word}
                  type="button"
                  onClick={() => toggleWord(word)}
                  disabled={feedback !== 'idle'}
                  className={`mobile-quiz__story-chip
                    ${on ? 'mobile-quiz__story-chip--on' : ''}
                    ${showRight ? 'mobile-quiz__story-chip--right' : ''}
                    ${showWrong ? 'mobile-quiz__story-chip--wrong' : ''}`}
                >
                  {word}
                </button>
              )
            })}
          </div>
        </div>
      )
    }

    if (subStep.kind === 'trueFalse') {
      return (
        <div className="flex flex-col gap-4 w-full">
          <p className="mobile-quiz__story-subprompt text-center font-bold mobile-quiz__text-lg px-1">
            {subStep.statementZh}
          </p>
          {subStep.replayText && (
            <button
              type="button"
              onClick={() => playText(subStep.replayText!)}
              className={`mobile-quiz__story-play w-full flex items-center gap-3 px-4
                ${playing ? 'mobile-quiz__story-play--active' : ''}`}
            >
              <QuizPlayButton size={22} active={playing} />
              <WaveBars active={playing} />
            </button>
          )}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => submitTrueFalse(true)}
              disabled={feedback !== 'idle'}
              className={`mobile-quiz__story-tf mobile-quiz__story-tf--yes
                ${pickedTf === true && feedback === 'right' ? 'mobile-quiz__story-tf--right' : ''}
                ${pickedTf === true && feedback === 'wrong' ? 'mobile-quiz__story-tf--wrong' : ''}`}
            >
              ✓
            </button>
            <button
              type="button"
              onClick={() => submitTrueFalse(false)}
              disabled={feedback !== 'idle'}
              className={`mobile-quiz__story-tf mobile-quiz__story-tf--no
                ${pickedTf === false && feedback === 'right' ? 'mobile-quiz__story-tf--right' : ''}
                ${pickedTf === false && feedback === 'wrong' ? 'mobile-quiz__story-tf--wrong' : ''}`}
            >
              ✕
            </button>
          </div>
        </div>
      )
    }

    if (subStep.kind === 'choice') {
      return (
        <div className="flex flex-col gap-4 w-full">
          <p className="mobile-quiz__story-subprompt text-center font-bold mobile-quiz__text-xl px-1">
            {subStep.partialZh}
          </p>
          <div className="flex flex-col gap-3">
            {subStep.options.map((opt, i) => {
              const isPicked = pickedChoice === i
              const showRight = feedback !== 'idle' && i === subStep.answerIndex
              const showWrong = feedback === 'wrong' && isPicked
              return (
                <button
                  key={opt.zh}
                  type="button"
                  onClick={() => submitChoice(i)}
                  disabled={feedback !== 'idle'}
                  className={`mobile-quiz__story-choice w-full
                    ${showRight ? 'mobile-quiz__story-choice--right' : ''}
                    ${showWrong ? 'mobile-quiz__story-choice--wrong' : ''}
                    ${isPicked && feedback === 'idle' ? 'mobile-quiz__story-choice--picked' : ''}`}
                >
                  {opt.zh}
                </button>
              )
            })}
          </div>
        </div>
      )
    }

    return null
  }

  const shellTitle = subStep?.kind === 'listen' ? data.prompt : (
    subStep?.kind === 'wordPick' ? subStep.prompt
      : subStep?.kind === 'trueFalse' ? subStep.prompt
        : subStep?.kind === 'choice' ? subStep.prompt
          : data.prompt
  )

  const showSubmit = subStep?.kind === 'listen'
    || (subStep?.kind === 'wordPick' && picked.length === subStep.pickCount && feedback === 'idle')

  return (
    <QuestionShell
      layout="compact"
      lessonTitle={lessonTitle}
      title={shellTitle}
      subtitle={`故事 ${subIdx + 1} / ${data.steps.length}`}
      step={step}
      total={total}
      onExit={onExit}
      adaptiveDeps={[subIdx, playing, picked, pickedChoice, pickedTf, feedback]}
      prompt={renderScene(subStep?.kind === 'listen' ? subStep.audioText : undefined)}
      interact={renderInteract()}
      onEnterSubmit={
        subStep?.kind === 'listen' ? () => advanceSub(true)
          : subStep?.kind === 'wordPick' ? submitWordPick
            : undefined
      }
      enterSubmitDisabled={
        subStep?.kind === 'wordPick'
          ? picked.length !== subStep.pickCount || feedback !== 'idle'
          : false
      }
      submit={
        showSubmit ? (
          <MobileSubmitButton
            onClick={subStep?.kind === 'listen' ? () => advanceSub(true) : submitWordPick}
            disabled={subStep?.kind === 'wordPick' && (picked.length !== subStep.pickCount || feedback !== 'idle')}
          >
            {subStep?.kind === 'listen' ? '继续' : '检查'}
          </MobileSubmitButton>
        ) : undefined
      }
    />
  )
}
