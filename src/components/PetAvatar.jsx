/**
 * 宠物头像：卡通 SVG + 渐变圆底
 */
import { getPetFallback } from '../data/pets'
import CartoonIcon from './cartoon/CartoonIcon'

export default function PetAvatar({ petId, size = 64, className = '', ring = false }) {
  if (!petId) return null
  const fb = getPetFallback(petId)
  const iconSize = Math.round(size * 0.82)
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${fb.bg} shadow-[0_4px_14px_rgba(0,0,0,0.2)] ${ring ? 'ring-4 ring-amber-400' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className="absolute rounded-full bg-white/85"
        style={{ inset: Math.max(2, Math.round(size * 0.08)) }}
      />
      <div className="relative z-10 scale-[1.15] drop-shadow-sm">
        <CartoonIcon kind="pet" id={petId} size={iconSize} />
      </div>
    </div>
  )
}
