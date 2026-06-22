import { type ProjectManifest } from '../schema'
import { MarkdownBuilder } from './markdown'
import { appendManifestBody } from './sections'
import { type Transpiler } from './types'

/**
 * Converte um ProjectManifest numa regra do Cursor (`.cursor/rules/*.mdc`):
 * frontmatter com `alwaysApply` + o corpo canônico do manifesto.
 */
export function manifestToCursorRules(manifest: ProjectManifest): string {
  const description = (
    manifest.meta.tagline ||
    manifest.meta.description ||
    `Contexto do projeto ${manifest.meta.name}`
  )
    .replace(/\s+/g, ' ')
    .trim()

  const md = new MarkdownBuilder()
  appendManifestBody(md, manifest)

  const frontmatter = ['---', `description: ${description}`, 'alwaysApply: true', '---'].join('\n')
  return `${frontmatter}\n\n${md.toString()}`
}

/** Transpiler registrável para as regras do Cursor. */
export const cursorTranspiler: Transpiler = {
  id: 'cursor',
  label: 'Regras do Cursor',
  filename: '.cursor/rules/project.mdc',
  transpile: manifestToCursorRules
}
