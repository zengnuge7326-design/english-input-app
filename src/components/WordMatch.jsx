import { useState, useEffect, useRef, useCallback } from 'react'
import { useSound } from '../hooks/useSound'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const TOTAL_TIME = 90
const MAX_PAIRS = 6

// 简易 TTS 播放（用站点 /api/tts 接口）
const audioCache = new Map()
function speakWord(text) {
  if (!text) return
  const t = String(text).trim().toLowerCase()
  if (!t) return
  try {
    const url = `https://okenglish.site/api/tts?text=${encodeURIComponent(t)}&voice=en-US-AvaNeural`
    let audio = audioCache.get(url)
    if (!audio) {
      audio = new Audio(url)
      audio.preload = 'auto'
      audioCache.set(url, audio)
    }
    audio.currentTime = 0
    audio.play().catch(() => {
      // 后备：用 speechSynthesis
      try {
        const u = new SpeechSynthesisUtterance(t)
        u.lang = 'en-US'; u.rate = 0.9
        window.speechSynthesis?.cancel()
        window.speechSynthesis?.speak(u)
      } catch {}
    })
  } catch {}
}

// 每次调用都重新随机抽词 + 独立打乱两列顺序
function generateGame(words) {
  const picked = shuffle([...words]).slice(0, MAX_PAIRS).map((w, i) => ({
    idx: i,
    zh: w.zh,
    en: w.word ?? w.en ?? w.zh,
  }))
  return {
    pairs: picked,
    leftItems: shuffle([...picked]),
    rightItems: shuffle([...picked]),
  }
}

// 蓝色喇叭 + 静态波形图标（替代红色圆形录音按钮风格）
function SpeakerWave({ playing = false }) {
  return (
    <span className="inline-flex items-center gap-2 text-blue-400">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M3 9v6h4l5 4V5L7 9H3z"/>
        <path d="M16.5 12c0-1.77-1-3.29-2.5-4.03v8.05c1.5-.73 2.5-2.25 2.5-4.02z" opacity="0.85"/>
      </svg>
      {/* 简易波形（5 根竖条），播放时跳动 */}
      <span className="flex items-end gap-[3px] h-5">
        {[0.4, 0.85, 0.55, 1, 0.6].map((h, i) => (
          <span
            key={i}
            className={`w-[3px] rounded-full bg-blue-400 ${playing ? 'wave-anim' : ''}`}
            style={{ height: `${h * 100}%`, animationDelay: `${i * 90}ms` }}
          />
        ))}
      </span>
    </span>
  )
}

export default function WordMatch({ words, onClose, onCrystal, onXp, playSound, settings }) {
  const [mode, setMode] = useState('classic') // 'classic' | 'listen'
  const [game, setGame] = useState(() => generateGame(words))
  const { pairs, leftItems, rightItems } = game
  const { playCorrect, playError, playVictory } = useSound(settings)

  const [selLeft,    setSelLeft]    = useState(null)
  const [selRight,   setSelRight]   = useState(null)
  const [matched,    setMatched]    = useState(new Set())
  const [shakeLeft,  setShakeLeft]  = useState(null)
  const [shakeRight, setShakeRight] = useState(null)
  const [playingIdx, setPlayingIdx] = useState(null) // 当前喇叭按钮正在播音
  const [timer,      setTimer]      = useState(TOTAL_TIME)
  const [done,       setDone]       = useState(false)
  const [errors,     setErrors]     = useState(0)
  const [combo,      setCombo]      = useState(0)
  const [maxCombo,   setMaxCombo]   = useState(0)
  const timerRef = useRef(null)
  const shakeRef = useRef(false)

  // 启动倒计时
  function startTimer() {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current); setDone(true); return 0 }
        return t - 1
      })
    }, 1000)
  }

  useEffect(() => { startTimer(); return () => clearInterval(timerRef.current) }, [])

  // 全部配对完成
  useEffect(() => {
    if (matched.size === pairs.length && pairs.length > 0) {
      clearInterval(timerRef.current)
      // 胜利音效
      try { playVictory?.() } catch {}
      setTimeout(() => setDone(true), 400)
    }
  }, [matched.size, pairs.length, playVictory])

  function triggerSpeak(item) {
    setPlayingIdx(item.idx)
    speakWord(item.en)
    setTimeout(() => setPlayingIdx(p => (p === item.idx ? null : p)), 1100)
  }

  const tryMatch = useCallback((li, ri) => {
    if (shakeRef.current) return
    const left  = leftItems[li]
    const right = rightItems[ri]
    if (left.idx === right.idx) {
      setMatched(prev => new Set([...prev, left.idx]))
      setSelLeft(null); setSelRight(null)
      setCombo(c => { const n = c + 1; setMaxCombo(m => Math.max(m, n)); return n })
      try { playCorrect?.() } catch {}
      playSound?.('correct')
    } else {
      setErrors(e => e + 1)
      setCombo(0)
      shakeRef.current = true
      setShakeLeft(li); setShakeRight(ri)
      try { playError?.() } catch {}
      playSound?.('wrong')
      setTimeout(() => {
        setShakeLeft(null); setShakeRight(null)
        setSelLeft(null);   setSelRight(null)
        shakeRef.current = false
      }, 650)
    }
  }, [leftItems, rightItems, playSound, playCorrect, playError])

  function handleLeft(i) {
    if (matched.has(leftItems[i].idx) || shakeRef.current) return
    // 听力模式下，点左列同时播音
    if (mode === 'listen') triggerSpeak(leftItems[i])
    setSelLeft(i)
    if (selRight !== null) { tryMatch(i, selRight); return }
    setSelRight(null)
  }

  function handleRight(i) {
    if (matched.has(rightItems[i].idx) || shakeRef.current) return
    setSelRight(i)
    if (selLeft !== null) { tryMatch(selLeft, i); return }
    setSelLeft(null)
  }

  function handleNewRound() {
    setGame(generateGame(words))   // 重新随机抽词 + 打乱两列
    setMatched(new Set())
    setErrors(0); setCombo(0); setMaxCombo(0)
    setSelLeft(null); setSelRight(null)
    setShakeLeft(null); setShakeRight(null)
    shakeRef.current = false
    setTimer(TOTAL_TIME)
    setDone(false)
    startTimer()
  }

  function toggleMode() {
    const next = mode === 'classic' ? 'listen' : 'classic'
    setMode(next)
    handleNewRound()
  }

  // ── 结果页 ──────────────────────────────────────────────────────────────────
  if (done) {
    const perfect  = errors === 0
    const timeUp   = timer === 0 && matched.size < pairs.length
    const gemColor = perfect ? 'text-green-400' : maxCombo >= 3 ? 'text-purple-400' : 'text-blue-400'
    const gemEmoji = perfect ? '💚' : maxCombo >= 3 ? '💜' : '💙'

    return (
      <div className="fixed inset-0 z-[200] bg-black/85 flex flex-col items-center justify-center p-6 gap-6">
        <div className="text-5xl">{timeUp ? '⏰' : perfect ? '🎉' : '⭐'}</div>
        <div className="text-white text-2xl font-bold">
          {timeUp ? '时间到！' : perfect ? '完美配对！' : '配对完成！'}
        </div>
        <div className="flex gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-green-400">{matched.size}</div>
            <div className="text-sm text-gray-400 mt-1">已配对</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-400">{errors}</div>
            <div className="text-sm text-gray-400 mt-1">错误</div>
          </div>
          <div>
            <div className={`text-3xl font-bold ${maxCombo >= 3 ? 'text-purple-400' : 'text-amber-400'}`}>{maxCombo}×</div>
            <div className="text-sm text-gray-400 mt-1">最高连击</div>
          </div>
        </div>
        {!timeUp && (
          <div className={`text-xl font-bold ${gemColor}`}>
            {gemEmoji} {perfect ? '获得绿宝石！' : maxCombo >= 3 ? '获得紫宝石！' : '获得蓝宝石！'}
          </div>
        )}
        <div className="flex gap-4 mt-2">
          <button onClick={onClose}
            className="px-7 py-3 rounded-2xl bg-slate-700 hover:bg-slate-600 text-white text-base font-semibold transition-colors">
            返回
          </button>
          <button onClick={handleNewRound}
            className="px-7 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-base font-semibold transition-colors">
            再来一局
          </button>
        </div>
      </div>
    )
  }

  // ── 游戏界面 ────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center pt-8 pb-6 px-4">
      {/* 顶部：退出 / 倒计时 / 进度 */}
      <div className="flex items-center justify-between w-full max-w-lg mb-3">
        <button onClick={onClose}
          className="text-gray-500 hover:text-gray-300 text-base transition-colors">
          ✕ 退出
        </button>
        <div className={`text-2xl font-bold tabular-nums transition-colors ${timer <= 10 ? 'text-red-400 animate-pulse' : 'text-amber-300'}`}>
          {timer}s
        </div>
        <div className="text-gray-400 text-base tabular-nums">
          {matched.size}/{pairs.length}
        </div>
      </div>

      {/* 模式切换：标准 / 听力 */}
      <div className="w-full max-w-lg mb-3 flex items-center justify-center gap-1 bg-slate-900 border border-slate-700 rounded-2xl p-1">
        <button onClick={() => mode === 'listen' && toggleMode()}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors
            ${mode === 'classic' ? 'bg-slate-700 text-white' : 'text-gray-400 hover:text-gray-200'}`}>
          📝 标准
        </button>
        <button onClick={() => mode === 'classic' && toggleMode()}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors
            ${mode === 'listen' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}>
          🎧 听力
        </button>
      </div>

      {/* 进度条 */}
      <div className="w-full max-w-lg h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-green-500 rounded-full transition-all duration-300"
          style={{ width: `${(matched.size / pairs.length) * 100}%` }}
        />
      </div>

      {/* 双列配对区 */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-lg flex-1">
        {/* 左列：听力模式=喇叭+波形；标准模式=中文 */}
        <div className="flex flex-col gap-2.5">
          {leftItems.map((item, i) => {
            const isMatched  = matched.has(item.idx)
            const isSelected = selLeft === i
            const isShaking  = shakeLeft === i
            return (
              <button
                key={`L${item.idx}`}
                onClick={() => handleLeft(i)}
                className={[
                  'px-3 py-3.5 rounded-2xl border text-lg font-bold transition-all duration-200 min-h-[61px] leading-snug',
                  isMatched
                    ? 'opacity-0 pointer-events-none scale-95 border-transparent bg-transparent'
                    : isShaking
                      ? 'card-shake border-red-500 bg-red-900/40 text-red-300'
                      : isSelected
                        ? (mode === 'listen'
                            ? 'bg-blue-900/60 border-blue-400 shadow-[0_0_14px_rgba(59,130,246,0.55)]'
                            : 'bg-blue-600 border-blue-400 text-white shadow-[0_0_14px_rgba(59,130,246,0.55)]')
                        : (mode === 'listen'
                            ? 'bg-slate-900 border-slate-700 hover:border-blue-500 hover:bg-slate-800'
                            : 'bg-slate-800 border-slate-600 text-blue-200 hover:border-blue-500 hover:bg-slate-700'),
                ].join(' ')}
              >
                {mode === 'listen'
                  ? <span className="flex items-center justify-center"><SpeakerWave playing={playingIdx === item.idx} /></span>
                  : item.zh
                }
              </button>
            )
          })}
        </div>

        {/* 右列：听力模式=中文；标准模式=英文 */}
        <div className="flex flex-col gap-2.5">
          {rightItems.map((item, i) => {
            const isMatched  = matched.has(item.idx)
            const isSelected = selRight === i
            const isShaking  = shakeRight === i
            return (
              <button
                key={`R${item.idx}`}
                onClick={() => handleRight(i)}
                className={[
                  'px-3 py-3.5 rounded-2xl border text-lg font-bold transition-all duration-200 min-h-[61px] leading-snug',
                  isMatched
                    ? 'opacity-0 pointer-events-none scale-95 border-transparent bg-transparent'
                    : isShaking
                      ? 'card-shake border-red-500 bg-red-900/40 text-red-300'
                      : isSelected
                        ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_14px_rgba(59,130,246,0.55)]'
                        : (mode === 'listen'
                            ? 'bg-slate-800 border-slate-600 text-blue-200 hover:border-blue-500 hover:bg-slate-700'
                            : 'bg-slate-800 border-slate-600 text-green-200 hover:border-green-500 hover:bg-slate-700'),
                ].join(' ')}
              >
                {mode === 'listen' ? item.zh : item.en}
              </button>
            )
          })}
        </div>
      </div>

      {/* 底部进度点 */}
      <div className="flex gap-2.5 mt-5">
        {pairs.map(p => (
          <div
            key={p.idx}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${matched.has(p.idx) ? 'bg-green-400 scale-110' : 'bg-slate-700'}`}
          />
        ))}
      </div>

      {/* 连击徽章 */}
      {combo >= 2 && (
        <div className="mt-3 text-purple-400 font-bold text-base animate-[combo-pop_.3s_ease]">
          🔥 {combo} 连击！
        </div>
      )}
    </div>
  )
}
