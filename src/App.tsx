import { useState } from 'react'
import { type OrgProfile } from './data/assessment'
import WelcomeScreen from './components/WelcomeScreen'
import PlaceholderAssessment from './components/PlaceholderAssessment'

type Screen = 'welcome' | 'assessment' | 'results' | 'actionPlan'

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome')
  const [orgProfile, setOrgProfile] = useState<OrgProfile | null>(null)

  function handleBegin(profile: OrgProfile) {
    setOrgProfile(profile)
    setCurrentScreen('assessment')
  }

  function handleBack() {
    setCurrentScreen('welcome')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8" style={{ backgroundColor: '#F0F4F8' }}>
      {currentScreen === 'welcome' && (
        <WelcomeScreen onBegin={handleBegin} />
      )}

      {currentScreen === 'assessment' && orgProfile && (
        <PlaceholderAssessment orgProfile={orgProfile} onBack={handleBack} />
      )}

      {(currentScreen === 'results' || currentScreen === 'actionPlan') && null}
    </div>
  )
}

export default App
