import { TAB_CRYSTAL } from '../data/tabThemes'
import CrystalTabIcon, { type CrystalTabColor } from './CrystalTabIcon'
import MobileIcon, { type MobileIconName } from './MobileIcon'

export type MobileTabId = 'words' | 'lessons' | 'practice' | 'game' | 'menu'

interface TabItem {
  id: MobileTabId
  label: string
  icon: MobileIconName
  crystal: CrystalTabColor
}

const TABS: TabItem[] = [
  { id: 'words', label: '单词', icon: 'languages', crystal: TAB_CRYSTAL.words },
  { id: 'lessons', label: '课文', icon: 'book-open', crystal: TAB_CRYSTAL.lessons },
  { id: 'practice', label: '练习', icon: 'zap', crystal: TAB_CRYSTAL.practice },
  { id: 'game', label: '游戏', icon: 'gamepad-2', crystal: TAB_CRYSTAL.game },
  { id: 'menu', label: '菜单', icon: 'menu', crystal: TAB_CRYSTAL.menu },
]

interface Props {
  active: MobileTabId
  onChange: (tab: MobileTabId) => void
}

export default function MobileTabBar({ active, onChange }: Props) {
  return (
    <nav className="mobile-tab-bar shrink-0 safe-bottom" aria-label="主导航">
      {TABS.map(tab => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`mobile-tab-bar__item mobile-tab-bar__item--${tab.crystal}${isActive ? ' mobile-tab-bar__item--active' : ''}`}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <CrystalTabIcon color={tab.crystal} active={isActive}>
              <MobileIcon name={tab.icon} size={18} className="crystal-tab-icon__svg" />
            </CrystalTabIcon>
          </button>
        )
      })}
    </nav>
  )
}
