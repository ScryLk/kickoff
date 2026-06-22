import { useState, type CSSProperties } from 'react'
import { getTranspiler } from '@core/transpilers'
import { colors, fonts, ink } from '../theme'
import { useApp, type ExportTarget } from '../state/ui'

// Mapeia cada alvo da UI a um transpiler do core. Só CLAUDE.md existe hoje;
// os demais ficam pendentes até o core ganhar seus transpilers.
const TARGETS: Record<
  ExportTarget,
  { label: string; transpilerId: string | null; filename: string }
> = {
  claude: { label: 'CLAUDE.md', transpilerId: 'claude-md', filename: 'CLAUDE.md' },
  agents: { label: 'AGENTS.md', transpilerId: null, filename: 'AGENTS.md' },
  cursor: { label: 'Regras do Cursor', transpilerId: null, filename: '.cursor/rules' },
  prompt: { label: 'Bloco de prompt', transpilerId: null, filename: 'prompt-block.txt' }
}

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

const smallBtn = (primary: boolean): CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: 5,
  padding: '5px 11px',
  borderRadius: 7,
  fontSize: 12,
  cursor: 'pointer',
  ...(primary
    ? { border: 'none', background: colors.bordo, color: colors.offWhite }
    : { border: `1px solid ${colors.borderStrong}`, background: 'transparent', color: ink[70] })
})

function CollapsedTab(): React.JSX.Element {
  const { setRightOpen } = useApp()
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

function ExportTabBody(): React.JSX.Element {
  const { manifest, projectDir, target, setTarget } = useApp()
  const [copied, setCopied] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)

  const def = TARGETS[target]
  const transpiler = def.transpilerId ? getTranspiler(def.transpilerId) : undefined
  const content =
    transpiler && manifest
      ? transpiler.transpile(manifest)
      : `# ${def.label}\n\nTranspiler em desenvolvimento — disponível em breve.`
  const canExport = Boolean(transpiler && manifest && projectDir)

  const onCopy = async (): Promise<void> => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  const onSave = async (): Promise<void> => {
    if (!projectDir || !transpiler) return
    const result = await window.kickoff.project.writeArtifact(projectDir, def.filename, content)
    setSaveMsg(result.saved ? 'salvo ✓' : `erro: ${result.error ?? 'falhou'}`)
    window.setTimeout(() => setSaveMsg(null), 2500)
  }

  return (
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
        {(Object.keys(TARGETS) as ExportTarget[]).map((key) => (
          <button key={key} onClick={() => setTarget(key)} style={chipStyle(target === key)}>
            {TARGETS[key].label}
          </button>
        ))}
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
          {saveMsg ?? def.filename}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => void onCopy()} style={smallBtn(false)}>
            {copied ? 'copiado ✓' : 'Copiar'}
          </button>
          <button
            onClick={() => void onSave()}
            disabled={!canExport}
            style={{
              ...smallBtn(true),
              opacity: canExport ? 1 : 0.45,
              cursor: canExport ? 'pointer' : 'not-allowed'
            }}
          >
            Salvar no projeto
          </button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 18px', background: colors.ink }}>
        <pre style={{ ...preStyle, color: ink[60] }}>{content}</pre>
      </div>
    </div>
  )
}

/** Painel direito do workspace: preview ao vivo do manifesto e aba de export. */
export function PreviewPanel(): React.JSX.Element {
  const { rightOpen, setRightOpen, tab, setTab, manifest } = useApp()

  if (!rightOpen) {
    return <CollapsedTab />
  }

  const manifestJson = manifest ? JSON.stringify(manifest, null, 2) : '{}'

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
            <pre style={preStyle}>{manifestJson}</pre>
          </div>
        </div>
      ) : (
        <ExportTabBody />
      )}
    </div>
  )
}
