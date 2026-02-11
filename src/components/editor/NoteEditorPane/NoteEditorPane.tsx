/**
 * NoteEditorPane — the complete editor surface.
 *
 * Composes:
 *   1. Title input (controlled <input>)
 *   2. TipTap rich-text editor (replaces the legacy BlockRenderer)
 *   3. RichTextToolbar wired to TipTap commands
 *
 * Content lifecycle:
 *   - On mount / note switch: reads `note.body` (HTML string) into TipTap
 *   - On every edit: TipTap fires onUpdate → dispatches UPDATE_BODY
 *   - Legacy `note.blocks` are auto-migrated to `note.body` on first load
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useActiveNote, useEditorDispatch } from '@/state/EditorContext'
import {
  RichTextToolbar,
  type BlockType,
  type InlineFormat,
} from '@/components/editor/RichTextToolbar'
import {
  TipTapEditor,
  type Editor,
} from '@/components/editor/tiptap/TipTapEditor'
import { blocksToHtml } from '@/utils/blocks-to-html'
import styles from './NoteEditorPane.module.css'

// ---------------------------------------------------------------------------
// Helpers — read active state from TipTap editor
// ---------------------------------------------------------------------------

function getActiveBlockType(editor: Editor): BlockType {
  if (editor.isActive('heading', { level: 1 })) return 'heading1'
  if (editor.isActive('heading', { level: 2 })) return 'heading2'
  if (editor.isActive('heading', { level: 3 })) return 'heading3'
  if (editor.isActive('bulletList')) return 'bulletList'
  if (editor.isActive('orderedList')) return 'numberedList'
  if (editor.isActive('taskList')) return 'checklist'
  return 'paragraph'
}

function getActiveInlineFormats(editor: Editor): Set<InlineFormat> {
  const formats = new Set<InlineFormat>()
  if (editor.isActive('bold')) formats.add('bold')
  if (editor.isActive('italic')) formats.add('italic')
  if (editor.isActive('underline')) formats.add('underline')
  return formats
}

// ---------------------------------------------------------------------------
// Helpers — resolve note body (migrate legacy blocks if needed)
// ---------------------------------------------------------------------------

function resolveBody(note: { body?: string; blocks?: unknown[] }): string {
  // New notes always have `body` set
  if (note.body) return note.body
  // Legacy notes: convert blocks → HTML
  if (Array.isArray(note.blocks) && note.blocks.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return blocksToHtml(note.blocks as any)
  }
  return '<p></p>'
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function NoteEditorPane() {
  const note = useActiveNote()
  const dispatch = useEditorDispatch()
  const titleRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<Editor | null>(null)

  // Toolbar state — updated via TipTap callbacks
  const [activeBlockType, setActiveBlockType] = useState<BlockType>('paragraph')
  const [activeFormats, setActiveFormats] = useState<Set<InlineFormat>>(
    () => new Set(),
  )

  // Auto-focus title when a new note is selected
  const prevNoteId = useRef<string | undefined>(undefined)
  useEffect(() => {
    if (note && note.id !== prevNoteId.current) {
      prevNoteId.current = note.id
      requestAnimationFrame(() => titleRef.current?.focus())
    }
  }, [note])

  // ── Title ────────────────────────────────────────────────────────────

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!note) return
      dispatch({ type: 'UPDATE_TITLE', noteId: note.id, title: e.target.value })
    },
    [note, dispatch],
  )

  // Enter in the title field → move focus into the TipTap editor
  const handleTitleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        editorRef.current?.commands.focus('start')
      }
    },
    [],
  )

  // ── TipTap body ──────────────────────────────────────────────────────

  const handleBodyUpdate = useCallback(
    (html: string) => {
      if (!note) return
      dispatch({ type: 'UPDATE_BODY', noteId: note.id, body: html })
    },
    [note, dispatch],
  )

  const handleSelectionUpdate = useCallback((editor: Editor) => {
    editorRef.current = editor
    setActiveBlockType(getActiveBlockType(editor))
    setActiveFormats(getActiveInlineFormats(editor))
  }, [])

  // ── Toolbar actions ──────────────────────────────────────────────────

  const handleBlockTypeChange = useCallback(
    (type: BlockType) => {
      const editor = editorRef.current
      if (!editor) return

      // Focus first so the command targets the correct selection
      const chain = editor.chain().focus()

      switch (type) {
        case 'paragraph':
          chain.setParagraph().run()
          break
        case 'heading1':
          chain.toggleHeading({ level: 1 }).run()
          break
        case 'heading2':
          chain.toggleHeading({ level: 2 }).run()
          break
        case 'heading3':
          chain.toggleHeading({ level: 3 }).run()
          break
        case 'bulletList':
          chain.toggleBulletList().run()
          break
        case 'numberedList':
          chain.toggleOrderedList().run()
          break
        case 'checklist':
          chain.toggleTaskList().run()
          break
      }
    },
    [],
  )

  const handleInlineFormatToggle = useCallback((format: InlineFormat) => {
    const editor = editorRef.current
    if (!editor) return

    const chain = editor.chain().focus()

    switch (format) {
      case 'bold':
        chain.toggleBold().run()
        break
      case 'italic':
        chain.toggleItalic().run()
        break
      case 'underline':
        chain.toggleUnderline().run()
        break
    }
  }, [])

  // ── Empty state ──────────────────────────────────────────────────────

  if (!note) {
    return (
      <div className={styles.pane}>
        <div className={styles.empty}>
          <span className={styles.emptyTitle}>No note selected</span>
          <span className={styles.emptyHint}>
            Select a note from the sidebar, or press ⌘N to create a new one.
          </span>
        </div>
      </div>
    )
  }

  // ── Render ───────────────────────────────────────────────────────────

  const body = resolveBody(note)

  return (
    <div className={styles.pane}>
      {/* Header — title input */}
      <div className={styles.header}>
        <input
          ref={titleRef}
          className={styles.titleInput}
          type="text"
          value={note.title}
          onChange={handleTitleChange}
          onKeyDown={handleTitleKeyDown}
          placeholder="Title"
        />
      </div>

      {/* Body — TipTap rich-text editor */}
      <div className={styles.body}>
        <TipTapEditor
          content={body}
          noteId={note.id}
          onUpdate={handleBodyUpdate}
          onSelectionUpdate={handleSelectionUpdate}
        />
      </div>

      {/* Toolbar — formatting bar wired to TipTap */}
      <RichTextToolbar
        activeBlockType={activeBlockType}
        activeInlineFormats={activeFormats}
        onBlockTypeChange={handleBlockTypeChange}
        onInlineFormatToggle={handleInlineFormatToggle}
      />
    </div>
  )
}
