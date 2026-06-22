import { app } from 'electron'
import { join } from 'path'
import { readFile, writeFile, mkdir } from 'fs/promises'

/**
 * Acesso a arquivos de configuração do app no diretório `userData` do SO.
 * É o único lugar onde preferências do app (não dados de projeto) persistem.
 * Dados de projeto vivem no `project-manifest.json` do projeto-alvo, nunca aqui.
 */

function userDataFile(name: string): string {
  return join(app.getPath('userData'), name)
}

/** Lê e faz parse de um JSON do userData; retorna `null` se não existir. */
export async function readJsonFile<T>(name: string): Promise<T | null> {
  try {
    const raw = await readFile(userDataFile(name), 'utf8')
    return JSON.parse(raw) as T
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null
    }
    throw error
  }
}

/** Grava um JSON no userData, criando o diretório se necessário. */
export async function writeJsonFile(name: string, data: unknown): Promise<void> {
  const path = userDataFile(name)
  await mkdir(app.getPath('userData'), { recursive: true })
  await writeFile(path, JSON.stringify(data, null, 2), 'utf8')
}

/** Lê um arquivo binário do userData; retorna `null` se não existir. */
export async function readBinaryFile(name: string): Promise<Buffer | null> {
  try {
    return await readFile(userDataFile(name))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null
    }
    throw error
  }
}

/** Grava um arquivo binário no userData. */
export async function writeBinaryFile(name: string, data: Buffer): Promise<void> {
  await mkdir(app.getPath('userData'), { recursive: true })
  await writeFile(userDataFile(name), data)
}
