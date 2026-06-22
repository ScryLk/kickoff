import { type CSSProperties } from 'react'
import { colors, fonts, ink, radius } from '../theme'
import { useApp } from '../state/ui'
import { STEPS } from './steps'
import { stepCompletion } from './completion'

const badgeBase: CSSProperties = {
  flex: 'none',
  width: 25,
  height: 25,
  borderRadius: radius.sm,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 12,
  fontWeight: 600
}

/** Coluna esquerda do workspace: progresso + lista de passos. */
export function Stepper(): React.JSX.Element {
  const { selectedStep, setSelectedStep, openSettings, manifest } = useApp()

  const completed = stepCompletion(manifest)
  const doneCount = completed.filter(Boolean).length
  const progressLabel = `${doneCount} de ${STEPS.length}`
  const progressPct = `${Math.round((doneCount / STEPS.length) * 100)}%`

  return (
    <div
      style={{
        width: 264,
        flex: 'none',
        background: colors.surfaceAlt,
        borderRight: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ padding: '20px 20px 16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: ink[45]
            }}
          >
            Progresso
          </span>
          <span style={{ fontSize: 11, color: ink[55], fontFamily: fonts.mono }}>
            {progressLabel}
          </span>
        </div>
        <div style={{ height: 5, borderRadius: 4, background: colors.border, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              borderRadius: 4,
              background: colors.bordo,
              width: progressPct
            }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 12px' }}>
        {STEPS.map((step, i) => {
          const firstIncomplete = completed.findIndex((c) => !c)
          const status = completed[i] ? 'done' : i === firstIncomplete ? 'current' : 'pending'
          const selected = i === selectedStep

          const badgeStyle: CSSProperties =
            status === 'done'
              ? { ...badgeBase, background: colors.bordo, color: colors.offWhite }
              : status === 'current'
                ? {
                    ...badgeBase,
                    background: 'transparent',
                    border: `1.5px solid ${colors.spark}`,
                    color: colors.offWhite
                  }
                : { ...badgeBase, background: colors.border, color: ink[40] }

          const labelColor = status === 'pending' && !selected ? ink[55] : colors.offWhite

          return (
            <div
              key={step.label}
              onClick={() => setSelectedStep(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                padding: '9px 11px',
                borderRadius: radius.md,
                cursor: 'pointer',
                marginBottom: 2,
                background: selected ? 'rgba(161,46,68,0.16)' : 'transparent',
                boxShadow: selected ? 'inset 0 0 0 1px rgba(161,46,68,0.45)' : 'none'
              }}
            >
              <div style={badgeStyle}>{status === 'done' ? '✓' : String(i + 1)}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: labelColor,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {step.label}
                </span>
                <span
                  style={{
                    fontSize: 10.5,
                    color: ink[40],
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {step.sub}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ padding: 12, borderTop: `1px solid ${colors.border}` }}>
        <button
          onClick={openSettings}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            padding: '10px 12px',
            border: `1px solid ${colors.border}`,
            borderRadius: radius.md,
            background: 'transparent',
            color: ink[70],
            fontSize: 13,
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: 15 }}>⚙</span> Configurações
        </button>
      </div>
    </div>
  )
}
