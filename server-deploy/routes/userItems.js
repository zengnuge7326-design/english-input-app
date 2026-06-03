/**
 * 用户道具余额 & 使用接口
 * 挂载：require('./routes/userItems')({ app, pool, auth })
 *
 * 提供：
 *   GET  /api/user/balance     返回 hint_balance / skip_balance / xp_multiplier_until
 *   POST /api/user/use-hint    扣 hint_balance - 1
 *   POST /api/user/use-skip    扣 skip_balance - 1
 */
module.exports = function mountUserItems({ app, pool, auth }) {

  app.get('/api/user/balance', auth, async (req, res) => {
    try {
      const [[u]] = await pool.execute(
        'SELECT hint_balance, skip_balance, xp_multiplier_until FROM users WHERE id=?',
        [req.user.id]
      )
      if (!u) return res.status(404).json({ error: 'USER_NOT_FOUND' })
      const isDoubleXp = !!(u.xp_multiplier_until && new Date(u.xp_multiplier_until) > new Date())
      res.json({
        hint_balance: u.hint_balance || 0,
        skip_balance: u.skip_balance || 0,
        xp_multiplier_until: u.xp_multiplier_until,
        is_double_xp: isDoubleXp,
      })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  app.post('/api/user/use-hint', auth, async (req, res) => {
    try {
      const [r] = await pool.execute(
        'UPDATE users SET hint_balance = hint_balance - 1 WHERE id=? AND hint_balance > 0',
        [req.user.id]
      )
      if (r.affectedRows === 0) {
        return res.json({ ok: false, error: 'NO_BALANCE', hint_balance: 0 })
      }
      const [[u]] = await pool.execute('SELECT hint_balance FROM users WHERE id=?', [req.user.id])
      res.json({ ok: true, hint_balance: u.hint_balance })
    } catch (e) {
      res.status(500).json({ ok: false, error: 'SERVER_ERROR', message: e.message })
    }
  })

  app.post('/api/user/use-skip', auth, async (req, res) => {
    try {
      const [r] = await pool.execute(
        'UPDATE users SET skip_balance = skip_balance - 1 WHERE id=? AND skip_balance > 0',
        [req.user.id]
      )
      if (r.affectedRows === 0) {
        return res.json({ ok: false, error: 'NO_BALANCE', skip_balance: 0 })
      }
      const [[u]] = await pool.execute('SELECT skip_balance FROM users WHERE id=?', [req.user.id])
      res.json({ ok: true, skip_balance: u.skip_balance })
    } catch (e) {
      res.status(500).json({ ok: false, error: 'SERVER_ERROR', message: e.message })
    }
  })

  console.log('[user-items] mounted /api/user/balance + use-hint + use-skip')
}
