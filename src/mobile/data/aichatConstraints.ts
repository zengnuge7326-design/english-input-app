import type { AIChatQuestionData } from '../types'

/** 对话题型：用户至少作答（选择回复）的轮数 */
export const MIN_AICHAT_USER_TURNS = 6

export type AichatLine = AIChatQuestionData['lines'][number]

export type AichatTurn = {
  npc: string
  /** 三个选项，第一项为推荐正确回复 */
  you: [string, string, string]
}

export function countAichatUserTurns(lines: AichatLine[]): number {
  return lines.filter(l => l.speaker === 'You' && (l.choices?.length ?? 0) > 0).length
}

export function assertAichatDialog(lines: AichatLine[], id = 'aichat') {
  const n = countAichatUserTurns(lines)
  if (n < MIN_AICHAT_USER_TURNS) {
    throw new Error(`[aichat] ${id}: ${n} user turns, minimum ${MIN_AICHAT_USER_TURNS}`)
  }
}

export function validateAichatQuestions(questions: AIChatQuestionData[]) {
  for (const q of questions) {
    assertAichatDialog(q.lines, q.id)
  }
}

export function npc(speaker: string, text: string): AichatLine {
  return { speaker, text }
}

export function you(...choices: [string, string, string]): AichatLine {
  return { speaker: 'You', text: '', choices }
}

/** 按「NPC 一句 → 你选一句」交替拼装，至少 6 轮用户作答 */
export function buildAichatDialog(
  npcName: string,
  turns: AichatTurn[],
  closing: string,
): AichatLine[] {
  if (turns.length < MIN_AICHAT_USER_TURNS) {
    throw new Error(`buildAichatDialog: need ${MIN_AICHAT_USER_TURNS}+ turns`)
  }
  const lines: AichatLine[] = []
  for (const t of turns) {
    lines.push(npc(npcName, t.npc))
    lines.push(you(...t.you))
  }
  lines.push(npc(npcName, closing))
  return lines
}
