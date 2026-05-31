import { type OrgProfile } from '../data/assessment'
import Header from './Header'

interface PlaceholderAssessmentProps {
  orgProfile: OrgProfile
  onBack: () => void
}

export default function PlaceholderAssessment({ orgProfile, onBack }: PlaceholderAssessmentProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <Header showFull={false} />

      <div className="bg-white rounded-2xl shadow-sm border p-8 text-center" style={{ borderColor: '#e2e8f0' }}>
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
          style={{ backgroundColor: '#F0F4F8' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#1B2D5B' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>

        <h2 className="text-xl font-bold mb-1" style={{ color: '#1B2D5B' }}>
          Assessment Flow
        </h2>
        <p className="text-sm mb-8" style={{ color: '#00A79D' }}>
          Coming in Block 3
        </p>

        <div
          className="rounded-xl border p-5 text-left mb-8"
          style={{ borderColor: '#e2e8f0', backgroundColor: '#F8FAFC' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#94a3b8' }}>
            Organisation Profile
          </p>
          <dl className="space-y-2">
            <div className="flex gap-2 text-sm">
              <dt className="font-medium w-28 shrink-0" style={{ color: '#64748b' }}>Organisation</dt>
              <dd style={{ color: '#1e293b' }}>{orgProfile.orgName}</dd>
            </div>
            <div className="flex gap-2 text-sm">
              <dt className="font-medium w-28 shrink-0" style={{ color: '#64748b' }}>Industry</dt>
              <dd style={{ color: '#1e293b' }}>{orgProfile.industry}</dd>
            </div>
            <div className="flex gap-2 text-sm">
              <dt className="font-medium w-28 shrink-0" style={{ color: '#64748b' }}>Size</dt>
              <dd style={{ color: '#1e293b' }}>{orgProfile.companySize}</dd>
            </div>
          </dl>
        </div>

        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-lg border text-sm font-medium transition-colors"
          style={{ borderColor: '#cbd5e1', color: '#475569' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#1B2D5B'
            e.currentTarget.style.color = '#1B2D5B'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#cbd5e1'
            e.currentTarget.style.color = '#475569'
          }}
        >
          Back to Welcome
        </button>
      </div>
    </div>
  )
}
