/*
 * Módulo de contexto: por desenho expõe o provider (componente) junto com o
 * hook useUi e os tipos de estado. O Fast Refresh prefere arquivos só de
 * componentes, mas aqui a coesão do contexto vale mais que o HMR granular.
 */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

/** Telas principais do app. */
export type Screen = 'home' | 'workspace' | 'onboarding'
/** Estado do selo do manifesto exibido na barra de título. */
export type Seal = 'valid' | 'invalid' | 'saved'
/** Estado do auto-save. */
export type SaveState = 'saving' | 'saved'
/** Aba do painel direito. */
export type PreviewTab = 'manifesto' | 'export'
/** Alvo de exportação selecionado. */
export type ExportTarget = 'claude' | 'agents' | 'cursor' | 'prompt'
/** Estado do teste de conexão com o provedor. */
export type TestState = 'idle' | 'testing' | 'ok' | 'failed'

/**
 * Estado de UI do app. Por enquanto é local (mock navegável da casca importada
 * do Design). Na Fase 4 os dados de projeto e provedor passam a vir do disco e
 * do keychain via IPC, mas a forma do estado de navegação permanece.
 */
interface UiState {
  screen: Screen
  settingsOpen: boolean
  seal: Seal
  save: SaveState
  /** `true` quando há provedor de IA + chave configurados. */
  aiConfigured: boolean
  selectedStep: number
  tab: PreviewTab
  target: ExportTarget
  rightOpen: boolean
  showKey: boolean
  test: TestState
}

interface UiActions {
  setScreen: (screen: Screen) => void
  openSettings: () => void
  closeSettings: () => void
  setSeal: (seal: Seal) => void
  setSelectedStep: (index: number) => void
  setTab: (tab: PreviewTab) => void
  setTarget: (target: ExportTarget) => void
  setRightOpen: (open: boolean) => void
  toggleShowKey: () => void
  setTest: (test: TestState) => void
}

type UiContextValue = UiState & UiActions

const UiContext = createContext<UiContextValue | null>(null)

export function UiStateProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('home')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [seal, setSeal] = useState<Seal>('saved')
  const [save] = useState<SaveState>('saved')
  const [aiConfigured] = useState(false)
  const [selectedStep, setSelectedStep] = useState(0)
  const [tab, setTab] = useState<PreviewTab>('manifesto')
  const [target, setTarget] = useState<ExportTarget>('claude')
  const [rightOpen, setRightOpen] = useState(true)
  const [showKey, setShowKey] = useState(false)
  const [test, setTest] = useState<TestState>('idle')

  const value = useMemo<UiContextValue>(
    () => ({
      screen,
      settingsOpen,
      seal,
      save,
      aiConfigured,
      selectedStep,
      tab,
      target,
      rightOpen,
      showKey,
      test,
      setScreen,
      openSettings: () => setSettingsOpen(true),
      closeSettings: () => {
        setSettingsOpen(false)
        setTest('idle')
      },
      setSeal,
      setSelectedStep,
      setTab,
      setTarget,
      setRightOpen,
      toggleShowKey: () => setShowKey((v) => !v),
      setTest
    }),
    [
      screen,
      settingsOpen,
      seal,
      save,
      aiConfigured,
      selectedStep,
      tab,
      target,
      rightOpen,
      showKey,
      test
    ]
  )

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>
}

/** Acessa o estado de UI. Deve ser usado dentro de UiStateProvider. */
export function useUi(): UiContextValue {
  const ctx = useContext(UiContext)
  if (!ctx) {
    throw new Error('useUi deve ser usado dentro de <UiStateProvider>')
  }
  return ctx
}
