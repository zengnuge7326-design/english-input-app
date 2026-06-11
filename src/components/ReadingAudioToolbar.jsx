/** 输入阅读：朗读/停止 + 读单词开关 + 单词朗读 1–5 遍（全局 leadReadCount） */

export default function ReadingAudioToolbar({
  onSpeakFull,
  onStopSpeak,
  isSpeaking = false,
  wordSpeakOn = true,
  onWordSpeakChange,
  onSpeakCurrentWord,
  onPatchSettings,
  leadReadCount = 1,
  speakDisabled = false,
}) {
  const leadVisual = Math.min(5, Math.max(1, Number(leadReadCount) || 1))

  return (
    <div className="flex flex-wrap items-center gap-2 shrink-0 min-w-0">
      <button
        type="button"
        onClick={() => (isSpeaking ? onStopSpeak?.() : onSpeakFull?.())}
        disabled={speakDisabled || (!isSpeaking && !onSpeakFull)}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm font-semibold transition-colors backdrop-blur-sm ${
          speakDisabled
            ? 'border-slate-800 text-gray-600 cursor-not-allowed'
            : isSpeaking
              ? 'border-rose-400/50 bg-rose-500/20 text-rose-100 hover:bg-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
              : 'border-cyan-400/45 bg-cyan-500/15 text-cyan-100 hover:bg-cyan-500/25 shadow-[0_0_10px_rgba(34,211,238,0.15)]'
        }`}
        title={isSpeaking ? '停止朗读' : '朗读本段全文'}
      >
        {isSpeaking ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
            停止
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
            朗读
          </>
        )}
      </button>
      <button
        type="button"
        onClick={() => onWordSpeakChange?.(!wordSpeakOn)}
        disabled={!onWordSpeakChange}
        title={wordSpeakOn ? '关闭：输入时不朗读当前词' : '开启：切到某词时朗读该词'}
        className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
          wordSpeakOn
            ? 'border-emerald-400/50 bg-emerald-500/20 text-emerald-100 shadow-[0_0_8px_rgba(52,211,153,0.2)]'
            : 'border-slate-600/60 bg-slate-800/60 text-slate-400 hover:text-slate-200'
        }`}
      >
        读单词
      </button>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => {
            onPatchSettings?.({ leadReadCount: n })
            if (wordSpeakOn) onSpeakCurrentWord?.(n)
          }}
          disabled={speakDisabled}
          className={`w-8 h-8 rounded-full text-xs font-bold transition-colors border ${
            leadVisual === n
              ? 'bg-cyan-500/35 border-cyan-300/60 text-cyan-50 shadow-[0_0_10px_rgba(34,211,238,0.35)]'
              : 'bg-slate-800/80 border-slate-600/70 text-slate-400 hover:bg-slate-700 hover:text-white'
          } ${speakDisabled ? 'opacity-40 pointer-events-none' : ''}`}
          title={`全局领读 ${n} 遍`}
        >
          {n}
        </button>
      ))}
    </div>
  )
}
