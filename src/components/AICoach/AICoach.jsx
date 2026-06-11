// AI Coach 主组件
// 三个场景：textbook（教材陪练）/ translate（汉译英挑战）/ free（自由对话）
import { useState, useEffect, useRef, useCallback } from 'react'
import { useHistoryLayer } from '../../hooks/useHistoryLayer'
import CloseBadge from '../CloseBadge'

const API = 'https://okenglish.site/api'

const SCENES = [
  {
    id: 'textbook',
    icon: '📚',
    name: '教材陪练',
    desc: '基于课本句子的对话练习',
    color: 'from-blue-400 to-indigo-600',
    starter: '你好！来练习几句课本里的句子吧。请说一句英语试试，例如 "I have a pencil."',
  },
  {
    id: 'translate',
    icon: '🏆',
    name: '汉译英挑战',
    desc: '输中文，我给你 2-3 个英文译法',
    color: 'from-amber-400 to-orange-600',
    starter: '把你想翻译的中文句子发给我，我会给出 2-3 个英文译法 + 解释。',
  },
  {
    id: 'free',
    icon: '💬',
    name: '自由表达',
    desc: '随便聊，我会指出语法错误',
    color: 'from-emerald-400 to-teal-600',
    starter: "Hi! Let's chat. What did you do today? (Tell me in English.)",
  },
]

export default function AICoach({ onClose, token }) {
  useHistoryLayer(true, onClose)
  const [view, setView] = useState('select')  // select | chat
  const [scene, setScene] = useState(null)
  const [messages, setMessages] = useState([])  // { role: 'assistant'|'user', content }
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [usage, setUsage] = useState({ used: 0, limit: 100, remaining: 100 })
  const [error, setError] = useState('')
  const scrollerRef = useRef(null)

  // 获取用量
  const fetchUsage = useCallback(async () => {
    if (!token) return
    try {
      const r = await fetch(`${API}/coach/usage`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      const data = await r.json()
      if (data.ok) setUsage(data)
    } catch {}
  }, [token])
  useEffect(() => { fetchUsage() }, [fetchUsage])

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 1e9, behavior: 'smooth' })
  }, [messages, loading])

  const startScene = (s) => {
    setScene(s)
    setMessages([{ role: 'assistant', content: s.starter }])
    setView('chat')
    setError('')
  }

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    if (!token) { setError('请先登录'); return }
    const newMsgs = [...messages, { role: 'user', content: text }]
    setMessages(newMsgs)
    setInput('')
    setLoading(true)
    setError('')
    try {
      const r = await fetch(`${API}/coach/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scene: scene.id,
          messages: newMsgs.map(m => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await r.json()
      if (!r.ok || !data.ok) {
        if (data.error === 'daily_limit_exceeded') {
          setError(`今日 AI 额度已用完（${data.message || ''}）`)
        } else {
          setError(data.message || data.detail || data.error || `请求失败 (${r.status})`)
        }
        setLoading(false)
        return
      }
      setMessages(m => [...m, { role: 'assistant', content: data.reply }])
      setUsage(u => ({ ...u, used: data.used, remaining: data.remaining }))
    } catch (err) {
      setError(err.message || '网络异常')
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex flex-col select-none"
      style={{
        background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 30%, #4c1d95 65%, #6d28d9 100%)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}>
      {/* 装饰光晕 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-pink-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[28rem] h-[28rem] rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full bg-violet-500/15 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-30 flex items-center justify-between gap-2 px-3 py-2.5 shrink-0 bg-white/5 backdrop-blur-xl border-b border-white/15">
        <div className="flex items-center gap-1.5">
          {view === 'chat' && (
            <button
              onClick={() => setView('select')}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white shadow flex items-center justify-center"
              title="返回">
              <span className="text-lg leading-none">←</span>
            </button>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-white/20 text-white">
            <span className="text-base">🤖</span>
            <span className="text-sm font-bold">
              {view === 'chat' ? `AI Coach · ${scene?.name}` : 'AI Coach'}
            </span>
          </div>
        </div>
        <div className="mr-12 flex items-center gap-2">
          <div className="text-[11px] text-white/70 tabular-nums">
            今日 {usage.used}/{usage.limit}
          </div>
        </div>
      </header>
      <CloseBadge onClose={onClose} />

      {/* 主体 */}
      {view === 'select' && (
        <main className="relative z-10 flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-2xl mx-auto">
            <p className="text-white/95 text-sm sm:text-base text-center mb-5 drop-shadow">
              AI Coach 由 <span className="font-semibold">GLM-4-Flash</span> 驱动 · 模糊匹配 · 即时纠错 · 语法分析
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SCENES.map(s => (
                <button key={s.id}
                  onClick={() => startScene(s)}
                  className={`group relative overflow-hidden text-left p-5 rounded-2xl border border-white/25 bg-gradient-to-br ${s.color}
                    hover:scale-[1.04] hover:shadow-2xl shadow-lg transition-all ring-1 ring-white/30`}>
                  <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/20 blur-xl group-hover:scale-150 transition-transform" />
                  <div className="text-5xl mb-2 relative z-10 drop-shadow-lg">{s.icon}</div>
                  <div className="text-lg font-extrabold text-white drop-shadow relative z-10">{s.name}</div>
                  <div className="text-sm text-white/90 mt-0.5 relative z-10">{s.desc}</div>
                </button>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-2xl bg-white/12 border border-white/25 text-sm text-white/90 backdrop-blur-xl shadow-lg">
              💡 每位用户每天 <span className="font-bold text-amber-300">{usage.limit}</span> 次免费对话。
              错误用 <span className="text-rose-300">❌</span> 标，正确写法用 <span className="text-emerald-300">✅</span>，
              语法小贴士用 <span className="text-yellow-300">💡</span>。
            </div>
          </div>
        </main>
      )}

      {view === 'chat' && (
        <>
          {/* 对话区 */}
          <main ref={scrollerRef} className="relative z-10 flex-1 overflow-y-auto px-3 sm:px-4 py-4">
            <div className="max-w-2xl mx-auto flex flex-col gap-3.5">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-lg
                    ${m.role === 'user'
                      ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-tr-sm shadow-blue-900/40'
                      : 'bg-white/95 text-slate-900 rounded-tl-sm shadow-black/30 ring-1 ring-white/30'}`}>
                    <div className="text-[15px] sm:text-base whitespace-pre-wrap leading-relaxed">{m.content}</div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-4 py-3 bg-white/95 ring-1 ring-white/30 rounded-tl-sm shadow-lg">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '120ms' }} />
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '240ms' }} />
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <div className="text-center text-sm text-rose-100 bg-rose-500/30 ring-1 ring-rose-300/40 rounded-xl px-3 py-2 backdrop-blur">
                  ⚠️ {error}
                </div>
              )}
            </div>
          </main>

          {/* 输入区 — 大输入框 + 大字 + 亮色玻璃风 */}
          <footer className="relative z-20 shrink-0 border-t border-white/15 bg-white/8 backdrop-blur-xl px-3 sm:px-4 py-3 sm:py-4">
            <div className="max-w-2xl mx-auto flex gap-2.5 items-end">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={scene?.id === 'translate' ? '输入要翻译的中文…' : '输入英语句子…（Enter 发送，Shift+Enter 换行）'}
                rows={2}
                className="flex-1 resize-none px-4 py-3.5 rounded-2xl bg-white/95 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 text-base sm:text-[17px] leading-relaxed shadow-lg ring-1 ring-white/40"
                style={{ minHeight: 56, maxHeight: 160 }}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="shrink-0 px-5 py-3.5 sm:px-6 rounded-2xl bg-gradient-to-br from-pink-500 via-violet-500 to-indigo-500 text-white font-extrabold text-base shadow-lg shadow-purple-900/40 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all ring-1 ring-white/30">
                {loading ? '…' : '发送'}
              </button>
            </div>
          </footer>
        </>
      )}
    </div>
  )
}
