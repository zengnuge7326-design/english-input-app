import { useState } from 'react'
import MobileGemIcon from './components/MobileGemIcon'
import MobileIcon from './components/MobileIcon'
import MobileInstallTip from './components/MobileInstallTip'
import { isMobileSfxEnabled, setMobileSfxEnabled } from './hooks/useMobileSfx'

interface Props {
  streak: number
  totalXp: number
  crystalTotal: number
  completedCount: number
  todayXp?: number
  goal?: number
  onBackHome: () => void
  onExitApp: () => void
  onResetProgress: () => void
  onOpenPhonics?: () => void
  onOpenShop?: () => void
  shellMode?: boolean
}

export default function MorePage({
  streak,
  totalXp,
  crystalTotal,
  completedCount,
  todayXp,
  goal,
  onBackHome,
  onExitApp,
  onResetProgress,
  onOpenPhonics,
  onOpenShop,
  shellMode,
}: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [sfxOn, setSfxOn] = useState(isMobileSfxEnabled)

  function toggleSfx() {
    const next = !sfxOn
    setSfxOn(next)
    setMobileSfxEnabled(next)
  }

  function handleClearProgress() {
    const ok = window.confirm(
      '确定要清除所有学习进度吗？\n\n岛屿水晶、已完成关卡、今日学习记录将被重置，此操作不可撤销。',
    )
    if (!ok) return
    onResetProgress()
    setSettingsOpen(false)
    window.alert('学习进度已清除，已从第一座岛屿重新开始。')
  }

  return (
    <div className="mobile-more-page flex flex-col min-h-0 flex-1 overflow-y-auto overscroll-contain">
      <header className="mobile-more-page__header shrink-0 px-4 pt-3 pb-2 safe-top">
        <h1 className="text-xl font-black text-white">菜单</h1>
        <p className="text-xs text-white/55 mt-0.5">音标 · 设置 · 更多</p>
      </header>

      <div className="px-4 pb-4 flex flex-col gap-3">
        <div className="mobile-more-page__stats grid grid-cols-4 gap-2">
          <div className="mobile-more-page__stat">
            <MobileIcon name="flame" size={20} />
            <span className="font-black text-white">{streak}</span>
            <span className="text-[10px] text-white/50">连胜</span>
          </div>
          <div className="mobile-more-page__stat">
            <MobileGemIcon size={20} />
            <span className="font-black text-white">{crystalTotal}</span>
            <span className="text-[10px] text-white/50">宝石</span>
          </div>
          <div className="mobile-more-page__stat">
            <MobileIcon name="star" size={20} />
            <span className="font-black text-white">{totalXp}</span>
            <span className="text-[10px] text-white/50">经验</span>
          </div>
          <div className="mobile-more-page__stat">
            <MobileIcon name="check" size={20} />
            <span className="font-black text-white">{completedCount}</span>
            <span className="text-[10px] text-white/50">已完成</span>
          </div>
        </div>
        {goal != null && todayXp != null && (
          <p className="text-[11px] text-white/45 text-center -mt-1">
            今日经验 {todayXp}/{goal} · 达标后连胜 +1
          </p>
        )}

        <MobileInstallTip />

        <button type="button" onClick={onBackHome} className="mobile-more-page__row">
          <MobileIcon name="home" size={20} />
          <span className="flex-1 text-left font-semibold">返回课文地图</span>
          <span className="text-white/40">›</span>
        </button>
        {onOpenPhonics && (
          <button type="button" onClick={onOpenPhonics} className="mobile-more-page__row">
            <MobileIcon name="languages" size={20} />
            <span className="flex-1 text-left font-semibold">音标学习</span>
            <span className="text-white/40">›</span>
          </button>
        )}
        {onOpenShop && (
          <button type="button" onClick={onOpenShop} className="mobile-more-page__row">
            <MobileGemIcon size={20} />
            <span className="flex-1 text-left font-semibold">宝石小店 · 充值</span>
            <span className="text-white/40">›</span>
          </button>
        )}
        <button type="button" className="mobile-more-page__row mobile-more-page__row--muted" disabled>
          <MobileIcon name="bell" size={20} />
          <span className="flex-1 text-left font-semibold">学习提醒</span>
          <span className="text-[10px] text-white/40">即将推出</span>
        </button>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setSettingsOpen(v => !v)}
            className="mobile-more-page__row"
            aria-expanded={settingsOpen}
          >
            <MobileIcon name="settings" size={20} />
            <span className="flex-1 text-left font-semibold">学习设置</span>
            <span className="text-white/40">{settingsOpen ? '▾' : '›'}</span>
          </button>

          {settingsOpen && (
            <div className="mobile-more-page__settings-panel flex flex-col gap-2 pl-1">
              {/* 音效开关 */}
              <button
                type="button"
                onClick={toggleSfx}
                className="mobile-more-page__row"
                aria-pressed={sfxOn}
              >
                <MobileIcon name="volume-2" size={20} />
                <span className="flex-1 text-left font-semibold">答题音效</span>
                <span className={`mobile-more-page__switch${sfxOn ? ' mobile-more-page__switch--on' : ''}`} aria-hidden>
                  <span className="mobile-more-page__switch-knob" />
                </span>
              </button>

              <p className="text-xs text-white/50 px-1 mt-1">
                清除后将从 Unit 1 第一座岛屿重新开始，水晶进度与已完成关卡全部归零。
              </p>
              <button
                type="button"
                onClick={handleClearProgress}
                className="mobile-more-page__row mobile-more-page__row--danger"
              >
                <MobileIcon name="trash-2" size={20} />
                <span className="flex-1 text-left font-semibold">一键清除学习进度</span>
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onExitApp}
          className="mobile-more-page__row mobile-more-page__row--danger mt-2"
        >
          <MobileIcon name="log-out" size={20} />
          <span className="flex-1 text-left font-semibold">
            {shellMode ? '退出手机模式' : '返回主站'}
          </span>
        </button>
      </div>
    </div>
  )
}
