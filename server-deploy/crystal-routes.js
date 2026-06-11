/**
 * 水晶系统路由 · v1.1
 *
 * 修复要点（P0）：
 *   ✅ #3 频控不再按 reason 维度（避免改 reason 字符串绕过）
 *   ✅ #4 earn 加事务（UPDATE + INSERT 原子）
 *   ✅ #5 内部 GET state 不再用 router.handle 递归调用，改抽工具函数
 *
 * 挂载方式（在 server.js / app.js）：
 *   const crystalRoutes = require('./routes/crystal')
 *   app.use('/api/crystal', crystalRoutes(pool, authMiddleware))
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

// 频控：每用户每分钟最多 100 次 earn（不分 reason）
// 这样改 reason 字符串绕不过去
const RATE_LIMIT_PER_MIN = 100

function towerLevelFromTotal(total) {
  return Math.floor(total / 100)
}

// 工具：取用户当前状态（避免内部 router.handle 转发）
async function loadState(pool, userId) {
  const [rows] = await pool.execute(
    'SELECT crystals_blue, crystals_green, crystals_red, crystals_purple, crystals_gold, tower_level FROM users WHERE id=?',
    [userId]
  )
  if (!rows.length) return null
  const r = rows[0]
  const total = r.crystals_blue + r.crystals_green + r.crystals_red + r.crystals_purple + r.crystals_gold
  const towerLevel = towerLevelFromTotal(total)
  // 校正 DB 中存的 tower_level（已是次要冗余字段）
  if (towerLevel !== r.tower_level) {
    await pool.execute('UPDATE users SET tower_level=? WHERE id=?', [towerLevel, userId])
  }
  return {
    blue: r.crystals_blue,
    green: r.crystals_green,
    red: r.crystals_red,
    purple: r.crystals_purple,
    gold: r.crystals_gold,
    total,
    towerLevel,
  }
}

module.exports = function createCrystalRoutes(pool, auth) {
  const router = express.Router()
  router.use(auth)

  // -- 当前状态 --------------------------------------------
  router.get('/state', async (req, res) => {
    try {
      const state = await loadState(pool, req.userId)
      if (!state) return res.status(404).json({ error: 'user not found' })
      res.json(state)
    } catch (e) {
      console.error('crystal/state', e)
      res.status(500).json({ error: 'server error' })
    }
  })

  // -- 获得水晶 --------------------------------------------
  router.post('/earn', async (req, res) => {
    const { color, amount = 1, reason = 'unknown', meta = null } = req.body || {}
    if (!COLORS.includes(color)) return res.status(400).json({ error: 'bad color' })
    if (color === 'gold') return res.status(403).json({ error: 'forbidden color' }) // 金钻仅服务端发放（recharge/daily-spin），禁止客户端 earn
    const a = Math.max(1, Math.min(50, parseInt(amount) || 0))
    if (!a) return res.status(400).json({ error: 'bad amount' })
    if (typeof reason !== 'string' || reason.length > 64) return res.status(400).json({ error: 'bad reason' })

    try {
      // 修复 #3：频控按 user_id 总次数（不分 reason），避免改 reason 字符串绕过
      const [cnt] = await pool.execute(
        'SELECT COUNT(*) AS c FROM crystal_log WHERE user_id=? AND delta>0 AND created_at > NOW() - INTERVAL 1 MINUTE',
        [req.userId]
      )
      if (cnt[0].c >= RATE_LIMIT_PER_MIN) {
        return res.status(429).json({ error: 'rate limit', limit: RATE_LIMIT_PER_MIN })
      }

      // 修复 #4：UPDATE + INSERT 包在事务里，保证原子
      const conn = await pool.getConnection()
      try {
        await conn.beginTransaction()
        const col = COL_MAP[color]
        await conn.execute(`UPDATE users SET ${col} = ${col} + ? WHERE id=?`, [a, req.userId])
        await conn.execute(
          'INSERT INTO crystal_log (user_id, color, delta, reason, meta) VALUES (?,?,?,?,?)',
          [req.userId, color, a, reason, meta ? JSON.stringify(meta) : null]
        )
        await conn.commit()
        conn.release()
      } catch (txErr) {
        try { await conn.rollback() } catch {}
        conn.release()
        throw txErr
      }

      // 修复 #5：直接调工具函数，不用 router.handle 转发
      const state = await loadState(pool, req.userId)
      if (!state) return res.status(404).json({ error: 'user not found' })
      res.json(state)
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
      if (!rows.length) { await conn.rollback(); conn.release(); return res.status(404).json({ error: 'user not found' }) }
      if (rows[0].bal < a) { await conn.rollback(); conn.release(); return res.status(400).json({ error: 'insufficient balance' }) }

      await conn.execute(`UPDATE users SET ${col} = ${col} - ? WHERE id=?`, [a, req.userId])
      await conn.execute(
        'INSERT INTO crystal_log (user_id, color, delta, reason, meta) VALUES (?,?,?,?,?)',
        [req.userId, color, -a, reason, meta ? JSON.stringify(meta) : null]
      )
      await conn.commit()
      conn.release()

      // 重新查 + 同步 tower_level
      const state = await loadState(pool, req.userId)
      if (!state) return res.status(404).json({ error: 'user not found' })
      res.json(state)
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

// 导出工具函数（方便其他模块复用）
module.exports.loadCrystalState = loadState
module.exports.COL_MAP = COL_MAP
module.exports.COLORS = COLORS
