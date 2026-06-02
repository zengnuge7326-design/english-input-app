-- 水晶系统 schema
-- 部署到 okenglish.site 的 MySQL，库名 okenglish
-- 执行：mysql -u <user> -p okenglish < crystal.sql

-- ============================================================
-- 1) 用户表添加五色水晶 + 水晶塔等级
-- ============================================================
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS crystals_blue   INT NOT NULL DEFAULT 0  COMMENT '蓝水晶·完成单元',
  ADD COLUMN IF NOT EXISTS crystals_green  INT NOT NULL DEFAULT 0  COMMENT '绿水晶·零错误',
  ADD COLUMN IF NOT EXISTS crystals_red    INT NOT NULL DEFAULT 0  COMMENT '红水晶·错题复习',
  ADD COLUMN IF NOT EXISTS crystals_purple INT NOT NULL DEFAULT 0  COMMENT '紫水晶·连击',
  ADD COLUMN IF NOT EXISTS crystals_gold   INT NOT NULL DEFAULT 0  COMMENT '金水晶·会员专属',
  ADD COLUMN IF NOT EXISTS tower_level     INT NOT NULL DEFAULT 0  COMMENT '水晶塔层数';

-- ============================================================
-- 2) 水晶流水（防作弊 + 历史查询）
-- ============================================================
CREATE TABLE IF NOT EXISTS crystal_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  color ENUM('blue','green','red','purple','gold') NOT NULL,
  delta INT NOT NULL COMMENT '正=获得 负=消耗',
  reason VARCHAR(64) NOT NULL COMMENT 'unit_complete / combo_5 / combo_10 / sync_perfect / redeem_xxx ...',
  meta JSON NULL COMMENT '附加字段，如单元名',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_time (user_id, created_at),
  INDEX idx_user_color (user_id, color)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
