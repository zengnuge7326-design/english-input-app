/**
 * 宠物头像展示：优先 emoji + 渐变底（pets.js），后续可切 SVG
 */
import { getPetFallback } from '../data/pets'

export default function PetAvatar({ petId, size = 64, className = '', ring = false }) {
  if (!petId) return null
  const fb = getPetFallback(petId)
  const fontSize = Math.round(size * 0.52)
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${fb.bg} ${ring ? 'ring-4 ring-amber-400' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <span role="img" aria-hidden style={{ fontSize, lineHeight: 1 }}>
        {fb.emoji}
      </span>
    </div>
  )
}
