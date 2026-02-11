/**
 * Compile-time exhaustiveness guard.
 *
 * Place in the `default` branch of a switch over a discriminated union.
 * If every member is handled, TypeScript narrows the type to `never` and
 * this compiles.  If a new member is added but not handled, TypeScript
 * produces a type error on this call — catching the gap at build time.
 *
 * At runtime it throws so an unhandled case can never silently pass.
 */
export function assertNever(value: never): never {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`)
}
