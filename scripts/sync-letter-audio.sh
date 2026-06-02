#!/usr/bin/env bash
# 同步字母音频到服务器（主 deploy 常 --exclude='audio'，需单独推送 letters）
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REMOTE_USER="${DEPLOY_USER:-root}"
REMOTE_HOST="${DEPLOY_HOST:-106.54.236.210}"
REMOTE_DIR="${DEPLOY_DIR:-/www/wwwroot/english-app}"

echo "→ rsync public/audio/letters/ -> ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/audio/letters/"
rsync -avz --progress \
  -e "ssh -o BatchMode=no" \
  "${ROOT}/public/audio/letters/" \
  "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/audio/letters/"

echo "完成。请强刷后测试 26 字母 → B。"
