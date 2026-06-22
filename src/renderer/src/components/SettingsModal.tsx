import { useState, type CSSProperties } from 'react'
import { colors, fonts, ink, radius } from '../theme'
import { useApp } from '../state/ui'
import { PROVIDERS, PROVIDER_LIST, type ProviderId } from '@shared/providers'
import { Select, SectionLabel } from './ui'

const labelStyle: CSSProperties = { fontSize: 12.5, fontWeight: 600, color: colors.offWhite }

function testColor(test: string): string {
  if (test === 'ok') return colors.success
  if (test === 'failed') return colors.spark
  return ink[60]
}

function testIcon(test: string): string {
  if (test === 'ok') return '✓'
  if (test === 'failed') return '✕'
  return '◌'
}

export function SettingsModal(): React.JSX.Element {
  const {
    closeSettings,
    showKey,
    toggleShowKey,
    test,
    testMessage,
    providerConfig,
    hasKey,
    setProvider,
    saveApiKey,
    clearApiKey,
    runTest
  } = useApp()

  const provider: ProviderId = providerConfig?.provider ?? 'anthropic'
  const info = PROVIDERS[provider]
  const [keyInput, setKeyInput] = useState('')

  const onSaveKey = async (): Promise<void> => {
    if (!keyInput.trim()) return
    await saveApiKey(keyInput.trim())
    setKeyInput('')
  }

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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SectionLabel>Provedor de IA</SectionLabel>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <label style={labelStyle}>Provedor</label>
              <Select
                value={provider}
                options={PROVIDER_LIST.map((p) => ({ value: p.id, label: p.label }))}
                onChange={(v) => void setProvider(v as ProviderId)}
              />
            </div>

            {info.requiresApiKey ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <label style={labelStyle}>API key</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder={hasKey ? '•••••••••• (chave salva)' : 'cole sua API key'}
                    style={{
                      flex: 1,
                      padding: '11px 13px',
                      border: `1px solid ${colors.borderField}`,
                      borderRadius: radius.md,
                      background: colors.ink,
                      color: colors.offWhite,
                      fontFamily: fonts.mono,
                      fontSize: 13,
                      outline: 'none'
                    }}
                  />
                  <button onClick={toggleShowKey} style={pillBtn}>
                    {showKey ? 'ocultar' : 'mostrar'}
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => void onSaveKey()}
                    disabled={!keyInput.trim()}
                    style={primaryBtn(!keyInput.trim())}
                  >
                    Salvar chave
                  </button>
                  <button onClick={() => void runTest()} disabled={!hasKey} style={pillBtn}>
                    {test === 'testing' ? 'Testando…' : 'Testar conexão'}
                  </button>
                  {hasKey && (
                    <button onClick={() => void clearApiKey()} style={pillBtn}>
                      Remover chave
                    </button>
                  )}
                </div>
                {test !== 'idle' && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                      fontSize: 12,
                      color: testColor(test)
                    }}
                  >
                    <span>{testIcon(test)}</span>
                    <span>{testMessage}</span>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 12, color: ink[55] }}>
                  Provedor local não usa API key. Verifique se o servidor está rodando.
                </span>
                <button onClick={() => void runTest()} style={pillBtn}>
                  {test === 'testing' ? 'Testando…' : 'Testar conexão'}
                </button>
                {test !== 'idle' && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                      fontSize: 12,
                      color: testColor(test)
                    }}
                  >
                    <span>{testIcon(test)}</span>
                    <span>{testMessage}</span>
                  </div>
                )}
              </div>
            )}

            {info.models.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <label style={labelStyle}>Modelo</label>
                <Select
                  value={providerConfig?.model ?? info.models[0]}
                  options={info.models.map((m) => ({ value: m, label: m }))}
                  onChange={(v) => void setProvider(provider, v)}
                />
              </div>
            )}

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
        </div>

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
          <button onClick={closeSettings} style={primaryBtn(false)}>
            Concluído
          </button>
        </div>
      </div>
    </div>
  )
}

const pillBtn: CSSProperties = {
  padding: '8px 13px',
  borderRadius: radius.md,
  border: `1px solid ${colors.borderStrong}`,
  background: colors.surface,
  color: ink[70],
  fontFamily: fonts.sans,
  fontSize: 12.5,
  cursor: 'pointer'
}

function primaryBtn(disabled: boolean): CSSProperties {
  return {
    padding: '8px 16px',
    borderRadius: radius.md,
    border: 'none',
    background: colors.bordo,
    color: colors.offWhite,
    fontFamily: fonts.sans,
    fontSize: 12.5,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1
  }
}
