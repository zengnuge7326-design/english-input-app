// PEP四年级下册 Unit 6 Part A《Shopping》题库
// 主题：购物衣物词汇 (gloves, umbrella, sunglasses, scarf) + Can I help you? / Can I try... on?
// 7种题型，每种5题，共35题

export const quizBank6a = [
  { question: "Can I ___ you?", chinese: "我能帮你吗？(售货员用语)", options: ["help", "do", "see", "make"], correct: 0, explanation: "Can I help you? 是商店售货员招呼顾客的常用语。", tag: "交际" },
  { question: "Yes. Can I try these ___?", chinese: "是的。我能试穿这些吗？", options: ["in", "on", "at", "to"], correct: 1, explanation: "试穿是 try on。代词在中间：try these on。", tag: "短语" },
  { question: "They're too ___. I need a small one.", chinese: "它们太大了。我需要一个小一点的。", options: ["small", "big", "cheap", "nice"], correct: 1, explanation: "需要一个小点的，说明现在的'太大' (too big)。", tag: "词汇" },
  { question: "These ___ are nice. I'll take them.", chinese: "这副太阳镜很不错。我买了。", options: ["sunglasses", "sunglass", "umbrella", "scarf"], correct: 0, explanation: "These 后接复数，sunglasses(太阳镜)常以复数形式出现。umbrella和scarf是单数。", tag: "语法" },
  { question: "It's hot outside. Put on your ___.", chinese: "外面很热。戴上你的太阳镜。", options: ["gloves", "sunglasses", "scarf", "coat"], correct: 1, explanation: "热天戴太阳镜 (sunglasses)。手套、围巾、外套是冷天穿的。", tag: "常识" }
]

export const fillblankBank6a = [
  { sentence: "Can I ___ (帮助) you?", answer: "help", chinese: "我能帮助你吗？", explanation: "help 帮助。", tag: "交际" },
  { sentence: "Yes. These ___ (鞋子) are nice.", answer: "shoes", chinese: "是的。这些鞋子很好看。", explanation: "shoes 鞋子。", tag: "词汇" },
  { sentence: "Can I try them ___ (穿/戴上)?", answer: "on", chinese: "我可以试穿它们吗？", explanation: "try...on 试穿。", tag: "短语" },
  { sentence: "They're too ___ (小的).", answer: "small", chinese: "它们太小了。", explanation: "small 小的。", tag: "词汇" },
  { sentence: "Of ___ (当然). Here you are.", answer: "course", chinese: "当然可以。给你。", explanation: "Of course 当然。", tag: "交际" }
]

export const listenWordBank6a = [
  { word: "help", options: ["helmet", "help", "hope", "hello"], correct: 1, zh: "帮助" },
  { word: "gloves", options: ["glass", "gloves", "glue", "globe"], correct: 1, zh: "手套 (复数)" },
  { word: "umbrella", options: ["umbrella", "uncle", "under", "unreal"], correct: 0, zh: "雨伞" },
  { word: "sunglasses", options: ["sun", "glasses", "sunglasses", "sadness"], correct: 2, zh: "太阳镜" },
  { word: "scarf", options: ["scarf", "score", "scary", "scale"], correct: 0, zh: "围巾" }
]

export const listenSentenceBank6a = [
  { sentence: "Can I help you?", zh: "我能帮你吗？", options: ["Can I help you?", "Can you help me?", "Do you help me?", "Can I see you?"], correct: 0 },
  { sentence: "Yes. These shoes are nice.", zh: "是的。这些鞋很好看。", options: ["Yes. These shorts are nice.", "Yes. These shoes are nice.", "Yes. Those shoes are nice.", "Yes. These shirts are nice."], correct: 1 },
  { sentence: "Can I try them on?", zh: "我可以试穿它们吗？", options: ["Can I put them on?", "Can I try it on?", "Can I try them on?", "Can you try them on?"], correct: 2 },
  { sentence: "Size six, please.", zh: "请给我六码的。", options: ["Size seven, please.", "Size six, please.", "Size sixteen, please.", "Size sixty, please."], correct: 1 },
  { sentence: "They're too small.", zh: "它们太小了。", options: ["They're so small.", "They're too big.", "They're too short.", "They're too small."], correct: 3 }
]

export const listenOrderBank6a = [
  { sentence: "Can I help you?", zh: "我能帮你吗？", words: ["Can", "I", "help", "you?"], answer: ["Can", "I", "help", "you?"] },
  { sentence: "These shoes are very nice.", zh: "这些鞋子非常好看。", words: ["These", "shoes", "are", "very", "nice."], answer: ["These", "shoes", "are", "very", "nice."] },
  { sentence: "Can I try them on?", zh: "我可以试穿它们吗？", words: ["Can", "I", "try", "them", "on?"], answer: ["Can", "I", "try", "them", "on?"] },
  { sentence: "They're too big.", zh: "它们太大了。", words: ["They're", "too", "big."], answer: ["They're", "too", "big."] },
  { sentence: "Size six, please.", zh: "请给我六码的。", words: ["Size", "six,", "please."], answer: ["Size", "six,", "please."] }
]

export const listenResponseBank6a = [
  { question: "Can I help you?", zh: "我能帮你吗？", options: ["Yes. These shoes are nice.", "You are helpful.", "I am fine.", "Thank you, you."], correct: 0 },
  { question: "Can I try them on?", zh: "我可以试穿它们吗？", options: ["No, it isn't.", "Of course. Here you are.", "They are shoes.", "You try."], correct: 1 },
  { question: "Are they OK?", zh: "它们合适吗？(大小)", options: ["Yes, it is.", "No, they're too small.", "They are OK.", "They are cheap."], correct: 1 },
  { question: "Whose sunglasses are these?", zh: "这是谁的太阳镜？", options: ["Yes, they are.", "It is big.", "They're John's.", "I like them."], correct: 2 },
  { question: "What is that?", zh: "那是什么？", options: ["It's an umbrella.", "They are gloves.", "Yes, it is.", "I have an umbrella."], correct: 0 }
]

export const listenTranslateBank6a = [
  { sentence: "Can I help you?", options: ["我能帮你吗？", "你能帮我吗？", "你需要帮助吗？", "你会帮忙吗？"], correct: 0 },
  { sentence: "Can I try these on?", options: ["我可以穿上这些吗？", "我可以试试这些吗？", "我可以脱下这些吗？", "我能买这些吗？"], correct: 1 },
  { sentence: "They're too small.", options: ["它们太短了。", "它们太大了。", "它们太小了。", "它们太长了。"], correct: 2 },
  { sentence: "Size seven, please.", options: ["请给我十七码的。", "请给我七码的。", "这是七码的。", "我要买七个。"], correct: 1 },
  { sentence: "These sunglasses are nice.", options: ["这把雨伞很好看。", "这些手套很好看。", "这顶帽子很好看。", "这副太阳镜很好看。"], correct: 3 }
]
