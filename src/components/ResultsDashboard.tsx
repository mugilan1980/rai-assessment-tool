import { useMemo } from 'react'
import { SECTIONS, type OrgProfile } from '../data/assessment'
import {
  getSectionScore,
  getGovernanceScore,
  getWorkforceScore,
  getOverallScore,
  getMaturityLevel,
  getWorkforceMaturityBand,
  getAdoptionProfile,
  getRadarChartData,
} from '../lib/scoring'
import Header from './Header'
import MaturityBadge from './MaturityBadge'
import RadarChartViz from './RadarChartViz'
import AdoptionProfileCard from './AdoptionProfileCard'
import DimensionBreakdown from './DimensionBreakdown'

interface ResultsDashboardProps {
  orgProfile: OrgProfile
  responses: Record<string, number>
  notes: Record<string, string>
  assessmentId: string
  onGenerateActionPlan: () => void
  onBackToWelcome: () => void
}

export default function ResultsDashboard({
  orgProfile,
  responses,
  assessmentId,
  onGenerateActionPlan,
  onBackToWelcome,
}: ResultsDashboardProps) {
  const sectionScores = useMemo(
    () => SECTIONS.map((_, i) => getSectionScore(responses, i, SECTIONS)),
    [responses]
  )
  const governanceScore = useMemo(() => getGovernanceScore(responses, SECTIONS), [responses])
  const workforceScore = useMemo(() => getWorkforceScore(responses, SECTIONS), [responses])
  const overallScore = useMemo(() => getOverallScore(responses, SECTIONS), [responses])
  const maturity = useMemo(() => getMaturityLevel(overallScore), [overallScore])
  const workforceMaturityBand = useMemo(() => getWorkforceMaturityBand(workforceScore), [workforceScore])
  const adoptionProfile = useMemo(() => getAdoptionProfile(governanceScore, workforceScore), [governanceScore, workforceScore])
  const radarData = useMemo(() => getRadarChartData(responses, SECTIONS), [responses])

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#F0F4F8' }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Header showFull={false} />

        {/* Breadcrumb */}
        <p className="text-sm mb-6" style={{ color: '#64748b' }}>
          {orgProfile.orgName} &middot; {orgProfile.industry}
        </p>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-1" style={{ color: '#1B2D5B' }}>
          Your Results
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Based on your responses across 49 questions and 7 dimensions
        </p>

        {/* Above the fold: profile card + radar chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AdoptionProfileCard
            profile={adoptionProfile}
            governanceScore={governanceScore}
            workforceScore={workforceScore}
            workforceMaturityBand={workforceMaturityBand}
          />
          <RadarChartViz data={radarData} />
        </div>

        {/* Dimension breakdown */}
        <div className="mb-6">
          <DimensionBreakdown sections={SECTIONS} sectionScores={sectionScores} />
        </div>

        {/* Maturity summary badges */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-base font-semibold mb-4" style={{ color: '#1B2D5B' }}>
            Summary
          </h3>
          <div className="flex flex-wrap gap-3">
            <MaturityBadge
              label={`Overall Maturity: Level ${maturity.level} — ${maturity.label}`}
              variant="overall"
            />
            <MaturityBadge
              label={`Governance: ${governanceScore.toFixed(1)}/4`}
              variant="governance"
            />
            <MaturityBadge
              label={workforceMaturityBand}
              variant="workforce"
            />
          </div>
        </div>

        {/* CTA card */}
        <div
          className="rounded-2xl shadow-sm p-8 mb-8"
          style={{ backgroundColor: '#1B2D5B' }}
        >
          <h3 className="text-xl font-bold text-white mb-2">Generate Your Action Plan</h3>
          <p className="text-sm mb-6" style={{ color: '#93C5FD' }}>
            Get a personalised 90-day Responsible AI Adoption plan with specific actions tied to
            your scores, including IMDA framework references and worker outcome priorities.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              type="button"
              onClick={onGenerateActionPlan}
              className="px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
              style={{ backgroundColor: '#00A79D', color: '#ffffff' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#00958c')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#00A79D')}
            >
              Generate Action Plan
            </button>
            <button
              type="button"
              onClick={onBackToWelcome}
              className="text-sm transition-colors"
              style={{ color: '#93C5FD' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#93C5FD')}
            >
              Start New Assessment
            </button>
          </div>
        </div>

        {/* Assessment ID */}
        <p className="text-xs text-gray-400 text-center pb-8">
          Assessment ID: {assessmentId}
        </p>
      </div>
    </div>
  )
}
