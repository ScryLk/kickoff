import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { ProjectManifest } from '@core'
import { IpcChannels, type KickoffApi, type ProviderConfig } from '@shared/ipc'
import type { ProviderId } from '@shared/providers'

/**
 * API segura exposta ao renderer. O renderer nunca toca `fs` nem vê a API key
 * crua: tudo passa por estes canais IPC tipados.
 */
const kickoff: KickoffApi = {
  project: {
    openFolder: () => ipcRenderer.invoke(IpcChannels.projectOpenFolder),
    readManifest: (dir: string) => ipcRenderer.invoke(IpcChannels.projectReadManifest, dir),
    saveManifest: (dir: string, manifest: ProjectManifest) =>
      ipcRenderer.invoke(IpcChannels.projectSaveManifest, dir, manifest),
    validate: (manifest: unknown) => ipcRenderer.invoke(IpcChannels.projectValidate, manifest),
    writeArtifact: (dir: string, filename: string, content: string) =>
      ipcRenderer.invoke(IpcChannels.projectWriteArtifact, dir, filename, content)
  },
  settings: {
    getProvider: () => ipcRenderer.invoke(IpcChannels.settingsGetProvider),
    setProvider: (config: ProviderConfig) =>
      ipcRenderer.invoke(IpcChannels.settingsSetProvider, config)
  },
  secrets: {
    hasKey: (provider: ProviderId) => ipcRenderer.invoke(IpcChannels.secretsHasKey, provider),
    setKey: (provider: ProviderId, key: string) =>
      ipcRenderer.invoke(IpcChannels.secretsSetKey, provider, key),
    clearKey: (provider: ProviderId) => ipcRenderer.invoke(IpcChannels.secretsClearKey, provider),
    testConnection: (config: ProviderConfig) =>
      ipcRenderer.invoke(IpcChannels.secretsTestConnection, config)
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('kickoff', kickoff)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (definido no index.d.ts)
  window.electron = electronAPI
  // @ts-ignore (definido no index.d.ts)
  window.kickoff = kickoff
}
