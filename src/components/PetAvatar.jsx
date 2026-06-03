/**
 * 宠物头像：卡通 SVG + 渐变圆底
 */
import { getPetFallback } from '../data/pets'
import CartoonIcon from './cartoon/CartoonIcon'

export default function PetAvatar({ petId, size = 64, className = '', ring = false }) {
  if (!petId) return null
  const fb = getPetFallback(petId)
  const iconSize = Math.round(size * 0.72)
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${fb.bg} shadow-inner ${ring ? 'ring-4 ring-amber-400' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <CartoonIcon kind="pet" id={petId} size={iconSize} />
    </div>
  )
}
