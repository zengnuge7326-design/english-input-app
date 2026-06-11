#!/usr/bin/env bash
###############################################################################
# OK英语 · 后端部署入口（在 Mac 上运行）
#
#   仅安全重启线上后端（编辑在服务器上完成时）：
#       ./scripts/deploy-api.sh
#
#   连带上传本地 index.js 再安全重启（若你在本地维护 server-deploy/index.js）：
#       ./scripts/deploy-api.sh --push
#
# 实际重启由服务器上的 restart-api.sh 完成（备份/语法门禁/健康检查/自动回滚）。
###############################################################################
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

DEPLOY_HOST="${DEPLOY_HOST:-root@106.54.236.210}"
API_DIR="${API_DIR:-/www/wwwroot/api}"
SSH_OPTS="-o StrictHostKeyChecking=accept-new"
LOCAL_INDEX="server-deploy/index.js"

# 始终保证服务器上的 restart 引擎是仓库最新版
echo "▶ 同步 restart-api.sh 到服务器"
scp ${SSH_OPTS} scripts/restart-api.sh "${DEPLOY_HOST}:${API_DIR}/restart-api.sh"

if [ "${1:-}" = "--push" ]; then
  [ -f "$LOCAL_INDEX" ] || { echo "✗ 未找到本地 ${LOCAL_INDEX}，无法 --push"; exit 1; }
  echo "▶ 上传本地 index.js（先本地语法自检）"
  node --check "$LOCAL_INDEX"
  scp ${SSH_OPTS} "$LOCAL_INDEX" "${DEPLOY_HOST}:${API_DIR}/index.js"
fi

echo "▶ 触发服务器安全重启（含备份/语法门禁/健康检查/自动回滚）"
ssh ${SSH_OPTS} "${DEPLOY_HOST}" "bash ${API_DIR}/restart-api.sh"
rc=$?

case $rc in
  0) echo "✅ 后端更新成功，服务健康";;
  2) echo "↩ 新版本异常，已自动回滚到上一可用版本（站点未中断）";;
  *) echo "✗ 后端更新失败（rc=$rc），请查看：ssh ${DEPLOY_HOST} 'pm2 logs okenglish-api'";;
esac
exit $rc
