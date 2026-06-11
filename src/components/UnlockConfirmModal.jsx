import { useState } from 'react'

/**
 * UnlockConfirmModal — 全站统一的宝石解锁确认弹窗
 *
 * z-index 规范：chrome=100 / modal=1000 / confirm=1100（本组件属 confirm 档）
 *
 * Props:
 *   title: string — 解锁项名称（如 "后 10 个字母 (Q-Z)"）
 *   reason: string — 解锁条件说明
 *   cost: number — 钻石价
 *   crystalBalance: number — 当前蓝钻余额
 *   onConfirm: () => Promise<{ok, reason?, need?, have?}> — 调 useUnlocks().unlock
 *   onCancel: () => void
 *   onGoShop?: () => void — 余额不足时去小店
 */
export default function UnlockConfirmModal({
  title,
  reason,
  cost,
  crystalBalance = 0,
  onConfirm,
  onCancel,
  onGoShop,
}) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const enough = crystalBalance >= cost

  async function handle() {
    setBusy(true)
    setErr('')
    const r = await onConfirm()
    setBusy(false)
    if (!r?.ok) {
      if (r?.reason === 'insufficient') setErr(`钻石不够，需要 ${r.need}，你有 ${r.have}`)
      else setErr('解锁失败，请稍后再试')
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
        <div className="text-center">
          <div className="text-4xl mb-2">💎</div>
          <h3 className="text-lg font-black text-white mb-1">解锁{title}</h3>
          <p className="text-xs text-slate-400 mb-4">{reason}</p>
        </div>
        <div className="rounded-xl bg-slate-800/70 border border-slate-700 px-4 py-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">解锁价</span>
            <span className="font-bold text-purple-300 tabular-nums">💎 {cost}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1.5">
            <span className="text-slate-400">我的钻石</span>
            <span className={`font-bold tabular-nums ${enough ? 'text-emerald-300' : 'text-red-400'}`}>
              💎 {crystalBalance}
            </span>
          </div>
        </div>
        {err && <div className="text-center text-red-400 text-xs mb-3">{err}</div>}
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={busy}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold transition-colors"
          >取消</button>
          {enough ? (
            <button
              onClick={handle}
              disabled={busy}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-bold transition-colors disabled:opacity-60"
            >{busy ? '解锁中…' : `花费 ${cost} 💎 解锁`}</button>
          ) : onGoShop ? (
            <button
              onClick={onGoShop}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold"
            >去小店补充钻石</button>
          ) : (
            <button
              disabled
              className="flex-1 py-2.5 rounded-xl bg-slate-700 text-slate-500 text-sm font-bold cursor-not-allowed"
            >钻石不足</button>
          )}
        </div>
      </div>
    </div>
  )
}
