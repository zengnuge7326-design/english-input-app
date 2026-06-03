/**
 * 头像选择器：默认熊猫 + 已拥有宠物
 */
import { useState, useEffect } from 'react'
import PetAvatar from './PetAvatar'

const API = 'https://okenglish.site/api'

export default function AvatarPicker({
  token,
  inventory,
  products: productsProp = [],
  onClose,
  onEquippedChange,
  onGoToShop,
}) {
  const [products, setProducts] = useState(productsProp)
  const pets = inventory?.pets || []
  const equippedId = inventory?.equipped?.avatar || null

  useEffect(() => {
    if (productsProp.length) {
      setProducts(productsProp)
      return
    }
    let alive = true
    fetch(`${API}/shop/products?category=pet`)
      .then(r => r.json())
      .then(d => { if (alive) setProducts(d.products || []) })
      .catch(() => {})
    return () => { alive = false }
  }, [productsProp])

  const petNames = Object.fromEntries(
    products.filter(p => p.category === 'pet' || p.id?.startsWith('pet_')).map(p => [p.id, p.name]),
  )

  async function equip(itemId) {
    if (!token) return
    try {
      const res = await fetch(`${API}/shop/equip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ slot: 'avatar', item_id: itemId }),
      })
      const data = await res.json()
      if (data.ok) {
        onEquippedChange?.(data.equipped)
        onClose?.()
      }
    } catch { /* ignore */ }
  }

  return (
    <div className="fixed inset-0 z-[210] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm p-5 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">切换头像</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl w-8 h-8">×</button>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-4">
          {/* 默认熊猫 */}
          <button
            onClick={() => equip(null)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all
              ${!equippedId
                ? 'ring-4 ring-amber-400 border-amber-500/50 bg-gray-800/60'
                : 'border-gray-700 hover:border-gray-500 bg-gray-800/40'}`}
          >
            <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
              <img src="/panda-icon.webp" alt="默认" className="w-full h-full object-cover scale-110" />
            </div>
            <span className="text-[10px] text-gray-400">默认</span>
          </button>

          {pets.map(p => {
            const isEq = equippedId === p.item_id
            const label = (petNames[p.item_id] || p.item_id).replace(/^[^\s]+\s*/, '')
            return (
              <button
                key={p.item_id}
                onClick={() => equip(p.item_id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all
                  ${isEq
                    ? 'ring-4 ring-amber-400 border-amber-500/50 bg-gray-800/60'
                    : 'border-gray-700 hover:border-gray-500 bg-gray-800/40'}`}
              >
                <PetAvatar petId={p.item_id} size={56} />
                <span className="text-[10px] text-gray-400 truncate w-full text-center">{label}</span>
              </button>
            )
          })}
        </div>

        {pets.length === 0 && (
          <p className="text-center text-gray-500 text-xs mb-3">还没有宠物头像，去商店看看吧</p>
        )}

        <div className="flex gap-2">
          {equippedId && (
            <button
              onClick={() => equip(null)}
              className="flex-1 py-2 rounded-xl border border-gray-600 text-gray-400 hover:text-white text-sm"
            >
              卸下当前头像
            </button>
          )}
          {onGoToShop && (
            <button
              onClick={onGoToShop}
              className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold"
            >
              去商店买更多 →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
