import type { QuizAvatarRole, QuizIconName } from './data/quizIconMap'

export type NodeStatus = 'locked' | 'current' | 'completed' | 'reward'

export type QuestionType =
  | 'translate'
  | 'wordTranslate'
  | 'matching'
  | 'storyListen'
  | 'phonicsIntro'
  | 'phonicsPick'
  | 'phonicsSameDiff'
  | 'phonicsRepeat'
  | 'listening'
  | 'dictation'
  | 'spelling'
  | 'ordering'
  | 'choice'
  | 'speaking'
  | 'aichat'

export interface MapNode {
  id: string
  unitId: string
  title: string
  subtitle?: string
  kind: 'lesson' | 'listening' | 'practice' | 'boss' | 'reward' | 'exam'
  status: NodeStatus
  xp: number
  /** 已完成题库套数 0–3 */
  setsCompleted?: number
  /** 题型专练岛（岛 1–11） */
  questionType?: QuestionType
}

export interface Unit {
  id: string
  title: string
  emoji: string
  color: string
  nodes: MapNode[]
}

export interface TranslateClozeQuestionData {
  type: 'translate'
  id: string
  /** 如「完成翻译」 */
  prompt: string
  /** 中文语境句（完整句子） */
  promptZh: string
  /** 需翻译的中文词（虚线下划线，对应英文空格） */
  hintWord: string
  /** 英文语境句，用 ___ 标出缺失单词 */
  template: string
  /** 缺失单词的正确答案 */
  answer: string
}

export interface WordTranslateCard {
  wordZh: string
  answer: string
  iconKey?: QuizIconName
  /** @deprecated 使用 iconKey */
  emoji?: string
  aliases?: string[]
}

/** 翻译单词：一组闪卡，口语说出英文 */
export interface WordTranslateQuestionData {
  type: 'wordTranslate'
  id: string
  prompt: string
  cards: WordTranslateCard[]
}

export interface MatchingPair {
  id: string
  /** 左侧播放的英文 */
  audioText: string
  /** 右侧中文 */
  labelZh: string
}

/** 配对题：pairs 至少 MIN_MATCHING_PAIRS 对（见 matchingConstraints.ts），一大题 = 左 N 音频 + 右 N 中文 */
export interface MatchingQuestionData {
  type: 'matching'
  id: string
  prompt: string
  pairs: MatchingPair[]
}

export interface StorySpeaker {
  role?: QuizAvatarRole
  /** @deprecated 使用 role */
  emoji?: string
  name?: string
}

export type StoryListenStep =
  | {
      kind: 'listen'
      audioText: string
    }
  | {
      kind: 'wordPick'
      prompt: string
      pickCount: number
      options: string[]
      answers: string[]
    }
  | {
      kind: 'trueFalse'
      prompt: string
      statementZh: string
      replayText?: string
      answer: boolean
    }
  | {
      kind: 'choice'
      prompt: string
      partialZh: string
      options: { zh: string }[]
      answerIndex: number
    }

export interface StoryListenQuestionData {
  type: 'storyListen'
  id: string
  prompt: string
  sceneTitle?: string
  speakers?: StorySpeaker[]
  steps: StoryListenStep[]
}

export interface PhonicsIntroQuestionData {
  type: 'phonicsIntro'
  id: string
  prompt: string
  subtitle: string
  vowels: { symbol: string; example: string; word: string }[]
}

export interface PhonicsPickQuestionData {
  type: 'phonicsPick'
  id: string
  prompt: string
  audioWord: string
  options: { word: string; ipa?: string }[]
  answerIndex: number
}

export interface PhonicsSameDiffQuestionData {
  type: 'phonicsSameDiff'
  id: string
  prompt: string
  wordA: string
  wordB: string
  sameWord: boolean
  ipaA?: string
  ipaB?: string
}

export interface PhonicsRepeatQuestionData {
  type: 'phonicsRepeat'
  id: string
  prompt: string
  character?: string
  characterRole?: QuizAvatarRole
  word: string
  ipa?: string
}

export interface ListeningQuestionData {
  type: 'listening'
  id: string
  prompt: string
  audioLabel: string
  options: { id: string; label: string; emoji?: string; correct?: boolean }[]
}

export interface DictationQuestionData {
  type: 'dictation'
  id: string
  /** 题目标题，如「键入你听到内容」 */
  prompt: string
  /** TTS 朗读文本 */
  audioText: string
  /** 正确答案（英文） */
  answer: string
  speaker?: string
}

export interface SpellingQuestionData {
  type: 'spelling'
  id: string
  prompt: string
  hintZh: string
  hintIcon?: QuizIconName
  /** @deprecated 使用 hintIcon */
  hintEmoji?: string
  answer: string
}

export interface OrderingQuestionData {
  type: 'ordering'
  id: string
  /** 题目标题，如「翻译这句话」 */
  prompt: string
  /** 中文原句，显示在角色气泡内 */
  promptZh: string
  /** 排序题角色 */
  speaker?: string
  speakerRole?: QuizAvatarRole
  /** 参与排序的单词（不含标点） */
  tokens: string[]
  /** 干扰词，混入词库增加难度 */
  distractors?: string[]
  /** 正确语序，仅单词、空格分隔，不含标点 */
  answer: string
}

export interface ChoiceQuestionData {
  type: 'choice'
  id: string
  prompt: string
  sentence: string
  blankIndex: number
  options: string[]
  answer: string
}

export interface SpeakingQuestionData {
  type: 'speaking'
  id: string
  prompt: string
  sentence: string
  ipa?: string
}

/** 对话题：lines 中 speaker 为 You 且带 choices 的轮数须 ≥ MIN_AICHAT_USER_TURNS（见 aichatConstraints.ts） */
export interface AIChatQuestionData {
  type: 'aichat'
  id: string
  scene: string
  role: 'teacher' | 'student' | 'shop'
  lines: { speaker: string; text: string; choices?: string[] }[]
}

export type QuestionData =
  | TranslateClozeQuestionData
  | WordTranslateQuestionData
  | MatchingQuestionData
  | StoryListenQuestionData
  | PhonicsIntroQuestionData
  | PhonicsPickQuestionData
  | PhonicsSameDiffQuestionData
  | PhonicsRepeatQuestionData
  | ListeningQuestionData
  | DictationQuestionData
  | SpellingQuestionData
  | OrderingQuestionData
  | ChoiceQuestionData
  | SpeakingQuestionData
  | AIChatQuestionData

export interface Lesson {
  id: string
  nodeId: string
  title: string
  questions: QuestionData[]
}

/** G3U1 覆盖优先抽题状态（跨岛共享） */
export interface G3U1DrawState {
  typeBag: QuestionType[]
  decks: Partial<Record<QuestionType, string[]>>
}

export interface MobileProgress {
  completedNodes: string[]
  /** 各岛屿已完成套数（1=绿水晶 2=紫水晶 3=黄星） */
  nodeSetsCompleted?: Record<string, number>
  /** G3U1 覆盖优先抽题状态（跨岛共享，清进度时重置） */
  g3u1Draw?: G3U1DrawState
  /** 练习页当前选中的小学册次 */
  practiceBookId?: string
  currentNodeId: string
  totalXp: number
  streak: number
  todayDone: number
  todayGoal: number
}

export interface MainXpSnapshot {
  streak: number
  totalXp: number
  todayXp: number
  goal: number
}

export interface MainCrystalSnapshot {
  total: number
}

export type CrystalEarnFn = (
  color: 'blue' | 'green' | 'red' | 'purple' | 'gold',
  amount?: number,
  reason?: string,
  meta?: Record<string, unknown> | null,
) => void
