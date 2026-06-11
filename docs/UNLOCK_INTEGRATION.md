# 锁定接入指南（模式参考）

参考 `src/components/Courses.jsx` 的多邻国单元卡接入。

## 通用样板

```jsx
import LockedOverlay from './LockedOverlay'

// 1. 组件 props 加：
//    unlocks, crystalBalance, onGoShop

// 2. 渲染时计算 locked
const locked = index > 0 &&
  !isMember &&
  !unlocks?.isUnlocked?.(SCOPE, itemId) &&
  prevPercent < PROGRESS_THRESHOLD

// 3. 包裹卡片
<LockedOverlay
  locked={locked}
  cost={COST}
  color="blue"
  crystalBalance={crystalBalance}
  title={cardTitle}
  reason={`完成上一项 ${PROGRESS_THRESHOLD}%，或花费 ${COST} 钻石提前开启`}
  onUnlock={() => unlocks?.unlock?.(SCOPE, itemId, COST, 'blue')}
  onGoShop={onGoShop}
>
  {cardJSX}
</LockedOverlay>
```

## App.jsx 处的 prop 传递

每个板块组件挂载处都加：
```jsx
unlocks={unlocks}
crystalBalance={crystal.blue}
onGoShop={() => openTab('shop')}
```

## 各板块定价表

| 板块 | scope | itemId 约定 | 首项免费 | 顺序阈值 | 价 |
|---|---|---|---|---|---|
| 课程广场（已接入） | `course` | `duo_unit_N` | Unit 1 | 60% | 50 |
| 教材同步 | `book` | `grade4_up` 等 bookId | 三年级上册 | 60% | 80 |
| 语法专项 | `grammar` | 专项 id | 第一项 | 完成 | 30 |
| 单词 | `vocab_unit` | `g4u1` 等 | 每册 Unit 1 | 巩固过 1 次 | 15 |
| 26 字母 | `alphabet` | `back10` | 前 16 个 | 全学一遍 | 20 |
| 音标 | `phoneme` | `back10` | 前面的 | 全学一遍 | 20 |

## 各板块接入清单

### 教材同步（Textbook.jsx）
- 在每本「册」卡片处加 LockedOverlay；非第一册看上一册完成度
- 计算上一册整体 percent：把所有 unit data 合并后调 getLessonStats

### 语法（Grammar.jsx）
- 顺序看第一项 grammar topic，往后每一项依赖前一项 `progress[topicId].done`

### 单词（VocabStudy.jsx 内 unit 列表）
- 仅锁单元卡，每册第一 unit 免费；后续看上一 unit `progress.attempted > 0`

### 字母（AlphabetLearn.jsx）
- 26 字母里的后 10 个（Q-Z）做一个一次性锁；判断前 16 个是否每个 attempted

### 音标（PhonemeLearn.jsx）
- 同上模式

## 老用户兼容

`useUnlocks` 服务端拉取与本地存储合并，已有的学习进度本身可以触发「顺序阈值」免费解锁，所以**无需额外迁移**。
