import { useRef, useState, useCallback, useEffect } from 'react'

// 浏览器语音识别（Web Speech API）。网页版 Chrome / Edge / Safari 可用。
// 返回多候选结果，供跟读单词比对。

function getSR() {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

// 归一化：去掉非字母，转小写
export function normWord(s) {
  return (s || '').toLowerCase().replace(/[^a-z]/g, '')
}

// Levenshtein 编辑距离（用于模糊匹配）
function lev(a, b) {
  if (a === b) return 0
  const m = a.length, n = b.length
  if (!m) return n
  if (!n) return m
  let prev = Array.from({ length: n + 1 }, (_, j) => j)
  for (let i = 1; i <= m; i++) {
    const cur = [i]
    for (let j = 1; j <= n; j++) {
      cur[j] = a[i - 1] === b[j - 1]
        ? prev[j - 1]
        : 1 + Math.min(prev[j], cur[j - 1], prev[j - 1])
    }
    prev = cur
  }
  return prev[n]
}

// 常见同音字 / 识别器容易听错的词：键和值都已经 normWord。
// 双向：在比对前会同时查 target→? 和 heard→?
const HOMOPHONES = {
  eye: ['i','ai','ay','aye'],
  i: ['eye','aye','ay','ai'],
  ear: ['year','here','ere','er','yeah'],
  hi: ['high'], high: ['hi'],
  by: ['bye','buy'], bye: ['by','buy'], buy: ['by','bye'],
  to: ['too','two'], too: ['to','two'], two: ['to','too'],
  for: ['four','fore'], four: ['for','fore'], fore: ['for','four'],
  no: ['know','noh'], know: ['no','now'],
  so: ['sew','sow','soh'], sew: ['so','sow'],
  be: ['bee','b'], bee: ['be','b'],
  see: ['sea','c'], sea: ['see','c'], c: ['see','sea'],
  you: ['u','yew','ewe','ya'], u: ['you','yew','ewe'],
  are: ['r','our'], r: ['are'],
  or: ['oar','ore'], oar: ['or','ore'], ore: ['or','oar'],
  new: ['knew','nu'], knew: ['new'],
  write: ['right','rite'], right: ['write','rite'],
  here: ['hear','ear'], hear: ['here','ere'],
  there: ['their','theyre'], their: ['there','theyre'],
  pear: ['pair','pare'], pair: ['pear','pare'], pare: ['pear','pair'],
  hour: ['our'], our: ['hour','are'],
  son: ['sun'], sun: ['son'],
  meet: ['meat'], meat: ['meet'],
  blue: ['blew'], blew: ['blue'],
  red: ['read'], read: ['red','reed'], reed: ['read'],
  rose: ['rows'], rows: ['rose'],
  knight: ['night'], night: ['knight'],
  weak: ['week'], week: ['weak'],
  flower: ['flour'], flour: ['flower'],
  whole: ['hole'], hole: ['whole'],
  ate: ['eight','et'], eight: ['ate'],
  one: ['won','wun'], won: ['one'],
  nine: ['nyne'],
  ten: ['tn'],
  mail: ['male'], male: ['mail'],
  tail: ['tale'], tale: ['tail'],
  sail: ['sale'], sale: ['sail'],
  way: ['weigh'], weigh: ['way'],
  cell: ['sell'], sell: ['cell'],
  scene: ['seen'], seen: ['scene'],
  whether: ['weather'], weather: ['whether'],
  which: ['witch'], witch: ['which'],
  wear: ['where','ware'], where: ['wear','ware'], ware: ['wear','where'],
  bear: ['bare'], bare: ['bear'],
  steal: ['steel'], steel: ['steal'],
  some: ['sum'], sum: ['some'],
  break: ['brake'], brake: ['break'],
  ant: ['aunt'], aunt: ['ant'],
  // 身体部位 — 短词容易被听成代词/虚词
  arm: ['im','am','are','iam','alarm','aam','ahm','imam','arms'],
  am: ['arm','im'],
  head: ['had','hed','heat','hat'],
  hand: ['and','an','hands','han'],
  nose: ['knows','knoes','knose'],
  leg: ['lag','league','ledge','legs'],
  mouth: ['mouse','math','mouf','mowth'],
  foot: ['food','put','futt','foo'],
  back: ['bag','bk','black'],
  neck: ['nick','knack','nack'],
  face: ['phase','fees','fays'],
  knee: ['ne','neat','near','knees','nee'],
  chest: ['chess','jest'],
  hair: ['her','hare','here'],
  toe: ['to','toh','tow','toes'],
  lip: ['lid','lap','lips'],
  chin: ['ching','chen','chien'],
  body: ['buddy','botty','bodey'],
  // 常用动词 / 形容词
  nice: ['ice','knights','nights','nyse'],
  can: ['ken','con','cane'],
  share: ['chair','shore','shear','sher'],
  smile: ['smell','smiley','smiled'],
  help: ['hel','hep','helps'],
  say: ['se','sey','says','said'],
  listen: ['lesson','listen','listening','listens'],
  cool: ['coo','call','kool'],
  cold: ['code','cool','cooled'],
  warm: ['worm','wam','warmed'],
  hot: ['hat','hut','hod'],
  big: ['bag','beg','bigg'],
  small: ['smell','smile','smol'],
  good: ['could','god','goood'],
  fun: ['phone','fan','fune'],
  run: ['ran','rune','rum'],
  jump: ['jam','jumped','jum'],
  walk: ['woke','wok','walks'],
  talk: ['took','toke','talks','tock'],
  yes: ['yas','ya','yess'],
  ok: ['okay','okey'],
  okay: ['ok','okey'],
}

// 填充词：识别结果常带 "a / the / an / um / uh" 这类前后缀，需要剔除
const FILLERS = new Set(['a','an','the','um','uh','er','ah','oh','hm','mm','please','its','it'])

function tokensOf(s) {
  return (s || '').toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/)
    .map(normWord).filter(w => w && !FILLERS.has(w))
}

// 单词近似比对：完全相同、同音字、单复数 -s/-es、过去式 -ed、-ing 都算对；
// 其他按长度容忍 1~2 个编辑距离。
function closeMatch(t, s) {
  if (!t || !s) return false
  if (t === s) return true
  // 同音字（双向查表）
  if ((HOMOPHONES[t] || []).includes(s)) return true
  if ((HOMOPHONES[s] || []).includes(t)) return true
  // 复数/动词变形容错
  if (t + 's' === s || s + 's' === t) return true
  if (t + 'es' === s || s + 'es' === t) return true
  if (t + 'ed' === s || s + 'ed' === t) return true
  if (t + 'd' === s || s + 'd' === t) return true
  if (t + 'ing' === s || s + 'ing' === t) return true
  if (t + 'er' === s || s + 'er' === t) return true
  // 编辑距离（短词也容忍 1，避免 "eye"/"aye" 之类被卡死）
  const L = Math.max(t.length, s.length)
  const tol = L <= 4 ? 1 : L <= 7 ? 1 : 2
  return lev(t, s) <= tol
}

// 把识别候选和目标词比对：候选里任意一个分词或整句近似等于目标即算对
export function matchWord(target, alts) {
  const t = normWord(target)
  if (!t) return false
  return (alts || []).some(a => {
    if (closeMatch(t, normWord(a))) return true
    return tokensOf(a).some(w => closeMatch(t, w))
  })
}

export function useSpeechRecognition() {
  const SR = getSR()
  const supported = !!SR
  const [listening, setListening] = useState(false)
  const [heard, setHeard] = useState('')
  const recRef = useRef(null)
  const callIdRef = useRef(0)   // 当前调用 id，老调用的回调会被屏蔽

  const stop = useCallback(() => {
    callIdRef.current += 1
    try { recRef.current?.abort() } catch {}
    recRef.current = null
    setListening(false)
  }, [])

  const listen = useCallback(({ onResult, onError } = {}) => {
    if (!SR) { onError?.('unsupported'); return }
    try { recRef.current?.abort() } catch {}
    const myId = ++callIdRef.current
    const isCurrent = () => callIdRef.current === myId
    const rec = new SR()
    rec.lang = 'en-US'
    rec.interimResults = true
    rec.maxAlternatives = 5
    rec.continuous = false
    recRef.current = rec
    let finalText = ''
    let bestInterimAlts = []
    let gotFinal = false
    let errorFired = false
    let safetyTimer
    setHeard('')

    function cleanup() {
      clearTimeout(safetyTimer)
      if (isCurrent()) setListening(false)
    }

    rec.onresult = (e) => {
      if (!isCurrent()) return
      let interim = ''
      const alts = []
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i]
        if (r.isFinal) {
          for (let j = 0; j < r.length; j++) alts.push(r[j].transcript)
          finalText = r[0]?.transcript || ''
        } else {
          // 把 interim 的所有候选也存一份，后面 onend 兜底用
          const ialts = []
          for (let j = 0; j < r.length; j++) ialts.push(r[j].transcript)
          if (ialts.length) bestInterimAlts = ialts
          interim += r[0]?.transcript || ''
        }
      }
      setHeard(finalText || interim)
      if (finalText) {
        gotFinal = true
        clearTimeout(safetyTimer)
        try { rec.stop() } catch {}
        onResult?.(finalText, alts)
      }
    }
    rec.onerror = (e) => {
      if (!isCurrent()) return
      errorFired = true
      cleanup()
      onError?.(e?.error || 'error')
    }
    rec.onend = () => {
      if (!isCurrent()) return
      cleanup()
      // ⚠️ Web Speech bug：有时 onend 既无 onresult 又无 onerror。
      // 如果之前有 interim 文本，就把它当作 final 喂回去；否则当 no-speech。
      if (!gotFinal && !errorFired) {
        if (bestInterimAlts.length && bestInterimAlts[0]) {
          onResult?.(bestInterimAlts[0], bestInterimAlts)
        } else {
          onError?.('no-speech')
        }
      }
    }
    try {
      rec.start()
      setListening(true)
      // 安全超时：8 秒内一定收到回调，否则强制结束
      safetyTimer = setTimeout(() => {
        if (!isCurrent()) return
        if (!gotFinal && !errorFired) {
          try { rec.abort() } catch {}
          cleanup()
          if (bestInterimAlts.length && bestInterimAlts[0]) {
            onResult?.(bestInterimAlts[0], bestInterimAlts)
          } else {
            onError?.('no-speech')
          }
        }
      }, 8000)
    } catch (err) {
      cleanup()
      onError?.(String(err))
    }
  }, [SR])

  useEffect(() => () => { try { recRef.current?.abort() } catch {} }, [])

  return { supported, listening, heard, listen, stop }
}
