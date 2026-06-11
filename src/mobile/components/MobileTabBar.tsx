import MobileIcon, { type MobileIconName } from './MobileIcon'

export type MobileTabId = 'words' | 'lessons' | 'practice' | 'menu'

interface TabItem {
  id: MobileTabId
  label: string
  icon: MobileIconName
}

const TABS: TabItem[] = [
  { id: 'words', label: '单词', icon: 'languages' },
  { id: 'lessons', label: '课文', icon: 'book-open' },
  { id: 'practice', label: '练习', icon: 'zap' },
  { id: 'menu', label: '菜单', icon: 'menu' },
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
            className={`mobile-tab-bar__item${isActive ? ' mobile-tab-bar__item--active' : ''}`}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <MobileIcon name={tab.icon} size={20} className="mobile-tab-bar__icon" />
            <span className="mobile-tab-bar__label">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
