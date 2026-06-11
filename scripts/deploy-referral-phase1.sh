#!/usr/bin/env bash
# Phase 1 部署：推荐返佣数据层 + 管理 API
#
# 用法：
#   ADMIN_API_KEY=$(openssl rand -hex 32) ./scripts/deploy-referral-phase1.sh
#
# 首次部署：必须带 ADMIN_API_KEY（写入服务器环境）
# 后续更新代码：直接跑（不带 ADMIN_API_KEY 也可）

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REMOTE_USER="${DEPLOY_USER:-root}"
REMOTE_HOST="${DEPLOY_HOST:-106.54.236.210}"
REMOTE_BACKEND="${DEPLOY_BACKEND:-/www/wwwroot/api}"
DB_NAME="${DEPLOY_DB:-okenglish}"

echo "→ 1) rsync 后端文件"
rsync -avz -e "ssh -o BatchMode=no" \
  server-deploy/lib/referralCommission.js \
  "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_BACKEND}/lib/"
rsync -avz -e "ssh -o BatchMode=no" \
  server-deploy/routes/referralAdmin.js \
  "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_BACKEND}/routes/"
rsync -avz -e "ssh -o BatchMode=no" \
  server-deploy/migrations/006_referral_phase1.sql \
  "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_BACKEND}/migrations/"

echo "→ 2) 执行数据库迁移"
ssh -o BatchMode=no "${REMOTE_USER}@${REMOTE_HOST}" "
  mysql ${DB_NAME} < ${REMOTE_BACKEND}/migrations/006_referral_phase1.sql
" || { echo "⚠️ migration 失败（可能字段已存在，需手动核对）"; }

if [[ -n "${ADMIN_API_KEY:-}" ]]; then
  echo "→ 3) 写入 ADMIN_API_KEY"
  ssh -o BatchMode=no "${REMOTE_USER}@${REMOTE_HOST}" "
    grep -q '^export ADMIN_API_KEY=' /root/.bashrc 2>/dev/null \
      && sed -i 's|^export ADMIN_API_KEY=.*|export ADMIN_API_KEY=${ADMIN_API_KEY}|' /root/.bashrc \
      || echo 'export ADMIN_API_KEY=${ADMIN_API_KEY}' >> /root/.bashrc
  "
fi

cat <<'EOF'

────────────────────────────────────────────────
✅ Phase 1 文件已同步、迁移已执行。手动一次性配置：

1) 在服务器 /www/wwwroot/api/index.js 末尾加：
   require('./routes/referralAdmin')({ app, pool, auth })

2) 重启 PM2，把 ADMIN_API_KEY 带进进程：
   ADMIN_API_KEY=刚才的key pm2 restart okenglish-api --update-env

3) 验证管理接口：
   ADMIN_KEY=刚才的key ./scripts/admin-commission.sh list-settled

4) 建议加每日 cron，把冷静期到的转待付：
   ssh root@106.54.236.210 'crontab -l 2>/dev/null; echo "5 4 * * * curl -sX POST -H \"X-Admin-Key: \$ADMIN_API_KEY\" https://okenglish.site/api/admin/commission/promote-pending"'
────────────────────────────────────────────────
EOF
