import { useState } from 'react'
import { type OrgProfile } from './data/assessment'
import WelcomeScreen from './components/WelcomeScreen'
import AssessmentFlow from './components/AssessmentFlow'
import ResultsDashboard from './components/ResultsDashboard'

type Screen = 'welcome' | 'assessment' | 'results' | 'actionPlan'

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome')
  const [orgProfile, setOrgProfile] = useState<OrgProfile | null>(null)
  const [assessmentId, setAssessmentId] = useState<string | null>(null)
  const [responses, setResponses] = useState<Record<string, number> | null>(null)
  const [notes, setNotes] = useState<Record<string, string> | null>(null)

  function handleBegin(profile: OrgProfile) {
    setOrgProfile(profile)
    setCurrentScreen('assessment')
  }

  function handleAssessmentComplete(data: {
    assessmentId: string
    responses: Record<string, number>
    notes: Record<string, string>
  }) {
    setAssessmentId(data.assessmentId)
    setResponses(data.responses)
    setNotes(data.notes)
    setCurrentScreen('results')
  }

  function handleBackToWelcome() {
    setOrgProfile(null)
    setAssessmentId(null)
    setResponses(null)
    setNotes(null)
    setCurrentScreen('welcome')
  }

  function handleGenerateActionPlan() {
    setCurrentScreen('actionPlan')
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0F4F8' }}>
      {currentScreen === 'welcome' && (
        <div className="flex flex-col items-center justify-start py-8">
          <WelcomeScreen onBegin={handleBegin} />
        </div>
      )}

      {currentScreen === 'assessment' && orgProfile && (
        <AssessmentFlow
          orgProfile={orgProfile}
          onComplete={handleAssessmentComplete}
          onBack={handleBackToWelcome}
        />
      )}

      {currentScreen === 'results' && orgProfile && assessmentId && responses && notes && (
        <ResultsDashboard
          orgProfile={orgProfile}
          responses={responses}
          notes={notes}
          assessmentId={assessmentId}
          onGenerateActionPlan={handleGenerateActionPlan}
          onBackToWelcome={handleBackToWelcome}
        />
      )}

      {currentScreen === 'actionPlan' && (
        <div className="flex flex-col items-center justify-start py-16 px-4">
          <div className="bg-white rounded-2xl shadow-sm p-10 max-w-lg w-full text-center">
            <h2 className="text-xl font-bold mb-3" style={{ color: '#1B2D5B' }}>
              Action Plan Generation
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Personalised 90-day Responsible AI Adoption plan coming in Block 5.
            </p>
            <button
              type="button"
              onClick={handleBackToWelcome}
              className="text-sm font-medium transition-colors"
              style={{ color: '#1B2D5B' }}
            >
              ← Start New Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
