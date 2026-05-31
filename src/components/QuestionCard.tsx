import { useState } from 'react'
import { type Question, SCORE_LABELS } from '../data/assessment'
import ScoreButton from './ScoreButton'

interface QuestionCardProps {
  question: Question
  sectionIndex: number
  questionIndex: number
  score: number | undefined
  notes: string
  onScoreChange: (score: number) => void
  onNotesChange: (notes: string) => void
  disabled?: boolean
}

const SCORE_VALUES = [1, 2, 3, 4] as const

export default function QuestionCard({
  question,
  sectionIndex,
  questionIndex,
  score,
  notes,
  onScoreChange,
  onNotesChange,
  disabled,
}: QuestionCardProps) {
  const [notesExpanded, setNotesExpanded] = useState(false)

  const questionNumber = `${sectionIndex + 1}.${questionIndex + 1}`
  const isQualitative = question.qualitative === true
  const showTextarea = isQualitative || notesExpanded || notes.length > 0

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6" style={{ borderColor: '#e2e8f0' }}>
      {/* Question number + text */}
      <div className="mb-4">
        <span className="text-xs font-semibold uppercase tracking-wide mr-2" style={{ color: '#00A79D' }}>
          {questionNumber}
        </span>
        <span className="text-base font-semibold" style={{ color: '#1B2D5B' }}>
          {question.text}
        </span>
      </div>

      {/* Guidance */}
      <p className="text-sm italic mb-5" style={{ color: '#64748b' }}>
        {question.guidance}
      </p>

      {/* Score buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {SCORE_VALUES.map((value) => (
          <ScoreButton
            key={value}
            value={value}
            label={SCORE_LABELS[value]}
            isSelected={score === value}
            onClick={() => onScoreChange(value)}
            disabled={disabled}
          />
        ))}
      </div>

      {/* Notes */}
      {isQualitative ? (
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: '#475569' }}>
            Your example (required for full score):
          </label>
          <textarea
            rows={3}
            disabled={disabled}
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Describe a specific role and what changed..."
            className="w-full px-3 py-2.5 rounded-lg border text-sm resize-none outline-none transition-colors"
            style={{ borderColor: '#CBD5E1', color: '#1e293b', opacity: disabled ? 0.6 : 1 }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#1B2D5B')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#CBD5E1')}
          />
        </div>
      ) : showTextarea ? (
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>
            Notes
          </label>
          <textarea
            rows={2}
            disabled={disabled}
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Add a note..."
            className="w-full px-3 py-2.5 rounded-lg border text-sm resize-none outline-none transition-colors"
            style={{ borderColor: '#CBD5E1', color: '#1e293b', opacity: disabled ? 0.6 : 1 }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#1B2D5B')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#CBD5E1')}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setNotesExpanded(true)}
          className="text-xs transition-colors"
          style={{ color: '#94a3b8' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#1B2D5B')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
        >
          + Add note
        </button>
      )}
    </div>
  )
}
