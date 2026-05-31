import { useState } from 'react'
import { SECTIONS, type OrgProfile } from '../data/assessment'
import {
  getGovernanceScore,
  getWorkforceScore,
  getOverallScore,
  getAdoptionProfile,
  getMaturityLevel,
  getWorkforceMaturityBand,
} from '../lib/scoring'
import { supabase } from '../lib/supabase'
import Header from './Header'
import ProgressBar from './ProgressBar'
import SectionView from './SectionView'
import ValidationWarning from './ValidationWarning'

interface AssessmentFlowProps {
  orgProfile: OrgProfile
  onComplete: (assessmentId: string) => void
  onBack: () => void
}

export default function AssessmentFlow({ orgProfile, onComplete, onBack }: AssessmentFlowProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, number>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [showValidationWarning, setShowValidationWarning] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const currentSection = SECTIONS[currentSectionIndex]
  const isLastSection = currentSectionIndex === SECTIONS.length - 1
  const unansweredCount = currentSection.questions.filter(
    (q) => responses[q.id] === undefined
  ).length

  function handleScoreChange(questionId: string, score: number) {
    setResponses((prev) => ({ ...prev, [questionId]: score }))
  }

  function handleNotesChange(questionId: string, note: string) {
    setNotes((prev) => ({ ...prev, [questionId]: note }))
  }

  function handlePrevious() {
    setCurrentSectionIndex((prev) => prev - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function advanceSection() {
    setCurrentSectionIndex((prev) => prev + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleNext() {
    if (unansweredCount > 0) {
      setShowValidationWarning(true)
      return
    }
    if (isLastSection) {
      void handleSubmit()
    } else {
      advanceSection()
    }
  }

  function handleContinueFromWarning() {
    setShowValidationWarning(false)
    if (isLastSection) {
      void handleSubmit()
    } else {
      advanceSection()
    }
  }

  async function handleSubmit() {
    if (!supabase) {
      setSaveError('Database connection not available. Check environment configuration.')
      return
    }

    setIsSaving(true)
    setSaveError(null)

    try {
      const governanceScore = getGovernanceScore(responses, SECTIONS)
      const workforceScore = getWorkforceScore(responses, SECTIONS)
      const overallScore = getOverallScore(responses, SECTIONS)
      const adoptionProfile = getAdoptionProfile(governanceScore, workforceScore)
      const maturity = getMaturityLevel(overallScore)

      const { data: assessment, error: assessmentError } = await supabase
        .from('assessments')
        .insert({
          org_name: orgProfile.orgName,
          industry: orgProfile.industry,
          company_size: orgProfile.companySize,
          governance_score: governanceScore,
          workforce_score: workforceScore,
          overall_score: overallScore,
          adoption_profile: adoptionProfile,
          maturity_level: maturity.level,
          maturity_label: maturity.label,
          workforce_maturity_band: getWorkforceMaturityBand(workforceScore),
        })
        .select()
        .single()

      if (assessmentError || !assessment) {
        throw assessmentError ?? new Error('Failed to create assessment record')
      }

      const responsesToInsert = SECTIONS.flatMap((section, sectionIdx) =>
        section.questions
          .filter((q) => typeof responses[q.id] === 'number')
          .map((q) => ({
            assessment_id: assessment.id as string,
            section_id: sectionIdx,
            question_id: q.id,
            score: responses[q.id],
            notes: notes[q.id] ?? null,
          }))
      )

      if (responsesToInsert.length > 0) {
        const { error: responsesError } = await supabase
          .from('assessment_responses')
          .insert(responsesToInsert)

        if (responsesError) {
          throw responsesError
        }
      }

      onComplete(assessment.id as string)
    } catch (err) {
      console.error('Save failed:', err)
      setSaveError('Failed to save assessment. Please try again.')
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#F0F4F8' }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Header showFull={false} />

        {/* Breadcrumb */}
        <p className="text-sm mb-5" style={{ color: '#64748b' }}>
          {orgProfile.orgName} &middot; {orgProfile.industry}
        </p>

        <ProgressBar currentSection={currentSectionIndex + 1} totalSections={SECTIONS.length} />

        <div className="mt-8">
          <SectionView
            section={currentSection}
            sectionIndex={currentSectionIndex}
            responses={responses}
            notes={notes}
            onScoreChange={handleScoreChange}
            onNotesChange={handleNotesChange}
            disabled={isSaving}
          />
        </div>

        {/* Save error */}
        {saveError && (
          <div
            className="mt-6 px-4 py-3 rounded-lg text-sm"
            style={{ backgroundColor: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' }}
          >
            {saveError}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 mb-12">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentSectionIndex === 0 || isSaving}
            className="px-5 py-2.5 rounded-lg text-sm font-medium border transition-colors"
            style={{
              borderColor: currentSectionIndex === 0 ? '#e2e8f0' : '#1B2D5B',
              color: currentSectionIndex === 0 ? '#94a3b8' : '#1B2D5B',
              backgroundColor: '#ffffff',
              cursor: currentSectionIndex === 0 || isSaving ? 'not-allowed' : 'pointer',
              opacity: currentSectionIndex === 0 ? 0.5 : 1,
            }}
          >
            ← Previous Section
          </button>

          <button
            type="button"
            onClick={onBack}
            disabled={isSaving}
            className="text-sm transition-colors"
            style={{ color: '#94a3b8' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#475569')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
          >
            Save &amp; Exit
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
            style={{
              backgroundColor: isSaving ? '#94a3b8' : '#1B2D5B',
              cursor: isSaving ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!isSaving) e.currentTarget.style.backgroundColor = '#14223f'
            }}
            onMouseLeave={(e) => {
              if (!isSaving) e.currentTarget.style.backgroundColor = '#1B2D5B'
            }}
          >
            {isSaving && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 22 11.373 22 22h-4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {isSaving ? 'Saving…' : isLastSection ? 'View Results' : 'Next Section →'}
          </button>
        </div>
      </div>

      {showValidationWarning && (
        <ValidationWarning
          unansweredCount={unansweredCount}
          onContinue={handleContinueFromWarning}
          onCancel={() => setShowValidationWarning(false)}
        />
      )}
    </div>
  )
}
