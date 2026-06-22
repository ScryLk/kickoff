import type { ElectronAPI } from '@electron-toolkit/preload'
import type { KickoffApi } from '@shared/ipc'

declare global {
  interface Window {
    electron: ElectronAPI
    kickoff: KickoffApi
  }
}
