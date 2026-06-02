-- ════════════════════════════════════════════════════════════
-- 钻石商店 schema · v1.0 · 2026-06-03
-- 命名说明：水晶 → 钻石（仅 UI 文案），代号/字段保持 crystal/crystals_*
-- ════════════════════════════════════════════════════════════

-- 商品目录（静态，运营在此 INSERT）
CREATE TABLE IF NOT EXISTS shop_products (
  id VARCHAR(64) PRIMARY KEY,
  category ENUM('item','pet','membership','recharge') NOT NULL,
  tier VARCHAR(8) DEFAULT NULL COMMENT 'N R SR SSR UR (仅 pet)',
  name VARCHAR(128) NOT NULL,
  description TEXT,
  icon VARCHAR(16) DEFAULT NULL,
  image_path VARCHAR(255) DEFAULT NULL,
  price_json JSON NOT NULL COMMENT '[{color, amount}]',
  rmb_price DECIMAL(10,2) DEFAULT NULL,
  stock_limit INT DEFAULT NULL,
  available TINYINT DEFAULT 1,
  sort_order INT DEFAULT 0,
  meta JSON DEFAULT NULL COMMENT '业务元数据，如 freeze_days, hint_count',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_cat (category, available, sort_order)
);

-- 用户背包：道具计数
CREATE TABLE IF NOT EXISTS user_inventory (
  user_id INT NOT NULL,
  item_id VARCHAR(64) NOT NULL,
  count INT NOT NULL DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, item_id)
);

-- 用户已拥有的宠物（永久）
CREATE TABLE IF NOT EXISTS user_pets (
  user_id INT NOT NULL,
  item_id VARCHAR(64) NOT NULL,
  owned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, item_id)
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

-- 钻石购买虚拟商品订单
CREATE TABLE IF NOT EXISTS shop_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id VARCHAR(64) NOT NULL,
  qty INT DEFAULT 1,
  cost_json JSON NOT NULL,
  client_idempotent_id VARCHAR(64) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_user (user_id, created_at),
  UNIQUE KEY uk_idempotent (user_id, client_idempotent_id)
);

-- 真金充值订单（金钻石）
CREATE TABLE IF NOT EXISTS diamond_orders (
  order_id VARCHAR(64) PRIMARY KEY,
  user_id INT NOT NULL,
  pack_id VARCHAR(16) NOT NULL,
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

-- ═══════════════════════════════════════════════════════════
-- users 表加几个字段（手工，老 MySQL 无 IF NOT EXISTS）
-- 跑前请先 SELECT 看一眼，已有就别再加
-- ═══════════════════════════════════════════════════════════
-- ALTER TABLE users ADD COLUMN hint_balance INT DEFAULT 0;
-- ALTER TABLE users ADD COLUMN skip_balance INT DEFAULT 0;
-- ALTER TABLE users ADD COLUMN xp_multiplier_until DATETIME DEFAULT NULL;
