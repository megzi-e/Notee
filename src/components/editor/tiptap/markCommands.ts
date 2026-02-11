/**
 * Mark commands — type-safe bridge between the TipTap editor and the
 * formatting toolbar.
 *
 * ─── Design constraints ────────────────────────────────────────────────
 *
 * 1. Marks apply **only to the current selection**.  When the selection
 *    is collapsed (cursor, no highlight), the mark is "stored" — the
 *    next typed characters inherit the mark, but no existing text
 *    changes.
 *
 * 2. Every toggle uses `editor.chain().focus().toggle*().run()`:
 *      • `.chain()`  — batches commands into a single transaction
 *      • `.focus()`  — restores editor focus after a toolbar click
 *                       steals it (critical for selection preservation)
 *      • `.toggle*()` — adds the mark if absent, removes it if present
 *      • `.run()`    — commits the transaction to the editor state
 *
 * 3. Marks cannot affect block structure.  ProseMirror enforces this
 *    at the schema level — `toggleMark` only touches inline text spans.
 *
 * ────────────────────────────────────────────────────────────────────────
 */

import type { Editor } from '@tiptap/core'

// ---------------------------------------------------------------------------
// Inline format type (mirrors RichTextToolbar's InlineFormat)
// ---------------------------------------------------------------------------

/**
 * The three inline formats supported by the editor.
 *
 * This is intentionally duplicated from `RichTextToolbar` so the TipTap
 * layer has no dependency on a UI component.  Both types describe the
 * same three string literals.
 */
export type InlineFormat = 'bold' | 'italic' | 'underline'

// ---------------------------------------------------------------------------
// Toggle commands
// ---------------------------------------------------------------------------

/**
 * Toggle a single inline format on the editor's current selection.
 *
 * Uses `editor.chain().focus().toggle*().run()` so the editor regains
 * focus after a toolbar button click and the mark is applied/removed
 * atomically.
 *
 * @returns `true` if the command executed successfully.
 *
 * @example
 *   // From a toolbar button's onClick handler:
 *   toggleMark(editor, 'bold')
 */
export function toggleMark(editor: Editor, format: InlineFormat): boolean {
  const chain = editor.chain().focus()

  switch (format) {
    case 'bold':
      return chain.toggleBold().run()
    case 'italic':
      return chain.toggleItalic().run()
    case 'underline':
      return chain.toggleUnderline().run()
  }
}

// ---------------------------------------------------------------------------
// Active-state queries
// ---------------------------------------------------------------------------

/**
 * Check whether a specific mark is active at the current cursor
 * position or within the current selection.
 *
 * "Active" means:
 *   • For a collapsed selection — the stored marks include the format,
 *     or the character immediately before the cursor carries the mark.
 *   • For a range selection — every character in the range has the mark.
 *
 * @example
 *   const isBold = isMarkActive(editor, 'bold') // true | false
 */
export function isMarkActive(editor: Editor, format: InlineFormat): boolean {
  return editor.isActive(format)
}

/**
 * Return the set of all currently active inline formats.
 *
 * Designed to be passed directly to `<RichTextToolbar>`:
 *
 * @example
 *   <RichTextToolbar
 *     activeInlineFormats={getActiveFormats(editor)}
 *     onInlineFormatToggle={(f) => toggleMark(editor, f)}
 *   />
 */
export function getActiveFormats(editor: Editor): Set<InlineFormat> {
  const formats = new Set<InlineFormat>()

  if (editor.isActive('bold'))      formats.add('bold')
  if (editor.isActive('italic'))    formats.add('italic')
  if (editor.isActive('underline')) formats.add('underline')

  return formats
}
