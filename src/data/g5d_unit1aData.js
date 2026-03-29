// PEP五年级下册 Unit 1 Part A《My day》题库
// 主题：日常活动1 (eat breakfast, do morning exercises, have... class, play sports, eat dinner) + When do you finish class in the morning?
// 7种题型，每种5题，共35题

export const quizBankG5D1a = [
  { question: "___ do you eat breakfast?", chinese: "你什么时候吃早饭？", options: ["When", "What", "Where", "Who"], correct: 0, explanation: "询问什么时间用 When。", tag: "疑问词" },
  { question: "I eat dinner ___ 7:00 o'clock.", chinese: "我在7点钟吃晚饭。", options: ["at", "in", "on", "to"], correct: 0, explanation: "在具体的时间点前面用 at，如 at 7:00。", tag: "介词" },
  { question: "We do morning ___ at 8:00 a.m.", chinese: "我们在上午8点做早操。", options: ["exercises", "exercise", "exercising", "to exercise"], correct: 0, explanation: "do morning exercises 做早操。", tag: "名词复数" },
  { question: "I often play ___ in the afternoon.", chinese: "我经常在下午做运动。", options: ["sports", "sport", "a sport", "the sport"], correct: 0, explanation: "play sports 进行体育活动。", tag: "名词复数" },
  { question: "We finish class ___ 11:30.", chinese: "我们在11:30放学。", options: ["at", "on", "in", "about"], correct: 0, explanation: "具体时间点前用 at。", tag: "介词" }
]

export const fillblankBankG5D1a = [
  { sentence: "___ (什么时候) do you eat dinner?", answer: "When", chinese: "你什么时候吃晚饭？", explanation: "When 询问时间，首字母大写。", tag: "疑问词" },
  { sentence: "I eat ___ (早饭) at 7:00.", answer: "breakfast", chinese: "我在7点吃早饭。", explanation: "breakfast 早饭", tag: "名词" },
  { sentence: "We do morning ___ (早操).", answer: "exercises", chinese: "我们做早操。", explanation: "exercises 锻炼", tag: "名词复数" },
  { sentence: "They have a math ___ (常指一节课).", answer: "class", chinese: "他们上数学课。", explanation: "class 课", tag: "名词" },
  { sentence: "We play ___ (运动) every day.", answer: "sports", chinese: "我们每天进行体育运动。", explanation: "sports", tag: "名词复数" }
]

export const listenWordBankG5D1a = [
  { word: "breakfast", options: ["bread", "breakfast", "break", "best"], correct: 1, zh: "早餐" },
  { word: "exercises", options: ["exact", "excuse", "exercises", "example"], correct: 2, zh: "锻炼/体操" },
  { word: "sports", options: ["spots", "sports", "stops", "stars"], correct: 1, zh: "体育运动" },
  { word: "dinner", options: ["driver", "dancer", "dinner", "doctor"], correct: 2, zh: "主餐/晚餐" },
  { word: "when", options: ["when", "where", "what", "which"], correct: 0, zh: "什么时候" }
]

export const listenSentenceBankG5D1a = [
  { sentence: "When do you eat breakfast?", zh: "你什么时候吃早餐？", options: ["When do you eat dinner?", "When do you eat lunch?", "When do you eat breakfast?", "What do you eat for breakfast?"], correct: 2 },
  { sentence: "I eat breakfast at 7 o'clock.", zh: "我在7点吃早餐。", options: ["I eat dinner at 7 o'clock.", "I eat breakfast at 7 o'clock.", "I eat breakfast at 6 o'clock.", "He eats breakfast at 7 o'clock."], correct: 1 },
  { sentence: "We do morning exercises.", zh: "我们做早操。", options: ["We play sports.", "We do morning exercises.", "We eat breakfast.", "We have an English class."], correct: 1 },
  { sentence: "I often play in the playground.", zh: "我经常在操场上玩。", options: ["I often play in the park.", "I often play sports.", "I often play in the playground.", "I often play with friends."], correct: 2 },
  { sentence: "When do you finish class?", zh: "你们什么时候放学？", options: ["When do you have class?", "When do you start class?", "When do you finish class?", "Where do you have class?"], correct: 2 }
]

export const listenOrderBankG5D1a = [
  { sentence: "When do you eat breakfast?", zh: "你什么时候吃早餐？", words: ["When", "do", "you", "eat", "breakfast?"], answer: ["When", "do", "you", "eat", "breakfast?"] },
  { sentence: "I eat breakfast at 7:00.", zh: "我在7点吃早餐。", words: ["I", "eat", "breakfast", "at", "7:00."], answer: ["I", "eat", "breakfast", "at", "7:00."] },
  { sentence: "We do morning exercises.", zh: "我们做早操。", words: ["We", "do", "morning", "exercises."], answer: ["We", "do", "morning", "exercises."] },
  { sentence: "When do you finish class?", zh: "你们什么时候放学？", words: ["When", "do", "you", "finish", "class?"], answer: ["When", "do", "you", "finish", "class?"] },
  { sentence: "We play sports in the afternoon.", zh: "我们在下午进行体育运动。", words: ["We", "play", "sports", "in", "the", "afternoon."], answer: ["We", "play", "sports", "in", "the", "afternoon."] }
]

export const listenResponseBankG5D1a = [
  { question: "When do you eat breakfast?", zh: "你什么时候吃早饭？", options: ["At 7:00.", "I like apples.", "In the morning.", "Yes, I do."], correct: 0 },
  { question: "Do you play sports in the afternoon?", zh: "你在下午做运动吗？", options: ["Yes, I do.", "At 5:00.", "It's tall.", "Ten."], correct: 0 },
  { question: "When do you finish class?", zh: "你们几点放学？", options: ["At 4:30.", "I like my teachers.", "We play sports.", "Yes, I am."], correct: 0 },
  { question: "What do you do in the morning?", zh: "你早上做什么？", options: ["I do morning exercises.", "I like music.", "At 8:00.", "No, I don't."], correct: 0 },
  { question: "Let's play sports.", zh: "我们去做运动吧。", options: ["Great!", "No, I am not.", "It is big.", "Thanks."], correct: 0 }
]

export const listenTranslateBankG5D1a = [
  { sentence: "When do you eat breakfast?", options: ["你想要吃什么早餐？", "你什么时候吃晚饭？", "你什么时候吃早饭？", "谁在吃早饭？"], correct: 2 },
  { sentence: "We do morning exercises at 8:00.", options: ["我们在8点上课。", "我们在8点打扫房间。", "我们在8点做早操。", "我们在8点睡觉。"], correct: 2 },
  { sentence: "When do you finish class in the morning?", options: ["你早上几点上学？", "你上午什么时候放课/下课？", "你下午什么时候下课？", "你早上有什么课？"], correct: 1 },
  { sentence: "I play sports at 4:00.", options: ["我在4点去公园。", "我在4点踢足球。", "我在4点进行体育运动。", "我在4点回家。"], correct: 2 },
  { sentence: "I eat dinner at 7:00.", options: ["我在7点吃早饭。", "他在7点洗澡。", "我在7点吃晚饭。", "他今天吃晚饭。"], correct: 2 }
]
