import { type ProjectManifest } from '../schema'
import { MarkdownBuilder } from './markdown'
import { appendManifestBody } from './sections'
import { type Transpiler } from './types'

/**
 * Converte um ProjectManifest no conteúdo de um `CLAUDE.md`: o documento de
 * contexto que o Claude Code lê antes de mexer no projeto.
 *
 * Função pura e determinística. Seções sem dados são omitidas.
 */
export function manifestToClaudeMd(manifest: ProjectManifest): string {
  const md = new MarkdownBuilder()
  appendManifestBody(md, manifest)
  return md.toString()
}

/** Transpiler registrável para o artefato CLAUDE.md. */
export const claudeMdTranspiler: Transpiler = {
  id: 'claude-md',
  label: 'CLAUDE.md',
  filename: 'CLAUDE.md',
  transpile: manifestToClaudeMd
}
