import { ipcMain } from 'electron'
import { basename } from 'path'
import { IpcChannels, type ProviderConfig, type RecentProject } from '@shared/ipc'
import { isProviderId } from '@shared/providers'
import { readJsonFile, writeJsonFile } from '../store'

const SETTINGS_FILE = 'settings.json'
const MAX_RECENTS = 8

interface Settings {
  provider?: ProviderConfig
  recents?: RecentProject[]
}

/**
 * Handlers de configuração (não-secreta) do provedor de IA. A API key NÃO
 * passa por aqui — ela é segredo e vive cifrada (ver secrets.ts).
 */
export function registerSettingsHandlers(): void {
  ipcMain.handle(IpcChannels.settingsGetProvider, async (): Promise<ProviderConfig | null> => {
    const settings = await readJsonFile<Settings>(SETTINGS_FILE)
    const provider = settings?.provider
    if (!provider || !isProviderId(provider.provider)) {
      return null
    }
    return provider
  })

  ipcMain.handle(IpcChannels.settingsSetProvider, async (_event, config: ProviderConfig) => {
    if (!isProviderId(config.provider)) {
      throw new Error(`provedor inválido: ${String(config.provider)}`)
    }
    const settings = (await readJsonFile<Settings>(SETTINGS_FILE)) ?? {}
    settings.provider = {
      provider: config.provider,
      model: config.model,
      baseUrl: config.baseUrl
    }
    await writeJsonFile(SETTINGS_FILE, settings)
  })

  ipcMain.handle(IpcChannels.settingsGetRecents, async (): Promise<RecentProject[]> => {
    const settings = await readJsonFile<Settings>(SETTINGS_FILE)
    return settings?.recents ?? []
  })

  ipcMain.handle(
    IpcChannels.settingsAddRecent,
    async (_event, dir: string): Promise<RecentProject[]> => {
      const settings = (await readJsonFile<Settings>(SETTINGS_FILE)) ?? {}
      const entry: RecentProject = {
        path: dir,
        name: basename(dir) || dir,
        openedAt: new Date().toISOString()
      }
      const rest = (settings.recents ?? []).filter((r) => r.path !== dir)
      settings.recents = [entry, ...rest].slice(0, MAX_RECENTS)
      await writeJsonFile(SETTINGS_FILE, settings)
      return settings.recents
    }
  )
}
