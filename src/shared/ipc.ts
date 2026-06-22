import { type ManifestValidationResult, type ProjectManifest } from '@core'
import { type ProviderId } from './providers'

/**
 * Contrato de IPC entre o renderer e o main. Centraliza nomes de canais e os
 * tipos de payload para manter as duas pontas em sincronia. Não importa
 * Electron — pode ser usado por qualquer camada.
 */

/** Nomes dos canais IPC (todos via `ipcRenderer.invoke`). */
export const IpcChannels = {
  projectOpenFolder: 'project:open-folder',
  projectReadManifest: 'project:read-manifest',
  projectSaveManifest: 'project:save-manifest',
  projectValidate: 'project:validate',
  projectWriteArtifact: 'project:write-artifact',
  settingsGetProvider: 'settings:get-provider',
  settingsSetProvider: 'settings:set-provider',
  secretsHasKey: 'secrets:has-key',
  secretsSetKey: 'secrets:set-key',
  secretsClearKey: 'secrets:clear-key',
  secretsTestConnection: 'secrets:test-connection'
} as const

/** Nome do arquivo de manifesto na raiz do projeto-alvo. */
export const MANIFEST_FILENAME = 'project-manifest.json'

/** Resultado de abrir o seletor de pasta. */
export interface OpenFolderResult {
  /** Caminho da pasta escolhida, ou `null` se o usuário cancelou. */
  path: string | null
}

/** Resultado de ler o manifesto de uma pasta de projeto. */
export interface ReadManifestResult {
  /** `true` se havia um arquivo de manifesto na pasta. */
  found: boolean
  /** Manifesto carregado e validado (presente quando `found` e `valid`). */
  manifest?: ProjectManifest
  /** Resultado da validação (presente quando `found`). */
  validation?: ManifestValidationResult
  /** Mensagem de erro de I/O ou parse, se houver. */
  error?: string
}

/** Resultado de salvar o manifesto. */
export interface SaveManifestResult {
  /** `true` se o manifesto foi validado e gravado. */
  saved: boolean
  /** Resultado da validação (manifesto inválido nunca é gravado). */
  validation: ManifestValidationResult
  /** Mensagem de erro de I/O, se houver. */
  error?: string
}

/** Resultado de gravar um artefato transpilado (ex.: CLAUDE.md). */
export interface WriteArtifactResult {
  /** `true` se o arquivo foi gravado. */
  saved: boolean
  /** Caminho completo do arquivo gravado. */
  path?: string
  /** Mensagem de erro de I/O, se houver. */
  error?: string
}

/** Configuração (não-secreta) do provedor de IA escolhido. */
export interface ProviderConfig {
  /** Provedor selecionado. */
  provider: ProviderId
  /** Modelo selecionado. */
  model?: string
  /** Base URL para provedores locais (Ollama / LM Studio). */
  baseUrl?: string
}

/** Resultado de um teste de conexão com o provedor. */
export interface TestConnectionResult {
  /** `true` se a chamada mínima ao provedor teve sucesso. */
  ok: boolean
  /** Mensagem de status (sucesso ou motivo da falha). */
  message: string
}

/**
 * API segura exposta no `window.kickoff` pelo preload via contextBridge.
 * O renderer nunca toca `fs` nem vê a API key crua.
 */
export interface KickoffApi {
  project: {
    openFolder: () => Promise<OpenFolderResult>
    readManifest: (dir: string) => Promise<ReadManifestResult>
    saveManifest: (dir: string, manifest: ProjectManifest) => Promise<SaveManifestResult>
    validate: (manifest: unknown) => Promise<ManifestValidationResult>
    writeArtifact: (dir: string, filename: string, content: string) => Promise<WriteArtifactResult>
  }
  settings: {
    getProvider: () => Promise<ProviderConfig | null>
    setProvider: (config: ProviderConfig) => Promise<void>
  }
  secrets: {
    hasKey: (provider: ProviderId) => Promise<boolean>
    setKey: (provider: ProviderId, key: string) => Promise<void>
    clearKey: (provider: ProviderId) => Promise<void>
    testConnection: (config: ProviderConfig) => Promise<TestConnectionResult>
  }
}
