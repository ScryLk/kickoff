import { type ProjectManifest } from '../schema'
import { type Transpiler } from './types'

/**
 * Converte um ProjectManifest num bloco de prompt compacto, pronto para colar
 * num chat de IA. Texto puro, sem markdown pesado: só o essencial do contexto.
 */
export function manifestToPromptBlock(manifest: ProjectManifest): string {
  const { meta, stack, architecture, conventions, nextSteps } = manifest

  const lines: string[] = []
  lines.push(`Estou trabalhando no projeto "${meta.name}".`)
  const intro = meta.tagline || meta.description
  if (intro) {
    lines.push(intro.trim())
  }

  const context: string[] = []
  const addContext = (label: string, value: string | undefined): void => {
    const trimmed = value?.trim()
    if (trimmed) context.push(`- ${label}: ${trimmed}`)
  }

  if (meta.tagline && meta.description) {
    addContext('Descrição', meta.description)
  }
  addContext(
    'Stack',
    [...(stack?.languages ?? []), ...(stack?.frameworks ?? []), stack?.runtime]
      .filter(Boolean)
      .join(', ')
  )
  addContext('Arquitetura', architecture?.overview)
  addContext('Estrutura', architecture?.structure)
  addContext('Princípios', architecture?.principles?.join('; '))
  addContext(
    'Convenções',
    [conventions?.codeStyle?.join(', '), conventions?.commits].filter(Boolean).join(' · ')
  )
  addContext('Próximos passos', nextSteps?.join('; '))

  if (context.length > 0) {
    lines.push('', 'Contexto do projeto:', ...context)
  }

  lines.push('', 'Use esse contexto em tudo que sugerir e responda em português.')
  return lines.join('\n') + '\n'
}

/** Transpiler registrável para o bloco de prompt. */
export const promptTranspiler: Transpiler = {
  id: 'prompt',
  label: 'Bloco de prompt',
  filename: 'prompt-block.txt',
  transpile: manifestToPromptBlock
}
