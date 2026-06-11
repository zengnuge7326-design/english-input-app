import {
  avatarRoleFromSpeaker,
  iconForAvatarRole,
  type QuizAvatarRole,
} from '../data/quizIconMap'
import QuizIcon from './QuizIcon'

interface Props {
  role?: QuizAvatarRole
  speaker?: string
  name?: string
  emoji?: string
  size?: number
}

const ROLE_TONE: Record<QuizAvatarRole, string> = {
  teacher: 'quiz-avatar--teacher',
  student: 'quiz-avatar--student',
  boy: 'quiz-avatar--boy',
  girl: 'quiz-avatar--girl',
  shop: 'quiz-avatar--shop',
  visitor: 'quiz-avatar--visitor',
  friend: 'quiz-avatar--friend',
}

/** 故事/对话角色头像（替代 emoji 人脸） */
export default function QuizAvatar({ role, speaker, name, size = 28 }: Props) {
  const resolvedRole = role ?? avatarRoleFromSpeaker(speaker ?? 'student', name)
  const iconName = iconForAvatarRole(resolvedRole)
  const initial = (name ?? speaker ?? '?').trim().charAt(0).toUpperCase()

  return (
    <span className={['quiz-avatar', ROLE_TONE[resolvedRole]].join(' ')} aria-hidden>
      <QuizIcon name={iconName} size={size} variant="avatar" />
      <span className="quiz-avatar__initial">{initial}</span>
    </span>
  )
}
