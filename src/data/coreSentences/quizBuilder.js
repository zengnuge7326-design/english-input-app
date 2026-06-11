/**
 * 从核心句群句子生成同步练习题库
 * 每关 10 句 → 10 题，题型按 listen / translation / blank / order 循环
 */
const TYPE_CYCLE = ['listen_word', 'choose_translation', 'fill_blank', 'sentence_order']

const STOP_WORDS = new Set([
  'i', 'a', 'an', 'the', 'to', 'my', 'your', 'his', 'her', 'its', 'our', 'their',
  'is', 'are', 'am', 'was', 'were', 'be', 'it', 'we', 'he', 'she', 'they', 'you',
  'do', 'does', 'did', 'can', 'will', 'not', 'no', 'so', 'as', 'at', 'in', 'on',
])

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function sampleUnique(arr, n) {
  const copy = [...new Set(arr)]
  const out = []
  while (out.length < n && copy.length > 0) {
    const i = Math.floor(Math.random() * copy.length)
    out.push(copy.splice(i, 1)[0])
  }
  return out
}

function tokenize(en) {
  return en.replace(/[.,!?'"]/g, '').split(/\s+/).filter(Boolean)
}

function keyWords(en) {
  return tokenize(en).filter(w => w.length > 2 && !STOP_WORDS.has(w.toLowerCase()))
}

function allWords(en) {
  return tokenize(en).filter(w => w.length > 1)
}

function pickKeyword(sentence, index) {
  const words = keyWords(sentence.en)
  if (words.length) return words[index % words.length]
  const fallback = allWords(sentence.en)
  return fallback[index % fallback.length] || 'word'
}

function pickBlankWord(sentence, index) {
  const words = allWords(sentence.en)
  const content = words.filter(w => !STOP_WORDS.has(w.toLowerCase()))
  const pool = content.length ? content : words
  return pool[index % pool.length]
}

function wordDistractors(correct, pool, count = 3) {
  const c = correct.toLowerCase()
  const scored = [...new Set(pool.filter(w => w.toLowerCase() !== c))]
    .map(w => ({
      w,
      score: (w[0]?.toLowerCase() === correct[0]?.toLowerCase() ? 2 : 0)
        + (Math.abs(w.length - correct.length) <= 2 ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .map(x => x.w)
  const picked = sampleUnique(scored, count)
  if (picked.length < count) {
    const extra = sampleUnique(
      pool.filter(w => w.toLowerCase() !== c && !picked.includes(w)),
      count - picked.length,
    )
    picked.push(...extra)
  }
  return picked.slice(0, count)
}

function makeListenWord(sentence, lessonSentences, tierSentences, index) {
  const correct = pickKeyword(sentence, index)
  const pool = [
    ...lessonSentences.flatMap(s => keyWords(s.en)),
    ...tierSentences.flatMap(s => keyWords(s.en)),
  ]
  const wrong = wordDistractors(correct, pool, 3)
  if (wrong.length < 3) return null
  return {
    type: 'listen_word',
    audio_text: sentence.en,
    options: shuffle([correct, ...wrong]),
    correct,
  }
}

function makeChooseTranslation(sentence, lessonSentences) {
  const correct = sentence.zh
  const wrong = sampleUnique(
    lessonSentences.filter(s => s.id !== sentence.id).map(s => s.zh),
    3,
  )
  if (wrong.length < 3) return null
  return {
    type: 'choose_translation',
    en: sentence.en,
    options: shuffle([correct, ...wrong]),
    correct,
  }
}

function makeFillBlank(sentence, lessonSentences, tierSentences, index) {
  const answer = pickBlankWord(sentence, index)
  const escaped = answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const sentence_with_blank = sentence.en.replace(new RegExp(`\\b${escaped}\\b`, 'i'), '______')
  const pool = [
    ...lessonSentences.flatMap(s => allWords(s.en)),
    ...tierSentences.flatMap(s => allWords(s.en)),
  ]
  const wrong = wordDistractors(answer, pool, 3)
  if (wrong.length < 3) return null
  return {
    type: 'fill_blank',
    sentence_with_blank,
    answer,
    hint: sentence.zh,
    options: shuffle([answer, ...wrong]),
  }
}

function makeSentenceOrder(sentence) {
  const words = tokenize(sentence.en)
  if (words.length < 3) return null
  let scrambled = shuffle(words)
  if (scrambled.join(' ') === words.join(' ')) {
    [scrambled[0], scrambled[1]] = [scrambled[1], scrambled[0]]
  }
  return {
    type: 'sentence_order',
    scrambled_words: scrambled,
    correct_sentence: sentence.en,
    hint: sentence.zh,
  }
}

function buildQuestion(sentence, lessonSentences, tierSentences, index) {
  const type = TYPE_CYCLE[index % TYPE_CYCLE.length]
  const builders = {
    listen_word: () => makeListenWord(sentence, lessonSentences, tierSentences, index),
    choose_translation: () => makeChooseTranslation(sentence, lessonSentences),
    fill_blank: () => makeFillBlank(sentence, lessonSentences, tierSentences, index),
    sentence_order: () => makeSentenceOrder(sentence),
  }
  let q = builders[type]()
  if (!q) {
    for (const fallback of TYPE_CYCLE) {
      if (fallback === type) continue
      q = builders[fallback]()
      if (q) break
    }
  }
  return q
}

/**
 * @param {Array<{label:string, ids:number[]}>} lessons
 * @param {Array<{id:number, en:string, zh:string}>} tierData
 */
export function buildCoreQuizBank(lessons, tierData) {
  const map = Object.fromEntries(tierData.map(s => [s.id, s]))
  const bank = {}

  for (const lesson of lessons) {
    const lessonSentences = lesson.ids.map(id => map[id]).filter(Boolean)
    if (lessonSentences.length < 4) continue
    const questions = lessonSentences.slice(0, 10).map((s, i) =>
      buildQuestion(s, lessonSentences, tierData, i),
    ).filter(Boolean)
    if (questions.length >= 8) bank[lesson.label] = questions.slice(0, 10)
  }

  return bank
}
