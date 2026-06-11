/**
 * rewardRules.js — 全站唯一奖励标准
 *
 * 所有学习模块（桌面 + 手机）都从这里取数值，不允许私自定义。
 *
 * 标准（2026-06-11 定）：
 *   XP：
 *     每答对 1 题            +1
 *     整组/整课全对          +5（额外）
 *     完成一组/一课          +2（保底，无论对错）
 *     单元/关卡首次通关       +5（额外）
 *   水晶：
 *     完成一组/一课          +1 蓝
 *     整组零错误             +1 绿
 *     连击 5 题             +1 紫（每组最多 1 次）
 *     首次通关单元/大关       +1 蓝（额外）
 *     大成就（全册/全部掌握）  +3 金
 */

export const XP = {
  PER_CORRECT: 1,
  GROUP_DONE: 2,
  GROUP_PERFECT: 5,
  FIRST_CLEAR: 5,
}

export const GEM = {
  GROUP_DONE: { color: 'blue', amount: 1, reason: 'group_done' },
  GROUP_PERFECT: { color: 'green', amount: 1, reason: 'zero_error' },
  COMBO_5: { color: 'purple', amount: 1, reason: 'combo_5' },
  FIRST_CLEAR: { color: 'blue', amount: 1, reason: 'first_clear' },
  GRAND: { color: 'gold', amount: 3, reason: 'grand_achievement' },
}

/**
 * 一组练习结束时的标准结算。
 * @param {object} ctx { correct, total, firstClear?, comboMax? }
 * @returns {{ xp: number, gems: Array<{color, amount, reason}> }}
 */
export function settleGroup({ correct = 0, total = 0, firstClear = false, comboMax = 0 }) {
  const perfect = total > 0 && correct === total
  let xp = correct * XP.PER_CORRECT + XP.GROUP_DONE
  if (perfect) xp += XP.GROUP_PERFECT
  if (firstClear) xp += XP.FIRST_CLEAR

  const gems = [GEM.GROUP_DONE]
  if (perfect) gems.push(GEM.GROUP_PERFECT)
  if (comboMax >= 5) gems.push(GEM.COMBO_5)
  if (firstClear) gems.push(GEM.FIRST_CLEAR)
  return { xp, gems }
}
