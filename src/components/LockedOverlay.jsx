import { useState } from 'react'

/**
 * LockedOverlay — 通用解锁遮罩
 *
 * Props:
 *   locked: bool — 是否锁定（false 时直接渲染 children）
 *   cost: number — 解锁所需水晶数
 *   color: 'blue'|'green'|'red'|'purple'|'gold' — 扣费色（默认 blue）
 *   crystalBalance: number — 当前余额（用于按钮可用态）
 *   title: string — 锁定项名称（如 "四年级上册"）
 *   reason: string — 锁定原因提示（如 "完成上一册解锁，或花费钻石跳关"）
 *   onUnlock: () => Promise<{ok, reason?}> — 调用 useUnlocks().unlock
 *   onGoShop?: () => void — 余额不足时引导去小店
 *   children — 被锁的卡片内容（会被灰化）
 *   embedded?: bool — true 时按内联卡片样式（套在卡片外）；false 时为全屏弹窗（暂未用）
 */
export default function LockedOverlay({
  locked,
  cost,
  color = 'blue',
  crystalBalance = 0,
  title,
  reason = '完成上一关解锁，或花费钻石提前开启',
  onUnlock,
  onGoShop,
  children,
}) {
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  if (!locked) return children

  const enough = crystalBalance >= cost

  async function handleConfirm() {
    setBusy(true)
    setErr('')
    const r = await onUnlock()
    setBusy(false)
    if (r?.ok) {
      setConfirming(false)
    } else if (r?.reason === 'insufficient') {
      setErr(`钻石不够，需要 ${r.need}，你有 ${r.have}`)
    } else {
      setErr('解锁失败，请稍后再试')
    }
  }

  return (
    <div className="relative">
      {/* 灰化的原内容 */}
      <div
        aria-hidden
        className="pointer-events-none select-none"
        style={{ filter: 'grayscale(0.85) brightness(0.5)' }}
      >
        {children}
      </div>

      {/* 锁定遮罩 */}
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center bg-slate-900/60 hover:bg-slate-900/40 transition-colors group"
        title={`点击花费 ${cost} 💎 解锁`}
      >
        <div className="px-3 py-1.5 rounded-full bg-purple-600/90 border border-purple-400/60 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 group-hover:scale-105 transition-transform">
          <span>💎</span>
          <span className="tabular-nums">{cost}</span>
          <span>解锁</span>
        </div>
        {title && (
          <span className="mt-2 text-[11px] text-slate-300 font-bold tracking-wide">{title}</span>
        )}
      </button>

      {/* 确认弹窗 */}
      {confirming && (
        <div
          className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={e => { if (e.target === e.currentTarget) setConfirming(false) }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
            <div className="text-center">
              <div className="text-4xl mb-2">💎</div>
              <h3 className="text-lg font-black text-white mb-1">解锁{title || '此项'}</h3>
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

            {err && (
              <div className="text-center text-red-400 text-xs mb-3">{err}</div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setConfirming(false)}
                disabled={busy}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold transition-colors"
              >取消</button>
              {enough ? (
                <button
                  onClick={handleConfirm}
                  disabled={busy}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-bold transition-colors disabled:opacity-60"
                >{busy ? '解锁中…' : `花费 ${cost} 💎 解锁`}</button>
              ) : onGoShop ? (
                <button
                  onClick={() => { setConfirming(false); onGoShop() }}
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
      )}
    </div>
  )
}
