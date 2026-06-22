import { describe, expect, it } from 'vitest'
import { claudeMdTranspiler, manifestToClaudeMd } from './claude-md'
import { MANIFEST_VERSION, type ProjectManifest } from '../schema'

describe('manifestToClaudeMd', () => {
  it('gera apenas o título para o manifesto mínimo', () => {
    const manifest: ProjectManifest = {
      manifestVersion: MANIFEST_VERSION,
      meta: { name: 'QuestBoard' }
    }
    expect(manifestToClaudeMd(manifest)).toBe('# QuestBoard\n')
  })

  it('gera o markdown esperado a partir de um manifesto preenchido', () => {
    const manifest: ProjectManifest = {
      manifestVersion: MANIFEST_VERSION,
      meta: {
        name: 'QuestBoard',
        tagline: 'Kanban gamificado',
        description: 'Um quadro de tarefas com XP.',
        version: '1.0.0',
        license: 'MIT'
      },
      product: {
        problem: 'Times perdem motivação.',
        goals: ['Engajar o time', 'Visualizar progresso']
      },
      stack: {
        languages: ['TypeScript'],
        frameworks: ['React'],
        runtime: 'Node 22'
      },
      conventions: {
        commits: 'Conventional Commits'
      },
      commands: [{ command: 'npm run dev', description: 'modo dev' }, { command: 'npm test' }]
    }

    const expected = `# QuestBoard

Kanban gamificado

Um quadro de tarefas com XP.

**Versão:** 1.0.0

**Licença:** MIT

## Produto

**Problema:** Times perdem motivação.

### Objetivos

- Engajar o time
- Visualizar progresso

## Stack

**Linguagens:** TypeScript

**Frameworks:** React

**Runtime:** Node 22

## Convenções

**Commits:** Conventional Commits

## Comandos

- \`npm run dev\` — modo dev
- \`npm test\`
`

    expect(manifestToClaudeMd(manifest)).toBe(expected)
  })

  it('omite seções sem conteúdo', () => {
    const manifest: ProjectManifest = {
      manifestVersion: MANIFEST_VERSION,
      meta: { name: 'X' },
      product: { goals: [] }
    }
    const output = manifestToClaudeMd(manifest)
    expect(output).not.toContain('## Produto')
  })

  it('é determinístico', () => {
    const manifest: ProjectManifest = {
      manifestVersion: MANIFEST_VERSION,
      meta: { name: 'X', description: 'y' }
    }
    expect(manifestToClaudeMd(manifest)).toBe(manifestToClaudeMd(manifest))
  })

  it('expõe metadados do transpiler', () => {
    expect(claudeMdTranspiler.id).toBe('claude-md')
    expect(claudeMdTranspiler.filename).toBe('CLAUDE.md')
    expect(claudeMdTranspiler.transpile).toBe(manifestToClaudeMd)
  })
})
