# Cursor 任务 4 · 充值面板 RechargePanel.jsx

> 接 Shop.jsx 中 `tab === 'recharge'` 那一块。后端已就绪。
> 用 Claude Sonnet 4.6 或 Cursor Auto 都行。

---

## 后端 API（已部署 + 测试通过）

```
GET  /api/shop/recharge-packs                    无需登录，返回 4 档
POST /api/shop/recharge/create   body:{pack_id}  需登录 → 返回 {order_id, url, qrcode, rmb, diamonds}
GET  /api/shop/recharge/status/:order_id         需登录 → 返回 {status:pending|paid|failed, diamonds}
POST /api/shop/recharge/query/:order_id          需登录 → 主动核验（"我已支付"按钮触发）
```

充值档：
- p1: ¥1 → 50 钻
- p3: ¥3 → 160 钻
- p10: ¥10 → 800 钻（"最划算"）
- p30: ¥30 → 3000 钻

---

## 文件

**新建：** `src/components/RechargePanel.jsx`

可以参考现有 `src/components/MemberPage.jsx` 的支付二维码 + 轮询 + 主动核验流程，几乎照搬。

---

## UI 规格

```
┌─ 充值金钻 ────────────────────────┐
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│  │ ¥1   │ │ ¥3   │ │ ¥10  │ │ ¥30  ││
│  │ 50   │ │ 160  │ │ 800  │ │ 2000 ││
│  │ 金钻 │ │ 金钻 │ │ 金钻 │ │ 金钻 ││
│  │      │ │+6.7%│ │最划算│ │+33%│ ││
│  └──────┘ └──────┘ └──────┘ └──────┘│
│                                    │
│  💎 充值后获得金钻，可购买宠物 / 道具 │
│  📞 客服: xxx                       │
└────────────────────────────────────┘
```

4 个大彩色卡片：
- p1：白银渐变 + 角标"新手"
- p3：青色渐变
- p10：金色渐变 + 角标"⭐ 最划算"（最显眼）
- p30：紫色渐变 + 角标"大额"

每张卡片显示：
- 顶部：¥X
- 中间：N 金钻（大字）
- 底部：bonus 说明（`+X%`）

---

## 支付流程

```js
async function handleClick(pack) {
  // 1. 创建订单
  const r = await fetch(`${API}/shop/recharge/create`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ pack_id: pack.id }),
  }).then(r => r.json())
  if (!r.ok) { alert(r.error); return }

  // 2. 显示二维码 Modal
  setQRCode(r.qrcode)
  setOrderId(r.order_id)
  setPaying(true)

  // 3. 开始轮询
  startPolling(r.order_id)
}

function startPolling(orderId) {
  let elapsed = 0
  const timer = setInterval(async () => {
    elapsed += 3
    const r = await fetch(`${API}/shop/recharge/status/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json())
    if (r.ok && r.status === 'paid') {
      clearInterval(timer)
      onSuccess(r.diamonds)
      return
    }
    if (elapsed > 30) setShowManualVerify(true)  // 30 秒后显示「我已支付」
    if (elapsed > 600) clearInterval(timer)       // 10 分钟超时
  }, 3000)
}

async function handleManualVerify() {
  const r = await fetch(`${API}/shop/recharge/query/${orderId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  }).then(r => r.json())
  if (r.ok && r.status === 'paid') {
    onSuccess(r.diamonds)
  } else {
    alert('暂未查询到支付记录，请稍后再试')
  }
}

function onSuccess(diamonds) {
  setPaying(false)
  setQRCode(null)
  showConfetti()
  alert(`+ ${diamonds} 金钻 🎉`)
  refreshCrystal()  // 调上层刷新余额
}
```

---

## 二维码 Modal

```jsx
{paying && (
  <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full text-center">
      <h3 className="text-white font-bold text-lg mb-3">微信扫码支付</h3>
      <img src={qrcode} alt="二维码" className="w-56 h-56 mx-auto bg-white p-3 rounded-xl" />
      <p className="text-sm text-gray-400 mt-3">
        支付完成后将自动到账。如长时间未到账，请点击「我已支付」核验。
      </p>
      <div className="flex gap-2 mt-4">
        {showManualVerify && (
          <button onClick={handleManualVerify}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold">
            我已支付
          </button>
        )}
        <button onClick={() => { setPaying(false); setQRCode(null) }}
          className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-gray-300 text-sm">
          取消
        </button>
      </div>
    </div>
  </div>
)}
```

---

## 集成到 Shop.jsx

Shop.jsx 现在 `tab === 'recharge'` 渲染 `<RechargePanel token={token} onSuccess={refreshCrystal} />`。

`refreshCrystal` 是 Shop 暴露的回调，让它调 `crystal.refresh()` 或重新 fetch `/api/crystal/state`。

---

## ✅ 验证标准

1. 商店 → 充值 tab → 看到 4 个档位卡片
2. 点 ¥1 → 显示微信二维码（真实的迅虎二维码 URL）
3. 30 秒后出现「我已支付」按钮
4. 点取消 → 关闭 Modal

**注意：** 上线后可以用 ¥1 真实测试一次完整流程（扫码 → 支付 → 自动到账 50 钻）。

---

## ⚠️ 一个补充任务（可选）

**整合到 useCrystal 自动刷新**：

支付成功后，前端有 3 种刷新余额的方式：
1. 简单粗暴：`window.location.reload()`
2. 调 `crystal.refresh()`（如果 useCrystal 暴露此方法）
3. 直接 fetch `/api/crystal/state` 然后 setState

任选其一即可，最简单是方式 1（充值不频繁）。

---

## 完成后回复 Claude

> 任务 4 充值面板已完成。
> - RechargePanel.jsx: [路径，行数]
> - 测试结果: [描述]
