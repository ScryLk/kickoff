# Kickoff

App **desktop, local-only e open source** que guia a criação de um sistema de
software através de um wizard, do planejamento ao deploy. Cada passo alimenta um
**manifesto** (`project-manifest.json`): um documento canônico e portável que
descreve o projeto e é **transpilado** para os formatos que cada ferramenta de
IA entende (`CLAUDE.md`, `AGENTS.md`, regras do Cursor, bloco de prompt).

> Leia o [`CLAUDE.md`](./CLAUDE.md) antes de qualquer alteração. Os "Princípios
> inegociáveis" descritos lá são intransponíveis.

## Princípios

- **Local-only.** Zero telemetria, zero analytics. Funciona 100% offline. A
  única exceção são as chamadas de IA, explícitas e opt-in, com a chave do
  próprio usuário.
- **Sem backend, sem banco.** O sistema de arquivos é a persistência.
- **Core isolado.** `src/core` é motor puro: schema, validação e transpilers.
  Não importa Electron nem React.
- **Filesystem só pelo `main`.** O renderer nunca toca `fs`; tudo passa por IPC
  tipado. `contextIsolation: true`, `nodeIntegration: false`.

## Stack

Electron + electron-vite, React + TypeScript no renderer, Ajv para validação do
manifesto, Vitest para testar o core.

## Estrutura

```
src/
├── main/        # processo Node — único que toca fs (IPC tipado)
├── preload/     # contextBridge: expõe API segura ao renderer
├── renderer/    # UI React
└── core/        # MOTOR — funções puras, zero dep de Electron/React
    ├── schema/        # manifest.schema.json + tipos TS
    ├── validation/    # validação via Ajv
    └── transpilers/   # manifesto -> CLAUDE.md / AGENTS.md / prompt / ...
```

## Comandos

```bash
npm run dev        # app em modo desenvolvimento (Vite + Electron)
npm run build      # build de produção (typecheck + electron-vite build)
npm run test       # testes do core (Vitest)
npm run typecheck  # checagem de tipos sem emitir
npm run lint       # ESLint
npm run format     # Prettier
npm run build:win  # / build:mac / build:linux — gera binários
```
