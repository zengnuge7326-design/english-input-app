/**
 * 每日转盘 API
 * 挂载：require('./routes/dailySpin')({ app, pool, auth })
 */
module.exports = function mountDailySpin({ app, pool, auth }) {

  const PRIZE_POOL = [
    { weight: 40, type: 'diamond', color: 'gold', amount: 5 },
    { weight: 25, type: 'diamond', color: 'gold', amount: 10 },
    { weight: 15, type: 'diamond', color: 'gold', amount: 20 },
    { weight: 8,  type: 'diamond', color: 'gold', amount: 30 },
    { weight: 7,  type: 'item',    item_id: 'freeze_card_1', count: 1 },
    { weight: 4,  type: 'item',    item_id: 'hint_card_5',  count: 1 },
    { weight: 1,  type: 'diamond', color: 'gold', amount: 50 },
  ]

  function rollPrize() {
    const total = PRIZE_POOL.reduce((s, p) => s + p.weight, 0)
    let r = Math.floor(Math.random() * total)
    for (const p of PRIZE_POOL) {
      if (r < p.weight) return p
      r -= p.weight
    }
    return PRIZE_POOL[0]
  }

  function nextSpinAtISO() {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    d.setHours(0, 0, 0, 0)
    return d.toISOString()
  }

  app.post('/api/shop/daily-spin', auth, async (req, res) => {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      const [[exist]] = await conn.execute(
        'SELECT 1 FROM daily_spin_log WHERE user_id=? AND spin_date=CURDATE() FOR UPDATE',
        [req.user.id]
      )
      if (exist) {
        await conn.rollback()
        conn.release()
        return res.json({ ok: false, error: 'ALREADY_SPUN_TODAY', next_spin_at: nextSpinAtISO() })
      }

      const prize = rollPrize()

      await conn.execute(
        'INSERT INTO daily_spin_log (user_id, spin_date, prize_json) VALUES (?, CURDATE(), ?)',
        [req.user.id, JSON.stringify(prize)]
      )

      if (prize.type === 'diamond') {
        const col = `crystals_${prize.color}`
        await conn.execute(`UPDATE users SET ${col} = ${col} + ? WHERE id=?`, [prize.amount, req.user.id])
        await conn.execute(
          'INSERT INTO crystal_log (user_id, color, delta, reason, meta) VALUES (?,?,?,?,?)',
          [req.user.id, prize.color, prize.amount, 'daily_spin', JSON.stringify({})]
        )
      } else if (prize.type === 'item') {
        await conn.execute(
          `INSERT INTO user_inventory (user_id, item_id, count) VALUES (?,?,?)
           ON DUPLICATE KEY UPDATE count = count + VALUES(count)`,
          [req.user.id, prize.item_id, prize.count]
        )
      }

      await conn.commit()
      conn.release()
      res.json({ ok: true, prize, next_spin_at: nextSpinAtISO() })
    } catch (e) {
      try { await conn.rollback() } catch { /* ignore */ }
      conn.release()
      console.error('[daily-spin]', e)
      res.status(500).json({ ok: false, error: 'SERVER_ERROR', message: e.message })
    }
  })

  console.log('[daily-spin] mounted /api/shop/daily-spin')
}
