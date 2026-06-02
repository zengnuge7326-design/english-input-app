/** 输入阅读：朗读 + 领读 1–3 + 整框/整句朗诵范围，与返回按钮同一行使用 */

/** @param {'box'|'sentence'} scope */
export default function ReadingAudioToolbar({
  onSpeakFull,
  onLeadRead,
  onPatchSettings,
  leadReadCount = 1,
  speakDisabled = false,
  readingSpeakScope = 'box',
  onReadingSpeakScopeChange,
}) {
  const leadVisual = Math.min(3, Math.max(1, Number(leadReadCount) || 1))
  const scope = readingSpeakScope === 'sentence' ? 'sentence' : 'box'

  return (
    <div className="flex flex-wrap items-center gap-2 shrink-0">
      <button
        type="button"
        onClick={() => onSpeakFull?.()}
        disabled={speakDisabled || !onSpeakFull}
        className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
          speakDisabled ? 'border-slate-800 text-gray-600 cursor-not-allowed' : 'border-sky-500/60 text-sky-100 hover:bg-slate-800'
        }`}
        title="朗读（范围见右侧「整框/整句」）"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
        朗读
      </button>
      <div className="flex items-center gap-1 rounded-lg border border-slate-600/80 bg-slate-900/60 p-0.5">
        <button
          type="button"
          onClick={() => onReadingSpeakScopeChange?.('box')}
          disabled={!onReadingSpeakScopeChange}
          title="朗读与领读：播放输入框内全部英文"
          className={`rounded-md px-2 py-1 text-[11px] font-semibold transition-colors ${
            scope === 'box'
              ? 'bg-emerald-700 text-white'
              : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800'
          }`}
        >
          整框朗诵
        </button>
        <button
          type="button"
          onClick={() => onReadingSpeakScopeChange?.('sentence')}
          disabled={!onReadingSpeakScopeChange}
          title="朗读与领读：只播放光标所在英文句（按句号等切分）"
          className={`rounded-md px-2 py-1 text-[11px] font-semibold transition-colors ${
            scope === 'sentence'
              ? 'bg-emerald-700 text-white'
              : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800'
          }`}
        >
          整句朗诵
        </button>
      </div>
      <span className="text-xs text-gray-500">领读</span>
      {[1, 2, 3].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => {
            onPatchSettings?.({ leadReadCount: n })
            onLeadRead?.(n)
          }}
          disabled={speakDisabled}
          className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors border ${
            leadVisual === n
              ? 'bg-blue-600 border-blue-400 text-white'
              : 'bg-slate-800/90 border-slate-600 text-gray-400 hover:bg-slate-700 hover:text-white'
          } ${speakDisabled ? 'opacity-40 pointer-events-none' : ''}`}
          title={`领读 ${n} 次（范围同上）`}
        >
          {n}
        </button>
      ))}
    </div>
  )
}
