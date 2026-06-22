import { registerProjectHandlers } from './project'
import { registerSettingsHandlers } from './settings'
import { registerSecretsHandlers } from './secrets'
import { registerAiHandlers } from './ai'

/** Registra todos os handlers IPC do main. Chamado uma vez no app ready. */
export function registerIpcHandlers(): void {
  registerProjectHandlers()
  registerSettingsHandlers()
  registerSecretsHandlers()
  registerAiHandlers()
}
