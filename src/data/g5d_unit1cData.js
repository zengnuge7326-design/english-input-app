// PEP五年级下册 Unit 1 Part C《Story time / Let's check》题库
// 主题：Unit 1 综合复习 (频度副词 always, usually, often, sometimes; 时间表达)
// 7种题型，每种5题，共35题

export const quizBankG5D1c = [
  { question: "I ___ eat breakfast at 7:00.", chinese: "我通常在7点吃早餐。", options: ["usually", "usual", "am", "do"], correct: 0, explanation: "usually 通常。", tag: "频度副词" },
  { question: "___ you play sports in the afternoon?", chinese: "你下午做运动吗？", options: ["Do", "Are", "Can", "Is"], correct: 0, explanation: "一般现在时的疑问句，主语是对you提问，借助助动词 Do。", tag: "助动词" },
  { question: "When do you get ___?", chinese: "你几点起床？", options: ["up", "on", "in", "to"], correct: 0, explanation: "get up 起床。", tag: "固定搭配" },
  { question: "___ he clean his room?", chinese: "他打扫他的房间吗？", options: ["Does", "Do", "Is", "Are"], correct: 0, explanation: "主语是第三人称单数 he，助动词用 Does。", tag: "助动词" },
  { question: "I am late ___ school.", chinese: "我上学迟到了。", options: ["for", "to", "at", "with"], correct: 0, explanation: "be late for 做某事迟到。", tag: "主谓搭配" }
]

export const fillblankBankG5D1c = [
  { sentence: "I ___ (总是) get up early.", answer: "always", chinese: "我总是早起。", explanation: "always 总是", tag: "频度副词" },
  { sentence: "I ___ (通常) eat breakfast at 7:00.", answer: "usually", chinese: "我通常在7点吃早饭。", explanation: "usually 通常", tag: "频度副词" },
  { sentence: "I ___ (经常) wash my clothes.", answer: "often", chinese: "我经常洗衣服。", explanation: "often 经常", tag: "频度副词" },
  { sentence: "___ (有时候) I go for a walk.", answer: "Sometimes", chinese: "有时候我去散步。", explanation: "Sometimes (首字母大写)", tag: "频度副词" },
  { sentence: "I get ___ (起) at 6:00.", answer: "up", chinese: "我六点起床。", explanation: "get up 起床", tag: "副词" }
]

export const listenWordBankG5D1c = [
  { word: "always", options: ["always", "also", "all", "already"], correct: 0, zh: "总是" },
  { word: "usually", options: ["useful", "usually", "usually", "use"], correct: 1, zh: "通常" },
  { word: "often", options: ["often", "open", "over", "after"], correct: 0, zh: "经常" },
  { word: "sometimes", options: ["always", "often", "sometimes", "seldom"], correct: 2, zh: "有时候" },
  { word: "early", options: ["ear", "early", "easily", "each"], correct: 1, zh: "早地" }
]

export const listenSentenceBankG5D1c = [
  { sentence: "I usually go to bed at 9:00.", zh: "我通常在9点睡觉。", options: ["I often go to bed at 9:00.", "I usually go to bed at 9:00.", "I always go to bed at 9:00.", "I usually go to bed at 10:00."], correct: 1 },
  { sentence: "When do you get up?", zh: "你什么时候起床？", options: ["When do you eat breakfast?", "When do you sleep?", "When do you get up?", "When do you go to school?"], correct: 2 },
  { sentence: "Sometimes I go shopping.", zh: "有时我去购物。", options: ["Often I go shopping.", "Usually I go shopping.", "Sometimes I go swimming.", "Sometimes I go shopping."], correct: 3 },
  { sentence: "He always eats an apple.", zh: "他总是吃一个苹果。", options: ["She always eats an apple.", "He usually eats an apple.", "He always eats an apple.", "He always eats a banana."], correct: 2 },
  { sentence: "I am late for school.", zh: "我上学迟到了。", options: ["I am late for class.", "You are late for school.", "I am late for school.", "I am angry for school."], correct: 2 }
]

export const listenOrderBankG5D1c = [
  { sentence: "When do you get up?", zh: "你什么时候起床？", words: ["When", "do", "you", "get", "up?"], answer: ["When", "do", "you", "get", "up?"] },
  { sentence: "I usually get up early.", zh: "我通常起得很早。", words: ["I", "usually", "get", "up", "early."], answer: ["I", "usually", "get", "up", "early."] },
  { sentence: "I always play sports.", zh: "我总是进行体育运动。", words: ["I", "always", "play", "sports."], answer: ["I", "always", "play", "sports."] },
  { sentence: "We sometimes go for a walk.", zh: "我们有时去散步。", words: ["We", "sometimes", "go", "for", "a", "walk."], answer: ["We", "sometimes", "go", "for", "a", "walk."] },
  { sentence: "I am late for school.", zh: "我上学迟到了。", words: ["I", "am", "late", "for", "school."], answer: ["I", "am", "late", "for", "school."] }
]

export const listenResponseBankG5D1c = [
  { question: "When do you get up on Sundays?", zh: "你在星期日什么时候起床？", options: ["I get up at 8:00.", "I usually get up.", "Yes, I do.", "On Sunday."], correct: 0 },
  { question: "Do you always go for a walk?", zh: "你总是去散步吗？", options: ["Yes, I do.", "I go shopping.", "No, it isn't.", "Thank you."], correct: 0 },
  { question: "Why are you late?", zh: "你为什么迟到？", options: ["I got up late.", "I usually go.", "It is 8:00.", "You are fast."], correct: 0 },
  { question: "What do you do after dinner?", zh: "你晚饭后干什么？", options: ["I often watch TV.", "I eat dinner.", "Usually.", "He is ten."], correct: 0 },
  { question: "Wow, you are so early.", zh: "哇，你太早了", options: ["I always get up early.", "Yes, he is.", "To school.", "I can run."], correct: 0 }
]

export const listenTranslateBankG5D1c = [
  { sentence: "I usually get up early.", options: ["我有时晚起。", "我从不早起。", "我通常起得早。", "我总是去得很早。"], correct: 2 },
  { sentence: "Sometimes I go shopping.", options: ["我有时去购物中心。", "我总是去散步。", "他有时去购物。", "有时我去购物。"], correct: 3 },
  { sentence: "He always helps me.", options: ["他有时帮助我。", "她总是帮助我。", "他总是帮助我。", "我总是帮助他。"], correct: 2 },
  { sentence: "I am late for class.", options: ["我错过这节课了。", "我跑步去上课。", "我上课迟到了。", "我上学迟到了。"], correct: 2 },
  { sentence: "When do you start class?", options: ["你们什么时候开始上课？", "你们什么时候放学？", "你们几点去学校？", "你们每天上几节课？"], correct: 0 }
]
