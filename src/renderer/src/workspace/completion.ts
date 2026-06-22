import { type ProjectManifest } from '@core/schema'

/**
 * Marca, por passo do wizard, se já há conteúdo suficiente no manifesto.
 * Por enquanto só o passo Meta é editável; os demais ficam pendentes.
 */
export function stepCompletion(manifest: ProjectManifest | null): boolean[] {
  if (!manifest) {
    return [false, false, false, false, false, false]
  }
  const { meta, stack, architecture, conventions, nextSteps } = manifest
  return [
    Boolean(meta.name?.trim() && meta.description?.trim()),
    hasAny(stack),
    Boolean(architecture?.structure?.trim()),
    hasAny(conventions),
    Boolean(architecture?.principles?.length),
    Boolean(nextSteps?.length)
  ]
}

function hasAny(obj: object | undefined): boolean {
  if (!obj) return false
  return Object.values(obj).some((v) =>
    Array.isArray(v) ? v.length > 0 : typeof v === 'string' ? v.trim().length > 0 : v != null
  )
}
