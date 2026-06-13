/**
 * 初中 / 高中课文 —— 由句子 JSON 程序化生成的课文书目。
 * 初中：人教版七上~九年级（grade7_up 等，扁平句子数组）
 * 高中：北师大版必修/选必（bsda_*，带 unit 字段）
 * 每「册」拆为若干单元，每单元再切成 ~14 句的章节，套用现有 UnitReader。
 */
import type { TextbookBook, TextbookSentence, TextbookUnit, TextbookSection } from './sections'

import g7up from '../../../data/grade7_up.json'
import g7down from '../../../data/grade7_down.json'
import g8up from '../../../data/grade8_up.json'
import g8down from '../../../data/grade8_down.json'
import g9all from '../../../data/grade9_all.json'

import bsdaB1 from '../../../data/bsda_b1.json'
import bsdaB2 from '../../../data/bsda_b2.json'
import bsdaB3 from '../../../data/bsda_b3.json'
import bsdaS1 from '../../../data/bsda_s1.json'
import bsdaS2 from '../../../data/bsda_s2.json'
import bsdaS3 from '../../../data/bsda_s3.json'
import bsdaS4 from '../../../data/bsda_s4.json'

type RawSentence = { id: number | string; en: string; zh: string; unit?: string }

const SECTION_SIZE = 14   // 每章节句数
const UNIT_SIZE = 70      // 无 unit 字段时，每单元句数

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function toSentences(raw: RawSentence[], prefix: string): TextbookSentence[] {
  return raw
    .filter(s => s.en && s.zh)
    .map((s, i) => ({ id: `${prefix}-${i}`, en: s.en, zh: s.zh }))
}

function makeUnit(bookId: string, unitIdx: number, title: string, sentences: TextbookSentence[]): TextbookUnit {
  const sections: TextbookSection[] = chunk(sentences, SECTION_SIZE).map((part, si) => ({
    id: `${bookId}-u${unitIdx}-s${si}`,
    kind: 'read',
    title: `第 ${si + 1} 节`,
    emoji: '📖',
    sentences: part,
  }))
  return {
    id: `${bookId}-u${unitIdx}`,
    title,
    subtitle: `${sentences.length} 句`,
    emoji: '📖',
    sections,
  }
}

/** 无 unit 字段：按 UNIT_SIZE 切单元 */
function buildFlatBook(id: string, title: string, emoji: string, raw: RawSentence[]): TextbookBook {
  const sents = toSentences(raw, id)
  const units = chunk(sents, UNIT_SIZE).map((part, ui) =>
    makeUnit(id, ui + 1, `第 ${ui + 1} 部分`, part),
  )
  return { id, title, subtitle: '人教版（仁爱）初中', emoji, units }
}

/** 有 unit 字段：按 unit 分单元 */
function buildUnitBook(id: string, title: string, emoji: string, raw: RawSentence[]): TextbookBook {
  const groups = new Map<string, RawSentence[]>()
  for (const s of raw) {
    const key = s.unit || 'Unit'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(s)
  }
  const units: TextbookUnit[] = []
  let ui = 0
  for (const [unitName, list] of groups) {
    ui += 1
    units.push(makeUnit(id, ui, unitName, toSentences(list, `${id}-u${ui}`)))
  }
  return { id, title, subtitle: '北师大版高中', emoji, units }
}

export const JUNIOR_TEXTBOOK_BOOKS: TextbookBook[] = [
  buildFlatBook('jr-g7up', '七年级上册', '📘', g7up as RawSentence[]),
  buildFlatBook('jr-g7down', '七年级下册', '📗', g7down as RawSentence[]),
  buildFlatBook('jr-g8up', '八年级上册', '📙', g8up as RawSentence[]),
  buildFlatBook('jr-g8down', '八年级下册', '📒', g8down as RawSentence[]),
  buildFlatBook('jr-g9', '九年级全册', '📕', g9all as RawSentence[]),
]

export const SENIOR_TEXTBOOK_BOOKS: TextbookBook[] = [
  buildUnitBook('sr-b1', '必修第一册', '📘', bsdaB1 as RawSentence[]),
  buildUnitBook('sr-b2', '必修第二册', '📗', bsdaB2 as RawSentence[]),
  buildUnitBook('sr-b3', '必修第三册', '📙', bsdaB3 as RawSentence[]),
  buildUnitBook('sr-s1', '选择性必修一', '📕', bsdaS1 as RawSentence[]),
  buildUnitBook('sr-s2', '选择性必修二', '📒', bsdaS2 as RawSentence[]),
  buildUnitBook('sr-s3', '选择性必修三', '📔', bsdaS3 as RawSentence[]),
  buildUnitBook('sr-s4', '选择性必修四', '📓', bsdaS4 as RawSentence[]),
]
