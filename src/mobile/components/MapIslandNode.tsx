import { motion } from 'framer-motion'
import type { MapNode } from '../types'

export type IslandTier = 'locked' | 'unlearned' | 'green' | 'purple'

interface Props {
  node: MapNode
  onClick: () => void
  /** 锁定岛被点击（用于宝石跳关确认） */
  onLockedClick?: () => void
}

/** 水晶进度：0=蓝 · 1=绿 · 2+=紫 · 3=紫+金星 */
export function islandTier(node: MapNode): IslandTier {
  if (node.status === 'locked') return 'locked'
  const sets = node.setsCompleted ?? 0
  if (sets >= 2) return 'purple'
  if (sets >= 1) return 'green'
  return 'unlearned'
}

const GLYPH_KINDS = new Set(['reward', 'boss', 'listening', 'practice'])

function islandGlyph(node: MapNode, tier: IslandTier) {
  if (tier === 'locked') return null
  if (node.kind === 'exam' && (node.setsCompleted ?? 0) < 3) return '🎯'
  if (node.kind === 'reward') return '📦'
  if (node.kind === 'boss') return '🏆'
  if (node.kind === 'listening') return '🎧'
  if (node.kind === 'practice') return '🎮'
  return null
}

function showStar(node: MapNode, tier: IslandTier) {
  if (tier === 'locked') return false
  if (node.kind === 'exam' && (node.setsCompleted ?? 0) < 3) return false
  return !GLYPH_KINDS.has(node.kind)
}

const STAR_PATH =
  'M12 1.8 14.95 8.64 22.4 9.38 16.7 14.28 18.45 21.6 12 17.88 5.55 21.6 7.3 14.28 1.6 9.38 9.05 8.64 12 1.8Z'

// 10 个三角面（C=中心, P=外角, I=内凹）按逆时针展开
// 颜色按"光从左上"预先烘焙：top-left 亮 → bottom-right 暗
const FACETS: Array<{ d: string; white: string; gold: string }> = [
  // f0 C-P0-I0  右上（top-right of top point）
  { d: 'M12 12 L12 1.8 L14.95 8.64 Z', white: '#e6ecf5', gold: '#ffd54a' },
  // f1 C-I0-P1  右上（top of right arm）
  { d: 'M12 12 L14.95 8.64 L22.4 9.38 Z', white: '#a8b2c2', gold: '#b07a00' },
  // f2 C-P1-I1  右下（bottom of right arm）
  { d: 'M12 12 L22.4 9.38 L16.7 14.28 Z', white: '#7d899e', gold: '#8a5e00' },
  // f3 C-I1-P2  右下
  { d: 'M12 12 L16.7 14.28 L18.45 21.6 Z', white: '#6b7588', gold: '#704a00' },
  // f4 C-P2-I2  右下→正下
  { d: 'M12 12 L18.45 21.6 L12 17.88 Z', white: '#7d899e', gold: '#8a5e00' },
  // f5 C-I2-P3  左下
  { d: 'M12 12 L12 17.88 L5.55 21.6 Z', white: '#c4ccda', gold: '#d39a00' },
  // f6 C-P3-I3  左下→左
  { d: 'M12 12 L5.55 21.6 L7.3 14.28 Z', white: '#e6ecf5', gold: '#f5b631' },
  // f7 C-I3-P4  左上
  { d: 'M12 12 L7.3 14.28 L1.6 9.38 Z', white: '#ffffff', gold: '#ffe28a' },
  // f8 C-P4-I4  左上（最亮）
  { d: 'M12 12 L1.6 9.38 L9.05 8.64 Z', white: '#ffffff', gold: '#fff8d0' },
  // f9 C-I4-P0  左上
  { d: 'M12 12 L9.05 8.64 L12 1.8 Z', white: '#ffffff', gold: '#ffec8c' },
]

function IslandStar({ gold, tier }: { gold?: boolean; tier: IslandTier }) {
  return (
    <svg
      className={['map-island__star', gold ? 'map-island__star--gold' : `map-island__star--${tier}`].join(' ')}
      viewBox="0 0 24 24"
      aria-hidden
    >
      {/* 阴影底盘（嵌在水晶里的投影） */}
      <path className="map-island__star-shadow" d={STAR_PATH} />
      {/* 10 个面 · 浮雕立体 */}
      <g className="map-island__star-facets">
        {FACETS.map((f, i) => (
          <path key={i} d={f.d} fill={gold ? f.gold : f.white} />
        ))}
      </g>
      {/* 外轮廓细描边，让边界更利 */}
      <path
        className="map-island__star-outline"
        d={STAR_PATH}
        fill="none"
        stroke={gold ? 'rgba(140, 90, 0, 0.55)' : 'rgba(40, 56, 88, 0.55)'}
        strokeWidth="0.35"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function MapIslandNode({ node, onClick, onLockedClick }: Props) {
  const tier = islandTier(node)
  const locked = tier === 'locked'
  const glyph = islandGlyph(node, tier)
  const star = showStar(node, tier)
  const goldStar = (node.setsCompleted ?? 0) >= 3

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={locked ? onLockedClick : onClick}
      disabled={locked && !onLockedClick}
      className={[
        'map-island',
        'map-island--orb',
        `map-island--${tier}`,
      ].filter(Boolean).join(' ')}
      aria-label={node.title}
      title={node.title}
    >
      {star ? <IslandStar gold={goldStar} tier={tier} /> : null}
      {glyph ? <span className="map-island__glyph" aria-hidden>{glyph}</span> : null}
    </motion.button>
  )
}
