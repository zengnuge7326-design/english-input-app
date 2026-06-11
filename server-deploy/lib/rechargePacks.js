/**
 * 充值档位 · 单一来源（修复 shop.js / recharge.js 双定义不一致问题）
 *
 * diamonds: 基础发钻数
 * bonus:    额外赠送（必须真的发出去！）
 * 实际到账 = diamonds + bonus
 *
 * 修改这里 → 商店列表 + 充值发钻 同时生效
 */

const RECHARGE_PACKS = {
  p1:  { id: 'p1',  rmb: 1,  diamonds: 500,   bonus: 0,    tag: null },
  p3:  { id: 'p3',  rmb: 3,  diamonds: 1600,  bonus: 100,  tag: null },
  p10: { id: 'p10', rmb: 10, diamonds: 6000,  bonus: 1000, tag: '最划算' },
  p30: { id: 'p30', rmb: 30, diamonds: 20000, bonus: 5000, tag: null },
}

function getPack(id) {
  return RECHARGE_PACKS[id] || null
}

function listPacks() {
  return Object.values(RECHARGE_PACKS)
}

// 实际发钻总数（基础 + 赠送）
function totalDiamonds(pack) {
  if (!pack) return 0
  return (pack.diamonds || 0) + (pack.bonus || 0)
}

// 反推：给定金钻数量，估算等值 RMB（用于「钻石买会员」时的返佣计算）
// 用最划算档位（¥10 = 7000 颗 含 bonus）作为基准：每颗 ≈ ¥0.00143
function estimateRmbFromDiamonds(diamonds) {
  // 优先按精确档匹配
  for (const p of Object.values(RECHARGE_PACKS)) {
    if (totalDiamonds(p) === diamonds) return p.rmb
  }
  // 找不到精确匹配 → 按最划算档线性折算
  const refPack = RECHARGE_PACKS.p10
  const ratePerDiamond = refPack.rmb / totalDiamonds(refPack)
  return Math.round(diamonds * ratePerDiamond * 100) / 100
}

module.exports = {
  RECHARGE_PACKS,
  getPack,
  listPacks,
  totalDiamonds,
  estimateRmbFromDiamonds,
}
