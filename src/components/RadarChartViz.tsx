import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'

interface RadarDataPoint {
  section: string
  score: number
  fullMark: 4
}

interface RadarChartVizProps {
  data: RadarDataPoint[]
}

// Keys must exactly match section titles from assessment.ts
const SHORT_LABELS: Record<string, string> = {
  'Governance Structures & Accountability': 'Governance',
  'Human Oversight & Control': 'Oversight',
  'Data Governance & Privacy': 'Data Privacy',
  'Algorithmic Fairness & Transparency': 'Fairness',
  'AI Ethics & Responsible Use': 'Ethics',
  'Agentic AI Readiness': 'Agentic AI',
  'Workforce-Centred AI Adoption': 'Workforce',
}

function formatLabel(value: string): string {
  return SHORT_LABELS[value] ?? value
}

export default function RadarChartViz({ data }: RadarChartVizProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-base font-semibold mb-4" style={{ color: '#1B2D5B' }}>
        Maturity Profile
      </h3>
      <div style={{ minHeight: 400, width: '100%' }}>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={data} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis
              dataKey="section"
              tickFormatter={formatLabel}
              tick={{ fill: '#374151', fontSize: 12 }}
            />
            <PolarRadiusAxis
              domain={[0, 4]}
              tickCount={5}
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
              allowDataOverflow
            />
            <Radar
              dataKey="score"
              fill="#1B2D5B"
              fillOpacity={0.3}
              stroke="#1B2D5B"
              strokeWidth={2}
              isAnimationActive={false}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
