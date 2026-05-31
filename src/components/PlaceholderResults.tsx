import Header from './Header'

interface PlaceholderResultsProps {
  assessmentId: string
  onBackToWelcome: () => void
}

export default function PlaceholderResults({ assessmentId, onBackToWelcome }: PlaceholderResultsProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <Header showFull={false} />

      <div className="bg-white rounded-2xl shadow-sm border p-10 text-center" style={{ borderColor: '#e2e8f0' }}>
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-6"
          style={{ backgroundColor: '#E0F7F5' }}
        >
          <svg className="w-7 h-7" fill="none" stroke="#00A79D" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: '#1B2D5B' }}>
          Results — Coming in Block 4
        </h1>

        <p className="text-sm mb-2" style={{ color: '#475569' }}>
          Your assessment has been saved.
        </p>

        <p className="text-xs font-mono mb-8 px-4 py-2 rounded-lg inline-block" style={{ backgroundColor: '#F0F4F8', color: '#64748b' }}>
          Assessment ID: {assessmentId}
        </p>

        <div>
          <button
            type="button"
            onClick={onBackToWelcome}
            className="px-6 py-3 rounded-lg text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: '#1B2D5B' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#14223f')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1B2D5B')}
          >
            Start New Assessment
          </button>
        </div>
      </div>
    </div>
  )
}
