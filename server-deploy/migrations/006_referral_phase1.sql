-- ════════════════════════════════════════════════════════════
-- 推荐返佣 Phase 1 · 数据层
-- 2026 · 40% 返佣 + 30 天冷静期 + 状态机 + 审计
-- ════════════════════════════════════════════════════════════
-- 状态机：pending (冷静期内) → settled (待付) → paid (已付)
-- 异常：reversed (退款后冲销) / suspicious (反作弊标记)

-- ─── 1. 扩展现有 referral_commissions 表 ─────────────────────
-- 若表不存在，先创建（兼容首次部署）
CREATE TABLE IF NOT EXISTS referral_commissions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  referrer_id INT NOT NULL,
  referred_user_id INT NOT NULL,
  order_id VARCHAR(64) NOT NULL,
  plan VARCHAR(32),
  amount DECIMAL(10,2) NOT NULL,
  rate DECIMAL(5,2) NOT NULL DEFAULT 0.40,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_referrer (referrer_id),
  INDEX idx_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 加入状态、冷静期、结算时间等字段（如已存在则忽略错误）
ALTER TABLE referral_commissions
  ADD COLUMN IF NOT EXISTS status ENUM('pending','settled','paid','reversed','suspicious') NOT NULL DEFAULT 'pending' AFTER rate,
  ADD COLUMN IF NOT EXISTS cooldown_until DATETIME NULL AFTER status,
  ADD COLUMN IF NOT EXISTS settled_at DATETIME NULL AFTER cooldown_until,
  ADD COLUMN IF NOT EXISTS paid_at DATETIME NULL AFTER settled_at,
  ADD COLUMN IF NOT EXISTS paid_method VARCHAR(20) NULL AFTER paid_at,
  ADD COLUMN IF NOT EXISTS paid_txn_note VARCHAR(255) NULL AFTER paid_method,
  ADD COLUMN IF NOT EXISTS paid_by_admin VARCHAR(64) NULL AFTER paid_txn_note,
  ADD INDEX IF NOT EXISTS idx_status (status),
  ADD INDEX IF NOT EXISTS idx_cooldown (cooldown_until);

-- 老数据兜底：把 status 为 NULL 的记录置为 paid（默认全部已结算，避免历史数据进入冷静期）
UPDATE referral_commissions SET status='paid', paid_at=created_at WHERE status IS NULL OR status='';

-- ─── 2. 邀请关系表（独立追踪，附 IP/UA 反作弊证据）─────────
CREATE TABLE IF NOT EXISTS referral_relationships (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  inviter_user_id INT NOT NULL,             -- 邀请人（创始会员）
  invitee_user_id INT NOT NULL UNIQUE,      -- 被邀请人（一人只能被绑定一次）
  ref_code VARCHAR(32) NOT NULL,            -- 注册时填的邀请码
  invitee_ip VARCHAR(64),                   -- 注册 IP
  invitee_ua VARCHAR(255),                  -- 用户代理
  status ENUM('active','suspicious','disabled') NOT NULL DEFAULT 'active',
  flagged_reason VARCHAR(255) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_inviter (inviter_user_id, created_at),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 老数据迁移：从 users.referred_by 填充
INSERT IGNORE INTO referral_relationships (inviter_user_id, invitee_user_id, ref_code, status, created_at)
  SELECT referred_by, id, '_legacy', 'active', created_at
  FROM users
  WHERE referred_by IS NOT NULL AND referred_by > 0;

-- ─── 3. 管理员审计日志（不可改写的流水）─────────────────────
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  admin_user VARCHAR(64) NOT NULL,          -- 操作者标识
  action VARCHAR(64) NOT NULL,              -- 'mark_paid' / 'flag' / 'reverse' / ...
  target_type VARCHAR(32),                  -- 'commission' / 'relationship' / 'user'
  target_id BIGINT,
  details JSON,
  ip VARCHAR(64),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_admin_date (admin_user, created_at),
  INDEX idx_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ════════════════════════════════════════════════════════════
-- 应用建议
-- ════════════════════════════════════════════════════════════
-- 1) creditReferralCommission 改成插入 status='pending', cooldown_until=NOW()+INTERVAL 30 DAY
-- 2) 每日 cron 跑：
--    UPDATE referral_commissions
--    SET status='settled', settled_at=NOW()
--    WHERE status='pending' AND cooldown_until <= NOW();
-- 3) 手动结账后用 /api/admin/commission/mark-paid 接口标记
