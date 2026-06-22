import { type CSSProperties } from 'react'
import { colors, fonts, ink, radius } from '../theme'
import { useUi } from '../state/ui'
import { STEPS } from './steps'
import { Button, FauxSelect } from '../components/ui'
import { AiAssistButton } from './AiAssistButton'

const fieldLabel: CSSProperties = { fontSize: 13, fontWeight: 600, color: colors.offWhite }
const fieldHint: CSSProperties = { fontSize: 11.5, color: ink[40] }
const inputBase: CSSProperties = {
  width: '100%',
  padding: '11px 13px',
  borderRadius: radius.md,
  background: colors.surface,
  color: colors.offWhite,
  fontFamily: fonts.sans,
  fontSize: 13.5,
  outline: 'none'
}

function MetaForm({ invalid }: { invalid: boolean }): React.JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* nome */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <label style={{ ...fieldLabel, whiteSpace: 'nowrap' }}>Nome do projeto</label>
          <span style={{ color: colors.spark, fontSize: 13 }}>*</span>
        </div>
        <input
          defaultValue={invalid ? '' : 'kickoff'}
          placeholder="meu-projeto"
          style={{
            ...inputBase,
            border: `1px solid ${invalid ? colors.spark : colors.borderField}`
          }}
        />
        <span style={fieldHint}>Usado como identificador em todo o manifesto.</span>
      </div>

      {/* descrição */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={fieldLabel}>Descrição</label>
          <AiAssistButton />
        </div>
        <textarea
          rows={3}
          placeholder="O que o projeto faz, em uma ou duas frases."
          style={{ ...inputBase, resize: 'none', border: `1px solid ${colors.borderField}` }}
        />
        <span style={fieldHint}>Uma ou duas frases sobre o que o projeto faz.</span>
      </div>

      {/* tipo */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <label style={fieldLabel}>Tipo</label>
        <FauxSelect value="Aplicativo desktop" />
      </div>
    </div>
  )
}

function StepPlaceholder(): React.JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 16,
        padding: '48px 20px',
        border: `1px dashed ${colors.borderField}`,
        borderRadius: radius.lg
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: radius.lg,
          border: `1px solid ${colors.borderField}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: ink[40],
          fontSize: 20
        }}
      >
        ✎
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 330 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: colors.offWhite }}>
          Passo ainda não preenchido
        </span>
        <span style={{ fontSize: 12.5, color: ink[55], lineHeight: 1.55 }}>
          Comece a preencher os campos deste passo ou deixe a IA sugerir um ponto de partida.
        </span>
      </div>
      <AiAssistButton size="lg" />
    </div>
  )
}

/** Painel central do workspace: cabeçalho do passo, formulário e rodapé com auto-save. */
export function CenterPanel(): React.JSX.Element {
  const { selectedStep, seal, save } = useUi()
  const step = STEPS[selectedStep]
  const invalid = seal === 'invalid'
  const doneCount = 0
  const progressLabel = `${doneCount} de ${STEPS.length}`

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        background: colors.ink
      }}
    >
      <div style={{ flex: 1, overflowY: 'auto', padding: '34px 40px' }}>
        <div style={{ maxWidth: 560 }}>
          {invalid && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '12px 14px',
                marginBottom: 22,
                border: `1px solid ${colors.spark}`,
                borderRadius: radius.md,
                background: 'rgba(161,46,68,0.1)'
              }}
            >
              <span style={{ color: colors.spark, fontSize: 15, lineHeight: 1.2 }}>⚠</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: colors.offWhite }}>
                  Manifesto inválido
                </span>
                <span style={{ fontSize: 12, color: ink[60] }}>
                  O campo <strong style={{ color: colors.offWhite }}>Nome</strong> é obrigatório e
                  está vazio.
                </span>
              </div>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 16,
              marginBottom: 6
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: 25,
                fontWeight: 800,
                color: colors.offWhite,
                letterSpacing: '-0.02em'
              }}
            >
              {step.label}
            </h1>
            <span
              style={{
                flex: 'none',
                fontSize: 11,
                color: ink[40],
                fontFamily: fonts.mono,
                paddingTop: 8
              }}
            >
              {progressLabel}
            </span>
          </div>
          <p style={{ margin: '0 0 28px', fontSize: 14, color: ink[55], lineHeight: 1.55 }}>
            {step.description}
          </p>

          {selectedStep === 0 ? <MetaForm invalid={invalid} /> : <StepPlaceholder />}
        </div>
      </div>

      {/* footer */}
      <div
        style={{
          height: 60,
          flex: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          borderTop: `1px solid ${colors.border}`,
          background: colors.surfaceAlt
        }}
      >
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: ink[55] }}
        >
          {save === 'saving' ? (
            <>
              <span
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: '50%',
                  border: `2px solid ${colors.borderStrong}`,
                  borderTopColor: colors.spark,
                  display: 'inline-block',
                  animation: 'ko-spin .7s linear infinite'
                }}
              />
              <span>salvando…</span>
            </>
          ) : (
            <>
              <span style={{ color: colors.success }}>✓</span>
              <span>salvo no disco</span>
            </>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" style={{ padding: '10px 18px' }}>
            Anterior
          </Button>
          <Button variant="primary">Próximo</Button>
        </div>
      </div>
    </div>
  )
}
