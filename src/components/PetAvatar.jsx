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
      className={`relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${fb.bg} shadow-[inset_0_2px_8px_rgba(255,255,255,0.25),0_6px_18px_rgba(0,0,0,0.35)] ${ring ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-gray-900' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className="absolute rounded-full bg-gradient-to-b from-white/50 to-transparent"
        style={{ inset: Math.max(2, Math.round(size * 0.06)), bottom: '42%' }}
      />
      <div
        className="absolute rounded-full border border-white/20"
        style={{ inset: Math.max(3, Math.round(size * 0.1)) }}
      />
      <div className="relative z-10 scale-[1.2]">
        <CartoonIcon kind="pet" id={petId} size={iconSize} />
      </div>
    </div>
  )
}
