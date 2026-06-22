/**
 * Tipos do ProjectManifest.
 *
 * Devem ficar em sincronia com `manifest.schema.json` (a fonte da verdade da
 * validação). O schema é permissivo: apenas `manifestVersion` e `meta.name`
 * são obrigatórios; o wizard preenche o resto aos poucos.
 */

/** Identidade do projeto. */
export interface ProjectMeta {
  /** Nome do projeto. Único campo realmente obrigatório do manifesto. */
  name: string
  /** Frase curta que resume o projeto. */
  tagline?: string
  /** Descrição mais longa do que o projeto é e faz. */
  description?: string
  /** Versão do projeto-alvo (semver livre). */
  version?: string
  /** Caminho de arquivo do logo (ex.: `.project/logo.png`). Nunca base64. */
  logo?: string
  /** URL do repositório do projeto. */
  repository?: string
  /** Identificador SPDX da licença (ex.: `MIT`). */
  license?: string
}

/** O porquê do projeto: problema, público e objetivos. */
export interface ProjectProduct {
  /** Problema que o projeto resolve. */
  problem?: string
  /** Público-alvo / usuários. */
  audience?: string
  /** Objetivos do projeto. */
  goals?: string[]
  /** O que o projeto explicitamente não pretende fazer. */
  nonGoals?: string[]
}

/** Tecnologias usadas no projeto. */
export interface ProjectStack {
  /** Linguagens de programação. */
  languages?: string[]
  /** Frameworks e bibliotecas principais. */
  frameworks?: string[]
  /** Runtime de execução (ex.: `Node 22`). */
  runtime?: string
  /** Gerenciador de pacotes (ex.: `npm`). */
  packageManager?: string
  /** Banco de dados / persistência. */
  database?: string
  /** Ferramentas de build, lint, teste, etc. */
  tooling?: string[]
}

/** Visão de arquitetura e estrutura do projeto. */
export interface ProjectArchitecture {
  /** Resumo da arquitetura. */
  overview?: string
  /** Princípios inegociáveis de arquitetura. */
  principles?: string[]
  /** Descrição da estrutura de pastas / módulos. */
  structure?: string
}

/** Convenções de código e processo. */
export interface ProjectConventions {
  /** Regras de estilo de código. */
  codeStyle?: string[]
  /** Convenções de nomenclatura. */
  naming?: string[]
  /** Estratégia e ferramentas de teste. */
  testing?: string
  /** Convenção de mensagens de commit. */
  commits?: string
}

/** Comando útil do projeto. */
export interface ProjectCommand {
  /** O comando em si (ex.: `npm run dev`). */
  command: string
  /** O que o comando faz. */
  description?: string
}

/**
 * Documento canônico e portável que descreve um projeto de software.
 * Transpilado para os formatos que cada ferramenta de IA entende.
 */
export interface ProjectManifest {
  /** Versão do schema do manifesto (semver). */
  manifestVersion: string
  /** Identidade do projeto. */
  meta: ProjectMeta
  /** O porquê do projeto. */
  product?: ProjectProduct
  /** Tecnologias usadas. */
  stack?: ProjectStack
  /** Visão de arquitetura. */
  architecture?: ProjectArchitecture
  /** Convenções de código e processo. */
  conventions?: ProjectConventions
  /** Comandos úteis do projeto. */
  commands?: ProjectCommand[]
  /** Roadmap inicial: o que vem logo depois do kickoff. */
  nextSteps?: string[]
}

/** Versão atual do schema do manifesto. */
export const MANIFEST_VERSION = '0.1.0'
