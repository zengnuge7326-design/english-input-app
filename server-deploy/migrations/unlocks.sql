-- 解锁系统
-- 用户为某关卡 / 单元 / 课程 花费水晶后写入一条记录，以后永久解锁

CREATE TABLE IF NOT EXISTS unlocks (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  scope VARCHAR(32) NOT NULL,        -- 'course' | 'book' | 'grammar' | 'vocab_unit' | 'alphabet' | 'phoneme'
  item_id VARCHAR(64) NOT NULL,       -- 业务侧标识，如 'grade4_up', 'unit_3', 'present_perfect' 等
  cost INT NOT NULL DEFAULT 0,
  paid_color VARCHAR(8) NOT NULL DEFAULT 'blue',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_item (user_id, scope, item_id),
  KEY idx_user (user_id)
);

-- 可选：写一条流水日志（不强制）
CREATE TABLE IF NOT EXISTS unlock_log (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  scope VARCHAR(32) NOT NULL,
  item_id VARCHAR(64) NOT NULL,
  cost INT NOT NULL,
  paid_color VARCHAR(8) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_user_time (user_id, created_at)
);
