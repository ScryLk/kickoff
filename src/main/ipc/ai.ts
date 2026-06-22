import { ipcMain } from 'electron'
import {
  IpcChannels,
  type AiCompleteRequest,
  type AiCompleteResult,
  type ProviderConfig
} from '@shared/ipc'
import { PROVIDERS, type ProviderId } from '@shared/providers'
import { readJsonFile } from '../store'
import { getDecryptedKey } from './secrets'

const SETTINGS_FILE = 'settings.json'
const MAX_TOKENS = 1024

interface Settings {
  provider?: ProviderConfig
}

async function postJson(
  url: string,
  headers: Record<string, string>,
  body: unknown
): Promise<unknown> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body: JSON.stringify(body),
      signal: controller.signal
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      throw new Error(
        `provedor respondeu ${res.status}${detail ? `: ${detail.slice(0, 200)}` : ''}`
      )
    }
    return res.json()
  } finally {
    clearTimeout(timeout)
  }
}

function pick(obj: unknown, path: (string | number)[]): unknown {
  let cur: unknown = obj
  for (const key of path) {
    if (cur == null || typeof cur !== 'object') return undefined
    cur = (cur as Record<string | number, unknown>)[key]
  }
  return cur
}

function model(config: ProviderConfig): string {
  return config.model || PROVIDERS[config.provider].models[0] || ''
}

async function complete(request: AiCompleteRequest): Promise<AiCompleteResult> {
  const settings = await readJsonFile<Settings>(SETTINGS_FILE)
  const config = settings?.provider
  if (!config) {
    return { ok: false, error: 'Nenhum provedor de IA configurado.' }
  }
  const provider: ProviderId = config.provider
  const needsKey = PROVIDERS[provider].requiresApiKey
  const key = needsKey ? await getDecryptedKey(provider) : null
  if (needsKey && !key) {
    return { ok: false, error: 'Nenhuma chave salva para o provedor.' }
  }

  try {
    let text: unknown
    switch (provider) {
      case 'anthropic': {
        const json = await postJson(
          'https://api.anthropic.com/v1/messages',
          { 'x-api-key': key!, 'anthropic-version': '2023-06-01' },
          {
            model: model(config),
            max_tokens: MAX_TOKENS,
            system: request.system,
            messages: [{ role: 'user', content: request.prompt }]
          }
        )
        text = pick(json, ['content', 0, 'text'])
        break
      }
      case 'openai':
      case 'openrouter': {
        const url =
          provider === 'openai'
            ? 'https://api.openai.com/v1/chat/completions'
            : 'https://openrouter.ai/api/v1/chat/completions'
        const json = await postJson(
          url,
          { Authorization: `Bearer ${key!}` },
          { model: model(config), max_tokens: MAX_TOKENS, messages: messages(request) }
        )
        text = pick(json, ['choices', 0, 'message', 'content'])
        break
      }
      case 'google': {
        const json = await postJson(
          `https://generativelanguage.googleapis.com/v1beta/models/${model(config)}:generateContent?key=${encodeURIComponent(key!)}`,
          {},
          {
            systemInstruction: request.system ? { parts: [{ text: request.system }] } : undefined,
            contents: [{ role: 'user', parts: [{ text: request.prompt }] }]
          }
        )
        text = pick(json, ['candidates', 0, 'content', 'parts', 0, 'text'])
        break
      }
      case 'local': {
        const base = (config.baseUrl ?? 'http://localhost:11434').replace(/\/$/, '')
        const json = await postJson(
          `${base}/v1/chat/completions`,
          {},
          { model: model(config), messages: messages(request), stream: false }
        )
        text = pick(json, ['choices', 0, 'message', 'content'])
        break
      }
      default:
        return { ok: false, error: 'Provedor não suportado.' }
    }

    if (typeof text === 'string' && text.trim()) {
      return { ok: true, text: text.trim() }
    }
    return { ok: false, error: 'O provedor não retornou texto.' }
  } catch (error) {
    return { ok: false, error: (error as Error).message }
  }
}

function messages(request: AiCompleteRequest): { role: string; content: string }[] {
  const out: { role: string; content: string }[] = []
  if (request.system) out.push({ role: 'system', content: request.system })
  out.push({ role: 'user', content: request.prompt })
  return out
}

/**
 * Handler de assistência por IA. É a única chamada de rede com dados do projeto,
 * e mesmo assim só dispara quando o usuário clica num botão de assistência.
 * Usa a chave do próprio usuário (cifrada no keychain), nunca exposta ao renderer.
 */
export function registerAiHandlers(): void {
  ipcMain.handle(
    IpcChannels.aiComplete,
    async (_event, request: AiCompleteRequest): Promise<AiCompleteResult> => complete(request)
  )
}
