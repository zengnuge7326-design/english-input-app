#!/usr/bin/env bash
###############################################################################
# OK英语 · 后端安全重启引擎（在服务器上运行）
#
# 安装位置：/www/wwwroot/api/restart-api.sh
# 用法（编辑完 index.js 后）：
#     bash /www/wwwroot/api/restart-api.sh
#
# 五重保险，消除「重启把站点搞挂 / 端口冲突 / 推坏代码」：
#   1) 时间戳备份 index.js（保留最近 10 份，可审计）
#   2) 语法门禁：node --check 不过 → 直接中止，绝不重启（线上进程零影响）
#   3) pm2 reload 重启
#   4) 健康检查：轮询 /api/founder/count 必须 200，最长 ~20s
#   5) 不健康 → 自动回滚到上一份「已知良好」版本并再次重启核验
#   成功后：刷新 index.js.last-good、pm2 save、并断言 :3000 仅 1 个监听进程
###############################################################################
set -uo pipefail

API_DIR="${API_DIR:-/www/wwwroot/api}"
PM2_NAME="${PM2_NAME:-okenglish-api}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3000/api/founder/count}"
HEALTH_NEEDLE="${HEALTH_NEEDLE:-remaining}"   # 响应里必须出现的关键字
PORT="${PORT:-3000}"
KEEP_BACKUPS="${KEEP_BACKUPS:-10}"

cd "$API_DIR" || { echo "✗ 找不到 $API_DIR"; exit 1; }
TS="$(date +%Y%m%d_%H%M%S)"

log() { echo "[restart-api] $*"; }

health_ok() {
  for i in $(seq 1 10); do
    code="$(curl -s -o /tmp/api_health -w '%{http_code}' --max-time 3 "$HEALTH_URL" 2>/dev/null || echo 000)"
    if [ "$code" = "200" ] && grep -q "$HEALTH_NEEDLE" /tmp/api_health 2>/dev/null; then
      return 0
    fi
    sleep 2
  done
  return 1
}

# ── 1) 备份 + 滚动清理 ────────────────────────────────
cp -a index.js "index.js.bak.${TS}"
log "已备份 index.js -> index.js.bak.${TS}"
ls -1t index.js.bak.* 2>/dev/null | tail -n +$((KEEP_BACKUPS + 1)) | xargs -r rm -f

# ── 2) 语法门禁 ───────────────────────────────────────
if ! node --check index.js; then
  log "✗ 语法检查未通过 —— 已中止，未重启，线上进程不受影响"
  rm -f "index.js.bak.${TS}"
  exit 1
fi
log "✓ 语法检查通过"

# ── 3) 重启 ───────────────────────────────────────────
log "pm2 reload $PM2_NAME …"
pm2 reload "$PM2_NAME" --update-env >/dev/null 2>&1 || pm2 restart "$PM2_NAME" >/dev/null 2>&1

# ── 4) 健康检查 ───────────────────────────────────────
if health_ok; then
  cp -a index.js index.js.last-good
  pm2 save --force >/dev/null 2>&1
  listeners="$(ss -ltnp 2>/dev/null | grep -c ":${PORT}\b")"
  log "✅ 重启成功且健康（:${PORT} 监听进程数=${listeners}）"
  [ "$listeners" -gt 1 ] && log "⚠ 警告：:${PORT} 有多个监听进程，可能存在手动 node 残留，建议排查"
  exit 0
fi

# ── 5) 不健康 → 自动回滚 ─────────────────────────────
log "✗ 新版本健康检查失败，启动回滚…"
if [ -f index.js.last-good ]; then
  cp -a index.js "index.js.broken.${TS}"   # 留存坏版本供排查
  cp -a index.js.last-good index.js
  pm2 reload "$PM2_NAME" --update-env >/dev/null 2>&1 || pm2 restart "$PM2_NAME" >/dev/null 2>&1
  if health_ok; then
    log "↩ 已回滚到上一份已知良好版本，服务恢复正常（坏版本存为 index.js.broken.${TS}）"
    exit 2
  fi
  log "✗✗ 回滚后仍不健康，请人工介入：pm2 logs $PM2_NAME"
  exit 3
else
  log "✗ 无 index.js.last-good 可回滚（首次运行？）。请人工检查：pm2 logs $PM2_NAME"
  exit 3
fi
