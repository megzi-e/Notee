/**
 * Editor state management — pure reducer pattern.
 *
 * All state transitions are expressed as pure functions:
 *   (state, action) → state
 *
 * No side‑effects live here; persistence is handled by the consumer
 * after the reducer returns the next state.
 */

import type {
  Block,
  ChecklistItem,
  Note,
  TextSpan,
} from '@/types/note'
import {
  createChecklistBlock,
  createChecklistItem,
  createNote,
  createParagraphBlock,
} from '@/utils/block-factories'

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

export type EditorState = {
  /** All notes the user has created. */
  notes: Note[]
  /** Currently selected note id, or null when nothing is open. */
  activeNoteId: string | null
}

export const initialEditorState: EditorState = {
  notes: [],
  activeNoteId: null,
}

// ---------------------------------------------------------------------------
// Actions (discriminated union)
// ---------------------------------------------------------------------------

export type EditorAction =
  // Notes CRUD
  | { type: 'LOAD_NOTES'; notes: Note[] }
  | { type: 'CREATE_NOTE' }
  | { type: 'DELETE_NOTE'; noteId: string }
  | { type: 'SET_ACTIVE_NOTE'; noteId: string | null }

  // Title
  | { type: 'UPDATE_TITLE'; noteId: string; title: string }

  // TipTap body content
  | { type: 'UPDATE_BODY'; noteId: string; body: string }

  // Block‑level mutations (legacy — kept for backward compat)
  | { type: 'ADD_BLOCK'; noteId: string; afterBlockId: string; block: Block }
  | { type: 'REMOVE_BLOCK'; noteId: string; blockId: string }
  | { type: 'UPDATE_BLOCK'; noteId: string; blockId: string; patch: Partial<Block> }
  | { type: 'REPLACE_BLOCK'; noteId: string; blockId: string; block: Block }
  | { type: 'MOVE_BLOCK'; noteId: string; blockId: string; direction: 'up' | 'down' }

  // Inline content
  | { type: 'UPDATE_BLOCK_CONTENT'; noteId: string; blockId: string; content: TextSpan[] }

  // List‑specific
  | { type: 'UPDATE_LIST_ITEM'; noteId: string; blockId: string; itemIndex: number; content: TextSpan[] }
  | { type: 'ADD_LIST_ITEM'; noteId: string; blockId: string; afterIndex: number }
  | { type: 'REMOVE_LIST_ITEM'; noteId: string; blockId: string; itemIndex: number }

  // Checklist‑specific
  | { type: 'TOGGLE_CHECKLIST_ITEM'; noteId: string; blockId: string; itemId: string }
  | { type: 'UPDATE_CHECKLIST_ITEM'; noteId: string; blockId: string; itemId: string; content: TextSpan[] }
  | { type: 'ADD_CHECKLIST_ITEM'; noteId: string; blockId: string; afterItemId: string }
  | { type: 'REMOVE_CHECKLIST_ITEM'; noteId: string; blockId: string; itemId: string }

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

function now(): number {
  return Date.now()
}

/** Return a new notes array with one note replaced by the return value of `fn`. */
function mapNote(
  notes: Note[],
  noteId: string,
  fn: (note: Note) => Note,
): Note[] {
  return notes.map((n) => (n.id === noteId ? fn(n) : n))
}

/** Return a new blocks array with one block replaced by the return value of `fn`. */
function mapBlock(
  blocks: Block[],
  blockId: string,
  fn: (block: Block) => Block,
): Block[] {
  return blocks.map((b) => (b.id === blockId ? fn(b) : b))
}

/** Touch the updatedAt timestamp on a note. */
function touch(note: Note): Note {
  return { ...note, updatedAt: now() }
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function editorReducer(
  state: EditorState,
  action: EditorAction,
): EditorState {
  switch (action.type) {
    // ----- Notes CRUD ---------------------------------------------------

    case 'LOAD_NOTES': {
      return { ...state, notes: action.notes }
    }

    case 'CREATE_NOTE': {
      const note = createNote()
      return {
        ...state,
        notes: [note, ...state.notes],
        activeNoteId: note.id,
      }
    }

    case 'DELETE_NOTE': {
      const remaining = state.notes.filter((n) => n.id !== action.noteId)
      return {
        ...state,
        notes: remaining,
        activeNoteId:
          state.activeNoteId === action.noteId
            ? remaining[0]?.id ?? null
            : state.activeNoteId,
      }
    }

    case 'SET_ACTIVE_NOTE': {
      return { ...state, activeNoteId: action.noteId }
    }

    // ----- Title --------------------------------------------------------

    case 'UPDATE_TITLE': {
      return {
        ...state,
        notes: mapNote(state.notes, action.noteId, (n) =>
          touch({ ...n, title: action.title }),
        ),
      }
    }

    // ----- TipTap body --------------------------------------------------

    case 'UPDATE_BODY': {
      return {
        ...state,
        notes: mapNote(state.notes, action.noteId, (n) =>
          touch({ ...n, body: action.body }),
        ),
      }
    }

    // ----- Block CRUD (legacy) ----------------------------------------

    case 'ADD_BLOCK': {
      return {
        ...state,
        notes: mapNote(state.notes, action.noteId, (n) => {
          const idx = n.blocks.findIndex((b) => b.id === action.afterBlockId)
          const insertAt = idx >= 0 ? idx + 1 : n.blocks.length
          const blocks = [...n.blocks]
          blocks.splice(insertAt, 0, action.block)
          return touch({ ...n, blocks })
        }),
      }
    }

    case 'REMOVE_BLOCK': {
      return {
        ...state,
        notes: mapNote(state.notes, action.noteId, (n) => {
          const blocks = n.blocks.filter((b) => b.id !== action.blockId)
          // Never leave a note with zero blocks.
          return touch({
            ...n,
            blocks: blocks.length > 0 ? blocks : [createParagraphBlock()],
          })
        }),
      }
    }

    case 'UPDATE_BLOCK': {
      return {
        ...state,
        notes: mapNote(state.notes, action.noteId, (n) =>
          touch({
            ...n,
            blocks: mapBlock(n.blocks, action.blockId, (b) => {
              // Spread the patch over the existing block, but preserve
              // identity (id) and discriminant (type) from the original.
              const merged = { ...b, ...action.patch, id: b.id, type: b.type }
              return merged as Block
            }),
          }),
        ),
      }
    }

    case 'REPLACE_BLOCK': {
      return {
        ...state,
        notes: mapNote(state.notes, action.noteId, (n) =>
          touch({
            ...n,
            blocks: mapBlock(n.blocks, action.blockId, () => action.block),
          }),
        ),
      }
    }

    case 'MOVE_BLOCK': {
      return {
        ...state,
        notes: mapNote(state.notes, action.noteId, (n) => {
          const blocks = [...n.blocks]
          const idx = blocks.findIndex((b) => b.id === action.blockId)
          if (idx < 0) return n
          const targetIdx =
            action.direction === 'up' ? idx - 1 : idx + 1
          if (targetIdx < 0 || targetIdx >= blocks.length) return n
          ;[blocks[idx], blocks[targetIdx]] = [blocks[targetIdx], blocks[idx]]
          return touch({ ...n, blocks })
        }),
      }
    }

    // ----- Inline content -----------------------------------------------

    case 'UPDATE_BLOCK_CONTENT': {
      return {
        ...state,
        notes: mapNote(state.notes, action.noteId, (n) =>
          touch({
            ...n,
            blocks: mapBlock(n.blocks, action.blockId, (b) => {
              if (b.type === 'paragraph' || b.type === 'heading') {
                return { ...b, content: action.content }
              }
              return b
            }),
          }),
        ),
      }
    }

    // ----- List item mutations ------------------------------------------

    case 'UPDATE_LIST_ITEM': {
      return {
        ...state,
        notes: mapNote(state.notes, action.noteId, (n) =>
          touch({
            ...n,
            blocks: mapBlock(n.blocks, action.blockId, (b) => {
              if (b.type !== 'list') return b
              const items = [...b.items]
              items[action.itemIndex] = action.content
              return { ...b, items }
            }),
          }),
        ),
      }
    }

    case 'ADD_LIST_ITEM': {
      return {
        ...state,
        notes: mapNote(state.notes, action.noteId, (n) =>
          touch({
            ...n,
            blocks: mapBlock(n.blocks, action.blockId, (b) => {
              if (b.type !== 'list') return b
              const items = [...b.items]
              items.splice(action.afterIndex + 1, 0, [{ text: '' }])
              return { ...b, items }
            }),
          }),
        ),
      }
    }

    case 'REMOVE_LIST_ITEM': {
      return {
        ...state,
        notes: mapNote(state.notes, action.noteId, (n) =>
          touch({
            ...n,
            blocks: mapBlock(n.blocks, action.blockId, (b) => {
              if (b.type !== 'list') return b
              const items = b.items.filter((_, i) => i !== action.itemIndex)
              return { ...b, items: items.length > 0 ? items : [[{ text: '' }]] }
            }),
          }),
        ),
      }
    }

    // ----- Checklist item mutations -------------------------------------

    case 'TOGGLE_CHECKLIST_ITEM': {
      return {
        ...state,
        notes: mapNote(state.notes, action.noteId, (n) =>
          touch({
            ...n,
            blocks: mapBlock(n.blocks, action.blockId, (b) => {
              if (b.type !== 'checklist') return b
              return {
                ...b,
                items: b.items.map((item) =>
                  item.id === action.itemId
                    ? { ...item, checked: !item.checked }
                    : item,
                ),
              }
            }),
          }),
        ),
      }
    }

    case 'UPDATE_CHECKLIST_ITEM': {
      return {
        ...state,
        notes: mapNote(state.notes, action.noteId, (n) =>
          touch({
            ...n,
            blocks: mapBlock(n.blocks, action.blockId, (b) => {
              if (b.type !== 'checklist') return b
              return {
                ...b,
                items: b.items.map((item) =>
                  item.id === action.itemId
                    ? { ...item, content: action.content }
                    : item,
                ),
              }
            }),
          }),
        ),
      }
    }

    case 'ADD_CHECKLIST_ITEM': {
      return {
        ...state,
        notes: mapNote(state.notes, action.noteId, (n) =>
          touch({
            ...n,
            blocks: mapBlock(n.blocks, action.blockId, (b) => {
              if (b.type !== 'checklist') return b
              const items = [...b.items]
              const idx = items.findIndex((i) => i.id === action.afterItemId)
              const insertAt = idx >= 0 ? idx + 1 : items.length
              items.splice(insertAt, 0, createChecklistItem())
              return { ...b, items }
            }),
          }),
        ),
      }
    }

    case 'REMOVE_CHECKLIST_ITEM': {
      return {
        ...state,
        notes: mapNote(state.notes, action.noteId, (n) =>
          touch({
            ...n,
            blocks: mapBlock(n.blocks, action.blockId, (b) => {
              if (b.type !== 'checklist') return b
              const items = b.items.filter((i) => i.id !== action.itemId)
              return {
                ...b,
                items: items.length > 0 ? items : [createChecklistItem()],
              }
            }),
          }),
        ),
      }
    }

    default:
      return state
  }
}
