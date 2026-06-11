import pepWordsRaw from '../../data/pep_words.json'
import renaiJuniorRaw from '../../data/renai_junior_words.json'
import bsdaWordsRaw from '../../data/bsda_words.json'
import { GRADE_BOOKS } from './gradeBooks'
import type { VocabWord } from './unit1Vocab'

type PepWord = { word: string; ipa?: string; zh: string }
type PepUnit = { unit: number; title: string; words: PepWord[] }
type PepBook = { grade: number; sem: string; bookName: string; units: PepUnit[] }
type BsdaBook = { grade: string; sem: string; bookName: string; units: PepUnit[] }

const pepBooks = pepWordsRaw as PepBook[]
const renaiJuniorBooks = renaiJuniorRaw as PepBook[]
const bsdaBooks = bsdaWordsRaw as BsdaBook[]

type Source = 'pep' | 'renai' | 'bsda'

const BOOK_KEY: Record<string, { grade: number | string; sem: string; source: Source }> = {
  'g3-1': { grade: 3, sem: 'up', source: 'pep' },
  'g3-2': { grade: 3, sem: 'down', source: 'pep' },
  'g4-1': { grade: 4, sem: 'up', source: 'pep' },
  'g4-2': { grade: 4, sem: 'down', source: 'pep' },
  'g5-1': { grade: 5, sem: 'up', source: 'pep' },
  'g5-2': { grade: 5, sem: 'down', source: 'pep' },
  'g6-1': { grade: 6, sem: 'up', source: 'pep' },
  'g6-2': { grade: 6, sem: 'down', source: 'pep' },
  'g7-1': { grade: 7, sem: 'up', source: 'renai' },
  'g7-2': { grade: 7, sem: 'down', source: 'renai' },
  'g8-1': { grade: 8, sem: 'up', source: 'renai' },
  'g8-2': { grade: 8, sem: 'down', source: 'renai' },
  'g9-1': { grade: 9, sem: 'up', source: 'renai' },
  'g9-2': { grade: 9, sem: 'down', source: 'renai' },
  'bsda-b1': { grade: '高中', sem: 'b1', source: 'bsda' },
  'bsda-b2': { grade: '高中', sem: 'b2', source: 'bsda' },
  'bsda-b3': { grade: '高中', sem: 'b3', source: 'bsda' },
  'bsda-s1': { grade: '高中', sem: 's1', source: 'bsda' },
  'bsda-s2': { grade: '高中', sem: 's2', source: 'bsda' },
  'bsda-s3': { grade: '高中', sem: 's3', source: 'bsda' },
  'bsda-s4': { grade: '高中', sem: 's4', source: 'bsda' },
}

/** 2024 PEP 三上单元副标题（与课文模块对齐） */
const G3UP_UNIT_META: { subtitle: string; emoji: string }[] = [
  { subtitle: '交朋友、问候、身体部位', emoji: '👋' },
  { subtitle: '家人、家庭大小、亲属称呼', emoji: '👨‍👩‍👧' },
  { subtitle: '宠物、野生动物、动物特点', emoji: '🐼' },
  { subtitle: '水果、植物、人与自然', emoji: '🌱' },
  { subtitle: '颜色、混色、色彩的意义', emoji: '🎨' },
  { subtitle: '数字、年龄、购物', emoji: '🔢' },
]

export interface VocabUnit {
  unit: number
  title: string
  subtitle: string
  emoji: string
  words: VocabWord[]
}

export interface VocabBookData {
  id: string
  title: string
  units: VocabUnit[]
}

function simplifyZh(zh: string): string {
  return zh.split('；')[0].split(';')[0].trim()
}

export function countVocabWords(data: VocabBookData): number {
  return data.units.reduce((n, u) => n + u.words.length, 0)
}

const JUNIOR_UNIT_EMOJIS = ['🌱', '🌿', '🍀', '🌳', '🌸', '🌺', '🌻', '🌼', '🌷']
const SENIOR_UNIT_EMOJIS = ['🎓', '📚', '🏛️', '⚗️', '🌍', '🎭', '🔬']

export function getVocabBookData(bookId: string): VocabBookData | null {
  const key = BOOK_KEY[bookId]
  if (!key) return null
  let source: (PepBook | BsdaBook)[]
  if (key.source === 'renai') source = renaiJuniorBooks
  else if (key.source === 'bsda') source = bsdaBooks
  else source = pepBooks
  const pep = source.find(b => b.grade === key.grade && b.sem === key.sem)
  if (!pep) return null

  return {
    id: bookId,
    title: pep.bookName,
    units: pep.units.map((u, i) => {
      const meta = bookId === 'g3-1' ? G3UP_UNIT_META[i] : undefined
      const subtitle = meta?.subtitle ?? (u.title.trim() || `${u.words.length} 个词`)
      let emoji: string
      if (meta?.emoji) emoji = meta.emoji
      else if (key.source === 'renai') emoji = JUNIOR_UNIT_EMOJIS[i % JUNIOR_UNIT_EMOJIS.length]
      else if (key.source === 'bsda') emoji = SENIOR_UNIT_EMOJIS[i % SENIOR_UNIT_EMOJIS.length]
      else emoji = '📖'
      return {
        unit: u.unit,
        title: `Unit ${u.unit}`,
        subtitle,
        emoji,
        words: u.words.map((w, wi) => ({
          id: `${bookId}-u${u.unit}-w${wi}`,
          en: w.word,
          zh: simplifyZh(w.zh),
        })),
      }
    }),
  }
}

export function listVocabBooks(): { book: typeof GRADE_BOOKS[number]; data: VocabBookData | null }[] {
  return GRADE_BOOKS.map(book => ({
    book,
    data: getVocabBookData(book.id),
  }))
}

export function defaultVocabBook(): VocabBookData {
  return getVocabBookData('g3-1')!
}
