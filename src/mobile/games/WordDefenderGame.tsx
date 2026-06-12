import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { VocabWord } from '../data/unit1Vocab'
import { useMobileTTS } from '../hooks/useMobileTTS'
import { useMobileSfx } from '../hooks/useMobileSfx'
import './wordDefender.css'

interface Props {
  words: VocabWord[]
  unitLabel?: string
  onExit: () => void
  onComplete: (result: { hit: number; total: number; combo: number; accuracy: number }) => void
}

type Phase = 'intro' | 'playing' | 'over' | 'win'

interface UFOState {
  word: VocabWord
  pool: string[]      // 字母池（含干扰）
  picked: number[]    // 已点击的字母池索引
  y: number           // 0 顶 → 100 底
  speed: number       // % per second
  destroyed: boolean
}

interface Bullet {
  id: number
  x: number
  y: number
}

const HEARTS_START = 3
const UFO_HEIGHT_PCT = 35   // 击中线（飞机所在 y）
const BASE_SPEED = 1.6      // %/s 起步
const SPEED_INCREMENT = 0.18

const DISTRACTORS = 'abcdefghijklmnopqrstuvwxyz'.split('')

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildLetterPool(word: string, distractorCount: number): string[] {
  const lower = word.toLowerCase()
  const letters = lower.split('')
  const used = new Set(letters)
  const extras: string[] = []
  while (extras.length < distractorCount) {
    const c = DISTRACTORS[Math.floor(Math.random() * DISTRACTORS.length)]
    if (!used.has(c)) {
      extras.push(c); used.add(c)
    }
  }
  return shuffle([...letters, ...extras])
}

function makeUFO(word: VocabWord, level: number): UFOState {
  const distractors = word.en.length <= 3 ? 2 : word.en.length <= 5 ? 2 : 1
  return {
    word,
    pool: buildLetterPool(word.en, distractors),
    picked: [],
    y: 0,
    speed: BASE_SPEED + SPEED_INCREMENT * level,
    destroyed: false,
  }
}

export default function WordDefenderGame({ words, unitLabel = 'Unit 1', onExit, onComplete }: Props) {
  const { speak } = useMobileTTS()
  const sfx = useMobileSfx()
  const queue = useMemo(() => shuffle(words.filter(w => w.en && /^[a-zA-Z]+$/.test(w.en))), [words])

  const [phase, setPhase] = useState<Phase>('intro')
  const [idx, setIdx] = useState(0)
  const [ufo, setUfo] = useState<UFOState | null>(null)
  const [hearts, setHearts] = useState(HEARTS_START)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [hit, setHit] = useState(0)         // 击毁数
  const [taps, setTaps] = useState(0)       // 总点击
  const [correctTaps, setCorrectTaps] = useState(0)
  const [bullets, setBullets] = useState<Bullet[]>([])
  const [shake, setShake] = useState(false)
  const [flash, setFlash] = useState<'good' | 'bad' | null>(null)
  const bulletIdRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const lastTickRef = useRef<number>(0)

  // 启动新 UFO
  const spawnNext = useCallback((nextIdx: number) => {
    if (nextIdx >= queue.length) {
      setPhase('win')
      return
    }
    setIdx(nextIdx)
    setUfo(makeUFO(queue[nextIdx], nextIdx))
  }, [queue])

  function startGame() {
    setHearts(HEARTS_START)
    setCombo(0); setMaxCombo(0)
    setHit(0); setTaps(0); setCorrectTaps(0)
    setBullets([])
    setPhase('playing')
    spawnNext(0)
  }

  // 主循环：UFO 下降
  useEffect(() => {
    if (phase !== 'playing' || !ufo || ufo.destroyed) return
    lastTickRef.current = performance.now()
    function tick(t: number) {
      const dt = (t - lastTickRef.current) / 1000
      lastTickRef.current = t
      setUfo(u => {
        if (!u || u.destroyed) return u
        const ny = u.y + u.speed * dt
        if (ny >= UFO_HEIGHT_PCT) {
          // UFO 触底 → 扣血
          queueMicrotask(() => onUfoCrash())
          return { ...u, y: UFO_HEIGHT_PCT }
        }
        return { ...u, y: ny }
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [phase, ufo?.word.id, ufo?.destroyed])  // eslint-disable-line react-hooks/exhaustive-deps

  function onUfoCrash() {
    sfx.playWrong()
    setShake(true)
    setTimeout(() => setShake(false), 250)
    setHearts(h => {
      const nh = h - 1
      if (nh <= 0) {
        setPhase('over')
        return 0
      }
      // UFO 摧毁但不算击毁，进入下一题
      setTimeout(() => spawnNext(idx + 1), 400)
      return nh
    })
    setCombo(0)
  }

  function fireBullet() {
    const id = ++bulletIdRef.current
    const x = 50 + (Math.random() - 0.5) * 8
    setBullets(b => [...b, { id, x, y: 88 }])
    // 200ms 子弹飞上去，到达 UFO
    requestAnimationFrame(() => {
      setBullets(b => b.map(x => x.id === id ? { ...x, y: 5 } : x))
    })
    setTimeout(() => {
      setBullets(b => b.filter(x => x.id !== id))
    }, 600)
  }

  function handleLetterTap(poolIdx: number) {
    if (!ufo || ufo.destroyed || phase !== 'playing') return
    if (ufo.picked.includes(poolIdx)) return
    setTaps(t => t + 1)
    const expected = ufo.word.en[ufo.picked.length]?.toLowerCase()
    const got = ufo.pool[poolIdx]
    if (expected === got) {
      // 命中
      sfx.playCorrect()
      setCorrectTaps(c => c + 1)
      setFlash('good'); setTimeout(() => setFlash(null), 150)
      fireBullet()
      const nextPicked = [...ufo.picked, poolIdx]
      const isComplete = nextPicked.length >= ufo.word.en.length
      setUfo({ ...ufo, picked: nextPicked, destroyed: isComplete })
      if (isComplete) {
        // 击毁
        setHit(h => h + 1)
        setCombo(c => {
          const nc = c + 1
          setMaxCombo(m => Math.max(m, nc))
          return nc
        })
        // 朗读单词
        setTimeout(() => speak(ufo.word.en, 0.9), 250)
        setTimeout(() => spawnNext(idx + 1), 1100)
      }
    } else {
      // 失误：UFO 加速 + 屏幕红闪
      sfx.playWrong()
      setFlash('bad'); setTimeout(() => setFlash(null), 200)
      setCombo(0)
      setUfo({ ...ufo, speed: ufo.speed * 1.45, y: Math.min(UFO_HEIGHT_PCT - 1, ufo.y + 4) })
    }
  }

  function handleUndo() {
    if (!ufo || ufo.destroyed || ufo.picked.length === 0) return
    setUfo({ ...ufo, picked: ufo.picked.slice(0, -1) })
  }

  // 完成结算（onComplete 必须在 phase 切换后调一次）
  useEffect(() => {
    if (phase !== 'win' && phase !== 'over') return
    const acc = taps > 0 ? Math.round((correctTaps / taps) * 100) : 0
    onComplete({ hit, total: queue.length, combo: maxCombo, accuracy: acc })
  }, [phase])  // eslint-disable-line react-hooks/exhaustive-deps

  // ─── 渲染 ─────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="wdg flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden">
        <div className="wdg__intro flex-1 flex flex-col items-center justify-center px-6 gap-4 text-center">
          <button className="wdg__close-abs" onClick={onExit} aria-label="返回">✕</button>
          <div className="wdg__intro-emoji">🛸</div>
          <h1 className="wdg__intro-title">字母飞船防御战</h1>
          <p className="wdg__intro-sub">{unitLabel} · {queue.length} 个单词</p>
          <ul className="wdg__intro-rules">
            <li>🛸 飞船显示汉语，从空中降下</li>
            <li>🔤 按顺序点击字母拼出英文</li>
            <li>🚀 每对一个字母发一颗子弹</li>
            <li>❤️ 飞船触底扣 1 血，3 血用完游戏结束</li>
          </ul>
          <button className="wdg__btn-primary" onClick={startGame}>开始作战</button>
        </div>
      </div>
    )
  }

  if (phase === 'win' || phase === 'over') {
    const acc = taps > 0 ? Math.round((correctTaps / taps) * 100) : 0
    const stars = phase === 'win' ? (acc >= 95 ? 3 : acc >= 75 ? 2 : 1) : 0
    return (
      <div className="wdg flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden">
        <div className="wdg__intro flex-1 flex flex-col items-center justify-center px-6 gap-3 text-center">
          <div className="wdg__intro-emoji">{phase === 'win' ? '🏆' : '💥'}</div>
          <h1 className="wdg__intro-title">{phase === 'win' ? '胜利！' : '战败'}</h1>
          <div className="wdg__stars" aria-hidden>
            {[1, 2, 3].map(i => (
              <span key={i} className={`wdg__star${stars >= i ? ' wdg__star--on' : ''}`}>★</span>
            ))}
          </div>
          <div className="wdg__stats">
            <div><span>击毁</span><strong>{hit}/{queue.length}</strong></div>
            <div><span>准度</span><strong>{acc}%</strong></div>
            <div><span>最高连击</span><strong>{maxCombo}</strong></div>
          </div>
          <div className="flex gap-3 mt-2">
            <button className="wdg__btn-secondary" onClick={onExit}>返回</button>
            <button className="wdg__btn-primary" onClick={startGame}>再来一局</button>
          </div>
        </div>
      </div>
    )
  }

  // playing
  return (
    <div className={`wdg flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden${shake ? ' wdg--shake' : ''}${flash ? ` wdg--flash-${flash}` : ''}`}>
      <header className="wdg__hud shrink-0 safe-top">
        <button className="wdg__close" onClick={onExit} aria-label="返回">✕</button>
        <div className="wdg__hearts">
          {Array.from({ length: HEARTS_START }).map((_, i) => (
            <span key={i} className={`wdg__heart${i < hearts ? '' : ' wdg__heart--gone'}`}>❤</span>
          ))}
        </div>
        <div className="wdg__hud-right">
          <span className="wdg__combo">⚡ {combo}</span>
          <span className="wdg__score">击毁 {hit}/{queue.length}</span>
        </div>
      </header>

      <div className="wdg__arena flex-1 relative">
        {/* 星空背景 */}
        <div className="wdg__sky" aria-hidden />
        {/* UFO */}
        {ufo && !ufo.destroyed && (
          <div className="wdg__ufo" style={{ top: `${ufo.y}%`, left: '50%' }}>
            <div className="wdg__ufo-craft">🛸</div>
            <div className="wdg__ufo-label">{ufo.word.zh}</div>
            <div className="wdg__ufo-hp">
              <div className="wdg__ufo-hp-fill" style={{ width: `${(1 - ufo.picked.length / ufo.word.en.length) * 100}%` }} />
            </div>
          </div>
        )}
        {ufo && ufo.destroyed && (
          <div className="wdg__boom" style={{ top: `${ufo.y}%`, left: '50%' }}>💥</div>
        )}

        {/* 子弹 */}
        {bullets.map(b => (
          <div key={b.id} className="wdg__bullet" style={{ left: `${b.x}%`, top: `${b.y}%` }} />
        ))}

        {/* 玩家飞机 */}
        <div className="wdg__plane">🚀</div>
      </div>

      <div className="wdg__bottom shrink-0 safe-bottom">
        {/* 拼字进度 */}
        <div className="wdg__progress">
          {ufo && ufo.word.en.split('').map((c, i) => {
            const picked = ufo.picked[i] != null
            return (
              <span key={i} className={`wdg__slot${picked ? ' wdg__slot--filled' : ''}`}>
                {picked ? ufo.pool[ufo.picked[i]] : '_'}
              </span>
            )
          })}
        </div>
        {/* 字母池 */}
        <div className="wdg__pool">
          {ufo?.pool.map((c, i) => (
            <button
              key={i}
              type="button"
              className={`wdg__tile${ufo.picked.includes(i) ? ' wdg__tile--used' : ''}`}
              onClick={() => handleLetterTap(i)}
              disabled={ufo.picked.includes(i) || ufo.destroyed}
            >{c}</button>
          ))}
        </div>
        <button type="button" className="wdg__undo" onClick={handleUndo}>⟲ 撤销</button>
      </div>
    </div>
  )
}
