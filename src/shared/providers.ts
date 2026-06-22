/**
 * Catálogo de provedores de IA suportados.
 *
 * Este módulo é compartilhado entre main, preload e renderer. Não importa
 * Electron nem React — só dados e tipos. As chamadas de IA são a única exceção
 * ao princípio local-only e são sempre explícitas e opt-in (disparadas por um
 * clique do usuário), usando a chave do próprio usuário.
 */

/** Identificador de um provedor de IA. */
export type ProviderId = 'anthropic' | 'openai' | 'google' | 'openrouter' | 'local'

/** Metadados de um provedor de IA. */
export interface ProviderInfo {
  /** Identificador estável. */
  id: ProviderId
  /** Rótulo legível para a UI. */
  label: string
  /** Modelos sugeridos para o seletor (pode ser refinado em runtime). */
  models: string[]
  /** Se o provedor exige uma API key (local não exige). */
  requiresApiKey: boolean
}

/** Catálogo de provedores, na ordem de exibição da UI. */
export const PROVIDERS: Record<ProviderId, ProviderInfo> = {
  anthropic: {
    id: 'anthropic',
    label: 'Anthropic (Claude)',
    models: ['claude-opus-4-8', 'claude-sonnet-4-6', 'claude-haiku-4-5-20251001'],
    requiresApiKey: true
  },
  openai: {
    id: 'openai',
    label: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'o3-mini'],
    requiresApiKey: true
  },
  google: {
    id: 'google',
    label: 'Google (Gemini)',
    models: ['gemini-2.5-pro', 'gemini-2.5-flash'],
    requiresApiKey: true
  },
  openrouter: {
    id: 'openrouter',
    label: 'OpenRouter',
    models: ['anthropic/claude-opus-4-8', 'openai/gpt-4o', 'google/gemini-2.5-pro'],
    requiresApiKey: true
  },
  local: {
    id: 'local',
    label: 'Local (Ollama / LM Studio)',
    models: [],
    requiresApiKey: false
  }
}

/** Lista ordenada de provedores. */
export const PROVIDER_LIST: ProviderInfo[] = Object.values(PROVIDERS)

/** Type guard para um ProviderId. */
export function isProviderId(value: unknown): value is ProviderId {
  return typeof value === 'string' && value in PROVIDERS
}
