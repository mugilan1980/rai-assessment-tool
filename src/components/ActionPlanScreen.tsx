import { useEffect, useMemo, useState } from 'react'
import { SECTIONS, type OrgProfile } from '../data/assessment'
import {
  getSectionScore,
  getGovernanceScore,
  getWorkforceScore,
  getOverallScore,
  getMaturityLevel,
  getWorkforceMaturityBand,
  getAdoptionProfile,
} from '../lib/scoring'
import { mapToEdgeContract, streamActionPlan } from '../lib/actionPlan'
import { supabase } from '../lib/supabase'
import Header from './Header'
import MarkdownText from './MarkdownText'

interface ActionPlanScreenProps {
  orgProfile: OrgProfile
  responses: Record<string, number>
  notes: Record<string, string>
  assessmentId: string
  onBackToResults: () => void
  onStartNew: () => void
}

const NAVY = '#1B2D5B'
const TEAL = '#00A79D'

export default function ActionPlanScreen({
  orgProfile,
  responses,
  notes,
  assessmentId,
  onBackToResults,
  onStartNew,
}: ActionPlanScreenProps) {
  const [actionPlan, setActionPlan] = useState('')
  const [isGenerating, setIsGenerating] = useState(true)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)

  // Build the edge function payload from the assessment data.
  const payload = useMemo(() => {
    const sectionScores = SECTIONS.map((_, i) => getSectionScore(responses, i, SECTIONS))
    const governanceScore = getGovernanceScore(responses, SECTIONS)
    const workforceScore = getWorkforceScore(responses, SECTIONS)
    const overallScore = getOverallScore(responses, SECTIONS)
    return mapToEdgeContract({
      orgProfile,
      governanceScore,
      workforceScore,
      overallScore,
      sectionScores,
      maturityLevel: getMaturityLevel(overallScore),
      workforceMaturityBand: getWorkforceMaturityBand(workforceScore),
      adoptionProfile: getAdoptionProfile(governanceScore, workforceScore),
      responses,
      notes,
    })
  }, [orgProfile, responses, notes])

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    // Coalesce chunk appends into at most one state update per animation frame
    // so a fast stream doesn't thrash React with ~200 re-renders.
    let buffer = ''
    let rafId: number | null = null
    const flush = () => {
      rafId = null
      if (!cancelled) setActionPlan(buffer)
    }

    // Reset for a fresh run (covers retries).
    setActionPlan('')
    setIsGenerating(true)
    setIsComplete(false)
    setError(null)

    async function run() {
      try {
        for await (const chunk of streamActionPlan(payload, controller.signal)) {
          if (cancelled) return
          buffer += chunk
          if (rafId === null) rafId = requestAnimationFrame(flush)
        }
        if (cancelled) return

        // Ensure the final chunk is rendered (no pending frame left behind).
        if (rafId !== null) {
          cancelAnimationFrame(rafId)
          rafId = null
        }
        setActionPlan(buffer)
        setIsGenerating(false)
        setIsComplete(true)

        // Persist the generated plan. Non-blocking: the user already has it,
        // so a save failure is logged, not surfaced as a blocking error.
        if (supabase && buffer.trim()) {
          const { error: saveError } = await supabase
            .from('assessments')
            .update({ action_plan: buffer })
            .eq('id', assessmentId)
          if (saveError) {
            console.warn('Failed to save action plan to Supabase:', saveError.message)
          }
        }
      } catch (err) {
        if (cancelled || controller.signal.aborted) return
        console.error('Action plan generation failed:', err)
        setError(err instanceof Error ? err.message : 'Something went wrong.')
        setIsGenerating(false)
      }
    }

    void run()

    return () => {
      cancelled = true
      controller.abort()
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [payload, assessmentId, retryKey])

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#F0F4F8' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Header showFull={false} />

        {/* Breadcrumb */}
        <p className="text-sm mb-6" style={{ color: '#64748b' }}>
          {orgProfile.orgName} &middot; {orgProfile.industry}
        </p>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-1" style={{ color: NAVY }}>
          Your 90-Day Action Plan
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Personalised recommendations based on your assessment
        </p>

        {/* Document card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-10">
          {/* Error state */}
          {error ? (
            <div
              className="rounded-xl px-5 py-4"
              style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
            >
              <p className="text-sm font-medium mb-3" style={{ color: '#dc2626' }}>
                Failed to generate. Try again?
              </p>
              <p className="text-xs text-gray-500 mb-4">{error}</p>
              <button
                type="button"
                onClick={() => setRetryKey((k) => k + 1)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: NAVY }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#14223f')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = NAVY)}
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Streamed markdown document */}
              <div className="action-plan-document">
                <MarkdownText content={actionPlan} />
              </div>

              {/* Subtle generating indicator */}
              {isGenerating && (
                <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
                  <span
                    className="inline-block h-2 w-2 rounded-full animate-pulse"
                    style={{ backgroundColor: TEAL }}
                  />
                  {actionPlan ? 'Generating…' : 'Preparing your plan…'}
                </div>
              )}

              {/* Completion confirmation */}
              {isComplete && (
                <div
                  className="flex items-center gap-2 mt-6 pt-6 border-t border-gray-100 text-sm font-medium"
                  style={{ color: TEAL }}
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 011.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Plan generated
                </div>
              )}
            </>
          )}
        </div>

        {/* Action buttons — only once the plan is complete */}
        {isComplete && !error && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-8 mb-12 print:hidden">
            <button
              type="button"
              onClick={onBackToResults}
              className="px-5 py-2.5 rounded-xl text-sm font-medium border transition-colors bg-white"
              style={{ borderColor: NAVY, color: NAVY }}
            >
              ← Back to Results
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl text-sm font-medium border transition-colors bg-white"
              style={{ borderColor: NAVY, color: NAVY }}
            >
              Print / Save as PDF
            </button>
            <div className="sm:ml-auto">
              <button
                type="button"
                onClick={onStartNew}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: NAVY }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#14223f')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = NAVY)}
              >
                Start New Assessment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
