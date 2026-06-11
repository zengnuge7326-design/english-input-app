import type { G3U1DrawState, Lesson, MobileProgress, QuestionData, QuestionType, Unit } from '../types'
import {
  G3U1_CORE_TYPES,
  G3U1_ISLANDS,
  isG3U1ExamNode,
  isG3U1Node,
  maxSetsForG3U1Node,
} from './g3u1/plan'
import { createG3U1DrawState } from './g3u1/drawState'
import { getG3U1Lesson } from './g3u1/lessons'
import { buildQuestionSets, ISLAND_SET_COUNT } from './lessonSets'
import { randomizeLessonQuestions } from '../utils/randomizeQuestionOptions'
import { UNIT1_LESSONS } from './unit1Lessons'
import { UNIT2_LESSONS } from './unit2Lessons'
import { PHONICS_LESSONS } from './unitPhonicsLessons'
import { LEGACY_AICHAT } from './aichatLegacyDialogs'
import { getPepPracticeLesson } from './pepPractice/lessons'
import {
  isPepExamNode,
  isPepPracticeNode,
  maxSetsForPepNode,
} from './pepPractice/plan'
import {
  buildPepPracticeUnits,
  resolveCurrentNodeForBook,
} from './pepPractice/units'

const PROGRESS_KEY = 'mobile_learn_progress_v2'

const VALID_G3U1_NODES = new Set(G3U1_ISLANDS.map(i => i.id))

const LEGACY_NODE_MAP: Record<string, string> = {
  'u1-l1': 'g3u1-01',
  'u1-l2': 'g3u1-02',
  'u1-l3': 'g3u1-05',
  'u1-l4': 'g3u1-07',
  'u1-boss': 'g3u1-08',
  'u1-reward': 'g3u1-08',
  'g3u1-12': 'g3u1-08',
  'g3u1-09': 'g3u1-07',
  'g3u1-10': 'g3u1-07',
  'g3u1-11': 'g3u1-07',
}

function migrateNodeId(nodeId: string) {
  return LEGACY_NODE_MAP[nodeId] ?? nodeId
}

export const DEFAULT_PRACTICE_BOOK_ID = 'g3-1'

export const DEFAULT_PROGRESS: MobileProgress = {
  completedNodes: [],
  nodeSetsCompleted: {},
  practiceBookId: DEFAULT_PRACTICE_BOOK_ID,
  currentNodeId: 'g3u1-01',
  totalXp: 120,
  streak: 3,
  todayDone: 2,
  todayGoal: 5,
}

function normalizeProgress(raw: Partial<MobileProgress>): MobileProgress {
  const merged = { ...DEFAULT_PROGRESS, ...raw }
  const currentNodeId = migrateNodeId(merged.currentNodeId)
  let completedNodes = [...new Set(merged.completedNodes.map(migrateNodeId))]
    .filter(id => !isG3U1Node(id) || VALID_G3U1_NODES.has(id))
  const nodeSetsCompleted: Record<string, number> = {}
  for (const [id, count] of Object.entries(merged.nodeSetsCompleted ?? {})) {
    const nextId = migrateNodeId(id)
    if (isG3U1Node(nextId) && !VALID_G3U1_NODES.has(nextId)) continue
    nodeSetsCompleted[nextId] = Math.max(nodeSetsCompleted[nextId] ?? 0, count)
  }
  for (const id of completedNodes) {
    if ((nodeSetsCompleted[id] ?? 0) < 1) nodeSetsCompleted[id] = 1
  }
  for (const [id, count] of Object.entries(nodeSetsCompleted)) {
    if (isG3U1Node(id)) {
      const max = maxSetsForG3U1Node(id)
      if (isG3U1ExamNode(id) && count >= 1) nodeSetsCompleted[id] = 3
      else nodeSetsCompleted[id] = Math.min(max, count)
      continue
    }
    if (isPepPracticeNode(id)) {
      const max = maxSetsForPepNode(id)
      if (isPepExamNode(id) && count >= 1) nodeSetsCompleted[id] = 3
      else nodeSetsCompleted[id] = Math.min(max, count)
    }
  }
  const practiceBookId = merged.practiceBookId ?? DEFAULT_PRACTICE_BOOK_ID
  if ((nodeSetsCompleted['g3u1-08'] ?? 0) >= 1 && !completedNodes.includes('g3u1-08')) {
    completedNodes = [...completedNodes, 'g3u1-08']
  }
  const withBook = { ...merged, practiceBookId, currentNodeId, completedNodes, nodeSetsCompleted }
  const resolvedNode = resolveCurrentNodeForBook(withBook, practiceBookId)
  return { ...withBook, currentNodeId: resolvedNode }
}

export function getNodeSetsCompleted(progress: MobileProgress, nodeId: string): number {
  const fromRecord = progress.nodeSetsCompleted?.[nodeId]
  if (isG3U1ExamNode(nodeId) || isPepExamNode(nodeId)) {
    if ((fromRecord ?? 0) >= 1) return 3
    return 0
  }
  if (fromRecord != null) return Math.min(ISLAND_SET_COUNT, fromRecord)
  return progress.completedNodes.includes(nodeId) ? 1 : 0
}

export function isG3U1ExamDone(progress: MobileProgress): boolean {
  return (progress.nodeSetsCompleted?.['g3u1-08'] ?? 0) >= 1
}

export function loadProgress(): MobileProgress {
  try {
    let raw = localStorage.getItem(PROGRESS_KEY)
    if (!raw) {
      raw = localStorage.getItem('mobile_learn_progress_v1')
    }
    if (!raw) return { ...DEFAULT_PROGRESS }
    return normalizeProgress(JSON.parse(raw))
  } catch {
    return { ...DEFAULT_PROGRESS }
  }
}

export function saveProgress(p: MobileProgress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p))
  } catch { /* ignore */ }
}

/** 一键清除手机学习模式本地进度 */
export function resetProgress(): MobileProgress {
  try {
    localStorage.removeItem(PROGRESS_KEY)
    localStorage.removeItem('mobile_learn_progress_v1')
  } catch { /* ignore */ }
  return {
    completedNodes: [],
    nodeSetsCompleted: {},
    g3u1Draw: undefined,
    practiceBookId: DEFAULT_PRACTICE_BOOK_ID,
    currentNodeId: 'g3u1-01',
    totalXp: 0,
    streak: 0,
    todayDone: 0,
    todayGoal: 5,
  }
}

export function buildUnits(progress: MobileProgress, bookId?: string): Unit[] {
  const id = bookId ?? progress.practiceBookId ?? DEFAULT_PRACTICE_BOOK_ID
  return buildPepPracticeUnits(id, progress)
}

export function switchPracticeBook(progress: MobileProgress, bookId: string): MobileProgress {
  const currentNodeId = resolveCurrentNodeForBook(progress, bookId)
  return { ...progress, practiceBookId: bookId, currentNodeId }
}

export const LESSONS: Record<string, Lesson> = {
  'u1-l1': {
    id: 'u1-l1',
    nodeId: 'u1-l1',
    title: 'Hello basics',
    questions: [
      {
        type: 'translate',
        id: 'q0',
        prompt: '完成翻译',
        promptZh: '早上好，汤姆！',
        hintWord: '早上',
        template: 'Good ___ , Tom!',
        answer: 'morning',
      },
      {
        type: 'wordTranslate',
        id: 'q0b',
        prompt: '翻译单词',
        cards: [
          { wordZh: '你好', answer: 'hello', emoji: '👋' },
          { wordZh: '早上', answer: 'morning', emoji: '🌅' },
          { wordZh: '很好', answer: 'fine', emoji: '🙂' },
          { wordZh: '名字', answer: 'name', emoji: '🪪' },
          { wordZh: '我', answer: 'I', emoji: '🙋' },
          { wordZh: '再见', answer: 'goodbye', emoji: '👋' },
        ],
      },
      {
        type: 'matching',
        id: 'q0c',
        prompt: '选择配对',
        pairs: [
          { id: 'p1', audioText: 'hello', labelZh: '你好' },
          { id: 'p2', audioText: 'morning', labelZh: '早上' },
          { id: 'p3', audioText: 'fine', labelZh: '很好' },
          { id: 'p4', audioText: 'goodbye', labelZh: '再见' },
          { id: 'p5', audioText: 'name', labelZh: '名字' },
        ],
      },
      {
        type: 'storyListen',
        id: 'q0d',
        prompt: '听故事',
        sceneTitle: '校门口早晨',
        speakers: [{ emoji: '👩‍🏫', name: '王老师' }, { emoji: '🧒', name: '莉莉' }],
        steps: [
          {
            kind: 'listen',
            audioText: 'Good morning! I am Lily. Nice to meet you!',
          },
          {
            kind: 'wordPick',
            prompt: '选择听到的 2 个单词',
            pickCount: 2,
            options: ['morning', 'Lily', 'book', 'desk', 'goodbye'],
            answers: ['morning', 'Lily'],
          },
          {
            kind: 'trueFalse',
            prompt: '判断正误',
            statementZh: '她们在清晨打招呼。',
            replayText: 'Good morning!',
            answer: true,
          },
          {
            kind: 'choice',
            prompt: '选择听到的内容',
            partialZh: '我叫',
            options: [{ zh: '莉莉。' }, { zh: '汤姆。' }],
            answerIndex: 0,
          },
        ],
      },
      {
        type: 'listening',
        id: 'q1',
        prompt: '听一听，选正确的图片',
        audioLabel: 'Hello!',
        options: [
          { id: 'a', label: 'Hello', emoji: '👋', correct: true },
          { id: 'b', label: 'Goodbye', emoji: '🚪' },
          { id: 'c', label: 'Thanks', emoji: '🙏' },
        ],
      },
      {
        type: 'dictation',
        id: 'q2',
        prompt: '键入你听到内容',
        audioText: 'Hello!',
        answer: 'Hello!',
        speaker: '👨',
      },
      {
        type: 'spelling',
        id: 'q2b',
        prompt: '拼写这个单词',
        hintZh: '你好',
        hintEmoji: '👋',
        answer: 'hello',
      },
      {
        type: 'ordering',
        id: 'q3',
        prompt: '翻译这句话',
        promptZh: '我很好。',
        tokens: ['I', 'am', 'fine'],
        distractors: ['good', 'well'],
        answer: 'I am fine',
      },
      {
        type: 'choice',
        id: 'q4',
        prompt: '选词填空',
        sentence: 'Good ___ , Tom!',
        blankIndex: 1,
        options: ['morning', 'book', 'desk'],
        answer: 'morning',
      },
      {
        type: 'speaking',
        id: 'q5',
        prompt: '跟读这句话',
        sentence: 'Hello, I am Amy.',
        ipa: '/həˈləʊ aɪ æm ˈeɪmi/',
      },
      LEGACY_AICHAT.u1l1,
    ],
  },
  'u1-l2': {
    id: 'u1-l2',
    nodeId: 'u1-l2',
    title: 'Introductions',
    questions: [
      {
        type: 'listening',
        id: 'q1',
        prompt: '听一听，选正确的句子',
        audioLabel: 'Nice to meet you.',
        options: [
          { id: 'a', label: 'Nice to meet you.', emoji: '🤝', correct: true },
          { id: 'b', label: 'See you later.', emoji: '👋' },
          { id: 'c', label: 'I am sorry.', emoji: '😔' },
        ],
      },
      {
        type: 'spelling',
        id: 'q2',
        prompt: '拼写这个单词',
        hintZh: '名字',
        hintEmoji: '🪪',
        answer: 'name',
      },
      {
        type: 'ordering',
        id: 'q3',
        prompt: '翻译这句话',
        promptZh: '很高兴认识你。',
        tokens: ['Nice', 'to', 'meet', 'you'],
        distractors: ['see', 'hello'],
        answer: 'Nice to meet you',
      },
      {
        type: 'choice',
        id: 'q4',
        prompt: '完成对话',
        sentence: 'This is ___ friend, Jack.',
        blankIndex: 2,
        options: ['my', 'am', 'hello'],
        answer: 'my',
      },
      {
        type: 'speaking',
        id: 'q5',
        prompt: '大声读出来',
        sentence: 'This is my friend.',
      },
      LEGACY_AICHAT.u1l2,
    ],
  },
  ...UNIT1_LESSONS,
  ...PHONICS_LESSONS,
  ...UNIT2_LESSONS,
}

const FALLBACK_POOL: QuestionData[] = [
  {
    type: 'listening',
    id: 'fb-q1',
    prompt: '听音选择',
    audioLabel: 'Good job!',
    options: [
      { id: 'a', label: 'Good job!', emoji: '⭐', correct: true },
      { id: 'b', label: 'Good night', emoji: '🌙' },
      { id: 'c', label: 'Good luck', emoji: '🍀' },
    ],
  },
  {
    type: 'listening',
    id: 'fb-q2',
    prompt: '听音选择',
    audioLabel: 'Well done!',
    options: [
      { id: 'a', label: 'Well done!', emoji: '👏', correct: true },
      { id: 'b', label: 'See you', emoji: '👋' },
      { id: 'c', label: 'Thank you', emoji: '🙏' },
    ],
  },
  {
    type: 'spelling',
    id: 'fb-q3',
    prompt: '拼写',
    hintZh: '学校',
    hintEmoji: '🏫',
    answer: 'school',
  },
  {
    type: 'spelling',
    id: 'fb-q4',
    prompt: '拼写',
    hintZh: '老师',
    hintEmoji: '👩‍🏫',
    answer: 'teacher',
  },
  {
    type: 'choice',
    id: 'fb-q5',
    prompt: '填空',
    sentence: 'I ___ a student.',
    blankIndex: 1,
    options: ['am', 'is', 'are'],
    answer: 'am',
  },
  {
    type: 'choice',
    id: 'fb-q6',
    prompt: '填空',
    sentence: 'She ___ my friend.',
    blankIndex: 1,
    options: ['is', 'am', 'are'],
    answer: 'is',
  },
  {
    type: 'ordering',
    id: 'fb-q7',
    prompt: '翻译这句话',
    promptZh: '我爱英语。',
    tokens: ['I', 'love', 'English'],
    distractors: ['like', 'study'],
    answer: 'I love English',
  },
  {
    type: 'ordering',
    id: 'fb-q8',
    prompt: '翻译这句话',
    promptZh: '这是一本书。',
    tokens: ['This', 'is', 'a', 'book'],
    distractors: ['desk', 'an'],
    answer: 'This is a book',
  },
  {
    type: 'speaking',
    id: 'fb-q9',
    prompt: '跟读',
    sentence: 'I love English!',
  },
  {
    type: 'speaking',
    id: 'fb-q10',
    prompt: '跟读',
    sentence: 'Let us go to school.',
  },
]

function fallbackLesson(nodeId: string): Lesson {
  return {
    id: nodeId,
    nodeId,
    title: nodeId.includes('boss') ? 'Boss Review' : 'Quick Practice',
    questions: FALLBACK_POOL,
  }
}

function sanitizeG3U1DrawState(raw: MobileProgress['g3u1Draw']): G3U1DrawState | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const typeBag = Array.isArray(raw.typeBag) ? raw.typeBag.filter(t => G3U1_CORE_TYPES.includes(t)) : []
  const decks: G3U1DrawState['decks'] = {}
  if (raw.decks && typeof raw.decks === 'object') {
    for (const [key, ids] of Object.entries(raw.decks)) {
      if (!G3U1_CORE_TYPES.includes(key as QuestionType)) continue
      if (!Array.isArray(ids)) continue
      decks[key as QuestionType] = ids.filter(id => typeof id === 'string')
    }
  }
  return { typeBag, decks }
}

function ensureG3U1DrawState(progress: MobileProgress): MobileProgress {
  const clean = sanitizeG3U1DrawState(progress.g3u1Draw)
  if (clean) return { ...progress, g3u1Draw: clean }
  return { ...progress, g3u1Draw: createG3U1DrawState() }
}

/** 动态题库：G3U1 覆盖优先抽题；其余沿用原逻辑 */
export function getLessonForNode(
  nodeId: string,
  setIndex = 0,
  progress?: MobileProgress,
): { lesson: Lesson; progress: MobileProgress } {
  const baseProgress = progress ?? DEFAULT_PROGRESS

  if (isPepPracticeNode(nodeId)) {
    const lesson = getPepPracticeLesson(nodeId, setIndex)
    if (lesson && lesson.questions.length > 0) {
      return {
        lesson: { ...lesson, questions: randomizeLessonQuestions(lesson.questions) },
        progress: baseProgress,
      }
    }
  }

  if (isG3U1Node(nodeId)) {
    const withDraw = ensureG3U1DrawState(baseProgress)
    try {
      const drawState = structuredClone(withDraw.g3u1Draw!)
      const lesson = getG3U1Lesson(nodeId, setIndex, drawState)
      if (lesson && lesson.questions.length > 0) {
        return {
          lesson: { ...lesson, questions: randomizeLessonQuestions(lesson.questions) },
          progress: { ...withDraw, g3u1Draw: drawState },
        }
      }
    } catch (err) {
      console.warn('[mobile] g3u1 draw failed, resetting draw state', err)
      const fresh = { ...withDraw, g3u1Draw: createG3U1DrawState() }
      const drawState = structuredClone(fresh.g3u1Draw!)
      const lesson = getG3U1Lesson(nodeId, setIndex, drawState)
      if (lesson && lesson.questions.length > 0) {
        return {
          lesson: { ...lesson, questions: randomizeLessonQuestions(lesson.questions) },
          progress: { ...fresh, g3u1Draw: drawState },
        }
      }
    }
  }

  const base = LESSONS[nodeId] ?? fallbackLesson(nodeId)
  const sets = buildQuestionSets(nodeId, base.questions)
  const idx = Math.max(0, Math.min(setIndex, ISLAND_SET_COUNT - 1))
  const setLabel = idx === 0 ? '' : ` · 第${idx + 1}套`
  return {
    lesson: {
      ...base,
      id: `${base.id}-set${idx + 1}`,
      title: `${base.title}${setLabel}`,
      questions: randomizeLessonQuestions(sets[idx]),
    },
    progress: baseProgress,
  }
}
