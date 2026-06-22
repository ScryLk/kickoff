import { colors } from '../theme'

interface MarkProps {
  /** Tamanho do lado do SVG em px. */
  size?: number
  /** Cor do "K" (off-white sobre fundo escuro por padrão). */
  stroke?: string
}

/**
 * Marca Kickoff: o "K" (base sólida) com a faísca de lançamento. Inline em SVG
 * para herdar cor e nitidez em qualquer tamanho, em vez de aproximar a marca.
 */
export function KickoffMark({ size = 22, stroke = colors.offWhite }: MarkProps): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ display: 'block' }}
      aria-label="Kickoff"
    >
      <rect x="28" y="14" width="15" height="72" rx="7" fill={stroke} />
      <path d="M41 50 L68 18" stroke={stroke} strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d="M41 50 L72 86" stroke={stroke} strokeWidth="15" strokeLinecap="round" fill="none" />
      <circle cx="71" cy="14" r="3.2" fill={colors.spark} opacity="0.85" />
      <circle cx="80" cy="8" r="6.5" fill={colors.spark} />
    </svg>
  )
}

interface LockupProps {
  /** Altura do lockup em px. */
  height?: number
}

/**
 * Lockup horizontal (marca + "kickoff"). Usa o SVG do pacote de marca servido
 * de `public/brand` para preservar a tipografia exata do wordmark.
 */
export function KickoffLockup({ height = 30 }: LockupProps): React.JSX.Element {
  return (
    <img
      src="/brand/kickoff-lockup-inverse.svg"
      alt="Kickoff"
      style={{ height, width: 'auto', display: 'block' }}
    />
  )
}
