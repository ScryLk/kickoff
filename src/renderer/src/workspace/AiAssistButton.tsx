import { type CSSProperties } from 'react'
import { colors, fonts, ink } from '../theme'
import { useApp } from '../state/ui'

interface AiAssistButtonProps {
  /** Tamanho do botão. */
  size?: 'sm' | 'lg'
}

/**
 * Botão "me ajuda a preencher". Fica DESABILITADO com tooltip quando não há
 * provedor/chave configurado — a assistência por IA é opt-in e explícita.
 */
export function AiAssistButton({ size = 'sm' }: AiAssistButtonProps): React.JSX.Element {
  const { aiConfigured } = useApp()
  const disabled = !aiConfigured
  const tip = disabled ? 'Configure um provedor em Configurações' : 'Sugerir com IA'

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
          border: '1px solid rgba(161,46,68,0.5)',
          background: 'rgba(161,46,68,0.12)',
          color: colors.sparkSoft,
          cursor: 'pointer'
        })
  }

  return (
    <button style={base} disabled={disabled} title={tip}>
      <span style={{ fontSize: size === 'lg' ? 13 : 12 }}>✦</span> me ajuda a preencher
    </button>
  )
}
