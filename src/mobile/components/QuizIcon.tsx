import type { QuizIconName } from '../data/quizIconMap'
import pencilIcon from '../assets/icons/quiz/pencil.svg?raw'
import penIcon from '../assets/icons/quiz/pen.svg?raw'
import rulerIcon from '../assets/icons/quiz/ruler.svg?raw'
import eraserIcon from '../assets/icons/quiz/eraser.svg?raw'
import backpackIcon from '../assets/icons/quiz/backpack.svg?raw'
import bookOpenIcon from '../assets/icons/quiz/book-open.svg?raw'
import packageIcon from '../assets/icons/quiz/package.svg?raw'
import paintbrushIcon from '../assets/icons/quiz/paintbrush.svg?raw'
import handIcon from '../assets/icons/quiz/hand.svg?raw'
import idCardIcon from '../assets/icons/quiz/id-card.svg?raw'
import eyeIcon from '../assets/icons/quiz/eye.svg?raw'
import userIcon from '../assets/icons/quiz/user.svg?raw'
import messageCircleIcon from '../assets/icons/quiz/message-circle.svg?raw'
import folderOpenIcon from '../assets/icons/quiz/folder-open.svg?raw'
import bookXIcon from '../assets/icons/quiz/book-x.svg?raw'
import doorOpenIcon from '../assets/icons/quiz/door-open.svg?raw'
import languagesIcon from '../assets/icons/quiz/languages.svg?raw'
import volume2Icon from '../assets/icons/quiz/volume-2.svg?raw'
import userRoundIcon from '../assets/icons/quiz/user-round.svg?raw'
import graduationCapIcon from '../assets/icons/quiz/graduation-cap.svg?raw'

const ICONS: Record<QuizIconName, string> = {
  pencil: pencilIcon,
  pen: penIcon,
  ruler: rulerIcon,
  eraser: eraserIcon,
  backpack: backpackIcon,
  'book-open': bookOpenIcon,
  package: packageIcon,
  paintbrush: paintbrushIcon,
  hand: handIcon,
  'id-card': idCardIcon,
  eye: eyeIcon,
  user: userIcon,
  'message-circle': messageCircleIcon,
  'folder-open': folderOpenIcon,
  'book-x': bookXIcon,
  'door-open': doorOpenIcon,
  languages: languagesIcon,
  'volume-2': volume2Icon,
  'user-round': userRoundIcon,
  'graduation-cap': graduationCapIcon,
}

export type QuizIconVariant = 'prompt' | 'inline' | 'play' | 'avatar'

interface Props {
  name: QuizIconName
  size?: number
  className?: string
  variant?: QuizIconVariant
  label?: string
}

function renderSvg(raw: string, size: number) {
  return raw
    .replace(/width="[^"]*"/, `width="${size}"`)
    .replace(/height="[^"]*"/, `height="${size}"`)
}

export function quizIconRaw(name: QuizIconName): string {
  return ICONS[name] ?? languagesIcon
}

export default function QuizIcon({ name, size = 24, className, variant = 'inline', label }: Props) {
  const raw = quizIconRaw(name)
  const svg = renderSvg(raw, size)
  return (
    <span
      className={[
        'quiz-icon',
        `quiz-icon--${variant}`,
        className,
      ].filter(Boolean).join(' ')}
      style={{ width: size, height: size }}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
