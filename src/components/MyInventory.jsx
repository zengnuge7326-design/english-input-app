/**
 * 我的背包：道具使用 + 宠物装备
 */
import { useState, useMemo } from 'react'
import PetAvatar from './PetAvatar'
import CartoonIcon from './cartoon/CartoonIcon'
import { getPetFallback } from '../data/pets'

const API = 'https://okenglish.site/api'

function productLookup(products, id) {
  const p = products.find(x => x.id === id)
  return p || { id, name: id, icon: '📦', desc: '' }
}

export default function MyInventory({
  token,
  inventory,
  products = [],
  onClose,
  onInventoryChange,
  onEquippedChange,
  onGoToShopPets,
}) {
  const [tab, setTab] = useState('items')
  const [loadingId, setLoadingId] = useState(null)
  const [toast, setToast] = useState(null)

  const items = inventory?.items || []
  const pets = inventory?.pets || []
  const equipped = inventory?.equipped || {}

  const petProducts = useMemo(
    () => products.filter(p => p.category === 'pet'),
    [products],
  )

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 2800)
  }

  async function handleUse(itemId) {
    if (!token) return
    setLoadingId(itemId)
    try {
      const res = await fetch(`${API}/shop/inventory/use`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ item_id: itemId }),
      })
      const data = await res.json()
      if (data.ok) {
        const meta = productLookup(products, itemId)
        showToast(`${meta.icon || '📦'} ${meta.name} 已生效 · 剩余 ${data.remaining ?? 0} 张`)
        onInventoryChange?.(prev => ({
          ...prev,
          items: (prev?.items || [])
            .map(it => it.item_id === itemId ? { ...it, count: data.remaining ?? 0 } : it)
            .filter(it => it.count > 0),
        }))
      } else {
        showToast(data.message || data.error || '使用失败')
      }
    } catch {
      showToast('网络错误，请重试')
    } finally {
      setLoadingId(null)
    }
  }

  async function handleEquip(itemId) {
    if (!token) return
    setLoadingId(itemId)
    try {
      const res = await fetch(`${API}/shop/equip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ slot: 'avatar', item_id: itemId }),
      })
      const data = await res.json()
      if (data.ok) {
        onEquippedChange?.(data.equipped)
        onInventoryChange?.(prev => ({ ...prev, equipped: data.equipped }))
        showToast('头像已更换')
      } else {
        showToast(data.error === 'NOT_OWNED' ? '尚未拥有' : '装备失败')
      }
    } catch {
      showToast('网络错误')
    } finally {
      setLoadingId(null)
    }
  }

  const equippedPetId = equipped.avatar
  const equippedMeta = equippedPetId ? productLookup(petProducts.length ? petProducts : products, equippedPetId) : null

  return (
    <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="shrink-0 px-5 py-3 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">🎒 我的背包</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none w-8 h-8">×</button>
        </div>

        <div className="shrink-0 flex gap-2 px-4 pt-3">
          {[
            { id: 'items', label: `道具 ${items.length}` },
            { id: 'pets', label: `宠物 ${pets.length}` },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold ${tab === t.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 min-h-[200px]">
          {tab === 'items' && (
            items.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-8">暂无道具，去商店看看吧</p>
            ) : (
              <ul className="space-y-2">
                {items.map(it => {
                  const meta = productLookup(products, it.item_id)
                  const disabled = it.count <= 0
                  return (
                    <li
                      key={it.item_id}
                      className={`flex items-center gap-3 rounded-xl border border-gray-700/60 px-3 py-2.5 ${disabled ? 'opacity-40' : 'bg-gray-800/40'}`}
                    >
                      <CartoonIcon kind="item" id={it.item_id} size={36} className="shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{meta.name}</div>
                        <div className="text-xs text-gray-500">×{it.count}</div>
                      </div>
                      <button
                        onClick={() => handleUse(it.item_id)}
                        disabled={disabled || loadingId === it.item_id}
                        className="shrink-0 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-50"
                      >
                        {loadingId === it.item_id ? '…' : '使用'}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )
          )}

          {tab === 'pets' && (
            <>
              <div className="mb-4 rounded-xl border border-gray-700/60 bg-gray-800/40 p-3">
                <div className="text-xs text-gray-500 mb-2">装备槽 · 头像</div>
                <div className="flex items-center gap-3">
                  {equippedPetId ? (
                    <>
                      <PetAvatar petId={equippedPetId} size={40} />
                      <span className="text-sm text-white flex-1 truncate">
                        {equippedMeta?.name || equippedPetId}
                      </span>
                      <button
                        onClick={() => handleEquip(null)}
                        disabled={!!loadingId}
                        className="text-xs text-gray-400 hover:text-white px-2 py-1 border border-gray-600 rounded-lg"
                      >
                        卸下
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xl">🐼</div>
                      <span className="text-sm text-gray-400 flex-1">默认熊猫</span>
                      {onGoToShopPets && (
                        <button onClick={onGoToShopPets} className="text-xs text-indigo-400 hover:text-indigo-300">
                          更换 →
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {pets.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-4">还没有宠物</p>
              ) : (
                <ul className="space-y-2">
                  {pets.map(p => {
                    const meta = productLookup(petProducts.length ? petProducts : products, p.item_id)
                    const isEq = equippedPetId === p.item_id
                    return (
                      <li
                        key={p.item_id}
                        className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${isEq ? 'border-amber-500/60 bg-amber-900/20' : 'border-gray-700/60 bg-gray-800/40'}`}
                      >
                        <PetAvatar petId={p.item_id} size={40} ring={isEq} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white truncate">{meta.name || p.item_id}</div>
                          {isEq && <div className="text-[10px] text-amber-400">当前装备</div>}
                        </div>
                        {!isEq && (
                          <button
                            onClick={() => handleEquip(p.item_id)}
                            disabled={loadingId === p.item_id}
                            className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold disabled:opacity-50"
                          >
                            装备
                          </button>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </>
          )}
        </div>

        {toast && (
          <div className="shrink-0 mx-4 mb-3 py-2 px-3 rounded-lg bg-emerald-900/50 border border-emerald-700/50 text-emerald-200 text-xs text-center">
            {toast}
          </div>
        )}
      </div>
    </div>
  )
}
