import { type Section } from '../data/assessment'
import QuestionCard from './QuestionCard'

interface SectionViewProps {
  section: Section
  sectionIndex: number
  responses: Record<string, number>
  notes: Record<string, string>
  onScoreChange: (questionId: string, score: number) => void
  onNotesChange: (questionId: string, notes: string) => void
  disabled?: boolean
}

export default function SectionView({
  section,
  sectionIndex,
  responses,
  notes,
  onScoreChange,
  onNotesChange,
  disabled,
}: SectionViewProps) {
  return (
    <div>
      {/* Section header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white shrink-0"
            style={{ backgroundColor: '#1B2D5B' }}
          >
            {sectionIndex + 1}
          </span>
          <h2 className="text-xl font-bold" style={{ color: '#1B2D5B' }}>
            {section.title}
          </h2>
        </div>
        <p className="text-sm italic ml-9" style={{ color: '#64748b' }}>
          {section.description}
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {section.questions.map((question, questionIndex) => (
          <QuestionCard
            key={question.id}
            question={question}
            sectionIndex={sectionIndex}
            questionIndex={questionIndex}
            score={responses[question.id]}
            notes={notes[question.id] ?? ''}
            onScoreChange={(score) => onScoreChange(question.id, score)}
            onNotesChange={(note) => onNotesChange(question.id, note)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  )
}
