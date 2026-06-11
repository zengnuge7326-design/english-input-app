import { AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { gemsForLessonComplete, type GemReward } from './data/mobileCrystalRules'
import { useMobileTTS } from './hooks/useMobileTTS'
import { collectLessonAudioTexts } from './utils/lessonAudio'
import AIChatMock from './components/AIChatMock'
import ChoiceQuestion from './components/ChoiceQuestion'
import DictationQuestion from './components/DictationQuestion'
import ListeningQuestion from './components/ListeningQuestion'
import MatchingQuestion from './components/MatchingQuestion'
import StoryListenQuestion from './components/StoryListenQuestion'
import PhonicsIntroQuestion from './components/PhonicsIntroQuestion'
import PhonicsPickQuestion from './components/PhonicsPickQuestion'
import PhonicsRepeatQuestion from './components/PhonicsRepeatQuestion'
import PhonicsSameDiffQuestion from './components/PhonicsSameDiffQuestion'
import OrderingQuestion from './components/OrderingQuestion'
import SpeakingQuestion from './components/SpeakingQuestion'
import SpellingQuestion from './components/SpellingQuestion'
import SummaryScreen from './components/SummaryScreen'
import TranslateClozeQuestion from './components/TranslateClozeQuestion'
import WordTranslateQuestion from './components/WordTranslateQuestion'
import type { CrystalEarnFn, Lesson } from './types'

export interface LessonRewardMeta {
  nodeId: string
  baseXp: number
  firstClear: boolean
  isExam: boolean
  setsDone: number
  maxSets: number
}

interface Props {
  lesson: Lesson
  rewardMeta: LessonRewardMeta
  onCrystalEarn?: CrystalEarnFn
  onComplete: (result: { correct: number; total: number }) => void
  onExit: () => void
}

function computeXpEarned(meta: LessonRewardMeta, perfect: boolean, newSets: number) {
  return (
    meta.baseXp
    + (perfect ? 2 : 0)
    + (newSets >= meta.maxSets && meta.setsDone < meta.maxSets && !meta.isExam ? 3 : 0)
    + (meta.isExam && meta.firstClear ? 5 : 0)
  )
}

export default function LessonFlow({ lesson, rewardMeta, onCrystalEarn, onComplete, onExit }: Props) {
  const { prefetch } = useMobileTTS()
  const [step, setStep] = useState(0)
  const [results, setResults] = useState<boolean[]>([])
  const [showSummary, setShowSummary] = useState(false)
  const [gemsEarned, setGemsEarned] = useState<GemReward[]>([])
  const gemsGrantedRef = useRef(false)
  const correct = results.filter(Boolean).length

  useEffect(() => {
    prefetch(collectLessonAudioTexts(lesson))
  }, [lesson, prefetch])

  const questions = lesson.questions
  const q = questions[step]
  const total = questions.length

  function handleAnswer(ok: boolean) {
    setResults(r => [...r, ok])
    if (step + 1 >= total) {
      setShowSummary(true)
    } else {
      setStep(s => s + 1)
    }
  }

  const qProps = {
    step: step + 1,
    total,
    lessonTitle: lesson.title,
    onExit,
    onAnswer: handleAnswer,
  }

  const questionTotal = questions.length
  const perfect = correct === questionTotal && questionTotal > 0
  const newSets = rewardMeta.isExam
    ? 3
    : Math.min(rewardMeta.maxSets, rewardMeta.setsDone + 1)
  const xpEarned = computeXpEarned(rewardMeta, perfect, newSets)

  useEffect(() => {
    if (!showSummary || gemsGrantedRef.current) return
    gemsGrantedRef.current = true
    const gems = gemsForLessonComplete({
      correct,
      total: questionTotal,
      firstClear: rewardMeta.firstClear,
      isExam: rewardMeta.isExam,
      setsDone: rewardMeta.setsDone,
      newSets,
      maxSets: rewardMeta.maxSets,
      perfect,
    })
    setGemsEarned(gems)
    for (const g of gems) {
      onCrystalEarn?.(g.color, g.amount, g.reason, {
        nodeId: rewardMeta.nodeId,
        correct,
        total: questionTotal,
      })
    }
  }, [showSummary, correct, questionTotal, rewardMeta, newSets, perfect, onCrystalEarn])

  function finish() {
    onComplete({ correct, total: questionTotal })
  }

  if (showSummary) {
    return (
      <div className="mobile-learn-root mobile-learn-root--quiz flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden">
        <SummaryScreen
          title={lesson.title}
          xpEarned={xpEarned}
          correct={correct}
          total={questionTotal}
          gemsEarned={gemsEarned}
          onContinue={finish}
        />
      </div>
    )
  }

  return (
    <div className="mobile-learn-root mobile-learn-root--quiz flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden">
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {q.type === 'translate' && (
            <TranslateClozeQuestion key={q.id} data={q} {...qProps} />
          )}
          {q.type === 'wordTranslate' && (
            <WordTranslateQuestion key={q.id} data={q} {...qProps} />
          )}
          {q.type === 'matching' && (
            <MatchingQuestion key={q.id} data={q} {...qProps} />
          )}
          {q.type === 'storyListen' && (
            <StoryListenQuestion key={q.id} data={q} {...qProps} />
          )}
          {q.type === 'phonicsIntro' && (
            <PhonicsIntroQuestion key={q.id} data={q} {...qProps} />
          )}
          {q.type === 'phonicsPick' && (
            <PhonicsPickQuestion key={q.id} data={q} {...qProps} />
          )}
          {q.type === 'phonicsSameDiff' && (
            <PhonicsSameDiffQuestion key={q.id} data={q} {...qProps} />
          )}
          {q.type === 'phonicsRepeat' && (
            <PhonicsRepeatQuestion key={q.id} data={q} {...qProps} />
          )}
          {q.type === 'listening' && (
            <ListeningQuestion key={q.id} data={q} {...qProps} />
          )}
          {q.type === 'dictation' && (
            <DictationQuestion key={q.id} data={q} {...qProps} />
          )}
          {q.type === 'spelling' && (
            <SpellingQuestion key={q.id} data={q} {...qProps} />
          )}
          {q.type === 'ordering' && (
            <OrderingQuestion key={q.id} data={q} {...qProps} />
          )}
          {q.type === 'choice' && (
            <ChoiceQuestion key={q.id} data={q} {...qProps} />
          )}
          {q.type === 'speaking' && (
            <SpeakingQuestion key={q.id} data={q} {...qProps} />
          )}
          {q.type === 'aichat' && (
            <AIChatMock key={q.id} data={q} {...qProps} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
