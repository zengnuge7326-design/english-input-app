import type { QuestionData, StoryListenStep } from '../../types'
import { assertAichatDialog } from '../aichatConstraints'
import type { AICHAT_SCENES as AichatScenesType } from './aichatDialogs'

/** 各题型补至 20 道的手写/扩展题（Unit 1 词汇与句型） */

export const EXTRA_TRANSLATE = [
  { sentence: 'Hi! ___ (你好)', answer: 'Hello', chinese: '你好！' },
  { sentence: '___ (我的) name is Amy.', answer: 'My', chinese: '我叫埃米。' },
  { sentence: 'Open your ___ (铅笔盒).', answer: 'pencil box', chinese: '打开你的铅笔盒。' },
  { sentence: 'I ___ (有) a book.', answer: 'have', chinese: '我有一本书。' },
  { sentence: '___ (回头见) you!', answer: 'See', chinese: '回头见！' },
  { sentence: '___ (嗨)! I am John.', answer: 'Hi', chinese: '嗨！我是约翰。' },
  { sentence: 'This is my ___ (名字).', answer: 'name', chinese: '这是我的名字。' },
  { sentence: '___ (背上) your bag.', answer: 'Carry', chinese: '背上你的书包。' },
  { sentence: 'I have a ___ (蜡笔).', answer: 'crayon', chinese: '我有一支蜡笔。' },
  { sentence: '___ (合上) your pencil box.', answer: 'Close', chinese: '合上你的铅笔盒。' },
]

export const EXTRA_CHOICE = [
  { question: '___! I am Sarah.', chinese: '你好！我是萨拉。', options: ['Hello', 'Goodbye', 'Bye', 'See'], correct: 0 },
  { question: 'I have a ___.', chinese: '我有一本书。', options: ['book', 'open', 'name', 'you'], correct: 0 },
  { question: '___ your book.', chinese: '合上你的书。', options: ['Open', 'Close', 'Show', 'Carry'], correct: 1 },
  { question: 'My name ___ Mike.', chinese: '我叫迈克。', options: ['am', "is", "are", "name's"], correct: 3 },
  { question: '___ me your bag.', chinese: '给我看看你的书包。', options: ['Show', 'Open', 'Close', 'Carry'], correct: 0 },
  { question: 'I ___ a crayon.', chinese: '我有一支蜡笔。', options: ['have', 'has', 'am', 'is'], correct: 0 },
  { question: '___ your name?', chinese: '你叫什么名字？', options: ["What's", 'Who', 'Where', 'How'], correct: 0 },
  { question: '___! See you.', chinese: '再见！回头见。', options: ['Hello', 'Hi', 'Goodbye', 'Open'], correct: 2 },
]

export const EXTRA_SPELLING = [
  { sentence: '___ (书包)', answer: 'bag', chinese: '书包' },
  { sentence: '___ (蜡笔)', answer: 'crayon', chinese: '蜡笔' },
  { sentence: '___ (铅笔盒)', answer: 'pencil box', chinese: '铅笔盒' },
  { sentence: '___ (你好)', answer: 'hello', chinese: '你好' },
  { sentence: '___ (名字)', answer: 'name', chinese: '名字' },
  { sentence: '___ (打开)', answer: 'open', chinese: '打开' },
  { sentence: '___ (合上)', answer: 'close', chinese: '合上' },
  { sentence: '___ (再见)', answer: 'goodbye', chinese: '再见' },
]

export const EXTRA_DICTATION = [
  { sentence: "Hi, I'm Zoom.", zh: '你好，我是祖姆。' },
  { sentence: "My name's Sarah.", zh: '我叫萨拉。' },
  { sentence: 'Open your book.', zh: '打开你的书。' },
  { sentence: 'Close your bag.', zh: '合上你的书包。' },
  { sentence: 'See you!', zh: '回头见！' },
  { sentence: 'I have a crayon.', zh: '我有一支蜡笔。' },
  { sentence: 'Show me your pen.', zh: '给我看看你的钢笔。' },
  { sentence: 'Carry your bag.', zh: '背上你的书包。' },
]

export const EXTRA_ORDERING = [
  { sentence: 'I have a book.', zh: '我有一本书。', words: ['I', 'have', 'a', 'book.'], answer: ['I', 'have', 'a', 'book.'] },
  { sentence: 'Open your book.', zh: '打开你的书。', words: ['Open', 'your', 'book.'], answer: ['Open', 'your', 'book.'] },
  { sentence: 'My name is Amy.', zh: '我叫埃米。', words: ['My', 'name', 'is', 'Amy.'], answer: ['My', 'name', 'is', 'Amy.'] },
  { sentence: 'Show me your bag.', zh: '给我看看你的书包。', words: ['Show', 'me', 'your', 'bag.'], answer: ['Show', 'me', 'your', 'bag.'] },
  { sentence: 'I have a crayon.', zh: '我有一支蜡笔。', words: ['I', 'have', 'a', 'crayon.'], answer: ['I', 'have', 'a', 'crayon.'] },
]

export const EXTRA_SPEAKING = [
  { sentence: 'I have a book.', zh: '我有一本书。' },
  { sentence: 'Open your book.', zh: '打开你的书。' },
  { sentence: 'My name is Amy.', zh: '我叫埃米。' },
  { sentence: 'Show me your bag.', zh: '给我看看你的书包。' },
  { sentence: 'I have a crayon.', zh: '我有一支蜡笔。' },
  { sentence: 'Close your pencil box.', zh: '合上你的铅笔盒。' },
  { sentence: "Hi, I'm Zoom.", zh: '你好，我是祖姆。' },
  { sentence: 'Carry your bag.', zh: '背上你的书包。' },
]

export const STORY_SCENES: {
  id: string
  title: string
  speakers: { emoji: string; name: string }[]
  sentence: string
  pickWords?: string[]
  pickCount?: number
  tfZh?: string
  tfAnswer?: boolean
  choicePartial?: string
  choiceOptions?: string[]
  choiceAnswer?: number
}[] = [
  { id: 's5', title: '课间问候', speakers: [{ emoji: '👦', name: 'John' }, { emoji: '👧', name: 'Amy' }], sentence: "Hi, I'm John.", pickWords: ['Hi', 'John'], pickCount: 2, tfZh: '他们在打招呼。', tfAnswer: true },
  { id: 's6', title: '自我介绍', speakers: [{ emoji: '👧', name: 'Sarah' }, { emoji: '👦', name: 'Mike' }], sentence: "My name's Sarah.", choicePartial: '我叫', choiceOptions: ['萨拉。', '迈克。'], choiceAnswer: 0 },
  { id: 's7', title: '打开文具盒', speakers: [{ emoji: '👩‍🏫', name: '老师' }, { emoji: '🧒', name: '学生' }], sentence: 'Open your pencil box.', pickWords: ['Open', 'pencil', 'box'], pickCount: 2, tfZh: '老师让学生打开铅笔盒。', tfAnswer: true },
  { id: 's8', title: '合上书本', speakers: [{ emoji: '👩‍🏫', name: '老师' }, { emoji: '🧒', name: '学生' }], sentence: 'Close your book.', tfZh: '老师在说合上书本。', tfAnswer: true },
  { id: 's9', title: '背上书包', speakers: [{ emoji: '👩‍🏫', name: '老师' }, { emoji: '🧒', name: '学生' }], sentence: 'Carry your bag.', choicePartial: '背上', choiceOptions: ['书包。', '书本。'], choiceAnswer: 0 },
  { id: 's10', title: '我也有蜡笔', speakers: [{ emoji: '👦', name: 'Zoom' }, { emoji: '👧', name: 'Zip' }], sentence: 'I have a crayon.', pickWords: ['crayon', 'I', 'have'], pickCount: 2, tfZh: '他说有一支蜡笔。', tfAnswer: true },
  { id: 's11', title: '给我看书', speakers: [{ emoji: '👩‍🏫', name: '老师' }, { emoji: '🧒', name: '学生' }], sentence: 'Show me your book.', tfZh: '老师要看学生的书。', tfAnswer: true },
  { id: 's12', title: '询问名字', speakers: [{ emoji: '👦', name: 'Mike' }, { emoji: '👧', name: 'Chen Jie' }], sentence: "What's your name?", choicePartial: '你叫什么', choiceOptions: ['名字？', '书包？'], choiceAnswer: 0 },
  { id: 's13', title: '放学了', speakers: [{ emoji: '👩‍🏫', name: '老师' }, { emoji: '🧒', name: '全班' }], sentence: 'Goodbye, class!', tfZh: '老师在告别。', tfAnswer: true },
  { id: 's14', title: '回头见', speakers: [{ emoji: '👦', name: 'John' }, { emoji: '👧', name: 'Amy' }], sentence: 'See you!', pickWords: ['See', 'you'], pickCount: 2, tfZh: '他们在道别。', tfAnswer: true },
  { id: 's15', title: '我也有', speakers: [{ emoji: '👧', name: 'Amy' }, { emoji: '👦', name: 'Mike' }], sentence: 'Me too.', tfZh: '她表示「我也是」。', tfAnswer: true },
  { id: 's16', title: '铅笔与钢笔', speakers: [{ emoji: '👦', name: 'Mike' }, { emoji: '👧', name: 'Sarah' }], sentence: 'I have a pen.', pickWords: ['pen', 'I'], pickCount: 2, tfZh: '他说有一支钢笔。', tfAnswer: true },
  { id: 's17', title: '橡皮与尺子', speakers: [{ emoji: '👧', name: 'Sarah' }, { emoji: '👦', name: 'John' }], sentence: 'I have a ruler.', choicePartial: '我有一把', choiceOptions: ['尺子。', '书包。'], choiceAnswer: 0 },
  { id: 's18', title: '打开书包', speakers: [{ emoji: '👩‍🏫', name: '老师' }, { emoji: '🧒', name: '学生' }], sentence: 'Open your bag.', tfZh: '老师让学生打开书包。', tfAnswer: true },
  { id: 's19', title: '蜡笔展示', speakers: [{ emoji: '👦', name: 'Zoom' }, { emoji: '👧', name: 'Zip' }], sentence: 'Show me your crayon.', pickWords: ['Show', 'crayon'], pickCount: 2, tfZh: '他想看蜡笔。', tfAnswer: true },
  { id: 's20', title: '你好老师', speakers: [{ emoji: '🧒', name: '学生' }, { emoji: '👩‍🏫', name: '老师' }], sentence: "Hello, I'm Miss White.", choicePartial: '你好，我是', choiceOptions: ['怀特老师。', '萨拉。'], choiceAnswer: 0 },
]

export { AICHAT_SCENES } from './aichatDialogs'

export function buildStoryFromScene(scene: (typeof STORY_SCENES)[number]): QuestionData {
  const steps: StoryListenStep[] = [
    { kind: 'listen', audioText: scene.sentence },
  ]
  if (scene.pickWords?.length) {
    const options = [...new Set([...scene.pickWords, 'book', 'bag', 'pen', 'hello', 'Goodbye', 'name'])]
    steps.push({
      kind: 'wordPick',
      prompt: `选择听到的 ${scene.pickCount ?? 2} 个单词`,
      pickCount: scene.pickCount ?? 2,
      options,
      answers: scene.pickWords,
    })
  }
  if (scene.tfZh != null) {
    steps.push({
      kind: 'trueFalse',
      prompt: '判断正误',
      statementZh: scene.tfZh,
      replayText: scene.sentence,
      answer: scene.tfAnswer ?? true,
    })
  }
  if (scene.choicePartial) {
    steps.push({
      kind: 'choice',
      prompt: '选择听到的内容',
      partialZh: scene.choicePartial,
      options: (scene.choiceOptions ?? []).map(zh => ({ zh })),
      answerIndex: scene.choiceAnswer ?? 0,
    })
  }
  return {
    type: 'storyListen',
    id: `g3u1-story-${scene.id}`,
    prompt: '听故事',
    sceneTitle: scene.title,
    speakers: scene.speakers,
    steps,
  }
}

export function buildAichatFromScene(scene: (typeof AichatScenesType)[number]): QuestionData {
  assertAichatDialog(scene.lines, `g3u1-chat-${scene.id}`)
  return {
    type: 'aichat',
    id: `g3u1-chat-${scene.id}`,
    scene: scene.scene,
    role: scene.role,
    lines: scene.lines,
  }
}
