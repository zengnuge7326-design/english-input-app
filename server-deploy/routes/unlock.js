/**
 * 解锁路由（适配现有工厂模式）
 * 挂载: require('./routes/unlock')({ app, pool, auth })
 */

const SCOPES = new Set(['course', 'book', 'grammar', 'vocab_unit', 'alphabet', 'phoneme', 'core', 'reading', 'typing', 'island'])
const COLORS = new Set(['blue', 'green', 'red', 'purple', 'gold'])
const COL_MAP = {
  blue: 'crystals_blue',
  green: 'crystals_green',
  red: 'crystals_red',
  purple: 'crystals_purple',
  gold: 'crystals_gold',
}

module.exports = ({ app, pool, auth }) => {
  // 查全部已解锁项
  app.get('/api/unlock/state', auth, async (req, res) => {
    try {
      const [rows] = await pool.execute(
        'SELECT scope, item_id, cost, paid_color, created_at FROM unlocks WHERE user_id=?',
        [req.user.id]
      )
      const map = {}
      rows.forEach(r => {
        if (!map[r.scope]) map[r.scope] = {}
        map[r.scope][r.item_id] = { cost: r.cost, color: r.paid_color, at: r.created_at }
      })
      res.json({ unlocks: map })
    } catch (e) {
      console.error('[unlock/state]', e)
      res.status(500).json({ error: 'server_error' })
    }
  })

  // 解锁某项（事务）
  app.post('/api/unlock', auth, async (req, res) => {
    const { scope, item_id, cost, color = 'blue' } = req.body || {}
    if (!SCOPES.has(scope)) return res.status(400).json({ error: 'bad_scope' })
    if (!item_id || typeof item_id !== 'string' || item_id.length > 64)
      return res.status(400).json({ error: 'bad_item_id' })
    if (!Number.isInteger(cost) || cost < 0 || cost > 10000)
      return res.status(400).json({ error: 'bad_cost' })
    if (!COLORS.has(color)) return res.status(400).json({ error: 'bad_color' })

    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      const [exist] = await conn.execute(
        'SELECT id FROM unlocks WHERE user_id=? AND scope=? AND item_id=? FOR UPDATE',
        [req.user.id, scope, item_id]
      )
      if (exist.length) {
        await conn.commit()
        return res.json({ ok: true, already: true })
      }

      const [users] = await conn.execute(
        `SELECT ${COL_MAP[color]} AS balance, is_member, member_until FROM users WHERE id=? FOR UPDATE`,
        [req.user.id]
      )
      if (!users.length) {
        await conn.rollback()
        return res.status(404).json({ error: 'user_not_found' })
      }

      const user = users[0]
      const isMember = user.is_member && (!user.member_until || new Date(user.member_until) > new Date())
      const actualCost = isMember ? 0 : cost

      if (!isMember && (user.balance || 0) < cost) {
        await conn.rollback()
        return res.status(402).json({
          error: 'insufficient_crystals',
          need: cost,
          have: user.balance || 0,
          color,
        })
      }

      if (actualCost > 0) {
        await conn.execute(
          `UPDATE users SET ${COL_MAP[color]} = ${COL_MAP[color]} - ? WHERE id=?`,
          [actualCost, req.user.id]
        )
        try {
          await conn.execute(
            'INSERT INTO crystal_log(user_id, color, delta, reason, meta, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
            [req.user.id, color, -actualCost, 'unlock', JSON.stringify({ scope, item_id })]
          )
        } catch (e) { /* crystal_log 可能不存在，忽略 */ }
      }

      await conn.execute(
        'INSERT INTO unlocks(user_id, scope, item_id, cost, paid_color) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, scope, item_id, actualCost, color]
      )
      try {
        await conn.execute(
          'INSERT INTO unlock_log(user_id, scope, item_id, cost, paid_color) VALUES (?, ?, ?, ?, ?)',
          [req.user.id, scope, item_id, actualCost, color]
        )
      } catch (e) { /* 可选表 */ }

      await conn.commit()
      res.json({ ok: true, free: isMember, cost: actualCost })
    } catch (e) {
      await conn.rollback().catch(() => {})
      console.error('[unlock]', e)
      res.status(500).json({ error: 'server_error' })
    } finally {
      conn.release()
    }
  })
}
