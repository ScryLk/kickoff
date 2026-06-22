import { type CSSProperties } from 'react'
import { colors, fonts, ink } from '../theme'
import { KickoffMark } from './Logo'
import { useApp, type Seal } from '../state/ui'

interface SealStyle {
  label: string
  dot: string
  text: string
  bg: string
  border: string
}

const SEALS: Record<Seal, SealStyle> = {
  valid: {
    label: 'Manifesto válido',
    dot: colors.success,
    text: colors.successSoft,
    bg: 'rgba(79,163,124,0.12)',
    border: 'rgba(79,163,124,0.4)'
  },
  invalid: {
    label: 'Manifesto inválido',
    dot: colors.spark,
    text: colors.sparkSoft,
    bg: 'rgba(161,46,68,0.14)',
    border: 'rgba(161,46,68,0.5)'
  },
  saved: {
    label: 'Salvo',
    dot: ink[55],
    text: ink[60],
    bg: 'rgba(243,238,232,0.06)',
    border: colors.borderField
  }
}

const gearStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  border: 'none',
  borderRadius: 8,
  background: 'transparent',
  color: ink[55],
  fontSize: 15,
  cursor: 'pointer'
}

/** Barra de título do app: marca, projeto + selo do manifesto e atalho de configurações. */
export function TitleBar(): React.JSX.Element {
  const { screen, seal, openSettings, manifest } = useApp()
  const showProjectMeta = screen === 'workspace' && manifest != null
  const s = SEALS[seal]

  return (
    <div
      style={{
        height: 46,
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px 0 14px',
        background: colors.surface,
        borderBottom: `1px solid ${colors.border}`
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <KickoffMark size={22} />
        <span
          style={{
            fontWeight: 700,
            fontSize: 13,
            color: colors.offWhite,
            letterSpacing: '-0.01em'
          }}
        >
          kickoff
        </span>
      </div>

      {showProjectMeta && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginRight: 'auto',
            marginLeft: 22
          }}
        >
          <span style={{ fontSize: 12.5, color: ink[85], fontWeight: 500 }}>
            {manifest?.meta.name}
          </span>
          <span style={{ fontSize: 11, color: ink[30] }}>·</span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '3px 9px',
              borderRadius: 20,
              background: s.bg,
              border: `1px solid ${s.border}`
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.dot }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: s.text, fontFamily: fonts.sans }}>
              {s.label}
            </span>
          </div>
        </div>
      )}

      <button
        style={gearStyle}
        onClick={openSettings}
        title="Configurações"
        aria-label="Configurações"
      >
        ⚙
      </button>
    </div>
  )
}
