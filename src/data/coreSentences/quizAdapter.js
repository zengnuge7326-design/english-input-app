/** 将 CORE_QUIZ_BANK 题目转为 ExerciseQuiz 可渲染格式 */

const TYPE_LABELS = {
  listen_word: '听音选词',
  choose_translation: '英译中',
  fill_blank: '填空',
  sentence_order: '连词成句',
}

export function adaptCoreQuizQuestions(rawQuestions) {
  if (!rawQuestions?.length) return []
  return rawQuestions.map(q => {
    switch (q.type) {
      case 'listen_word':
        return {
          type: 'listen_word',
          tts: q.audio_text,
          question: '听录音，选出句中的关键词',
          options: q.options,
          answer: q.correct,
        }
      case 'choose_translation':
        return {
          type: 'en_to_zh',
          question: q.en,
          options: q.options,
          answer: q.correct,
        }
      case 'fill_blank':
        return {
          type: 'fill_blank',
          question: q.sentence_with_blank,
          sub: q.hint,
          options: q.options,
          answer: q.correct,
        }
      case 'sentence_order':
        return {
          type: 'word_order',
          question: q.hint ? `连词成句：${q.hint}` : '连词成句',
          words: q.scrambled_words,
          answer: q.correct_sentence,
        }
      default:
        return null
    }
  }).filter(Boolean)
}

export { TYPE_LABELS }
