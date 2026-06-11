import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react'
import Pond from './Pond'
import Frog from './Frog'
import LilyPad from './LilyPad'
import Island from './Island'
import TypingHands from '../TypingHands'
import CloseBadge from '../CloseBadge'
import { getFingerByChar } from '../../typing/KeyboardEngine'
import { useHistoryLayer } from '../../hooks/useHistoryLayer'
import {
  getCtx, sfxTonTon, sfxKeyOk, sfxKeyBad,
  sfxLand, sfxSplash, sfxWin, sfxLose, sfxHurt, sfxGem,
} from './sfx'
import { LEVELS, LEVELS_BY_BOOK, LEVELS_BY_STAGE, SUBMODES, MAX_HEARTS, PERFECT_PER_LEVEL_BONUS, STREAK_5_REWARD, PASS_STAR_THRESHOLD } from './levels'

const KEYBOARD_LAYOUT = [
  [ {k:'tab', label:'Tab', flex:1.5}, ...'qwertyuiop'.split('').map(k=>({k,label:k.toUpperCase()})), {k:'bksp', label:'⌫', flex:1.5} ],
  [ {k:'caps', label:'Caps', flex:1.8}, ...'asdfghjkl'.split('').map(k=>({k,label:k.toUpperCase()})), {k:'enter', label:'Enter', flex:2.2} ],
  [ {k:'shift-l', label:'⇧ Shift', flex:2.4}, ...'zxcvbnm'.split('').map(k=>({k,label:k.toUpperCase()})), {k:'shift-r', label:'⇧ Shift', flex:2.4} ],
  [ {k:'ctrl-l', label:'Ctrl', flex:1.5}, {k:'alt-l', label:'Alt', flex:1.3}, {k:' ', label:'Space', flex:8}, {k:'alt-r', label:'Alt', flex:1.3}, {k:'ctrl-r', label:'Ctrl', flex:1.5} ],
]

// 荷叶水平 zig-zag 偏移（基于索引）— 让每片荷叶在中线左右随机摆放
function jitterFor(idx) {
  const pattern = [0, -90, 70, -50, 100, -80, 40, -110, 90, 0]
  return pattern[idx % pattern.length]
}

export default function FrogJump({ onClose, onCrystal }) {
  const [view, setView] = useState('select')  // select | modeSelect | playing | over
  const [levelId, setLevelId] = useState(LEVELS[0].id)
  const [submode, setSubmode] = useState('A')
  const level = LEVELS.find(l => l.id === levelId) || LEVELS[0]
  const [muted, setMuted] = useState(() => localStorage.getItem('frog_muted') === '1')

  useHistoryLayer(true, onClose)

  // 游戏状态
  const [wordIdx, setWordIdx] = useState(0)
  const [typed, setTyped] = useState('')
  const [hearts, setHearts] = useState(MAX_HEARTS)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [perfectWords, setPerfectWords] = useState(0)
  const [errorsThisWord, setErrorsThisWord] = useState(0)
  const [frogState, setFrogState] = useState('idle')
  const [frogPos, setFrogPos] = useState(0)  // 当前站在第几片荷叶（视觉位置）
  const [flash, setFlash] = useState(null)   // 'good' | 'bad' | 'gem'
  const [keyFlash, setKeyFlash] = useState({})
  const [floats, setFloats] = useState([])
  const [wrongHint, setWrongHint] = useState('')  // 默写模式输错时显示正确单词

  // refs
  const typedRef = useRef('')
  useEffect(() => { typedRef.current = typed }, [typed])
  const padsRef = useRef(null)

  const words = level.words
  const currentWord = words[wordIdx] || words[0]
  const targetEn = (currentWord?.word || '').toLowerCase()

  // 启动每关
  const startLevel = (lvId, mode) => {
    setLevelId(lvId)
    setSubmode(mode)
    setWordIdx(0)
    setTyped('')
    setHearts(MAX_HEARTS)
    setScore(0)
    setStreak(0)
    setPerfectWords(0)
    setErrorsThisWord(0)
    setFrogState('idle')
    setFrogPos(0)
    setView('playing')
    if (!muted) {
      try { getCtx()?.resume() } catch {}
    }
  }

  // 飘字
  const addFloat = useCallback((text, color = '#fde047') => {
    const id = Math.random().toString(36).slice(2)
    setFloats(f => [...f, { id, text, color }])
    setTimeout(() => setFloats(f => f.filter(x => x.id !== id)), 1200)
  }, [])

  const flashKey = useCallback((k, kind) => {
    setKeyFlash(prev => ({ ...prev, [k]: kind }))
    setTimeout(() => setKeyFlash(prev => {
      const n = { ...prev }; delete n[k]; return n
    }), 220)
  }, [])

  // 命中一个单词
  const onWordComplete = useCallback(() => {
    const isPerfect = errorsThisWord === 0
    const gain = isPerfect ? 10 : (errorsThisWord <= 2 ? 7 : 5)
    setScore(s => s + gain)
    setPerfectWords(p => isPerfect ? p + 1 : p)
    setStreak(st => {
      const next = st + 1
      // 5 / 10 / 15 连击奖励紫钻
      if (next % 5 === 0) {
        onCrystal?.('purple', STREAK_5_REWARD, next === 10 ? 'combo_10' : (next === 5 ? 'combo_5' : 'combo_20'))
        if (!muted) sfxGem()
        addFloat(`🔥${next}连击 +💎`, '#a855f7')
      }
      return next
    })
    if (isPerfect) {
      // 每个完美词奖励 1 蓝钻
      onCrystal?.('blue', 1, 'sentence_clean')
    }
    addFloat(`+${gain}`, isPerfect ? '#22c55e' : '#fde047')

    // 青蛙起跳：蹲 → 跳（同时世界往下滚动）→ 落地 → idle
    setFrogState('crouch')
    setTimeout(() => {
      // 跳跃 + 世界滚动同时启动
      setFrogState('jump')
      if (!muted) sfxTonTon()
      setWordIdx(i => i + 1)
    }, 120)
    setTimeout(() => {
      setFrogState('land')
      if (!muted) sfxLand()
    }, 570)
    setTimeout(() => {
      setFrogState('idle')
      setErrorsThisWord(0)
      setTyped('')
      // 完成最后一个词 → 再跳一次到终点岛屿，然后通关
      if (wordIdx + 1 >= words.length) {
        setTimeout(() => {
          setFrogState('crouch')
          setTimeout(() => {
            setFrogState('jump')
            if (!muted) sfxTonTon()
            setWordIdx(i => i + 1)  // 推进到岛屿
          }, 120)
          setTimeout(() => {
            setFrogState('land')
            if (!muted) sfxLand()
          }, 570)
          setTimeout(() => {
            setFrogState('idle')
            handleWin()
          }, 850)
        }, 400)
      }
    }, 720)
  }, [errorsThisWord, words.length, muted, onCrystal, addFloat, wordIdx])

  // 输入处理
  const handleInput = useCallback((rawKey) => {
    if (view !== 'playing') return
    const k = rawKey.toLowerCase()
    if (k === 'backspace') {
      setTyped(t => t.slice(0, -1))
      return
    }
    if (!/^[a-z' -]$/.test(k)) return
    const expected = targetEn[typedRef.current.length]
    if (expected == null) return
    if (k === expected) {
      const nextTyped = typedRef.current + k
      setTyped(nextTyped)
      flashKey(k, 'hit')
      if (!muted) sfxKeyOk()
      if (nextTyped === targetEn) {
        // 完整匹配 → 跳
        onWordComplete()
      }
    } else {
      // 错字符
      setStreak(0)
      flashKey(k, 'miss')
      if (!muted) sfxKeyBad()
      // 默写模式下出错 → 提示正确单词 2 秒
      if (submode === 'B') {
        setWrongHint(targetEn)
        setTimeout(() => setWrongHint(''), 2200)
      }
      setErrorsThisWord(e => {
        const next = e + 1
        // 单词内累计 3 次错 → 扣 1 颗心
        if (next === 3) {
          setHearts(h => {
            const newH = h - 1
            if (!muted) sfxHurt()
            addFloat('-❤️', '#ef4444')
            if (newH <= 0) {
              setFrogState('drown')
              if (!muted) sfxSplash()
              setTimeout(() => handleLose(), 1200)
            }
            return Math.max(0, newH)
          })
        }
        return next
      })
    }
  }, [view, targetEn, muted, flashKey, onWordComplete, addFloat, submode])

  // 键盘监听
  useEffect(() => {
    if (view !== 'playing') return
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key
      if (k === 'Backspace') { e.preventDefault(); handleInput('backspace'); return }
      if (k.length !== 1) return
      e.preventDefault()
      handleInput(k)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view, handleInput])

  const onVirtualKey = (k) => () => {
    if (view !== 'playing') return
    if (k === 'bksp') { handleInput('backspace'); return }
    if (k.length !== 1 || !/^[a-z ]$/.test(k)) return
    window.dispatchEvent(new KeyboardEvent('keydown', { key: k }))
  }

  function handleWin() {
    if (perfectWords + (errorsThisWord === 0 ? 1 : 0) === words.length) {
      // 满分通关 → 绿钻
      onCrystal?.('green', PERFECT_PER_LEVEL_BONUS, 'sync_perfect')
      addFloat('完美通关 +💚', '#22c55e')
    }
    // 通关蓝钻
    onCrystal?.('blue', 2, 'unit_complete')
    if (!muted) sfxWin()
    setTimeout(() => setView('over'), 800)
    // 保存最高分
    const key = `frog_best_${levelId}_${submode}`
    const prevBest = Number(localStorage.getItem(key) || 0)
    if (score + 1 > prevBest) localStorage.setItem(key, String(score + 1))
  }

  function handleLose() {
    if (!muted) sfxLose()
    setView('over')
  }

  // === 键盘网格定位（给 TypingHands 用）===
  const gridRef = useRef(null)
  const keyRefs = useRef({})
  const [targetPos, setTargetPos] = useState(null)
  const targetLetter = (targetEn[typed.length] || '').toLowerCase()
  useLayoutEffect(() => {
    if (!targetLetter || !gridRef.current) { setTargetPos(null); return }
    const keyEl = keyRefs.current[targetLetter]
    if (!keyEl) { setTargetPos(null); return }
    const kRect = keyEl.getBoundingClientRect()
    const gRect = gridRef.current.getBoundingClientRect()
    setTargetPos({
      x: kRect.left - gRect.left + kRect.width / 2,
      y: kRect.top - gRect.top + kRect.height / 2,
      gridWidth: gRect.width,
      gridHeight: gRect.height,
    })
  }, [targetLetter, view])
  const targetFinger = targetLetter ? getFingerByChar(targetLetter) : null

  const toggleMute = () => {
    const v = !muted
    setMuted(v)
    localStorage.setItem('frog_muted', v ? '1' : '0')
  }

  // === 渲染 ===
  return (
    <div className="fixed inset-0 z-[200] flex flex-col select-none"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>

      {/* 头部胶囊 */}
      <header className="flex items-center justify-between gap-2 px-3 py-2 sm:py-3 shrink-0 bg-gradient-to-b from-sky-400 to-sky-500/80 backdrop-blur z-30">
        <div className="flex items-center gap-1.5">
          {(view === 'playing' || view === 'over' || view === 'modeSelect') && (
            <button
              onClick={() => setView(view === 'playing' ? 'modeSelect' : 'select')}
              className="w-9 h-9 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow flex items-center justify-center"
              title="返回上一层">
              <span className="text-lg leading-none">←</span>
            </button>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 shadow text-slate-800">
            <span className="text-base">🐸</span>
            <span className="text-sm font-bold">
              {view === 'playing' || view === 'over' ? `${level.name}` : '青蛙跳 · 单词版'}
            </span>
          </div>
        </div>
        {view === 'playing' && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/95 shadow">
              {[...Array(MAX_HEARTS)].map((_, i) => (
                <span key={i} className={`text-sm transition-opacity ${i < hearts ? '' : 'opacity-25 grayscale'}`}>❤️</span>
              ))}
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/95 shadow">
              <span className="text-xs text-emerald-700">🎯</span>
              <span className="text-sm font-extrabold text-emerald-700 tabular-nums">{score}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/95 shadow">
              <span className="text-xs text-amber-700">🔥</span>
              <span className="text-sm font-extrabold text-amber-700 tabular-nums">{streak}</span>
            </div>
          </div>
        )}
        <div className="flex items-center gap-1.5 mr-12">
          {/* mr-12 给右上角 CloseBadge 让位 */}
          <button onClick={toggleMute}
            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 text-base shadow"
            title={muted ? '开启声音' : '静音'}>
            {muted ? '🔇' : '🔊'}
          </button>
        </div>
      </header>
      <CloseBadge onClose={onClose} />

      {/* 游戏区（占满直到键盘） */}
      <main className="flex-1 min-h-0 relative overflow-hidden">
        <Pond>
          {view === 'select' && (
            <div className="absolute inset-0 flex flex-col items-stretch p-3 sm:p-4 overflow-auto">
              <div className="bg-white/15 backdrop-blur-md border border-white/40 rounded-3xl p-4 sm:p-5 w-full max-w-3xl mx-auto shadow-xl">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white text-center mb-3 drop-shadow">选择关卡</h2>
                {LEVELS_BY_STAGE.map(stage => (
                  <details key={stage.id} open={stage.id === 'elementary'} className="mb-3 last:mb-0">
                    <summary className="cursor-pointer text-white text-base font-extrabold py-1.5 px-2 rounded-lg hover:bg-white/10 drop-shadow flex items-center gap-2">
                      <span className="inline-block w-2 h-5 bg-amber-300 rounded-full" />
                      {stage.name}阶段
                      <span className="text-[11px] text-white/70 font-normal ml-1">{stage.books.reduce((s, g) => s + g.levels.length, 0)} 关</span>
                    </summary>
                    <div className="pl-2 pr-1 pt-2">
                      {stage.books.map(group => (
                        <div key={group.bookShort} className="mb-3 last:mb-0">
                          <div className="text-white/90 text-sm font-bold mb-1.5 drop-shadow">
                            {group.bookShort}
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                            {group.levels.map(lv => {
                              const bestA = Number(localStorage.getItem(`frog_best_${lv.id}_A`) || 0)
                              const bestB = Number(localStorage.getItem(`frog_best_${lv.id}_B`) || 0)
                              const totalStars = (bestA > 0 ? 1 : 0) + (bestB > 0 ? 1 : 0)
                              return (
                                <button key={lv.id}
                                  onClick={() => { setLevelId(lv.id); setView('modeSelect') }}
                                  className="relative text-left p-2.5 rounded-xl bg-white hover:bg-emerald-50 shadow transition-all hover:scale-[1.03] hover:shadow-lg">
                                  {totalStars > 0 && (
                                    <span className="absolute top-1 right-1.5 text-xs">
                                      {'⭐'.repeat(totalStars)}
                                    </span>
                                  )}
                                  <div className="text-sm font-extrabold text-slate-900 truncate">{lv.name}</div>
                                  <div className="text-[11px] text-slate-500 truncate">{lv.words.length} 词</div>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {view === 'modeSelect' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <div className="bg-white/15 backdrop-blur-md border border-white/40 rounded-3xl p-6 w-full max-w-md shadow-xl">
                <h2 className="text-xl font-extrabold text-white text-center mb-1 drop-shadow">{level.name}</h2>
                <p className="text-white/80 text-sm text-center mb-4">选择模式</p>
                <div className="grid grid-cols-2 gap-3">
                  {SUBMODES.map(m => (
                    <button key={m.id}
                      onClick={() => startLevel(level.id, m.id)}
                      className="p-4 rounded-xl bg-white hover:bg-emerald-50 shadow text-center transition-all hover:scale-[1.05]">
                      <div className="text-3xl mb-1">{m.icon}</div>
                      <div className="text-base font-extrabold text-slate-900">{m.name}</div>
                      <div className="text-xs text-slate-500">{m.desc}</div>
                    </button>
                  ))}
                </div>
                <button onClick={() => setView('select')}
                  className="mt-3 w-full px-4 py-2 rounded-full bg-white/30 hover:bg-white/50 text-white font-bold text-sm">
                  ← 返回选关
                </button>
              </div>
            </div>
          )}

          {view === 'playing' && (() => {
            // 移动端（窄屏）和桌面端用不同尺寸
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
            const PAD_SPACING = isMobile ? 155 : 150
            const PAD_SIZE = isMobile ? 150 : 150
            const FROG_VIEWPORT_Y = 78
            const FROG_SIZE = isMobile ? 95 : 95
            // 世界整体向下平移的距离 = 已完成单词数 × 间距
            // wordIdx = 当前正在打的词 = 青蛙正上方的目标荷叶
            // 青蛙脚下踩的是 pad[wordIdx - 1]（如果有）
            const worldShift = wordIdx * PAD_SPACING
            // 跳跃水平偏移：从当前(青蛙脚下)荷叶到目标(上方)荷叶
            const standingJitter = wordIdx > 0 ? jitterFor(wordIdx - 1) : 0
            const targetJitter = jitterFor(wordIdx)
            const frogXShift = frogState === 'jump' ? (targetJitter - standingJitter) / 2 : 0

            return (
              <>
                {/* 提示卡 — 桌面在左上，手机贴左边但很窄 */}
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 max-w-[42vw] sm:max-w-[240px]">
                  <div className={`bg-white/95 backdrop-blur rounded-xl sm:rounded-2xl shadow-xl px-2.5 py-2 sm:px-4 sm:py-2.5 transition-all
                    ${wrongHint ? 'ring-2 ring-rose-400 animate-pulse' : ''}`}>
                    {submode === 'A' ? (
                      <>
                        <div className="text-base sm:text-xl font-extrabold text-slate-900 tracking-wider truncate">{currentWord?.word}</div>
                        <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">{currentWord?.ipa}</div>
                        <div className="text-[11px] sm:text-xs text-slate-600 mt-0.5 truncate">{currentWord?.zh}</div>
                      </>
                    ) : (
                      wrongHint ? (
                        <>
                          <div className="text-[9px] sm:text-[10px] text-rose-500 font-bold uppercase">正确</div>
                          <div className="text-base sm:text-xl font-extrabold text-rose-600 tracking-wider truncate">{wrongHint}</div>
                          <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 truncate">{currentWord?.ipa}</div>
                        </>
                      ) : (
                        <>
                          <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase">默写</div>
                          <div className="text-[10px] sm:text-xs text-slate-600 leading-tight">{targetEn.length} 字母</div>
                        </>
                      )
                    )}
                    <div className="mt-1 sm:mt-1.5 text-sm sm:text-base font-mono font-bold tracking-widest text-emerald-600 h-5 sm:h-6 truncate">
                      {typed}<span className="animate-pulse">_</span>
                    </div>
                  </div>
                </div>

                {/* 进度条 — 右上角 */}
                <div className="absolute top-3 right-3 z-10 w-[min(40%,200px)]">
                  <div className="h-2 bg-white/40 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 transition-all duration-300"
                      style={{ width: `${(wordIdx / words.length) * 100}%` }} />
                  </div>
                  <div className="text-right text-xs text-white/90 mt-1 font-bold drop-shadow">
                    {wordIdx + 1} / {words.length}
                  </div>
                </div>

                {/* 滚动世界容器 — 平移使当前荷叶始终在 FROG_VIEWPORT_Y */}
                <div className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }}>
                  <div className="absolute inset-x-0" style={{
                    bottom: `${100 - FROG_VIEWPORT_Y}%`,
                    height: 0,
                    transform: `translateY(${wordIdx * PAD_SPACING}px)`,
                    transition: 'transform 0.45s cubic-bezier(.5,.0,.5,1)',
                    willChange: 'transform',
                  }}>
                    {/* 渲染所有荷叶（绝对定位于世界坐标）
                        pad[N] 位于 frog 上方 (N+1) 格 → padY = -(N+1)*PAD_SPACING
                        worldShift = wordIdx * PAD_SPACING 让 pad[wordIdx-1] 落到 frog 脚下 */}
                    {words.map((w, idx) => {
                      const jitter = jitterFor(idx)
                      const isTarget = idx === wordIdx     // 青蛙正上方目标
                      const isStanding = idx === wordIdx - 1  // 青蛙脚下
                      const isPassed = idx < wordIdx - 1     // 已通过（下方）
                      const padY = -(idx + 1) * PAD_SPACING
                      return (
                        <div key={idx}
                          className="absolute"
                          style={{
                            left: `calc(50% + ${jitter}px)`,
                            top: `${padY}px`,
                            transform: 'translate(-50%, -50%)',
                            animation: `pad-float ${3 + (idx % 3) * 0.5}s ease-in-out infinite`,
                            animationDelay: `${(idx * 0.2) % 2}s`,
                          }}>
                          <LilyPad
                            word={w?.word || ''}
                            state={isTarget ? 'target' : (isPassed || isStanding ? 'passed' : 'pending')}
                            typedPrefix={isTarget ? typed : ''}
                            displayText={
                              // 默写模式 + 目标 + 尚未完成 → 显示中文
                              submode === 'B' && isTarget && typed.length < (w?.word || '').length
                                ? (w?.zh || w?.word)
                                : (w?.word || '')
                            }
                            revealed={submode === 'B' && isTarget && typed.length === (w?.word || '').length}
                            size={PAD_SIZE}
                          />
                        </div>
                      )
                    })}
                    {/* 终点岛屿（在最后一片荷叶之上） */}
                    <div className="absolute"
                      style={{
                        left: `calc(50% + ${jitterFor(words.length)}px)`,
                        top: `${-(words.length + 1) * PAD_SPACING}px`,
                        transform: 'translate(-50%, -50%)',
                        animation: 'pad-float 4s ease-in-out infinite',
                      }}>
                      <Island size={Math.round(PAD_SIZE * 1.7)} />
                    </div>
                  </div>
                </div>

                {/* 青蛙 — 始终位于 FROG_VIEWPORT_Y，跳跃用 keyframe 做抛物弧 */}
                <div className="absolute pointer-events-none z-30"
                  style={{
                    width: FROG_SIZE,
                    height: FROG_SIZE,
                    left: `calc(50% + ${(wordIdx > 0 ? standingJitter : 0) + frogXShift}px)`,
                    top: `${FROG_VIEWPORT_Y}%`,
                    transform: 'translate(-50%, -50%)',
                    transition: 'left 0.45s cubic-bezier(.5,.0,.5,1)',
                  }}>
                  {/* 抛物动画包装层 */}
                  <div
                    className={frogState === 'jump' ? 'frog-arc' : ''}
                    style={{ width: '100%', height: '100%' }}>
                    <Frog state={frogState} wet={frogState === 'drown'} />
                  </div>
                  {/* 影子（跳跃时缩小） */}
                  <div className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
                    style={{
                      bottom: -2,
                      width: frogState === 'jump' ? 28 : 54,
                      height: frogState === 'jump' ? 5 : 11,
                      background: 'rgba(0,0,0,0.32)',
                      filter: 'blur(3px)',
                      transition: 'all 0.4s ease',
                    }} />
                </div>

                {/* 飘字 */}
                {floats.map(f => (
                  <div key={f.id} className="absolute left-1/2 top-1/3 z-50 text-3xl font-extrabold pointer-events-none"
                    style={{
                      color: f.color,
                      WebkitTextStroke: '2px #1a1a1a',
                      paintOrder: 'stroke',
                      transform: 'translate(-50%, -50%)',
                      animation: 'frog-float 1.2s ease-out forwards',
                    }}>
                    {f.text}
                  </div>
                ))}
              </>
            )
          })()}

          {view === 'over' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-6 w-full max-w-md text-center">
                <div className="text-5xl mb-2">{hearts > 0 ? '🏆' : '💧'}</div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-1">
                  {hearts > 0 ? '通关！' : '青蛙掉水啦'}
                </h2>
                <div className="text-4xl font-black text-emerald-600 my-2">{score} 分</div>
                <div className="text-sm text-slate-600 mb-4">
                  完美词 {perfectWords} / {words.length} · 剩余 {hearts} 颗心
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                  <button onClick={() => startLevel(levelId, submode)}
                    className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-amber-900 font-bold shadow">再来</button>
                  <button onClick={() => setView('modeSelect')}
                    className="px-5 py-2.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-emerald-900 font-bold shadow">换模式</button>
                  <button onClick={() => setView('select')}
                    className="px-5 py-2.5 rounded-full bg-white border border-slate-300 text-slate-700 font-bold shadow">选关</button>
                </div>
              </div>
            </div>
          )}
        </Pond>
      </main>

      {/* 键盘（沿用打地鼠相同布局） */}
      <footer className="w-full bg-slate-900/85 border-t border-white/10 backdrop-blur shadow-2xl shrink-0 px-1.5 sm:px-3 py-2 sm:py-3">
        <div ref={gridRef} className="keyboard-grid relative w-full max-w-4xl mx-auto flex flex-col items-stretch gap-1 sm:gap-1.5">
          {view === 'playing' && targetPos && (
            <div className="absolute inset-0 z-10 pointer-events-none">
              <TypingHands activeFinger={targetFinger} targetPos={targetPos} />
            </div>
          )}
          {KEYBOARD_LAYOUT.map((row, ri) => (
            <div key={ri} className="flex gap-1 sm:gap-1.5 w-full">
              {row.map((cell, ci) => {
                const isLetter = cell.k.length === 1 && /^[a-z ]$/.test(cell.k)
                const isActive = isLetter && cell.k === targetLetter
                const flashState = keyFlash[cell.k]
                const flex = cell.flex ?? (isLetter ? 1 : 1.4)
                let cls = 'h-11 sm:h-12 md:h-14 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base font-bold transition-all select-none inline-flex items-center justify-center min-w-0'
                if (flashState === 'hit') cls += ' bg-emerald-400 text-white scale-95 shadow-inner'
                else if (flashState === 'miss') cls += ' bg-rose-300 text-rose-900 shadow-inner'
                else if (isActive) cls += ' bg-amber-300 text-amber-900 scale-95 shadow ring-2 ring-white/60'
                else cls += isLetter
                  ? ' bg-white/95 text-slate-700 shadow active:scale-95'
                  : ' bg-slate-700/80 text-slate-200 shadow'
                return (
                  <button key={ci} type="button" onClick={onVirtualKey(cell.k)}
                    ref={el => { if (isLetter) keyRefs.current[cell.k] = el }}
                    style={{ flex: `${flex} 1 0` }}
                    className={cls}>
                    {cell.label}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes pad-float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50% { transform: translate(-50%, -50%) translateY(-5px); }
        }
        @keyframes frog-float {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(0.8); }
          25% { opacity: 1; transform: translate(-50%, -80%) scale(1.1); }
          100% { opacity: 0; transform: translate(-50%, -180%) scale(1.3); }
        }
        @keyframes frog-arc {
          0%   { transform: translateY(0) scaleY(1); }
          15%  { transform: translateY(-30px) scaleY(1.08); }
          50%  { transform: translateY(-110px) scaleY(1.05); }
          85%  { transform: translateY(-30px) scaleY(1.0); }
          100% { transform: translateY(0) scaleY(1); }
        }
        .frog-arc {
          animation: frog-arc 0.45s cubic-bezier(.5,.0,.5,1) both;
        }
      `}</style>
    </div>
  )
}
