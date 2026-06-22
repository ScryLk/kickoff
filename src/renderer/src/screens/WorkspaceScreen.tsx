import { Stepper } from '../workspace/Stepper'
import { CenterPanel } from '../workspace/CenterPanel'
import { PreviewPanel } from '../workspace/PreviewPanel'

/** Tela do wizard: stepper à esquerda, passo atual no centro, preview à direita. */
export function WorkspaceScreen(): React.JSX.Element {
  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      <Stepper />
      <CenterPanel />
      <PreviewPanel />
    </div>
  )
}
