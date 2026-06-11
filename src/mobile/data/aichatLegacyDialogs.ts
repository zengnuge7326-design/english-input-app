import type { AIChatQuestionData } from '../types'
import { buildAichatDialog, validateAichatQuestions } from './aichatConstraints'
import { enrichAichatTurns } from './aichatReplies'

function legacy(
  id: string,
  scene: string,
  role: AIChatQuestionData['role'],
  npcName: string,
  turns: Parameters<typeof buildAichatDialog>[1],
  closing: string,
): AIChatQuestionData {
  return {
    type: 'aichat',
    id,
    scene,
    role,
    lines: buildAichatDialog(npcName, enrichAichatTurns(turns), closing),
  }
}

/** 旧课程节点中的对话题，统一扩展为 6 轮以上 */
export const LEGACY_AICHAT = {
  u1l1: legacy('q6', 'Morning at school gate', 'teacher', 'Teacher', [
    { npc: 'Good morning! Welcome to our school!', you: ['Good morning!', 'Good night!', 'Goodbye!'] },
    { npc: 'I am Miss Wang. What is your name?', you: ['My name is Lily.', 'I am fine.', 'Hello desk!'] },
    { npc: 'Hello, Lily! Nice to meet you.', you: ['Nice to meet you too!', 'I am ten.', 'Good morning desk!'] },
    { npc: 'How are you today?', you: ['I am fine, thank you.', 'My name is Lily.', 'Goodbye!'] },
    { npc: 'Show me your bag.', you: ['OK.', 'See you!', 'Open your book.'] },
    { npc: 'Open your bag, please.', you: ['OK.', 'Goodbye!', 'Me too.'] },
  ], 'Great! Welcome to Class One. Have a nice day!'),

  u1l2: legacy('q6', 'New classmate', 'student', 'Classmate', [
    { npc: 'Hi! I am Ben. Who are you?', you: ['I am Lucy.', 'I am desk.', 'Good night!'] },
    { npc: 'Nice to meet you, Lucy!', you: ['Nice to meet you too!', 'Goodbye!', 'Open your book.'] },
    { npc: 'I have a pencil. Do you?', you: ['Me too.', 'See you!', 'Hello teacher!'] },
    { npc: 'Show me your book.', you: ['OK.', 'Goodbye!', 'My name is Ben.'] },
    { npc: 'Let us sit together.', you: ['OK.', 'Carry your bag.', 'Close your pencil box.'] },
    { npc: 'See you after class!', you: ['See you!', 'Hello!', 'Open your bag.'] },
  ], 'Great! We are classmates now.'),

  u1l3: legacy('q6', 'After school', 'teacher', 'Teacher', [
    { npc: 'Close your book, please.', you: ['OK.', 'Hello!', 'My name is John.'] },
    { npc: 'Put your book in your bag.', you: ['OK.', 'Open your book.', 'Me too.'] },
    { npc: 'Close your bag.', you: ['OK.', 'Show me your pen.', 'Hello!'] },
    { npc: 'It is 5 p.m. Time to go home.', you: ['OK.', 'Open your bag.', 'Nice to meet you!'] },
    { npc: 'Carry your bag to the gate.', you: ['OK.', 'Goodbye!', 'I have a ruler.'] },
    { npc: 'What do you say?', you: ['Goodbye, teacher!', 'Good morning!', 'Open the door.'] },
  ], 'Goodbye! See you tomorrow!'),

  u1l4: legacy('q6', 'Playground', 'student', 'Classmate', [
    { npc: 'Hi! How are you today?', you: ['I am fine, thanks!', 'I am a desk.', 'Good night!'] },
    { npc: 'I am happy too!', you: ['Me too.', 'Goodbye!', 'Close your book.'] },
    { npc: 'I have a ball. Let us play!', you: ['OK.', 'See you!', 'Open your bag.'] },
    { npc: 'Put your bag here.', you: ['OK.', 'Hello teacher!', 'My name is John.'] },
    { npc: 'Run and say hello!', you: ['Hello!', 'Goodbye!', 'Show me your pen.'] },
    { npc: 'Time to go back to class.', you: ['OK.', 'Goodbye!', 'Carry your bag.'] },
  ], 'Great! Let us play!'),

  u1boss: legacy('q7', 'Unit 1 final chat', 'teacher', 'Teacher', [
    { npc: 'You finished Unit 1! Can you introduce yourself?', you: ['Hello! I am Tom.', 'I am a chair.', 'Goodbye desk!'] },
    { npc: 'What is your name?', you: ['My name is Tom.', 'I have a pen.', 'Me too.'] },
    { npc: 'Show me your book and pencil.', you: ['OK.', 'See you!', 'Hello desk!'] },
    { npc: 'Open your bag. What do you have?', you: ['I have a book.', 'Goodbye!', 'Open your name.'] },
    { npc: 'Say hello to the class.', you: ['Hello!', 'Goodbye!', 'Close your bag.'] },
    { npc: 'Say goodbye politely.', you: ['Goodbye, teacher!', 'Hello!', 'Open your book.'] },
  ], 'Excellent! You pass the boss level!'),

  u1reward: legacy('q4', 'Treasure chest', 'shop', 'Shop assistant', [
    { npc: 'Welcome! You earned a treasure chest.', you: ['Super!', 'I want homework.', 'Bye desk.'] },
    { npc: 'Pick a gift word!', you: ['Hello!', 'Goodbye bag!', 'Open your name.'] },
    { npc: 'Do you want a golden star?', you: ['Yes, please!', 'Goodbye!', 'Close your book.'] },
    { npc: 'Say thank you nicely.', you: ['Thank you!', 'Hello desk!', 'Me too.'] },
    { npc: 'Carry your gift home.', you: ['OK.', 'Goodbye!', 'Show me your pen.'] },
    { npc: 'Wave and say goodbye.', you: ['Goodbye!', 'Hello!', 'Open your bag.'] },
  ], 'Here is +30 XP and a golden star!'),

  u2l1: legacy('q6', 'In the classroom', 'teacher', 'Teacher', [
    { npc: 'Open your book, please.', you: ['OK.', 'Goodbye!', 'My name is John.'] },
    { npc: 'What is this on your desk?', you: ['It is a pencil.', 'It is a run.', 'Good night!'] },
    { npc: 'Good! Show me your ruler.', you: ['OK.', 'See you!', 'Hello desk!'] },
    { npc: 'Put your pencil in your bag.', you: ['OK.', 'Goodbye!', 'Me too.'] },
    { npc: 'Close your book.', you: ['OK.', 'Hello!', 'Open your bag.'] },
    { npc: 'Please put it in your bag.', you: ['OK.', 'Goodbye!', 'Carry your bag.'] },
  ], 'Good! Your desk is tidy now.'),

  u2l2: legacy('q6', 'PE class', 'teacher', 'Teacher', [
    { npc: 'Stand up, please.', you: ['OK.', 'Goodbye!', 'My name is Amy.'] },
    { npc: 'Boys and girls, line up!', you: ['OK, teacher!', 'I am a desk.', 'Goodbye apple!'] },
    { npc: 'Carry nothing. Hands on your sides.', you: ['OK.', 'Open your book.', 'See you!'] },
    { npc: 'Walk to the playground.', you: ['OK.', 'Goodbye!', 'Show me your pen.'] },
    { npc: 'Say hello to Coach Li.', you: ['Hello, Coach Li!', 'Goodbye!', 'Close your bag.'] },
    { npc: 'Sit down and rest.', you: ['OK.', 'Hello!', 'Open your bag.'] },
  ], 'Good job! PE class is fun.'),

  u2l3: legacy('q6', 'Borrowing stationery', 'student', 'Classmate', [
    { npc: 'I forgot my pen. Can you help me?', you: ['Here you are.', 'I am a pen.', 'Stand down please.'] },
    { npc: 'Thank you so much!', you: ['You are welcome!', 'Goodbye!', 'Open your book.'] },
    { npc: 'Can I use your ruler?', you: ['OK.', 'See you!', 'Hello teacher!'] },
    { npc: 'Here is your ruler back.', you: ['Thank you!', 'Goodbye!', 'My name is John.'] },
    { npc: 'Do you need an eraser?', you: ['Yes, please.', 'Goodbye!', 'Carry your bag.'] },
    { npc: 'Put everything in your bag.', you: ['OK.', 'Hello!', 'Me too.'] },
  ], 'Thank you so much! You are a good friend.'),

  u2l4: legacy('q6', 'End of class', 'teacher', 'Teacher', [
    { npc: 'Close your book, please.', you: ['OK.', 'Hello!', 'My name is Mike.'] },
    { npc: 'Put your homework in your bag.', you: ['OK.', 'Open your book.', 'Me too.'] },
    { npc: 'Close your bag.', you: ['OK.', 'Show me your pen.', 'Hello!'] },
    { npc: 'Line up at the door.', you: ['OK.', 'Goodbye!', 'I have a ruler.'] },
    { npc: 'Class is over. What do you say?', you: ['Goodbye, teacher!', 'Open the desk.', 'This is a run.'] },
    { npc: 'Walk quietly to the gate.', you: ['OK.', 'Hello!', 'Open your bag.'] },
  ], 'Goodbye! See you tomorrow.'),

  u2boss: legacy('q7', 'Unit 2 boss chat', 'teacher', 'Teacher', [
    { npc: 'Ready for the school life test?', you: ['Yes, I am ready!', 'I am a pencil.', 'Good night teacher desk.'] },
    { npc: 'Open your book to page one.', you: ['OK.', 'Goodbye!', 'My name is John.'] },
    { npc: 'Show me your pen and ruler.', you: ['OK.', 'See you!', 'Hello desk!'] },
    { npc: 'Close your bag and stand up.', you: ['OK.', 'Goodbye!', 'Me too.'] },
    { npc: 'Say hello to a new classmate.', you: ['Hello!', 'Goodbye!', 'Open your name.'] },
    { npc: 'Say goodbye to end the test.', you: ['Goodbye, teacher!', 'Hello!', 'Carry your bag.'] },
  ], 'Great job! You pass Unit 2!'),

  u2reward: legacy('q4', 'School treasure shop', 'shop', 'Shop assistant', [
    { npc: 'You finished School Life Island! Pick a badge.', you: ['Awesome!', 'I want a desk.', 'Bye pencil.'] },
    { npc: 'Do you want the golden backpack badge?', you: ['Yes, please!', 'Goodbye!', 'Open your book.'] },
    { npc: 'Say thank you.', you: ['Thank you!', 'Hello desk!', 'Me too.'] },
    { npc: 'Show me your school bag.', you: ['OK.', 'Goodbye!', 'My name is John.'] },
    { npc: 'Put the badge on your bag.', you: ['OK.', 'See you!', 'Close your pencil box.'] },
    { npc: 'Wave goodbye to the shop.', you: ['Goodbye!', 'Hello!', 'Open your bag.'] },
  ], 'Here is your golden backpack badge!'),
} as const satisfies Record<string, AIChatQuestionData>

validateAichatQuestions(Object.values(LEGACY_AICHAT))
