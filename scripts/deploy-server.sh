#!/usr/bin/env bash
# 将 Vite 产物同步到宝塔网站根目录
# 用法（在 Mac 上）:
#   chmod +x scripts/deploy-server.sh
#   DEPLOY_HOST=root@你的服务器IP DEPLOY_PATH=/www/wwwroot/你的站点目录 ./scripts/deploy-server.sh
#
# 示例:
#   DEPLOY_HOST=root@106.54.236.210 DEPLOY_PATH=/www/wwwroot/english-app ./scripts/deploy-server.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

: "${DEPLOY_HOST:?请先设置 DEPLOY_HOST，例如 root@106.54.236.210}"
: "${DEPLOY_PATH:?请先设置 DEPLOY_PATH，例如 /www/wwwroot/english-app}"

echo "==> npm run build"
npm run build

echo "==> rsync dist/ -> ${DEPLOY_HOST}:${DEPLOY_PATH}/"
rsync -avz --delete --progress \
  -e "ssh -o StrictHostKeyChecking=accept-new" \
  dist/ "${DEPLOY_HOST}:${DEPLOY_PATH}/"

echo "==> 完成。浏览器强刷 (Cmd+Shift+R) 再看网站。"
