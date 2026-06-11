#!/usr/bin/env bash
# 部署 P0 审计修复（recharge bonus / 钻石买会员返佣 / 频控 / earn 事务）
#
# 用法：
#   ./scripts/deploy-p0-fixes.sh
#
# 部署后必须做：
#   1. 在服务器执行：pm2 restart okenglish-api
#   2. 测一笔 1 元充值，验证 +500 颗（如果 p1 有 bonus 也应包含）

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REMOTE_USER="${DEPLOY_USER:-root}"
REMOTE_HOST="${DEPLOY_HOST:-106.54.236.210}"
REMOTE_BACKEND="${DEPLOY_BACKEND:-/www/wwwroot/api}"

echo "→ rsync 4 个修复文件"
rsync -avz -e "ssh -o BatchMode=no" \
  server-deploy/lib/rechargePacks.js \
  "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_BACKEND}/lib/"

rsync -avz -e "ssh -o BatchMode=no" \
  server-deploy/lib/referralCommission.js \
  "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_BACKEND}/lib/"

rsync -avz -e "ssh -o BatchMode=no" \
  server-deploy/routes/recharge.js \
  "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_BACKEND}/routes/"

rsync -avz -e "ssh -o BatchMode=no" \
  server-deploy/routes/shop.js \
  "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_BACKEND}/routes/"

rsync -avz -e "ssh -o BatchMode=no" \
  server-deploy/crystal-routes.js \
  "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_BACKEND}/routes/crystal.js"

cat <<'EOF'

────────────────────────────────────────────────
✅ 已同步 5 个修复文件：
   - lib/rechargePacks.js    (新增 · 单一来源)
   - lib/referralCommission.js
   - routes/recharge.js      (修 #1 #11)
   - routes/shop.js          (修 #2)
   - routes/crystal.js       (修 #3 #4 #5)

接下来：
   ssh root@106.54.236.210 'pm2 restart okenglish-api --update-env'

验证：
   1. 创建一笔 ¥3 充值订单，看 title 是否含 "(含 100 赠送)"
   2. 完成支付后看 diamond_orders.diamonds 是否 = 1700（1600 + 100）
   3. 用金钻买年度会员（如果有），看 referral_commissions 是否生成新记录
   4. 模拟连续 earn 100 次，看是否 429（之前因为按 reason 维度不会触发）
────────────────────────────────────────────────
EOF
