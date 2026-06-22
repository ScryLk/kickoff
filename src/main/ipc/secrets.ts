import { ipcMain, safeStorage } from 'electron'
import { IpcChannels, type ProviderConfig, type TestConnectionResult } from '@shared/ipc'
import { PROVIDERS, isProviderId, type ProviderId } from '@shared/providers'
import { readJsonFile, writeJsonFile } from '../store'

const SECRETS_FILE = 'secrets.json'

/** Mapa provider -> chave cifrada (base64). Nunca contém a chave em claro. */
type SecretsMap = Partial<Record<ProviderId, string>>

async function readSecrets(): Promise<SecretsMap> {
  return (await readJsonFile<SecretsMap>(SECRETS_FILE)) ?? {}
}

function ensureEncryptionAvailable(): void {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error(
      'Armazenamento seguro indisponível neste sistema (keychain do SO não acessível).'
    )
  }
}

/** Recupera a chave em claro de um provedor; só usado dentro do main. */
export async function getDecryptedKey(provider: ProviderId): Promise<string | null> {
  const secrets = await readSecrets()
  const encrypted = secrets[provider]
  if (!encrypted) return null
  ensureEncryptionAvailable()
  return safeStorage.decryptString(Buffer.from(encrypted, 'base64'))
}

/** Faz uma requisição GET mínima com timeout, retornando o status HTTP. */
async function probe(
  url: string,
  headers: Record<string, string>
): Promise<{ ok: boolean; status: number }> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch(url, { method: 'GET', headers, signal: controller.signal })
    return { ok: res.ok, status: res.status }
  } finally {
    clearTimeout(timeout)
  }
}

/** Testa a conexão com o provedor — a única chamada de rede com chave do usuário. */
async function testConnection(config: ProviderConfig): Promise<TestConnectionResult> {
  const provider = config.provider
  if (!isProviderId(provider)) {
    return { ok: false, message: 'Provedor inválido.' }
  }

  if (provider === 'local') {
    const base = (config.baseUrl ?? 'http://localhost:11434').replace(/\/$/, '')
    try {
      // Ollama expõe /api/tags; LM Studio expõe /v1/models.
      let res = await probe(`${base}/api/tags`, {})
      if (!res.ok) res = await probe(`${base}/v1/models`, {})
      return res.ok
        ? { ok: true, message: 'Conexão estabelecida.' }
        : { ok: false, message: `Falhou — servidor respondeu ${res.status}.` }
    } catch {
      return { ok: false, message: 'Falhou — nenhum servidor local respondeu.' }
    }
  }

  const key = await getDecryptedKey(provider)
  if (!key) {
    return { ok: false, message: 'Nenhuma chave salva para este provedor.' }
  }

  try {
    let res: { ok: boolean; status: number }
    switch (provider) {
      case 'anthropic':
        res = await probe('https://api.anthropic.com/v1/models', {
          'x-api-key': key,
          'anthropic-version': '2023-06-01'
        })
        break
      case 'openai':
        res = await probe('https://api.openai.com/v1/models', {
          Authorization: `Bearer ${key}`
        })
        break
      case 'google':
        res = await probe(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`,
          {}
        )
        break
      case 'openrouter':
        res = await probe('https://openrouter.ai/api/v1/key', {
          Authorization: `Bearer ${key}`
        })
        break
      default:
        return { ok: false, message: 'Provedor não suportado.' }
    }
    if (res.ok) {
      return { ok: true, message: 'Conexão estabelecida.' }
    }
    if (res.status === 401 || res.status === 403) {
      return { ok: false, message: 'Falhou — chave rejeitada.' }
    }
    return { ok: false, message: `Falhou — provedor respondeu ${res.status}.` }
  } catch {
    return { ok: false, message: 'Falhou — não foi possível alcançar o provedor.' }
  }
}

/**
 * Handlers de segredos. A API key é cifrada via Electron safeStorage (keychain
 * do SO) e gravada no userData. O renderer nunca vê a chave em claro: só pode
 * setar, limpar, perguntar se existe e pedir um teste de conexão.
 */
export function registerSecretsHandlers(): void {
  ipcMain.handle(
    IpcChannels.secretsHasKey,
    async (_event, provider: ProviderId): Promise<boolean> => {
      if (!isProviderId(provider)) return false
      const secrets = await readSecrets()
      return Boolean(secrets[provider])
    }
  )

  ipcMain.handle(IpcChannels.secretsSetKey, async (_event, provider: ProviderId, key: string) => {
    if (!isProviderId(provider)) {
      throw new Error(`provedor inválido: ${String(provider)}`)
    }
    if (!PROVIDERS[provider].requiresApiKey) {
      throw new Error('Este provedor não usa API key.')
    }
    const trimmed = key.trim()
    if (!trimmed) {
      throw new Error('A chave não pode ser vazia.')
    }
    ensureEncryptionAvailable()
    const encrypted = safeStorage.encryptString(trimmed).toString('base64')
    const secrets = await readSecrets()
    secrets[provider] = encrypted
    await writeJsonFile(SECRETS_FILE, secrets)
  })

  ipcMain.handle(IpcChannels.secretsClearKey, async (_event, provider: ProviderId) => {
    if (!isProviderId(provider)) return
    const secrets = await readSecrets()
    delete secrets[provider]
    await writeJsonFile(SECRETS_FILE, secrets)
  })

  ipcMain.handle(
    IpcChannels.secretsTestConnection,
    async (_event, config: ProviderConfig): Promise<TestConnectionResult> => testConnection(config)
  )
}
