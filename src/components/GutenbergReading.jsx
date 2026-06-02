import { useState } from 'react'
import PageBackBar from './PageBackBar'
import { GUTENBERG_LEVELS, gutenbergToSentences } from '../data/gutenberg/catalog'

export default function GutenbergReading({ onClose, onStartReading, isMember = true, onShowLogin }) {
  const [levelId, setLevelId] = useState(null)
  const [loadingId, setLoadingId] = useState(null)
  const level = levelId ? GUTENBERG_LEVELS.find(l => l.id === levelId) : null

  async function startArticle(a) {
    const label = `阅读 · ${level.label} · ${a.title}`
    if (a.url) {
      setLoadingId(a.id)
      try {
        const base = import.meta.env.BASE_URL.replace(/\/?$/, '/')
        const pathParts = a.url.split('/').map(encodeURIComponent).join('/')
        const res = await fetch(base + pathParts)
        if (!res.ok) throw new Error(res.statusText || String(res.status))
        const json = await res.json()
        const data = gutenbergToSentences(a.id, json)
        if (data.length === 0) return
        onStartReading(data, label)
      } catch (e) {
        console.error(e)
        alert('加载失败，请确认已运行导入脚本并重新构建。')
      } finally {
        setLoadingId(null)
      }
      return
    }
    const data = gutenbergToSentences(a.id, a.raw)
    if (data.length === 0) return
    onStartReading(data, label)
  }

  if (level) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <PageBackBar onBack={() => setLevelId(null)} label="返回分级" />
        <div className="flex items-center justify-between mb-6 mt-2">
          <div>
            <h2 className="text-lg font-bold text-white">{level.label}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{level.gradeHint}</p>
          </div>
          <span className="text-xs text-gray-500">{level.articles.length} 篇</span>
        </div>
        {!isMember && (
          <p className="text-xs text-gray-500 mb-4">前半部分文章免费体验，开通会员解锁全部文章</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {level.articles.map((a, ai) => {
            const halfIdx = Math.ceil(level.articles.length / 2)
            const locked = !isMember && ai >= halfIdx
            const n = a.url
              ? (a.sentenceCount ?? 0)
              : gutenbergToSentences(a.id, a.raw).length
            const busy = loadingId === a.id
            return (
              <button
                key={a.id}
                type="button"
                disabled={(n === 0 || busy) && !locked}
                onClick={() => {
                  if (locked) { onShowLogin?.(); return }
                  if (n === 0 || busy) return
                  startArticle(a)
                }}
                className={`text-left rounded-xl border border-slate-700 bg-slate-800 hover:border-gray-500 transition-colors p-4 disabled:opacity-40 disabled:cursor-not-allowed relative ${locked ? 'opacity-60' : ''}`}
              >
                <div className="text-white text-sm font-medium leading-snug">{a.title} {locked && '🔒'}</div>
                <div className="text-xs text-gray-500 mt-2">
                  {locked ? '会员专属' : busy ? '加载中…' : `${n} 句 · 输入式阅读`}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {onClose && <PageBackBar onBack={onClose} label="返回" />}
      <div className="flex items-center justify-between mb-2 mt-1">
        <h2 className="text-lg font-bold text-white">输入式阅读</h2>
        <span className="text-xs text-gray-500">Gutenberg 分级</span>
      </div>
      <p className="text-xs text-gray-500 mb-6 leading-relaxed">
        按句输入英文，与主练习共用进度。可将桌面 <code className="text-gray-400">gutenberg_texts</code> 用脚本导入：运行{' '}
        <code className="text-gray-400">npm run import:gutenberg</code>
        （默认读取 ~/Desktop/gutenberg_texts，写入 public/gutenberg 与清单）。各级 Level 内也可直接放入少量 *.json 样例。
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GUTENBERG_LEVELS.map((lv) => (
          <button
            key={lv.id}
            type="button"
            onClick={() => setLevelId(lv.id)}
            className="text-left rounded-2xl border border-slate-700 bg-slate-800 hover:border-gray-500 transition-colors p-5 flex flex-col gap-2"
          >
            <div className="text-sm font-bold text-white">{lv.label}</div>
            <div className="text-[11px] text-gray-500 leading-snug">{lv.gradeHint}</div>
            <div className="text-xs text-gray-600 mt-1">{lv.dir} · {lv.articles.length} 篇</div>
          </button>
        ))}
      </div>
    </div>
  )
}
