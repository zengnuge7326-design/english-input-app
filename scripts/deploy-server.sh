#!/usr/bin/env bash
# [已退役] 请统一使用 scripts/deploy.sh（唯一前端部署入口）
# 本脚本仅作转发，避免历史命令失效。
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
echo "⚠ deploy-server.sh 已合并到 deploy.sh，正在转发…"
exec "${DIR}/deploy.sh" "$@"
