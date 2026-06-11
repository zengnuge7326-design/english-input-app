import type { AIChatQuestionData } from '../../types'
import {
  assertAichatDialog,
  buildAichatDialog,
  type AichatTurn,
  validateAichatQuestions,
} from '../aichatConstraints'
import { enrichAichatTurns } from '../aichatReplies'

type AichatSceneDef = {
  id: string
  scene: string
  role: 'teacher' | 'student' | 'shop'
  npcName: string
  turns: AichatTurn[]
  closing: string
}

function sceneToQuestion(def: AichatSceneDef): AIChatQuestionData {
  const lines = buildAichatDialog(def.npcName, enrichAichatTurns(def.turns), def.closing)
  assertAichatDialog(lines, def.id)
  return {
    type: 'aichat',
    id: def.id,
    scene: def.scene,
    role: def.role,
    lines,
  }
}

const G3U1_AICHAT_DEFS: AichatSceneDef[] = [
  {
    id: 'g3u1-chat-1',
    scene: 'Morning at school',
    role: 'teacher',
    npcName: 'Teacher',
    turns: [
      { npc: 'Good morning, class! Hello!', you: ['Hello!', 'Goodbye!', 'Close your book.'] },
      { npc: 'I am Miss White. What is your name?', you: ['My name is Mike.', 'I have a pen.', 'Open your bag.'] },
      { npc: 'Nice to meet you, Mike! Show me your pencil.', you: ['OK.', 'Goodbye!', "My name's John."] },
      { npc: 'Good! I have a book. Do you have a book?', you: ['Me too.', 'I have a bag.', 'See you!'] },
      { npc: 'Open your book, please.', you: ['OK.', 'Close your bag.', 'Hello teacher!'] },
      { npc: 'Read with me: Hello!', you: ['Hello!', 'Goodbye!', 'Thank you!'] },
    ],
    closing: 'Very good today. See you tomorrow!',
  },
  {
    id: 'g3u1-chat-2',
    scene: 'Show me your pen',
    role: 'teacher',
    npcName: 'Teacher',
    turns: [
      { npc: 'Hello! Sit down, please.', you: ['OK.', 'Goodbye!', 'My name is John.'] },
      { npc: 'Open your pencil box.', you: ['OK.', 'Close your book.', 'I have a bag.'] },
      { npc: 'Show me your pen, please.', you: ['OK.', 'See you!', 'Hello desk!'] },
      { npc: 'Thank you! Now show me your ruler.', you: ['OK.', 'Goodbye!', 'Me too.'] },
      { npc: 'Good! Close your pencil box.', you: ['OK.', 'Open your book.', 'Carry your bag.'] },
      { npc: 'Put your pen in your bag.', you: ['OK.', 'Hello!', 'Nice to meet you!'] },
    ],
    closing: 'Well done! You are ready for class.',
  },
  {
    id: 'g3u1-chat-3',
    scene: 'What is your name?',
    role: 'student',
    npcName: 'Classmate',
    turns: [
      { npc: "Hi! What's your name?", you: ["My name's Sarah.", 'I have a bag.', 'Close your book.'] },
      { npc: 'Nice to meet you, Sarah!', you: ['Nice to meet you too!', 'Goodbye!', 'Open your book.'] },
      { npc: 'I have a pencil. Do you have a pencil?', you: ['Me too.', 'See you!', 'Hello teacher!'] },
      { npc: 'Show me your eraser.', you: ['OK.', 'Goodbye!', 'My name is Mike.'] },
      { npc: 'I have a crayon too!', you: ['Me too.', 'Close your bag.', 'Carry your bag.'] },
      { npc: 'Let us draw together!', you: ['OK.', 'Goodbye!', 'Open your pencil box.'] },
    ],
    closing: 'Great! You are a good friend.',
  },
  {
    id: 'g3u1-chat-4',
    scene: 'After class',
    role: 'teacher',
    npcName: 'Teacher',
    turns: [
      { npc: 'Close your book, please.', you: ['OK.', 'Hello!', 'My name is John.'] },
      { npc: 'Put your book in your bag.', you: ['OK.', 'Open your book.', 'Me too.'] },
      { npc: 'Close your bag.', you: ['OK.', 'Show me your pen.', 'Hello!'] },
      { npc: 'Carry your bag. Line up!', you: ['OK.', 'Goodbye!', 'I have a ruler.'] },
      { npc: 'Walk quietly to the gate.', you: ['OK.', 'Open your bag.', 'Nice to meet you!'] },
      { npc: 'Class is over. Goodbye!', you: ['Goodbye, teacher!', 'Hello!', 'Open your bag.'] },
    ],
    closing: 'See you tomorrow!',
  },
  {
    id: 'g3u1-chat-c5',
    scene: 'Morning greeting',
    role: 'teacher',
    npcName: 'Teacher',
    turns: [
      { npc: 'Good morning! Hello!', you: ['Hello!', 'Goodbye!', 'Close your book.'] },
      { npc: 'Sit down, please.', you: ['OK.', 'See you!', 'My name is Amy.'] },
      { npc: 'Open your book.', you: ['OK.', 'Goodbye!', 'Carry your bag.'] },
      { npc: 'Show me your pen.', you: ['OK.', 'Hello desk!', 'Me too.'] },
      { npc: 'Read page one with me.', you: ['OK.', 'Close your bag.', 'Good night!'] },
      { npc: 'Stand up and say hello!', you: ['Hello!', 'Goodbye!', 'I have a crayon.'] },
    ],
    closing: 'Good morning work! Sit down.',
  },
  {
    id: 'g3u1-chat-c6',
    scene: 'Open your book',
    role: 'teacher',
    npcName: 'Teacher',
    turns: [
      { npc: 'Hello, class! Are you ready?', you: ['Hello!', 'Goodbye!', 'My name is John.'] },
      { npc: 'Open your book, please.', you: ['OK.', 'Close your bag.', 'See you!'] },
      { npc: 'Point to the picture.', you: ['OK.', 'Goodbye!', 'I have a pen.'] },
      { npc: 'Read the title aloud.', you: ['OK.', 'Open your bag.', 'Me too.'] },
      { npc: 'Circle the word "hello".', you: ['OK.', 'Carry your bag.', 'Good night!'] },
      { npc: 'Close your book now.', you: ['OK.', 'Hello!', 'Show me your ruler.'] },
    ],
    closing: 'Very good! You followed every step.',
  },
  {
    id: 'g3u1-chat-c7',
    scene: 'Close your bag',
    role: 'teacher',
    npcName: 'Teacher',
    turns: [
      { npc: 'Open your bag, please.', you: ['OK.', 'Goodbye!', 'My name is Mike.'] },
      { npc: 'Show me your book.', you: ['OK.', 'See you!', 'Hello desk!'] },
      { npc: 'Put your book in your bag.', you: ['OK.', 'Open your book.', 'Me too.'] },
      { npc: 'Show me your pencil box.', you: ['OK.', 'Goodbye!', 'I have a crayon.'] },
      { npc: 'Put it in your bag too.', you: ['OK.', 'Hello!', 'Carry your bag.'] },
      { npc: 'Close your bag.', you: ['OK.', 'Open your bag.', 'Nice to meet you!'] },
    ],
    closing: 'Thank you. Your bag is tidy now.',
  },
  {
    id: 'g3u1-chat-c8',
    scene: 'I have a ruler',
    role: 'student',
    npcName: 'Classmate',
    turns: [
      { npc: 'Hi! I have a ruler.', you: ['Me too.', 'Goodbye!', "What's your name?"] },
      { npc: 'I have a pencil too.', you: ['Me too.', 'Close your book.', 'See you!'] },
      { npc: 'Show me your eraser.', you: ['OK.', 'Goodbye!', 'My name is John.'] },
      { npc: 'I have a crayon. Do you?', you: ['Me too.', 'Open your bag.', 'Hello teacher!'] },
      { npc: 'Let us draw a line.', you: ['OK.', 'Goodbye!', 'Carry your bag.'] },
      { npc: 'Put your ruler in your bag.', you: ['OK.', 'Hello!', 'Open your book.'] },
    ],
    closing: 'Cool! We have the same things.',
  },
  {
    id: 'g3u1-chat-c9',
    scene: 'Show me your eraser',
    role: 'teacher',
    npcName: 'Teacher',
    turns: [
      { npc: 'Open your pencil box.', you: ['OK.', 'Goodbye!', 'My name is Amy.'] },
      { npc: 'Show me your eraser.', you: ['OK.', 'See you!', 'Hello desk!'] },
      { npc: 'Good! Now show me your pencil.', you: ['OK.', 'Close your bag.', 'Me too.'] },
      { npc: 'Show me your pen.', you: ['OK.', 'Goodbye!', 'Carry your bag.'] },
      { npc: 'Close your pencil box.', you: ['OK.', 'Open your book.', 'Hello!'] },
      { npc: 'Put your pencil box in your bag.', you: ['OK.', 'See you!', 'Nice to meet you!'] },
    ],
    closing: 'Nice eraser! Well done.',
  },
  {
    id: 'g3u1-chat-c10',
    scene: 'Carry your bag',
    role: 'teacher',
    npcName: 'Teacher',
    turns: [
      { npc: 'Close your book, please.', you: ['OK.', 'Hello!', 'My name is John.'] },
      { npc: 'Put your book in your bag.', you: ['OK.', 'Open your book.', 'Goodbye!'] },
      { npc: 'Close your bag.', you: ['OK.', 'Show me your pen.', 'Me too.'] },
      { npc: 'Carry your bag. Let us go.', you: ['OK.', 'Open your book.', 'Hello, teacher!'] },
      { npc: 'Walk to the door quietly.', you: ['OK.', 'Goodbye!', 'I have a ruler.'] },
      { npc: 'Line up at the gate.', you: ['OK.', 'Open your bag.', 'See you!'] },
    ],
    closing: 'Line up! Good job today.',
  },
  {
    id: 'g3u1-chat-c11',
    scene: 'Nice to meet you',
    role: 'student',
    npcName: 'New friend',
    turns: [
      { npc: "Hi! I'm Zoom.", you: ["Hi, I'm Zip.", 'Goodbye!', 'Close your bag.'] },
      { npc: "What's your name?", you: ["My name's Zip.", 'I have a pen.', 'Open your book.'] },
      { npc: 'Nice to meet you!', you: ['Nice to meet you too!', 'Me too.', 'See you!'] },
      { npc: 'I have a pencil. Do you?', you: ['Me too.', 'Goodbye!', 'Carry your bag.'] },
      { npc: 'Show me your book.', you: ['OK.', 'Hello!', 'My name is John.'] },
      { npc: 'Let us read together!', you: ['OK.', 'Goodbye!', 'Close your pencil box.'] },
    ],
    closing: 'Great! We are friends now.',
  },
  {
    id: 'g3u1-chat-c12',
    scene: 'Pencil please',
    role: 'student',
    npcName: 'Classmate',
    turns: [
      { npc: 'I have a pencil. Do you have one?', you: ['Me too.', 'Goodbye!', 'Open your book.'] },
      { npc: 'Show me your pencil.', you: ['OK.', 'See you!', 'Hello teacher!'] },
      { npc: 'I have a pen too.', you: ['Me too.', 'Close your bag.', 'My name is Amy.'] },
      { npc: 'Can I use your eraser?', you: ['OK.', 'Goodbye!', 'Carry your bag.'] },
      { npc: 'Thank you! Here is your eraser.', you: ['Thank you!', 'Hello!', 'Open your bag.'] },
      { npc: 'Put your pencil in your bag.', you: ['OK.', 'Goodbye!', 'Nice to meet you!'] },
    ],
    closing: 'Great! We share our things.',
  },
  {
    id: 'g3u1-chat-c13',
    scene: 'See you after school',
    role: 'teacher',
    npcName: 'Teacher',
    turns: [
      { npc: 'Close your book, please.', you: ['OK.', 'Hello!', 'My name is Mike.'] },
      { npc: 'Put your things in your bag.', you: ['OK.', 'Open your book.', 'Me too.'] },
      { npc: 'Close your bag.', you: ['OK.', 'Show me your pen.', 'Hello!'] },
      { npc: 'Carry your bag to the door.', you: ['OK.', 'Goodbye!', 'I have a ruler.'] },
      { npc: 'Say goodbye to the class.', you: ['Goodbye!', 'Hello!', 'Open your bag.'] },
      { npc: 'Class is over. See you!', you: ['See you, teacher!', 'Hello!', 'Show me your pen.'] },
    ],
    closing: 'Bye! Have a nice afternoon.',
  },
  {
    id: 'g3u1-chat-c14',
    scene: 'What is your name reply',
    role: 'student',
    npcName: 'Visitor',
    turns: [
      { npc: "Hello! What's your name?", you: ["My name's Chen Jie.", 'I have a bag.', 'Close your book.'] },
      { npc: 'Nice name! I am Miss Green.', you: ['Hello, Miss Green!', 'Goodbye!', 'Open your bag.'] },
      { npc: 'What do you have in your bag?', you: ['I have a book.', 'Me too.', 'See you!'] },
      { npc: 'Show me your pencil.', you: ['OK.', 'Goodbye!', 'My name is John.'] },
      { npc: 'Do you like school?', you: ['Yes!', 'Goodbye!', 'Close your bag.'] },
      { npc: 'Say hello to your teacher.', you: ['Hello, teacher!', 'Goodbye!', 'Carry your bag.'] },
    ],
    closing: 'Nice name! Welcome to our school.',
  },
  {
    id: 'g3u1-chat-c15',
    scene: 'Crayon share',
    role: 'student',
    npcName: 'Amy',
    turns: [
      { npc: 'I have a crayon.', you: ['Me too.', 'Goodbye!', 'Carry your bag.'] },
      { npc: 'What colour is yours?', you: ['It is red.', 'I have a bag.', 'Close your book.'] },
      { npc: 'Let us draw a flower!', you: ['OK.', 'Goodbye!', 'My name is John.'] },
      { npc: 'Show me your book.', you: ['OK.', 'See you!', 'Hello teacher!'] },
      { npc: 'I need your eraser.', you: ['OK.', 'Goodbye!', 'Open your bag.'] },
      { npc: 'Thank you! You are kind.', you: ['You are welcome!', 'Goodbye!', 'Me too.'] },
    ],
    closing: 'Let us draw! This is fun.',
  },
  {
    id: 'g3u1-chat-c16',
    scene: 'Book on desk',
    role: 'teacher',
    npcName: 'Teacher',
    turns: [
      { npc: 'Good morning, class!', you: ['Good morning!', 'Goodbye!', 'I have a crayon.'] },
      { npc: 'Open your pencil box, please.', you: ['OK.', 'Close your book.', 'My name is Mike.'] },
      { npc: 'Show me your pencil.', you: ['OK.', 'Goodbye!', 'I have a bag.'] },
      { npc: 'Thank you. Now close your pencil box.', you: ['OK.', 'Hello!', 'Show me your pen.'] },
      { npc: 'Open your book. Let us read.', you: ['OK.', 'Goodbye!', 'Carry your bag.'] },
      { npc: 'Close your book, please.', you: ['OK.', 'Hello!', "My name's Mike."] },
    ],
    closing: 'Good. Put your book in your bag.',
  },
  {
    id: 'g3u1-chat-c17',
    scene: 'Bag check',
    role: 'teacher',
    npcName: 'Teacher',
    turns: [
      { npc: 'Open your bag, please.', you: ['OK.', 'Goodbye!', 'My name is Amy.'] },
      { npc: 'Show me your book.', you: ['OK.', 'See you!', 'Hello!'] },
      { npc: 'Do you have a pencil?', you: ['Yes, I do.', 'Me too.', 'Goodbye!'] },
      { npc: 'Show me your pencil box.', you: ['OK.', 'Close your book.', 'Carry your bag.'] },
      { npc: 'Do you have an eraser?', you: ['Yes, I do.', 'Goodbye!', 'Open your bag.'] },
      { npc: 'Close your bag now.', you: ['OK.', 'Hello!', 'Nice to meet you!'] },
    ],
    closing: 'Thank you! Your bag is ready.',
  },
  {
    id: 'g3u1-chat-c18',
    scene: 'Playground hello',
    role: 'student',
    npcName: 'John',
    turns: [
      { npc: 'Hi! I am John.', you: ["Hi, I'm Sarah.", 'Goodbye!', 'Open your pencil box.'] },
      { npc: "What's your name?", you: ["My name's Sarah.", 'I have a bag.', 'Close your book.'] },
      { npc: 'I have a ball. Let us play!', you: ['OK.', 'Goodbye!', 'Show me your pen.'] },
      { npc: 'Put your bag here.', you: ['OK.', 'Hello teacher!', 'Me too.'] },
      { npc: 'Say hello to my friend Mike.', you: ['Hello, Mike!', 'Goodbye!', 'Open your book.'] },
      { npc: 'Time to go. See you!', you: ['See you!', 'Hello!', 'Carry your bag.'] },
    ],
    closing: 'Let us play! Have fun.',
  },
  {
    id: 'g3u1-chat-c19',
    scene: 'Eraser lost',
    role: 'student',
    npcName: 'Mike',
    turns: [
      { npc: 'I have an eraser. Do you need it?', you: ['Thank you!', 'Goodbye!', 'My name is John.'] },
      { npc: 'Here you are.', you: ['Thank you!', 'See you!', 'Open your bag.'] },
      { npc: 'Can I use your ruler?', you: ['OK.', 'Goodbye!', 'Close your book.'] },
      { npc: 'Thank you! Here is your ruler.', you: ['Thank you!', 'Hello!', 'Me too.'] },
      { npc: 'Let us put them in our bags.', you: ['OK.', 'Goodbye!', 'Show me your pen.'] },
      { npc: 'Close your pencil box.', you: ['OK.', 'Hello teacher!', 'Carry your bag.'] },
    ],
    closing: 'You are welcome! Good friends help each other.',
  },
  {
    id: 'g3u1-chat-c20',
    scene: 'End of Unit 1',
    role: 'teacher',
    npcName: 'Teacher',
    turns: [
      { npc: 'You did great in Unit 1!', you: ['Thank you, teacher!', 'Goodbye bag!', 'Open your name.'] },
      { npc: 'Can you say hello?', you: ['Hello!', 'Goodbye!', 'Close your book.'] },
      { npc: 'What is your name?', you: ['My name is Mike.', 'I have a pen.', 'Me too.'] },
      { npc: 'Show me your book and pen.', you: ['OK.', 'See you!', 'Hello desk!'] },
      { npc: 'Open your bag. What do you have?', you: ['I have a book.', 'Goodbye!', 'My name is John.'] },
      { npc: 'Say goodbye to the class.', you: ['Goodbye!', 'Hello!', 'Open your book.'] },
    ],
    closing: 'Keep learning! See you in Unit 2.',
  },
]

export const G3U1_AICHAT_BANK: AIChatQuestionData[] = G3U1_AICHAT_DEFS.map(sceneToQuestion)

/** 供 bankExtras 兼容旧 scene 结构 */
export const AICHAT_SCENES = G3U1_AICHAT_DEFS.map(def => ({
  id: def.id.replace('g3u1-chat-', ''),
  scene: def.scene,
  role: def.role,
  lines: buildAichatDialog(def.npcName, enrichAichatTurns(def.turns), def.closing),
}))

validateAichatQuestions(G3U1_AICHAT_BANK)
