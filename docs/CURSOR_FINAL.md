# Cursor 收尾任务 · 让购买的道具真正生效

> 后端 + 商店主体都已完成。这批任务让"花钱买的道具"真正能用起来。
> 用 Cursor Auto 模式即可。

---

## 任务 9：后端 — 每日转盘 API

**新建文件：** `server-deploy/routes/dailySpin.js`

完成后告诉 Claude，由 Claude 部署到服务器。

### 接口
```
POST /api/shop/daily-spin   需登录
```

### 业务逻辑
- 查 `daily_spin_log` 今天 (CURDATE()) 是否有 user_id+spin_date → 有 → 返回 `{ ok: false, error: 'ALREADY_SPUN_TODAY' }`
- 没转过 → 随机抽奖
- 抽中后：写 `daily_spin_log` + 加钻/加库存
- 返回 `{ ok: true, prize: {...}, next_spin_at: 明天 00:00 ISO 字符串 }`

### 奖池权重（请严格按此实现）
| 奖品 | 权重 | 数值 |
|---|---|---|
| 5 金钻 | 40 | gold +5 |
| 10 金钻 | 25 | gold +10 |
| 20 金钻 | 15 | gold +20 |
| 30 金钻 | 8 | gold +30 |
| 1 张冻结卡 | 7 | user_inventory.freeze_card_1 += 1 |
| 1 张提示卡 ×5 | 4 | user_inventory.hint_card_5 += 1 |
| 50 金钻（小概率）| 1 | gold +50 |

100% 中奖，无空奖。权重总和 = 100。

### 返回格式参考
```json
{
  "ok": true,
  "prize": {
    "type": "diamond",      // 或 "item"
    "color": "gold",        // type=diamond 时
    "amount": 10,           // type=diamond 时
    "item_id": "freeze_card_1",  // type=item 时
    "count": 1                    // type=item 时
  },
  "next_spin_at": "2026-06-04T00:00:00+08:00"
}
```

### 代码骨架（照着写）

```js
// server-deploy/routes/dailySpin.js
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

      // 1. 检查今天是否已转
      const [[exist]] = await conn.execute(
        'SELECT 1 FROM daily_spin_log WHERE user_id=? AND spin_date=CURDATE() FOR UPDATE',
        [req.user.id]
      )
      if (exist) {
        await conn.rollback(); conn.release()
        return res.json({ ok: false, error: 'ALREADY_SPUN_TODAY', next_spin_at: nextSpinAtISO() })
      }

      // 2. 抽奖
      const prize = rollPrize()

      // 3. 记录
      await conn.execute(
        'INSERT INTO daily_spin_log (user_id, spin_date, prize_json) VALUES (?, CURDATE(), ?)',
        [req.user.id, JSON.stringify(prize)]
      )

      // 4. 发奖
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
      try { await conn.rollback() } catch {}
      conn.release()
      console.error('[daily-spin]', e)
      res.status(500).json({ ok: false, error: 'SERVER_ERROR', message: e.message })
    }
  })

  console.log('[daily-spin] mounted /api/shop/daily-spin')
}
```

### ✅ 验证
完成后让 Claude 部署 + 测试。Claude 会跑：
- 第 1 次：返回奖品
- 第 2 次：返回 `ALREADY_SPUN_TODAY`
- 转 100 次（模拟），检查权重分布

---

## 任务 10：前端 — 让双倍 XP 真正生效

**修改文件：** `src/hooks/useXP.js`

### 改动点
1. 拉取 `/api/xp/state` 时把响应里的 `xp_multiplier_until` 字段也存进 state
2. 暴露一个新字段 `isDoubleXp`（计算属性：`new Date(xp_multiplier_until) > new Date()`）
3. `addXP(amount)` 调用时，**前端乐观更新**时检查 `isDoubleXp`，是 → 实际加 `amount * 2`
4. **服务端也要改**：让 `/api/xp/add` 检查用户的 `xp_multiplier_until` 字段，是有效 → 服务端也 *2

### 服务端改动（这部分让 Claude 做，Cursor 只需在 useXP.js 里改前端逻辑）

具体来说，Cursor 做的事：
```js
// useXP.js 已有的 state 加一个字段
const [xpMultiplierUntil, setXpMultiplierUntil] = useState(null)

// 拉 state 时
.then(d => {
  setState(d)
  setXpMultiplierUntil(d.xp_multiplier_until || null)
})

// 计算属性
const isDoubleXp = xpMultiplierUntil && new Date(xpMultiplierUntil) > new Date()

// 暴露
return { ..., isDoubleXp, xpMultiplierUntil }
```

### Dashboard 显示加成状态
**修改文件：** `src/components/Dashboard.jsx`

在「每日目标」附近增加一个小徽章：
```jsx
{xp.isDoubleXp && (
  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg animate-pulse">
    ⚡ 双倍 XP 生效中
  </span>
)}
```

### ✅ 验证
- 用测试账号 `shoptest1` 调一次 `/api/shop/inventory/use { item_id: 'double_xp_30m' }`
- 然后看首页是否出现 "⚡ 双倍 XP" 徽章
- 练习一句，XP 是否加 2 倍

---

## 任务 11：前端 — 练习页提示卡 / 跳过卡按钮

**修改文件：** `src/components/ExerciseView.jsx`（或对应的输入界面）

### 改动点

#### 1. 在练习页顶部加 2 个道具按钮
```jsx
{user.hint_balance > 0 && (
  <button onClick={useHint} className="...">
    💡 提示 ({user.hint_balance})
  </button>
)}
{user.skip_balance > 0 && (
  <button onClick={useSkip} className="...">
    🪄 跳过 ({user.skip_balance})
  </button>
)}
```

#### 2. 使用逻辑

**提示卡：**
```js
async function useHint() {
  // 1. 揭示当前词
  revealCurrentWord()
  // 2. 通知服务端扣 hint_balance
  await fetch(`${API}/user/use-hint`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
}
```

**跳过卡：**
```js
async function useSkip() {
  // 1. 跳到下一句
  nav.next()
  // 2. 通知服务端扣 skip_balance
  await fetch(`${API}/user/use-skip`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
}
```

### 服务端新增（让 Claude 做）

```
POST /api/user/use-hint   扣 hint_balance -1
POST /api/user/use-skip   扣 skip_balance -1
```

简单的 `UPDATE users SET hint_balance = GREATEST(hint_balance - 1, 0) WHERE id=?` 即可。

### 余额来源
`hint_balance` / `skip_balance` 应该已经在 `/api/login` 或某个 user 接口返回，没有的话让 Claude 加。

或者前端单独拉：
```
GET /api/user/balance → { hint_balance, skip_balance }
```

### ✅ 验证
- 用测试账号买 1 张「学霸礼包」（送 20 提示 + 5 跳过 + 双倍 3 天）
- 进入练习页，看到 "💡 提示 (20)" 按钮
- 点 → 揭示 + 余额变 19
- 同理跳过

---

## 完成顺序建议

1. **任务 9（每日转盘 API 代码）** ← 写成文件交给 Claude 部署
2. **任务 10 前端部分（useXP.js + Dashboard 徽章）** ← Cursor 独立完成
3. **任务 11 前端部分（练习页按钮）** ← Cursor 独立完成

任务 10 和 11 的**服务端 endpoint**由 Claude 补充，Cursor 只写前端调用。

---

## 完成后回复 Claude

> 收尾任务完成情况：
> - 任务 9 dailySpin.js: [文件创建情况]
> - 任务 10 useXP + Dashboard: [改动文件]
> - 任务 11 ExerciseView 按钮: [改动文件]
> 测试结果: [描述]
> 需要 Claude 补的后端: [列表]
