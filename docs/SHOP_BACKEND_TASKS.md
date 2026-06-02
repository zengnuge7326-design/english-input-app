# Claude 后端任务清单

> 这是我（Claude）要做的后端 + 部署工作。

---

## 任务 1：数据库迁移

```sql
-- 商品目录（静态，初始化用 seed 数据）
CREATE TABLE IF NOT EXISTS shop_products (
  id VARCHAR(64) PRIMARY KEY,
  category ENUM('item','pet','membership') NOT NULL,
  tier VARCHAR(8) DEFAULT NULL,            -- N R SR SSR UR
  name VARCHAR(128) NOT NULL,
  description TEXT,
  icon VARCHAR(16) DEFAULT NULL,
  image_path VARCHAR(255) DEFAULT NULL,
  price_json JSON NOT NULL,                -- [{color, amount}, ...]
  rmb_price DECIMAL(10,2) DEFAULT NULL,
  stock_limit INT DEFAULT NULL,
  available TINYINT DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 用户背包：道具计数
CREATE TABLE IF NOT EXISTS user_inventory (
  user_id INT NOT NULL,
  item_id VARCHAR(64) NOT NULL,
  count INT NOT NULL DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, item_id),
  KEY idx_user (user_id)
);

-- 用户已拥有的宠物（永久）
CREATE TABLE IF NOT EXISTS user_pets (
  user_id INT NOT NULL,
  item_id VARCHAR(64) NOT NULL,
  owned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, item_id),
  KEY idx_user (user_id)
);

-- 当前装备槽
CREATE TABLE IF NOT EXISTS user_equipped (
  user_id INT PRIMARY KEY,
  avatar VARCHAR(64) DEFAULT NULL,
  panda_skin VARCHAR(64) DEFAULT NULL,
  theme VARCHAR(64) DEFAULT NULL,
  flame_color VARCHAR(32) DEFAULT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 购买订单（虚拟商品）
CREATE TABLE IF NOT EXISTS shop_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id VARCHAR(64) NOT NULL,
  qty INT DEFAULT 1,
  cost_json JSON NOT NULL,                 -- 实际扣的钻石明细
  client_idempotent_id VARCHAR(64) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_user (user_id, created_at),
  UNIQUE KEY uk_idempotent (user_id, client_idempotent_id)
);

-- 充值订单（真金白银，复用 orders 还是新表？）
-- 决定：新表 diamond_orders，和 orders 解耦
CREATE TABLE IF NOT EXISTS diamond_orders (
  order_id VARCHAR(64) PRIMARY KEY,
  user_id INT NOT NULL,
  pack_id VARCHAR(16) NOT NULL,            -- p1 p3 p10 p30
  rmb DECIMAL(10,2) NOT NULL,
  diamonds INT NOT NULL,
  status ENUM('pending','paid','failed','expired') DEFAULT 'pending',
  xunhu_trade_no VARCHAR(128) DEFAULT NULL,
  paid_at DATETIME DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_user (user_id),
  KEY idx_status (status)
);

-- 每日转盘
CREATE TABLE IF NOT EXISTS daily_spin_log (
  user_id INT NOT NULL,
  spin_date DATE NOT NULL,
  prize_json JSON NOT NULL,
  PRIMARY KEY (user_id, spin_date)
);
```

**Seed 数据：** 把 `SHOP_PLAN.md` 第三节的所有商品逐条 INSERT。

---

## 任务 2：API 实现

文件：`/www/wwwroot/api/index.js` 末尾追加

```
GET  /api/shop/products[?category=]      列商品
GET  /api/shop/recharge-packs            充值档（无需登录）
POST /api/shop/buy                       钻石购买
POST /api/shop/recharge/create           创建充值订单
GET  /api/shop/recharge/status/:id       查询状态
POST /api/shop/recharge/notify           迅虎回调
POST /api/shop/recharge/query/:id        主动核验
GET  /api/shop/inventory                 我的背包
POST /api/shop/equip                     装备
POST /api/shop/inventory/use             使用道具
POST /api/shop/daily-spin                每日转盘
```

**关键逻辑：**

### `POST /api/shop/buy`
```
1. 验登录
2. 读 product；不存在 → PRODUCT_NOT_FOUND
3. 检查 client_idempotent_id；已存在 → 返回原结果
4. 计算 cost = price * qty
5. 事务开始
   - 各 color SELECT FOR UPDATE 检查余额
   - 不够 → ROLLBACK，返回 INSUFFICIENT_DIAMOND
   - UPDATE users 减钻
   - INSERT shop_orders
   - 如果是 item → UPSERT user_inventory（count += qty）
   - 如果是 pet → INSERT user_pets
   - 如果是 membership → UPDATE users.member_until
   - INSERT crystal_log 流水
6. 事务提交
7. 返回 new_balance + inventory
```

### `POST /api/shop/recharge/create`
- 复用现有 `/api/payment/create` 大部分逻辑
- `product_type = 'diamond'`, `attach = pack_id`
- 创建 `diamond_orders` 行，状态 pending

### `POST /api/shop/recharge/notify`
- 验证签名
- 查 `diamond_orders.order_id`
- 状态非 pending → 直接 200 success（幂等）
- 更新 status=paid + paid_at
- `users.crystals_gold += diamonds`
- `crystal_log` 写一条 reason='recharge', meta={pack_id, order_id}

### `POST /api/shop/equip`
- 验证 item_id 在 `user_pets` 中
- UPSERT `user_equipped`
- 返回 equipped 状态

### `POST /api/shop/inventory/use`
- 检查库存 count > 0
- count--
- 触发对应业务：
  - `freeze_card_*` → 给昨天打卡（调 XP streak 续命逻辑）
  - `double_xp_*` → 写 `users.xp_multiplier_until = now + 30min/1week`，前端读后做计算
  - `hint_card_*` → user.hint_balance += N
  - `skip_card_*` → user.skip_balance += N
- 返回 effect 描述

### `POST /api/shop/daily-spin`
- 查今天是否已转过
- 随机奖品（权重表硬编码）
- INSERT daily_spin_log
- 发奖（增钻或加库存）
- 返回 prize

---

## 任务 3：useCrystal 中加上充值数据流

`src/hooks/useCrystal.js` 监听充值成功事件，刷新余额。

或简单点：充值成功后前端主动调 `GET /api/crystal/state` 刷新。

---

## 任务 4：库存生效集成

### 4.1 冻结卡 → useXP
现有 `useXP.js` 有 `freezes` 概念，但是固定的。改成读 `user_inventory.freeze_card_1` 计数显示。
使用时调 `/api/shop/inventory/use { item_id: 'freeze_card_1' }`，后端把今天/昨天断的连胜补上。

### 4.2 双倍 XP
`useXP.addXP(amount)` 调用前查 `xp_multiplier_until`，如果有效则 amount *= 2。
后端 `/api/xp/add` 也同步加倍。

### 4.3 提示卡
练习页（ExerciseView）顶部加"使用提示（剩 N）"按钮，库存为 0 时灰掉。

### 4.4 跳过卡
同上。

---

## 任务 5：部署

```bash
# 1. SSH 上服务器
ssh root@106.54.236.210

# 2. 跑 migration
cd /www/wwwroot/api
mysql -u root -p okenglish < migrations/shop.sql

# 3. 编辑 index.js 加入新路由
vim index.js

# 4. 重启
pm2 restart api

# 5. 验证
curl https://okenglish.site/api/shop/recharge-packs
```

---

## 完成顺序
1. 数据库 migration + seed
2. 商品列表 API（先让 Cursor 能拉到数据）
3. 购买 API（最复杂）
4. 装备 API
5. 充值 + 回调
6. 库存生效
7. 每日转盘

---

更新：2026-06-03
