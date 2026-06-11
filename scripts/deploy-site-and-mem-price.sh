#!/usr/bin/env bash
# 前端静态站 + 年度会员 30000 钻 SQL（需本机可 SSH 到服务器）
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REMOTE_USER="${DEPLOY_USER:-root}"
REMOTE_HOST="${DEPLOY_HOST:-106.54.236.210}"
REMOTE_DIR="${DEPLOY_DIR:-/www/wwwroot/english-app}"
DB_NAME="${DEPLOY_DB:-okenglish}"

echo "→ npm run build"
npm run build

echo "→ rsync dist/ -> ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/"
rsync -avz --delete --progress \
  -e "ssh -o BatchMode=no" \
  "dist/" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/"

echo "→ 更新年度会员价格为 30000 金钻"
ssh -o BatchMode=no "${REMOTE_USER}@${REMOTE_HOST}" \
  "mysql ${DB_NAME} -e \"UPDATE shop_products SET price_json='[{\\\"color\\\":\\\"gold\\\",\\\"amount\\\":30000}]' WHERE id='mem_year';\""

echo "→ 校验前端 bundle"
"$ROOT/scripts/verify-deploy.sh"

echo "完成。请强刷 https://okenglish.site 验证主卡按钮与商店会员价。"
