import type { CrystalTabColor } from '../components/CrystalTabIcon'
import type { MobileTabId } from '../components/MobileTabBar'

export const TAB_CRYSTAL: Record<MobileTabId, CrystalTabColor> = {
  words: 'green',
  lessons: 'blue',
  practice: 'purple',
  game: 'orange',
  menu: 'black',
}

export function tabThemeClass(tab: MobileTabId): string {
  return `mobile-tab-theme mobile-tab-theme--${TAB_CRYSTAL[tab]}`
}
