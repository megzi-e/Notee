/**
 * Editor — the main note-editing surface.
 *
 * Renders the active note as:
 *   1. A controlled title input
 *   2. A block-by-block list via an inline type-switch
 *
 * Architectural invariants enforced here:
 *   - The switch over block.type is inline — no intermediary dispatcher.
 *   - Every branch returns a specific, narrowly-typed block component.
 *   - The `default` branch uses `assertNever` for compile-time exhaustiveness.
 *   - No contentEditable wrapper around the editor.
 *   - No dangerouslySetInnerHTML anywhere in the tree.
 *   - All mutations flow through structured dispatch actions.
 */

import { useActiveNote, useEditorDispatch } from '@/state/EditorContext'
import { assertNever } from '@/utils/assert-never'
import {
  ParagraphBlock,
  HeadingBlock,
  ListBlock,
  ChecklistBlock,
} from './blocks'

export function Editor() {
  const note = useActiveNote()
  const dispatch = useEditorDispatch()

  if (!note) {
    return (
      <div data-testid="editor-empty">
        <p>No note selected. Create one to get started.</p>
      </div>
    )
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'UPDATE_TITLE',
      noteId: note.id,
      title: e.target.value,
    })
  }

  return (
    <div data-testid="editor">
      {/* Title — controlled input, updates via structured dispatch */}
      <div data-testid="editor-title">
        <input
          type="text"
          value={note.title}
          onChange={handleTitleChange}
          placeholder="Untitled"
        />
      </div>

      {/* Blocks — inline switch, one component per block type */}
      <div data-testid="editor-blocks">
        {note.blocks.map((block) => {
          switch (block.type) {
            case 'paragraph':
              return <ParagraphBlock key={block.id} block={block} noteId={note.id} />
            case 'heading':
              return <HeadingBlock key={block.id} block={block} noteId={note.id} />
            case 'list':
              return <ListBlock key={block.id} block={block} noteId={note.id} />
            case 'checklist':
              return <ChecklistBlock key={block.id} block={block} noteId={note.id} />
            default:
              return assertNever(block)
          }
        })}
      </div>
    </div>
  )
}
