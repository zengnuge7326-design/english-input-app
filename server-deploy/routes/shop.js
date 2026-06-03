/**
 * 钻石商店 API · v1.0
 * 挂载方式：在 index.js 末尾 require 后调 mount：
 *   require('./routes/shop')({ app, pool, auth, crystalState, CRYSTAL_COL, CRYSTAL_COLORS })
 */

module.exports = function mountShop({ app, pool, auth, crystalState, CRYSTAL_COL, CRYSTAL_COLORS }) {

  // 充值档（无需登录）
  const RECHARGE_PACKS = [
    { id: 'p1',  rmb: 1,  diamonds: 50,   bonus: 0 },
    { id: 'p3',  rmb: 3,  diamonds: 160,  bonus: 10 },
    { id: 'p10', rmb: 10, diamonds: 800,  bonus: 300, tag: '最划算' },
    { id: 'p30', rmb: 30, diamonds: 2000, bonus: 500 },
  ]

  // ─── 商品列表 ──────────────────────────────────────────────
  app.get('/api/shop/products', async (req, res) => {
    try {
      const { category } = req.query
      let sql = 'SELECT id, category, tier, name, description, icon, image_path, price_json, rmb_price, stock_limit, meta, sort_order FROM shop_products WHERE available=1'
      const params = []
      if (category) { sql += ' AND category=?'; params.push(category) }
      sql += ' ORDER BY sort_order ASC, id ASC'
      const [rows] = await pool.execute(sql, params)
      const products = rows.map(r => ({
        id: r.id,
        category: r.category,
        tier: r.tier,
        name: r.name,
        desc: r.description,
        icon: r.icon,
        image: r.image_path,
        price: typeof r.price_json === 'string' ? JSON.parse(r.price_json) : r.price_json,
        rmb_price: r.rmb_price,
        stock_limit: r.stock_limit,
        meta: r.meta ? (typeof r.meta === 'string' ? JSON.parse(r.meta) : r.meta) : null,
        available: true,
      }))
      res.json({ products })
    } catch (e) { res.status(500).json({ error: e.message }) }
  })

  // ─── 充值档位 ──────────────────────────────────────────────
  app.get('/api/shop/recharge-packs', (req, res) => {
    res.json({ packs: RECHARGE_PACKS })
  })

  // ─── 用钻石购买 ──────────────────────────────────────────────
  app.post('/api/shop/buy', auth, async (req, res) => {
    const { product_id, qty = 1, client_idempotent_id = null } = req.body || {}
    const q = Math.max(1, Math.min(99, parseInt(qty) || 1))
    if (!product_id) return res.status(400).json({ ok: false, error: 'MISSING_PRODUCT_ID' })

    // 幂等：先查
    if (client_idempotent_id) {
      const [[dup]] = await pool.execute(
        'SELECT id FROM shop_orders WHERE user_id=? AND client_idempotent_id=? LIMIT 1',
        [req.user.id, client_idempotent_id]
      )
      if (dup) {
        const balance = await crystalState(req.user.id)
        const inv = await loadInventory(req.user.id)
        return res.json({ ok: true, order_id: dup.id, new_balance: balance, inventory: inv, _dup: true })
      }
    }

    // 读商品
    const [[p]] = await pool.execute(
      'SELECT id, category, name, price_json, rmb_price, stock_limit, meta FROM shop_products WHERE id=? AND available=1',
      [product_id]
    )
    if (!p) return res.status(404).json({ ok: false, error: 'PRODUCT_NOT_FOUND' })

    const price = typeof p.price_json === 'string' ? JSON.parse(p.price_json) : p.price_json
    const meta = p.meta ? (typeof p.meta === 'string' ? JSON.parse(p.meta) : p.meta) : null
    if (!Array.isArray(price) || !price.length) {
      return res.status(400).json({ ok: false, error: 'INVALID_PRICE' })
    }

    // 计算总价
    const costs = price.map(({ color, amount }) => ({ color, amount: amount * q }))
    for (const c of costs) {
      if (!CRYSTAL_COLORS.includes(c.color)) {
        return res.status(400).json({ ok: false, error: 'INVALID_PRICE' })
      }
    }

    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      // 1. 校验各色余额
      const [[u]] = await conn.execute(
        'SELECT crystals_blue, crystals_green, crystals_red, crystals_purple, crystals_gold FROM users WHERE id=? FOR UPDATE',
        [req.user.id]
      )
      if (!u) { await conn.rollback(); conn.release(); return res.status(404).json({ ok: false, error: 'USER_NOT_FOUND' }) }
      for (const c of costs) {
        const bal = u[CRYSTAL_COL[c.color]]
        if (bal < c.amount) {
          await conn.rollback(); conn.release()
          return res.json({ ok: false, error: 'INSUFFICIENT_DIAMOND', needed: c, current: bal })
        }
      }

      // 2. 限购检查（宠物只能买 1 次）
      if (p.category === 'pet') {
        const [[owned]] = await conn.execute(
          'SELECT 1 FROM user_pets WHERE user_id=? AND item_id=?',
          [req.user.id, product_id]
        )
        if (owned) { await conn.rollback(); conn.release(); return res.json({ ok: false, error: 'ALREADY_OWNED' }) }
      }

      // 3. 扣钻 + 流水
      for (const c of costs) {
        const col = CRYSTAL_COL[c.color]
        await conn.execute(`UPDATE users SET ${col} = ${col} - ? WHERE id=?`, [c.amount, req.user.id])
        await conn.execute(
          'INSERT INTO crystal_log (user_id, color, delta, reason, meta) VALUES (?,?,?,?,?)',
          [req.user.id, c.color, -c.amount, 'shop_buy', JSON.stringify({ product_id, qty: q })]
        )
      }

      // 4. 发货
      if (p.category === 'item') {
        await conn.execute(
          `INSERT INTO user_inventory (user_id, item_id, count) VALUES (?,?,?)
           ON DUPLICATE KEY UPDATE count = count + VALUES(count)`,
          [req.user.id, product_id, q]
        )
        // 学霸礼包：bundle 类型直接发对应明细
        if (meta && meta.effect === 'bundle') {
          // 学霸礼包内容：提示×20 + 跳过×5 + 双倍3天
          await conn.execute('UPDATE users SET hint_balance = hint_balance + 20, skip_balance = skip_balance + 5, xp_multiplier_until = GREATEST(COALESCE(xp_multiplier_until, NOW()), NOW()) + INTERVAL 3 DAY WHERE id=?', [req.user.id])
        }
      } else if (p.category === 'pet') {
        await conn.execute(
          'INSERT INTO user_pets (user_id, item_id) VALUES (?,?)',
          [req.user.id, product_id]
        )
      } else if (p.category === 'membership') {
        const days = (meta && meta.days) || 30
        await conn.execute(
          'UPDATE users SET is_member=1, member_until = GREATEST(COALESCE(member_until, NOW()), NOW()) + INTERVAL ? DAY WHERE id=?',
          [days, req.user.id]
        )
      }

      // 5. 订单记录
      const [orderResult] = await conn.execute(
        'INSERT INTO shop_orders (user_id, product_id, qty, cost_json, client_idempotent_id) VALUES (?,?,?,?,?)',
        [req.user.id, product_id, q, JSON.stringify(costs), client_idempotent_id]
      )

      await conn.commit()
      conn.release()

      const balance = await crystalState(req.user.id)
      const inv = await loadInventory(req.user.id)
      res.json({ ok: true, order_id: orderResult.insertId, new_balance: balance, inventory: inv })
    } catch (e) {
      try { await conn.rollback() } catch {}
      conn.release()
      console.error('[shop/buy]', e)
      res.status(500).json({ ok: false, error: 'SERVER_ERROR', message: e.message })
    }
  })

  // ─── 我的背包 ──────────────────────────────────────────────
  app.get('/api/shop/inventory', auth, async (req, res) => {
    try {
      const data = await loadInventory(req.user.id)
      res.json(data)
    } catch (e) { res.status(500).json({ error: e.message }) }
  })

  async function loadInventory(userId) {
    const [items] = await pool.execute(
      'SELECT item_id, count FROM user_inventory WHERE user_id=? AND count > 0',
      [userId]
    )
    const [pets] = await pool.execute(
      'SELECT item_id, owned_at FROM user_pets WHERE user_id=? ORDER BY owned_at DESC',
      [userId]
    )
    const [[eq]] = await pool.execute(
      'SELECT avatar, panda_skin, theme, flame_color FROM user_equipped WHERE user_id=?',
      [userId]
    )
    return {
      items, pets,
      equipped: eq || { avatar: null, panda_skin: null, theme: null, flame_color: null },
    }
  }

  // ─── 装备 ──────────────────────────────────────────────
  app.post('/api/shop/equip', auth, async (req, res) => {
    const { slot, item_id } = req.body || {}
    const VALID_SLOTS = ['avatar', 'panda_skin', 'theme', 'flame_color']
    if (!VALID_SLOTS.includes(slot)) return res.status(400).json({ ok: false, error: 'INVALID_SLOT' })

    try {
      // 校验拥有
      if (item_id) {
        const [[owned]] = await pool.execute(
          'SELECT 1 FROM user_pets WHERE user_id=? AND item_id=? UNION SELECT 1 FROM user_inventory WHERE user_id=? AND item_id=? AND count>0',
          [req.user.id, item_id, req.user.id, item_id]
        )
        if (!owned) return res.json({ ok: false, error: 'NOT_OWNED' })
      }
      await pool.execute(
        `INSERT INTO user_equipped (user_id, ${slot}) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE ${slot} = VALUES(${slot})`,
        [req.user.id, item_id || null]
      )
      const [[eq]] = await pool.execute('SELECT avatar, panda_skin, theme, flame_color FROM user_equipped WHERE user_id=?', [req.user.id])
      res.json({ ok: true, equipped: eq })
    } catch (e) {
      console.error('[shop/equip]', e)
      res.status(500).json({ ok: false, error: 'SERVER_ERROR', message: e.message })
    }
  })

  // ─── 使用道具 ──────────────────────────────────────────────
  app.post('/api/shop/inventory/use', auth, async (req, res) => {
    const { item_id } = req.body || {}
    if (!item_id) return res.status(400).json({ ok: false, error: 'MISSING_ITEM_ID' })

    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      // 1. 检查库存
      const [[inv]] = await conn.execute(
        'SELECT count FROM user_inventory WHERE user_id=? AND item_id=? FOR UPDATE',
        [req.user.id, item_id]
      )
      if (!inv || inv.count <= 0) {
        await conn.rollback(); conn.release()
        return res.json({ ok: false, error: 'OUT_OF_STOCK' })
      }

      // 2. 读商品 effect
      const [[p]] = await conn.execute(
        'SELECT meta FROM shop_products WHERE id=?',
        [item_id]
      )
      if (!p) { await conn.rollback(); conn.release(); return res.status(404).json({ ok: false, error: 'PRODUCT_NOT_FOUND' }) }
      const meta = p.meta ? (typeof p.meta === 'string' ? JSON.parse(p.meta) : p.meta) : {}

      // 3. 触发业务
      let effect = { type: meta.effect || 'unknown' }
      switch (meta.effect) {
        case 'freeze':
          // 冻结一天：把昨天的 streak 补上（如果今天没断的话就免单）
          // 这里简化：直接 +1 freeze_count，让 useXP 用
          await conn.execute('UPDATE users SET freeze_count = freeze_count + ? WHERE id=?', [meta.days || 1, req.user.id])
          effect.freeze_added = meta.days || 1
          break
        case 'xp_multi':
          const minutes = meta.minutes || 30
          await conn.execute(
            'UPDATE users SET xp_multiplier_until = GREATEST(COALESCE(xp_multiplier_until, NOW()), NOW()) + INTERVAL ? MINUTE WHERE id=?',
            [minutes, req.user.id]
          )
          effect.added_minutes = minutes
          break
        case 'hint':
          await conn.execute('UPDATE users SET hint_balance = hint_balance + ? WHERE id=?', [meta.count || 1, req.user.id])
          effect.hint_added = meta.count || 1
          break
        case 'skip':
          await conn.execute('UPDATE users SET skip_balance = skip_balance + ? WHERE id=?', [meta.count || 1, req.user.id])
          effect.skip_added = meta.count || 1
          break
        case 'retry':
          // 直跳复习面板，不需要服务端动作
          break
      }

      // 4. 扣库存
      await conn.execute('UPDATE user_inventory SET count = count - 1 WHERE user_id=? AND item_id=?', [req.user.id, item_id])

      await conn.commit()
      conn.release()
      res.json({ ok: true, remaining: inv.count - 1, effect })
    } catch (e) {
      try { await conn.rollback() } catch {}
      conn.release()
      console.error('[shop/inventory/use]', e)
      res.status(500).json({ ok: false, error: 'SERVER_ERROR', message: e.message })
    }
  })

  console.log('[shop] mounted /api/shop/* routes')
}
