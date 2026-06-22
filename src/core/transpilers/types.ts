import { type ProjectManifest } from '../schema'

/**
 * Um transpiler converte um ProjectManifest num artefato de texto que alguma
 * ferramenta de IA entende. É sempre uma função pura: entra o manifesto, sai
 * uma string. Sem I/O — quem grava o arquivo é o processo main.
 */
export interface Transpiler {
  /** Identificador estável (ex.: `claude-md`). */
  id: string
  /** Rótulo legível para a UI (ex.: `CLAUDE.md`). */
  label: string
  /** Nome de arquivo sugerido ao salvar no projeto-alvo. */
  filename: string
  /** Converte o manifesto no artefato de texto. */
  transpile: (manifest: ProjectManifest) => string
}
