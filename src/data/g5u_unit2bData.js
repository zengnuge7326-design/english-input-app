// PEP五年级上册 Unit 2 Part B《My week》题库
// 主题：周末活动 (Saturday, Sunday, weekend, wash my clothes, watch TV, do homework, read books, play football)
// 7种题型，每种5题，共35题

export const quizBankG5U2b = [
  { question: "What do you do ___ the weekend?", chinese: "你周末做什么？", options: ["on", "in", "to", "with"], correct: 0, explanation: "在周末使用介词 on the weekend (美式) 或 at the weekend (英式)，教材常出现 on。", tag: "介词" },
  { question: "I often ___ my clothes.", chinese: "我经常洗衣服。", options: ["wash", "washing", "washes", "to wash"], correct: 0, explanation: "often 后接动词原形表示经常性的动作。", tag: "动词形式" },
  { question: "Do you often read books ___ this park?", chinese: "你经常在这个公园里看书吗？", options: ["in", "on", "at", "to"], correct: 0, explanation: "在公园里用 in this park。", tag: "介词" },
  { question: "I often play ___ football.", chinese: "我经常踢足球。", options: ["的(不填)", "the", "a", "an"], correct: 0, explanation: "球类运动前不用冠词，play football。", tag: "冠词" },
  { question: "Let's ___ TV together.", chinese: "我们一起看电视吧。", options: ["watch", "see", "look", "read"], correct: 0, explanation: "看电视是 watch TV。", tag: "动词搭配" }
]

export const fillblankBankG5U2b = [
  { sentence: "What do you do on the ___ (周末)?", answer: "weekend", chinese: "你周末做什么？", explanation: "weekend 周末", tag: "名词" },
  { sentence: "I often ___ (洗) my clothes.", answer: "wash", chinese: "我经常洗衣服。", explanation: "wash 洗", tag: "动词" },
  { sentence: "I often ___ (看) TV.", answer: "watch", chinese: "我经常看电视。", explanation: "watch 观看", tag: "动词" },
  { sentence: "I ___ (做) homework.", answer: "do", chinese: "我做作业。", explanation: "do homework 做作业", tag: "动词短语" },
  { sentence: "Do you often ___ (阅读) books?", answer: "read", chinese: "你经常看书吗？", explanation: "read books", tag: "动词" }
]

export const listenWordBankG5U2b = [
  { word: "weekend", options: ["work", "weekend", "weekday", "weather"], correct: 1, zh: "周末" },
  { word: "Saturday", options: ["Sunday", "Saturday", "Thursday", "sunny"], correct: 1, zh: "星期六" },
  { word: "Sunday", options: ["Sunday", "Saturday", "Monday", "sunny"], correct: 0, zh: "星期日" },
  { word: "wash", options: ["watch", "wash", "walk", "work"], correct: 1, zh: "洗" },
  { word: "watch", options: ["wash", "water", "watch", "wall"], correct: 2, zh: "看/手表" }
]

export const listenSentenceBankG5U2b = [
  { sentence: "What do you do on the weekend?", zh: "你周末做什么？", options: ["What do you do on Monday?", "What do you do on the weekend?", "Where do you go on the weekend?", "What do you have on the weekend?"], correct: 1 },
  { sentence: "I often wash my clothes.", zh: "我经常洗衣服。", options: ["I often pick apples.", "I often read books.", "I often wash my clothes.", "I often watch TV."], correct: 2 },
  { sentence: "Do you often read books in this park?", zh: "你经常在这个公园看书吗？", options: ["Do you often draw pictures here?", "Do you often read books in this park?", "Do you often play football here?", "Do you often watch TV in the park?"], correct: 1 },
  { sentence: "Yes, I do.", zh: "是的，我经常。", options: ["No, I don't.", "Yes, I am.", "Yes, I do.", "Yes, he does."], correct: 2 },
  { sentence: "I often play football.", zh: "我经常踢足球。", options: ["I often play basketball.", "I often play ping-pong.", "I often play football.", "We often play football."], correct: 2 }
]

export const listenOrderBankG5U2b = [
  { sentence: "What do you do on the weekend?", zh: "你周末一般做什么？", words: ["What", "do", "you", "do", "on", "the", "weekend?"], answer: ["What", "do", "you", "do", "on", "the", "weekend?"] },
  { sentence: "I often wash my clothes.", zh: "我经常洗衣服。", words: ["I", "often", "wash", "my", "clothes."], answer: ["I", "often", "wash", "my", "clothes."] },
  { sentence: "I often do my homework.", zh: "我经常做作业。", words: ["I", "often", "do", "my", "homework."], answer: ["I", "often", "do", "my", "homework."] },
  { sentence: "Do you often read books?", zh: "你经常看书吗？", words: ["Do", "you", "often", "read", "books?"], answer: ["Do", "you", "often", "read", "books?"] },
  { sentence: "Yes, I do.", zh: "是的，我是的。", words: ["Yes,", "I", "do."], answer: ["Yes,", "I", "do."] }
]

export const listenResponseBankG5U2b = [
  { question: "What do you do on the weekend?", zh: "你周末做什么？", options: ["I often wash my clothes.", "I have math.", "Yes, I do.", "On Sunday."], correct: 0 },
  { question: "Do you often read books?", zh: "你经常看书吗？", options: ["Yes, I do.", "I sleep.", "It's Saturday.", "Welcome."], correct: 0 },
  { question: "Do you often play football?", zh: "你经常踢足球吗？", options: ["No, I don't.", "I do my homework.", "He is young.", "Yes, he is."], correct: 0 },
  { question: "Let's play football.", zh: "我们来踢足球吧。", options: ["Great!", "No, I don't.", "On Sunday.", "I'm ten."], correct: 0 },
  { question: "Is it Saturday today?", zh: "今天是星期六吗？", options: ["Yes, it is.", "I play sports.", "I read books.", "Thanks."], correct: 0 }
]

export const listenTranslateBankG5U2b = [
  { sentence: "What do you do on the weekend?", options: ["你今天做什么？", "你周一做什么？", "你周末做什么？", "你星期五去哪？"], correct: 2 },
  { sentence: "I often watch TV.", options: ["我经常看书。", "我经常做作业。", "我经常洗衣服。", "我经常看电视。"], correct: 3 },
  { sentence: "I often do my homework.", options: ["我经常洗衣服。", "我经常做我的作业。", "我经常听音乐。", "我经常踢足球。"], correct: 1 },
  { sentence: "Do you often read books in this park?", options: ["你经常在家看书吗？", "你经常看电视吗？", "你经常在这个公园看书吗？", "你经常锻炼吗？"], correct: 2 },
  { sentence: "I often wash my clothes.", options: ["我经常洗衣服。", "我经常踢球。", "我经常做家务。", "我经常打扫卫生。"], correct: 0 }
]
