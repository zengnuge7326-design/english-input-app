/**
 * 水晶系统路由
 * 挂载方式（在 server.js / app.js）：
 *   const crystalRoutes = require('./routes/crystal')
 *   app.use('/api/crystal', crystalRoutes(pool, authMiddleware))
 *
 * 依赖：
 *   - mysql2/promise 连接池（pool.execute）
 *   - JWT 中间件，req.userId 已经塞好
 *
 * 接口：
 *   GET  /api/crystal/state          -> 当前各色数量 + 塔等级 + 总数
 *   POST /api/crystal/earn           body {color, amount, reason, meta?}
 *   POST /api/crystal/spend          body {color, amount, reason, meta?}
 *   GET  /api/crystal/log?limit=20   最近流水
 *
 * 服务端校验：余额不足拒绝；color 必须合法；amount 1..50；reason 长度 ≤64
 *
 * 反作弊：每分钟同 reason 最多 30 次（防客户端循环）
 */
const express = require('express')

const COLORS = ['blue', 'green', 'red', 'purple', 'gold']
const COL_MAP = {
  blue:   'crystals_blue',
  green:  'crystals_green',
  red:    'crystals_red',
  purple: 'crystals_purple',
  gold:   'crystals_gold',
}
// 100颗水晶升1层（计算用，不存DB；从总和推导）
function towerLevelFromTotal(total) {
  return Math.floor(total / 100)
}

module.exports = function createCrystalRoutes(pool, auth) {
  const router = express.Router()
  router.use(auth)

  // -- 当前状态 --------------------------------------------
  router.get('/state', async (req, res) => {
    try {
      const [rows] = await pool.execute(
        'SELECT crystals_blue, crystals_green, crystals_red, crystals_purple, crystals_gold, tower_level FROM users WHERE id=?',
        [req.userId]
      )
      if (!rows.length) return res.status(404).json({ error: 'user not found' })
      const r = rows[0]
      const total = r.crystals_blue + r.crystals_green + r.crystals_red + r.crystals_purple + r.crystals_gold
      const towerLevel = towerLevelFromTotal(total)
      // 如果数据库存储的塔等级和算出的不一致，自动同步
      if (towerLevel !== r.tower_level) {
        await pool.execute('UPDATE users SET tower_level=? WHERE id=?', [towerLevel, req.userId])
      }
      res.json({
        blue: r.crystals_blue,
        green: r.crystals_green,
        red: r.crystals_red,
        purple: r.crystals_purple,
        gold: r.crystals_gold,
        total,
        towerLevel,
      })
    } catch (e) {
      console.error('crystal/state', e)
      res.status(500).json({ error: 'server error' })
    }
  })

  // -- 获得水晶 --------------------------------------------
  router.post('/earn', async (req, res) => {
    const { color, amount = 1, reason = 'unknown', meta = null } = req.body || {}
    if (!COLORS.includes(color)) return res.status(400).json({ error: 'bad color' })
    const a = Math.max(1, Math.min(50, parseInt(amount) || 0))
    if (!a) return res.status(400).json({ error: 'bad amount' })
    if (typeof reason !== 'string' || reason.length > 64) return res.status(400).json({ error: 'bad reason' })

    try {
      // 防作弊：每分钟同 user+reason 最多 30 次
      const [cnt] = await pool.execute(
        "SELECT COUNT(*) AS c FROM crystal_log WHERE user_id=? AND reason=? AND created_at > NOW() - INTERVAL 1 MINUTE",
        [req.userId, reason]
      )
      if (cnt[0].c > 30) return res.status(429).json({ error: 'rate limit' })

      const col = COL_MAP[color]
      await pool.execute(`UPDATE users SET ${col} = ${col} + ? WHERE id=?`, [a, req.userId])
      await pool.execute(
        'INSERT INTO crystal_log (user_id, color, delta, reason, meta) VALUES (?,?,?,?,?)',
        [req.userId, color, a, reason, meta ? JSON.stringify(meta) : null]
      )
      // 返回最新状态
      return router.handle({ ...req, method: 'GET', url: '/state' }, res, () => {})
    } catch (e) {
      console.error('crystal/earn', e)
      res.status(500).json({ error: 'server error' })
    }
  })

  // -- 消耗水晶 --------------------------------------------
  router.post('/spend', async (req, res) => {
    const { color, amount = 1, reason = 'unknown', meta = null } = req.body || {}
    if (!COLORS.includes(color)) return res.status(400).json({ error: 'bad color' })
    const a = Math.max(1, Math.min(500, parseInt(amount) || 0))
    if (!a) return res.status(400).json({ error: 'bad amount' })
    if (typeof reason !== 'string' || reason.length > 64) return res.status(400).json({ error: 'bad reason' })

    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
      const col = COL_MAP[color]
      const [rows] = await conn.execute(`SELECT ${col} AS bal FROM users WHERE id=? FOR UPDATE`, [req.userId])
      if (!rows.length) { await conn.rollback(); return res.status(404).json({ error: 'user not found' }) }
      if (rows[0].bal < a) { await conn.rollback(); return res.status(400).json({ error: 'insufficient balance' }) }

      await conn.execute(`UPDATE users SET ${col} = ${col} - ? WHERE id=?`, [a, req.userId])
      await conn.execute(
        'INSERT INTO crystal_log (user_id, color, delta, reason, meta) VALUES (?,?,?,?,?)',
        [req.userId, color, -a, reason, meta ? JSON.stringify(meta) : null]
      )
      await conn.commit()
      conn.release()

      // 重新查并返回
      const [r2] = await pool.execute(
        'SELECT crystals_blue, crystals_green, crystals_red, crystals_purple, crystals_gold FROM users WHERE id=?',
        [req.userId]
      )
      const u = r2[0]
      const total = u.crystals_blue + u.crystals_green + u.crystals_red + u.crystals_purple + u.crystals_gold
      const towerLevel = towerLevelFromTotal(total)
      await pool.execute('UPDATE users SET tower_level=? WHERE id=?', [towerLevel, req.userId])
      res.json({ blue: u.crystals_blue, green: u.crystals_green, red: u.crystals_red, purple: u.crystals_purple, gold: u.crystals_gold, total, towerLevel })
    } catch (e) {
      try { await conn.rollback() } catch {}
      conn.release()
      console.error('crystal/spend', e)
      res.status(500).json({ error: 'server error' })
    }
  })

  // -- 历史流水 --------------------------------------------
  router.get('/log', async (req, res) => {
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 20))
    try {
      const [rows] = await pool.execute(
        'SELECT id, color, delta, reason, meta, created_at FROM crystal_log WHERE user_id=? ORDER BY id DESC LIMIT ?',
        [req.userId, limit]
      )
      res.json({ items: rows })
    } catch (e) {
      console.error('crystal/log', e)
      res.status(500).json({ error: 'server error' })
    }
  })

  return router
}
