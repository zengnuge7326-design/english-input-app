import { useState, useEffect, useRef, useCallback } from 'react'
import { ALPHABET_LETTERS, themeOf } from '../data/alphabet.js'
import { AlphabetIcon } from './AlphabetIcons'
import PandaMascot from './PandaMascot'
import OceanBg from './OceanBg'
import { useSound } from '../hooks/useSound'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { speakLetter, playWordAudio, preloadLetterAudio } from '../utils/phonicsAudio.js'
import { unlockAudio } from '../utils/audioUnlock.js'
import { IconArrowLeft } from './Icons'

// 语音识别字母名别名（覆盖：标准美音、中文儿童口音、Web Speech 常见误识别）
const LETTER_ALIASES = {
  A: ['a','ay','ai','ei','hey','eh','aye','aaa','aey','ah','eight','ate','way','hay','way','they'],
  B: ['b','be','bee','bi','bea','beat','ba','beep','bib','beam','beed','bead'],
  C: ['c','see','sea','si','ci','cee','ce','seem','seen','seek','she','shea','sí','sí'],
  D: ['d','de','dee','di','dea','deal','dia','dee dee','the','di','dii'],
  E: ['e','ee','yi','he','eee','ea','eve','easy','eek','heat','yeah','ye','yea','eat','yi'],
  F: ['f','ef','eff','of','ff','enf','efe','if','off','fff','eff eff'],
  G: ['g','ge','gee','ji','jee','gi','jeep','jeans','gel','jd','je','jie','gee gee'],
  H: ['h','aitch','haitch','age','aitche','hatch','etch','aich','ach','itch','each'],
  I: ['i','eye','ai','aye','ay','aii','ii','iii','yi','high','my','I','hi','hye'],
  J: ['j','jay','jei','jaye','jaybe','jail','jae','j','jay jay'],
  K: ['k','ka','kay','kei','okay','kk','kai','k.','ok'],
  L: ['l','el','ell','elle','al','olle','ela','io','ail','ello','hell','hell'],
  M: ['m','em','am','him','ham','mmm','imm','um','m','m m','emm'],
  N: ['n','en','an','in','un','nnn','inn','end','and','en en','any'],
  O: ['o','oh','ou','owe','oo','ohh','ow','aw','oh oh','open','old','our'],
  P: ['p','pe','pee','pi','pea','peep','pen','pp','peace','pi','pee pee'],
  Q: ['q','cue','queue','kiu','you','kew','que','qiu','kyu','kyou','cuew','kyoo','coo','cu','queue queue'],
  R: ['r','ar','are','our','arr','rr','aar','aaar','our','r r','art','arrow','our'],
  S: ['s','es','ess','yes','iss','as','ace','sss','s','ess ess','yes yes'],
  T: ['t','te','tee','ti','tea','tii','tt','teen','tee tee','tea tea','ty'],
  U: ['u','you','yew','yu','uu','yo','ewe','yoo','iu','u u','you you','use'],
  V: ['v','ve','vee','vi','vea','vv','viv','we','wee','wii','vi'],
  W: ['w','double you','double u','dub','dabao you','dabbleyou','daboyou','double','dub you','dabu you','dou ble you','w w','dabba you','double yew','dabu','dabbya','dabbaya'],
  X: ['x','ex','eks','ax','aks','ix','axe','exs','x x','ex ex'],
  Y: ['y','why','wai','wee','whyy','wi','vy','y y','wifi','wahy','yay','wide'],
  Z: ['z','ze','zee','zed','zi','zzz','zay','zhi','z z','zee zee'],
}

// 简单 Levenshtein（短词模糊匹配）
function letterLev(a, b) {
  if (a === b) return 0
  const m = a.length, n = b.length
  if (!m) return n
  if (!n) return m
  let prev = Array.from({ length: n + 1 }, (_, j) => j)
  for (let i = 1; i <= m; i++) {
    const cur = [i]
    for (let j = 1; j <= n; j++) {
      cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] : 1 + Math.min(prev[j], cur[j - 1], prev[j - 1])
    }
    prev = cur
  }
  return prev[n]
}

function normalizeForLetter(s) {
  return (s || '').toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, ' ').trim()
}

// 检查单个候选是否匹配字母（精确 + 模糊 1 编辑距离）
function candidateMatchesLetter(cand, letter) {
  if (!cand) return false
  const aliases = LETTER_ALIASES[letter.toUpperCase()] || [letter.toLowerCase()]
  // 精确
  if (aliases.includes(cand)) return true
  // 短词模糊：长度 ≤4 允许 1 编辑距离
  if (cand.length <= 4) {
    if (aliases.some(a => a.length <= 5 && letterLev(cand, a) <= 1)) return true
  }
  return false
}

// 主匹配：text + 所有 alts + 把每个候选按空格切片，逐个比对
function matchLetter(spoken, alts, letter) {
  const buckets = new Set()
  const allText = [spoken, ...(alts || [])].filter(Boolean)
  for (const t of allText) {
    const n = normalizeForLetter(t)
    if (n) buckets.add(n)
    n.split(/\s+/).forEach(w => w && buckets.add(w))
  }
  for (const c of buckets) {
    if (candidateMatchesLetter(c, letter)) return true
  }
  return false
}

// 进度 / 关卡掌握度持久化
function loadAlphaProgress() {
  try { return JSON.parse(localStorage.getItem('alphabet_progress') || '{}') } catch { return {} }
}
function saveAlphaProgress(p) { try { localStorage.setItem('alphabet_progress', JSON.stringify(p)) } catch {} }

// 关卡总数 / 每字母星星总数（4 关：看读·听认·配图·排序）
const STAR_TOTAL = 4

// 闯关题目结构：每组 26 题（全覆盖），连续 3 组
const Q_PER_GROUP = 26
const Q_GROUPS = 3
const Q_TOTAL = Q_PER_GROUP * Q_GROUPS // 78

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 生成总题队列：每组独立洗牌的 26 字母（每组都全覆盖）
function makeQuizQueue() {
  const q = []
  let lastEnd = -1
  for (let g = 0; g < Q_GROUPS; g++) {
    let s = shuffle([...Array(26).keys()])
    // 避免上一组结尾 = 下一组开头
    if (s[0] === lastEnd) [s[0], s[1]] = [s[1], s[0]]
    q.push(...s)
    lastEnd = s[s.length - 1]
  }
  return q
}

// 每个字母按关卡记录掌握度：{ A: { 1:true, 2:true, ... }, B: {...} }
function getLetterMastery(progress, letter) {
  return progress[letter.upper] || {}
}
function letterStarsCount(progress, letter) {
  return Object.values(getLetterMastery(progress, letter)).filter(Boolean).length
}
function isLetterFullyMastered(progress, letter) {
  return letterStarsCount(progress, letter) >= STAR_TOTAL
}

// 撒花 confetti 工具
const CONFETTI_COLORS = ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#fb7185']
function spawnConfetti(setConfetti, n = 24) {
  const items = Array.from({ length: n }, () => ({
    id: Math.random().toString(36).slice(2),
    left: Math.random() * 100,
    delay: Math.random() * 0.4,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rot: Math.random() * 360,
  }))
  setConfetti(c => [...c, ...items])
  setTimeout(() => setConfetti(c => c.filter(x => !items.find(it => it.id === x.id))), 2500)
}

// 星星散射
function SparkleBurst({ trigger }) {
  if (!trigger) return null
  const pts = [
    { dx: '-90px', dy: '-90px' }, { dx: '90px',  dy: '-90px' },
    { dx: '-110px', dy: '0px' }, { dx: '110px', dy: '0px' },
    { dx: '-80px', dy: '90px' }, { dx: '80px',  dy: '90px' },
    { dx: '0px',   dy: '-120px' }, { dx: '0px', dy: '110px' },
  ]
  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      {pts.map((p, i) => (
        <span key={`${trigger}-${i}`} className="sparkle" style={{ '--dx': p.dx, '--dy': p.dy, color: i % 2 ? '#fbbf24' : '#facc15' }}>★</span>
      ))}
    </div>
  )
}

// 撒花层（fixed 全屏）
function ConfettiLayer({ items }) {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 220 }}>
      {items.map(c => (
        <div key={c.id} className="confetti"
          style={{
            left: `${c.left}%`,
            background: c.color,
            transform: `rotate(${c.rot}deg)`,
            animationDelay: `${c.delay}s`,
            borderRadius: c.id.charCodeAt(0) % 2 === 0 ? '50%' : '2px',
          }} />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// 字母小卡片：动漫风彩色 + SVG 图标 + 掌握进度环
// ─────────────────────────────────────────────────────────────
function LetterCard({ letter, selected, mastered, stars, onClick }) {
  const t = themeOf(letter)
  const total = STAR_TOTAL
  const ringStrokeBase = 'rgba(255,255,255,0.25)'
  const ringStrokeFilled = 'rgba(255,255,255,0.95)'
  // ring 实现：4 段，分别旋转 90°
  const segments = Array.from({ length: total }, (_, i) => i < stars)

  return (
    <button onClick={onClick}
      className={`relative group rounded-2xl p-1 sm:p-2 transition-all active:scale-95 bg-gradient-to-br ${t.from} ${t.to} backdrop-blur-xl backdrop-saturate-150 border border-white/15
        ${selected ? `ring-2 sm:ring-4 ${t.ring} ${t.glow} letter-pulse` : 'hover:scale-105 hover:-translate-y-0.5 shadow-md'}
      `}>
      {/* 掌握度环 - 右上角小圈（手机更小） */}
      <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-7 sm:h-7 z-10">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle cx="18" cy="18" r="14" fill="rgba(15,23,42,0.85)" stroke={ringStrokeBase} strokeWidth="3"/>
          {segments.map((on, i) => on && (
            <circle key={i} cx="18" cy="18" r="14" fill="none"
              stroke={ringStrokeFilled} strokeWidth="3"
              strokeDasharray={`${Math.PI * 28 / total} ${Math.PI * 28}`}
              strokeDashoffset={-i * Math.PI * 28 / total}/>
          ))}
        </svg>
        {mastered && <span className="absolute inset-0 flex items-center justify-center text-yellow-300 text-[10px] sm:text-sm leading-none">★</span>}
      </div>

      {/* 大写 + 小写（紧凑：手机端能放下 26 个） */}
      <div className="flex flex-col items-center justify-center gap-0 py-1">
        <span className={`text-2xl sm:text-4xl font-extrabold ${t.text} leading-tight drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]`}>{letter.upper}</span>
        <span className={`text-base sm:text-2xl font-bold ${t.text} opacity-85 leading-tight`}>{letter.lower}</span>
      </div>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────
// Level 1 · 看读：大卡片 + 跟读识别 + 翻面显示例词
// ─────────────────────────────────────────────────────────────
function LevelSayIt({ progress, setProgress, onXp, onCrystal, sounds, sr }) {
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [pandaMood, setPandaMood] = useState('idle')
  const [duMsg, setDuMsg] = useState('')
  const [showSparkle, setShowSparkle] = useState(0)
  const cancelTokenRef = useRef(0)

  const letter = ALPHABET_LETTERS[idx]
  const t = themeOf(letter)
  const stars = letterStarsCount(progress, letter)

  function markStar() {
    const p = { ...progress }
    p[letter.upper] = { ...(p[letter.upper] || {}), 1: true }
    setProgress(p); saveAlphaProgress(p)
  }

  function onTap() {
    unlockAudio()
    const myToken = ++cancelTokenRef.current
    setPandaMood('listening'); setDuMsg('🔊 听字母…')

    // 1) 先播 TTS（先念一遍）
    speakLetter(letter.upper)

    // 2) 等 TTS 大致播完再开始听（避免麦克风把 TTS 当成用户声音）
    let fails = 0
    let softTries = 0

    function startListen() {
      if (cancelTokenRef.current !== myToken) return
      if (!sr.supported) { setDuMsg('请用 Chrome 浏览器开启麦克风'); setPandaMood('idle'); return }
      setDuMsg('🎤 现在跟读…')
      sr.listen({
        onResult: (text, alts) => {
          if (cancelTokenRef.current !== myToken) return
          // 调试日志：F12 看 [字母] target/heard/alts
          console.debug('[字母]', { target: letter.upper, heard: text, alts })
          if (matchLetter(text, alts, letter.upper)) {
            softTries = 0; fails = 0
            setPandaMood('correct'); sounds.playCorrect?.(); sounds.playBubble?.()
            onXp?.(3); setFlipped(true); setShowSparkle(s => s + 1); setDuMsg(`🎉 棒！听到「${text}」`)
            markStar()
            setTimeout(() => {
              if (cancelTokenRef.current !== myToken) return
              setFlipped(false); setPandaMood('idle'); setDuMsg('')
            }, 1500)
          } else {
            softTries = 0; fails += 1
            sounds.playError?.()
            if (fails >= 3) {
              setPandaMood('wrong'); setDuMsg(`听到「${text}」· 多试几次哦`)
              setTimeout(() => { if (cancelTokenRef.current === myToken) { setPandaMood('idle'); setDuMsg('') } }, 1600)
            } else {
              setPandaMood('wrong'); setDuMsg(`听到「${text}」再来 (${fails}/3)`)
              setTimeout(() => { if (cancelTokenRef.current === myToken) { setPandaMood('listening'); startListen() } }, 950)
            }
          }
        },
        onError: (err) => {
          if (cancelTokenRef.current !== myToken) return
          if (err === 'unsupported') { setDuMsg('换台 Chrome 浏览器试试'); setPandaMood('idle'); return }
          if (err === 'not-allowed' || err === 'service-not-allowed') {
            setDuMsg('请允许麦克风权限'); setPandaMood('idle'); return
          }
          if (err === 'aborted') return
          // 无声 / 网络抖动：自动软重试 2 次，不计失败
          if (err === 'no-speech' || err === 'audio-capture' || err === 'network') {
            if (softTries < 2) {
              softTries += 1
              setDuMsg(`🔇 没听到声音，大声点！(${softTries}/2)`)
              setTimeout(() => { if (cancelTokenRef.current === myToken) startListen() }, 350)
              return
            }
            softTries = 0
            setPandaMood('wrong'); setDuMsg('🔇 一直没听到，再点字母试一次')
            setTimeout(() => { if (cancelTokenRef.current === myToken) { setPandaMood('idle'); setDuMsg('') } }, 1600)
            return
          }
          setPandaMood('wrong'); setDuMsg('识别出错，再试一次')
          setTimeout(() => { if (cancelTokenRef.current === myToken) { setPandaMood('idle'); setDuMsg('') } }, 1400)
        },
      })
    }

    // TTS 大约 0.6~1s，留 1500ms 让它播完
    setTimeout(startListen, 1500)
  }

  useEffect(() => { setFlipped(false); setPandaMood('idle'); setDuMsg(''); cancelTokenRef.current += 1; sr.stop() }, [idx])
  useEffect(() => () => { cancelTokenRef.current += 1; sr.stop() }, [])

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 主大卡片 */}
      <div className="relative du-flip-card w-full max-w-3xl mx-auto" style={{ minHeight: 280 }}>
        <div className={`du-flip-inner ${flipped ? 'is-flipped' : ''}`}>
          {/* 正面 */}
          <div className={`du-flip-front rounded-3xl bg-gradient-to-br ${t.from} ${t.to} ${t.glow} backdrop-blur-xl backdrop-saturate-150 border border-white/15 p-6`}>
            <div className="flex items-center gap-6 sm:gap-10">
              <div className="flex-shrink-0">
                <PandaMascot mood={pandaMood} size={140} />
              </div>
              <button onClick={onTap}
                className={`flex-1 rounded-3xl bg-white/12 hover:bg-white/20 active:scale-95 transition-all p-4 ${pandaMood === 'listening' ? 'hero-glow' : ''}`}>
                <div className={`flex items-baseline justify-center gap-3 ${t.text}`}>
                  <span className="text-[110px] sm:text-[130px] font-black leading-none drop-shadow-[0_6px_8px_rgba(0,0,0,0.4)]">{letter.upper}</span>
                  <span className="text-[80px] sm:text-[100px] font-black leading-none opacity-90">{letter.lower}</span>
                </div>
                <div className={`mt-1 text-center ${t.text} text-sm font-bold opacity-90`}>
                  读音 <span className="font-mono">{letter.sound}</span>
                </div>
                <div className={`text-center ${t.text} text-xs opacity-80 mt-1`}>👆 点这里听字母 + 跟读</div>
              </button>
            </div>
            {duMsg && <div className={`mt-2 text-center text-sm font-semibold ${t.text} drop-shadow`}>{duMsg}</div>}
            {sr.listening && sr.heard && (
              <div className={`mt-1 text-center text-xs ${t.text} opacity-80`}>
                听到: <span className="font-mono font-bold">{sr.heard}</span>
              </div>
            )}
            <SparkleBurst trigger={showSparkle} />
          </div>
          {/* 背面 - 例词 */}
          <div className={`du-flip-back rounded-3xl bg-gradient-to-br ${t.from} ${t.to} backdrop-blur-xl backdrop-saturate-150 border border-white/15 p-6 flex flex-col items-center justify-center gap-3`}>
            <div className="text-3xl">✨</div>
            <AlphabetIcon name={letter.icon} size={120} />
            <div className={`text-3xl font-bold ${t.text}`}>{letter.example}</div>
            <div className={`text-lg ${t.text} opacity-90`}>{letter.zh}</div>
          </div>
        </div>
      </div>

      {/* 26 字母网格 */}
      <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 sm:gap-2.5 w-full max-w-3xl mx-auto">
        {ALPHABET_LETTERS.map((L, i) => (
          <LetterCard key={L.upper} letter={L} selected={i === idx}
            mastered={isLetterFullyMastered(progress, L)}
            stars={letterStarsCount(progress, L)}
            onClick={() => { setIdx(i); unlockAudio(); speakLetter(L.upper) }} />
        ))}
      </div>

      <div className="text-center text-xs text-slate-500 mb-2">点字母听音 + 跟读 · 读对 +3 XP ⭐</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Level 2 · 听认：随机播放字母音，在网格里点对应字母
// ─────────────────────────────────────────────────────────────
function LevelFindIt({ progress, setProgress, onXp, onCrystal, sounds }) {
  const [queue, setQueue] = useState(() => makeQuizQueue())
  const [cursor, setCursor] = useState(0)
  const [feedback, setFeedback] = useState(null) // null | 'right' | 'wrong'
  const [pandaMood, setPandaMood] = useState('idle')
  const [streak, setStreak] = useState(0)
  const [done, setDone] = useState(false)

  const targetIdx = queue[cursor]
  const target = ALPHABET_LETTERS[targetIdx]
  const group = Math.floor(cursor / Q_PER_GROUP) + 1
  const inGroup = (cursor % Q_PER_GROUP) + 1

  function play() {
    unlockAudio(); speakLetter(target.upper)
    setPandaMood('listening')
    setTimeout(() => setPandaMood('idle'), 1200)
  }
  // 每到新题自动播一次（带清理，避免叠加 timer 导致漏播）
  useEffect(() => {
    if (done) return
    const t = setTimeout(play, 350)
    return () => clearTimeout(t)
  }, [cursor, done])

  function markStar() {
    const p = { ...progress }
    p[target.upper] = { ...(p[target.upper] || {}), 2: true }
    setProgress(p); saveAlphaProgress(p)
  }

  function advance() {
    if (cursor + 1 >= Q_TOTAL) {
      setDone(true); setPandaMood('correct')
      sounds.playFireworks?.(); sounds.playVictory?.()
      onXp?.(5); onCrystal?.('blue', 1, 'alpha_listen_group', {})
    } else {
      setCursor(c => c + 1); setFeedback(null)
    }
  }
  function restart() {
    setQueue(makeQuizQueue()); setCursor(0); setDone(false); setFeedback(null); setStreak(0)
  }

  function onPick(i) {
    if (feedback || done) return
    if (i === targetIdx) {
      setFeedback('right'); setPandaMood('correct')
      sounds.playCorrect?.(); sounds.playBubble?.(); onXp?.(3)
      markStar()
      const ns = streak + 1; setStreak(ns)
      if (ns === 5) onCrystal?.('purple', 1, 'alpha_listen_streak5', { level: 2 })
      if (ns === 10) onCrystal?.('purple', 2, 'alpha_listen_streak10', { level: 2 })
      setTimeout(() => { setPandaMood('idle'); advance() }, 1000)
    } else {
      setFeedback('wrong'); setPandaMood('wrong')
      sounds.playError?.(); setStreak(0)
      setTimeout(() => { setFeedback(null); setPandaMood('idle') }, 900)
    }
  }

  if (done) {
    return (
      <div className="w-full flex flex-col items-center gap-4 py-10">
        <PandaMascot mood="correct" size={140} />
        <div className="text-2xl font-bold text-green-400">🎉 听认闯关完成！</div>
        <div className="text-sm text-slate-400">本轮 {Q_TOTAL} 题 · {Q_GROUPS} 组全部完成</div>
        <button onClick={restart}
          className="mt-2 px-6 py-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white text-lg font-bold shadow-lg active:scale-95 transition-all">
          🔁 再来一轮
        </button>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-4 items-center">
      <div className="flex items-center gap-4 sm:gap-6">
        <PandaMascot mood={pandaMood} size={120} />
        <div className="flex flex-col gap-2 items-center">
          <button onClick={play}
            className="px-5 py-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white text-lg font-bold shadow-lg ring-2 ring-cyan-300/50 active:scale-95 transition-all">
            🔊 再听一次
          </button>
          <div className="text-sm text-slate-300">第 {group}/{Q_GROUPS} 组 · 第 {inGroup}/{Q_PER_GROUP} 题 · 连击 {streak} 🔥</div>
          <div className="text-xs text-slate-500">听字母音 → 在下面点对应字母</div>
        </div>
      </div>

      <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 sm:gap-2.5 w-full max-w-3xl">
        {ALPHABET_LETTERS.map((L, i) => {
          const isTarget = i === targetIdx
          const reveal = feedback === 'right' && isTarget
          const t = themeOf(L)
          return (
            <button key={L.upper} onClick={() => onPick(i)} disabled={!!feedback}
              className={`relative aspect-square rounded-2xl bg-gradient-to-br ${t.from} ${t.to} backdrop-blur-xl backdrop-saturate-150 border border-white/10 active:scale-95 transition-all
                ${reveal ? `ring-4 ring-green-300 ${t.glow} letter-bounce` : 'hover:scale-105'}
                ${feedback === 'wrong' ? 'opacity-80' : ''}
                flex items-center justify-center font-black text-2xl sm:text-3xl ${t.text} drop-shadow`}>
              {L.upper}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Level 3 · 配图：看 SVG 图猜首字母（4 选 1）
// ─────────────────────────────────────────────────────────────
function LevelMatchPic({ progress, setProgress, onXp, onCrystal, sounds }) {
  const [queue, setQueue] = useState(() => makeQuizQueue())
  const [cursor, setCursor] = useState(0)
  const [options, setOptions] = useState([])
  const [pick, setPick] = useState(null)
  const [pandaMood, setPandaMood] = useState('idle')
  const [streak, setStreak] = useState(0)
  const [done, setDone] = useState(false)

  const targetIdx = queue[cursor]
  const target = ALPHABET_LETTERS[targetIdx]
  const group = Math.floor(cursor / Q_PER_GROUP) + 1
  const inGroup = (cursor % Q_PER_GROUP) + 1

  function genOptions(corrIdx) {
    const wrongs = []
    while (wrongs.length < 3) {
      const r = Math.floor(Math.random() * 26)
      if (r !== corrIdx && !wrongs.includes(r)) wrongs.push(r)
    }
    return shuffle([corrIdx, ...wrongs])
  }

  // 新题：生成选项 + 念出例词（神经音）
  useEffect(() => {
    if (done) return
    setOptions(genOptions(targetIdx)); setPick(null)
    unlockAudio()
    const t = setTimeout(() => playWordAudio(target.example), 300)
    return () => clearTimeout(t)
  }, [cursor, done])

  function markStar() {
    const p = { ...progress }
    p[target.upper] = { ...(p[target.upper] || {}), 3: true }
    setProgress(p); saveAlphaProgress(p)
  }

  function advance() {
    if (cursor + 1 >= Q_TOTAL) {
      setDone(true); setPandaMood('correct')
      sounds.playFireworks?.(); sounds.playVictory?.()
      onXp?.(5); onCrystal?.('blue', 1, 'alpha_match_group', {})
    } else {
      setCursor(c => c + 1); setPandaMood('idle')
    }
  }
  function restart() {
    setQueue(makeQuizQueue()); setCursor(0); setDone(false); setPick(null); setStreak(0)
  }

  function onPick(i) {
    if (pick !== null || done) return
    setPick(i)
    const chosenIdx = options[i]
    if (chosenIdx === targetIdx) {
      setPandaMood('correct'); sounds.playCorrect?.(); sounds.playBubble?.()
      speakLetter(target.upper)
      onXp?.(3); markStar()
      const ns = streak + 1; setStreak(ns)
      if (ns === 5) onCrystal?.('purple', 1, 'alpha_match_streak5', { level: 3 })
      setTimeout(advance, 1100)
    } else {
      setPandaMood('wrong'); sounds.playError?.(); setStreak(0)
      setTimeout(() => { setPick(null); setPandaMood('idle') }, 1000)
    }
  }

  if (done) {
    return (
      <div className="w-full flex flex-col items-center gap-4 py-10">
        <PandaMascot mood="correct" size={140} />
        <div className="text-2xl font-bold text-green-400">🎉 配图闯关完成！</div>
        <div className="text-sm text-slate-400">本轮 {Q_TOTAL} 题 · {Q_GROUPS} 组全部完成</div>
        <button onClick={restart}
          className="mt-2 px-6 py-3 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-400 text-white text-lg font-bold shadow-lg active:scale-95 transition-all">
          🔁 再来一轮
        </button>
      </div>
    )
  }

  const t = themeOf(target)

  return (
    <div className="w-full flex flex-col gap-4 items-center">
      <div className="flex items-center gap-4">
        <PandaMascot mood={pandaMood} size={110} />
        <div className="text-sm text-slate-300">第 {group}/{Q_GROUPS} 组 · 第 {inGroup}/{Q_PER_GROUP} 题 · 连击 {streak} 🔥</div>
      </div>

      <button onClick={() => playWordAudio(target.example)}
        className={`rounded-3xl bg-gradient-to-br ${t.from} ${t.to} ${t.glow} backdrop-blur-xl backdrop-saturate-150 border border-white/15 p-8 flex flex-col items-center gap-2 active:scale-95 transition-all`}>
        <AlphabetIcon name={target.icon} size={130} />
        <div className={`text-xl font-bold ${t.text}`}>{target.example}</div>
        <div className={`text-sm ${t.text} opacity-80`}>{target.zh}</div>
        <div className={`text-xs ${t.text} opacity-70 mt-1`}>🔊 这个东西是哪个字母开头？</div>
      </button>

      <div className="grid grid-cols-4 gap-3 w-full max-w-2xl">
        {options.map((optIdx, i) => {
          const L = ALPHABET_LETTERS[optIdx]
          const ot = themeOf(L)
          const isCorrect = optIdx === targetIdx
          const showRight = pick !== null && isCorrect
          const showWrong = pick === i && !isCorrect
          return (
            <button key={i} onClick={() => onPick(i)} disabled={pick !== null}
              className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${ot.from} ${ot.to} backdrop-blur-xl backdrop-saturate-150 border border-white/10 font-black text-4xl sm:text-5xl ${ot.text} drop-shadow transition-all active:scale-95
                ${showRight ? `ring-4 ring-green-300 letter-bounce ${ot.glow}` : ''}
                ${showWrong ? 'opacity-50 ring-4 ring-red-400' : ''}
                ${pick === null ? 'hover:scale-105' : ''}
              `}>
              {L.upper}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Level 4 · 排序：8 个乱序字母条 → 按 ABC 顺序连点
// ─────────────────────────────────────────────────────────────
function LevelOrderIt({ progress, setProgress, onXp, onCrystal, sounds }) {
  const [items, setItems] = useState(() => makeOrderRound())
  const [pickedIdx, setPickedIdx] = useState(0) // 期望点击 items 排序后下一个的索引
  const [feedback, setFeedback] = useState(null)
  const [pandaMood, setPandaMood] = useState('idle')
  const [rounds, setRounds] = useState(0)

  function makeOrderRound() {
    const start = Math.floor(Math.random() * (26 - 8))
    const picked = ALPHABET_LETTERS.slice(start, start + 8)
    const shuffled = [...picked]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled.map((L, idx) => ({ ...L, _id: `${L.upper}-${idx}`, picked: false, expectedOrder: picked.findIndex(p => p.upper === L.upper) }))
  }

  function markStars(letters) {
    const p = { ...progress }
    letters.forEach(L => {
      p[L.upper] = { ...(p[L.upper] || {}), 4: true }
    })
    setProgress(p); saveAlphaProgress(p)
  }

  function onPick(item) {
    if (item.picked || feedback) return
    if (item.expectedOrder === pickedIdx) {
      const next = items.map(x => x._id === item._id ? { ...x, picked: true } : x)
      setItems(next)
      sounds.playCorrect?.(); sounds.playBubble?.(); onXp?.(2)
      if (pickedIdx === 7) {
        // 完成一轮
        setFeedback('done'); setPandaMood('correct')
        markStars(items)
        onXp?.(5); onCrystal?.('blue', 1, 'alpha_order_done', { round: rounds + 1 })
        sounds.playFireworks?.(); sounds.playVictory?.()
        setTimeout(() => {
          setItems(makeOrderRound()); setPickedIdx(0); setFeedback(null); setPandaMood('idle')
          setRounds(r => r + 1)
        }, 1800)
      } else {
        setPickedIdx(p => p + 1)
      }
    } else {
      setFeedback('wrong'); setPandaMood('wrong'); sounds.playError?.()
      setTimeout(() => { setFeedback(null); setPandaMood('idle') }, 800)
    }
  }

  function reset() { setItems(makeOrderRound()); setPickedIdx(0); setFeedback(null); setPandaMood('idle') }

  return (
    <div className="w-full flex flex-col gap-4 items-center">
      <div className="flex items-center gap-4">
        <PandaMascot mood={pandaMood} size={110} />
        <div className="text-center">
          <div className="text-sm text-slate-300">按 <span className="text-yellow-300 font-bold">ABC 顺序</span> 点字母</div>
          <div className="text-xs text-slate-500 mt-1">已点 {pickedIdx} / 8</div>
        </div>
        <button onClick={reset} className="ml-2 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700">↻ 换</button>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center w-full max-w-2xl">
        {items.map(item => {
          const t = themeOf(item)
          return (
            <button key={item._id} onClick={() => onPick(item)} disabled={item.picked || !!feedback}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${t.from} ${t.to} backdrop-blur-xl backdrop-saturate-150 border border-white/10 font-black text-3xl sm:text-4xl ${t.text} drop-shadow transition-all active:scale-95
                ${item.picked ? 'opacity-30 scale-90' : 'hover:scale-110'}
                ${feedback === 'wrong' && !item.picked && item.expectedOrder === pickedIdx ? 'animate-pulse ring-4 ring-yellow-300' : ''}
              `}>
              {item.upper}
            </button>
          )
        })}
      </div>
      {feedback === 'done' && (
        <div className="text-2xl font-bold text-green-400 animate-pulse">🎉 顺序全对！</div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Level 5 · 大小写：看大写字母，从 4 个小写里选匹配的
// ─────────────────────────────────────────────────────────────
function LevelMatchCase({ progress, setProgress, onXp, onCrystal, sounds }) {
  const [queue, setQueue] = useState(() => makeQuizQueue())
  const [cursor, setCursor] = useState(0)
  const [options, setOptions] = useState([])
  const [pick, setPick] = useState(null)
  const [pandaMood, setPandaMood] = useState('idle')
  const [streak, setStreak] = useState(0)
  const [done, setDone] = useState(false)

  const targetIdx = queue[cursor]
  const target = ALPHABET_LETTERS[targetIdx]
  const group = Math.floor(cursor / Q_PER_GROUP) + 1
  const inGroup = (cursor % Q_PER_GROUP) + 1

  function genOptions(corrIdx) {
    const wrongs = []
    while (wrongs.length < 3) {
      const r = Math.floor(Math.random() * 26)
      if (r !== corrIdx && !wrongs.includes(r)) wrongs.push(r)
    }
    return shuffle([corrIdx, ...wrongs])
  }

  useEffect(() => {
    if (done) return
    setOptions(genOptions(targetIdx)); setPick(null)
    unlockAudio()
    const t = setTimeout(() => speakLetter(target.upper), 300)
    return () => clearTimeout(t)
  }, [cursor, done])

  function markStar() {
    const p = { ...progress }
    p[target.upper] = { ...(p[target.upper] || {}), 5: true }
    setProgress(p); saveAlphaProgress(p)
  }

  function advance() {
    if (cursor + 1 >= Q_TOTAL) {
      setDone(true); setPandaMood('correct')
      sounds.playFireworks?.(); sounds.playVictory?.()
      onXp?.(5); onCrystal?.('blue', 1, 'alpha_case_group', {})
    } else {
      setCursor(c => c + 1); setPandaMood('idle')
    }
  }
  function restart() {
    setQueue(makeQuizQueue()); setCursor(0); setDone(false); setPick(null); setStreak(0)
  }

  function onPick(i) {
    if (pick !== null || done) return
    setPick(i)
    if (options[i] === targetIdx) {
      setPandaMood('correct'); sounds.playCorrect?.(); sounds.playBubble?.()
      speakLetter(target.upper)
      onXp?.(3); markStar()
      const ns = streak + 1; setStreak(ns)
      if (ns === 5) onCrystal?.('purple', 1, 'alpha_case_streak5', { level: 5 })
      setTimeout(advance, 1000)
    } else {
      setPandaMood('wrong'); sounds.playError?.(); setStreak(0)
      setTimeout(() => { setPick(null); setPandaMood('idle') }, 900)
    }
  }

  if (done) {
    return (
      <div className="w-full flex flex-col items-center gap-4 py-10">
        <PandaMascot mood="correct" size={140} />
        <div className="text-2xl font-bold text-green-400">🎉 大小写闯关完成！</div>
        <div className="text-sm text-slate-400">本轮 {Q_TOTAL} 题 · {Q_GROUPS} 组全部完成</div>
        <button onClick={restart}
          className="mt-2 px-6 py-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-400 text-white text-lg font-bold shadow-lg active:scale-95 transition-all">
          🔁 再来一轮
        </button>
      </div>
    )
  }

  const t = themeOf(target)

  return (
    <div className="w-full flex flex-col gap-4 items-center">
      <div className="flex items-center gap-4">
        <PandaMascot mood={pandaMood} size={110} />
        <div className="text-sm text-slate-300">第 {group}/{Q_GROUPS} 组 · 第 {inGroup}/{Q_PER_GROUP} 题 · 连击 {streak} 🔥</div>
      </div>

      {/* 大写提示卡 */}
      <button onClick={() => speakLetter(target.upper)}
        className={`rounded-3xl bg-gradient-to-br ${t.from} ${t.to} ${t.glow} backdrop-blur-xl backdrop-saturate-150 border border-white/15 px-12 py-6 flex flex-col items-center gap-1 active:scale-95 transition-all`}>
        <span className={`text-[90px] sm:text-[110px] font-black leading-none ${t.text} drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]`}>{target.upper}</span>
        <span className={`text-xs ${t.text} opacity-75`}>🔊 找出它的小写</span>
      </button>

      {/* 4 个小写选项 */}
      <div className="grid grid-cols-4 gap-3 w-full max-w-2xl">
        {options.map((optIdx, i) => {
          const L = ALPHABET_LETTERS[optIdx]
          const ot = themeOf(L)
          const isCorrect = optIdx === targetIdx
          const showRight = pick !== null && isCorrect
          const showWrong = pick === i && !isCorrect
          return (
            <button key={i} onClick={() => onPick(i)} disabled={pick !== null}
              className={`aspect-square rounded-2xl bg-gradient-to-br ${ot.from} ${ot.to} backdrop-blur-xl backdrop-saturate-150 border border-white/10 font-black text-5xl sm:text-6xl ${ot.text} drop-shadow transition-all active:scale-95
                ${showRight ? `ring-4 ring-green-300 letter-bounce ${ot.glow}` : ''}
                ${showWrong ? 'opacity-50 ring-4 ring-red-400' : ''}
                ${pick === null ? 'hover:scale-105' : ''}
              `}>
              {L.lower}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// 关卡选择 Tab
// ─────────────────────────────────────────────────────────────
const LEVELS = [
  { id: 1, label: '看读', icon: '🗣️', desc: '听字母 + 跟读', from: 'from-rose-500/70',    to: 'to-pink-400/50' },
  { id: 2, label: '听认', icon: '👂', desc: '听音点字母',   from: 'from-blue-500/70',    to: 'to-cyan-400/50' },
  { id: 3, label: '配图', icon: '🖼️', desc: '看图猜字母',   from: 'from-purple-600/70',  to: 'to-fuchsia-400/50' },
  { id: 4, label: '排序', icon: '🔤', desc: '按 ABC 排列',  from: 'from-emerald-500/70', to: 'to-teal-400/50' },
]

// ─────────────────────────────────────────────────────────────
// 主组件
// ─────────────────────────────────────────────────────────────
export default function AlphabetLearn({ onClose, settings, onXp, onCrystal }) {
  const [level, setLevel] = useState(1)
  const [progress, setProgress] = useState(loadAlphaProgress)
  const [confetti, setConfetti] = useState([])
  const sounds = useSound(settings)
  const sr = useSpeechRecognition()

  // 预加载 26 个字母音频（瞬时响应）
  useEffect(() => { preloadLetterAudio() }, [])

  // 全字母大成就：26 个字母 4 关全过 → 金宝石
  useEffect(() => {
    const allDone = ALPHABET_LETTERS.every(L => isLetterFullyMastered(progress, L))
    const flagKey = 'alphabet_full_celebrated'
    if (allDone && !localStorage.getItem(flagKey)) {
      try {
        localStorage.setItem(flagKey, '1')
        onCrystal?.('gold', 3, 'alphabet_full', { letters: 26 })
        onXp?.(50)
        sounds.playFireworks?.(); sounds.playVictory?.()
        spawnConfetti(setConfetti, 60)
      } catch {}
    }
  }, [progress])

  // 总进度数：所有星星 / (26 × 关卡数)
  const STARS_MAX = 26 * STAR_TOTAL
  const totalStars = ALPHABET_LETTERS.reduce((s, L) => s + letterStarsCount(progress, L), 0)
  const totalMastered = ALPHABET_LETTERS.filter(L => isLetterFullyMastered(progress, L)).length

  return (
    <div className="w-full max-w-4xl mx-auto px-3 py-4 relative" style={{ minHeight: 'calc(100vh - 110px)' }}>
      <OceanBg />
      <ConfettiLayer items={confetti} />

      {/* 顶部：返回 + 标题 + 大进度条 */}
      <div className="relative z-10 flex items-center gap-3 mb-4">
        <button onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors shrink-0">
          <IconArrowLeft size={18}/>
        </button>
        <div className="flex-1 min-w-0">
          <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden">
            <div className="h-full rounded-full"
              style={{
                width: `${(totalStars / STARS_MAX) * 100}%`,
                background: totalStars >= STARS_MAX ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#3b82f6,#22d3ee)',
                transition: 'width .45s cubic-bezier(.34,1.56,.64,1)',
              }}>
              <div className="h-[3px] mt-[2px] mx-1 rounded-full bg-white/30"/>
            </div>
          </div>
          <div className="mt-1 text-[10px] text-slate-500 flex justify-between">
            <span>26 字母学习 · {totalMastered}/26 掌握</span>
            <span>⭐ {totalStars}/{STARS_MAX}</span>
          </div>
        </div>
      </div>

      {/* 关卡 Tab */}
      <div className="relative z-10 grid grid-cols-4 gap-2 sm:gap-3 mb-4">
        {LEVELS.map(lv => (
          <button key={lv.id} onClick={() => setLevel(lv.id)}
            className={`lvl-tab rounded-2xl px-2 py-3 bg-gradient-to-br ${lv.from} ${lv.to} backdrop-blur-xl backdrop-saturate-150 border border-white/15 text-white text-center
              ${level === lv.id ? 'lvl-tab-active ring-4 ring-white/60 shadow-lg' : 'opacity-70 hover:opacity-100'}`}>
            <div className="text-2xl">{lv.icon}</div>
            <div className="text-sm font-bold mt-1">{lv.label}</div>
            <div className="text-[10px] opacity-85">{lv.desc}</div>
          </button>
        ))}
      </div>

      {/* 关卡内容 */}
      <div className="relative z-10">
        {level === 1 && <LevelSayIt   progress={progress} setProgress={setProgress} onXp={onXp} onCrystal={onCrystal} sounds={sounds} sr={sr}/>}
        {level === 2 && <LevelFindIt  progress={progress} setProgress={setProgress} onXp={onXp} onCrystal={onCrystal} sounds={sounds}/>}
        {level === 3 && <LevelMatchPic progress={progress} setProgress={setProgress} onXp={onXp} onCrystal={onCrystal} sounds={sounds}/>}
        {level === 4 && <LevelOrderIt progress={progress} setProgress={setProgress} onXp={onXp} onCrystal={onCrystal} sounds={sounds}/>}
      </div>
    </div>
  )
}
