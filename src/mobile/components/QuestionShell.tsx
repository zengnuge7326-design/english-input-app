import { motion } from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'
import { useAdaptiveQuizScale } from '../hooks/useAdaptiveQuizScale'

interface Props {
  lessonTitle: string
  title: string
  subtitle?: string
  step: number
  total: number
  onExit: () => void
  /** compact：翻译/排序题，收紧题干区 */
  layout?: 'default' | 'compact' | 'aichat'
  /** 内容变化时触发重新测算缩放（如排序题选词） */
  adaptiveDeps?: unknown[]
  prompt: ReactNode
  interact: ReactNode
  submit?: ReactNode
  onEnterSubmit?: () => void
  enterSubmitDisabled?: boolean
}

export default function QuestionShell({
  lessonTitle,
  title,
  subtitle,
  step,
  total,
  onExit,
  layout = 'default',
  adaptiveDeps = [],
  prompt,
  interact,
  submit,
  onEnterSubmit,
  enterSubmitDisabled,
}: Props) {
  const pct = Math.round((step / total) * 100)
  const adaptiveRef = useRef<HTMLDivElement>(null)

  useAdaptiveQuizScale(adaptiveRef, [step, title, subtitle, layout, ...adaptiveDeps])

  useEffect(() => {
    if (!onEnterSubmit) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Enter') return
      if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return
      if (enterSubmitDisabled) return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'TEXTAREA') return
      e.preventDefault()
      onEnterSubmit()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onEnterSubmit, enterSubmitDisabled])

  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`mobile-quiz mobile-quiz--adaptive flex-1 min-h-0 flex flex-col w-full max-w-md mx-auto px-4${layout === 'compact' ? ' mobile-quiz--compact' : ''}${layout === 'aichat' ? ' mobile-quiz--aichat' : ''}`}
    >
      <header className="mobile-quiz__header shrink-0 safe-top">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExit}
            aria-label="退出"
            className="mobile-quiz__close shrink-0 w-8 h-8 min-w-[32px] min-h-[32px] rounded-lg border text-xs font-bold active:scale-95"
          >
            ✕
          </button>
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            <div className="mobile-quiz__meta flex items-center justify-between text-xs font-bold">
              <span>第 {step} / {total} 题</span>
              <span>{pct}%</span>
            </div>
            <div className="mobile-quiz__progress-track h-4 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#4ecdc4] to-[#5a9cf5] transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div
        ref={adaptiveRef}
        className="mobile-quiz__adaptive flex-1 min-h-0 flex flex-col"
      >
        <section className="mobile-quiz__prompt flex flex-col justify-center min-h-0">
          <h2 className="mobile-quiz__title font-black leading-snug px-1 shrink-0">{title}</h2>
          {subtitle && <p className="mobile-quiz__subtitle font-medium px-1 shrink-0">{subtitle}</p>}
          <div className="mobile-quiz__prompt-body flex flex-col justify-center shrink-0">{prompt}</div>
        </section>

        <section className="mobile-quiz__interact min-h-0 overflow-y-auto overscroll-contain flex flex-col">
          {interact}
        </section>

        {submit && (
          <div className="mobile-quiz__submit shrink-0 flex items-end pb-[max(12px,env(safe-area-inset-bottom))]">
            {submit}
          </div>
        )}
      </div>
    </motion.div>
  )
}
