import { type ProjectManifest } from '../schema'
import { MarkdownBuilder } from './markdown'
import { appendManifestBody } from './sections'
import { type Transpiler } from './types'

/**
 * Converte um ProjectManifest no conteúdo de um `AGENTS.md`: o arquivo de
 * contexto lido por ferramentas que seguem essa convenção. Compartilha o corpo
 * canônico com o CLAUDE.md — muda só o nome de arquivo que cada ferramenta lê.
 */
export function manifestToAgentsMd(manifest: ProjectManifest): string {
  const md = new MarkdownBuilder()
  appendManifestBody(md, manifest)
  return md.toString()
}

/** Transpiler registrável para o artefato AGENTS.md. */
export const agentsMdTranspiler: Transpiler = {
  id: 'agents-md',
  label: 'AGENTS.md',
  filename: 'AGENTS.md',
  transpile: manifestToAgentsMd
}
