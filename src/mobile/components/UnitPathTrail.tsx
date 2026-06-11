import type { RefObject } from 'react'
import type { MapNode } from '../types'
import { nodeAnchorStyle, trailHeight } from '../utils/mapPath'
import MapIslandNode from './MapIslandNode'

interface Props {
  nodes: MapNode[]
  currentNodeId: string
  currentRef: RefObject<HTMLDivElement | null>
  onSelectNode: (node: MapNode) => void
}

export default function UnitPathTrail({ nodes, currentNodeId, currentRef, onSelectNode }: Props) {
  const n = nodes.length
  const height = trailHeight(n)

  return (
    <div className="map-unit-trail" style={{ height }}>
      {nodes.map((node, i) => (
        <div
          key={node.id}
          ref={node.id === currentNodeId ? currentRef : undefined}
          className="map-unit-trail__anchor"
          style={nodeAnchorStyle(i, n)}
        >
          <MapIslandNode node={node} onClick={() => onSelectNode(node)} />
        </div>
      ))}
    </div>
  )
}
