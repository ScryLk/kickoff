import { type ProjectManifest } from '../schema'
import { MarkdownBuilder } from './markdown'

/** Verifica se um objeto opcional tem pelo menos um campo com valor útil. */
export function hasContent<T extends object>(obj: T | undefined): boolean {
  if (!obj) return false
  return Object.values(obj).some((value) => {
    if (value == null) return false
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'string') return value.trim().length > 0
    return true
  })
}

/**
 * Monta o corpo markdown canônico do manifesto (título + seções), reutilizado
 * pelos transpilers de documento (CLAUDE.md, AGENTS.md). Seções vazias somem.
 */
export function appendManifestBody(md: MarkdownBuilder, manifest: ProjectManifest): void {
  const { meta, product, stack, architecture, conventions, commands, nextSteps } = manifest

  md.heading(1, meta.name)
  md.paragraph(meta.tagline)
  md.paragraph(meta.description)

  const metaFields = new MarkdownBuilder()
  metaFields.field('Versão', meta.version)
  metaFields.field('Repositório', meta.repository)
  metaFields.field('Licença', meta.license)
  const metaBlock = metaFields.toString().trim()
  if (metaBlock) {
    md.raw(metaBlock)
  }

  if (hasContent(product)) {
    md.heading(2, 'Produto')
    md.field('Problema', product?.problem)
    md.field('Público', product?.audience)
    if (product?.goals?.length) {
      md.heading(3, 'Objetivos')
      md.list(product.goals)
    }
    if (product?.nonGoals?.length) {
      md.heading(3, 'Não-objetivos')
      md.list(product.nonGoals)
    }
  }

  if (hasContent(stack)) {
    md.heading(2, 'Stack')
    const stackList = new MarkdownBuilder()
    stackList.field('Linguagens', stack?.languages?.join(', '))
    stackList.field('Frameworks', stack?.frameworks?.join(', '))
    stackList.field('Runtime', stack?.runtime)
    stackList.field('Gerenciador de pacotes', stack?.packageManager)
    stackList.field('Banco de dados', stack?.database)
    stackList.field('Ferramentas', stack?.tooling?.join(', '))
    md.raw(stackList.toString().trim())
  }

  if (hasContent(architecture)) {
    md.heading(2, 'Arquitetura')
    md.paragraph(architecture?.overview)
    if (architecture?.principles?.length) {
      md.heading(3, 'Princípios')
      md.list(architecture.principles)
    }
    if (architecture?.structure) {
      md.heading(3, 'Estrutura')
      md.paragraph(architecture.structure)
    }
  }

  if (hasContent(conventions)) {
    md.heading(2, 'Convenções')
    if (conventions?.codeStyle?.length) {
      md.heading(3, 'Estilo de código')
      md.list(conventions.codeStyle)
    }
    if (conventions?.naming?.length) {
      md.heading(3, 'Nomenclatura')
      md.list(conventions.naming)
    }
    md.field('Testes', conventions?.testing)
    md.field('Commits', conventions?.commits)
  }

  if (commands?.length) {
    md.heading(2, 'Comandos')
    md.list(
      commands.map((c) =>
        c.description ? `\`${c.command}\` — ${c.description}` : `\`${c.command}\``
      )
    )
  }

  if (nextSteps?.length) {
    md.heading(2, 'Próximos passos')
    md.list(nextSteps)
  }
}
