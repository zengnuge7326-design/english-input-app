/**
 * Duolingo 路径标定 — 像素级（逻辑 px · viewBox 320 宽）
 *
 * 参考屏宽 ~390pt，路径区 320pt，岛直径 86.4pt，裙边 9.6pt。
 * 12 岛总高约 1880pt；7 岛约 1160pt。
 *
 * 横向不是 index%2 锯齿，也不是单段 cos；而是两段三连节奏拼成的大写 S：
 *   屏 A（图二）: 55% → 35% → 50%  （略右 → 左 → 中）
 *   屏 B（图一）: 65% → 75% → 50%  （右 → 极右 → 中）
 *   收尾        : 35%             （左）
 *
 * 7 岛锚点 (x, y)：
 *   #0 (176,  88)  #1 (112, 251)  #2 (160, 414)
 *   #3 (208, 577)  #4 (240, 740)  #5 (160, 903)
 *   #6 (112, 1066)
 */

export const MAP_VIEW_W = 320
export const ORB_SIZE = 86.4
export const ORB_SKIRT = 9.6

export const TRAIL_TARGET_H = 1880
export const PATH_START_Y = 88
export const TRAIL_END_PAD = 96
/** 岛屿纵向间距缩放（1=原间距，0.5=缩短一半）；横向比例不变 */
export const TRAIL_VERTICAL_SCALE = 0.5

/** 7 岛横向比例（相对 MAP_VIEW_W）— 来自 Duolingo 截图实测 */
const DUO_X_RATIO_7 = [0.55, 0.35, 0.5, 0.65, 0.75, 0.5, 0.35] as const

/** 8 岛横向比例 — 延续大写 S 节奏 */
const DUO_X_RATIO_8 = [0.55, 0.35, 0.5, 0.65, 0.75, 0.5, 0.35, 0.5] as const

/** 12 岛横向比例 — 延续大写 S 节奏 */
const DUO_X_RATIO_12 = [
  0.55, 0.35, 0.5, 0.65, 0.75, 0.5,
  0.35, 0.55, 0.35, 0.5, 0.65, 0.5,
] as const

export function nodeGap(nodeCount: number) {
  if (nodeCount <= 1) return 0
  const fullGap = (TRAIL_TARGET_H - PATH_START_Y - TRAIL_END_PAD) / (nodeCount - 1)
  return fullGap * TRAIL_VERTICAL_SCALE
}

function xRatio(index: number, nodeCount: number) {
  if (nodeCount === 8) return DUO_X_RATIO_8[index] ?? 0.5
  if (nodeCount === 12) return DUO_X_RATIO_12[index] ?? 0.5
  if (nodeCount === 7) return DUO_X_RATIO_7[index] ?? 0.5
  const t = nodeCount <= 1 ? 0 : index / (nodeCount - 1)
  return 0.5 - 0.235 * Math.cos(t * Math.PI * 2)
}

export function nodePoint(index: number, nodeCount: number) {
  return {
    x: MAP_VIEW_W * xRatio(index, nodeCount),
    y: PATH_START_Y + index * nodeGap(nodeCount),
  }
}

export function trailHeight(nodeCount: number) {
  if (nodeCount <= 0) return 0
  const last = nodePoint(nodeCount - 1, nodeCount)
  return last.y + TRAIL_END_PAD
}

/** 路径与岛同心：段内控制点 42%/58% 纵距，保持端点切线方向 */
export function buildPathD(nodeCount: number) {
  if (nodeCount < 2) return ''
  const points = Array.from({ length: nodeCount }, (_, i) => nodePoint(i, nodeCount))
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const cur = points[i]
    const dy = cur.y - prev.y
    d += ` C ${prev.x} ${prev.y + dy * 0.42}, ${cur.x} ${prev.y + dy * 0.58}, ${cur.x} ${cur.y}`
  }
  return d
}

export function nodeAnchorStyle(index: number, nodeCount: number) {
  const { x, y } = nodePoint(index, nodeCount)
  return {
    left: `${(x / MAP_VIEW_W) * 100}%`,
    top: y,
  } as const
}
