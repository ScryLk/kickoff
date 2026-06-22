/**
 * Pequeno utilitário para montar markdown de forma determinística, omitindo
 * seções vazias. Mantém os transpilers legíveis e o output estável (importante
 * para os testes de snapshot).
 */
export class MarkdownBuilder {
  private readonly blocks: string[] = []

  /** Adiciona um cabeçalho de nível `level`. */
  heading(level: number, text: string): this {
    this.blocks.push(`${'#'.repeat(level)} ${text}`)
    return this
  }

  /** Adiciona um parágrafo, se houver texto. */
  paragraph(text: string | undefined): this {
    const trimmed = text?.trim()
    if (trimmed) {
      this.blocks.push(trimmed)
    }
    return this
  }

  /** Adiciona uma linha `**label:** value`, se houver valor. */
  field(label: string, value: string | undefined): this {
    const trimmed = value?.trim()
    if (trimmed) {
      this.blocks.push(`**${label}:** ${trimmed}`)
    }
    return this
  }

  /** Adiciona uma lista não ordenada, se houver itens. */
  list(items: readonly string[] | undefined): this {
    const cleaned = (items ?? []).map((i) => i.trim()).filter(Boolean)
    if (cleaned.length > 0) {
      this.blocks.push(cleaned.map((i) => `- ${i}`).join('\n'))
    }
    return this
  }

  /** Adiciona um bloco bruto já formatado, se não estiver vazio. */
  raw(block: string | undefined): this {
    const trimmed = block?.trim()
    if (trimmed) {
      this.blocks.push(trimmed)
    }
    return this
  }

  /** Junta os blocos com uma linha em branco entre eles e quebra final. */
  toString(): string {
    return this.blocks.join('\n\n') + '\n'
  }
}
