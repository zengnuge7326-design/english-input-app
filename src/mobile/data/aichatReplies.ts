import type { AichatTurn } from './aichatConstraints'

/** 将过于笼统的「OK.」替换为贴合 NPC 台词的回复，同一场景内尽量不重复 */
export function enrichAichatTurns(turns: AichatTurn[]): AichatTurn[] {
  const used = new Set<string>()
  return turns.map(t => ({
    ...t,
    you: contextualYou(t.npc, t.you, used),
  }))
}

function pickUnused(candidates: string[], used: Set<string>, fallback: string): string {
  const fresh = candidates.find(c => !used.has(c))
  const pick = fresh ?? candidates[0] ?? fallback
  used.add(pick)
  return pick
}

function contextualYou(
  npc: string,
  you: [string, string, string],
  used: Set<string>,
): [string, string, string] {
  const [raw, d1, d2] = you
  if (raw !== 'OK.' && raw !== 'OK') {
    used.add(raw)
    return you
  }

  const n = npc.toLowerCase()
  let primary: string

  if (n.includes('good morning')) {
    primary = pickUnused(['Good morning!', 'Good morning, teacher!'], used, 'Good morning!')
  } else if (n.includes('show me')) {
    primary = pickUnused(['Here you are.', 'OK, here it is.', 'Here!'], used, 'Here you are.')
  } else if (n.includes('open your')) {
    primary = pickUnused(['Yes, teacher.', 'OK, teacher.', 'OK, I will.'], used, 'Yes, teacher.')
  } else if (n.includes('close your')) {
    primary = pickUnused(['OK, teacher.', 'Yes, teacher.', 'OK, I will.'], used, 'OK, teacher.')
  } else if (n.includes('sit down')) {
    primary = pickUnused(['Yes, teacher.', 'OK, teacher.'], used, 'Yes, teacher.')
  } else if (n.includes('put ') && n.includes('bag')) {
    primary = pickUnused(['OK, I will.', 'Yes, teacher.', 'OK, teacher.'], used, 'OK, I will.')
  } else if (n.includes('carry your') || n.includes('line up') || n.includes('walk')) {
    primary = pickUnused(['OK, teacher!', 'Yes, teacher!', 'OK, I will.'], used, 'OK, teacher!')
  } else if (n.includes('let us') || n.includes('let\'s')) {
    primary = pickUnused(['Great!', 'OK!', 'Let us go!'], used, 'Great!')
  } else if (n.includes('read') || n.includes('point') || n.includes('circle')) {
    primary = pickUnused(['OK, teacher.', 'Yes, teacher.', 'OK, I will.'], used, 'OK, teacher.')
  } else if (n.includes('stand up')) {
    primary = pickUnused(['Hello!', 'Hello, teacher!', 'Yes, teacher.'], used, 'Hello!')
  } else if (n.includes('can i use') || n.includes('do you need')) {
    primary = pickUnused(['Sure!', 'Yes, please!', 'Of course!'], used, 'Sure!')
  } else if (n.includes('draw')) {
    primary = pickUnused(['Great!', 'OK!', 'Let us draw!'], used, 'Great!')
  } else if (n.includes('play')) {
    primary = pickUnused(['Great!', 'OK!', 'Let us play!'], used, 'Great!')
  } else if (n.includes('put your bag')) {
    primary = pickUnused(['OK, I will.', 'Yes, teacher.', 'OK, teacher.'], used, 'OK, I will.')
  } else {
    primary = pickUnused(['Yes, teacher.', 'OK, teacher.', 'OK, I will.'], used, 'Yes, teacher.')
  }

  return [primary, d1, d2]
}
