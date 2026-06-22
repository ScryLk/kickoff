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

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  disabled?: boolean
}

/** Select nativo estilizado na marca. */
export function Select({ value, options, onChange, disabled }: SelectProps): React.JSX.Element {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          appearance: 'none',
          WebkitAppearance: 'none',
          padding: '11px 30px 11px 13px',
          border: `1px solid ${colors.borderField}`,
          borderRadius: radius.md,
          background: colors.ink,
          color: disabled ? ink[40] : colors.offWhite,
          fontFamily: fonts.sans,
          fontSize: 13,
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none'
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: colors.surface }}>
            {o.label}
          </option>
        ))}
      </select>
      <span
        style={{
          position: 'absolute',
          right: 13,
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: ink[45],
          fontSize: 11
        }}
      >
        ▾
      </span>
    </div>
  )
}

/** "Select" visual (somente exibição). */
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
