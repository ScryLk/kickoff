import { useState, type CSSProperties } from 'react'
import { colors, fonts, ink, radius } from '../theme'

const labelStyle: CSSProperties = { fontSize: 13, fontWeight: 600, color: colors.offWhite }
const hintStyle: CSSProperties = { fontSize: 11.5, color: ink[40] }
const inputBase: CSSProperties = {
  width: '100%',
  padding: '11px 13px',
  borderRadius: radius.md,
  background: colors.surface,
  color: colors.offWhite,
  fontFamily: fonts.sans,
  fontSize: 13.5,
  border: `1px solid ${colors.borderField}`,
  outline: 'none'
}

interface FieldProps {
  label: string
  hint?: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
}

/** Campo de texto de uma linha. */
export function TextField({
  label,
  hint,
  value,
  placeholder,
  onChange
}: FieldProps): React.JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={labelStyle}>{label}</label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={inputBase}
      />
      {hint && <span style={hintStyle}>{hint}</span>}
    </div>
  )
}

interface TextAreaProps extends FieldProps {
  rows?: number
}

/** Campo de texto multilinha. */
export function TextAreaField({
  label,
  hint,
  value,
  placeholder,
  rows = 3,
  onChange
}: TextAreaProps): React.JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={labelStyle}>{label}</label>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...inputBase, resize: 'vertical' }}
      />
      {hint && <span style={hintStyle}>{hint}</span>}
    </div>
  )
}

interface ListFieldProps {
  label: string
  hint?: string
  items: string[]
  placeholder?: string
  onChange: (items: string[]) => void
}

/** Lista de itens, um por linha. Guarda o texto bruto enquanto edita. */
export function ListField({
  label,
  hint,
  items,
  placeholder,
  onChange
}: ListFieldProps): React.JSX.Element {
  const [text, setText] = useState(items.join('\n'))

  const handle = (raw: string): void => {
    setText(raw)
    onChange(
      raw
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={labelStyle}>{label}</label>
      <textarea
        value={text}
        rows={4}
        placeholder={placeholder}
        onChange={(e) => handle(e.target.value)}
        style={{ ...inputBase, resize: 'vertical' }}
      />
      <span style={hintStyle}>{hint ?? 'Um item por linha.'}</span>
    </div>
  )
}
