import { useState, type CSSProperties } from 'react'
import { colors, fonts, ink } from '../theme'
import { useApp } from '../state/ui'

interface AiAssistButtonProps {
  /** Tamanho do botão. */
  size?: 'sm' | 'lg'
  /** Ação de assistência; recebe o helper `suggest` do store. */
  onRun?: (suggest: ReturnType<typeof useApp>['suggest']) => Promise<void>
}

/**
 * Botão "me ajuda a preencher". Fica DESABILITADO com tooltip quando não há
 * provedor/chave configurado — a assistência por IA é opt-in e explícita.
 */
export function AiAssistButton({ size = 'sm', onRun }: AiAssistButtonProps): React.JSX.Element {
  const { aiConfigured, suggest } = useApp()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)

  const disabled = !aiConfigured || busy
  const tip = !aiConfigured
    ? 'Configure um provedor em Configurações'
    : error
      ? 'Falhou — tente de novo'
      : 'Sugerir com IA'

  const handleClick = async (): Promise<void> => {
    if (!onRun || !aiConfigured) return
    setBusy(true)
    setError(false)
    try {
      await onRun(suggest)
    } catch {
      setError(true)
    } finally {
      setBusy(false)
    }
  }

  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    borderRadius: 7,
    fontFamily: fonts.sans,
    fontWeight: 500,
    ...(size === 'lg'
      ? { padding: '9px 16px', fontSize: 13 }
      : { padding: '5px 11px', fontSize: 11.5 }),
    ...(disabled
      ? {
          border: `1px solid ${colors.border}`,
          background: 'transparent',
          color: ink[35],
          cursor: 'not-allowed'
        }
      : {
          border: `1px solid ${error ? colors.spark : 'rgba(161,46,68,0.5)'}`,
          background: 'rgba(161,46,68,0.12)',
          color: colors.sparkSoft,
          cursor: 'pointer'
        })
  }

  return (
    <button style={base} disabled={disabled} title={tip} onClick={() => void handleClick()}>
      <span style={{ fontSize: size === 'lg' ? 13 : 12 }}>✦</span>
      {busy ? 'gerando…' : 'me ajuda a preencher'}
    </button>
  )
}
