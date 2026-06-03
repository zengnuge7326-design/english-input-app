#!/usr/bin/env bash
# 对比本地构建与线上 index.html 引用的 JS 是否一致
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOCAL_JS=$(grep -oE 'index-[A-Za-z0-9_-]+\.js' "$ROOT/dist/index.html" | head -1)
REMOTE_HTML=$(curl -fsSL --max-time 15 "https://okenglish.site/" 2>/dev/null || true)
REMOTE_JS=$(echo "$REMOTE_HTML" | grep -oE 'index-[A-Za-z0-9_-]+\.js' | head -1 || true)

echo "本地 dist:  $LOCAL_JS"
echo "线上站点:  ${REMOTE_JS:-（拉取失败）}"

if [[ -z "$REMOTE_JS" ]]; then
  echo "无法访问线上页面，请检查网络。"
  exit 1
fi

if [[ "$LOCAL_JS" == "$REMOTE_JS" ]]; then
  echo "✓ 前端 bundle 已同步（含卡通宠物图标）。"
  if grep -q 'pet_penguin' "$ROOT/dist/assets/$LOCAL_JS" 2>/dev/null; then
    echo "✓ bundle 内包含宠物卡通资源标记。"
  fi
  exit 0
fi

echo "✗ 线上仍是旧包。请在本机执行: ./scripts/deploy-site.sh"
exit 1
