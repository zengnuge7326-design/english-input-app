import core60Data from '../core60.json'
import { CORE60_LESSONS } from './lessons.js'
import { buildCoreQuizBank } from './quizBuilder.js'

export const CORE_QUIZ_BANK = buildCoreQuizBank(CORE60_LESSONS, core60Data)
