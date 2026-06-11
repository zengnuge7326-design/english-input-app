#!/usr/bin/env bash
# 推荐佣金管理 CLI （Phase 1 手动结算工具）
#
# 用法（本机）：
#   ADMIN_KEY=xxx ./scripts/admin-commission.sh list-settled
#   ADMIN_KEY=xxx ./scripts/admin-commission.sh promote
#   ADMIN_KEY=xxx ./scripts/admin-commission.sh mark-paid 12,13,14 wechat "转账截图 https://..." 85.00
#
# ADMIN_KEY 即服务器 ADMIN_API_KEY 环境变量值
# (设置：ADMIN_API_KEY=$(openssl rand -hex 32) pm2 restart okenglish-api --update-env)

set -euo pipefail

API="${API_BASE:-https://okenglish.site/api}"
ADMIN_USER="${ADMIN_USER:-admin}"
KEY="${ADMIN_KEY:-}"
: "${KEY:?请先设置 ADMIN_KEY=xxxx ./scripts/admin-commission.sh ...}"

CMD="${1:-help}"
shift || true

case "$CMD" in
  promote)
    echo "→ 把冷静期已过的 pending 转为 settled"
    curl -s -X POST "$API/admin/commission/promote-pending" \
      -H "X-Admin-Key: $KEY" -H "X-Admin-User: $ADMIN_USER" | jq .
    ;;

  list-pending|list-settled|list-paid|list-suspicious)
    STATUS="${CMD#list-}"
    echo "→ 列出 status=$STATUS 的记录"
    curl -s -G "$API/admin/commission/list" \
      --data-urlencode "status=$STATUS" \
      -H "X-Admin-Key: $KEY" | jq .
    ;;

  mark-paid)
    IDS="${1:-}"; PAY_METHOD="${2:-wechat}"; NOTE="${3:-}"; AMOUNT="${4:-}"
    if [[ -z "$IDS" || -z "$AMOUNT" ]]; then
      echo "用法: mark-paid <id1,id2,..> <pay_method> \"<txn_note>\" <amount_check>"
      echo "示例: mark-paid 12,13 wechat \"截图URL\" 85.00"
      exit 1
    fi
    IDS_JSON=$(echo "$IDS" | python3 -c 'import sys,json; print(json.dumps([int(x) for x in sys.stdin.read().strip().split(",") if x]))')
    BODY=$(cat <<EOF
{
  "ids": $IDS_JSON,
  "pay_method": "$PAY_METHOD",
  "txn_note": "$NOTE",
  "amount_check": $AMOUNT
}
EOF
)
    echo "→ 标记 ids=[$IDS] 为已付，校验金额=$AMOUNT"
    curl -s -X POST "$API/admin/commission/mark-paid" \
      -H "X-Admin-Key: $KEY" -H "X-Admin-User: $ADMIN_USER" \
      -H "Content-Type: application/json" \
      -d "$BODY" | jq .
    ;;

  flag)
    IDS="${1:-}"; REASON="${2:-suspicious}"
    if [[ -z "$IDS" ]]; then echo "用法: flag <id1,id2,..> \"原因\""; exit 1; fi
    IDS_JSON=$(echo "$IDS" | python3 -c 'import sys,json; print(json.dumps([int(x) for x in sys.stdin.read().strip().split(",") if x]))')
    curl -s -X POST "$API/admin/commission/flag" \
      -H "X-Admin-Key: $KEY" -H "X-Admin-User: $ADMIN_USER" \
      -H "Content-Type: application/json" \
      -d "{\"ids\":$IDS_JSON,\"reason\":\"$REASON\"}" | jq .
    ;;

  *)
    cat <<EOF
推荐佣金管理 CLI
  promote                                   # 冷静期到 → settled
  list-pending | list-settled | list-paid   # 查列表
  list-suspicious                            # 可疑列表
  mark-paid <ids> <method> "<note>" <amt>   # 批量标记已付（amt 必须等于这批金额合计）
  flag <ids> "<reason>"                      # 标可疑

环境变量：
  ADMIN_KEY    服务器 ADMIN_API_KEY 的值（必填）
  ADMIN_USER   操作者名字（默认 'admin'）
  API_BASE     API 根 URL（默认 https://okenglish.site/api）

日常工作流：
  1) 每天 ./admin-commission.sh promote           # 冷静期到的转待付
  2) ./admin-commission.sh list-settled            # 看待付清单
  3) 逐个微信/支付宝转账
  4) ./admin-commission.sh mark-paid 12,13 wechat "截图" 85  # 标记完成
EOF
    ;;
esac
