import { IconArrowLeft } from './Icons'

/** 左上返回条：回到应用内上一级（由 onBack 显式导航）。浏览器物理后退/手势仍走系统 history，与此按钮无关 */
export default function PageBackBar({ onBack, label = '返回', className, inline = false }) {
  if (inline) {
    return (
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-600/60 bg-slate-800/80 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors shrink-0"
      >
        <IconArrowLeft size={16} />
        {label}
      </button>
    )
  }
  const spacing = className != null ? className : 'mb-4'
  return (
    <div className={`flex flex-wrap items-center gap-2 ${spacing}`.trim()}>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-600/60 bg-slate-800/80 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
      >
        <IconArrowLeft size={16} />
        {label}
      </button>
    </div>
  )
}
