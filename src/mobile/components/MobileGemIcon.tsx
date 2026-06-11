import GemSVG from '../../components/GemSVG'

interface Props {
  color?: 'blue' | 'green' | 'red' | 'purple' | 'gold'
  size?: number
  className?: string
}

/** 顶栏宝石图标（复用主站 GemSVG） */
export default function MobileGemIcon({ color = 'blue', size = 14, className }: Props) {
  return (
    <span className={['mobile-gem-icon inline-flex shrink-0', className].filter(Boolean).join(' ')}>
      <GemSVG color={color} size={size} />
    </span>
  )
}
