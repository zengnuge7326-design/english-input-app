// ─── 水晶系统 ──────────────────────────────────────────────
// 五色：blue(蓝)=完成单元 green(绿)=零错误 red(红)=错题坚持 purple(紫)=连击 gold(金)=会员
const CRYSTAL_COLORS = ['blue', 'green', 'red', 'purple', 'gold']
const CRYSTAL_COL = {
  blue:   'crystals_blue',
  green:  'crystals_green',
  red:    'crystals_red',
  purple: 'crystals_purple',
  gold:   'crystals_gold',
}

async function crystalState(userId) {
  const [[u]] = await pool.execute(
    'SELECT crystals_blue, crystals_green, crystals_red, crystals_purple, crystals_gold FROM users WHERE id=?',
    [userId]
  )
  if (!u) return null
  const total = u.crystals_blue + u.crystals_green + u.crystals_red + u.crystals_purple + u.crystals_gold
  const towerLevel = Math.floor(total / 100)
  await pool.execute('UPDATE users SET tower_level=? WHERE id=?', [towerLevel, userId])
  return {
    blue: u.crystals_blue, green: u.crystals_green, red: u.crystals_red,
    purple: u.crystals_purple, gold: u.crystals_gold,
    total, towerLevel,
  }
}

app.get('/api/crystal/state', auth, async (req, res) => {
  try {
    const s = await crystalState(req.user.id)
    if (!s) return res.status(404).json({ error: '用户不存在' })
    res.json(s)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.post('/api/crystal/earn', auth, async (req, res) => {
  const { color, amount = 1, reason = 'unknown', meta = null } = req.body || {}
  if (!CRYSTAL_COLORS.includes(color)) return res.status(400).json({ error: 'bad color' })
  const a = Math.max(1, Math.min(50, parseInt(amount) || 0))
  if (!a) return res.status(400).json({ error: 'bad amount' })
  if (typeof reason !== 'string' || reason.length > 64) return res.status(400).json({ error: 'bad reason' })
  try {
    // 限流：每分钟同 user+reason 最多 30 次
    const [[cnt]] = await pool.execute(
      "SELECT COUNT(*) AS c FROM crystal_log WHERE user_id=? AND reason=? AND created_at > NOW() - INTERVAL 1 MINUTE",
      [req.user.id, reason]
    )
    if (cnt.c > 30) return res.status(429).json({ error: 'rate limit' })
    const col = CRYSTAL_COL[color]
    await pool.execute(`UPDATE users SET ${col} = ${col} + ? WHERE id=?`, [a, req.user.id])
    await pool.execute(
      'INSERT INTO crystal_log (user_id, color, delta, reason, meta) VALUES (?,?,?,?,?)',
      [req.user.id, color, a, reason, meta ? JSON.stringify(meta) : null]
    )
    const s = await crystalState(req.user.id)
    res.json(s)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.post('/api/crystal/spend', auth, async (req, res) => {
  const { color, amount = 1, reason = 'redeem', meta = null } = req.body || {}
  if (!CRYSTAL_COLORS.includes(color)) return res.status(400).json({ error: 'bad color' })
  const a = Math.max(1, Math.min(500, parseInt(amount) || 0))
  if (!a) return res.status(400).json({ error: 'bad amount' })
  if (typeof reason !== 'string' || reason.length > 64) return res.status(400).json({ error: 'bad reason' })
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    const col = CRYSTAL_COL[color]
    const [rows] = await conn.execute(`SELECT ${col} AS bal FROM users WHERE id=? FOR UPDATE`, [req.user.id])
    if (!rows.length) { await conn.rollback(); conn.release(); return res.status(404).json({ error: '用户不存在' }) }
    if (rows[0].bal < a) { await conn.rollback(); conn.release(); return res.status(400).json({ error: '水晶不足' }) }
    await conn.execute(`UPDATE users SET ${col} = ${col} - ? WHERE id=?`, [a, req.user.id])
    await conn.execute(
      'INSERT INTO crystal_log (user_id, color, delta, reason, meta) VALUES (?,?,?,?,?)',
      [req.user.id, color, -a, reason, meta ? JSON.stringify(meta) : null]
    )
    await conn.commit()
    conn.release()
    const s = await crystalState(req.user.id)
    res.json(s)
  } catch (e) {
    try { await conn.rollback() } catch {}
    conn.release()
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/crystal/log', auth, async (req, res) => {
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 20))
  try {
    const [rows] = await pool.execute(
      'SELECT id, color, delta, reason, meta, created_at FROM crystal_log WHERE user_id=? ORDER BY id DESC LIMIT ?',
      [req.user.id, limit]
    )
    res.json({ items: rows })
  } catch (e) { res.status(500).json({ error: e.message }) }
})
// ─── 水晶系统 END ──────────────────────────────────────────
