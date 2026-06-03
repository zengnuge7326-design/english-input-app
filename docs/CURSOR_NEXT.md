# Cursor 下一批任务 · 复制此内容到 Cursor 对话框

> 推荐用 **Claude Sonnet 4.6** 模型。
> 后端已全部上线，下列 API 均可直接调用。所有 API 需 `Authorization: Bearer <token>`（除非注明）。
> 根地址：`https://okenglish.site/api`

---

## 后端可用 API（已部署，测试过）

```
GET  /api/shop/products?category=pet|item|membership   商品列表
GET  /api/shop/inventory                               我的背包（含 items + pets + equipped）
POST /api/shop/buy                                     购买
     body: { product_id, qty, client_idempotent_id }
POST /api/shop/equip                                   装备
     body: { slot: 'avatar'|'panda_skin'|..., item_id: 'pet_xxx' | null }
POST /api/shop/inventory/use                           使用道具
     body: { item_id }
```

返回结构详见 `docs/SHOP_API.md`。

---

## ✅ 已完成的任务 1–3
- 任务 1：水晶 → 钻石（commit `5c70c55`）
- 任务 2：导航重构（commit `d51e345`）
- 任务 3：Shop.jsx 骨架（commit `5b8a5a7`）

---

# 任务 5：宠物图鉴 `PetCatalog.jsx`

**新建文件：** `src/components/PetCatalog.jsx`
**挂载点：** 在 `Shop.jsx` 里 `tab === 'pets'` 时渲染 `<PetCatalog token={token} crystal={crystal} inventory={inventory} onInventoryChange={...}/>`。

## UI 规格
```
┌─ 宠物图鉴 23 个 ───────────────────────────────┐
│ [全部 23] [N 8] [R 6] [SR 5] [SSR 4] [我的 0]   │← 档位筛选 Tab
├──────────────────────────────────────────────┤
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐                  │
│ │🦆  │ │🐧  │ │🐶  │ │🐱  │  ← 4 列网格      │
│ │ N  │ │ N  │ │ N  │ │ N  │  ← 档位徽章      │
│ │50💎│ │60💎│ │80💎│ │70💎│  ← 价格         │
│ └────┘ └────┘ └────┘ └────┘                  │
│ 小黄鸭 帝企鹅 柴犬   橘猫                    │
└──────────────────────────────────────────────┘
```

## 档位高亮（卡片边框 + 光晕）
| Tier | 边框色 | 光晕 |
|---|---|---|
| N | `border-slate-500/40` | 无 |
| R | `border-blue-400/60` | 弱蓝光 `shadow-[0_0_12px_rgba(96,165,250,0.3)]` |
| SR | `border-purple-400/70` | 紫光 `shadow-[0_0_18px_rgba(168,85,247,0.4)]` |
| SSR | `border-amber-400/80` | 金光 + 旋转高光特效 `shadow-[0_0_24px_rgba(251,191,36,0.5)]` |
| UR | 彩虹边框 | 粒子动画 |

## 数据流
1. `useEffect` 拉 `GET /api/shop/products?category=pet`
2. 同时拉 `GET /api/shop/inventory` 拿已拥有列表 `pets[]`
3. 每个卡片标记 `owned: pets.some(p => p.item_id === product.id)`

## 点击宠物 → 弹出大图 Modal
```
┌─ 大图预览 ────────────────────┐
│                              │
│       [256x256 SVG 大图]      │
│                              │
│       小黄鸭 [N 普通]         │
│       经典浮力小黄鸭          │
│       💎🟡 50 颗金钻          │
│                              │
│       [购买] / [装备] / [已装备] │
│       [取消]                  │
└──────────────────────────────┘
```

## 购买流程
1. 余额够 → `POST /api/shop/buy { product_id, qty:1, client_idempotent_id: crypto.randomUUID() }`
2. 成功 → 撒花动画 + 更新本地 `inventory`（从响应里取）
3. 失败 `INSUFFICIENT_DIAMOND` → 提示"金钻不足，去充值"

## 装备 / 卸下
- 已拥有且 `equipped.avatar !== product.id` → 显示 `[装备]` 按钮
- 已装备 → 显示 `[已装备 ✓]` （灰色，不可点）
- 装备按钮 → `POST /api/shop/equip { slot:'avatar', item_id: product.id }`

## ✅ 验证标准
- 打开商店 → 宠物 tab → 看到 23 个宠物 4 列网格
- 档位 tab 切换正常
- 点击未拥有的宠物 → 弹 Modal → 点购买 → 余额扣减、加入"我的"分类
- 装备后 → 关闭 Modal → 该卡片角标显示"已装备"

---

# 任务 6：背包 `MyInventory.jsx`

**新建文件：** `src/components/MyInventory.jsx`
**挂载点：** Shop.jsx 顶部余额栏右上角加 `[🎒 我的背包]` 按钮 → 弹出 Modal 或切换到背包页。

## UI 规格
```
┌─ 我的背包 ─────────────────────┐
│  [道具 N] [宠物 M]              │← 两个 tab
├───────────────────────────────┤
│  ❄️ 冻结卡 ×3   [使用]          │
│  ⚡ 双倍XP卡 ×1  [使用]          │
│  💡 提示卡 ×5   [使用]          │
├───────────────────────────────┤
│  装备槽：                       │
│  头像：🦆 小黄鸭 [更换]          │
└───────────────────────────────┘
```

## 数据流
- `useEffect` 拉 `GET /api/shop/inventory`
- 道具 tab：展示 `items[]`，每项右边 `[使用]` 按钮
- 宠物 tab：展示 `pets[]`，已装备的高亮，其它显示 `[装备]` 按钮

## 使用道具
- 点 `[使用]` → `POST /api/shop/inventory/use { item_id }`
- 成功 → 弹 toast `❄️ 冻结卡已生效 · 剩余 2 张`
- 库存为 0 → 该项灰显 / 移除

## 商品名称查询
背包接口只返回 `item_id` 和 `count`，需要从商品目录拉名称：
```js
const [products] = useState([])
useEffect(() => {
  fetch('/api/shop/products').then(r => r.json()).then(d => setProducts(d.products))
}, [])
const lookup = id => products.find(p => p.id === id) || { name: id, icon: '📦' }
```

或者**直接在 Shop.jsx 顶层加载一次商品目录**，作为 prop 传给 MyInventory 和 PetCatalog 避免重复请求。

## ✅ 验证标准
- 点商店右上"我的背包" → 看到拥有的道具数量
- 点冻结卡的 `[使用]` → 数量减 1
- 数量为 0 时项目自动消失或灰显

---

# 任务 7：头像选择器 `AvatarPicker.jsx` + 顶部 Logo 改造

## 7.1 新建 `AvatarPicker.jsx`

弹窗形式，包含：
- 默认熊猫头像（永远第一个，圆形 + "默认"小标签）
- 已拥有的宠物头像（网格）
- 当前装备项有 `ring-4 ring-amber-400` 高亮
- 点击任一个 → `POST /api/shop/equip { slot:'avatar', item_id: pet_xxx 或 null }`
- 底部一行：`[去商店看更多 →]` 链接到商店宠物 tab

## 7.2 顶部 Logo 改造

**修改文件：** `src/App.jsx`

找到顶部 panda Logo（一般在 header 的左侧或右上角），加 `onClick` + 动态渲染：

```jsx
// 当前装备
const equippedAvatar = inventoryEquipped?.avatar || null

// Logo 渲染
<button onClick={() => setShowAvatarPicker(true)} className="...">
  {equippedAvatar ? (
    <img src={`/pets/${equippedAvatar}.svg`} alt={equippedAvatar}
         className="w-9 h-9 rounded-full object-cover" />
  ) : (
    <img src="/panda-icon.png" className="w-9 h-9 rounded-full" />
  )}
</button>
```

如果对应 SVG 不存在（任务 8 还没做），可以先用 emoji 占位：

```jsx
const PET_EMOJI = {
  pet_duck: '🦆', pet_penguin: '🐧', pet_shiba: '🐕', pet_cat: '🐱',
  pet_panda: '🐼', pet_capybara: '🦫', pet_otter: '🦦', pet_fox: '🦊',
  pet_axolotl: '🦎', pet_alien: '👽', pet_unicorn: '🦄',
  pet_dragon_baby: '🐉', pet_shield_dog: '🐶', pet_robot: '🤖',
  pet_lucky_cat: '🐱‍💼', pet_yellow_chu: '⚡', pet_hero_red: '🦸',
  pet_hero_blue: '🤖', pet_dragon_god: '🐲',
  pet_phoenix: '🦅', pet_kaiju: '🐙', pet_godzilla: '🦖', pet_kirin: '🦒',
}
```

## App.jsx 需要的状态变化
```jsx
const [inventoryEquipped, setInventoryEquipped] = useState({ avatar: null, panda_skin: null, theme: null, flame_color: null })
useEffect(() => {
  if (!token) return
  fetch(`${API}/shop/inventory`, { headers: { Authorization: `Bearer ${token}` } })
    .then(r => r.json())
    .then(d => setInventoryEquipped(d.equipped))
}, [token])
```

需要把 `inventoryEquipped, setInventoryEquipped` 也作为 prop 传给 Shop（让 Shop 装备后能同步更新）。

## ✅ 验证标准
- 顶部 Logo 点击 → 弹出头像选择器
- 选择"小黄鸭" → Logo 立刻变成 🦆 emoji
- 选择"默认" → Logo 回到熊猫

---

# 任务 8：宠物 emoji 占位（先做这个，SVG 美术后补）

**修改文件：** `src/data/pets.js`（新建）

```js
// 23 个宠物的 emoji 占位 + 简介，等 SVG 美术出来再切换到 image 模式
export const PET_FALLBACK = {
  pet_duck:        { emoji: '🦆', bg: 'from-yellow-300 to-amber-400' },
  pet_penguin:     { emoji: '🐧', bg: 'from-slate-200 to-slate-400' },
  pet_otter:       { emoji: '🦦', bg: 'from-amber-700 to-amber-900' },
  pet_cat:         { emoji: '🐱', bg: 'from-orange-300 to-orange-500' },
  pet_shiba:       { emoji: '🐕', bg: 'from-amber-400 to-yellow-600' },
  pet_panda:       { emoji: '🐼', bg: 'from-slate-100 to-slate-300' },
  pet_fox:         { emoji: '🦊', bg: 'from-orange-400 to-red-500' },
  pet_capybara:    { emoji: '🦫', bg: 'from-amber-600 to-amber-800' },
  pet_axolotl:     { emoji: '🦎', bg: 'from-pink-300 to-pink-500' },
  pet_alien:       { emoji: '👽', bg: 'from-green-300 to-emerald-500' },
  pet_unicorn:     { emoji: '🦄', bg: 'from-pink-200 via-purple-300 to-indigo-300' },
  pet_dragon_baby: { emoji: '🐉', bg: 'from-emerald-400 to-teal-500' },
  pet_shield_dog:  { emoji: '🐶', bg: 'from-amber-300 to-orange-500' },
  pet_robot:       { emoji: '🤖', bg: 'from-slate-400 to-slate-600' },
  pet_lucky_cat:   { emoji: '😸', bg: 'from-red-300 to-red-500' },
  pet_yellow_chu:  { emoji: '⚡', bg: 'from-yellow-200 to-yellow-500' },
  pet_hero_red:    { emoji: '🦸', bg: 'from-red-400 to-red-600' },
  pet_hero_blue:   { emoji: '🤖', bg: 'from-blue-400 to-indigo-600' },
  pet_dragon_god:  { emoji: '🐲', bg: 'from-orange-400 to-red-600' },
  pet_phoenix:     { emoji: '🔥', bg: 'from-orange-300 via-red-500 to-purple-600' },
  pet_kaiju:       { emoji: '🐙', bg: 'from-purple-500 to-indigo-700' },
  pet_godzilla:    { emoji: '🦖', bg: 'from-green-600 to-teal-700' },
  pet_kirin:       { emoji: '🐉', bg: 'from-amber-300 via-pink-400 to-purple-500' },
}
```

`PetCatalog.jsx` 和 `AvatarPicker.jsx` 都从这里读 emoji 显示。

---

# 整体推进顺序

1. **先做任务 8**（pets.js 数据）— 几分钟
2. **再做任务 5**（PetCatalog.jsx）— 主要工作
3. **任务 6**（MyInventory.jsx）— 简单
4. **任务 7**（AvatarPicker.jsx + 顶部 Logo）— 最后整合

每完成一个：
```bash
git add -A && git commit -m "feat: 任务X xxx"
npm run build
```

---

# 完成后请这样回复 Claude

> Cursor 已完成任务 5/6/7/8。
> - PetCatalog.jsx：[文件位置]，[行数]
> - MyInventory.jsx：[同上]
> - AvatarPicker.jsx：[同上]
> - pets.js：[同上]
> 测试结果：[截图或描述]
> 遇到的问题：[XXX]

**Cursor 加油！** 🚀
