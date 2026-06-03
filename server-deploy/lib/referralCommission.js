/**
 * 推荐返佣 · 创始成员邀请好友购会员
 * 比例：40%（原 30%）
 *
 * 部署：复制到线上 API 的 lib/referralCommission.js，在支付成功回调中：
 *   const { creditReferralCommission } = require('./lib/referralCommission')
 *   await creditReferralCommission(pool, { buyerUserId, paidRmb, orderId, plan })
 *
 * 并在 routes/referral.js（或 payment.js）里把所有 0.3 / 30% 计算改为引用本模块。
 */

const REFERRAL_COMMISSION_RATE = 0.4

/**
 * @param {import('mysql2/promise').Pool} pool
 * @param {{ buyerUserId: number, paidRmb: number|string, orderId: string, plan?: string }} opts
 */
async function creditReferralCommission(pool, { buyerUserId, paidRmb, orderId, plan }) {
  const [[buyer]] = await pool.execute(
    'SELECT referred_by FROM users WHERE id = ? LIMIT 1',
    [buyerUserId]
  )
  const referrerId = buyer?.referred_by
  if (!referrerId) return null

  const rmb = Number(paidRmb)
  if (!Number.isFinite(rmb) || rmb <= 0) return null

  const commission = Math.round(rmb * REFERRAL_COMMISSION_RATE * 100) / 100
  if (commission <= 0) return null

  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    await conn.execute(
      `INSERT INTO referral_commissions (referrer_id, referred_user_id, order_id, plan, amount, rate)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [referrerId, buyerUserId, orderId, plan || null, commission, REFERRAL_COMMISSION_RATE]
    )
    await conn.execute(
      'UPDATE users SET commission_total = COALESCE(commission_total, 0) + ? WHERE id = ?',
      [commission, referrerId]
    )
    await conn.commit()
    return { referrerId, commission, rate: REFERRAL_COMMISSION_RATE }
  } catch (e) {
    await conn.rollback()
    throw e
  } finally {
    conn.release()
  }
}

module.exports = {
  REFERRAL_COMMISSION_RATE,
  REFERRAL_COMMISSION_PERCENT: Math.round(REFERRAL_COMMISSION_RATE * 100),
  creditReferralCommission,
}
