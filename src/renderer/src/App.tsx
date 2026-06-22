import { colors } from './theme'
import { UiStateProvider, useUi } from './state/ui'
import { TitleBar } from './components/TitleBar'
import { SettingsModal } from './components/SettingsModal'
import { HomeScreen } from './screens/HomeScreen'
import { WorkspaceScreen } from './screens/WorkspaceScreen'
import { OnboardingScreen } from './screens/OnboardingScreen'

function Shell(): React.JSX.Element {
  const { screen, settingsOpen } = useUi()

  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: colors.ink,
        overflow: 'hidden'
      }}
    >
      <TitleBar />
      {screen === 'home' && <HomeScreen />}
      {screen === 'workspace' && <WorkspaceScreen />}
      {screen === 'onboarding' && <OnboardingScreen />}
      {settingsOpen && <SettingsModal />}
    </div>
  )
}

function App(): React.JSX.Element {
  return (
    <UiStateProvider>
      <Shell />
    </UiStateProvider>
  )
}

export default App
