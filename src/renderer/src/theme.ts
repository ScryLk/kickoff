/**
 * Tokens da marca Kickoff. Fonte única de cores, fontes e raios usados pela UI.
 * Derivado do pacote de marca (conceito "K": base sólida + faísca de lançamento).
 */

export const colors = {
  /** Fundo da "tela" externa, mais escuro que o ink. */
  canvas: '#0B0A0C',
  /** Preto / ink — fundo principal e texto sobre claro. */
  ink: '#17151A',
  /** Surface — barras, painéis e cartões. */
  surface: '#211E25',
  /** Surface alternativa, levemente diferente do ink. */
  surfaceAlt: '#1B191F',
  /** Off-white — texto e marca sobre fundo escuro. */
  offWhite: '#F3EEE8',
  /** Bordô — cor primária / acentos. */
  bordo: '#7A1E2D',
  /** Bordô profundo — variação sóbria / hover. */
  bordoDeep: '#5A1521',
  /** Faísca — o ponto de "launch" no ícone, acento vivo. */
  spark: '#A12E44',
  /** Faísca clara — texto de acento sobre fundo escuro. */
  sparkSoft: '#E59AAA',
  /** Borda padrão. */
  border: '#2A2730',
  /** Borda de campos de formulário. */
  borderField: '#322E38',
  /** Borda mais clara (botões secundários). */
  borderStrong: '#3A3640',
  /** Verde de sucesso (selo válido, salvo). */
  success: '#4FA37C',
  /** Verde de sucesso claro (texto). */
  successSoft: '#9FD4B5'
} as const

/** Níveis de opacidade do off-white para texto secundário. */
export const ink = {
  /** Texto primário. */
  100: colors.offWhite,
  85: 'rgba(243,238,232,0.85)',
  70: 'rgba(243,238,232,0.7)',
  60: 'rgba(243,238,232,0.6)',
  55: 'rgba(243,238,232,0.55)',
  45: 'rgba(243,238,232,0.45)',
  40: 'rgba(243,238,232,0.4)',
  35: 'rgba(243,238,232,0.35)',
  30: 'rgba(243,238,232,0.3)'
} as const

export const fonts = {
  sans: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
} as const

export const radius = {
  sm: '7px',
  md: '9px',
  lg: '12px',
  xl: '16px',
  pill: '20px'
} as const
