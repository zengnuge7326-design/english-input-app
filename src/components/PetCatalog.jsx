/**
 * 宠物图鉴：档位筛选、购买、装备
 */
import { useState, useEffect, useMemo } from 'react'
import GemSVG from './GemSVG'
import PetAvatar from './PetAvatar'
import { TIER_STYLES, TIER_LABELS, getPetDisplayName } from '../data/pets'

const API = 'https://okenglish.site/api'

const FILTER_TABS = [
  { id: 'all', label: '全部' },
  { id: 'N', label: 'N' },
  { id: 'R', label: 'R' },
  { id: 'SR', label: 'SR' },
  { id: 'SSR', label: 'SSR' },
  { id: 'owned', label: '我的' },
]

function formatPrice(product) {
  const p = product.price?.[0]
  if (product.rmb_price) return { type: 'rmb', value: product.rmb_price }
  if (p) return { type: 'diamond', color: p.color, amount: p.amount }
  return null
}

function PetDetailModal({
  product,
  token,
  crystal,
  owned,
  equippedId,
  onClose,
  onBuySuccess,
  onEquipSuccess,
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [celebrate, setCelebrate] = useState(false)

  const isEquipped = equippedId === product.id
  const price = formatPrice(product)
  const tierStyle = TIER_STYLES[product.tier] || TIER_STYLES.N

  async function handleBuy() {
    if (!token) { setError('请先登录'); return }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/shop/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          product_id: product.id,
          qty: 1,
          client_idempotent_id: crypto.randomUUID(),
        }),
      })
      const data = await res.json()
      if (data.ok) {
        setCelebrate(true)
        setTimeout(() => setCelebrate(false), 1200)
        onBuySuccess?.(data)
      } else if (data.error === 'INSUFFICIENT_DIAMOND') {
        setError('金钻不足，去充值')
      } else {
        setError(data.message || data.error || '购买失败')
      }
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  async function handleEquip() {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/shop/equip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ slot: 'avatar', item_id: product.id }),
      })
      const data = await res.json()
      if (data.ok) {
        onEquipSuccess?.(data.equipped)
        onClose()
      } else {
        setError(data.error === 'NOT_OWNED' ? '尚未拥有该宠物' : (data.message || '装备失败'))
      }
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  const goldEnough = !price || price.type !== 'diamond' || price.color !== 'gold'
    || (crystal?.gold ?? 0) >= (price.amount ?? 0)

  return (
    <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className={`bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative overflow-hidden ${celebrate ? 'animate-[fadeIn_.2s_ease]' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        {celebrate && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-6xl animate-pulse z-10">
            🎉
          </div>
        )}

        <div className="flex flex-col items-center text-center mb-5">
          <div className={`rounded-2xl p-2 mb-3 border ${tierStyle.card} ${tierStyle.glow}`}>
            <PetAvatar petId={product.id} size={128} />
          </div>
          <h3 className="text-xl font-bold text-white">{getPetDisplayName(product.id, product.name)}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${tierStyle.badge}`}>
              {product.tier} {TIER_LABELS[product.tier] || ''}
            </span>
            {owned && <span className="text-[10px] text-emerald-400">已拥有</span>}
          </div>
          {product.desc && <p className="text-sm text-gray-400 mt-2">{product.desc}</p>}
          {price && (
            <div className="mt-3 flex items-center gap-1.5">
              {price.type === 'rmb' ? (
                <span className="text-amber-400 font-bold">¥{price.value}</span>
              ) : (
                <>
                  <GemSVG color={price.color} size={20} />
                  <span className="text-amber-300 font-bold tabular-nums">{price.amount} 颗{price.color === 'gold' ? '金' : ''}钻</span>
                </>
              )}
            </div>
          )}
        </div>

        {error && <p className="text-rose-400 text-sm text-center mb-3">{error}</p>}

        <div className="flex flex-col gap-2">
          {!owned && (
            <button
              onClick={handleBuy}
              disabled={loading || (price?.type === 'diamond' && !goldEnough)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm disabled:opacity-50"
            >
              {loading ? '处理中…' : '购买'}
            </button>
          )}
          {owned && !isEquipped && (
            <button
              onClick={handleEquip}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm disabled:opacity-50"
            >
              {loading ? '处理中…' : '装备'}
            </button>
          )}
          {owned && isEquipped && (
            <button disabled className="w-full py-2.5 rounded-xl bg-gray-700 text-gray-400 font-semibold text-sm cursor-not-allowed">
              已装备 ✓
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl border border-gray-700 text-gray-400 hover:text-gray-200 text-sm"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PetCatalog({
  token,
  crystal,
  inventory,
  products: productsProp,
  onBuySuccess,
  onEquippedChange,
}) {
  const [products, setProducts] = useState(productsProp || [])
  const [loading, setLoading] = useState(!productsProp?.length)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const ownedIds = useMemo(
    () => new Set((inventory?.pets || []).map(p => p.item_id)),
    [inventory?.pets],
  )
  const equippedId = inventory?.equipped?.avatar || null

  useEffect(() => {
    if (productsProp?.length) {
      setProducts(productsProp.filter(p => p.category === 'pet'))
      setLoading(false)
      return
    }
    let alive = true
    fetch(`${API}/shop/products?category=pet`)
      .then(r => r.json())
      .then(d => { if (alive) { setProducts(d.products || []); setLoading(false) } })
      .catch(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [productsProp])

  const counts = useMemo(() => {
    const c = { all: products.length, N: 0, R: 0, SR: 0, SSR: 0, owned: ownedIds.size }
    products.forEach(p => {
      if (p.tier && c[p.tier] !== undefined) c[p.tier]++
    })
    return c
  }, [products, ownedIds.size])

  const filtered = useMemo(() => {
    if (filter === 'all') return products
    if (filter === 'owned') return products.filter(p => ownedIds.has(p.id))
    return products.filter(p => p.tier === filter)
  }, [products, filter, ownedIds])

  function handleBuySuccess(data) {
    onBuySuccess?.(data)
  }

  function handleEquipSuccess(equipped) {
    onEquippedChange?.(equipped)
    onInventoryChange?.(prev => ({ ...prev, equipped }))
  }

  if (loading) return <div className="text-center py-12 text-gray-500 text-sm">加载中…</div>
  if (!products.length) return <div className="text-center py-12 text-gray-500 text-sm">暂无宠物</div>

  return (
    <div>
      <div className="text-xs text-gray-500 mb-2">宠物图鉴 · {products.length} 个</div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {FILTER_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors
              ${filter === t.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60'}`}
          >
            {t.label === '我的' ? `我的 ${counts.owned}` : `${t.label} ${t.id !== 'all' ? counts[t.id] ?? '' : counts.all}`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {filtered.map(p => {
          const owned = ownedIds.has(p.id)
          const isEquipped = equippedId === p.id
          const tierStyle = TIER_STYLES[p.tier] || TIER_STYLES.N
          const price = formatPrice(p)
          const displayName = getPetDisplayName(p.id, p.name)

          return (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className={`relative flex flex-col items-center rounded-xl border bg-gray-800/50 p-2 hover:bg-gray-700/50 transition-all text-center ${tierStyle.card}`}
            >
              {isEquipped && (
                <span className="absolute -top-1 -right-1 text-[9px] bg-amber-500 text-black px-1 rounded-full font-bold z-10">
                  已装备
                </span>
              )}
              {owned && !isEquipped && (
                <span className="absolute top-1 left-1 text-[9px] text-emerald-400">✓</span>
              )}
              <PetAvatar petId={p.id} size={56} className="mb-1.5" />
              <span className={`text-[9px] px-1 rounded ${tierStyle.badge}`}>{p.tier}</span>
              <span className="text-[10px] text-white font-medium truncate w-full mt-0.5">{displayName}</span>
              {price && (
                <div className="mt-0.5 flex items-center gap-0.5 justify-center">
                  {price.type === 'rmb' ? (
                    <span className="text-[10px] text-amber-400">¥{price.value}</span>
                  ) : (
                    <>
                      <GemSVG color={price.color} size={10} />
                      <span className="text-[10px] text-amber-300 tabular-nums">{price.amount}</span>
                    </>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {selected && (
        <PetDetailModal
          product={selected}
          token={token}
          crystal={crystal}
          owned={ownedIds.has(selected.id)}
          equippedId={equippedId}
          onClose={() => setSelected(null)}
          onBuySuccess={handleBuySuccess}
          onEquipSuccess={handleEquipSuccess}
        />
      )}
    </div>
  )
}
