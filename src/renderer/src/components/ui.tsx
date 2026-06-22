import { type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react'
import { colors, fonts, ink, radius } from '../theme'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

const buttonBase: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 9,
  borderRadius: radius.md,
  fontFamily: fonts.sans,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer'
}

const variants: Record<Variant, CSSProperties> = {
  primary: {
    padding: '10px 20px',
    border: 'none',
    background: colors.bordo,
    color: colors.offWhite
  },
  secondary: {
    padding: '10px 18px',
    border: `1px solid ${colors.borderStrong}`,
    background: 'transparent',
    color: ink[70]
  },
  ghost: {
    padding: '10px 12px',
    border: `1px solid ${colors.border}`,
    background: 'transparent',
    color: ink[60]
  }
}

/** Botão da marca, com variantes primária, secundária e fantasma. */
export function Button({
  variant = 'primary',
  style,
  children,
  ...rest
}: ButtonProps): React.JSX.Element {
  return (
    <button style={{ ...buttonBase, ...variants[variant], ...style }} {...rest}>
      {children}
    </button>
  )
}

/** Rótulo de seção em caixa alta, usado em painéis e no modal. */
export function SectionLabel({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: ink[45]
      }}
    >
      {children}
    </span>
  )
}

/** "Select" visual (somente exibição; a interação real chega na Fase 4). */
export function FauxSelect({ value }: { value: string }): React.JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '11px 13px',
        border: `1px solid ${colors.borderField}`,
        borderRadius: radius.md,
        background: colors.ink,
        color: colors.offWhite,
        fontSize: 13
      }}
    >
      <span>{value}</span>
      <span style={{ color: ink[45], fontSize: 11 }}>▾</span>
    </div>
  )
}
