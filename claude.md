# CLAUDE.md

Contexto do projeto para o Claude Code. Leia antes de qualquer alteração.

## O que é

**Kickoff** (nome de trabalho) é um app **desktop, local-only e open source** que guia a criação de um sistema de software através de um stepper (wizard), do planejamento até o deploy. Cada passo alimenta um **manifesto** (`project-manifest.json`): um documento canônico e portável que descreve o projeto.

O valor central não é o wizard, é o manifesto. Ele é a fonte única da verdade e é **transpilado** para os formatos que cada ferramenta de IA entende (CLAUDE.md, AGENTS.md, regras do Cursor, bloco de prompt pra colar no chat). O usuário descreve o projeto uma vez e exporta pra qualquer IA.

## Princípios inegociáveis

Estes não se negociam. Mudança aqui exige decisão explícita, não acontece de passagem.

1. **Local-only.** Nenhum dado do usuário sai da máquina. Zero telemetria, zero analytics, zero chamada de rede com dados de projeto. O app funciona 100% offline.
2. **Sem backend, sem banco de dados.** O sistema de arquivos é a persistência. O manifesto é um `project-manifest.json` na raiz do projeto-alvo, versionado no git junto com o código.
3. **Core isolado de tudo.** O motor (`src/core`) não importa Electron nem React. São funções puras: schema, validação, transpilers. Isso garante que dá pra embrulhar num CLI depois sem reescrever nada.
4. **Filesystem só pelo main.** O renderer nunca acessa `fs` direto. Tudo passa por IPC tipado para o processo main. `contextIsolation: true`, `nodeIntegration: false`.
5. **Nada de base64 no manifesto.** Logo e binários entram como caminho de arquivo (ex: `.project/logo.png`). O manifesto tem que ser leve e legível pra colar num chat sem entupir contexto.
6. **Nada de `localStorage`/`sessionStorage` para dados de projeto.** Projeto é arquivo no disco, sempre. Storage do navegador no máximo pra preferência de UI (tema, etc).
7. **Manifesto sempre validado.** Todo load e save valida contra o `manifest.schema.json`. Manifesto inválido não é salvo silenciosamente.

## Stack

- **Electron** (empacota exe + dmg)
- **Vite + React + TypeScript** no renderer
- **Ajv** para validação do manifesto contra o JSON Schema
- Sem dependência de rede em runtime

## Estrutura

```
/
├── electron/              # processo main
│   ├── main.ts            # cria a janela, ciclo de vida do app
│   ├── preload.ts         # contextBridge: expõe API segura ao renderer
│   └── ipc/               # handlers IPC (abrir pasta, ler/salvar/validar manifesto)
├── src/                   # renderer (React)
│   ├── core/              # MOTOR — zero dep de Electron/React, funções puras
│   │   ├── schema/        # manifest.schema.json + tipos TS
│   │   ├── validation/    # validação via Ajv
│   │   └── transpilers/   # manifesto -> CLAUDE.md / AGENTS.md / prompt / ...
│   ├── wizard/            # steps do stepper
│   ├── components/        # componentes de UI
│   ├── store/             # estado da aplicação
│   └── App.tsx
└── manifest.schema.json   # schema canônico (v0.1.0)
```

A regra mental: se um arquivo em `src/core` importar algo de Electron ou React, está errado.

## Comandos

Definidos após o setup inicial do projeto. Esperados:

- `npm run dev` — roda app em modo desenvolvimento (Vite + Electron com hot reload)
- `npm run build` — build de produção do renderer
- `npm run package` — gera os binários (exe / dmg)
- `npm run lint` — ESLint
- `npm run typecheck` — checagem de tipos sem emitir

Confirme os comandos reais no `package.json` antes de rodar.

## Convenções

- **TypeScript estrito.** `strict: true`, sem `any` implícito.
- **Nomenclatura:** camelCase para variáveis e funções, PascalCase para componentes e tipos, kebab-case para arquivos.
- **Código em inglês, comentários e docs em português.**
- **ESLint + Prettier.** Não brigar com o formatter.
- **Conventional Commits** (`feat:`, `fix:`, `chore:`, etc).
- **Core são funções puras.** Transpiler recebe um `ProjectManifest` e devolve `string`. Sem efeito colateral, sem I/O dentro do core. Quem lê e escreve arquivo é o processo main.

## Estado atual

- Schema do manifesto definido (`manifest.schema.json`, v0.1.0).
- Tipos TypeScript prontos (`manifest.types.ts`).
- Exemplo preenchido validado (QuestBoard).

## Próximos passos

1. Transpiler `manifesto -> CLAUDE.md` (prova o valor: entra JSON, sai contexto pronto).
2. Esqueleto Electron + Vite + React rodando (janela com hello world).
3. Primeiro step do wizard ponta a ponta (preenche `meta`, salva no disco, valida).

## Decisões já tomadas

- **Electron** em vez de Tauri: velocidade de entrega e conforto com a stack.
- **App único** por enquanto, sem monorepo. Mas o core já vive isolado em `src/core` pra facilitar virar pacote/CLI depois.
- **Manifesto é arquivo no repo**, não registro em banco. Viaja com o código, aparece no `git diff`.
- **Schema permissivo:** só `manifestVersion` e `meta.name` são obrigatórios. O wizard preenche aos poucos, o manifesto é salvável a qualquer momento.
