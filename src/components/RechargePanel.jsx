/**
 * 充值金钻面板：4 档充值 + 迅虎微信扫码 + 轮询 + 主动核验
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import GemSVG from './GemSVG'

const API = 'https://okenglish.site/api'

const PACK_STYLES = {
  p1: {
    card: 'from-slate-200/95 via-slate-300/90 to-slate-400/85 border-slate-400/50',
    tag: '新手',
    tagCls: 'bg-slate-600 text-white',
  },
  p3: {
    card: 'from-cyan-200/95 via-teal-300/90 to-cyan-500/85 border-cyan-400/50',
    tag: null,
    tagCls: '',
  },
  p10: {
    card: 'from-amber-200/95 via-yellow-300/90 to-amber-500/85 border-amber-400/60 shadow-[0_0_28px_rgba(251,191,36,0.35)]',
    tag: '⭐ 最划算',
    tagCls: 'bg-rose-600 text-white',
  },
  p30: {
    card: 'from-purple-300/95 via-violet-400/90 to-purple-600/85 border-purple-400/50',
    tag: '大额',
    tagCls: 'bg-purple-700 text-white',
  },
}

const PACK_ORDER = ['p1', 'p3', 'p10', 'p30']

function bonusLabel(pack) {
  const base = (pack.rmb || 0) * 500
  if (!base || !pack.diamonds) return null
  const extra = pack.diamonds - base
  if (extra <= 0) return null
  const pct = Math.round((extra / base) * 100)
  return `+${pct}%`
}

export default function RechargePanel({ token, onShowLogin, onSuccess }) {
  const [packs, setPacks] = useState([])
  const [loadingPack, setLoadingPack] = useState(null)
  const [error, setError] = useState('')

  const [paying, setPaying] = useState(false)
  const [qrcode, setQrcode] = useState('')
  const [payUrl, setPayUrl] = useState('')
  const [orderId, setOrderId] = useState('')
  const [activePack, setActivePack] = useState(null)
  const [polling, setPolling] = useState(false)
  const [showVerifyBtn, setShowVerifyBtn] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [successDiamonds, setSuccessDiamonds] = useState(null)

  const pollRef = useRef(null)
  const verifyTimerRef = useRef(null)
  const stopPollRef = useRef(null)

  useEffect(() => {
    let alive = true
    fetch(`${API}/shop/recharge-packs`)
      .then(r => r.json())
      .then(d => {
        if (!alive) return
        const list = (d.packs || []).slice().sort(
          (a, b) => PACK_ORDER.indexOf(a.id) - PACK_ORDER.indexOf(b.id),
        )
        setPacks(list)
      })
      .catch(() => {})
    return () => { alive = false }
  }, [])

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
      if (verifyTimerRef.current) clearTimeout(verifyTimerRef.current)
      if (stopPollRef.current) clearTimeout(stopPollRef.current)
    }
  }, [])

  const closePayModal = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current)
    if (verifyTimerRef.current) clearTimeout(verifyTimerRef.current)
    if (stopPollRef.current) clearTimeout(stopPollRef.current)
    setPaying(false)
    setQrcode('')
    setPayUrl('')
    setOrderId('')
    setActivePack(null)
    setPolling(false)
    setShowVerifyBtn(false)
    setVerifying(false)
  }, [])

  const handlePaid = useCallback((diamonds) => {
    closePayModal()
    setSuccessDiamonds(diamonds)
    onSuccess?.(diamonds)
    setTimeout(() => setSuccessDiamonds(null), 4000)
  }, [closePayModal, onSuccess])

  const startPolling = useCallback((oid, expectedDiamonds) => {
    setPolling(true)
    setShowVerifyBtn(false)
    verifyTimerRef.current = setTimeout(() => setShowVerifyBtn(true), 30000)

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API}/shop/recharge/status/${oid}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const json = await res.json()
        if (json.status === 'paid' || (json.ok && json.status === 'paid')) {
          handlePaid(json.diamonds ?? expectedDiamonds)
        }
      } catch { /* ignore */ }
    }, 3000)

    stopPollRef.current = setTimeout(() => {
      if (pollRef.current) clearInterval(pollRef.current)
      setPolling(false)
    }, 600000)
  }, [token, handlePaid])

  async function handlePackClick(pack) {
    if (!token) {
      onShowLogin?.()
      return
    }
    setLoadingPack(pack.id)
    setError('')
    try {
      const res = await fetch(`${API}/shop/recharge/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ pack_id: pack.id }),
      })
      const json = await res.json()
      if (json.error || json.ok === false) {
        throw new Error(json.message || json.error || '创建订单失败')
      }
      setActivePack(pack)
      setQrcode(json.qrcode || '')
      setPayUrl(json.url || '')
      setOrderId(json.order_id || json.orderId || '')
      setPaying(true)
      startPolling(json.order_id || json.orderId, json.diamonds ?? pack.diamonds)
    } catch (e) {
      setError(e.message || '创建订单失败')
      setTimeout(() => setError(''), 5000)
    } finally {
      setLoadingPack(null)
    }
  }

  async function handleManualVerify() {
    if (!orderId) return
    setVerifying(true)
    setError('')
    try {
      const res = await fetch(`${API}/shop/recharge/query/${orderId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (json.status === 'paid' || (json.ok && json.status === 'paid')) {
        handlePaid(json.diamonds ?? activePack?.diamonds)
      } else {
        setError('暂未查询到支付记录，请稍后再试')
        setTimeout(() => setError(''), 4000)
      }
    } catch {
      setError('核验失败，请稍后重试')
      setTimeout(() => setError(''), 4000)
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="relative">
      {successDiamonds != null && (
        <div className="mb-4 py-3 px-4 rounded-xl bg-emerald-900/50 border border-emerald-600/50 text-center text-emerald-200 font-semibold animate-[fadeIn_.3s_ease]">
          🎉 +{successDiamonds} 金钻已到账！
        </div>
      )}

      <div className="text-sm text-gray-400 mb-3">充值金钻</div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {packs.map(pack => {
          const style = PACK_STYLES[pack.id] || PACK_STYLES.p1
          const tag = pack.tag || style.tag
          const bonus = bonusLabel(pack)
          const isLoading = loadingPack === pack.id

          return (
            <button
              key={pack.id}
              type="button"
              disabled={!!loadingPack}
              onClick={() => handlePackClick(pack)}
              className={`relative flex flex-col items-center rounded-2xl border p-3 min-h-[140px] transition-all bg-gradient-to-br ${style.card}
                hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none`}
            >
              {tag && (
                <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap z-10 ${style.tagCls}`}>
                  {tag}
                </span>
              )}
              <span className="text-lg font-bold text-gray-900 mt-1">¥{pack.rmb}</span>
              <div className="flex items-center gap-1 my-2">
                <GemSVG color="gold" size={22} />
                <span className="text-2xl font-black text-amber-900 tabular-nums">{pack.diamonds}</span>
              </div>
              <span className="text-xs font-semibold text-amber-900/80">金钻</span>
              {bonus && (
                <span className="text-[10px] mt-1 font-bold text-emerald-800 bg-white/40 px-1.5 rounded-full">
                  {bonus}
                </span>
              )}
              {isLoading && (
                <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/30 text-white text-xs font-semibold">
                  加载中…
                </span>
              )}
            </button>
          )
        })}
      </div>

      {packs.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">加载充值档位…</div>
      )}

      <p className="text-xs text-gray-500 text-center mb-1">
        💎 充值后获得金钻，可购买宠物 / 道具
      </p>
      <p className="text-xs text-gray-600 text-center">
        📞 支付问题请联系客服（微信同号）
      </p>

      {error && !paying && (
        <p className="mt-3 text-center text-rose-400 text-sm">{error}</p>
      )}

      {paying && (
        <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4" onClick={closePayModal}>
          <div
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-white font-bold text-lg mb-1">微信扫码支付</h3>
            {activePack && (
              <p className="text-amber-400 text-sm mb-3">
                ¥{activePack.rmb} · {activePack.diamonds} 金钻
              </p>
            )}

            {qrcode ? (
              <img
                src={qrcode}
                alt="支付二维码"
                className="w-56 h-56 mx-auto bg-white p-3 rounded-xl object-contain"
              />
            ) : (
              <div className="w-56 h-56 mx-auto bg-gray-800 rounded-xl flex items-center justify-center text-gray-500 text-sm">
                加载二维码…
              </div>
            )}

            {payUrl && (
              <a
                href={payUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-3 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-semibold"
              >
                📱 打开支付页
              </a>
            )}

            <p className="text-sm text-gray-400 mt-3">
              支付完成后将自动到账。如长时间未到账，请点击「我已支付」核验。
            </p>

            {polling && (
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                等待支付确认中…
              </div>
            )}

            {error && <p className="mt-2 text-rose-400 text-xs">{error}</p>}

            <div className="flex gap-2 mt-4">
              {showVerifyBtn && (
                <button
                  type="button"
                  onClick={handleManualVerify}
                  disabled={verifying}
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold"
                >
                  {verifying ? '核验中…' : '我已支付'}
                </button>
              )}
              <button
                type="button"
                onClick={closePayModal}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
