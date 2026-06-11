import { bookIdFromSlug } from './pepPractice/plan'
import { getVocabBookData } from './vocabBooks'

export interface BookGrammarInfo {
  title: string
  summary: string
  points: string[]
  icon: string
}

const GRAMMAR_BY_UNIT: Record<string, BookGrammarInfo> = {
  g3u1: {
    title: 'Hello! 问候与文具',
    summary: 'PEP 三上 Unit 1：打招呼、自我介绍、文具与课堂用语',
    points: [
      'Hello / Hi — 打招呼',
      "I'm ... / My name's ... — 自我介绍",
      'I have a ... — 表示拥有文具',
      'Show me your ... — 展示物品',
      'Open / Close your ... — 课堂指令',
      "What's your name? — 询问名字",
      'Goodbye / See you — 告别',
    ],
    icon: '📒',
  },
  u1: {
    title: 'Hello! 问候与文具',
    summary: 'PEP 三上 Unit 1：打招呼、自我介绍、文具与课堂用语',
    points: [
      'Hello / Hi — 打招呼',
      "I'm ... / My name's ... — 自我介绍",
      'I have a ... — 表示拥有文具',
    ],
    icon: '📒',
  },
  u2: {
    title: '校园物品',
    summary: '教室物品与课堂指令',
    points: [
      'This is a ... — 介绍物品',
      'Open / Close your book',
      'Stand up / Sit down',
      'May I ...? — 礼貌请求',
    ],
    icon: '📒',
  },
}

const DEFAULT_GRAMMAR: BookGrammarInfo = {
  title: '单元词汇',
  summary: '本单元核心词汇与表达',
  points: ['跟读单词 · 拼写 · 听辨'],
  icon: '📒',
}

function grammarFromPepUnit(unitId: string): BookGrammarInfo | null {
  const m = unitId.match(/^(g\d\d)-u(\d+)$/)
  if (!m) return null
  const bookId = bookIdFromSlug(m[1])
  if (!bookId) return null
  const unitNum = Number(m[2])
  const book = getVocabBookData(bookId)
  const unit = book?.units.find(u => u.unit === unitNum)
  if (!unit) return null
  return {
    title: unit.subtitle,
    summary: `${book.title} · Unit ${unitNum}`,
    points: [`${unit.words.length} 个核心词汇`, '综合练习 + 单元检测'],
    icon: unit.emoji,
  }
}

export function getGrammarForUnit(unitId?: string): BookGrammarInfo {
  if (unitId && GRAMMAR_BY_UNIT[unitId]) return GRAMMAR_BY_UNIT[unitId]
  if (unitId) {
    const fromPep = grammarFromPepUnit(unitId)
    if (fromPep) return fromPep
  }
  return DEFAULT_GRAMMAR
}
