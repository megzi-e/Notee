/**
 * Conversion helpers between TextSpan[] and plain strings.
 *
 * Used by editable block inputs to convert the structured span model
 * to/from a single string for controlled textarea/input values.
 */

import type { TextSpan } from '@/types/note'

/** Flatten an array of TextSpan into a single plain string. */
export function spansToText(spans: TextSpan[]): string {
  return spans.map((s) => s.text).join('')
}

/** Wrap a plain string in a single unstyled TextSpan. */
export function textToSpans(text: string): TextSpan[] {
  return [{ text }]
}
