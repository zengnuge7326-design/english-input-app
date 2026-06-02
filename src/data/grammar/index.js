import { GRADE3_UP_GRAMMAR } from './grade3_up'
import { GRADE3_DOWN_GRAMMAR } from './grade3_down'
import { GRADE4_UP_GRAMMAR } from './grade4_up'
import { GRADE4_DOWN_GRAMMAR } from './grade4_down'
import { GRADE5_UP_GRAMMAR } from './grade5_up'
import { GRADE5_DOWN_GRAMMAR } from './grade5_down'
import { GRADE6_UP_GRAMMAR } from './grade6_up'
import { GRADE6_DOWN_GRAMMAR } from './grade6_down'
// 仁爱版初中 6 册
import { RENAI_7UP_GRAMMAR } from './renai_7up'
import { RENAI_7DOWN_GRAMMAR } from './renai_7down'
import { RENAI_8UP_GRAMMAR } from './renai_8up'
import { RENAI_8DOWN_GRAMMAR } from './renai_8down'
import { RENAI_9UP_GRAMMAR } from './renai_9up'
import { RENAI_9DOWN_GRAMMAR } from './renai_9down'
// 北师大版高中 7 册
import { BSDA_B1_GRAMMAR } from './bsda_b1'
import { BSDA_B2_GRAMMAR } from './bsda_b2'
import { BSDA_B3_GRAMMAR } from './bsda_b3'
import { BSDA_S1_GRAMMAR } from './bsda_s1'
import { BSDA_S2_GRAMMAR } from './bsda_s2'
import { BSDA_S3_GRAMMAR } from './bsda_s3'
import { BSDA_S4_GRAMMAR } from './bsda_s4'

// 语法题库总注册表
export const GRAMMAR_LIBRARY = {
  grade3_up: GRADE3_UP_GRAMMAR,
  grade3_down: GRADE3_DOWN_GRAMMAR,
  grade4_up: GRADE4_UP_GRAMMAR,
  grade4_down: GRADE4_DOWN_GRAMMAR,
  grade5_up: GRADE5_UP_GRAMMAR,
  grade5_down: GRADE5_DOWN_GRAMMAR,
  grade6_up: GRADE6_UP_GRAMMAR,
  grade6_down: GRADE6_DOWN_GRAMMAR,
  renai_7up: RENAI_7UP_GRAMMAR,
  renai_7down: RENAI_7DOWN_GRAMMAR,
  renai_8up: RENAI_8UP_GRAMMAR,
  renai_8down: RENAI_8DOWN_GRAMMAR,
  renai_9up: RENAI_9UP_GRAMMAR,
  renai_9down: RENAI_9DOWN_GRAMMAR,
  bsda_b1: BSDA_B1_GRAMMAR,
  bsda_b2: BSDA_B2_GRAMMAR,
  bsda_b3: BSDA_B3_GRAMMAR,
  bsda_s1: BSDA_S1_GRAMMAR,
  bsda_s2: BSDA_S2_GRAMMAR,
  bsda_s3: BSDA_S3_GRAMMAR,
  bsda_s4: BSDA_S4_GRAMMAR,
}

// 找不到精确 label 时（如 'Unit 1A'）尝试父级 'Unit 1'
// 也支持 'Unit 1B' → 'Unit 1'
export function getGrammar(bookId, unitLabel) {
  const book = GRAMMAR_LIBRARY[bookId]
  if (!book) return null
  // 精确匹配
  if (book[unitLabel]) return book[unitLabel]
  // 尝试去掉尾部 A/B/C 字母（Unit 1A → Unit 1）
  const stripped = unitLabel.replace(/\s*[A-Z]$/, '').trim()
  if (book[stripped]) return book[stripped]
  return null
}

export function hasGrammar(bookId, unitLabel) {
  return !!getGrammar(bookId, unitLabel)
}
