import { type CSSProperties } from 'react'
import { colors, fonts, ink, radius } from '../theme'
import { useUi, type TestState } from '../state/ui'
import { FauxSelect, SectionLabel } from './ui'

interface TestInfo {
  icon: string
  color: string
  text: string
}

const TEST_INFO: Partial<Record<TestState, TestInfo>> = {
  testing: { icon: '◌', color: ink[60], text: 'Verificando a chave…' },
  ok: { icon: '✓', color: colors.success, text: 'Conexão estabelecida.' },
  failed: { icon: '✕', color: colors.spark, text: 'Falhou — verifique a chave.' }
}

const labelStyle: CSSProperties = { fontSize: 12.5, fontWeight: 600, color: colors.offWhite }

export function SettingsModal(): React.JSX.Element {
  const { closeSettings, showKey, toggleShowKey, test, setTest } = useUi()

  // Simulação do teste na casca; a Fase 4 chama secrets.testConnection via IPC.
  const runTest = (): void => {
    setTest('testing')
    window.setTimeout(() => setTest('ok'), 800)
  }

  const info = TEST_INFO[test]

  return (
    <div
      style={{
        position: 'absolute',
        inset: '46px 0 0 0',
        background: 'rgba(11,10,12,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
        zIndex: 20
      }}
    >
      <div
        style={{
          width: 560,
          maxHeight: '100%',
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: radius.xl,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)'
        }}
      >
        {/* header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: `1px solid ${colors.border}`
          }}
        >
          <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: colors.offWhite }}>
            Configurações
          </h1>
          <button
            onClick={closeSettings}
            style={{
              width: 30,
              height: 30,
              border: 'none',
              borderRadius: 8,
              background: 'transparent',
              color: ink[55],
              fontSize: 16,
              cursor: 'pointer'
            }}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 26
          }}
        >
          {/* AI provider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SectionLabel>Provedor de IA</SectionLabel>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <label style={labelStyle}>Provedor</label>
              <FauxSelect value="Anthropic (Claude)" />
              <span style={{ fontSize: 11, color: ink[40] }}>
                Anthropic · OpenAI · Google (Gemini) · OpenRouter · Local (Ollama / LM Studio)
              </span>
            </div>

            {/* api key */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <label style={labelStyle}>API key</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    flex: 1,
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
                      color: ink[60]
                    }}
                  >
                    {showKey ? 'sk-ant-api03-x9Kf2…aQ' : '••••••••••••••••••••••'}
                  </span>
                  <button
                    onClick={toggleShowKey}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: ink[45],
                      fontFamily: fonts.sans,
                      fontSize: 12,
                      cursor: 'pointer'
                    }}
                  >
                    {showKey ? 'ocultar' : 'mostrar'}
                  </button>
                </div>
                <button
                  onClick={runTest}
                  style={{
                    flex: 'none',
                    padding: '11px 14px',
                    borderRadius: radius.md,
                    fontFamily: fonts.sans,
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    border: `1px solid ${colors.borderStrong}`,
                    background: colors.surface,
                    color: colors.offWhite
                  }}
                >
                  {test === 'testing' ? 'Testando…' : 'Testar conexão'}
                </button>
              </div>
              {info && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    fontSize: 12,
                    color: info.color
                  }}
                >
                  <span>{info.icon}</span>
                  <span>{info.text}</span>
                </div>
              )}
            </div>

            {/* model */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <label style={labelStyle}>Modelo</label>
              <FauxSelect value="claude-opus-4-8" />
            </div>

            {/* security note */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 9,
                padding: '12px 14px',
                border: `1px solid ${colors.border}`,
                borderRadius: radius.md,
                background: colors.ink
              }}
            >
              <span style={{ fontSize: 14, lineHeight: 1.3 }}>🔒</span>
              <p style={{ margin: 0, fontSize: 12, color: ink[60], lineHeight: 1.55 }}>
                A chave fica salva só na sua máquina (keychain do SO) e só é usada para as chamadas
                de IA que você dispara. Zero telemetria.
              </p>
            </div>
          </div>

          {/* appearance */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SectionLabel>Aparência</SectionLabel>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ fontSize: 13, color: colors.offWhite }}>Tema</label>
              <div
                style={{
                  display: 'flex',
                  padding: 3,
                  gap: 3,
                  border: `1px solid ${colors.borderField}`,
                  borderRadius: radius.md,
                  background: colors.ink
                }}
              >
                <span
                  style={{
                    padding: '6px 14px',
                    borderRadius: 7,
                    background: colors.bordo,
                    color: colors.offWhite,
                    fontSize: 12,
                    fontWeight: 600
                  }}
                >
                  Escuro
                </span>
                <span
                  style={{ padding: '6px 14px', borderRadius: 7, color: ink[45], fontSize: 12 }}
                >
                  Claro
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* footer */}
        <div
          style={{
            flex: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 10,
            padding: '16px 24px',
            borderTop: `1px solid ${colors.border}`,
            background: colors.surfaceAlt
          }}
        >
          <button
            onClick={closeSettings}
            style={{
              padding: '10px 18px',
              border: `1px solid ${colors.borderStrong}`,
              borderRadius: radius.md,
              background: 'transparent',
              color: ink[70],
              fontSize: 13,
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          <button
            onClick={closeSettings}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: radius.md,
              background: colors.bordo,
              color: colors.offWhite,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}
