/**
 * 推荐返佣 · 管理 / 结算路由 (Phase 1)
 *
 * 挂载：在 index.js 末尾
 *   require('./routes/referralAdmin')({ app, pool })
 *
 * 环境变量：
 *   ADMIN_API_KEY — 长随机字符串，用作管理员鉴权（与登录 token 区分）
 *                  设置示例：ADMIN_API_KEY=$(openssl rand -hex 32) pm2 restart okenglish-api --update-env
 *
 * 路由：
 *   POST /api/admin/commission/promote-pending
 *     —— 把冷静期已过的 pending 转为 settled。建议每日 cron 一次。
 *   GET  /api/admin/commission/list?status=settled
 *     —— 列出某状态的所有佣金记录
 *   POST /api/admin/commission/mark-paid
 *     body: { ids:[1,2,3], pay_method:'wechat', txn_note:'转账截图URL', amount_check:85.00 }
 *     —— 批量标记已付。amount_check 必填，等于这批记录金额合计，否则报错（防误操作）
 *   POST /api/admin/commission/flag
 *     body: { ids:[...], reason:'同IP多人注册' }
 *     —— 把记录标 suspicious
 *
 * 也支持创始会员自己查（无需 ADMIN_API_KEY，复用 auth）：
 *   GET /api/referral/v2/my-summary
 *   GET /api/referral/v2/my-invitees
 *   GET /api/referral/v2/my-commissions
 */

module.exports = function mountReferralAdmin({ app, pool, auth }) {
  const ADMIN_KEY = process.env.ADMIN_API_KEY || ''

  function adminAuth(req, res, next) {
    if (!ADMIN_KEY) return res.status(503).json({ ok: false, error: 'admin_not_configured' })
    const key = req.headers['x-admin-key'] || req.query.admin_key
    if (key !== ADMIN_KEY) return res.status(403).json({ ok: false, error: 'forbidden' })
    req.adminUser = req.headers['x-admin-user'] || 'admin'
    next()
  }

  async function audit({ adminUser, action, targetType, targetId, details, ip }) {
    try {
      await pool.execute(
        `INSERT INTO admin_audit_log (admin_user, action, target_type, target_id, details, ip)
         VALUES (?, ?, ?, ?, CAST(? AS JSON), ?)`,
        [adminUser || 'admin', action, targetType || null, targetId || null,
          JSON.stringify(details || {}), ip || null]
      )
    } catch (e) {
      console.error('[audit] write failed:', e.message)
    }
  }

  // ═══ Admin: 冷静期到期自动晋级 ═════════════════════════════════
  app.post('/api/admin/commission/promote-pending', adminAuth, async (req, res) => {
    try {
      const [r] = await pool.execute(
        `UPDATE referral_commissions
         SET status='settled', settled_at=NOW()
         WHERE status='pending' AND cooldown_until <= NOW()`
      )
      await audit({
        adminUser: req.adminUser,
        action: 'promote_pending',
        details: { affected: r.affectedRows },
        ip: req.ip,
      })
      res.json({ ok: true, promoted: r.affectedRows })
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message })
    }
  })

  // ═══ Admin: 列出某状态记录 ═════════════════════════════════════
  app.get('/api/admin/commission/list', adminAuth, async (req, res) => {
    const status = req.query.status || 'settled'
    const limit = Math.min(500, Number(req.query.limit) || 200)
    try {
      const [rows] = await pool.execute(
        `SELECT c.id, c.referrer_id, ru.username AS referrer_name,
                c.referred_user_id, iu.username AS invitee_name,
                c.order_id, c.plan, c.amount, c.rate, c.status,
                c.cooldown_until, c.created_at, c.settled_at,
                c.paid_at, c.paid_method, c.paid_txn_note, c.paid_by_admin
         FROM referral_commissions c
         LEFT JOIN users ru ON ru.id = c.referrer_id
         LEFT JOIN users iu ON iu.id = c.referred_user_id
         WHERE c.status = ?
         ORDER BY c.created_at DESC
         LIMIT ?`,
        [status, limit]
      )
      const total = rows.reduce((s, r) => s + Number(r.amount), 0)
      res.json({ ok: true, status, count: rows.length, total: Math.round(total * 100) / 100, items: rows })
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message })
    }
  })

  // ═══ Admin: 批量标记已付 ═════════════════════════════════════
  // body: { ids, pay_method, txn_note, amount_check }
  app.post('/api/admin/commission/mark-paid', adminAuth, async (req, res) => {
    const { ids = [], pay_method, txn_note = '', amount_check } = req.body || {}
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ ok: false, error: 'ids_required' })
    }
    if (!pay_method) return res.status(400).json({ ok: false, error: 'pay_method_required' })
    if (amount_check == null) return res.status(400).json({ ok: false, error: 'amount_check_required' })

    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
      // 锁行 + 校验
      const placeholders = ids.map(() => '?').join(',')
      const [rows] = await conn.execute(
        `SELECT id, referrer_id, amount, status FROM referral_commissions
         WHERE id IN (${placeholders}) FOR UPDATE`,
        ids
      )
      if (rows.length !== ids.length) {
        await conn.rollback()
        return res.status(400).json({ ok: false, error: 'some_ids_missing', got: rows.length, want: ids.length })
      }
      const notSettled = rows.filter(r => r.status !== 'settled')
      if (notSettled.length > 0) {
        await conn.rollback()
        return res.status(400).json({
          ok: false, error: 'some_not_settled',
          bad: notSettled.map(r => ({ id: r.id, status: r.status }))
        })
      }
      const total = Math.round(rows.reduce((s, r) => s + Number(r.amount), 0) * 100) / 100
      if (Math.abs(total - Number(amount_check)) > 0.01) {
        await conn.rollback()
        return res.status(400).json({ ok: false, error: 'amount_mismatch', expected: total, got: amount_check })
      }
      // 批量更新
      await conn.execute(
        `UPDATE referral_commissions
         SET status='paid', paid_at=NOW(),
             paid_method=?, paid_txn_note=?, paid_by_admin=?
         WHERE id IN (${placeholders})`,
        [pay_method, txn_note, req.adminUser, ...ids]
      )
      // 同步 users.commission_total（仅累加已 paid 的）
      const grouped = rows.reduce((acc, r) => {
        acc[r.referrer_id] = (acc[r.referrer_id] || 0) + Number(r.amount)
        return acc
      }, {})
      for (const [uid, amt] of Object.entries(grouped)) {
        await conn.execute(
          'UPDATE users SET commission_total = COALESCE(commission_total,0) + ? WHERE id = ?',
          [Math.round(amt * 100) / 100, Number(uid)]
        )
      }
      await conn.commit()
      // 审计（单独事务外）
      await audit({
        adminUser: req.adminUser,
        action: 'mark_paid',
        targetType: 'commission_batch',
        details: { ids, total, pay_method, txn_note, byReferrer: grouped },
        ip: req.ip,
      })
      res.json({ ok: true, paid: ids.length, total, byReferrer: grouped })
    } catch (err) {
      await conn.rollback()
      console.error('[mark-paid] error:', err)
      res.status(500).json({ ok: false, error: err.message })
    } finally {
      conn.release()
    }
  })

  // ═══ Admin: flag 可疑 ═══════════════════════════════════════
  app.post('/api/admin/commission/flag', adminAuth, async (req, res) => {
    const { ids = [], reason = '' } = req.body || {}
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ ok: false, error: 'ids_required' })
    }
    try {
      const placeholders = ids.map(() => '?').join(',')
      const [r] = await pool.execute(
        `UPDATE referral_commissions
         SET status='suspicious', paid_txn_note=CONCAT(IFNULL(paid_txn_note,''),' [flag:',?,']')
         WHERE id IN (${placeholders})`,
        [reason, ...ids]
      )
      await audit({
        adminUser: req.adminUser,
        action: 'flag',
        targetType: 'commission_batch',
        details: { ids, reason, affected: r.affectedRows },
        ip: req.ip,
      })
      res.json({ ok: true, affected: r.affectedRows })
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message })
    }
  })

  // ═══ Founder: 我的概况（透明化） ════════════════════════════════
  app.get('/api/referral/v2/my-summary', auth, async (req, res) => {
    const uid = req.user?.id
    if (!uid) return res.status(401).json({ ok: false })
    try {
      // 按状态汇总
      const [agg] = await pool.execute(
        `SELECT status, COUNT(*) AS n, COALESCE(SUM(amount),0) AS total
         FROM referral_commissions
         WHERE referrer_id = ?
         GROUP BY status`,
        [uid]
      )
      const byStatus = { pending: 0, settled: 0, paid: 0, reversed: 0, suspicious: 0 }
      const countByStatus = { pending: 0, settled: 0, paid: 0, reversed: 0, suspicious: 0 }
      agg.forEach(r => {
        byStatus[r.status] = Number(r.total)
        countByStatus[r.status] = Number(r.n)
      })
      // 邀请人数
      const [[invCount]] = await pool.execute(
        'SELECT COUNT(*) AS n FROM referral_relationships WHERE inviter_user_id = ? AND status="active"',
        [uid]
      )
      // 付费转化人数
      const [[paidCount]] = await pool.execute(
        `SELECT COUNT(DISTINCT referred_user_id) AS n
         FROM referral_commissions
         WHERE referrer_id = ? AND status IN ('settled','paid')`,
        [uid]
      )
      res.json({
        ok: true,
        invited: invCount.n,
        paid_invitees: paidCount.n,
        pending: { amount: byStatus.pending, count: countByStatus.pending, hint: '冷静期内（30天后转待付）' },
        settled: { amount: byStatus.settled, count: countByStatus.settled, hint: '待付款（等管理员转账）' },
        paid:    { amount: byStatus.paid,    count: countByStatus.paid,    hint: '已付' },
        reversed: byStatus.reversed,
      })
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message })
    }
  })

  // ═══ Founder: 我的邀请记录（脱敏）═══════════════════════════════
  app.get('/api/referral/v2/my-invitees', auth, async (req, res) => {
    const uid = req.user?.id
    if (!uid) return res.status(401).json({ ok: false })
    try {
      const [rows] = await pool.execute(
        `SELECT r.invitee_user_id, r.created_at, r.status AS rel_status,
                u.username, u.is_member,
                (SELECT SUM(amount) FROM referral_commissions
                  WHERE referrer_id = ? AND referred_user_id = u.id AND status IN ('settled','paid'))
                  AS total_commission,
                (SELECT MAX(status) FROM referral_commissions
                  WHERE referrer_id = ? AND referred_user_id = u.id)
                  AS last_status
         FROM referral_relationships r
         LEFT JOIN users u ON u.id = r.invitee_user_id
         WHERE r.inviter_user_id = ?
         ORDER BY r.created_at DESC
         LIMIT 200`,
        [uid, uid, uid]
      )
      // 脱敏 username
      const masked = rows.map(r => ({
        id: r.invitee_user_id,
        name: r.username
          ? r.username.slice(0, 2) + '***' + r.username.slice(-1)
          : '匿名',
        joined_at: r.created_at,
        is_member: !!r.is_member,
        rel_status: r.rel_status,
        commission: r.total_commission ? Math.round(r.total_commission * 100) / 100 : 0,
        last_status: r.last_status || null,
      }))
      res.json({ ok: true, count: masked.length, items: masked })
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message })
    }
  })

  // ═══ Founder: 我的佣金流水（详细到每笔） ══════════════════════
  app.get('/api/referral/v2/my-commissions', auth, async (req, res) => {
    const uid = req.user?.id
    if (!uid) return res.status(401).json({ ok: false })
    try {
      const [rows] = await pool.execute(
        `SELECT c.id, c.amount, c.rate, c.status, c.created_at,
                c.cooldown_until, c.settled_at, c.paid_at, c.paid_method,
                u.username AS invitee_name
         FROM referral_commissions c
         LEFT JOIN users u ON u.id = c.referred_user_id
         WHERE c.referrer_id = ?
         ORDER BY c.created_at DESC
         LIMIT 100`,
        [uid]
      )
      const items = rows.map(r => ({
        id: r.id,
        amount: Number(r.amount),
        rate: Number(r.rate),
        status: r.status,
        created_at: r.created_at,
        cooldown_until: r.cooldown_until,
        settled_at: r.settled_at,
        paid_at: r.paid_at,
        paid_method: r.paid_method,
        invitee: r.invitee_name ? r.invitee_name.slice(0, 2) + '***' : '匿名',
      }))
      res.json({ ok: true, count: items.length, items })
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message })
    }
  })

  console.log('[referralAdmin] mounted /api/admin/commission/* and /api/referral/v2/*')
}
