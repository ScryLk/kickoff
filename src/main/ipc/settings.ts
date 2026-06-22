import { ipcMain } from 'electron'
import { IpcChannels, type ProviderConfig } from '@shared/ipc'
import { isProviderId } from '@shared/providers'
import { readJsonFile, writeJsonFile } from '../store'

const SETTINGS_FILE = 'settings.json'

interface Settings {
  provider?: ProviderConfig
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
}
