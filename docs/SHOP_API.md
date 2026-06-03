# 钻石商店 API 契约

> 这是前后端共同遵守的接口规范。Cursor 写前端时照此调用，Claude 写后端时照此实现。

**根地址**：`https://okenglish.site/api`
**认证**：除明确标注外，全部需 `Authorization: Bearer <token>`

---

## 1. 商品目录

### `GET /api/shop/products`
**用途**：拉取所有商品（道具 + 宠物 + 会员包 + 充值档），前端按 `category` 分组展示。

**响应：**
```json
{
  "products": [
    {
      "id": "freeze_card_1",
      "category": "item",          // item | pet | membership
      "tier": "N",                 // N | R | SR | SSR | UR （仅 pet）
      "name": "❄️ 冻结卡 ×1",
      "desc": "错过一天不断连胜",
      "icon": "❄️",
      "image": null,               // pet 才有
      "price": [{ "color": "purple", "amount": 8 }],
      // ↑ 可多色组合，如 [{color:"gold",amount:30}, {color:"purple",amount:10}]
      "rmb_price": null,           // 或 6（=¥6，部分商品支持直接现金购买）
      "stock_limit": null,         // 限购数量
      "available": true
    }
  ]
}
```

### `GET /api/shop/recharge-packs`
**用途**：充值档位。无需登录。

**响应：**
```json
{
  "packs": [
    { "id": "p1",  "rmb": 1,  "diamonds": 50,   "bonus": 0 },
    { "id": "p3",  "rmb": 3,  "diamonds": 160,  "bonus": 10 },
    { "id": "p10", "rmb": 10, "diamonds": 800,  "bonus": 300, "tag": "最划算" },
    { "id": "p30", "rmb": 30, "diamonds": 3000, "bonus": 1500 }
  ]
}
```
> `bonus` 是和基础单价 50/元 比的额外赠送，仅展示用。

---

## 2. 用钻石购买虚拟商品

### `POST /api/shop/buy`
**Body：**
```json
{
  "product_id": "freeze_card_1",
  "qty": 1,
  "client_idempotent_id": "uuid-v4"
}
```

**成功响应（200）：**
```json
{
  "ok": true,
  "order_id": 12345,
  "new_balance": { "blue": 12, "green": 8, "red": 5, "purple": 12, "gold": 100 },
  "inventory": { "freeze_card_1": 3 }
}
```

**错误响应：**
```json
{ "ok": false, "error": "INSUFFICIENT_DIAMOND", "needed": { "color": "purple", "amount": 8 } }
```
错误码：
- `NOT_LOGGED_IN`
- `PRODUCT_NOT_FOUND`
- `INSUFFICIENT_DIAMOND`
- `STOCK_LIMIT_REACHED`
- `INVALID_QTY`
- `DUPLICATE_REQUEST`（同一 idempotent_id 已处理过，会返回原结果）

---

## 3. 充值（真金购买金钻）

### `POST /api/shop/recharge/create`
**Body：** `{ "pack_id": "p10" }`
**响应：**
```json
{
  "order_id": "diamond_xxx",
  "qrcode": "https://...png",
  "url": "https://...",
  "rmb": 10,
  "diamonds": 800
}
```

### `GET /api/shop/recharge/status/:order_id`
**响应：** `{ "status": "pending" | "paid" | "failed" }`

### `POST /api/shop/recharge/notify`
迅虎回调，前端不调。成功后服务端给用户 `+gold` 钻石。

### `POST /api/shop/recharge/query/:order_id`
**用户点"我已支付"主动核验**，复用现有 `/api/payment/query/:id` 逻辑。

---

## 4. 我的背包 / 装备

### `GET /api/shop/inventory`
**响应：**
```json
{
  "items": [
    { "item_id": "freeze_card_1", "count": 3 },
    { "item_id": "double_xp_30m", "count": 1 }
  ],
  "pets": [
    { "item_id": "pet_duck", "owned_at": "2026-06-03T10:00:00Z" },
    { "item_id": "pet_shiba", "owned_at": "..." }
  ],
  "equipped": {
    "avatar": "pet_shiba",
    "panda_skin": null,
    "theme": null,
    "flame_color": null
  }
}
```

### `POST /api/shop/equip`
**Body：** `{ "slot": "avatar", "item_id": "pet_shiba" }` 或 `"item_id": null` 卸下。
**响应：** `{ "ok": true, "equipped": { "avatar": "pet_shiba", ... } }`
**错误：** `NOT_OWNED`（库存里没有这件）

### `POST /api/shop/inventory/use`
**Body：** `{ "item_id": "freeze_card_1" }`
**响应：** `{ "ok": true, "remaining": 2, "effect": { "type": "freeze", "applied_date": "2026-06-02" } }`

---

## 5. 钻石余额（沿用现有）

依然用 `GET /api/crystal/state` 返回 5 色钻数。前端文案改成"钻石"即可。

---

## 6. 每日转盘

### `POST /api/shop/daily-spin`
**响应：**
```json
{
  "ok": true,
  "prize": { "type": "diamond", "color": "gold", "amount": 15 },
  // 或 { "type": "item", "item_id": "freeze_card_1", "count": 1 }
  "next_spin_at": "2026-06-04T00:00:00+08:00"
}
```
**错误：** `ALREADY_SPUN_TODAY`

---

## 7. 头像 / 替换顶部 Logo

前端读 `equipped.avatar` 渲染：
- 如果是 `null` → 显示默认熊猫
- 如果是 `pet_xxx` → 从 `/public/pets/pet_xxx.svg` 加载

宠物 SVG 资源约定路径：`/public/pets/{item_id}.svg`，默认 256×256，圆形剪裁。

---

## 8. 错误码统一

所有错误返回 `{ "ok": false, "error": "CODE_NAME", "message": "可选用户友好提示" }`。

---

**版本**：v1.0
**更新**：2026-06-03
