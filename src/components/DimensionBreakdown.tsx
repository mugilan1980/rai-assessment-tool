import { type Section } from '../data/assessment'

interface DimensionBreakdownProps {
  sections: Section[]
  sectionScores: number[]
}

function scoreColor(score: number): string {
  if (score === 0) return '#D1D5DB'
  if (score >= 3.5) return '#10B981'
  if (score >= 2.5) return '#F59E0B'
  return '#EF4444'
}

export default function DimensionBreakdown({ sections, sectionScores }: DimensionBreakdownProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-base font-semibold mb-5" style={{ color: '#1B2D5B' }}>
        Dimension Breakdown
      </h3>
      <div className="flex flex-col gap-4">
        {sections.map((section, i) => {
          const score = sectionScores[i] ?? 0
          const pct = Math.min((score / 4) * 100, 100)
          const color = scoreColor(score)
          const isUnanswered = score === 0

          return (
            <div key={section.id}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-gray-700 pr-4 leading-snug flex-1 min-w-0">
                  {section.title}
                </span>
                {isUnanswered ? (
                  <span className="text-xs text-gray-400 whitespace-nowrap">Not answered</span>
                ) : (
                  <span className="text-sm font-semibold text-gray-700 whitespace-nowrap ml-2">
                    {score.toFixed(1)} / 4.0
                  </span>
                )}
              </div>
              <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
