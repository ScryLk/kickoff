import { describe, expect, it } from 'vitest'
import { ManifestValidationFailed, assertValidManifest, validateManifest } from './index'
import { MANIFEST_VERSION, type ProjectManifest } from '../schema'

const minimal: ProjectManifest = {
  manifestVersion: MANIFEST_VERSION,
  meta: { name: 'QuestBoard' }
}

describe('validateManifest', () => {
  it('aceita o manifesto mínimo (apenas manifestVersion e meta.name)', () => {
    const result = validateManifest(minimal)
    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it('aceita um manifesto completo', () => {
    const full: ProjectManifest = {
      manifestVersion: MANIFEST_VERSION,
      meta: {
        name: 'QuestBoard',
        tagline: 'Kanban gamificado',
        description: 'Um quadro de tarefas com XP.',
        version: '1.0.0',
        logo: '.project/logo.png',
        repository: 'https://github.com/acme/questboard',
        license: 'MIT'
      },
      product: {
        problem: 'Times perdem motivação.',
        audience: 'Pequenos times.',
        goals: ['Engajar', 'Visualizar progresso'],
        nonGoals: ['Substituir Jira']
      },
      stack: {
        languages: ['TypeScript'],
        frameworks: ['React'],
        runtime: 'Node 22',
        packageManager: 'npm',
        database: 'SQLite',
        tooling: ['Vite', 'Vitest']
      },
      architecture: {
        overview: 'Local-first.',
        principles: ['Sem backend'],
        structure: 'src/ ...'
      },
      conventions: {
        codeStyle: ['Prettier'],
        naming: ['camelCase'],
        testing: 'Vitest',
        commits: 'Conventional Commits'
      },
      commands: [{ command: 'npm run dev', description: 'modo dev' }]
    }
    expect(validateManifest(full).valid).toBe(true)
  })

  it('rejeita quando meta.name está ausente', () => {
    const result = validateManifest({
      manifestVersion: MANIFEST_VERSION,
      meta: {}
    })
    expect(result.valid).toBe(false)
    expect(result.errors).toContainEqual(
      expect.objectContaining({ keyword: 'required', path: '/meta' })
    )
  })

  it('rejeita quando manifestVersion está ausente', () => {
    const result = validateManifest({ meta: { name: 'X' } })
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.keyword === 'required')).toBe(true)
  })

  it('rejeita propriedades desconhecidas no topo', () => {
    const result = validateManifest({ ...minimal, hacker: true })
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.keyword === 'additionalProperties')).toBe(true)
  })

  it('rejeita tipo errado de campo', () => {
    const result = validateManifest({
      manifestVersion: MANIFEST_VERSION,
      meta: { name: 123 }
    })
    expect(result.valid).toBe(false)
    expect(result.errors).toContainEqual(
      expect.objectContaining({ path: '/meta/name', keyword: 'type' })
    )
  })

  it('coleta múltiplos erros de uma vez (allErrors)', () => {
    const result = validateManifest({ meta: { name: 123, foo: 'bar' } })
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(1)
  })
})

describe('assertValidManifest', () => {
  it('retorna o manifesto tipado quando válido', () => {
    expect(assertValidManifest(minimal)).toBe(minimal)
  })

  it('lança ManifestValidationFailed com os erros quando inválido', () => {
    try {
      assertValidManifest({ meta: {} })
      expect.unreachable('deveria ter lançado')
    } catch (error) {
      expect(error).toBeInstanceOf(ManifestValidationFailed)
      expect((error as ManifestValidationFailed).errors.length).toBeGreaterThan(0)
    }
  })
})
