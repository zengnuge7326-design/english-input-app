import core100Data from '../core100.json'
import { CORE100_LESSONS } from './lessons.js'
import { buildCoreQuizBank } from './quizBuilder.js'

export const CORE_QUIZ_BANK = buildCoreQuizBank(CORE100_LESSONS, core100Data)
