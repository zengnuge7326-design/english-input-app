/**
 * 宠物头像：优先用 OpenMoji SVG 图片，fallback 用 CartoonIcon
 */
import { useState } from 'react'
import { getPetFallback } from '../data/pets'
import CartoonIcon from './cartoon/CartoonIcon'

export default function PetAvatar({ petId, size = 64, className = '', ring = false }) {
  if (!petId) return null
  const fb = getPetFallback(petId)
  const [imgFailed, setImgFailed] = useState(false)
  const iconSize = Math.round(size * 0.82)
  const imgSize = Math.round(size * 0.78)

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
      <div className="relative z-10">
        {!imgFailed ? (
          <img
            src={`/pets/${petId}.svg`}
            alt={petId}
            width={imgSize}
            height={imgSize}
            style={{ objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div style={{ transform: 'scale(1.2)' }}>
            <CartoonIcon kind="pet" id={petId} size={iconSize} />
          </div>
        )}
      </div>
    </div>
  )
}
