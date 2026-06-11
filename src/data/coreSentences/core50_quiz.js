import core50Data from '../core50.json'
import { CORE50_LESSONS } from './lessons.js'
import { buildCoreQuizBank } from './quizBuilder.js'

export const CORE_QUIZ_BANK = buildCoreQuizBank(CORE50_LESSONS, core50Data)
