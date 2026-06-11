import QuizIcon from './QuizIcon'

interface Props {
  size?: number
  active?: boolean
  className?: string
}

/** 统一播放图标（替代 🔊） */
export default function QuizPlayButton({ size = 24, active, className }: Props) {
  return (
    <span
      className={[
        'quiz-play-btn inline-flex items-center justify-center',
        active ? 'quiz-play-btn--active' : '',
        className,
      ].filter(Boolean).join(' ')}
      aria-hidden
    >
      <QuizIcon name="volume-2" size={size} variant="play" />
    </span>
  )
}
