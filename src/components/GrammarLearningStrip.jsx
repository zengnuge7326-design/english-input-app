import { useState } from 'react'
import { GRAMMAR_LEARNING_UI_ENABLED } from '../config/grammarUi'

/**
 * 练习页顶部可折叠语法要点条；仅在与 grammarUi 开关同时启用且 meta 存在时由父组件渲染。
 */
export default function GrammarLearningStrip({ meta }) {
  const [open, setOpen] = useState(false)
  if (!GRAMMAR_LEARNING_UI_ENABLED || !meta) return null

  return (
    <div className="w-full rounded-xl border border-slate-700/90 bg-slate-800/95 backdrop-blur-sm overflow-hidden text-left">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-slate-700/40 transition-colors"
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400/90 shrink-0">语法</span>
        <span className="text-sm font-semibold text-white truncate">
          {meta.titleZh}
          <span className="text-gray-500 font-normal text-xs ml-1.5 hidden sm:inline">{meta.titleEn}</span>
        </span>
        <span className="ml-auto text-gray-500 text-xs shrink-0 tabular-nums">{open ? '收起' : '要点'}</span>
        <span className="text-gray-400 text-xs shrink-0">{open ? '▲' : '▼'}</span>
      </button>
      {meta.grammarPurpose?.[0] && !open && (
        <div className="px-3 pb-2.5 -mt-0.5 text-xs text-gray-400 leading-snug line-clamp-2">
          {meta.grammarPurpose[0]}
        </div>
      )}
      {open && (
        <div className="px-3 pb-3 pt-0 space-y-3 border-t border-slate-700/80">
          {meta.grammarPurpose?.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">表达用途</div>
              <ul className="text-xs text-gray-300 space-y-1 list-disc pl-4">
                {meta.grammarPurpose.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          )}
          {meta.formula && (
            <div>
              <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">句型骨架</div>
              <div className="text-xs text-gray-200 font-mono bg-slate-900/80 rounded-lg px-2.5 py-2 border border-slate-700/80 leading-relaxed">
                {meta.formula}
              </div>
            </div>
          )}
          {meta.coreRules?.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-amber-500/90 uppercase tracking-wider mb-1">核心规则</div>
              <ul className="text-xs text-gray-300 space-y-1 list-decimal pl-4">
                {meta.coreRules.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          )}
          {meta.patternFamily && (
            <div>
              <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">句型族</div>
              <p className="text-xs text-gray-400 leading-relaxed">{meta.patternFamily}</p>
            </div>
          )}
          {meta.transferExamples?.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">结构迁移</div>
              <ul className="text-xs text-gray-400 space-y-0.5 font-mono">
                {meta.transferExamples.map((ex, i) => (
                  <li key={i}>{ex}</li>
                ))}
              </ul>
            </div>
          )}
          {meta.commonMistakes?.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-red-400/80 uppercase tracking-wider mb-1">常见错法</div>
              <ul className="text-xs text-gray-400 space-y-0.5 list-disc pl-4">
                {meta.commonMistakes.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          )}
          {meta.extraRules?.length > 0 && (
            <details className="group">
              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400 list-none flex items-center gap-1">
                <span className="group-open:rotate-90 transition-transform inline-block">▸</span>
                扩展规则（选看）
              </summary>
              <ul className="mt-2 text-xs text-gray-500 space-y-1 list-disc pl-4">
                {meta.extraRules.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  )
}
