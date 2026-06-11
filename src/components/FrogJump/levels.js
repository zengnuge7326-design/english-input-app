// 自动生成所有小学 + 初中 + 高中单词关卡
import pepWords from '../../data/pep_words.json'
import juniorWords from '../../data/renai_junior_words.json'
import seniorWords from '../../data/bsda_words.json'

const ELEMENTARY_BOOKS = [
  '三年级上册', '三年级下册',
  '四年级上册', '四年级下册',
  '五年级上册', '五年级下册',
  '六年级上册', '六年级下册',
]
const JUNIOR_BOOKS = [
  '七年级上册（仁爱科普版）', '七年级下册（仁爱科普版）',
  '八年级上册（仁爱科普版）', '八年级下册（仁爱科普版）',
  '九年级上册（仁爱科普版）', '九年级下册（仁爱科普版）',
]
const SENIOR_BOOKS = [
  '必修第一册（北师大版）', '必修第二册（北师大版）', '必修第三册（北师大版）',
  '选择性必修第一册（北师大版）', '选择性必修第二册（北师大版）',
  '选择性必修第三册（北师大版）', '选择性必修第四册（北师大版）',
]

// 每关大约 9 个词；若单元 > 14，拆成两关；< 5 词的合并到下一关
const TARGET_PER_LEVEL = 9
const MIN_WORDS = 5

function shortBookName(name) {
  // 三年级上册 → 三上, 七年级上册（仁爱科普版） → 七上
  // 必修第一册（北师大版） → 必修一, 选择性必修第三册 → 选三
  return name
    .replace('年级', '')
    .replace('上册', '上')
    .replace('下册', '下')
    .replace(/（.*?）/, '')
    .replace('选择性必修第一册', '选一')
    .replace('选择性必修第二册', '选二')
    .replace('选择性必修第三册', '选三')
    .replace('选择性必修第四册', '选四')
    .replace('必修第一册', '必修一')
    .replace('必修第二册', '必修二')
    .replace('必修第三册', '必修三')
    .trim()
}

function splitUnit(words) {
  if (words.length <= 14) return [words]
  const halves = []
  const half = Math.ceil(words.length / 2)
  halves.push(words.slice(0, half))
  halves.push(words.slice(half))
  return halves
}

function addBookLevels(generated, dataset, bookList, stage) {
  bookList.forEach(bookName => {
    const book = dataset.find(b => b.bookName === bookName)
    if (!book) return
    const shortName = shortBookName(bookName)
    book.units?.forEach((unit, uIdx) => {
      const words = (unit.words || []).filter(w => w?.word && /^[a-zA-Z' -]+$/.test(w.word))
      if (words.length < MIN_WORDS) return
      // 初中/高中单词量大，按 10 词一关切片；小尾巴并入上一关
      const sliceSize = stage === 'elementary' ? 14 : 10
      const chunks = []
      if (words.length <= sliceSize) {
        chunks.push(words)
      } else {
        // 算份数：尽量均匀，不留 < MIN_WORDS 的尾巴
        const n = Math.ceil(words.length / sliceSize)
        const baseSize = Math.ceil(words.length / n)
        for (let i = 0; i < n; i++) {
          chunks.push(words.slice(i * baseSize, (i + 1) * baseSize))
        }
        // 兜底：最后一关 < MIN_WORDS 就并入上一关
        while (chunks.length > 1 && chunks[chunks.length - 1].length < MIN_WORDS) {
          const tail = chunks.pop()
          chunks[chunks.length - 1] = chunks[chunks.length - 1].concat(tail)
        }
      }
      chunks.forEach((chunk, cIdx) => {
        const partLabel = chunks.length > 1 ? `-${cIdx + 1}` : ''
        generated.push({
          id: `${shortName}-u${uIdx + 1}${partLabel ? '-' + (cIdx + 1) : ''}`,
          bookShort: shortName,
          stage,
          unitIdx: uIdx + 1,
          name: `${shortName} U${uIdx + 1}${partLabel}`,
          desc: unit.label || unit.name || `Unit ${uIdx + 1}`,
          words: chunk,
        })
      })
    })
  })
}

const generated = []
addBookLevels(generated, pepWords, ELEMENTARY_BOOKS, 'elementary')
addBookLevels(generated, juniorWords, JUNIOR_BOOKS, 'junior')
addBookLevels(generated, seniorWords, SENIOR_BOOKS, 'senior')

export const LEVELS = generated

// 按教材分组（用于选关 UI 分段展示）
export const LEVELS_BY_BOOK = [...ELEMENTARY_BOOKS, ...JUNIOR_BOOKS, ...SENIOR_BOOKS]
  .map(b => shortBookName(b))
  .map(shortName => ({
    bookShort: shortName,
    stage: generated.find(l => l.bookShort === shortName)?.stage || 'elementary',
    levels: generated.filter(l => l.bookShort === shortName),
  }))
  .filter(g => g.levels.length > 0)

// 按阶段分组
export const LEVELS_BY_STAGE = [
  { id: 'elementary', name: '小学', books: LEVELS_BY_BOOK.filter(g => g.stage === 'elementary') },
  { id: 'junior', name: '初中', books: LEVELS_BY_BOOK.filter(g => g.stage === 'junior') },
  { id: 'senior', name: '高中', books: LEVELS_BY_BOOK.filter(g => g.stage === 'senior') },
]

// 子关：A = 看英拼写, B = 看中默写
export const SUBMODES = [
  { id: 'A', name: '拼写', desc: '看英文照着打', icon: '👀' },
  { id: 'B', name: '默写', desc: '看中文凭记忆打', icon: '🧠' },
]

export const MAX_HEARTS = 3
export const PERFECT_PER_LEVEL_BONUS = 1
export const STREAK_5_REWARD = 1
export const PASS_STAR_THRESHOLD = 0.7
