import MobileGemIcon from './MobileGemIcon'
import MobileIcon from './MobileIcon'

interface Props {
  streak: number
  crystalTotal: number
  totalXp: number
  todayXp?: number
  goal?: number
  crystalPulse?: number
}

export default function MobileStatusBar({
  streak,
  crystalTotal,
  totalXp,
  todayXp,
  goal,
  crystalPulse = 0,
}: Props) {
  const todayLabel = goal != null && todayXp != null ? `${todayXp}/${goal}` : null

  return (
    <header className="mobile-home-page__status shrink-0 px-3 pt-2 pb-2 safe-top text-xs font-bold text-white grid grid-cols-4 gap-1.5">
      <span
        className="mobile-home-page__pill mobile-home-page__pill--icon justify-center text-white"
        title={todayLabel ? `今日 ${todayLabel} XP · 达标后连胜 +1` : '连续打卡天数'}
      >
        <MobileIcon name="flame" size={14} />
        {streak}
      </span>
      <span
        key={crystalPulse}
        className={[
          'mobile-home-page__pill mobile-home-page__pill--icon justify-center text-white mobile-home-page__pill--gem',
          crystalPulse > 0 ? 'crystal-pulse' : '',
        ].filter(Boolean).join(' ')}
        title="宝石总数"
      >
        <MobileGemIcon size={14} />
        {crystalTotal}
      </span>
      <span
        className="mobile-home-page__pill mobile-home-page__pill--icon justify-center text-white"
        title={todayLabel ? `累计经验 · 今日 ${todayLabel}` : '累计经验'}
      >
        <MobileIcon name="star" size={14} />
        {totalXp}
      </span>
      <span className="mobile-home-page__pill mobile-home-page__pill--icon justify-center text-white" title="学习能量">
        <MobileIcon name="zap" size={14} />
        ∞
      </span>
    </header>
  )
}
