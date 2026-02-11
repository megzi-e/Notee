/**
 * React context that wires the pure editorReducer to useReducer
 * and provides state + dispatch to the entire component tree.
 *
 * Also handles:
 *  - Loading notes from localStorage on mount.
 *  - Persisting notes to localStorage on every state change.
 */

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type Dispatch,
  type ReactNode,
} from 'react'

import {
  editorReducer,
  initialEditorState,
  type EditorAction,
  type EditorState,
} from './editor-state'
import { loadNotes, saveNotes } from './note-storage'

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const StateCtx = createContext<EditorState>(initialEditorState)
const DispatchCtx = createContext<Dispatch<EditorAction>>(() => {
  throw new Error('EditorProvider not mounted')
})

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, initialEditorState)

  // ---- Hydrate from localStorage on mount --------------------------------
  const hydrated = useRef(false)
  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true
    const notes = loadNotes()
    if (notes.length > 0) {
      dispatch({ type: 'LOAD_NOTES', notes })
      dispatch({ type: 'SET_ACTIVE_NOTE', noteId: notes[0].id })
    }
  }, [])

  // ---- Persist to localStorage on every notes change ---------------------
  const isFirstRender = useRef(true)
  useEffect(() => {
    // Skip the initial render (before hydration) to avoid overwriting
    // localStorage with the empty initial state.
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    saveNotes(state.notes)
  }, [state.notes])

  return (
    <StateCtx.Provider value={state}>
      <DispatchCtx.Provider value={dispatch}>
        {children}
      </DispatchCtx.Provider>
    </StateCtx.Provider>
  )
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export function useEditorState(): EditorState {
  return useContext(StateCtx)
}

export function useEditorDispatch(): Dispatch<EditorAction> {
  return useContext(DispatchCtx)
}

/**
 * Convenience hook: returns the currently active Note, or undefined.
 */
export function useActiveNote() {
  const { notes, activeNoteId } = useEditorState()
  if (!activeNoteId) return undefined
  return notes.find((n) => n.id === activeNoteId)
}
