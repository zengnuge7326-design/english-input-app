import { IconArrowLeft } from './Icons'

/** 左上返回条：用于子页面回到上一级（不使用浏览器 history） */
export default function PageBackBar({ onBack, label = '返回' }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
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
