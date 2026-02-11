/**
 * Generates a short random id suitable for blocks and notes.
 * Uses crypto.randomUUID when available, falls back to a timestamp + random.
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Fallback: timestamp + random hex
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
