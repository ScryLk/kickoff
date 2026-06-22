import { describe, expect, it } from 'vitest'
import {
  agentsMdTranspiler,
  cursorTranspiler,
  getTranspiler,
  manifestToAgentsMd,
  manifestToClaudeMd,
  manifestToCursorRules,
  manifestToPromptBlock,
  promptTranspiler,
  transpilers
} from './index'
import { MANIFEST_VERSION, type ProjectManifest } from '../schema'

const sample: ProjectManifest = {
  manifestVersion: MANIFEST_VERSION,
  meta: { name: 'QuestBoard', tagline: 'Kanban gamificado', description: 'Quadro com XP.' },
  stack: { languages: ['TypeScript'], frameworks: ['React'], runtime: 'Node 22' },
  architecture: { overview: 'Local-first.', principles: ['Sem backend'], structure: 'src/...' },
  conventions: { codeStyle: ['Prettier'], commits: 'Conventional Commits' },
  nextSteps: ['Setup CI', 'Primeiro release']
}

describe('registro de transpilers', () => {
  it('expõe os quatro alvos', () => {
    expect(transpilers.map((t) => t.id).sort()).toEqual(
      ['agents-md', 'claude-md', 'cursor', 'prompt'].sort()
    )
  })

  it('getTranspiler encontra por id e devolve undefined para desconhecido', () => {
    expect(getTranspiler('cursor')).toBe(cursorTranspiler)
    expect(getTranspiler('nope')).toBeUndefined()
  })
})

describe('manifestToAgentsMd', () => {
  it('compartilha o corpo canônico com o CLAUDE.md', () => {
    expect(manifestToAgentsMd(sample)).toBe(manifestToClaudeMd(sample))
    expect(agentsMdTranspiler.filename).toBe('AGENTS.md')
  })

  it('inclui a seção Próximos passos quando há roadmap', () => {
    expect(manifestToAgentsMd(sample)).toContain('## Próximos passos')
    expect(manifestToAgentsMd(sample)).toContain('- Setup CI')
  })
})

describe('manifestToCursorRules', () => {
  it('emite frontmatter com alwaysApply e o corpo do manifesto', () => {
    const out = manifestToCursorRules(sample)
    expect(out.startsWith('---\n')).toBe(true)
    expect(out).toContain('description: Kanban gamificado')
    expect(out).toContain('alwaysApply: true')
    expect(out).toContain('# QuestBoard')
    expect(cursorTranspiler.filename).toBe('.cursor/rules/project.mdc')
  })
})

describe('manifestToPromptBlock', () => {
  it('gera um bloco compacto com contexto e instrução final', () => {
    const out = manifestToPromptBlock(sample)
    expect(out).toContain('Estou trabalhando no projeto "QuestBoard".')
    expect(out).toContain('Kanban gamificado')
    expect(out).toContain('- Stack: TypeScript, React, Node 22')
    expect(out).toContain('- Princípios: Sem backend')
    expect(out).toMatch(/responda em português\.\n$/)
    expect(promptTranspiler.filename).toBe('prompt-block.txt')
  })

  it('omite contexto quando só há nome', () => {
    const out = manifestToPromptBlock({ manifestVersion: MANIFEST_VERSION, meta: { name: 'X' } })
    expect(out).not.toContain('Contexto do projeto:')
    expect(out).toContain('Estou trabalhando no projeto "X".')
  })
})
