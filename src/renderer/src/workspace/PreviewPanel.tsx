import { type CSSProperties } from 'react'
import { colors, fonts, ink } from '../theme'
import { useUi, type ExportTarget } from '../state/ui'

const FILENAMES: Record<ExportTarget, string> = {
  claude: 'CLAUDE.md',
  agents: 'AGENTS.md',
  cursor: '.cursor/rules',
  prompt: 'prompt-block.txt'
}

// Previews mock da casca; a Fase 4 liga ao manifesto real e ao transpiler.
const MANIFEST_SAMPLE = `{
  "manifestVersion": "0.1.0",
  "meta": {
    "name": "kickoff",
    "description": "App desktop local-only…"
  },
  "stack": null,
  "architecture": null,
  "conventions": null
}`

const EXPORT_SAMPLE = `# kickoff

App desktop local-only que guia a criação de
projetos de software por um wizard.

## Stack
_pendente — preencha o passo Stack_

## Princípios
_pendente_`

const preStyle: CSSProperties = {
  margin: 0,
  fontFamily: fonts.mono,
  fontSize: 12,
  lineHeight: 1.7,
  color: ink[55],
  whiteSpace: 'pre-wrap'
}

function chipStyle(active: boolean): CSSProperties {
  return {
    padding: '6px 12px',
    borderRadius: 8,
    fontFamily: fonts.sans,
    fontSize: 11.5,
    fontWeight: 500,
    cursor: 'pointer',
    ...(active
      ? { background: colors.bordo, color: colors.offWhite, border: `1px solid ${colors.bordo}` }
      : { background: 'transparent', color: ink[60], border: `1px solid ${colors.borderField}` })
  }
}

function tabStyle(active: boolean): CSSProperties {
  return {
    padding: '0 16px',
    border: 'none',
    background: 'transparent',
    fontFamily: fonts.sans,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    borderBottom: `2px solid ${active ? colors.spark : 'transparent'}`,
    color: active ? colors.offWhite : ink[45]
  }
}

function CollapsedTab(): React.JSX.Element {
  const { setRightOpen } = useUi()
  return (
    <div
      onClick={() => setRightOpen(true)}
      style={{
        width: 38,
        flex: 'none',
        background: colors.surfaceAlt,
        borderLeft: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        paddingTop: 14,
        cursor: 'pointer'
      }}
      title="Abrir painel de preview"
    >
      <span style={{ color: ink[45], fontSize: 14 }}>⇤</span>
      <span
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          fontSize: 11,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: ink[40]
        }}
      >
        Preview
      </span>
    </div>
  )
}

/** Painel direito do workspace: preview ao vivo do manifesto e aba de export. */
export function PreviewPanel(): React.JSX.Element {
  const { rightOpen, setRightOpen, tab, setTab, target, setTarget } = useUi()

  if (!rightOpen) {
    return <CollapsedTab />
  }

  return (
    <div
      style={{
        width: 392,
        flex: 'none',
        background: colors.surfaceAlt,
        borderLeft: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* tabs */}
      <div
        style={{
          height: 46,
          flex: 'none',
          display: 'flex',
          alignItems: 'stretch',
          padding: '0 8px',
          borderBottom: `1px solid ${colors.border}`
        }}
      >
        <button onClick={() => setTab('manifesto')} style={tabStyle(tab === 'manifesto')}>
          Manifesto
        </button>
        <button onClick={() => setTab('export')} style={tabStyle(tab === 'export')}>
          Export
        </button>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setRightOpen(false)}
          title="Recolher painel"
          style={{
            alignSelf: 'center',
            width: 28,
            height: 28,
            border: 'none',
            borderRadius: 7,
            background: 'transparent',
            color: ink[45],
            cursor: 'pointer'
          }}
        >
          ⇥
        </button>
      </div>

      {tab === 'manifesto' ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 16px',
              borderBottom: `1px solid ${colors.border}`
            }}
          >
            <span style={{ fontSize: 11, fontFamily: fonts.mono, color: ink[45] }}>
              project-manifest.json
            </span>
            <span style={{ fontSize: 10.5, color: ink[35] }}>read-only · ao vivo</span>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '16px 18px' }}>
            <pre style={preStyle}>{MANIFEST_SAMPLE}</pre>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div
            style={{
              padding: '14px 16px 12px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 7,
              borderBottom: `1px solid ${colors.border}`
            }}
          >
            <button onClick={() => setTarget('claude')} style={chipStyle(target === 'claude')}>
              CLAUDE.md
            </button>
            <button onClick={() => setTarget('agents')} style={chipStyle(target === 'agents')}>
              AGENTS.md
            </button>
            <button onClick={() => setTarget('cursor')} style={chipStyle(target === 'cursor')}>
              Regras do Cursor
            </button>
            <button onClick={() => setTarget('prompt')} style={chipStyle(target === 'prompt')}>
              Bloco de prompt
            </button>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 16px',
              borderBottom: `1px solid ${colors.border}`,
              background: colors.ink
            }}
          >
            <span style={{ fontSize: 11, fontFamily: fonts.mono, color: ink[55] }}>
              {FILENAMES[target]}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '5px 11px',
                  border: `1px solid ${colors.borderStrong}`,
                  borderRadius: 7,
                  background: 'transparent',
                  color: ink[70],
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                Copiar
              </button>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '5px 11px',
                  border: 'none',
                  borderRadius: 7,
                  background: colors.bordo,
                  color: colors.offWhite,
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                Salvar no projeto
              </button>
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '16px 18px', background: colors.ink }}>
            <pre style={{ ...preStyle, color: ink[60] }}>{EXPORT_SAMPLE}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
