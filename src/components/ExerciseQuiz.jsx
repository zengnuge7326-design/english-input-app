import { useState, useEffect, useRef } from 'react'

// ── 工具函数 ──────────────────────────────────────────────────────────────────

// 从数组中随机取 n 个不重复元素
function sample(arr, n) {
  const copy = [...arr]
  const out = []
  while (out.length < n && copy.length > 0) {
    const i = Math.floor(Math.random() * copy.length)
    out.push(copy.splice(i, 1)[0])
  }
  return out
}

// 从句子中提取关键词（过滤太短或标点）
function keyWords(sentence) {
  return sentence.en
    .replace(/[.,!?'"]/g, '')
    .split(' ')
    .filter(w => w.length > 2)
}

// 打乱数组
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 清理句子首字母大写 + 标点，用于比较
function normalize(s) {
  return s.trim().replace(/\s+/g, ' ').toLowerCase().replace(/[.,!?]/g, '')
}

// ── 题目生成器 ────────────────────────────────────────────────────────────────

function makeListenWord(sentence, allSentences) {
  // Q1: 听音选词 — 播放句子，选出句中出现的关键词
  const correct = sample(keyWords(sentence), 1)[0]
  if (!correct) return null
  const distractors = allSentences
    .filter(s => s.id !== sentence.id)
    .flatMap(s => keyWords(s))
    .filter(w => w.toLowerCase() !== correct.toLowerCase())
  const wrong = sample([...new Set(distractors)], 3)
  if (wrong.length < 3) return null
  return {
    type: 'listen_word',
    tts: sentence.en,
    question: '听录音，选出你听到的单词',
    options: shuffle([correct, ...wrong]),
    answer: correct,
    sentence,
  }
}

function makeListenQA(sentence, allSentences) {
  // Q2: 听问句选答语 — 仅适用于问句
  if (!sentence.en.includes('?')) return null
  const correct = sentence.zh  // 用中文答案避免过于明显
  // 从其他句子取中文干扰项
  const wrong = sample(
    allSentences.filter(s => s.id !== sentence.id).map(s => s.zh),
    3
  )
  if (wrong.length < 3) return null
  return {
    type: 'listen_qa',
    tts: sentence.en,
    question: '听问句，选出正确的回答',
    options: shuffle([correct, ...wrong]),
    answer: correct,
    sentence,
  }
}

function makeWordOrder(sentence) {
  // Q3: 连词成句 — 打乱单词顺序
  const words = sentence.words?.map(w => w.w).filter(Boolean)
  if (!words || words.length < 3) return null
  const shuffled = shuffle(words)
  // 确保打乱后不等于原顺序
  if (shuffled.join(' ') === words.join(' ')) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]]
  }
  return {
    type: 'word_order',
    question: `连词成句：${sentence.zh}`,
    words: shuffled,
    answer: sentence.en,
    sentence,
  }
}

function makeZhToEn(sentence, allSentences) {
  // Q4: 中译英单选
  const wrong = sample(
    allSentences.filter(s => s.id !== sentence.id).map(s => s.en),
    3
  )
  if (wrong.length < 3) return null
  return {
    type: 'zh_to_en',
    question: sentence.zh,
    options: shuffle([sentence.en, ...wrong]),
    answer: sentence.en,
    sentence,
  }
}

function makeEnToZh(sentence, allSentences) {
  // Q5: 英译中单选
  const wrong = sample(
    allSentences.filter(s => s.id !== sentence.id).map(s => s.zh),
    3
  )
  if (wrong.length < 3) return null
  return {
    type: 'en_to_zh',
    question: sentence.en,
    options: shuffle([sentence.zh, ...wrong]),
    answer: sentence.zh,
    sentence,
  }
}

// 为一组句子生成5道题
export function generateQuiz(sentences, allSentences) {
  const picked = sample(sentences, Math.min(5, sentences.length))
  const questions = []

  // Q1 听音选词
  for (const s of picked) {
    const q = makeListenWord(s, allSentences)
    if (q) { questions.push(q); break }
  }

  // Q2 听问句选答语（找问句）
  const qSentences = picked.filter(s => s.en.includes('?'))
  const qPool = qSentences.length > 0 ? qSentences : sentences.filter(s => s.en.includes('?'))
  for (const s of qPool) {
    const q = makeListenQA(s, allSentences)
    if (q) { questions.push(q); break }
  }

  // Q3 连词成句
  for (const s of picked) {
    const q = makeWordOrder(s)
    if (q) { questions.push(q); break }
  }

  // Q4 中译英
  const remaining = picked.filter(s => !questions.some(q => q.sentence?.id === s.id))
  const pool4 = remaining.length > 0 ? remaining : picked
  for (const s of pool4) {
    const q = makeZhToEn(s, allSentences)
    if (q) { questions.push(q); break }
  }

  // Q5 英译中
  const remaining2 = picked.filter(s => !questions.some(q => q.sentence?.id === s.id))
  const pool5 = remaining2.length > 0 ? remaining2 : picked
  for (const s of pool5) {
    const q = makeEnToZh(s, allSentences)
    if (q) { questions.push(q); break }
  }

  return questions
}

// ── TTS 播放 ──────────────────────────────────────────────────────────────────
function useTTS() {
  const speak = (text) => {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.rate = 0.9
    window.speechSynthesis.speak(u)
  }
  return speak
}

// ── 单题渲染 ──────────────────────────────────────────────────────────────────

function OptionBtn({ label, selected, correct, wrong, disabled, onClick }) {
  let cls = 'w-full text-left px-5 py-4 rounded-xl border text-base transition-all '
  if (correct) cls += 'bg-green-900/40 border-green-500 text-green-300'
  else if (wrong) cls += 'bg-red-900/40 border-red-500 text-red-300'
  else if (selected) cls += 'bg-blue-900/40 border-blue-500 text-blue-200'
  else if (disabled) cls += 'bg-gray-900 border-gray-800 text-gray-500'
  else cls += 'bg-gray-900 border-gray-700 hover:border-gray-500 text-gray-200 cursor-pointer'
  return <button className={cls} disabled={disabled} onClick={onClick}>{label}</button>
}

function ListenQuestion({ q, speak, onAnswer, answered }) {
  const [selected, setSelected] = useState(null)

  function pick(opt) {
    if (answered) return
    setSelected(opt)
    onAnswer(opt === q.answer)
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => speak(q.tts)}
        className="flex items-center gap-3 mx-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
      >
        <span className="text-xl">🔊</span>
        <span>播放录音</span>
      </button>
      <p className="text-gray-400 text-sm text-center">{q.question}</p>
      <div className="grid grid-cols-2 gap-2">
        {q.options.map((opt, i) => (
          <OptionBtn
            key={i} label={opt}
            selected={selected === opt}
            correct={answered && opt === q.answer}
            wrong={answered && selected === opt && opt !== q.answer}
            disabled={answered && selected !== opt && opt !== q.answer}
            onClick={() => pick(opt)}
          />
        ))}
      </div>
    </div>
  )
}

function ChoiceQuestion({ q, onAnswer, answered }) {
  const [selected, setSelected] = useState(null)

  function pick(opt) {
    if (answered) return
    setSelected(opt)
    onAnswer(opt === q.answer)
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-white text-xl leading-relaxed bg-gray-800/60 rounded-xl px-5 py-4 text-center font-medium">
        {q.question}
      </p>
      <div className="flex flex-col gap-3">
        {q.options.map((opt, i) => (
          <OptionBtn
            key={i} label={opt}
            selected={selected === opt}
            correct={answered && opt === q.answer}
            wrong={answered && selected === opt && opt !== q.answer}
            disabled={answered && selected !== opt && opt !== q.answer}
            onClick={() => pick(opt)}
          />
        ))}
      </div>
    </div>
  )
}

function WordOrderQuestion({ q, onAnswer, answered }) {
  const [placed, setPlaced] = useState([])
  const [pool, setPool] = useState(() => q.words.map((w, i) => ({ w, i })))
  const [result, setResult] = useState(null) // null | true | false

  function addWord(item) {
    if (answered) return
    setPlaced(p => [...p, item])
    setPool(p => p.filter(x => x.i !== item.i))
  }

  function removeWord(item) {
    if (answered) return
    setPool(p => [...p, item])
    setPlaced(p => p.filter(x => x.i !== item.i))
  }

  function check() {
    const formed = placed.map(x => x.w).join(' ')
    const ok = normalize(formed) === normalize(q.answer)
    setResult(ok)
    onAnswer(ok)
  }

  const canCheck = placed.length === q.words.length && !answered

  return (
    <div className="flex flex-col gap-4">
      <p className="text-gray-400 text-sm text-center">{q.question}</p>

      {/* 已排列区 */}
      <div className="min-h-12 bg-gray-800/40 border border-gray-700 rounded-xl px-3 py-2 flex flex-wrap gap-2">
        {placed.length === 0
          ? <span className="text-gray-600 text-sm self-center">点击下方单词排列句子…</span>
          : placed.map((item, i) => (
            <button key={i} onClick={() => removeWord(item)}
              className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-sm transition-colors">
              {item.w}
            </button>
          ))
        }
      </div>

      {/* 单词池 */}
      <div className="flex flex-wrap gap-2 justify-center">
        {pool.map((item, i) => (
          <button key={i} onClick={() => addWord(item)}
            className="px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-500 text-gray-200 text-sm transition-colors">
            {item.w}
          </button>
        ))}
      </div>

      {/* 结果 & 提交 */}
      {answered && (
        <div className={`text-sm text-center px-3 py-2 rounded-xl ${result ? 'text-green-400 bg-green-900/30' : 'text-red-400 bg-red-900/30'}`}>
          {result ? '✓ 正确！' : `✗ 正确答案：${q.answer}`}
        </div>
      )}
      {!answered && (
        <button onClick={check} disabled={!canCheck}
          className="mx-auto px-8 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          确认
        </button>
      )}
    </div>
  )
}

// ── 主组件 ────────────────────────────────────────────────────────────────────

const Q_LABELS = {
  listen_word: '听音选词',
  listen_qa:   '听问句选答语',
  word_order:  '连词成句',
  zh_to_en:    '中译英',
  en_to_zh:    '英译中',
}

export default function ExerciseQuiz({ questions, title, onClose }) {
  const [idx, setIdx] = useState(0)
  const [answeredList, setAnsweredList] = useState([]) // true/false per question
  const [showAnswer, setShowAnswer] = useState(false)
  const speak = useTTS()
  const q = questions[idx]

  // 自动播放听力题
  useEffect(() => {
    if ((q?.type === 'listen_word' || q?.type === 'listen_qa') && !showAnswer) {
      const t = setTimeout(() => speak(q.tts), 400)
      return () => clearTimeout(t)
    }
  }, [idx])

  function handleAnswer(correct) {
    setAnsweredList(prev => {
      const next = [...prev]
      next[idx] = correct
      return next
    })
    setShowAnswer(true)
  }

  function next() {
    setShowAnswer(false)
    setIdx(i => i + 1)
  }

  const done = idx >= questions.length
  const score = answeredList.filter(Boolean).length

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-12 px-4">
        <div className="text-5xl">{score === questions.length ? '🎉' : score >= questions.length / 2 ? '👍' : '💪'}</div>
        <div className="text-white text-2xl font-bold">{score} / {questions.length}</div>
        <div className="text-gray-400 text-sm">{title}</div>
        <div className="flex gap-3 flex-wrap justify-center">
          <button onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold transition-colors">
            返回目录
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg mx-auto px-2 py-3 flex flex-col gap-3">

      {/* 进度条 */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${(idx / questions.length) * 100}%` }} />
        </div>
        <span className="text-xs text-gray-500 tabular-nums shrink-0">{idx + 1}/{questions.length}</span>
      </div>

      {/* 题型标签 */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-amber-500 bg-amber-900/30 border border-amber-700/40 px-2.5 py-1 rounded-full">
          {Q_LABELS[q.type] || q.type}
        </span>
        <span className="text-xs text-gray-600">{title}</span>
      </div>

      {/* 题目内容 */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        {(q.type === 'listen_word' || q.type === 'listen_qa') && (
          <ListenQuestion q={q} speak={speak} onAnswer={handleAnswer} answered={showAnswer} />
        )}
        {(q.type === 'zh_to_en' || q.type === 'en_to_zh') && (
          <ChoiceQuestion q={q} onAnswer={handleAnswer} answered={showAnswer} />
        )}
        {q.type === 'word_order' && (
          <WordOrderQuestion q={q} onAnswer={handleAnswer} answered={showAnswer} />
        )}
      </div>

      {/* 答对/答错反馈 + 下一题 */}
      {showAnswer && q.type !== 'word_order' && (
        <div className={`text-sm text-center px-3 py-2 rounded-xl ${answeredList[idx] ? 'text-green-400 bg-green-900/30' : 'text-red-400 bg-red-900/30'}`}>
          {answeredList[idx] ? '✓ 正确！' : `✗ 正确答案：${q.answer}`}
        </div>
      )}

      {showAnswer && (
        <button onClick={next}
          className="mx-auto px-10 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors">
          {idx + 1 < questions.length ? '下一题 →' : '查看成绩'}
        </button>
      )}
    </div>
  )
}
