/*
 * Módulo de store do app: por desenho expõe o provider (componente) junto com
 * o hook useApp e os tipos de estado. O Fast Refresh prefere arquivos só de
 * componentes, mas aqui a coesão do store vale mais que o HMR granular.
 */
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from 'react'
// Importa só subpaths sem Ajv: o renderer roda sob CSP (script-src 'self', sem
// unsafe-eval), e o Ajv gera código em runtime. A validação autoritativa vive
// no main e chega ao renderer por IPC.
import { MANIFEST_VERSION, type ProjectManifest, type ProjectMeta } from '@core/schema'
import { type ManifestValidationResult } from '@core/validation'
import { PROVIDERS, type ProviderId } from '@shared/providers'
import { type ProviderConfig, type RecentProject, type TestConnectionResult } from '@shared/ipc'

/** Telas principais do app. */
export type Screen = 'home' | 'workspace' | 'onboarding'
/** Estado do selo do manifesto exibido na barra de título. */
export type Seal = 'valid' | 'invalid' | 'saved'
/** Estado do auto-save. */
export type SaveState = 'idle' | 'saving' | 'saved' | 'error'
/** Aba do painel direito. */
export type PreviewTab = 'manifesto' | 'export'
/** Alvo de exportação selecionado. */
export type ExportTarget = 'claude' | 'agents' | 'cursor' | 'prompt'
/** Estado do teste de conexão com o provedor. */
export type TestState = 'idle' | 'testing' | 'ok' | 'failed'

interface AppContextValue {
  // navegação / UI
  screen: Screen
  settingsOpen: boolean
  selectedStep: number
  tab: PreviewTab
  target: ExportTarget
  rightOpen: boolean
  showKey: boolean
  setScreen: (screen: Screen) => void
  openSettings: () => void
  closeSettings: () => void
  setSelectedStep: (index: number) => void
  setTab: (tab: PreviewTab) => void
  setTarget: (target: ExportTarget) => void
  setRightOpen: (open: boolean) => void
  toggleShowKey: () => void

  // projeto / manifesto
  projectDir: string | null
  manifest: ProjectManifest | null
  validation: ManifestValidationResult | null
  saveState: SaveState
  seal: Seal
  recents: RecentProject[]
  openFolder: () => Promise<void>
  openRecent: (path: string) => Promise<void>
  updateMeta: (patch: Partial<ProjectMeta>) => void
  editManifest: (fn: (current: ProjectManifest) => ProjectManifest) => void

  // provedor de IA
  providerConfig: ProviderConfig | null
  hasKey: boolean
  aiConfigured: boolean
  test: TestState
  testMessage: string
  setProvider: (provider: ProviderId, model?: string) => Promise<void>
  saveApiKey: (key: string) => Promise<void>
  clearApiKey: () => Promise<void>
  runTest: () => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

/** Extrai o nome base de um caminho de pasta (sem depender de `path`). */
function basename(dir: string): string {
  const parts = dir.split(/[\\/]/).filter(Boolean)
  return parts[parts.length - 1] ?? 'projeto'
}

function emptyManifest(name: string): ProjectManifest {
  return { manifestVersion: MANIFEST_VERSION, meta: { name } }
}

export function AppProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('home')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [selectedStep, setSelectedStep] = useState(0)
  const [tab, setTab] = useState<PreviewTab>('manifesto')
  const [target, setTarget] = useState<ExportTarget>('claude')
  const [rightOpen, setRightOpen] = useState(true)
  const [showKey, setShowKey] = useState(false)

  const [projectDir, setProjectDir] = useState<string | null>(null)
  const [manifest, setManifest] = useState<ProjectManifest | null>(null)
  const [validation, setValidation] = useState<ManifestValidationResult | null>(null)
  const [saveState, setSaveState] = useState<SaveState>('idle')

  const [providerConfig, setProviderConfig] = useState<ProviderConfig | null>(null)
  const [hasKey, setHasKey] = useState(false)
  const [test, setTest] = useState<TestState>('idle')
  const [testMessage, setTestMessage] = useState('')
  const [recents, setRecents] = useState<RecentProject[]>([])

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Carrega configuração de provedor, presença de chave e recentes ao iniciar.
  const refreshProvider = useCallback(async (): Promise<void> => {
    const config = await window.kickoff.settings.getProvider()
    setProviderConfig(config)
    setHasKey(config ? await window.kickoff.secrets.hasKey(config.provider) : false)
    setRecents(await window.kickoff.settings.getRecents())
  }, [])

  useEffect(() => {
    // Carga inicial assíncrona: o setState acontece só quando o IPC resolve,
    // não de forma síncrona no corpo do efeito.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshProvider()
  }, [refreshProvider])

  const persist = useCallback(async (dir: string, next: ProjectManifest): Promise<void> => {
    setSaveState('saving')
    const result = await window.kickoff.project.saveManifest(dir, next)
    setValidation(result.validation)
    setSaveState(result.saved ? 'saved' : 'error')
  }, [])

  // Carrega um projeto de um caminho conhecido (sem diálogo).
  const loadProject = useCallback(async (path: string): Promise<void> => {
    const read = await window.kickoff.project.readManifest(path)
    const loaded = read.found && read.manifest ? read.manifest : emptyManifest(basename(path))
    setProjectDir(path)
    setManifest(loaded)
    setValidation(read.validation ?? (await window.kickoff.project.validate(loaded)))
    setSaveState(read.found ? 'saved' : 'idle')
    setSelectedStep(0)
    setScreen('workspace')
    setRecents(await window.kickoff.settings.addRecent(path))
  }, [])

  const openFolder = useCallback(async (): Promise<void> => {
    const { path } = await window.kickoff.project.openFolder()
    if (path) await loadProject(path)
  }, [loadProject])

  const openRecent = useCallback(
    async (path: string): Promise<void> => {
      await loadProject(path)
    },
    [loadProject]
  )

  // Aplica uma edição ao manifesto: valida ao vivo (no main) e auto-salva
  // (debounced) no disco. É o caminho único de mutação do manifesto.
  const editManifest = useCallback(
    (fn: (current: ProjectManifest) => ProjectManifest): void => {
      setManifest((current) => {
        if (!current) return current
        const next = fn(current)
        void window.kickoff.project.validate(next).then(setValidation)
        if (projectDir) {
          if (saveTimer.current) clearTimeout(saveTimer.current)
          setSaveState('saving')
          saveTimer.current = setTimeout(() => {
            void persist(projectDir, next)
          }, 600)
        }
        return next
      })
    },
    [projectDir, persist]
  )

  const updateMeta = useCallback(
    (patch: Partial<ProjectMeta>): void => {
      editManifest((current) => ({ ...current, meta: { ...current.meta, ...patch } }))
    },
    [editManifest]
  )

  const setProvider = useCallback(async (provider: ProviderId, model?: string): Promise<void> => {
    const config: ProviderConfig = { provider, model: model ?? PROVIDERS[provider].models[0] }
    await window.kickoff.settings.setProvider(config)
    setProviderConfig(config)
    setHasKey(await window.kickoff.secrets.hasKey(provider))
    setTest('idle')
    setTestMessage('')
  }, [])

  const saveApiKey = useCallback(
    async (key: string): Promise<void> => {
      if (!providerConfig) return
      await window.kickoff.secrets.setKey(providerConfig.provider, key)
      setHasKey(true)
    },
    [providerConfig]
  )

  const clearApiKey = useCallback(async (): Promise<void> => {
    if (!providerConfig) return
    await window.kickoff.secrets.clearKey(providerConfig.provider)
    setHasKey(false)
    setTest('idle')
    setTestMessage('')
  }, [providerConfig])

  const runTest = useCallback(async (): Promise<void> => {
    if (!providerConfig) return
    setTest('testing')
    setTestMessage('Verificando…')
    let result: TestConnectionResult
    try {
      result = await window.kickoff.secrets.testConnection(providerConfig)
    } catch (error) {
      result = { ok: false, message: (error as Error).message }
    }
    setTest(result.ok ? 'ok' : 'failed')
    setTestMessage(result.message)
  }, [providerConfig])

  const aiConfigured =
    providerConfig != null && (!PROVIDERS[providerConfig.provider].requiresApiKey || hasKey)

  const seal: Seal = validation ? (validation.valid ? 'valid' : 'invalid') : 'saved'

  const value = useMemo<AppContextValue>(
    () => ({
      screen,
      settingsOpen,
      selectedStep,
      tab,
      target,
      rightOpen,
      showKey,
      setScreen,
      openSettings: () => setSettingsOpen(true),
      closeSettings: () => {
        setSettingsOpen(false)
        setTest('idle')
        setTestMessage('')
      },
      setSelectedStep,
      setTab,
      setTarget,
      setRightOpen,
      toggleShowKey: () => setShowKey((v) => !v),
      projectDir,
      manifest,
      validation,
      saveState,
      seal,
      recents,
      openFolder,
      openRecent,
      updateMeta,
      editManifest,
      providerConfig,
      hasKey,
      aiConfigured,
      test,
      testMessage,
      setProvider,
      saveApiKey,
      clearApiKey,
      runTest
    }),
    [
      screen,
      settingsOpen,
      selectedStep,
      tab,
      target,
      rightOpen,
      showKey,
      projectDir,
      manifest,
      validation,
      saveState,
      seal,
      recents,
      openFolder,
      openRecent,
      updateMeta,
      editManifest,
      providerConfig,
      hasKey,
      aiConfigured,
      test,
      testMessage,
      setProvider,
      saveApiKey,
      clearApiKey,
      runTest
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

/** Acessa o store do app. Deve ser usado dentro de AppProvider. */
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useApp deve ser usado dentro de <AppProvider>')
  }
  return ctx
}
