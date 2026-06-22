import Ajv, { type ErrorObject, type ValidateFunction } from 'ajv'
import { manifestSchema, type ProjectManifest } from '../schema'

/** Erro de validação estruturado, independente de detalhes do Ajv. */
export interface ManifestValidationError {
  /** Caminho da instância onde o erro ocorreu (ex.: `/meta/name`). */
  path: string
  /** Mensagem legível do erro. */
  message: string
  /** Palavra-chave do schema que falhou (ex.: `required`, `type`). */
  keyword: string
  /** Parâmetros adicionais do erro (ex.: a propriedade ausente). */
  params: Record<string, unknown>
}

/** Resultado da validação de um manifesto. */
export interface ManifestValidationResult {
  /** `true` se o dado é um ProjectManifest válido. */
  valid: boolean
  /** Lista de erros; vazia quando `valid` é `true`. */
  errors: ManifestValidationError[]
}

const ajv = new Ajv({ allErrors: true, strict: false })
const validateFn: ValidateFunction = ajv.compile(manifestSchema)

function toValidationError(error: ErrorObject): ManifestValidationError {
  return {
    path: error.instancePath || '/',
    message: error.message ?? 'erro de validação',
    keyword: error.keyword,
    params: error.params as Record<string, unknown>
  }
}

/**
 * Valida um dado arbitrário contra o schema do manifesto.
 *
 * Função pura: não lança, não faz I/O. Retorna sempre um resultado estruturado.
 */
export function validateManifest(data: unknown): ManifestValidationResult {
  const valid = validateFn(data)
  if (valid) {
    return { valid: true, errors: [] }
  }
  const errors = (validateFn.errors ?? []).map(toValidationError)
  return { valid: false, errors }
}

/**
 * Erro lançado por {@link assertValidManifest} quando o manifesto é inválido.
 */
export class ManifestValidationFailed extends Error {
  constructor(public readonly errors: ManifestValidationError[]) {
    const summary = errors.map((e) => `${e.path} ${e.message}`).join('; ')
    super(`manifesto inválido: ${summary}`)
    this.name = 'ManifestValidationFailed'
  }
}

/**
 * Valida e retorna o dado tipado como ProjectManifest, lançando
 * {@link ManifestValidationFailed} se for inválido.
 *
 * Útil na fronteira do main: nada inválido é salvo ou carregado em silêncio.
 */
export function assertValidManifest(data: unknown): ProjectManifest {
  const result = validateManifest(data)
  if (!result.valid) {
    throw new ManifestValidationFailed(result.errors)
  }
  return data as ProjectManifest
}
