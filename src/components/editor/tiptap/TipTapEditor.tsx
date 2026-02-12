/**
 * TipTapEditor — rich-text editing surface powered by TipTap.
 *
 * Replaces the legacy textarea-based BlockRenderer with a real
 * contentEditable editor that supports:
 *   - Enter  → new paragraph / new list item
 *   - Lists  → proper <ul>/<ol> with nesting (Tab / Shift-Tab)
 *   - Marks  → bold / italic / underline via toolbar + keyboard
 *   - Undo   → Ctrl/Cmd-Z / Ctrl/Cmd-Shift-Z
 */

import { useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import type { Editor } from '@tiptap/core'
import { extensions } from './extensions'
import './TipTapEditor.css'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface TipTapEditorProps {
  /** HTML content to render — used only on mount and when noteId changes. */
  content: string
  /** Unique note identifier — triggers a content reset when it changes. */
  noteId: string
  /** Fires on every content change with the current HTML string. */
  onUpdate?: (html: string) => void
  /** Fires on every selection / cursor change (for toolbar state). */
  onSelectionUpdate?: (editor: Editor) => void
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TipTapEditor({
  content,
  noteId,
  onUpdate,
  onSelectionUpdate,
}: TipTapEditorProps) {
  // Keep callbacks in refs so the editor doesn't recreate on every render
  const onUpdateRef = useRef(onUpdate)
  const onSelectionRef = useRef(onSelectionUpdate)
  onUpdateRef.current = onUpdate
  onSelectionRef.current = onSelectionUpdate

  const editor = useEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
      },
    },
    onUpdate: ({ editor: ed }) => {
      onUpdateRef.current?.(ed.getHTML())
    },
    onSelectionUpdate: ({ editor: ed }) => {
      onSelectionRef.current?.(ed)
    },
    // Also fire on transaction so toolbar stays in sync after commands
    onTransaction: ({ editor: ed }) => {
      onSelectionRef.current?.(ed)
    },
  })

  // When the note changes, swap the editor content without recreating
  const prevNoteId = useRef(noteId)
  useEffect(() => {
    if (!editor) return
    if (noteId !== prevNoteId.current) {
      prevNoteId.current = noteId
      editor.commands.setContent(content)
    }
  }, [editor, noteId, content])

  return <EditorContent editor={editor} />
}

/**
 * Re-export the Editor type so consumers can use it for toolbar wiring
 * without importing from @tiptap/core directly.
 */
export type { Editor }
