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

const SHORT_LABELS: Record<string, string> = {
  'Governance Structures & Accountability': 'Governance',
  'Human Oversight & Control': 'Oversight',
  'Data Governance & Privacy': 'Data Privacy',
  'Transparency & Explainability': 'Transparency',
  'Fairness & Non-Discrimination': 'Fairness',
  'Accountability & Redress': 'Accountability',
  'Workforce Transformation & Worker Outcomes': 'Workforce',
}

export default function RadarChartViz({ data }: RadarChartVizProps) {
  const chartData = data.map((d) => ({
    ...d,
    section: SHORT_LABELS[d.section] ?? d.section,
  }))

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-base font-semibold mb-4" style={{ color: '#1B2D5B' }}>
        Maturity Profile
      </h3>
      <div style={{ minHeight: 400, width: '100%' }}>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={chartData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis
              dataKey="section"
              tick={{ fill: '#374151', fontSize: 12 }}
            />
            <PolarRadiusAxis
              domain={[0, 4]}
              tickCount={5}
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
            />
            <Radar
              dataKey="score"
              fill="#1B2D5B"
              fillOpacity={0.3}
              stroke="#1B2D5B"
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
