import MobileGemIcon from './MobileGemIcon'
import MobileIcon from './MobileIcon'

interface Props {
  streak: number
  crystalTotal: number
  totalXp: number
  todayXp?: number
  goal?: number
  crystalPulse?: number
  /** 点 🔥 或 ⭐ → 打开排行榜 */
  onOpenLeaderboard?: () => void
  /** 点 💎 → 打开宝石小店 */
  onOpenShop?: () => void
}

export default function MobileStatusBar({
  streak,
  crystalTotal,
  totalXp,
  todayXp,
  goal,
  crystalPulse = 0,
  onOpenLeaderboard,
  onOpenShop,
}: Props) {
  const todayLabel = goal != null && todayXp != null ? `${todayXp}/${goal}` : null

  return (
    <header className="mobile-home-page__status shrink-0 px-3 pt-2 pb-2 safe-top text-xs font-bold text-white grid grid-cols-4 gap-1.5">
      <button
        type="button"
        onClick={onOpenLeaderboard}
        className="mobile-home-page__pill mobile-home-page__pill--icon justify-center text-white"
        title={todayLabel ? `今日 ${todayLabel} XP · 点击查看排行榜` : '连续打卡 · 点击查看排行榜'}
      >
        <MobileIcon name="flame" size={14} />
        {streak}
      </button>
      <button
        type="button"
        key={crystalPulse}
        onClick={onOpenShop}
        className={[
          'mobile-home-page__pill mobile-home-page__pill--icon justify-center text-white mobile-home-page__pill--gem',
          crystalPulse > 0 ? 'crystal-pulse' : '',
        ].filter(Boolean).join(' ')}
        title="宝石总数 · 点击进入小店"
      >
        <MobileGemIcon size={14} />
        {crystalTotal}
      </button>
      <button
        type="button"
        onClick={onOpenLeaderboard}
        className="mobile-home-page__pill mobile-home-page__pill--icon justify-center text-white"
        title={todayLabel ? `累计经验 · 今日 ${todayLabel} · 点击查看排行榜` : '累计经验 · 点击查看排行榜'}
      >
        <MobileIcon name="star" size={14} />
        {totalXp}
      </button>
      <span className="mobile-home-page__pill mobile-home-page__pill--icon justify-center text-white" title="学习能量">
        <MobileIcon name="zap" size={14} />
        ∞
      </span>
    </header>
  )
}
