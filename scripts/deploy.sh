#!/usr/bin/env bash
###############################################################################
# OK英语 · 唯一前端部署脚本（终极版）
#
#   在仓库根目录执行：
#       ./scripts/deploy.sh
#
#   可覆盖默认值：
#       DEPLOY_HOST=root@1.2.3.4 DEPLOY_DIR=/www/wwwroot/english-app ./scripts/deploy.sh
#
# 设计目标：彻底消除「推送旧版本 / 错配」三大病根
#   1) 清构建：先删 dist 再 build，杜绝残留旧产物
#   2) 分区同步：
#        · assets/  用 --delete → 清掉线上堆积的旧哈希 bundle（错配根源）
#        · 其余静态 加量同步、绝不 --delete → 不碰服务器运行时目录(tts/ 等)与
#          服务器侧生成的音频，避免误删
#   3) 自动校验：拉线上 HTML，比对其引用的 bundle hash 是否 == 本地刚构建的，
#        不一致直接非零退出并报警（配合 nginx 已对 index.html 设 no-store）
###############################################################################
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

DEPLOY_HOST="${DEPLOY_HOST:-root@106.54.236.210}"
DEPLOY_DIR="${DEPLOY_DIR:-/www/wwwroot/english-app}"
SITE_URL="${SITE_URL:-https://okenglish.site}"
SSH_OPTS="-o StrictHostKeyChecking=accept-new"

echo "▶ 1/4 清构建"
rm -rf dist
npm run build

LOCAL_JS="$(grep -oE 'assets/index-[A-Za-z0-9_-]+\.js' dist/index.html | head -1)"
echo "  本地产物入口: ${LOCAL_JS}"
[ -n "$LOCAL_JS" ] || { echo "✗ 未能解析本地 dist/index.html 的 bundle，构建可能失败"; exit 1; }

echo "▶ 2/4 同步 assets/（--delete 清旧 bundle）"
rsync -az --delete -e "ssh ${SSH_OPTS}" \
  dist/assets/ "${DEPLOY_HOST}:${DEPLOY_DIR}/assets/"

echo "▶ 3/4 同步其余静态文件（加量，不删服务器运行时目录）"
# 排除 assets（上一步已处理）、tts（服务器运行时缓存）、.DS_Store
rsync -az -e "ssh ${SSH_OPTS}" \
  --exclude 'assets/***' \
  --exclude 'tts/***' \
  --exclude '.DS_Store' \
  dist/ "${DEPLOY_HOST}:${DEPLOY_DIR}/"

# 确保 nginx 可读（历史上出现过 600 权限导致 403）
ssh ${SSH_OPTS} "${DEPLOY_HOST}" "chmod -R a+rX '${DEPLOY_DIR}/assets' && find '${DEPLOY_DIR}' -maxdepth 1 -type f -name '*.html' -exec chmod a+r {} +"

echo "▶ 4/4 校验线上是否已切到新 bundle"
ok=0
for i in 1 2 3 4 5; do
  REMOTE_HTML="$(curl -fsSL --max-time 15 "${SITE_URL}/?_=$(date +%s)" 2>/dev/null || true)"
  REMOTE_JS="$(echo "$REMOTE_HTML" | grep -oE 'assets/index-[A-Za-z0-9_-]+\.js' | head -1 || true)"
  if [ "$REMOTE_JS" = "$LOCAL_JS" ]; then ok=1; break; fi
  echo "  第 ${i} 次：线上=${REMOTE_JS:-空}，等待生效…"; sleep 2
done

if [ "$ok" = 1 ]; then
  echo "✅ 部署成功，线上已是最新：${LOCAL_JS}"
  echo "   （index.html 已设 no-store，用户无需强刷即可拿到新版）"
else
  echo "✗ 线上 HTML 仍未指向新 bundle（线上=${REMOTE_JS:-空} / 期望=${LOCAL_JS}）"
  echo "  排查：1) 是否传到正确目录 ${DEPLOY_DIR}；2) nginx 是否对 index.html 设了 no-store"
  exit 1
fi
