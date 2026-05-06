#!/usr/bin/env bash
# 将 Vite 构建结果同步到 OK 英语站点静态目录（默认与你当前可用的 rsync 一致）
#
# 在主仓库根目录执行：
#   ./scripts/deploy-site.sh
#
# 若在 Claude worktree 里开发，先 cd 到该目录再执行同脚本，或：
#   (cd /path/to/worktree && ./scripts/deploy-site.sh)
# worktree 内需存在 scripts/（可复制脚本）或用下方「一条命令」从 worktree 构建上传。
#
# 覆盖默认主机或路径：
#   DEPLOY_HOST=x.x.x.x DEPLOY_DIR=/www/wwwroot/other ./scripts/deploy-site.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REMOTE_USER="${DEPLOY_USER:-root}"
REMOTE_HOST="${DEPLOY_HOST:-106.54.236.210}"
REMOTE_DIR="${DEPLOY_DIR:-/www/wwwroot/english-app}"

echo "→ npm run build"
npm run build

echo "→ rsync dist/ -> ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/"
rsync -avz --delete --progress \
  -e "ssh -o BatchMode=no" \
  "dist/" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/"

echo "完成。请浏览器强刷 https://okenglish.site 验证。"
