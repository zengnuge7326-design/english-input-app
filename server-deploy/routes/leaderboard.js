/**
 * 排行榜路由（适配现有工厂模式）
 * 挂载: require('./routes/leaderboard')({ app, pool, JWT_SECRET, jwt })
 */

const DEFAULT_LIMIT = 50
const MAX_LIMIT = 100

function parseLimit(raw) {
  const n = parseInt(raw, 10)
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_LIMIT
  return Math.min(n, MAX_LIMIT)
}

function todayDate() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

module.exports = ({ app, pool, JWT_SECRET, jwt }) => {
  function optionalAuth(req, _res, next) {
    const token = req.headers.authorization?.split(' ')[1]
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded
      } catch { /* ignore */ }
    }
    next()
  }

  // 总榜
  app.get('/api/leaderboard/total', optionalAuth, async (req, res) => {
    const limit = parseLimit(req.query.limit)
    try {
      const [rows] = await pool.execute(
        `SELECT id, username, total_xp, streak
         FROM users
         WHERE total_xp > 0
         ORDER BY total_xp DESC, id ASC
         LIMIT ?`,
        [limit]
      )
      const list = rows.map((r, i) => ({
        rank: i + 1,
        userId: r.id,
        username: r.username,
        xp: r.total_xp || 0,
        streak: r.streak || 0,
      }))
      let myRank = null, myXp = null
      if (req.user?.id) {
        const [me] = await pool.execute('SELECT total_xp FROM users WHERE id=?', [req.user.id])
        if (me.length && me[0].total_xp > 0) {
          myXp = me[0].total_xp
          const [c] = await pool.execute('SELECT COUNT(*) AS n FROM users WHERE total_xp > ?', [myXp])
          myRank = (c[0].n || 0) + 1
        }
      }
      res.json({ list, myRank, myXp })
    } catch (e) {
      console.error('[leaderboard/total]', e)
      res.status(500).json({ error: 'server_error' })
    }
  })

  // 今日榜
  app.get('/api/leaderboard/today', optionalAuth, async (req, res) => {
    const limit = parseLimit(req.query.limit)
    const date = todayDate()
    try {
      const [rows] = await pool.execute(
        `SELECT u.id, u.username, d.xp, u.streak
         FROM xp_daily d JOIN users u ON u.id = d.user_id
         WHERE d.date = ? AND d.xp > 0
         ORDER BY d.xp DESC, u.id ASC
         LIMIT ?`,
        [date, limit]
      )
      const list = rows.map((r, i) => ({
        rank: i + 1,
        userId: r.id,
        username: r.username,
        xp: r.xp || 0,
        streak: r.streak || 0,
      }))
      let myRank = null, myXp = null
      if (req.user?.id) {
        const [me] = await pool.execute(
          'SELECT xp FROM xp_daily WHERE user_id=? AND date=?',
          [req.user.id, date]
        )
        if (me.length && me[0].xp > 0) {
          myXp = me[0].xp
          const [c] = await pool.execute(
            'SELECT COUNT(*) AS n FROM xp_daily WHERE date=? AND xp > ?',
            [date, myXp]
          )
          myRank = (c[0].n || 0) + 1
        }
      }
      res.json({ list, myRank, myXp, date })
    } catch (e) {
      console.error('[leaderboard/today]', e)
      res.status(500).json({ error: 'server_error' })
    }
  })
}
