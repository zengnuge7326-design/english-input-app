/**
 * 全站统一关闭按钮。
 * - 固定右上角，避开刘海/安全区
 * - 高 z-index 永不被遮挡
 * - 视觉 ~28px，触控 40×40，手机也好按
 * - 半透明圆形 + 模糊背景，深浅页面都能看清
 */
export default function CloseBadge({ onClose, label = '关闭', offsetTop = 0, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label={label}
      title={label}
      className={`fixed z-[9999] flex items-center justify-center w-10 h-10 rounded-full bg-white/85 hover:bg-white text-slate-800 shadow-lg backdrop-blur active:scale-95 transition-transform ${className}`}
      style={{
        top: `calc(max(8px, env(safe-area-inset-top, 0px)) + ${offsetTop}px)`,
        right: 'max(8px, env(safe-area-inset-right, 0px))',
        lineHeight: 1,
      }}
    >
      <span className="text-xl font-bold leading-none -mt-0.5">×</span>
    </button>
  )
}
