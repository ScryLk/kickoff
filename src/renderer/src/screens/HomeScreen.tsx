import { colors, fonts, ink, radius } from '../theme'
import { KickoffMark } from '../components/Logo'
import { Button } from '../components/ui'
import { useApp } from '../state/ui'

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function HomeScreen(): React.JSX.Element {
  const { openFolder, openRecent, openSettings, recents } = useApp()

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* hero */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 48,
            gap: 28
          }}
        >
          <KickoffMark size={88} />
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 30,
                fontWeight: 800,
                color: colors.offWhite,
                letterSpacing: '-0.02em'
              }}
            >
              Kickoff
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: ink[55], maxWidth: 340, lineHeight: 1.5 }}>
              Planeje seu projeto de software e gere os arquivos de contexto para qualquer IA.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
            <Button
              variant="primary"
              onClick={() => void openFolder()}
              style={{ padding: '12px 20px' }}
            >
              <span style={{ fontSize: 15 }}>＋</span> Novo projeto
            </Button>
            <Button
              variant="secondary"
              onClick={() => void openFolder()}
              style={{ padding: '12px 20px' }}
            >
              <span style={{ fontSize: 15, opacity: 0.8 }}>⊞</span> Abrir pasta…
            </Button>
          </div>
          <p style={{ margin: 0, fontSize: 11.5, color: ink[35] }}>
            Escolha uma pasta que contenha{' '}
            <span style={{ fontFamily: fonts.mono }}>project-manifest.json</span>
          </p>
        </div>

        {/* recents */}
        <div
          style={{
            width: 360,
            flex: 'none',
            borderLeft: `1px solid ${colors.border}`,
            background: colors.surfaceAlt,
            display: 'flex',
            flexDirection: 'column',
            padding: '26px 24px'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 16
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: ink[45]
              }}
            >
              Projetos recentes
            </h2>
          </div>
          {recents.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recents.map((r) => (
                <button
                  key={r.path}
                  onClick={() => void openRecent(r.path)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    padding: '12px 14px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: radius.md,
                    background: colors.surface,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: colors.offWhite }}>
                    {r.name}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: ink[45],
                      fontFamily: fonts.mono,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {r.path}
                  </span>
                  <span style={{ fontSize: 10.5, color: ink[35], marginTop: 2 }}>
                    {formatDate(r.openedAt)}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: 10,
                padding: '30px 10px',
                border: `1px dashed ${colors.borderField}`,
                borderRadius: radius.md
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: radius.md,
                  border: `1px solid ${colors.borderField}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: ink[35]
                }}
              >
                ⊞
              </div>
              <p style={{ margin: 0, fontSize: 12.5, color: ink[45], lineHeight: 1.5 }}>
                Nenhum projeto recente.
                <br />
                Abra uma pasta ou crie um novo.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* footer */}
      <div
        style={{
          height: 40,
          flex: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          borderTop: `1px solid ${colors.border}`,
          background: colors.surfaceAlt,
          fontSize: 11.5,
          color: ink[40]
        }}
      >
        <span style={{ fontFamily: fonts.mono }}>v0.1.0</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{ cursor: 'pointer', color: ink[55] }}>open source ↗</span>
          <span
            onClick={openSettings}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
          >
            ⚙ Configurações
          </span>
        </div>
      </div>
    </div>
  )
}
