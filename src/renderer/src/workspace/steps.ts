/** Definição estática dos passos do wizard. */
export interface StepDef {
  /** Rótulo curto exibido no stepper. */
  label: string
  /** Subtítulo no stepper. */
  sub: string
  /** Descrição exibida no topo do passo. */
  description: string
}

/** Os seis passos do wizard, na ordem. */
export const STEPS: StepDef[] = [
  {
    label: 'Meta',
    sub: 'Nome, descrição, tipo',
    description:
      'Informações básicas do projeto. Só o nome é obrigatório — o manifesto pode ser salvo a qualquer momento.'
  },
  {
    label: 'Stack',
    sub: 'Linguagens, frameworks',
    description: 'Liste as linguagens, frameworks e bibliotecas principais que o projeto usa.'
  },
  {
    label: 'Estrutura',
    sub: 'Pastas e módulos',
    description: 'Descreva a organização de pastas e módulos do código.'
  },
  {
    label: 'Convenções',
    sub: 'Estilo, commits',
    description: 'Defina estilo de código e padrão de mensagens de commit.'
  },
  {
    label: 'Princípios',
    sub: 'Regras inegociáveis',
    description: 'Regras inegociáveis que toda contribuição precisa respeitar.'
  },
  {
    label: 'Próximos passos',
    sub: 'Roadmap inicial',
    description: 'O roadmap inicial: o que vem logo depois do kickoff.'
  }
]
