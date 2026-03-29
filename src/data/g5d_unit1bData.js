// PEP五年级下册 Unit 1 Part B《My day》题库
// 主题：日常活动2 (clean my room, go for a walk, go shopping, take a dancing class) + I often clean my room on Saturdays.
// 7种题型，每种5题，共35题

export const quizBankG5D1b = [
  { question: "I often clean ___ room on Saturdays.", chinese: "我经常在周六打扫我的房间。", options: ["my", "me", "I", "mine"], correct: 0, explanation: "my room 我的房间，形容词性物主代词。", tag: "代词" },
  { question: "Sometimes I go ___ a walk.", chinese: "有时候我去散步。", options: ["for", "to", "at", "in"], correct: 0, explanation: "go for a walk 去散步，固定搭配。", tag: "介词" },
  { question: "We go ___ on the weekend.", chinese: "我们在周末去购物。", options: ["shopping", "shop", "to shop", "shops"], correct: 0, explanation: "go shopping 去购物，go + doing 结构。", tag: "动词形式" },
  { question: "I ___ a dancing class on Sundays.", chinese: "我在星期日上舞蹈课。", options: ["take", "taking", "takes", "to take"], correct: 0, explanation: "take a dancing class 上一节舞蹈课。", tag: "动词" },
  { question: "What do you do ___ the weekend?", chinese: "你周末做什么？", options: ["on", "in", "to", "with"], correct: 0, explanation: "在周末一般用介词 on (on the weekend)。", tag: "介词" }
]

export const fillblankBankG5D1b = [
  { sentence: "I often ___ (打扫) my room.", answer: "clean", chinese: "我经常打扫我的房间。", explanation: "clean 打扫", tag: "动词" },
  { sentence: "Let's go ___ (为了...) a walk.", answer: "for", chinese: "我们去散步吧。", explanation: "go for a walk", tag: "介词" },
  { sentence: "I always go ___ (购物).", answer: "shopping", chinese: "我总是去购物。", explanation: "go shopping", tag: "动词形式" },
  { sentence: "I ___ (上) a dancing class.", answer: "take", chinese: "我上舞蹈课。", explanation: "take a class 上课", tag: "动词" },
  { sentence: "___ (有时候) I read books.", answer: "Sometimes", chinese: "有时候我看书。", explanation: "Sometimes 有时候（句首大写）", tag: "副词" }
]

export const listenWordBankG5D1b = [
  { word: "clean", options: ["clear", "clean", "class", "clever"], correct: 1, zh: "打扫/干净的" },
  { word: "walk", options: ["work", "walk", "wake", "wait"], correct: 1, zh: "散步/走" },
  { word: "shopping", options: ["shipping", "hopping", "shopping", "stopping"], correct: 2, zh: "购物" },
  { word: "dancing", options: ["dancing", "doing", "drawing", "driving"], correct: 0, zh: "跳舞" },
  { word: "sometimes", options: ["usually", "often", "sometimes", "always"], correct: 2, zh: "有时候" }
]

export const listenSentenceBankG5D1b = [
  { sentence: "I often clean my room on Saturdays.", zh: "我经常在星期六打扫我的房间。", options: ["I always clean my room on Saturdays.", "I often clean my room on Saturdays.", "I sometimes clean my room on Saturdays.", "I usually clean my room on Sundays."], correct: 1 },
  { sentence: "I usually go for a walk.", zh: "我通常去散步。", options: ["I often go for a walk.", "I always go to work.", "I usually go for a walk.", "I often go for a run."], correct: 2 },
  { sentence: "Let's go shopping.", zh: "我们去购物吧。", options: ["Let's go swimming.", "Let's go fishing.", "Let's go shopping.", "Let's go boating."], correct: 2 },
  { sentence: "I take a dancing class.", zh: "我上了舞蹈课。", options: ["I take an English class.", "I take a swimming class.", "I take an art class.", "I take a dancing class."], correct: 3 },
  { sentence: "Sometimes I play sports.", zh: "有时候我做运动。", options: ["Often I play sports.", "Usually I play sports.", "Sometimes I play sports.", "Always I play sports."], correct: 2 }
]

export const listenOrderBankG5D1b = [
  { sentence: "I often clean my room.", zh: "我经常打扫我的房间。", words: ["I", "often", "clean", "my", "room."], answer: ["I", "often", "clean", "my", "room."] },
  { sentence: "Let's go for a walk.", zh: "我们去散步吧。", words: ["Let's", "go", "for", "a", "walk."], answer: ["Let's", "go", "for", "a", "walk."] },
  { sentence: "I always go shopping.", zh: "我总是去购物。", words: ["I", "always", "go", "shopping."], answer: ["I", "always", "go", "shopping."] },
  { sentence: "I take a dancing class.", zh: "我上舞蹈课。", words: ["I", "take", "a", "dancing", "class."], answer: ["I", "take", "a", "dancing", "class."] },
  { sentence: "Sometimes I wash clothes.", zh: "有时候我洗衣服。", words: ["Sometimes", "I", "wash", "clothes."], answer: ["Sometimes", "I", "wash", "clothes."] }
]

export const listenResponseBankG5D1b = [
  { question: "What do you do on the weekend?", zh: "你周末做什么？", options: ["I often clean my room.", "I have math.", "Yes, I do.", "On Sunday."], correct: 0 },
  { question: "Do you go shopping?", zh: "你去购物吗？", options: ["Yes, I do.", "She cleans her room.", "It's Saturday.", "Welcome."], correct: 0 },
  { question: "When do you take a dancing class?", zh: "你什么时候上舞蹈课？", options: ["At 3:00 on Sunday.", "I'm dancing.", "Yes, he is.", "To the park."], correct: 0 },
  { question: "Let's go for a walk.", zh: "我们去散步吧。", options: ["Great!", "No, I am not.", "On Sunday.", "I'm tall."], correct: 0 },
  { question: "You are so busy.", zh: "你太忙了。", options: ["Yes, I am.", "She wants to go.", "I have an apple.", "Thanks."], correct: 0 }
]

export const listenTranslateBankG5D1b = [
  { sentence: "I often clean my room on Saturdays.", options: ["我经常在周日打扫房间。", "我经常在周六打扫房间。", "我周末洗衣服。", "我总是在星期六打扫我的房间。"], correct: 1 },
  { sentence: "I usually go for a walk.", options: ["我通常去跑步。", "我经常去购物。", "我通常去散步。", "他有时去散步。"], correct: 2 },
  { sentence: "We go shopping on Sundays.", options: ["我们星期一去买东西。", "我们星期六去购物。", "我们星期日去购物。", "我们通常去购物。"], correct: 2 },
  { sentence: "I take a dancing class.", options: ["我教舞蹈课。", "我在上舞蹈课。", "她上英语课。", "我在做早操。"], correct: 1 },
  { sentence: "Sometimes I play sports.", options: ["经常我踢足球。", "我每天都锻炼。", "有时她运动。", "有时候我做体育运动。"], correct: 3 }
]
