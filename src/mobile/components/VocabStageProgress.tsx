import { VOCAB_STAGE_MILESTONES } from '../data/unit1Vocab'

interface Props {
  matched: number
  total: number
}

export default function VocabStageProgress({ matched, total }: Props) {
  const milestones = [...VOCAB_STAGE_MILESTONES].filter(m => m <= total)
  const stageSizes = milestones.map((end, i) => {
    const start = i === 0 ? 0 : milestones[i - 1]
    return end - start
  })

  return (
    <div className="vocab-stage-progress" role="progressbar" aria-valuenow={matched} aria-valuemin={0} aria-valuemax={total}>
      {milestones.map((end, i) => {
        const start = i === 0 ? 0 : milestones[i - 1]
        const size = stageSizes[i]
        const inStage = Math.max(0, Math.min(matched - start, size))
        const pct = (inStage / size) * 100
        const done = matched >= end
        const isLast = i === milestones.length - 1

        return (
          <div key={end} className="vocab-stage-progress__unit">
            <div className="vocab-stage-progress__seg" style={{ flexGrow: size }}>
              <div
                className={`vocab-stage-progress__fill${done ? ' vocab-stage-progress__fill--full' : ''}`}
                style={{ width: done ? '100%' : `${pct}%` }}
              />
            </div>
            <span
              className={`vocab-stage-progress__node${done ? ' vocab-stage-progress__node--done' : ''}`}
              aria-hidden
            >
              {done ? '✓' : isLast ? size : ''}
            </span>
          </div>
        )
      })}
    </div>
  )
}
