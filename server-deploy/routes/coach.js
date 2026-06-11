/**
 * AI Coach 路由 · v1.0
 *
 * 后端代理智谱 GLM-4-Flash（前端不直接持 API Key）
 *
 * 环境变量：
 *   ZHIPU_API_KEY  -- 智谱 API Key（必填）
 *
 * 挂载方式：在 index.js 末尾：
 *   require('./routes/coach')({ app, pool, auth })
 *
 * 路由：
 *   POST /api/coach/chat        — 通用对话（非流式，返回完整 JSON）
 *   POST /api/coach/chat/stream — 流式响应（SSE，逐 token 推送）
 *   GET  /api/coach/health      — 健康检查（验证 key 可用）
 *   GET  /api/coach/usage       — 用户今日调用次数（防滥用）
 */

const ZHIPU_BASE = 'https://open.bigmodel.cn/api/paas/v4'
const MODEL = 'glm-4-flash'

// 单用户每日上限（防止账号被刷）
const DAILY_LIMIT_FREE = 100      // 普通用户
const DAILY_LIMIT_MEMBER = 500    // 会员

// 系统 prompt 模板
const SYSTEM_PROMPTS = {
  textbook: `你是一位耐心、活泼的小学英语口语老师。学生正在练习教材里的句子。
请：
1. 用中文 + 英语示范的方式回答
2. 如果学生句子有错，先用 ✅ 标出正确写法，再 ❌ 指出错在哪（用词/语法/时态/拼写）
3. 用 💡 给一个相关的语法小提示（不超过 1 句话）
4. 鼓励性结尾（"再试一次!" / "答得很好!"）
回复要简短，控制在 80 字以内。`,

  translate: `你是英语翻译陪练。学生给你一句中文，请：
1. 给出 2-3 个不同难度的英文译文（标 ⭐ 难度）
2. 简要解释关键词组（中文，不超过 30 字）
回复总长度不超过 150 字。`,

  free: `你是友好的英语口语教练。和学生用英语聊天，但碰到错误时用中文简短指出（用 ❌ 标记）。
- 学生说英语 → 你回英语，自然延续话题
- 学生写错 → 立刻 ✅ 正确写法 ❌ 错处
- 用学生水平相近的简单英语
每次回复不超过 50 词。`,
}

module.exports = function mountCoach({ app, pool, auth }) {
  const apiKey = process.env.ZHIPU_API_KEY
  if (!apiKey) {
    console.warn('[coach] ZHIPU_API_KEY 未设置，AI Coach 路由将返回 503')
  }

  // 用量表（懒建）
  async function ensureUsageTable() {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS coach_usage (
        user_id INT NOT NULL,
        d DATE NOT NULL,
        n INT NOT NULL DEFAULT 0,
        PRIMARY KEY (user_id, d),
        INDEX idx_date (d)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `).catch(() => {})
  }
  ensureUsageTable()

  async function getTodayUsage(userId) {
    if (!userId) return 0
    const [rows] = await pool.execute(
      'SELECT n FROM coach_usage WHERE user_id=? AND d=CURDATE()',
      [userId]
    )
    return rows[0]?.n || 0
  }

  async function bumpUsage(userId) {
    if (!userId) return
    await pool.execute(`
      INSERT INTO coach_usage (user_id, d, n) VALUES (?, CURDATE(), 1)
      ON DUPLICATE KEY UPDATE n = n + 1
    `, [userId])
  }

  function buildMessages(body) {
    const { messages = [], scene = 'free', system } = body
    const sysContent = system || SYSTEM_PROMPTS[scene] || SYSTEM_PROMPTS.free
    const filtered = messages.filter(m => m && m.role && m.content)
    // 截断历史（防 token 爆炸）：保留最近 10 条
    const recent = filtered.slice(-10)
    return [{ role: 'system', content: sysContent }, ...recent]
  }

  async function callZhipu(messages, { stream = false, temperature = 0.6, maxTokens = 600 } = {}) {
    const res = await fetch(`${ZHIPU_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream,
      }),
    })
    return res
  }

  // ─── 健康检查 ─────────────────────────────────────
  app.get('/api/coach/health', async (req, res) => {
    if (!apiKey) return res.status(503).json({ ok: false, error: 'no_api_key' })
    try {
      const r = await callZhipu(
        [{ role: 'user', content: 'ping' }],
        { maxTokens: 10 }
      )
      res.json({ ok: r.ok, status: r.status })
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message })
    }
  })

  // ─── 用量查询 ─────────────────────────────────────
  app.get('/api/coach/usage', auth, async (req, res) => {
    try {
      const n = await getTodayUsage(req.user?.id)
      const isMember = !!req.user?.is_member
      res.json({
        ok: true,
        used: n,
        limit: isMember ? DAILY_LIMIT_MEMBER : DAILY_LIMIT_FREE,
        remaining: Math.max(0, (isMember ? DAILY_LIMIT_MEMBER : DAILY_LIMIT_FREE) - n),
      })
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message })
    }
  })

  // ─── 非流式聊天 ───────────────────────────────────
  app.post('/api/coach/chat', auth, async (req, res) => {
    if (!apiKey) return res.status(503).json({ ok: false, error: 'AI Coach 暂未启用' })
    const userId = req.user?.id
    const isMember = !!req.user?.is_member
    const limit = isMember ? DAILY_LIMIT_MEMBER : DAILY_LIMIT_FREE
    try {
      const used = await getTodayUsage(userId)
      if (used >= limit) {
        return res.status(429).json({
          ok: false,
          error: 'daily_limit_exceeded',
          message: `今日已用 ${used}/${limit} 次，请明日再来或升级会员`,
        })
      }
      const messages = buildMessages(req.body || {})
      const r = await callZhipu(messages, { stream: false })
      if (!r.ok) {
        const text = await r.text()
        return res.status(r.status).json({ ok: false, error: 'upstream_error', detail: text.slice(0, 500) })
      }
      const data = await r.json()
      const reply = data?.choices?.[0]?.message?.content || ''
      await bumpUsage(userId)
      res.json({
        ok: true,
        reply,
        used: used + 1,
        remaining: Math.max(0, limit - used - 1),
        usage: data?.usage,
      })
    } catch (err) {
      console.error('[coach/chat] error:', err)
      res.status(500).json({ ok: false, error: err.message })
    }
  })

  // ─── 流式聊天（SSE）─────────────────────────────────
  app.post('/api/coach/chat/stream', auth, async (req, res) => {
    if (!apiKey) return res.status(503).end()
    const userId = req.user?.id
    const isMember = !!req.user?.is_member
    const limit = isMember ? DAILY_LIMIT_MEMBER : DAILY_LIMIT_FREE
    try {
      const used = await getTodayUsage(userId)
      if (used >= limit) {
        return res.status(429).json({ ok: false, error: 'daily_limit_exceeded' })
      }
      const messages = buildMessages(req.body || {})
      const r = await callZhipu(messages, { stream: true })
      if (!r.ok) {
        const text = await r.text()
        return res.status(r.status).json({ ok: false, detail: text.slice(0, 500) })
      }
      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
      res.setHeader('Cache-Control', 'no-cache, no-transform')
      res.setHeader('X-Accel-Buffering', 'no')
      res.flushHeaders?.()

      // 透传 SSE
      const reader = r.body
      reader.on('data', chunk => res.write(chunk))
      reader.on('end', async () => {
        await bumpUsage(userId)
        res.end()
      })
      reader.on('error', err => {
        console.error('[coach/stream] stream error:', err)
        try { res.end() } catch {}
      })
      req.on('close', () => { try { reader.destroy() } catch {} })
    } catch (err) {
      console.error('[coach/chat/stream] error:', err)
      try { res.status(500).json({ ok: false, error: err.message }) } catch {}
    }
  })

  console.log('[coach] mounted: /api/coach/{health,usage,chat,chat/stream}')
}
