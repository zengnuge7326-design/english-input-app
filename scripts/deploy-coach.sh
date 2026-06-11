#!/usr/bin/env bash
# 部署 AI Coach 路由到服务器（智谱 GLM-4-Flash 代理）
#
# 用法：
#   ZHIPU_API_KEY=your-key ./scripts/deploy-coach.sh
#
# 首次部署会：
# 1. 把 server-deploy/routes/coach.js 同步到服务器
# 2. 把 ZHIPU_API_KEY 写进服务器 ~/.bashrc（如未设置）
# 3. 提示你在服务器 index.js 末尾加 mount 调用并 pm2 restart

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REMOTE_USER="${DEPLOY_USER:-root}"
REMOTE_HOST="${DEPLOY_HOST:-106.54.236.210}"
REMOTE_BACKEND="${DEPLOY_BACKEND:-/www/wwwroot/api/server-deploy}"

if [[ -z "${ZHIPU_API_KEY:-}" ]]; then
  echo "⚠️  ZHIPU_API_KEY 未设置（跳过 env 写入；如果第一次部署请用 ZHIPU_API_KEY=xxx ./scripts/deploy-coach.sh）"
fi

echo "→ 检查远端目录 ${REMOTE_BACKEND}"
if ! ssh -o BatchMode=no "${REMOTE_USER}@${REMOTE_HOST}" "test -d ${REMOTE_BACKEND}/routes"; then
  echo "❌ 远端目录 ${REMOTE_BACKEND}/routes 不存在"
  echo "   请先确认 server-deploy 实际部署在哪里："
  echo "   ssh ${REMOTE_USER}@${REMOTE_HOST} 'find /www -name \"shop.js\" -path \"*routes*\" 2>/dev/null'"
  echo "   然后用：DEPLOY_BACKEND=/正确/路径 ./scripts/deploy-coach.sh"
  exit 1
fi

echo "→ rsync coach.js -> ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_BACKEND}/routes/"
rsync -avz \
  -e "ssh -o BatchMode=no" \
  server-deploy/routes/coach.js \
  "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_BACKEND}/routes/"

if [[ -n "${ZHIPU_API_KEY:-}" ]]; then
  echo "→ 写入 ZHIPU_API_KEY 到服务器环境"
  ssh -o BatchMode=no "${REMOTE_USER}@${REMOTE_HOST}" "
    grep -q '^export ZHIPU_API_KEY=' /root/.bashrc 2>/dev/null \
      && sed -i 's|^export ZHIPU_API_KEY=.*|export ZHIPU_API_KEY=${ZHIPU_API_KEY}|' /root/.bashrc \
      || echo 'export ZHIPU_API_KEY=${ZHIPU_API_KEY}' >> /root/.bashrc
    # 也写入 pm2 ecosystem（如有）
    pm2 set ZHIPU_API_KEY '${ZHIPU_API_KEY}' 2>/dev/null || true
  "
fi

cat <<'EOF'

────────────────────────────────────────────────
✅ coach.js 已同步。接下来手动一次性配置：

1) 在服务器 index.js 文件末尾加（如未加过）：
   require('./routes/coach')({ app, pool, auth })

2) 重启 PM2，并把环境变量带进进程：
   ZHIPU_API_KEY=xxx pm2 restart your-app --update-env

3) 验证：
   curl https://okenglish.site/api/coach/health

后续修改 coach.js 只需重跑本脚本（不带 ZHIPU_API_KEY 也行）。
────────────────────────────────────────────────
EOF
