import { TAB_ICONS } from './tabs'
import { ItemIcon, ITEM_ICONS } from './items'
import { PetIcon, PET_ICONS } from './pets'

/**
 * 商店卡通图标统一入口
 * @param {'tab'|'item'|'pet'} kind
 * @param {string} id — tab: recharge|items|pets|membership；item/pet: product id
 */
export default function CartoonIcon({ kind, id, size = 48, className = '' }) {
  if (kind === 'tab') {
    const C = TAB_ICONS[id]
    if (!C) return null
    return (
      <span className={`inline-flex items-center justify-center ${className}`}>
        <C size={size} />
      </span>
    )
  }
  if (kind === 'item') {
    return (
      <span className={`inline-flex items-center justify-center ${className}`}>
        <ItemIcon id={id} size={size} />
      </span>
    )
  }
  if (kind === 'pet') {
    return (
      <span className={`inline-flex items-center justify-center ${className}`}>
        <PetIcon id={id} size={size} />
      </span>
    )
  }
  return null
}

export function resolveProductIconId(product) {
  if (!product) return null
  if (product.category === 'pet') return product.id
  if (product.category === 'membership') return product.id
  return product.id
}

export { TAB_ICONS, ITEM_ICONS, PET_ICONS }
