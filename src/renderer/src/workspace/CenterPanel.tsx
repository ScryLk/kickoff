import { colors, fonts, ink, radius } from '../theme'
import { useApp } from '../state/ui'
import { STEPS } from './steps'
import { stepCompletion } from './completion'
import { Button } from '../components/ui'
import { StepForm } from './StepForms'

function SaveIndicator(): React.JSX.Element {
  const { saveState } = useApp()
  if (saveState === 'saving') {
    return (
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
    )
  }
  if (saveState === 'saved') {
    return (
      <>
        <span style={{ color: colors.success }}>✓</span>
        <span>salvo no disco</span>
      </>
    )
  }
  if (saveState === 'error') {
    return (
      <>
        <span style={{ color: colors.spark }}>✕</span>
        <span>erro ao salvar</span>
      </>
    )
  }
  return <span>edições não salvas</span>
}

/** Painel central do workspace: cabeçalho do passo, formulário e rodapé com auto-save. */
export function CenterPanel(): React.JSX.Element {
  const { selectedStep, setSelectedStep, manifest, validation } = useApp()
  const step = STEPS[selectedStep]
  const invalid = validation != null && !validation.valid
  const doneCount = stepCompletion(manifest).filter(Boolean).length
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
          {invalid && selectedStep === 0 && (
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

          <StepForm key={selectedStep} index={selectedStep} />
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
          <SaveIndicator />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button
            variant="secondary"
            disabled={selectedStep === 0}
            onClick={() => setSelectedStep(Math.max(0, selectedStep - 1))}
            style={{ padding: '10px 18px', opacity: selectedStep === 0 ? 0.5 : 1 }}
          >
            Anterior
          </Button>
          <Button
            variant="primary"
            disabled={selectedStep === STEPS.length - 1}
            onClick={() => setSelectedStep(Math.min(STEPS.length - 1, selectedStep + 1))}
            style={{ opacity: selectedStep === STEPS.length - 1 ? 0.5 : 1 }}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  )
}
