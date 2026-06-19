# 北师大高中英语 2019 → 2025 替换 — Claude 执行说明

> **写给接手执行的 Claude**：用户要把站点里所有旧版（2019 课标）北师大高中内容，换成桌面 `北师版2025` 文件夹里的 **2025 学生正在学的课本**。主站 + 手机端都要换。用户明确要求：**两版若高度重复，用简洁高效策略，不要无脑 OCR 928 页重来。**

---

## 1. 任务目标

| 要做 | 不做 |
|------|------|
| 替换 7 册练习句 JSON（`bsda_b1`～`bsda_s4`） | 不重写 React 架构 |
| 替换词汇表 `bsda_words.json` | 不动小学 PEP / 仁爱初中 |
| 主站 `Textbook.jsx` 单元标题、`App.jsx` 切片 | 语法题可 Phase 2 后置 |
| 手机端自动跟新（共用 JSON） | 不 force push / 不擅自 commit |

**验收标准**：必修一任意 3 段课文与 2025 PDF 对照一致；7 册 JSON 可 `npm run build`；主站教材同步 + 手机高中课文能打开练习。

---

## 2. 素材位置

### 2.1 新版（权威来源 · 2025）

```
/Users/hong/Desktop/北师版2025/北师大•高中英语【电子课本】/
├── 最新【北师大】高中英语•必修第一册.pdf    (129 页)
├── 最新【北师大】高中英语•必修第二册.pdf    (129 页)
├── 最新【北师大】高中英语•必修第三册.pdf    (133 页)
├── 最新【北师大】高中英语•选修第一册.pdf    (133 页)
├── 最新【北师大】高中英语•选修第二册.pdf    (137 页)
├── 最新【北师大】高中英语•选修第三册.pdf    (134 页)
└── 最新【北师大】高中英语•选修第四册.pdf    (133 页)
```

**技术事实（已验证）**：
- `pdftotext` **抽不出字**（纯扫描图）
- OCR 可用：`pdftoppm` + `tesseract -l eng`（中文页眉可选 `chi_sim`）
- OCR 必修一第 9 页已见 **Life Choices**、Edison/Gandhi 名言 — 与现网 `bsda_b1.json` **主题高度重合**，但目录页 Unit 1 大标题为 **Lifestyles**（子主题为 Life Choices）

### 2.2 旧版（可复用语料库 · 2019）

```
/Users/hong/Desktop/北师大版高中英语/
├── 普通高中教科书·英语必修 第一册.docx          ← 有文本层
├── …（必修二/三、选必一至四 .docx）
├── 普通高中教科书·英语必修 第一册_extracted.json
├── 提取结果/普通高中教科书·英语必修 第一册_正文.json
└── …
```

**现网数据（项目内）**：

| 文件 | 规模 | 来源 |
|------|------|------|
| `src/data/bsda_b1.json` | 857 句 | 旧 DOCX 管线 |
| `src/data/bsda_b2.json` | 958 句 | 同上 |
| `src/data/bsda_b3.json` | 908 句 | 同上 |
| `src/data/bsda_s1.json` | 1023 句 | 同上 |
| `src/data/bsda_s2.json` | 1106 句 | 同上 |
| `src/data/bsda_s3.json` | 1151 句 | 同上 |
| `src/data/bsda_s4.json` | 1185 句 | 同上 |
| `src/data/bsda_words.json` | 7 册词汇 | `scripts/build-bsda-vocab.py` 读旧 DOCX |

**句子 schema（必须保持）**：

```json
{ "id": 1, "unit": "Unit 1", "zh": "中文", "en": "English sentence." }
```

---

## 3. 架构：换数据一次，两端同步

```
bsda_*.json + bsda_words.json
    ├── 主站 Textbook.jsx（教材同步 + 练习导入）
    ├── 主站 App.jsx ALL_UNITS（底部上一单元/下一单元）
    ├── 主站 VocabStudy.jsx（单词本）
    ├── 手机 secondaryBooks.ts（高中课文，程序化生成，无需手改结构）
    ├── 手机 vocabBooks.ts / gradeBooks.ts
    └── 青蛙跳 levels.js（用 bsda_words）
```

**手机端几乎零 UI 改动** — 只要 JSON 路径和 `bookId`（`bsda_b1` 等）不变。

---

## 4. 核心策略：增量替换，不要全量重做

用户要求：**2019 与 2025 若高度重复，用最高效路径。**

### 4.1 三源对齐模型

```
                    ┌─────────────────┐
                    │ 2025 PDF (权威) │  ← 最终 en 以它为准
                    └────────┬────────┘
                             │ OCR / 目录
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        新 OCR 句表    旧 bsda_*.json   旧 DOCX 正文
        (仅增量)       (已有 en+zh)     (结构化提取)
```

### 4.2 按册决策树（每册跑一遍）

```
Step A: OCR 目录页（约 4–6 页）→ 得到 2025 单元表 Unit 1/2/3 英文名
Step B: 与现网 Textbook.jsx descByUnit + 旧 JSON 的 unit 分布对比
Step C: 计算重复率
```

| 重复率 | 策略 | 工作量 |
|--------|------|--------|
| **≥ 85%** 单元名相同且抽样 20 句 en 模糊匹配 ≥ 90% | **保留旧 JSON 为底稿**，仅 OCR 目录 + 变更页（Reading/对话），diff 后 patch | 低 |
| **50–85%** | 旧 JSON 作 **zh 翻译库**；2025 OCR 出 en 主列表；`fuzzy match` 复用 zh | 中 |
| **< 50%** 或单元结构大变 | 该册全量 OCR Reading 区块 + LLM 清洗 | 高 |

### 4.3 句子级复用算法（建议写进 `scripts/bsda_merge.py`）

```python
def norm_en(s: str) -> str:
    # 小写、去多余空白、统一弯引号/破折号、去 OCR 噪声
    ...

def match_sentence(new_en, old_pool, threshold=0.92):
    # 1. 精确匹配 norm_en
    # 2. difflib.SequenceMatcher 或 rapidfuzz
    # 3. 命中 → 复用 old.zh，en 用 new_en（2025 为准）
    # 4. 未命中 → 标记 needs_zh，批量送 LLM 翻译
```

**旧版中文质量已经不错时，不要重新翻译整册** — 只翻译 `needs_zh` 列表。

### 4.4 词汇表复用

1. 若 2025 仅有 PDF：OCR 书后 `VOCABULARY IN EACH UNIT` / `Words and Expressions in Each Unit`（参考 `scripts/parse_high_school.py` 的切分逻辑）。
2. 与现网 `bsda_words.json` 按 `word` 精确匹配：
   - 相同 → 保留 `ipa` + `zh`
   - 新增 → LLM 补 ipa/zh
   - 删除 → 从 JSON 移除
3. 若用户后续提供 2025 DOCX，**优先 DOCX**（改 `build-bsda-vocab.py` 的 `DESKTOP` 路径即可）。

### 4.5 不建议做的事

- ❌ 不要默认 OCR 全部 928 页
- ❌ 不要改 `bookId`（`bsda_b1` 等），否则进度键和路由全断
- ❌ 不要手写 `App.jsx` 里几百行 `Unit 3AZ` 切片（见 §5.2）
- ❌ 不要 Phase 1 就重写 7 个 `grammar/bsda_*.js`（手写语法题，可标「更新中」）

---

## 5. 工程改动清单

### Phase 0 — 摸底（先做，1 天）

- [ ] 7 册各 OCR 目录页，输出 `scripts/extracted/bsda2025/inventory.json`：
  ```json
  { "b1": { "units": ["Lifestyles", "Sports and Fitness", "..."], "pages": 129 } }
  ```
- [ ] 必修一：抽 Unit 1 连续 30 句，算与 `bsda_b1.json` 的匹配率，写入 `docs/bsda2025-diff-b1.md`
- [ ] 确认用户是否有 2025 DOCX（有则词汇和部分正文走 DOCX）

### Phase 1 — 数据管线（核心）

新建脚本（名称可调整）：

```
scripts/
  build_bsda2025.py      # 主入口：按册生成 src/data/bsda_*.json
  bsda_merge.py          # 旧 JSON + 新 OCR 模糊合并
  bsda_ocr.py            # pdftoppm + tesseract，缓存到 scripts/extracted/bsda2025/{book}/page-###.txt
  generate_bsda_slices.js # 可选：打印 App.jsx 用的 createLessons 片段
```

**OCR 范围（仅当 diff 需要时）**：
- 优先：`Reading` / `Reading Club` / `Topic Talk` 正文页
- 跳过：Workbook、Grammar Summary、练习指令、纯中文页、答案页

**LLM 清洗 prompt 要点**（可用 ollama `gemma3:4b`，项目里已有先例）：
- 输入：OCR 文本块
- 输出：JSON 数组 `[{ "en": "...", "unit": "Unit 1" }]`
- 过滤：页眉页脚、Page 数字、`ACTIVATE`/`VIEW` 教学步骤标题、不足 5 词的碎片

**输出前**：
- 备份旧文件 → `src/data/archive/bsda2019/`
- `id` 从 1 连续编号
- `unit` 字段统一 `Unit 1` / `Unit 2` / `Unit 3`

**推荐执行顺序**：`b1` → `b2` → `b3` → `s1` → `s2` → `s3` → `s4`

### Phase 2 — 词汇

- [ ] 更新 `scripts/build-bsda-vocab.py`：`DESKTOP` 指向 2025 源（或新 OCR 附录）
- [ ] `python3 scripts/build-bsda-vocab.py`
- [ ] `python3 scripts/fix_vocab_ipa.py --write --bsda`
- [ ] 更新 `src/mobile/data/gradeBooks.ts` 里各册 `wordCount`

### Phase 3 — 主站接线（小）

**`src/components/Textbook.jsx`**
- 更新 7 册 `desc` 为「北师大版高中英语（2025）」
- 更新 `lessonsFromUnits(..., descByUnit)` 里单元英文名（以 inventory 为准）
- 例：必修一 Unit 1 可能从 `Life Choices` 改为 `Lifestyles` 或保留子主题

**`src/App.jsx` — 重要简化**

仁爱已用 `createLessons()`，北师大仍是手写巨型数组。**应改为**：

```javascript
...createLessons(bsdaB1Data, '必修 第一册', 'bsda_b1'),
...createLessons(bsdaB2Data, '必修 第二册', 'bsda_b2'),
// … b3, s1, s2, s3, s4
```

`createLessons` 已在 `App.jsx` 约 138 行：按 `unit` 分组、每 10 句切 `Unit 1A/1B/…`。

**文案**
- `VocabStudy.jsx` / `secondaryBooks.ts` subtitle 可加「2025」

**进度**
- 换版后句子 `id` 会变 → 默认 **接受北师大进度清零**（最简单）
- 或在 `bookId` 加后缀 `bsda_b1_2025`（改动面大，非必要不做）

### Phase 4 — 语法专项（可选后置）

| 文件 | 绑定旧单元 |
|------|-----------|
| `src/data/grammar/bsda_b1.js` … `bsda_s4.js` | Life Choices, Sports… 等 |
| `src/data/grammar/index.js` | 注册表 |

**选项 A（推荐先上线）**：语法入口对高中北师大显示「内容更新中」  
**选项 B**：按新单元逐册手写/生成语法题

### Phase 5 — 验证与部署

```bash
cd /Users/hong/english-input-app
npm run build
# 主站：教材同步 → 高中 → 必修一 → 任一课
# 手机：课文 → 高中 → 必修第一册
./scripts/deploy.sh   # 用户要求部署时
```

---

## 6. 现网单元标题对照（2019 · 待 2025 inventory 覆盖）

| bookId | Unit 1 | Unit 2 | Unit 3 |
|--------|--------|--------|--------|
| bsda_b1 | Life Choices | Sports and Fitness | Celebrations |
| bsda_b2 | Information Technology | Humans and Nature | The Admirable |
| bsda_b3 | Art | Green Living | Learning |
| bsda_s1 | Relationships | Success | — |
| bsda_s2 | Humor | Education | The Media |
| bsda_s3 | Careers | Literature | Human Biology |
| bsda_s4 | Connections | Conflict and Compromise | Innovation |

2025 目录已见必修一 Unit 1 大标题 **Lifestyles** — inventory 完成后更新上表。

---

## 7. 工作量评估

| 模块 | 规模 | 判断 |
|------|------|------|
| 数据生产 | ~7000 句 + 词汇 | **主战场**；有复用策略可压到 1–2 周 |
| 主站代码 | Textbook + App 简化 | **1–2 天** |
| 手机代码 | 0–0.5 天 | 自动跟随 JSON |
| 语法题 | 7 文件手写 | **可不做** 或 +2 周 |

**结论**：不是「超级大工程」，是 **内容迁移项目**；重复率高时 **diff + 复用 zh** 比全量 OCR 省 70%+ 时间。

---

## 8. 参考脚本与文件

| 用途 | 路径 |
|------|------|
| 词汇提取（旧） | `scripts/build-bsda-vocab.py` |
| 音标修复 | `scripts/fix_vocab_ipa.py --bsda` |
| 高中词汇 OCR+Gemma 范例 | `scripts/parse_high_school.py` |
| PEP PDF 段落生成范例 | `scripts/build_pep_sections.py` |
| 手机高中课文 | `src/mobile/textbook/data/secondaryBooks.ts` |
| 主站教材 | `src/components/Textbook.jsx` |
| 底部单元导航 | `src/App.jsx` → `createLessons` |
| 语法注册 | `src/data/grammar/index.js` |

---

## 9. 用户偏好（执行时注意）

1. **主站和手机都要换**，但优先保证练习句 + 单词 + 手机课文；语法可后补。
2. **两版重复处用简洁策略**：旧 JSON/DOCX 作翻译库，2025 PDF 只作 diff 权威。
3. 部署站点：`https://okenglish.site`（`./scripts/deploy.sh`）。
4. 不要未经用户要求 git commit。
5. 完成后可更新 Obsidian / 桌面备份（用户常要，但非本任务必须）。

---

## 10. 建议第一天交付物

1. `scripts/extracted/bsda2025/inventory.json`（7 册目录）
2. `docs/bsda2025-diff-b1.md`（必修一重复率报告 + 样例 diff）
3. `scripts/bsda_merge.py` 骨架 + 必修一试点 `src/data/bsda_b1.json`（或放 `bsda_b1.draft.json` 供审）
4. PR 式说明：每册采用「全量 / 增量 / 复用」哪种策略

---

*文档版本：2026-06-18 · 由 Cursor 分析整理，供 Claude 执行北师大 2025 替换任务。*
