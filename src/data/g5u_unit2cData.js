// PEP五年级上册 Unit 2 Part C《Story time / Let's check》题库
// 主题：Unit 2 综合复习 (星期一到星期日、周末活动综合)
// 7种题型，每种5题，共35题

export const quizBankG5U2c = [
  { question: "___ do you have on Wednesday?", chinese: "你星期三有什么课？", options: ["What", "Where", "How", "Who"], correct: 0, explanation: "询问上什么课用 What。", tag: "疑问词" },
  { question: "What do you do ___ Sundays?", chinese: "你星期日一般做什么？", options: ["on", "in", "at", "with"], correct: 0, explanation: "星期前面的介词用 on。", tag: "介词" },
  { question: "I ___ read books.", chinese: "我经常看书。", options: ["often", "some", "any", "too"], correct: 0, explanation: "often 表示经常，副词，放在动词前。", tag: "副词" },
  { question: "Do you often play ping-pong? No, I ___.", chinese: "你经常打乒乓球吗？不，我不怎么打。", options: ["don't", "do", "isn't", "am not"], correct: 0, explanation: "Do 提问，否定回答用 don't。", tag: "情景交际" },
  { question: "Let's ___ football.", chinese: "我们去踢足球吧。", options: ["play", "plays", "playing", "to play"], correct: 0, explanation: "Let's 后接动词原形。", tag: "动词用法" }
]

export const fillblankBankG5U2c = [
  { sentence: "___ (经常) I read books.", answer: "Often", chinese: "我经常看书。(句首)", explanation: "Often 经常（首字母大写）", tag: "副词" },
  { sentence: "What do you do on ___ (周末)?", answer: "weekends", chinese: "周末你做什么？(复数泛指)", explanation: "weekends", tag: "名词" },
  { sentence: "I often play ___ (足球).", answer: "football", chinese: "我经常踢足球。", explanation: "football 足球", tag: "名词" },
  { sentence: "Do you often ___ (洗) clothes?", answer: "wash", chinese: "你经常洗衣服吗？", explanation: "wash 洗", tag: "动词" },
  { sentence: "We have PE on ___ (星期四).", answer: "Thursday", chinese: "我们在周四有体育课。", explanation: "Thursday 星期四", tag: "名词" }
]

export const listenWordBankG5U2c = [
  { word: "often", options: ["open", "often", "after", "over"], correct: 1, zh: "经常" },
  { word: "weekend", options: ["weed", "weekend", "work", "week"], correct: 1, zh: "周末" },
  { word: "football", options: ["basketball", "football", "baseball", "food"], correct: 1, zh: "足球" },
  { word: "homework", options: ["housework", "homework", "hard-working", "home"], correct: 1, zh: "作业" },
  { word: "Wednesday", options: ["Tuesday", "Thursday", "Wednesday", "weather"], correct: 2, zh: "星期三" }
]

export const listenSentenceBankG5U2c = [
  { sentence: "What do you have on Mondays?", zh: "你星期一有什么课？", options: ["What do you do on Mondays?", "What do you have on Mondays?", "What do you have on Sundays?", "What do you do on the weekend?"], correct: 1 },
  { sentence: "I often watch TV.", zh: "我经常看电视。", options: ["I often read books.", "I often wash my clothes.", "I often watch TV.", "I often do my homework."], correct: 2 },
  { sentence: "Do you often read books?", zh: "你经常看书吗？", options: ["Do you often watch TV?", "Do you often wash clothes?", "Do you often read books?", "Do you often play football?"], correct: 2 },
  { sentence: "We have English and art.", zh: "我们有英语和美术。", options: ["We have math and PE.", "We have science and art.", "We have English and art.", "We have music and math."], correct: 2 },
  { sentence: "Let's play ping-pong.", zh: "我们打乒乓球吧。", options: ["Let's play basketball.", "Let's play football.", "Let's play ping-pong.", "Let's watch TV."], correct: 2 }
]

export const listenOrderBankG5U2c = [
  { sentence: "What do you do on weekends?", zh: "你周末做什么？", words: ["What", "do", "you", "do", "on", "weekends?"], answer: ["What", "do", "you", "do", "on", "weekends?"] },
  { sentence: "I often read books.", zh: "我经常读书。", words: ["I", "often", "read", "books."], answer: ["I", "often", "read", "books."] },
  { sentence: "Do you often play football?", zh: "你经常踢足球吗？", words: ["Do", "you", "often", "play", "football?"], answer: ["Do", "you", "often", "play", "football?"] },
  { sentence: "No, I don't.", zh: "不，我不。", words: ["No,", "I", "don't."], answer: ["No,", "I", "don't."] },
  { sentence: "We have English on Monday.", zh: "我们星期一有英语。", words: ["We", "have", "English", "on", "Monday."], answer: ["We", "have", "English", "on", "Monday."] }
]

export const listenResponseBankG5U2c = [
  { question: "What do you do on the weekend?", zh: "你周末一般干什么？", options: ["I often read books.", "On Monday.", "Yes, I do.", "Thank you."], correct: 0 },
  { question: "What do you have on Tuesdays?", zh: "你周二有什么课？", options: ["We have English and PE.", "I often watch TV.", "Yes, I have.", "It is Friday."], correct: 0 },
  { question: "Do you often wash your clothes?", zh: "你经常洗衣服吗？", options: ["Yes, I do.", "I have math.", "On Sunday.", "Great."], correct: 0 },
  { question: "Let's play football.", zh: "咱们去踢球吧。", options: ["Great!", "No, I am not.", "It is blue.", "I see twelve."], correct: 0 },
  { question: "Is it Sunday today?", zh: "今天是星期天吗？", options: ["No, it's Saturday.", "I play football.", "We have art.", "Me too."], correct: 0 }
]

export const listenTranslateBankG5U2c = [
  { sentence: "What do you do on weekends?", options: ["你周末去哪儿？", "你星期天做什么？", "你平时做什么？", "你周末做什么？"], correct: 3 },
  { sentence: "I often read books.", options: ["我每天看书。", "我经常看书。", "我很少看书。", "你经常看书吗？"], correct: 1 },
  { sentence: "We have art and PE.", options: ["我们有美术和体育。", "我们有语文和数学。", "我们有音乐和英语。", "我们喜欢美术和体育。"], correct: 0 },
  { sentence: "Do you often watch TV?", options: ["你喜欢看电视吗？", "你经常看电视吗？", "你经常做作业吗？", "你周末干什么？"], correct: 1 },
  { sentence: "Let's play football.", options: ["我们打篮球吧。", "我们去划船吧。", "我们踢足球吧。", "我们在踢足球。"], correct: 2 }
]
