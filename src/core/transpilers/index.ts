import { type Transpiler } from './types'
import { claudeMdTranspiler } from './claude-md'

export * from './types'
export { manifestToClaudeMd, claudeMdTranspiler } from './claude-md'

/**
 * Registro de transpilers disponíveis. A estrutura já está pronta para receber
 * AGENTS.md, regras do Cursor e o bloco de prompt: basta adicionar o transpiler
 * aqui que a UI o oferece automaticamente.
 */
export const transpilers: readonly Transpiler[] = [claudeMdTranspiler]

/** Busca um transpiler pelo seu id. */
export function getTranspiler(id: string): Transpiler | undefined {
  return transpilers.find((t) => t.id === id)
}
