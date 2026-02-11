/**
 * List keyboard behaviour — custom overrides for ListItem, TaskItem,
 * and the built-in ListKeymap re-export.
 *
 * ─── Why this file exists ──────────────────────────────────────────────
 *
 * TipTap's default `splitListItem` always splits, even on an empty
 * item — the user gets a second blank bullet instead of exiting the
 * list.  The extensions below replace the stock Enter handler with
 * a two-phase check:
 *
 *   1. Is the current list item empty (no text, no sub-list)?
 *      → `liftListItem` — outdent one level or exit the list entirely.
 *
 *   2. Otherwise
 *      → `splitListItem` — create a new sibling item (the default).
 *
 * Tab / Shift-Tab are re-declared for explicitness; the built-in
 * ListKeymap (re-exported here) adds Backspace / Delete edge-case
 * handling at list boundaries.
 *
 * ─── Keyboard cheat-sheet ──────────────────────────────────────────────
 *
 *   Key          │ In non-empty item        │ In empty item (no sub-list)
 *   ─────────────┼──────────────────────────┼──────────────────────────────
 *   Enter        │ splitListItem (new item) │ liftListItem (outdent/exit)
 *   Tab          │ sinkListItem  (indent)   │ sinkListItem  (indent)
 *   Shift-Tab    │ liftListItem  (outdent)  │ liftListItem  (outdent)
 *   Backspace    │ (built-in ListKeymap)    │ (built-in ListKeymap)
 *   Delete       │ (built-in ListKeymap)    │ (built-in ListKeymap)
 *
 * ────────────────────────────────────────────────────────────────────────
 */

import type { Editor } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import ListItem from '@tiptap/extension-list-item'
import TaskItem from '@tiptap/extension-task-item'
import { ListKeymap } from '@tiptap/extension-list'
import { TaskItemView } from './TaskItemView'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Walk up from the cursor to find the innermost `listItem` or `taskItem`.
 * Returns the ProseMirror node-type name, or `null` if the cursor is
 * outside any list.
 */
function listItemTypeName(editor: Editor): 'listItem' | 'taskItem' | null {
  const { $from } = editor.state.selection

  for (let d = $from.depth; d > 0; d--) {
    const name = $from.node(d).type.name
    if (name === 'listItem' || name === 'taskItem') {
      return name as 'listItem' | 'taskItem'
    }
  }

  return null
}

/**
 * True when the innermost list item satisfies BOTH conditions:
 *
 *   1. The cursor's direct parent is an empty text-block (paragraph
 *      with no visible text — a lone `hardBreak` counts as empty).
 *
 *   2. That paragraph is the **only** child of the list item (i.e.
 *      there are no nested sub-lists beneath it).
 *
 * Condition 2 prevents accidental list-exit when the item still
 * contains a meaningful sub-list; in that case `splitListItem` runs
 * instead so the user can type above the nested content.
 */
function isAtEmptyListItem(editor: Editor): boolean {
  const { $from } = editor.state.selection

  // The cursor must sit inside a text-block (paragraph / heading).
  if (!$from.parent.isTextblock) return false

  // The text-block must be empty.
  if ($from.parent.textContent.length !== 0) return false

  // Find the enclosing list item and check it has a single child.
  for (let d = $from.depth - 1; d >= 1; d--) {
    const node = $from.node(d)

    if (node.type.name === 'listItem' || node.type.name === 'taskItem') {
      return node.childCount === 1
    }
  }

  return false
}

// ---------------------------------------------------------------------------
// CustomListItem — extends the stock ListItem with a smarter Enter
// ---------------------------------------------------------------------------

export const CustomListItem = ListItem.extend({
  addKeyboardShortcuts() {
    return {
      /**
       * Enter — exit on empty, split on non-empty.
       *
       * Only activates when the cursor is inside a `listItem`.
       * Returns `false` for `taskItem` so the TaskItem extension
       * can handle it with its own logic.
       */
      Enter: () => {
        if (listItemTypeName(this.editor) !== 'listItem') return false

        if (isAtEmptyListItem(this.editor)) {
          return this.editor.commands.liftListItem('listItem')
        }

        return this.editor.commands.splitListItem('listItem')
      },

      /** Tab — indent the list item one level deeper. */
      Tab: () => {
        if (listItemTypeName(this.editor) !== 'listItem') return false
        return this.editor.commands.sinkListItem('listItem')
      },

      /** Shift-Tab — outdent the list item one level. */
      'Shift-Tab': () => {
        if (listItemTypeName(this.editor) !== 'listItem') return false
        return this.editor.commands.liftListItem('listItem')
      },
    }
  },
})

// ---------------------------------------------------------------------------
// CustomTaskItem — extends the stock TaskItem with a smarter Enter
// ---------------------------------------------------------------------------

export const CustomTaskItem = TaskItem.extend({
  /**
   * Custom React NodeView — renders the Figma circular checkbox
   * with IconCheckmark1Small instead of the default <label>/<input>.
   */
  addNodeView() {
    return ReactNodeViewRenderer(TaskItemView)
  },

  addKeyboardShortcuts() {
    const shortcuts: Record<string, () => boolean> = {
      /**
       * Enter — exit on empty, split on non-empty.
       *
       * Same logic as CustomListItem but scoped to `taskItem`.
       */
      Enter: () => {
        if (listItemTypeName(this.editor) !== 'taskItem') return false

        if (isAtEmptyListItem(this.editor)) {
          return this.editor.commands.liftListItem('taskItem')
        }

        return this.editor.commands.splitListItem('taskItem')
      },

      /** Shift-Tab — outdent the task item one level. */
      'Shift-Tab': () => {
        if (listItemTypeName(this.editor) !== 'taskItem') return false
        return this.editor.commands.liftListItem('taskItem')
      },
    }

    // Tab (indent) is only available when nesting is enabled.
    if (this.options.nested) {
      shortcuts.Tab = () => {
        if (listItemTypeName(this.editor) !== 'taskItem') return false
        return this.editor.commands.sinkListItem('taskItem')
      }
    }

    return shortcuts
  },
})

// ---------------------------------------------------------------------------
// Re-export the built-in ListKeymap (Backspace / Delete at boundaries)
// ---------------------------------------------------------------------------

export { ListKeymap }
