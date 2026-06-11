/**
 * 推荐返佣 · 创始成员邀请好友购会员
 * 比例：40% · 状态：pending → settled (30天后) → paid (人工结账)
 *
 * 部署：复制到线上 API 的 lib/referralCommission.js，在支付成功回调中：
 *   const { creditReferralCommission } = require('./lib/referralCommission')
 *   await creditReferralCommission(pool, { buyerUserId, paidRmb, orderId, plan })
 */

const REFERRAL_COMMISSION_RATE = 0.4
const COOLDOWN_DAYS = 30  // 退款窗口期，结束后才能进入「待付」

/**
 * 充值成功 → 给推荐人记一笔佣金（pending 状态，30 天冷静期）
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
    // 幂等：同一 order_id 已记录就跳过
    const [exist] = await conn.execute(
      'SELECT id FROM referral_commissions WHERE order_id = ? LIMIT 1',
      [orderId]
    )
    if (exist.length > 0) {
      await conn.commit()
      return { skipped: 'duplicate_order' }
    }
    // 新记录：pending + 冷静期
    await conn.execute(
      `INSERT INTO referral_commissions
        (referrer_id, referred_user_id, order_id, plan, amount, rate,
         status, cooldown_until)
       VALUES (?, ?, ?, ?, ?, ?, 'pending',
         DATE_ADD(NOW(), INTERVAL ? DAY))`,
      [referrerId, buyerUserId, orderId, plan || null, commission, REFERRAL_COMMISSION_RATE, COOLDOWN_DAYS]
    )
    // commission_total 只在 status='paid' 时累加（之前是预扣）
    // 这里不动 users.commission_total，由结算流程负责
    await conn.commit()
    return { referrerId, commission, rate: REFERRAL_COMMISSION_RATE, cooldownDays: COOLDOWN_DAYS }
  } catch (e) {
    await conn.rollback()
    throw e
  } finally {
    conn.release()
  }
}

/**
 * 退款冲销：把对应订单的佣金置为 reversed（不论当前状态）
 * 在支付平台 refund 回调里调用。
 */
async function reverseReferralCommission(pool, { orderId, adminUser = 'system', note = '' }) {
  const [rows] = await pool.execute(
    'SELECT id, status, amount FROM referral_commissions WHERE order_id = ? LIMIT 1',
    [orderId]
  )
  if (rows.length === 0) return null
  const row = rows[0]
  if (row.status === 'reversed') return { alreadyReversed: true }
  await pool.execute(
    `UPDATE referral_commissions
     SET status='reversed', paid_txn_note=CONCAT(IFNULL(paid_txn_note,''),' [reversed:',?,']')
     WHERE id = ?`,
    [note || 'refund', row.id]
  )
  // 审计
  await pool.execute(
    `INSERT INTO admin_audit_log (admin_user, action, target_type, target_id, details)
     VALUES (?, 'reverse', 'commission', ?, JSON_OBJECT('order_id', ?, 'amount', ?, 'note', ?))`,
    [adminUser, row.id, orderId, row.amount, note]
  )
  return { reversed: true, id: row.id, amount: row.amount }
}

module.exports = {
  REFERRAL_COMMISSION_RATE,
  REFERRAL_COMMISSION_PERCENT: Math.round(REFERRAL_COMMISSION_RATE * 100),
  COOLDOWN_DAYS,
  creditReferralCommission,
  reverseReferralCommission,
}
