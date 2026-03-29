import { useState } from 'react'
import { quizBank } from '../data/quizData'

export default function Quiz({ onImport, onClose }) {
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [currentGroup, setCurrentGroup] = useState('groupA')
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)

  const QUESTIONS_PER_GROUP = 5

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.9
    speechSynthesis.speak(utterance)
  }

  const getTranslation = (question) => {
    const translations = {
      "I can clean the ___.": "我能清洁___。",
      "We ___ the floor after class.": "下课后我们___地板。",
      "Close the ___ after school.": "放学后关上___。",
      "Turn off the ___.": "关掉___。",
      "The ___ is green.": "___是绿色的。",
      "We sit on the ___.": "我们坐在___上。",
      "Open the ___.": "打开___。",
      "The teacher writes on the ___.": "老师在___上写字。",
      "We use the ___ to cool the room.": "我们用___来给房间降温。",
      "Put the books on the ___.": "把书放在___上。",
      "___ eat in class.": "___在课堂上吃东西。",
      "___ be late for class.": "___上课迟到。",
      "___ the classroom clean.": "___教室清洁。",
      "___ talk in class.": "___在课堂上说话。",
      "___ the window, please.": "请___窗户。",
      "Jack, you ___ take toys to school.": "Jack，你___带玩具到学校。",
      "___ I take this apple?": "我___拿这个苹果吗？",
      "I ___ clean the blackboard.": "我___擦黑板。",
      "We ___ put back the chairs.": "我们___把椅子放回去。",
      "You ___ eat, but don't eat in class.": "你___吃，但不要在课堂上吃。",
      "Put ___ your hand to speak.": "举___你的手来发言。",
      "I can put ___ the desks and chairs.": "我能把桌椅放___原位。",
      "Who's on ___ today?": "今天谁___？",
      "Turn ___ the lights after school.": "放学后___灯。",
      "The classroom is clean and ___.": "教室干净又___。",
      "Keep the classroom ___.": "保持教室___。",
      "Hand ___ the workbooks.": "___作业本。",
      "Close the ___ after cleaning.": "清洁后关上___。",
      "We ___ wall newspapers.": "我们___墙报。",
      "The music room is nice and ___.": "音乐教室漂亮又___。",
      "The music room ___ nice and clean.": "音乐教室___漂亮又干净。",
      "Which word has the same 'ar' sound as 'park'?": "哪个词和'park'有相同的'ar'音？",
      "Some of us ___ wall newspapers.": "我们中的一些人___墙报。",
      "We ___ the doors after cleaning.": "清洁后我们___门。",
      "Don't ___ in class.": "不要在课堂上___。",
      "Which word does NOT have the 'ar' sound /ɑː/?": "哪个词没有'ar'音/ɑː/？"
    }
    return translations[question] || ""
  }

  const handleLevelSelect = (level) => {
    setSelectedLevel(level)
    setCurrentGroup('groupA')
    setAnswers({})
    setShowResult(false)
  }

  const handleGroupSelect = (group) => {
    setCurrentGroup(group)
    setAnswers({})
    setShowResult(false)
  }

  const handleAnswer = (questionIndex, answerIndex) => {
    setAnswers({ ...answers, [questionIndex]: answerIndex })
  }

  const handleSubmit = () => {
    setShowResult(true)
  }

  const handleBack = () => {
    setSelectedLevel(null)
    setAnswers({})
    setShowResult(false)
  }

  if (!selectedLevel) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">选择题练习 - PEP四年级下册Unit1</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(quizBank).map(([key, level]) => (
              <button
                key={key}
                onClick={() => handleLevelSelect(key)}
                className="bg-gray-800 hover:bg-gray-700 text-white p-6 rounded-xl transition-colors text-left"
              >
                <div className="font-bold text-lg mb-2">{level.name}</div>
                <div className="text-sm text-gray-400">共10题 (A组5题 + B组5题)</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const currentQuestions = quizBank[selectedLevel][currentGroup]
  const allAnswered = currentQuestions.every((_, idx) => answers[idx] !== undefined)

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <button onClick={handleBack} className="text-gray-400 hover:text-white">← 返回</button>
          <h2 className="text-xl font-bold text-white">{quizBank[selectedLevel].name}</h2>
          <div className="w-16"></div>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => handleGroupSelect('groupA')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              currentGroup === 'groupA' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            A组
          </button>
          <button
            onClick={() => handleGroupSelect('groupB')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              currentGroup === 'groupB' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            B组
          </button>
        </div>

            <div className="space-y-6">
              {currentQuestions.map((quiz, idx) => {
                const selected = answers[idx]

                return (
                  <div key={idx} className="bg-gray-800 rounded-xl p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <p className="text-white font-medium flex-1">
                        {idx + 1}. {quiz.question} <span className="text-gray-400 text-sm">({getTranslation(quiz.question)})</span>
                      </p>
                      <button
                        onClick={() => speak(quiz.question)}
                        className="text-blue-400 hover:text-blue-300 text-xl"
                        title="朗读题目"
                      >
                        🔊
                      </button>
                    </div>
                    <div className="space-y-2">
                      {quiz.options.map((option, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <button
                            onClick={() => handleAnswer(idx, optIdx)}
                            disabled={showResult}
                            className={`flex-1 text-left px-4 py-3 rounded-lg transition-colors ${
                              showResult
                                ? optIdx === quiz.correct
                                  ? 'bg-green-600 text-white'
                                  : optIdx === selected
                                  ? 'bg-red-600 text-white'
                                  : 'bg-gray-700 text-gray-400'
                                : selected === optIdx
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}. {option}
                          </button>
                          <button
                            onClick={() => speak(option)}
                            className="text-blue-400 hover:text-blue-300 px-2"
                            title="朗读选项"
                          >
                            🔊
                          </button>
                        </div>
                      ))}
                    </div>
                    {showResult && quiz.explanation && (
                      <div className="mt-4 bg-gray-900 rounded-lg p-4">
                        <p className="text-yellow-400 text-sm font-semibold mb-1">💡 解析：</p>
                        <p className="text-gray-300 text-sm">{quiz.explanation}</p>
                        {quiz.tag && (
                          <span className="inline-block mt-2 px-2 py-1 bg-blue-600/30 text-blue-400 text-xs rounded">
                            {quiz.tag}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

        {!showResult ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`w-full mt-6 py-3 rounded-xl font-semibold transition-colors ${
              allAnswered
                ? 'bg-green-600 hover:bg-green-500 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {allAnswered ? '提交答案' : `请完成所有题目 (${Object.keys(answers).length}/${QUESTIONS_PER_GROUP})`}
          </button>
        ) : (
          <div className="mt-6 text-center py-4 bg-blue-600 text-white rounded-xl font-bold text-lg">
            得分: {currentQuestions.filter((q, idx) => answers[idx] === q.correct).length} / {QUESTIONS_PER_GROUP}
          </div>
        )}
      </div>
    </div>
  )
}
