import { useState } from 'react'
import { type OrgProfile } from './data/assessment'
import WelcomeScreen from './components/WelcomeScreen'
import AssessmentFlow from './components/AssessmentFlow'
import PlaceholderResults from './components/PlaceholderResults'

type Screen = 'welcome' | 'assessment' | 'placeholderResults' | 'results' | 'actionPlan'

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome')
  const [orgProfile, setOrgProfile] = useState<OrgProfile | null>(null)
  const [assessmentId, setAssessmentId] = useState<string | null>(null)

  function handleBegin(profile: OrgProfile) {
    setOrgProfile(profile)
    setCurrentScreen('assessment')
  }

  function handleAssessmentComplete(id: string) {
    setAssessmentId(id)
    setCurrentScreen('placeholderResults')
  }

  function handleBackToWelcome() {
    setOrgProfile(null)
    setAssessmentId(null)
    setCurrentScreen('welcome')
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

      {currentScreen === 'placeholderResults' && assessmentId && (
        <div className="flex flex-col items-center justify-start py-8">
          <PlaceholderResults
            assessmentId={assessmentId}
            onBackToWelcome={handleBackToWelcome}
          />
        </div>
      )}

      {(currentScreen === 'results' || currentScreen === 'actionPlan') && null}
    </div>
  )
}

export default App
