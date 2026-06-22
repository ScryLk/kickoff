import { colors, fonts, ink, radius } from '../theme'
import { KickoffLockup } from '../components/Logo'
import { Button, FauxSelect } from '../components/ui'
import { useUi } from '../state/ui'

/** Onboarding opcional: conectar um provedor de IA antes de começar. */
export function OnboardingScreen(): React.JSX.Element {
  const { setScreen } = useUi()

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        background: 'radial-gradient(circle at 50% 35%, #211E25 0%, #17151A 60%)'
      }}
    >
      <div
        style={{
          width: 480,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: radius.xl,
          padding: '34px 34px 26px',
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
          boxShadow: '0 24px 64px rgba(0,0,0,0.45)'
        }}
      >
        <KickoffLockup height={30} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 22, height: 4, borderRadius: 3, background: colors.bordo }} />
          <span style={{ width: 22, height: 4, borderRadius: 3, background: colors.spark }} />
          <span style={{ width: 22, height: 4, borderRadius: 3, background: colors.borderField }} />
          <span
            style={{ marginLeft: 'auto', fontSize: 11, color: ink[40], fontFamily: fonts.mono }}
          >
            passo 2 de 3
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 800,
              color: colors.offWhite,
              letterSpacing: '-0.02em'
            }}
          >
            Conecte um provedor de IA
          </h1>
          <p style={{ margin: 0, fontSize: 13.5, color: ink[60], lineHeight: 1.55 }}>
            Opcional, mas habilita os botões de “me ajuda a preencher”. Você pode configurar depois
            em Configurações.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: colors.offWhite }}>
            Provedor
          </label>
          <FauxSelect value="Anthropic (Claude)" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: colors.offWhite }}>API key</label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0 13px',
              border: `1px solid ${colors.borderField}`,
              borderRadius: radius.md,
              background: colors.ink
            }}
          >
            <span
              style={{
                flex: 1,
                padding: '11px 0',
                fontFamily: fonts.mono,
                fontSize: 13,
                color: ink[45]
              }}
            >
              ••••••••••••••••••••••
            </span>
            <span style={{ color: ink[45], fontSize: 12, cursor: 'pointer' }}>mostrar</span>
          </div>
          <span style={{ fontSize: 11, color: ink[45], lineHeight: 1.5 }}>
            🔒 A chave fica só na sua máquina (keychain do SO). Zero telemetria.
          </span>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
          <Button
            variant="secondary"
            onClick={() => setScreen('workspace')}
            style={{ flex: 'none' }}
          >
            Pular
          </Button>
          <Button
            variant="primary"
            onClick={() => setScreen('workspace')}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  )
}
