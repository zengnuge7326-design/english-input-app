import type { QuizIconName } from '../quizIconMap'

/** PEP 三年级上册 Unit 1《Hello!》核心词汇 */
export const G3U1_VOCAB: {
  en: string
  zh: string
  iconKey: QuizIconName
}[] = [
  { en: 'hello', zh: '你好', iconKey: 'hand' },
  { en: 'hi', zh: '嗨', iconKey: 'hand' },
  { en: 'pen', zh: '钢笔', iconKey: 'pen' },
  { en: 'pencil', zh: '铅笔', iconKey: 'pencil' },
  { en: 'ruler', zh: '尺子', iconKey: 'ruler' },
  { en: 'eraser', zh: '橡皮', iconKey: 'eraser' },
  { en: 'bag', zh: '书包', iconKey: 'backpack' },
  { en: 'book', zh: '书', iconKey: 'book-open' },
  { en: 'pencil box', zh: '铅笔盒', iconKey: 'package' },
  { en: 'crayon', zh: '蜡笔', iconKey: 'paintbrush' },
  { en: 'name', zh: '名字', iconKey: 'id-card' },
  { en: 'goodbye', zh: '再见', iconKey: 'hand' },
  { en: 'open', zh: '打开', iconKey: 'folder-open' },
  { en: 'close', zh: '合上', iconKey: 'book-x' },
  { en: 'show', zh: '展示', iconKey: 'eye' },
  { en: 'carry', zh: '背上', iconKey: 'backpack' },
  { en: 'I', zh: '我', iconKey: 'user' },
  { en: 'am', zh: '是', iconKey: 'message-circle' },
  { en: 'you', zh: '你', iconKey: 'user' },
  { en: 'your', zh: '你的', iconKey: 'user' },
] as const
