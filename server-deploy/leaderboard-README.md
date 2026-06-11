# 排行榜 后端部署

## 1. 上传路由文件

把 `server-deploy/routes/leaderboard.js` 复制到服务器：
```
/www/wwwroot/api/routes/leaderboard.js
```

## 2. 挂载到 server (index.js / app.js)

需要一个「可选登录」中间件——解析 token 时写入 `req.userId`，未登录不报 401：

```js
function optionalAuth(req, res, next) {
  const auth = req.headers.authorization || ''
  const m = auth.match(/^Bearer (.+)$/)
  if (m) {
    try {
      const decoded = jwt.verify(m[1], JWT_SECRET)
      req.userId = decoded.userId || decoded.id
    } catch { /* 忽略 */ }
  }
  next()
}

const leaderboardRoutes = require('./routes/leaderboard')
app.use('/api/leaderboard', leaderboardRoutes(pool, optionalAuth))
```

## 3. 重启

```bash
pm2 restart okenglish-api
```

## 4. 自检

```bash
# 未登录可访问
curl https://okenglish.site/api/leaderboard/total
curl https://okenglish.site/api/leaderboard/today

# 登录后 myRank/myXp 应有值
curl -H "Authorization: Bearer <jwt>" https://okenglish.site/api/leaderboard/total
```

返回格式：
```json
{
  "list": [{ "rank": 1, "userId": 12, "username": "alice", "xp": 1234, "streak": 7 }, ...],
  "myRank": 42,
  "myXp": 156
}
```

`/today` 多一个字段 `date` 表示榜单日期。

## 性能注意

如果 `users` 表很大，建议加索引：
```sql
ALTER TABLE users ADD INDEX idx_total_xp (total_xp);
ALTER TABLE xp_daily ADD INDEX idx_date_xp (date, xp);
```
