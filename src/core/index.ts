/**
 * `src/core` é o motor puro do Kickoff.
 *
 * Regra inegociável: nada aqui importa Electron ou React. São apenas schema,
 * tipos, validação (Ajv) e transpilers (ProjectManifest -> string, sem I/O).
 * Isso permite embrulhar o core num CLI depois sem reescrever nada.
 */

export * from './schema'
