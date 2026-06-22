import { BrowserWindow, dialog, ipcMain } from 'electron'
import { join, dirname } from 'path'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { validateManifest, type ProjectManifest } from '@core'
import {
  IpcChannels,
  MANIFEST_FILENAME,
  type OpenFolderResult,
  type ReadManifestResult,
  type SaveManifestResult,
  type WriteArtifactResult
} from '@shared/ipc'

/**
 * Handlers de projeto: o único lugar que toca o `fs`. Todo load e save passa
 * pela validação — manifesto inválido nunca é gravado nem entregue como válido.
 */
export function registerProjectHandlers(): void {
  ipcMain.handle(IpcChannels.projectOpenFolder, async (): Promise<OpenFolderResult> => {
    const win = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0]
    const result = win
      ? await dialog.showOpenDialog(win, { properties: ['openDirectory'] })
      : await dialog.showOpenDialog({ properties: ['openDirectory'] })
    if (result.canceled || result.filePaths.length === 0) {
      return { path: null }
    }
    return { path: result.filePaths[0] }
  })

  ipcMain.handle(
    IpcChannels.projectReadManifest,
    async (_event, dir: string): Promise<ReadManifestResult> => {
      const file = join(dir, MANIFEST_FILENAME)
      let raw: string
      try {
        raw = await readFile(file, 'utf8')
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          return { found: false }
        }
        return { found: false, error: (error as Error).message }
      }

      let parsed: unknown
      try {
        parsed = JSON.parse(raw)
      } catch (error) {
        return { found: true, error: `JSON inválido: ${(error as Error).message}` }
      }

      const validation = validateManifest(parsed)
      return {
        found: true,
        validation,
        manifest: validation.valid ? (parsed as ProjectManifest) : undefined
      }
    }
  )

  ipcMain.handle(
    IpcChannels.projectSaveManifest,
    async (_event, dir: string, manifest: ProjectManifest): Promise<SaveManifestResult> => {
      const validation = validateManifest(manifest)
      if (!validation.valid) {
        return { saved: false, validation }
      }
      try {
        const file = join(dir, MANIFEST_FILENAME)
        await writeFile(file, JSON.stringify(manifest, null, 2) + '\n', 'utf8')
        return { saved: true, validation }
      } catch (error) {
        return { saved: false, validation, error: (error as Error).message }
      }
    }
  )

  ipcMain.handle(IpcChannels.projectValidate, async (_event, manifest: unknown) => {
    return validateManifest(manifest)
  })

  ipcMain.handle(
    IpcChannels.projectWriteArtifact,
    async (
      _event,
      dir: string,
      filename: string,
      content: string
    ): Promise<WriteArtifactResult> => {
      try {
        const file = join(dir, filename)
        await mkdir(dirname(file), { recursive: true })
        await writeFile(file, content, 'utf8')
        return { saved: true, path: file }
      } catch (error) {
        return { saved: false, error: (error as Error).message }
      }
    }
  )
}
