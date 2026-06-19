/**
 * 教材目录卡片 — 教材同步 / 单词 共用，保持排版一致
 */
export default function CatalogBookCard({
  title,
  desc,
  percent = 0,
  statLabel,
  onClick,
  disabled = false,
  cover,
  showProgress = true,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex flex-col rounded-2xl overflow-hidden border transition-all text-left
        ${disabled
          ? 'border-slate-700 border-dashed cursor-default opacity-40'
          : 'border-gray-700 hover:border-gray-500 cursor-pointer'}
      `}
    >
      <div className="w-full aspect-[3/4] flex items-center justify-center overflow-hidden relative bg-gray-800">
        {cover}
      </div>
      <div className="bg-slate-800 p-3 flex flex-col gap-1">
        <div className="text-sm font-medium text-white truncate">{title}</div>
        <div className="text-xs text-gray-500 truncate">{desc}</div>
        {showProgress && (
          <>
            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            {statLabel != null && (
              <div className="text-xs text-gray-600">{statLabel}</div>
            )}
          </>
        )}
      </div>
    </button>
  )
}
