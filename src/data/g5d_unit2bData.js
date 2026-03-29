// PEP五年级下册 Unit 2 Part B《My favourite season》题库
// 主题：季节活动与原因 (go on a picnic, go swimming, pick apples, make a snowman, because) + Why? Because the flowers are pretty.
// 7种题型，每种5题，共35题

export const quizBankG5D2b = [
  { question: "___ do you like autumn best?", chinese: "你为什么最喜欢秋天？", options: ["Why", "What", "When", "Who"], correct: 0, explanation: "提问原因使用 Why。", tag: "疑问词" },
  { question: "___ the weather is cool.", chinese: "因为天气很凉爽。", options: ["Because", "So", "And", "But"], correct: 0, explanation: "回答 Why 一般用 Because。", tag: "连词" },
  { question: "We can go on a ___ in spring.", chinese: "我们可以在春天去野餐。", options: ["picnic", "picture", "pick", "ping-pong"], correct: 0, explanation: "go on a picnic 去野餐。", tag: "固定搭配" },
  { question: "I like winter because I can make a ___.", chinese: "我喜欢冬天因为我能堆雪人。", options: ["snowman", "picnic", "swim", "apple"], correct: 0, explanation: "make a snowman 堆雪人。", tag: "名词" },
  { question: "In autumn, we can pick ___.", chinese: "秋天我们可以摘苹果。", options: ["apples", "snowman", "flowers", "picnic"], correct: 0, explanation: "pick apples 摘苹果。", tag: "动名词与名词搭配" }
]

export const fillblankBankG5D2b = [
  { sentence: "___ (为什么) do you like spring?", answer: "Why", chinese: "你为什么喜欢春天？", explanation: "Why 为什么", tag: "疑问词" },
  { sentence: "___ (因为) I can plant trees.", answer: "Because", chinese: "因为我可以植树。", explanation: "Because 因为", tag: "连词" },
  { sentence: "I often go on a ___ (野餐).", answer: "picnic", chinese: "我经常去野餐。", explanation: "picnic", tag: "名词" },
  { sentence: "Look, they are making a ___ (雪人).", answer: "snowman", chinese: "看，他们在堆雪人。", explanation: "snowman", tag: "名词" },
  { sentence: "I can pick ___ (苹果, 填复数) in autumn.", answer: "apples", chinese: "我在秋天能摘苹果。", explanation: "apples", tag: "名词复数" }
]

export const listenWordBankG5D2b = [
  { word: "because", options: ["before", "because", "behind", "become"], correct: 1, zh: "因为" },
  { word: "picnic", options: ["picture", "pig", "picnic", "pick"], correct: 2, zh: "野餐" },
  { word: "snowman", options: ["snow", "snowman", "snowy", "slowman"], correct: 1, zh: "雪人" },
  { word: "pick", options: ["pig", "pack", "pick", "pink"], correct: 2, zh: "采/摘" },
  { word: "swimming", options: ["swimming", "swinging", "sweet", "swan"], correct: 0, zh: "游泳" }
]

export const listenSentenceBankG5D2b = [
  { sentence: "Why do you like summer?", zh: "你为什么喜欢夏天？", options: ["When do you like summer?", "Why do you like summer?", "What do you like in summer?", "Who likes summer?"], correct: 1 },
  { sentence: "Because I can go swimming.", zh: "因为我能去游泳。", options: ["Because I can go skating.", "Because I can pick apples.", "Because I can go swimming.", "Because I can make a snowman."], correct: 2 },
  { sentence: "We can go on a picnic.", zh: "我们可以去野餐。", options: ["We can go on a trip.", "We can make a snowman.", "We can go on a picnic.", "We can go boating."], correct: 2 },
  { sentence: "I like to pick apples in autumn.", zh: "我喜欢在秋天摘苹果。", options: ["I like to pick oranges.", "I like to eat apples.", "They like to pick apples here.", "I like to pick apples in autumn."], correct: 3 },
  { sentence: "We can make a snowman in winter.", zh: "我们冬天可以堆雪人。", options: ["We can play in the snow.", "We can go skating.", "We can make a snowman in winter.", "You can make a snowman."], correct: 2 }
]

export const listenOrderBankG5D2b = [
  { sentence: "Why do you like autumn?", zh: "你为什么喜欢秋天？", words: ["Why", "do", "you", "like", "autumn?"], answer: ["Why", "do", "you", "like", "autumn?"] },
  { sentence: "Because the weather is cool.", zh: "因为天气很凉爽。", words: ["Because", "the", "weather", "is", "cool."], answer: ["Because", "the", "weather", "is", "cool."] },
  { sentence: "We can go on a picnic.", zh: "我们可以去野餐。", words: ["We", "can", "go", "on", "a", "picnic."], answer: ["We", "can", "go", "on", "a", "picnic."] },
  { sentence: "I can go swimming.", zh: "我可以去游泳。", words: ["I", "can", "go", "swimming."], answer: ["I", "can", "go", "swimming."] },
  { sentence: "I can make a snowman.", zh: "我可以堆雪人。", words: ["I", "can", "make", "a", "snowman."], answer: ["I", "can", "make", "a", "snowman."] }
]

export const listenResponseBankG5D2b = [
  { question: "Why do you like winter?", zh: "你为什么喜欢冬天？", options: ["Because I can sleep all day.", "Because I can make a snowman.", "It is a snowman.", "Yes, I do."], correct: 1 },
  { question: "What can you do in summer?", zh: "你在夏天能做什么？", options: ["I can go swimming.", "Summer is hot.", "I like spring.", "Because it is warm."], correct: 0 },
  { question: "Can we go on a picnic today?", zh: "我们今天能去野餐吗？", options: ["Yes, we can.", "It is winter.", "She is flying.", "Thank you."], correct: 0 },
  { question: "Do you like picking apples?", zh: "你喜欢摘苹果吗？", options: ["Yes, I do.", "Because they are sweet.", "It's autumn.", "I see ten apples."], correct: 0 },
  { question: "Spring is very pretty.", zh: "春天很美。", options: ["Yes, the flowers are beautiful.", "No, it's winter.", "I don't know.", "What a pity."], correct: 0 }
]

export const listenTranslateBankG5D2b = [
  { sentence: "Why do you like spring best?", options: ["你为什么最喜欢春天？", "你为什么喜欢秋天？", "谁最喜欢春天？", "你什么时候去春游？"], correct: 0 },
  { sentence: "Because the flowers are pretty.", options: ["因为草地很绿。", "因为天气暖和。", "因为花儿很美丽。", "因为可以放风筝。"], correct: 2 },
  { sentence: "We can go on a picnic in spring.", options: ["我们在春天种树。", "我们去摘苹果。", "夏天我们可以去游泳。", "我们可以在春天去野餐。"], correct: 3 },
  { sentence: "I can make a snowman.", options: ["我可以打雪仗。", "我可以滑冰。", "我可以堆雪人。", "我喜欢下雪。"], correct: 2 },
  { sentence: "I love to pick apples.", options: ["我喜欢吃苹果", "我喜欢种苹果树。", "我爱摘橘子。", "我很喜欢摘苹果。"], correct: 3 }
]
