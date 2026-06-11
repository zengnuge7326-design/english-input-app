import { AnimatePresence } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { VocabWord } from './data/unit1Vocab'
import {
  VOCAB_PREVIEW_TYPES,
  buildVocabPreviewQuestions,
  buildVocabPracticeLesson,
  type VocabPreviewType,
} from './data/vocabQuizBuilder'
import type { QuestionData } from './types'
import { useMobileTTS } from './hooks/useMobileTTS'
import ListeningQuestion from './components/ListeningQuestion'
import MatchingQuestion from './components/MatchingQuestion'
import SpellingQuestion from './components/SpellingQuestion'
import WordTranslateQuestion from './components/WordTranslateQuestion'
import MobileSubmitButton from './components/MobileSubmitButton'

interface Props {
  words: VocabWord[]
  unitLabel?: string
  bookId?: string
  onExit: () => void
  onComplete: (xp: number) => void
}

type Step = 'intro' | 'quiz' | 'done'

export default function VocabPracticeFlow({
  words,
  unitLabel = '本单元',
  bookId = 'g3-1',
  onExit,
  onComplete,
}: Props) {
  const { prefetch } = useMobileTTS()

  const lesson = useMemo(
    () => buildVocabPracticeLesson(words, unitLabel, bookId),
    [words, unitLabel, bookId],
  )

  const [step, setStep] = useState<Step>('quiz')
  const [quizStep, setQuizStep] = useState(0)
  const [results, setResults] = useState<boolean[]>([])
  const [sessionQuestions, setSessionQuestions] = useState<QuestionData[]>(() => lesson.questions)
  const [isPreview, setIsPreview] = useState(false)

  useEffect(() => {
    if (step === 'quiz') {
      prefetch(words.map(w => w.en))
    }
  }, [step, words, prefetch])

  const questions = sessionQuestions
  const q = questions[quizStep]
  const total = questions.length
  const correct = results.filter(Boolean).length

  function startQuiz(qs: QuestionData[], preview = false) {
    setSessionQuestions(qs)
    setIsPreview(preview)
    setQuizStep(0)
    setResults([])
    setStep('quiz')
  }

  function startPreview(type: VocabPreviewType) {
    const qs = buildVocabPreviewQuestions(type, words, unitLabel, bookId)
    if (qs.length > 0) startQuiz(qs, true)
  }

  function handleAnswer(ok: boolean) {
    setResults(r => [...r, ok])
    if (quizStep + 1 >= total) {
      if (isPreview) {
        setStep('intro')
        setSessionQuestions([])
        setIsPreview(false)
        setQuizStep(0)
        setResults([])
      } else {
        setStep('done')
      }
    } else {
      setQuizStep(s => s + 1)
    }
  }

  const qProps = {
    step: quizStep + 1,
    total,
    lessonTitle: lesson.title,
    onExit,
    onAnswer: handleAnswer,
  }

  if (step === 'quiz' && q) {
    return (
      <div className="mobile-learn-root mobile-learn-root--quiz flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden">
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {q.type === 'wordTranslate' && (
              <WordTranslateQuestion key={q.id} data={q} {...qProps} />
            )}
            {q.type === 'matching' && (
              <MatchingQuestion key={q.id} data={q} {...qProps} />
            )}
            {q.type === 'spelling' && (
              <SpellingQuestion key={q.id} data={q} {...qProps} />
            )}
            {q.type === 'listening' && (
              <ListeningQuestion key={q.id} data={q} {...qProps} />
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  if (step === 'done') {
    return (
      <div className="vocab-practice-done flex flex-col min-h-0 flex-1 items-center justify-center px-6 text-center gap-4">
        <span className="text-5xl">🎉</span>
        <h2 className="text-xl font-black text-white">单词巩固完成！</h2>
        <p className="text-sm text-white/60">
          {unitLabel} · 答对 {correct}/{total} 题
        </p>
        <div className="w-full max-w-xs">
          <MobileSubmitButton onClick={() => onComplete(5)}>
            领取 +5 经验
          </MobileSubmitButton>
        </div>
      </div>
    )
  }

  return (
    <div className="vocab-practice-intro flex flex-col min-h-0 flex-1">
      <header className="shrink-0 px-4 pt-2 safe-top">
        <button type="button" onClick={onExit} className="vocab-match-game__close" aria-label="返回">
          ✕
        </button>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4 min-h-0 overflow-y-auto">
        <div className="vocab-practice-intro__bubble">
          先预览各题型效果，或点继续走完整混练（{words.length} 词）
        </div>
        <span className="text-5xl" aria-hidden>🦉</span>
        <p className="text-xs text-white/45 text-center">题型预览（做完一题自动回到本页）</p>
        <div className="vocab-preview-grid w-full max-w-sm grid grid-cols-2 gap-2.5">
          {VOCAB_PREVIEW_TYPES.map(item => (
            <button
              key={item.type}
              type="button"
              disabled={words.length === 0}
              className="vocab-preview-btn"
              onClick={() => startPreview(item.type)}
            >
              <span className="vocab-preview-btn__emoji" aria-hidden>{item.emoji}</span>
              <span className="vocab-preview-btn__label">{item.label}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-white/35 text-center">
          完整混练共 {Math.max(1, lesson.questions.length)} 步 · 含 5 组配对
        </p>
      </div>
      <div className="shrink-0 px-4 pb-4 safe-bottom">
        <MobileSubmitButton
          onClick={() => startQuiz(lesson.questions)}
          disabled={words.length === 0}
        >
          继续 · 完整混练
        </MobileSubmitButton>
      </div>
    </div>
  )
}
