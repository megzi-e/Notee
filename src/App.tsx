/**
 * App — root composition wiring all components together.
 *
 * Responsibilities:
 *   - EditorProvider (state + localStorage persistence)
 *   - AppLayout (responsive shell)
 *   - SidebarContent (date-grouped note list)
 *   - NoteEditorPane (title + blocks + toolbar)
 *   - DeleteModal (confirmation dialog)
 *   - Global keyboard shortcuts (⌘N, ⌘S)
 */

import { useState, useEffect, useCallback } from 'react'
import { EditorProvider, useEditorDispatch } from '@/state/EditorContext'
import { AppLayout } from '@/components/layout'
import { SidebarContent } from '@/components/SidebarContent'
import { NoteEditorPane } from '@/components/editor/NoteEditorPane'
import { DeleteModal } from '@/components/DeleteModal'

// ---------------------------------------------------------------------------
// Inner app (must be inside EditorProvider to use hooks)
// ---------------------------------------------------------------------------

type DeleteTarget = { noteId: string; noteTitle: string } | null

function NotesApp() {
  const dispatch = useEditorDispatch()
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null)

  // -- New note handler --
  const handleNewNote = useCallback(() => {
    dispatch({ type: 'CREATE_NOTE' })
  }, [dispatch])

  // -- Global keyboard shortcuts --
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey

      // ⌘N — create new note
      if (mod && e.key === 'n') {
        e.preventDefault()
        dispatch({ type: 'CREATE_NOTE' })
      }

      // ⌘S — suppress browser save (notes auto-save)
      if (mod && e.key === 's') {
        e.preventDefault()
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [dispatch])

  // -- Delete flow --
  const handleDeleteRequest = useCallback(
    (noteId: string, noteTitle: string) => {
      setDeleteTarget({ noteId, noteTitle })
    },
    [],
  )

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) return
    dispatch({ type: 'DELETE_NOTE', noteId: deleteTarget.noteId })
    setDeleteTarget(null)
  }, [deleteTarget, dispatch])

  const handleDeleteClose = useCallback(() => {
    setDeleteTarget(null)
  }, [])

  return (
    <>
      <AppLayout
        sidebar={<SidebarContent onDeleteRequest={handleDeleteRequest} />}
        onNewNote={handleNewNote}
      >
        <NoteEditorPane />
      </AppLayout>

      <DeleteModal
        open={deleteTarget !== null}
        noteTitle={deleteTarget?.noteTitle ?? ''}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}

// ---------------------------------------------------------------------------
// Root export
// ---------------------------------------------------------------------------

export default function App() {
  return (
    <EditorProvider>
      <NotesApp />
    </EditorProvider>
  )
}
