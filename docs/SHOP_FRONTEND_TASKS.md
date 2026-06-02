# Cursor 任务清单（前端）

> **请用 Claude Sonnet 4.6 模型执行**（适合 React 多文件改动 + UI 玻璃风格）。
> 复杂涉及支付流程的 case，可临时切到 Claude Opus 4.x。

---

## 阅读顺序
1. 先读 `docs/SHOP_PLAN.md`（整体方案）
2. 再读 `docs/SHOP_API.md`（API 契约）
3. 然后按下面顺序做任务

---

## 任务 1：钻石改名（全局文案）

把所有用户可见的「水晶」改成「钻石」。代号、hook 名、API 路径、数据库字段**保持不变**。

**需要改的文件**（用 grep 找）：
```bash
grep -rln "水晶" src/components/ src/hooks/
```

**改名映射：**
- 「水晶」→「钻石」
- 「五色水晶」→「五色钻石」
- 「水晶塔」→「钻石塔」
- emoji `💎` 保留
- `useCrystal` 函数名、变量名、`crystal_log` 等代号一律**不改**

**重点检查：**
- `src/components/CrystalPanel.jsx`
- `src/components/CrystalFloat.jsx`
- `src/hooks/useCrystal.js`（只改注释/文案，不改逻辑）
- `src/components/Dashboard.jsx`
- 任何提到「水晶」的 tooltip / 弹窗

---

## 任务 2：导航重构

### 2.1 「核心句群」按钮变「商店」入口

文件：`src/App.jsx`，找 `mainNavItems` 数组（大约第 795 行）：

```js
// 改前
{ id: 'core', label: '核心句群', Icon: IconStar, onClick: () => navigateFromMenu('core') },

// 改后
{ id: 'shop', label: '商店', Icon: IconStar, onClick: () => navigateFromMenu('shop') },
```

把对应 tab 渲染改成：
```jsx
<div style={{ display: tab === 'shop' ? 'contents' : 'none' }}>
  <Shop token={token} crystal={crystal} onClose={() => openTab('exercise')} />
</div>
```

### 2.2 「课程」→「课程广场」改名

```js
{ id: 'courses', label: '课程广场', Icon: IconBookOpen, onClick: ... }
```

### 2.3 核心句群内容融入课程广场

`CoreSentences.jsx` 不删，作为 `Courses.jsx` 里的一个 Tab 或推荐卡片展示。
保留 `<CoreSentences>` 组件，把它嵌入 `Courses.jsx` 即可。

---

## 任务 3：商店主页 `Shop.jsx`

新建文件：`src/components/Shop.jsx`

**布局：**
```
┌─ 商店 ──────────────────────────────┐
│ 💎 余额栏（5 色钻石数字 + 总数）     │
├──────────────────────────────────────┤
│  [🎁 充值] [🎫 道具] [🐾 宠物] [👑 会员] │← 4 tabs
├──────────────────────────────────────┤
│  [按 tab 展示对应内容]                │
└──────────────────────────────────────┘
```

**复用风格类：** `lg-home-panel`、`lg-chip`、`lg-chip-gold` 等，参考 `Dashboard.jsx`。

**Tabs：**
- 充值（默认）：渲染 `<RechargePanel>`
- 道具：从 `/api/shop/products?category=item` 拉商品网格
- 宠物：渲染 `<PetCatalog>`
- 会员：从 `/api/shop/products?category=membership` 拉商品

**购买流程：**
点击商品 → 弹出确认 Modal → 调 `POST /api/shop/buy` → 成功后撒花 + 更新余额 + 弹出 "已加入背包"。

---

## 任务 4：充值面板 `RechargePanel.jsx`

`src/components/RechargePanel.jsx`

- 拉 `/api/shop/recharge-packs`
- 4 个大彩色卡片（金黄渐变玻璃风）
- 点击 → `POST /api/shop/recharge/create` → 拿二维码
- 显示二维码 Modal + 轮询 `/api/shop/recharge/status/:id` 每 3 秒
- 30 秒后显示「我已支付」按钮 → `POST /api/shop/recharge/query/:id`
- 成功 → 显示「+ 800 金钻」动画 + 更新余额

**参考现有 `MemberPage.jsx`** 里的支付流程，几乎可以照搬。

---

## 任务 5：宠物图鉴 `PetCatalog.jsx`

`src/components/PetCatalog.jsx`

**布局：**
```
┌─ 宠物图鉴 ─────────────────────────┐
│ [全部] [N] [R] [SR] [SSR] [UR] [已拥有]│← 档位筛选
├────────────────────────────────────┤
│ ┌──┐ ┌──┐ ┌──┐ ┌──┐                │
│ │🐤│ │🐧│ │🐕│ │🐱│  ← 4 列网格    │
│ └──┘ └──┘ └──┘ └──┘                │
│ 小黄鸭 企鹅 柴犬 橘猫               │
│ 50💛  60💛 80💛 70💛                │
└────────────────────────────────────┘
```

**档位高亮（卡片边框/背景）：**
- N → 灰色边框
- R → 蓝色边框
- SR → 紫色边框 + 微光
- SSR → 金色边框 + 强光晕 + 旋转闪光特效
- UR → 彩虹边框 + 粒子动画

**点击宠物 →** 弹出大图 Modal：
- 大头像预览
- 名称 + 档位标签
- 价格
- 描述（"网红 IP 风格 / 致敬款"）
- 操作：未拥有 → `购买` 按钮；已拥有 → `装备` 按钮（调 `/api/shop/equip`）

---

## 任务 6：背包 `MyInventory.jsx`

`src/components/MyInventory.jsx`

- 拉 `/api/shop/inventory`
- 分两块：道具（带数量徽章）+ 宠物（已收藏的）
- 道具点击 → 「使用」按钮 → `POST /api/shop/inventory/use`
- 宠物点击 → 「装备/卸下」按钮

入口：商店主页右上角"我的背包"图标。

---

## 任务 7：头像选择器 `AvatarPicker.jsx` + 顶部 Logo 改造

### 7.1 `AvatarPicker.jsx`

`src/components/AvatarPicker.jsx`

弹窗形式，展示用户已拥有的宠物头像 + 默认熊猫。
- 当前装备的有高亮边框
- 点击 → `POST /api/shop/equip { slot: 'avatar', item_id }`
- 底部按钮：「卸下当前头像」(item_id=null) / 「去商店买更多」

### 7.2 顶部 Logo 可点击

`src/App.jsx` 找到顶部 panda Logo，加 `onClick={() => setAvatarPicker(true)}`。
渲染时根据 `equipped.avatar` 切换图片：
- `null` → 默认 `panda-icon.png`
- `pet_xxx` → `/pets/pet_xxx.svg`

---

## 任务 8：宠物 SVG 美术资源

`public/pets/` 目录，每个宠物一个 256x256 SVG。

**先做 N + R 共 14 个**，按 `docs/SHOP_PLAN.md` 第三节宠物清单：

```
public/pets/
  pet_duck.svg
  pet_penguin.svg
  pet_shiba.svg
  pet_cat.svg
  pet_panda.svg
  pet_capybara.svg
  pet_otter.svg
  pet_fox.svg
  pet_shield_dog.svg
  pet_unicorn.svg
  pet_axolotl.svg
  pet_dragon_baby.svg
  pet_alien.svg
  pet_robot.svg
```

**风格要求：**
- 扁平卡通 / Q 版头像
- 圆形构图，留 ~10% 边距
- 鲜艳粉彩配色（和首页玻璃风一致）
- 表情萌、亲和力强

如果你自己画不出，可以用 AI 出图（Midjourney / DALL·E），或者**先用 emoji 占位**（如小黄鸭 = 🦆），后期替换。

SR/SSR 档可以晚一周做，先把 N+R 跑通。

---

## 完成标准

每个任务做完，请在该任务下打勾，并 commit 一次。
最后请 build 一次确认无报错：
```bash
npm run build
```

完成后用以下格式回复 Claude（直接对话回我）：

> Cursor 已完成：[任务 X、X、X]，遇到的问题：[XXX]，未完成：[XXX]。
