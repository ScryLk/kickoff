import { type Transpiler } from './types'
import { claudeMdTranspiler } from './claude-md'
import { agentsMdTranspiler } from './agents-md'
import { cursorTranspiler } from './cursor'
import { promptTranspiler } from './prompt'

export * from './types'
export { manifestToClaudeMd, claudeMdTranspiler } from './claude-md'
export { manifestToAgentsMd, agentsMdTranspiler } from './agents-md'
export { manifestToCursorRules, cursorTranspiler } from './cursor'
export { manifestToPromptBlock, promptTranspiler } from './prompt'

/**
 * Registro de transpilers disponíveis. A UI de Export oferece todos
 * automaticamente — basta adicionar um transpiler aqui.
 */
export const transpilers: readonly Transpiler[] = [
  claudeMdTranspiler,
  agentsMdTranspiler,
  cursorTranspiler,
  promptTranspiler
]

/** Busca um transpiler pelo seu id. */
export function getTranspiler(id: string): Transpiler | undefined {
  return transpilers.find((t) => t.id === id)
}
