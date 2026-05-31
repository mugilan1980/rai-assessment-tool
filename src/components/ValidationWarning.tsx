interface ValidationWarningProps {
  unansweredCount: number
  onContinue: () => void
  onCancel: () => void
}

export default function ValidationWarning({ unansweredCount, onContinue, onCancel }: ValidationWarningProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-3" style={{ color: '#1B2D5B' }}>
          Some questions are unanswered
        </h2>
        <p className="text-sm mb-6" style={{ color: '#475569' }}>
          {unansweredCount} of 7 questions in this section haven't been scored. You can continue
          anyway, but unanswered questions will be excluded from your final scoring.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium border transition-colors"
            style={{ borderColor: '#CBD5E1', color: '#475569', backgroundColor: '#F8FAFC' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: '#1B2D5B' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#14223f')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1B2D5B')}
          >
            Continue Anyway
          </button>
        </div>
      </div>
    </div>
  )
}
