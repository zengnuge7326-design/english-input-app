/**
 * 钻石充值流程 · v1.0
 * 复用现有迅虎支付（XUNHU），写入独立的 diamond_orders 表，避免污染会员订单。
 *
 * 挂载方式：
 *   require('./routes/recharge')({
 *     app, pool, auth, crystalState,
 *     XUNHU_APPID, XUNHU_APPSECRET, XUNHU_API, SITE_URL,
 *     xunhuSign, httpsPost,
 *   })
 */

module.exports = function mountRecharge({
  app, pool, auth, crystalState,
  XUNHU_APPID, XUNHU_APPSECRET, XUNHU_API, SITE_URL,
  xunhuSign, httpsPost,
}) {

  // 单一来源：lib/rechargePacks.js（修复双定义不一致 + bonus 漏发）
  const { getPack, totalDiamonds } = require('../lib/rechargePacks')
  const _crypto = require('crypto')

  // ─── 创建充值订单 ─────────────────────────────────────
  app.post('/api/shop/recharge/create', auth, async (req, res) => {
    const { pack_id } = req.body || {}
    const pack = getPack(pack_id)
    if (!pack) return res.status(400).json({ ok: false, error: 'INVALID_PACK' })

    const totalDmd = totalDiamonds(pack)  // ✅ 含 bonus
    const orderId = `diamond_${req.user.id}_${pack_id}_${Date.now()}`

    try {
      // diamonds 列存"应到账总数"，便于 notify/query 直接发
      await pool.execute(
        'INSERT INTO diamond_orders (order_id, user_id, pack_id, rmb, diamonds, status) VALUES (?,?,?,?,?,?)',
        [orderId, req.user.id, pack_id, pack.rmb, totalDmd, 'pending']
      )
    } catch (e) {
      console.error('[recharge/create] db', e)
      return res.status(500).json({ ok: false, error: 'CREATE_ORDER_FAILED' })
    }

    const params = {
      version: '1.1',
      appid: XUNHU_APPID,
      trade_order_id: orderId,
      total_fee: pack.rmb.toFixed(2),
      title: `OK英语 · ${totalDmd} 金钻${pack.bonus ? ` (含 ${pack.bonus} 赠送)` : ''}`,
      time: String(Math.floor(Date.now() / 1000)),
      notify_url: `${SITE_URL}/api/shop/recharge/notify`,
      return_url: `${SITE_URL}/?diamond_order=${encodeURIComponent(orderId)}`,
      nonce_str: _crypto.randomBytes(8).toString('hex'),
    }
    params.hash = xunhuSign(params, XUNHU_APPSECRET)

    try {
      const result = await httpsPost(XUNHU_API, params)
      if (result.errcode !== 0) {
        return res.status(502).json({ ok: false, error: 'XUNHU_ERROR', message: result.errmsg || '支付接口错误' })
      }
      res.json({
        ok: true,
        order_id: orderId,
        rmb: pack.rmb,
        diamonds: totalDmd,
        base: pack.diamonds,
        bonus: pack.bonus,
        url: result.url,
        qrcode: result.url_qrcode,
      })
    } catch (e) {
      console.error('[recharge/create] xunhu', e)
      res.status(502).json({ ok: false, error: 'CONNECT_FAILED', message: e.message })
    }
  })

  /**
   * 把订单标已付 + 发钻（notify 和 query 共用，避免逻辑分叉）
   * @returns {Promise<{credited:boolean, alreadyPaid:boolean, diamonds:number}>}
   */
  async function creditPaidOrder({ orderId, tradeNo, via }) {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
      const [[order]] = await conn.execute('SELECT * FROM diamond_orders WHERE order_id=? FOR UPDATE', [orderId])
      if (!order) { await conn.rollback(); conn.release(); return { credited: false, error: 'NOT_FOUND' } }
      if (order.status === 'paid') {
        await conn.commit(); conn.release()
        return { credited: false, alreadyPaid: true, diamonds: order.diamonds }
      }
      await conn.execute(
        'UPDATE diamond_orders SET status="paid", xunhu_trade_no=?, paid_at=NOW() WHERE order_id=?',
        [tradeNo || '', orderId]
      )
      await conn.execute(
        'UPDATE users SET crystals_gold = crystals_gold + ? WHERE id=?',
        [order.diamonds, order.user_id]
      )
      await conn.execute(
        'INSERT INTO crystal_log (user_id, color, delta, reason, meta) VALUES (?, "gold", ?, "recharge", ?)',
        [order.user_id, order.diamonds, JSON.stringify({ pack_id: order.pack_id, order_id: orderId, rmb: order.rmb, via: via || 'notify' })]
      )
      await conn.commit()
      conn.release()
      console.log(`[recharge] paid: user=${order.user_id} pack=${order.pack_id} +${order.diamonds}💎 (via ${via})`)
      return { credited: true, diamonds: order.diamonds, userId: order.user_id }
    } catch (e) {
      try { await conn.rollback() } catch {}
      conn.release()
      throw e
    }
  }

  // ─── 迅虎回调（自动发钻） ─────────────────────────────────────
  app.post('/api/shop/recharge/notify', async (req, res) => {
    const data = req.body
    if (!data || !data.hash) return res.send('fail')
    const sign = xunhuSign(data, XUNHU_APPSECRET)
    if (sign !== data.hash) {
      console.warn('[recharge/notify] hash mismatch', { ip: req.ip, orderId: data.out_trade_num })
      return res.send('fail')
    }
    if (data.status !== 'OD') return res.send('success')

    const orderId = data.out_trade_num
    if (!orderId || !orderId.startsWith('diamond_')) return res.send('fail')

    // 校验金额（防伪造）
    try {
      const [[order]] = await pool.execute('SELECT rmb, user_id FROM diamond_orders WHERE order_id=?', [orderId])
      if (!order) return res.send('fail')
      if (Math.abs(parseFloat(data.total_fee) - parseFloat(order.rmb)) > 0.01) {
        console.error('[recharge/notify] amount mismatch — possible fraud', {
          expected: order.rmb, got: data.total_fee, orderId, userId: order.user_id, ip: req.ip,
        })
        return res.send('fail')
      }
      await creditPaidOrder({ orderId, tradeNo: data.trade_no, via: 'notify' })
      res.send('success')
    } catch (e) {
      console.error('[recharge/notify]', e)
      res.send('fail')
    }
  })

  // ─── 前端轮询订单状态 ─────────────────────────────────────
  app.get('/api/shop/recharge/status/:order_id', auth, async (req, res) => {
    try {
      const [[order]] = await pool.execute(
        'SELECT status, diamonds, rmb, paid_at FROM diamond_orders WHERE order_id=? AND user_id=?',
        [req.params.order_id, req.user.id]
      )
      if (!order) return res.status(404).json({ ok: false, error: 'ORDER_NOT_FOUND' })
      res.json({ ok: true, status: order.status, diamonds: order.diamonds, rmb: order.rmb, paid_at: order.paid_at })
    } catch (e) {
      res.status(500).json({ ok: false, error: 'SERVER_ERROR', message: e.message })
    }
  })

  // ─── 主动核验（"我已支付"按钮触发） ─────────────────────────────
  app.post('/api/shop/recharge/query/:order_id', auth, async (req, res) => {
    const orderId = req.params.order_id
    try {
      const [[order]] = await pool.execute(
        'SELECT * FROM diamond_orders WHERE order_id=? AND user_id=?',
        [orderId, req.user.id]
      )
      if (!order) return res.status(404).json({ ok: false, error: 'ORDER_NOT_FOUND' })
      if (order.status === 'paid') {
        return res.json({ ok: true, status: 'paid', diamonds: order.diamonds })
      }

      // 主动向迅虎查询
      const params = {
        appid: XUNHU_APPID,
        out_trade_order: orderId,
        time: String(Math.floor(Date.now() / 1000)),
        nonce_str: _crypto.randomBytes(8).toString('hex'),
      }
      params.hash = xunhuSign(params, XUNHU_APPSECRET)
      const result = await httpsPost('https://api.xunhupay.com/payment/query.html', params)

      if (result.errcode === 0 && result.data && result.data.status === 'OD') {
        // 已支付 → 走 creditPaidOrder 共用逻辑
        await creditPaidOrder({
          orderId,
          tradeNo: result.data.transaction_id || '',
          via: 'query',
        })
        return res.json({ ok: true, status: 'paid', diamonds: order.diamonds })
      }

      res.json({ ok: true, status: 'pending', message: '查询中，请稍候' })
    } catch (e) {
      console.error('[recharge/query]', e)
      res.status(500).json({ ok: false, error: 'SERVER_ERROR', message: e.message })
    }
  })

  console.log('[recharge] mounted /api/shop/recharge/* routes')
}
