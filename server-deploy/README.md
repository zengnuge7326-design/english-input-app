# 水晶系统 后端部署

## 步骤

### 1. 跑数据库迁移
登录服务器后：
```bash
mysql -u <user> -p okenglish < crystal.sql
```

### 2. 部署路由
把 `crystal-routes.js` 放到后端的 `routes/crystal.js`，然后在 `server.js`（或 `app.js`）添加：

```js
const createCrystalRoutes = require('./routes/crystal')
// authMiddleware 是你已有的 JWT 中间件，会把 req.userId 设置好
app.use('/api/crystal', createCrystalRoutes(pool, authMiddleware))
```

### 3. 重启 PM2
```bash
pm2 restart okenglish-api
```

### 4. 自检
```bash
# 没 token 应返回 401
curl https://okenglish.site/api/crystal/state

# 带 token 应返回 5色 + total + towerLevel
curl -H "Authorization: Bearer <jwt>" https://okenglish.site/api/crystal/state
```

## 接口规范

| Method | Path | Body | Response |
|--------|------|------|----------|
| GET | `/api/crystal/state` | — | `{blue, green, red, purple, gold, total, towerLevel}` |
| POST | `/api/crystal/earn` | `{color, amount, reason, meta?}` | 同上（最新状态） |
| POST | `/api/crystal/spend` | `{color, amount, reason, meta?}` | 同上 |
| GET | `/api/crystal/log?limit=20` | — | `{items: [{color, delta, reason, created_at}]}` |

**color**: `blue | green | red | purple | gold`
**amount**: earn 1..50，spend 1..500
**reason**: 字符串，≤64 字符，建议规范：
- `unit_complete` 完成一个单元
- `combo_5` / `combo_10` 连击
- `sync_perfect` 同步习题全对
- `sync_done` 同步习题完成
- `redeem_pet` / `redeem_theme` 兑换道具
- `daily_login` 每日首次登录（可选）

## 每日转盘（任务 9）

把 `routes/dailySpin.js` 挂到主入口（与 shop 相同方式）：

```js
require('./routes/dailySpin')({ app, pool, auth })
```

接口：`POST /api/shop/daily-spin`（需登录）

---

## 反作弊
- 每分钟同一 user+reason 最多 30 次（429 限流）
- spend 用 `FOR UPDATE` 行锁 + 事务
- amount 客户端可控但被服务端 clamp
