# 解锁系统 后端部署

## 1. 跑迁移
```bash
mysql -u <user> -p okenglish < server-deploy/migrations/unlocks.sql
```

## 2. 上传路由文件
```
server-deploy/routes/unlock.js → /www/wwwroot/api/routes/unlock.js
```

## 3. 挂载（index.js / app.js）
```js
const unlockRoutes = require('./routes/unlock')
app.use('/api/unlock', unlockRoutes(pool, authMiddleware))
```

## 4. 重启
```bash
pm2 restart okenglish-api
```

## 5. 自检
```bash
# 必须带 token
TOKEN="..."
curl -H "Authorization: Bearer $TOKEN" https://okenglish.site/api/unlock/state

# 解锁一个课程
curl -X POST https://okenglish.site/api/unlock \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"scope":"course","item_id":"unit_3","cost":50,"color":"blue"}'
```

## 接口规范

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/api/unlock/state` | — | `{ unlocks: { course: { unit_3: { cost, color, at } } } }` |
| POST | `/api/unlock` | `{ scope, item_id, cost, color }` | `{ ok, free, cost }` 或 `402 insufficient_crystals` |

### scope 取值
- `course` — 课程广场的课程（unit_X）
- `book` — 教材同步的册（grade4_up）
- `grammar` — 语法专项
- `vocab_unit` — 单词单元
- `alphabet` — 字母（item_id='back10' 一次性解锁后10个）
- `phoneme` — 音标（同上）

### 业务规则
- 会员（is_member 且未过期）→ 解锁 0 cost
- 余额不足 → 402，前端弹出"水晶不够"
- 同一 (user, scope, item_id) 重复请求 → 幂等返回 ok:true, already:true
