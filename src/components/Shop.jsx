/**
 * Shop.jsx — 钻石商店主页
 * 4 tabs: 充值 / 道具 / 宠物 / 会员
 * 余额栏从 crystal prop 读取（服务端权威数据）
 */
import { useState, useEffect, useCallback } from 'react'
import GemSVG from './GemSVG'
import PageBackBar from './PageBackBar'

const API = 'https://okenglish.site/api'

const COLOR_INFO = {
  blue:   { label: '蓝', textCls: 'text-blue-400' },
  green:  { label: '绿', textCls: 'text-emerald-400' },
  red:    { label: '红', textCls: 'text-rose-400' },
  purple: { label: '紫', textCls: 'text-purple-400' },
  gold:   { label: '金', textCls: 'text-amber-400' },
}

const TABS = [
  { id: 'recharge',   icon: '🎁', label: '充值' },
  { id: 'items',      icon: '🎫', label: '道具' },
  { id: 'pets',       icon: '🐾', label: '宠物' },
  { id: 'membership', icon: '👑', label: '会员' },
]

// ─── 余额栏 ──────────────────────────────────────────────────────────────────
function BalanceBar({ crystal }) {
  return (
    <div className="bg-gray-900/80 border border-gray-700/60 rounded-2xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-white flex items-center gap-1.5">
          <GemSVG color="gold" size={20} />
          我的钻石
        </span>
        <span className="text-xs text-gray-500">共 <span className="text-white font-semibold tabular-nums">{crystal?.total ?? 0}</span> 颗</span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {['blue', 'green', 'red', 'purple', 'gold'].map(c => (
          <div key={c} className="flex flex-col items-center gap-1">
            <GemSVG color={c} size={28} />
            <span className={`text-base font-bold tabular-nums ${COLOR_INFO[c].textCls}`}>
              {crystal?.[c] ?? 0}
            </span>
            <span className="text-[10px] text-gray-500">{COLOR_INFO[c].label}钻</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Tab 导航栏 ───────────────────────────────────────────────────────────────
function TabBar({ active, onChange }) {
  return (
    <div className="flex gap-2 mb-4">
      {TABS.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`flex-1 flex flex-col items-center py-2 rounded-xl text-xs font-semibold transition-all
            ${active === t.id
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
              : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-200'
            }`}
        >
          <span className="text-lg mb-0.5">{t.icon}</span>
          {t.label}
        </button>
      ))}
    </div>
  )
}

// ─── 购买确认 Modal ──────────────────────────────────────────────────────────
function BuyModal({ product, token, crystal, onSuccess, onClose }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleBuy() {
    if (!token) { setError('请先登录'); return }
    setLoading(true)
    setError(null)
    try {
      const idempotentId = `${Date.now()}-${Math.random().toString(36).slice(2)}`
      const res = await fetch(`${API}/shop/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ product_id: product.id, qty: 1, client_idempotent_id: idempotentId }),
      })
      const data = await res.json()
      if (data.ok) {
        onSuccess(data)
      } else {
        const msgMap = {
          INSUFFICIENT_DIAMOND: '钻石不足',
          STOCK_LIMIT_REACHED: '已达购买上限',
          NOT_LOGGED_IN: '请先登录',
          PRODUCT_NOT_FOUND: '商品不存在',
          DUPLICATE_REQUEST: '重复请求，请稍后重试',
        }
        setError(msgMap[data.error] || data.error || '购买失败')
      }
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  const price = product.price?.[0]
  const priceColor = price?.color
  const priceAmount = price?.amount

  return (
    <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">{product.icon || '📦'}</div>
          <h3 className="text-lg font-bold text-white">{product.name}</h3>
          {product.desc && <p className="text-sm text-gray-400 mt-1">{product.desc}</p>}
        </div>

        <div className="bg-gray-800/60 rounded-xl p-3 mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-400">价格</span>
          {product.rmb_price ? (
            <span className="text-amber-400 font-bold">¥{product.rmb_price}</span>
          ) : priceColor ? (
            <span className="flex items-center gap-1 font-bold">
              <GemSVG color={priceColor} size={18} />
              <span className={COLOR_INFO[priceColor]?.textCls ?? 'text-white'}>{priceAmount}</span>
            </span>
          ) : <span className="text-gray-400">—</span>}
        </div>

        {/* 余额检查 */}
        {priceColor && (
          <div className="text-xs text-center text-gray-500 mb-4">
            当前 {COLOR_INFO[priceColor]?.label}钻：
            <span className={`font-semibold ml-1 ${COLOR_INFO[priceColor]?.textCls}`}>
              {crystal?.[priceColor] ?? 0}
            </span>
            {(crystal?.[priceColor] ?? 0) < (priceAmount ?? 0) && (
              <span className="text-rose-400 ml-1">（不足）</span>
            )}
          </div>
        )}

        {error && <div className="text-rose-400 text-sm text-center mb-3">{error}</div>}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:text-gray-200 text-sm transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleBuy}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors disabled:opacity-50"
          >
            {loading ? '处理中…' : '确认购买'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── 道具 Tab ─────────────────────────────────────────────────────────────────
function ItemsTab({ token, crystal, onBuySuccess }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  useEffect(() => {
    let alive = true
    fetch(`${API}/shop/products?category=item`)
      .then(r => r.json())
      .then(d => { if (alive) { setProducts(d.products || []); setLoading(false) } })
      .catch(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])

  function handleSuccess(data) {
    setSelected(null)
    setSuccessMsg('已加入背包 🎉')
    onBuySuccess?.(data.new_balance)
    setTimeout(() => setSuccessMsg(null), 2500)
  }

  if (loading) return <div className="text-center py-12 text-gray-500 text-sm">加载中…</div>
  if (!products.length) return <div className="text-center py-12 text-gray-500 text-sm">暂无道具</div>

  return (
    <>
      {successMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[250] bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg animate-[fadeIn_.3s_ease]">
          {successMsg}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {products.map(p => {
          const price = p.price?.[0]
          return (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="bg-gray-800/60 border border-gray-700/60 rounded-xl p-3 flex flex-col items-center text-center hover:border-indigo-500/60 hover:bg-gray-700/60 transition-all"
            >
              <span className="text-3xl mb-1">{p.icon || '📦'}</span>
              <span className="text-xs font-semibold text-white truncate w-full">{p.name}</span>
              {p.desc && <span className="text-[10px] text-gray-500 truncate w-full mt-0.5">{p.desc}</span>}
              <div className="mt-2 flex items-center gap-1">
                {p.rmb_price ? (
                  <span className="text-amber-400 text-xs font-bold">¥{p.rmb_price}</span>
                ) : price ? (
                  <>
                    <GemSVG color={price.color} size={14} />
                    <span className={`text-xs font-bold ${COLOR_INFO[price.color]?.textCls ?? 'text-white'}`}>{price.amount}</span>
                  </>
                ) : null}
              </div>
            </button>
          )
        })}
      </div>
      {selected && (
        <BuyModal
          product={selected}
          token={token}
          crystal={crystal}
          onSuccess={handleSuccess}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}

// ─── 会员 Tab ─────────────────────────────────────────────────────────────────
function MembershipTab({ token, crystal, onBuySuccess }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  useEffect(() => {
    let alive = true
    fetch(`${API}/shop/products?category=membership`)
      .then(r => r.json())
      .then(d => { if (alive) { setProducts(d.products || []); setLoading(false) } })
      .catch(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])

  function handleSuccess(data) {
    setSelected(null)
    setSuccessMsg('购买成功 🎉')
    onBuySuccess?.(data.new_balance)
    setTimeout(() => setSuccessMsg(null), 2500)
  }

  if (loading) return <div className="text-center py-12 text-gray-500 text-sm">加载中…</div>
  if (!products.length) return <div className="text-center py-12 text-gray-500 text-sm">暂无会员套餐</div>

  return (
    <>
      {successMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[250] bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg">
          {successMsg}
        </div>
      )}
      <div className="flex flex-col gap-3">
        {products.map(p => {
          const price = p.price?.[0]
          return (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="bg-gradient-to-r from-amber-900/40 to-yellow-900/30 border border-amber-700/50 rounded-2xl p-4 flex items-center gap-4 hover:from-amber-900/60 hover:to-yellow-900/50 transition-all text-left"
            >
              <span className="text-3xl shrink-0">{p.icon || '👑'}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white">{p.name}</div>
                {p.desc && <div className="text-xs text-amber-400/80 mt-0.5">{p.desc}</div>}
              </div>
              <div className="shrink-0 flex items-center gap-1">
                {p.rmb_price ? (
                  <span className="text-amber-400 font-bold text-sm">¥{p.rmb_price}</span>
                ) : price ? (
                  <>
                    <GemSVG color={price.color} size={16} />
                    <span className={`font-bold text-sm ${COLOR_INFO[price.color]?.textCls ?? 'text-white'}`}>{price.amount}</span>
                  </>
                ) : null}
              </div>
            </button>
          )
        })}
      </div>
      {selected && (
        <BuyModal
          product={selected}
          token={token}
          crystal={crystal}
          onSuccess={handleSuccess}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}

// ─── 充值占位（任务 4 实现）────────────────────────────────────────────────────
function RechargeTab() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <span className="text-5xl">🎁</span>
      <div className="text-white font-semibold text-lg">充值金钻石</div>
      <div className="text-gray-400 text-sm max-w-xs">充值面板即将就绪，金钻石是付费货币，可购买宠物、道具等</div>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {[
          { id: 'p1',  rmb: 1,  diamonds: 50,   tag: '' },
          { id: 'p3',  rmb: 3,  diamonds: 160,  tag: '' },
          { id: 'p10', rmb: 10, diamonds: 800,  tag: '最划算' },
          { id: 'p30', rmb: 30, diamonds: 2000, tag: '' },
        ].map(p => (
          <div
            key={p.id}
            className="relative flex items-center justify-between bg-gradient-to-r from-yellow-900/40 to-amber-900/30 border border-amber-700/40 rounded-2xl px-4 py-3"
          >
            {p.tag && (
              <span className="absolute -top-2 -right-1 text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold">{p.tag}</span>
            )}
            <div className="flex items-center gap-2">
              <GemSVG color="gold" size={24} />
              <span className="text-amber-300 font-bold tabular-nums">{p.diamonds.toLocaleString()} 金钻</span>
            </div>
            <span className="text-white font-bold">¥{p.rmb}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-600 mt-2">充值功能开发中，敬请期待</p>
    </div>
  )
}

// ─── 宠物占位（任务 5 实现）────────────────────────────────────────────────────
function PetsTab() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <span className="text-5xl">🐾</span>
      <div className="text-white font-semibold text-lg">宠物图鉴</div>
      <div className="text-gray-400 text-sm max-w-xs">N / R / SR / SSR 四档宠物即将上线，可替换顶部 Logo 头像</div>
      <p className="text-xs text-gray-600">宠物功能开发中，敬请期待</p>
    </div>
  )
}

// ─── 主组件 ──────────────────────────────────────────────────────────────────
export default function Shop({ token, crystal, onClose }) {
  const [tab, setTab] = useState('recharge')
  const [localBalance, setLocalBalance] = useState(null)

  const handleBuySuccess = useCallback((newBalance) => {
    if (newBalance) setLocalBalance(newBalance)
  }, [])

  const displayCrystal = localBalance
    ? {
        ...crystal,
        ...localBalance,
        total: Object.values(localBalance).reduce((a, b) => a + b, 0),
      }
    : crystal

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      {onClose && <PageBackBar onBack={onClose} label="返回练习" />}

      <div className="flex items-center gap-2 mb-4">
        <GemSVG color="gold" size={28} />
        <h2 className="text-xl font-bold text-white">商店</h2>
      </div>

      <BalanceBar crystal={displayCrystal} />

      <TabBar active={tab} onChange={setTab} />

      <div className="min-h-[300px]">
        {tab === 'recharge'   && <RechargeTab />}
        {tab === 'items'      && <ItemsTab token={token} crystal={displayCrystal} onBuySuccess={handleBuySuccess} />}
        {tab === 'pets'       && <PetsTab />}
        {tab === 'membership' && <MembershipTab token={token} crystal={displayCrystal} onBuySuccess={handleBuySuccess} />}
      </div>
    </div>
  )
}
