import MaturityBadge from './MaturityBadge'

type ProfileLabel = 'Aligned Adopter' | 'Governance-Heavy' | 'People-First' | 'Early Stage'

interface AdoptionProfileCardProps {
  profile: ProfileLabel
  governanceScore: number
  workforceScore: number
  workforceMaturityBand: string
}

const PROFILE_DESCRIPTIONS: Record<ProfileLabel, string> = {
  'Aligned Adopter':
    'Your organisation demonstrates strong governance maturity and is genuinely transforming work with AI. You\'re set up to scale AI deployment responsibly while preserving worker outcomes.',
  'Governance-Heavy':
    'Your governance frameworks are well-developed, but workers aren\'t yet seeing the benefits in practice. Risk: compliance without transformation.',
  'People-First':
    'Your workforce approach is admirable, but governance gaps could expose the organisation to risk as AI deployment scales. Strengthen the foundations.',
  'Early Stage':
    'Both governance and workforce transformation need development before scaling AI deployment. Focus on foundations before scale.',
}

function ScoreBar({
  label,
  score,
  color,
}: {
  label: string
  score: number
  color: string
}) {
  const pct = Math.min((score / 4) * 100, 100)
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <span className="text-xs font-semibold text-gray-700 ml-2 whitespace-nowrap">
          {score.toFixed(1)} / 4.0
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

export default function AdoptionProfileCard({
  profile,
  governanceScore,
  workforceScore,
  workforceMaturityBand,
}: AdoptionProfileCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 h-full flex flex-col gap-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-1">
          Adoption Profile
        </p>
        <h2 className="text-2xl font-bold" style={{ color: '#1B2D5B' }}>
          {profile}
        </h2>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          {PROFILE_DESCRIPTIONS[profile]}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <ScoreBar label="Governance Score (D1–D6)" score={governanceScore} color="#1B2D5B" />
        <ScoreBar label="Workforce Score (D7)" score={workforceScore} color="#00A79D" />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Workforce band:</span>
        <MaturityBadge label={workforceMaturityBand} variant="workforce" />
      </div>
    </div>
  )
}
