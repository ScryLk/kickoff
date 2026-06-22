import { type ProjectManifest } from '@core/schema'
import { colors, fonts } from '../theme'
import { useApp } from '../state/ui'
import { TextField, TextAreaField, ListField } from './fields'
import { AiAssistButton } from './AiAssistButton'

/** Remove campos vazios de um objeto de seção; devolve undefined se ficar vazio. */
function prune<T extends object>(obj: T): T | undefined {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value == null) continue
    if (Array.isArray(value)) {
      if (value.length) out[key] = value
    } else if (typeof value === 'string') {
      if (value.trim()) out[key] = value
    } else {
      out[key] = value
    }
  }
  return Object.keys(out).length ? (out as T) : undefined
}

function MetaForm(): React.JSX.Element {
  const { manifest, updateMeta, validation, importLogo } = useApp()
  if (!manifest) return <></>
  const nameInvalid = !manifest.meta.name?.trim() && validation != null && !validation.valid

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: colors.offWhite }}>
            Nome do projeto
          </label>
          <span style={{ color: colors.spark, fontSize: 13 }}>*</span>
        </div>
        <input
          value={manifest.meta.name ?? ''}
          onChange={(e) => updateMeta({ name: e.target.value })}
          placeholder="meu-projeto"
          style={{
            width: '100%',
            padding: '11px 13px',
            borderRadius: 9,
            background: colors.surface,
            color: colors.offWhite,
            fontSize: 13.5,
            outline: 'none',
            border: `1px solid ${nameInvalid ? colors.spark : colors.borderField}`
          }}
        />
        <span style={{ fontSize: 11.5, color: 'rgba(243,238,232,0.4)' }}>
          Usado como identificador em todo o manifesto.
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: colors.offWhite }}>Descrição</label>
          <AiAssistButton
            onRun={async (suggest) => {
              const text = await suggest({
                system:
                  'Você ajuda a documentar projetos de software. Responda em português, sem preâmbulo.',
                prompt: `Escreva uma descrição de uma ou duas frases para um projeto chamado "${manifest.meta.name || 'sem nome'}". Responda só com a descrição.`
              })
              updateMeta({ description: text })
            }}
          />
        </div>
        <textarea
          value={manifest.meta.description ?? ''}
          onChange={(e) => updateMeta({ description: e.target.value })}
          rows={3}
          placeholder="O que o projeto faz, em uma ou duas frases."
          style={{
            width: '100%',
            padding: '11px 13px',
            borderRadius: 9,
            background: colors.surface,
            color: colors.offWhite,
            fontSize: 13.5,
            resize: 'vertical',
            outline: 'none',
            border: `1px solid ${colors.borderField}`
          }}
        />
        <span style={{ fontSize: 11.5, color: 'rgba(243,238,232,0.4)' }}>
          Uma ou duas frases sobre o que o projeto faz.
        </span>
      </div>

      <TextField
        label="Tagline"
        hint="Opcional — frase curta que aparece no topo dos artefatos."
        value={manifest.meta.tagline ?? ''}
        placeholder="Frase curta que resume o projeto."
        onChange={(v) => updateMeta({ tagline: v })}
      />
      <TextField
        label="Licença"
        value={manifest.meta.license ?? ''}
        placeholder="MIT"
        onChange={(v) => updateMeta({ license: v })}
      />

      {/* logo: caminho de arquivo, nunca base64 (princípio nº5) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: colors.offWhite }}>Logo</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              flex: 1,
              padding: '11px 13px',
              borderRadius: 9,
              background: colors.ink,
              border: `1px solid ${colors.borderField}`,
              fontFamily: fonts.mono,
              fontSize: 12.5,
              color: manifest.meta.logo ? colors.offWhite : 'rgba(243,238,232,0.35)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {manifest.meta.logo ?? 'nenhum logo'}
          </span>
          <button
            onClick={() => void importLogo()}
            style={{
              flex: 'none',
              padding: '11px 14px',
              borderRadius: 9,
              border: `1px solid ${colors.borderStrong}`,
              background: colors.surface,
              color: colors.offWhite,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Escolher imagem…
          </button>
          {manifest.meta.logo && (
            <button
              onClick={() => updateMeta({ logo: undefined })}
              style={{
                flex: 'none',
                padding: '11px 13px',
                borderRadius: 9,
                border: `1px solid ${colors.borderStrong}`,
                background: 'transparent',
                color: 'rgba(243,238,232,0.6)',
                fontSize: 12.5,
                cursor: 'pointer'
              }}
            >
              Remover
            </button>
          )}
        </div>
        <span style={{ fontSize: 11.5, color: 'rgba(243,238,232,0.4)' }}>
          Copiado para <span style={{ fontFamily: fonts.mono }}>.project/</span> no projeto; o
          manifesto guarda só o caminho.
        </span>
      </div>
    </div>
  )
}

function StackForm(): React.JSX.Element {
  const { manifest, editManifest } = useApp()
  const stack = manifest?.stack
  const patch = (p: Partial<NonNullable<ProjectManifest['stack']>>): void =>
    editManifest((m) => ({ ...m, stack: prune({ ...m.stack, ...p }) }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <ListField
        label="Linguagens"
        items={stack?.languages ?? []}
        placeholder={'TypeScript\nRust'}
        onChange={(v) => patch({ languages: v })}
      />
      <ListField
        label="Frameworks e bibliotecas"
        items={stack?.frameworks ?? []}
        placeholder={'React\nElectron'}
        onChange={(v) => patch({ frameworks: v })}
      />
      <TextField
        label="Runtime"
        value={stack?.runtime ?? ''}
        placeholder="Node 22"
        onChange={(v) => patch({ runtime: v })}
      />
      <TextField
        label="Gerenciador de pacotes"
        value={stack?.packageManager ?? ''}
        placeholder="npm"
        onChange={(v) => patch({ packageManager: v })}
      />
      <TextField
        label="Banco de dados / persistência"
        value={stack?.database ?? ''}
        placeholder="SQLite"
        onChange={(v) => patch({ database: v })}
      />
      <ListField
        label="Ferramentas"
        items={stack?.tooling ?? []}
        placeholder={'Vite\nVitest'}
        onChange={(v) => patch({ tooling: v })}
      />
    </div>
  )
}

function EstruturaForm(): React.JSX.Element {
  const { manifest, editManifest } = useApp()
  const arch = manifest?.architecture
  const patch = (p: Partial<NonNullable<ProjectManifest['architecture']>>): void =>
    editManifest((m) => ({ ...m, architecture: prune({ ...m.architecture, ...p }) }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <TextAreaField
        label="Visão geral"
        hint="Resumo da arquitetura."
        value={arch?.overview ?? ''}
        onChange={(v) => patch({ overview: v })}
        action={
          <AiAssistButton
            onRun={async (suggest) => {
              const text = await suggest({
                system:
                  'Você ajuda a documentar a arquitetura de projetos de software. Responda em português, sem preâmbulo.',
                prompt: `Escreva um resumo curto (2-3 frases) da arquitetura de um projeto chamado "${manifest?.meta.name || 'sem nome'}"${manifest?.meta.description ? `: ${manifest.meta.description}` : ''}. Responda só com o resumo.`
              })
              patch({ overview: text })
            }}
          />
        }
      />
      <TextAreaField
        label="Estrutura de pastas"
        rows={6}
        hint="Como o código é organizado em pastas e módulos."
        value={arch?.structure ?? ''}
        onChange={(v) => patch({ structure: v })}
      />
    </div>
  )
}

function ConvencoesForm(): React.JSX.Element {
  const { manifest, editManifest } = useApp()
  const conv = manifest?.conventions
  const patch = (p: Partial<NonNullable<ProjectManifest['conventions']>>): void =>
    editManifest((m) => ({ ...m, conventions: prune({ ...m.conventions, ...p }) }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <ListField
        label="Estilo de código"
        items={conv?.codeStyle ?? []}
        placeholder={'Prettier\nESLint estrito'}
        onChange={(v) => patch({ codeStyle: v })}
      />
      <ListField
        label="Nomenclatura"
        items={conv?.naming ?? []}
        placeholder={'camelCase para funções\nPascalCase para tipos'}
        onChange={(v) => patch({ naming: v })}
      />
      <TextField
        label="Testes"
        value={conv?.testing ?? ''}
        placeholder="Vitest"
        onChange={(v) => patch({ testing: v })}
      />
      <TextField
        label="Commits"
        value={conv?.commits ?? ''}
        placeholder="Conventional Commits"
        onChange={(v) => patch({ commits: v })}
      />
    </div>
  )
}

function PrincipiosForm(): React.JSX.Element {
  const { manifest, editManifest } = useApp()
  const arch = manifest?.architecture
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <ListField
        label="Princípios inegociáveis"
        hint="Regras que toda contribuição precisa respeitar. Um por linha."
        items={arch?.principles ?? []}
        placeholder={'Local-only, sem backend\nCore isolado de UI'}
        onChange={(v) =>
          editManifest((m) => ({ ...m, architecture: prune({ ...m.architecture, principles: v }) }))
        }
      />
    </div>
  )
}

function ProximosForm(): React.JSX.Element {
  const { manifest, editManifest } = useApp()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <ListField
        label="Próximos passos"
        hint="O roadmap inicial: o que vem logo depois do kickoff. Um por linha."
        items={manifest?.nextSteps ?? []}
        placeholder={'Configurar CI\nPrimeiro release'}
        onChange={(v) => editManifest((m) => ({ ...m, nextSteps: v.length ? v : undefined }))}
      />
    </div>
  )
}

const FORMS = [MetaForm, StackForm, EstruturaForm, ConvencoesForm, PrincipiosForm, ProximosForm]

/** Renderiza o formulário do passo selecionado. */
export function StepForm({ index }: { index: number }): React.JSX.Element {
  const Form = FORMS[index] ?? MetaForm
  return <Form />
}
