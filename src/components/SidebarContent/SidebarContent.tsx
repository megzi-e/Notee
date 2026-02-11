/**
 * SidebarContent — composes NoteTab + date grouping.
 *
 * Reads from EditorContext, emits callbacks for selection and delete.
 * No direct state mutation — all changes flow through dispatch.
 */

import { useEditorState, useEditorDispatch } from '@/state/EditorContext'
import { groupNotesByDate } from '@/utils/date-groups'
import { NoteTab } from '@/components/NoteTab'
import styles from './SidebarContent.module.css'

export interface SidebarContentProps {
  /** Called when the user requests to delete a note (opens confirmation) */
  onDeleteRequest?: (noteId: string, noteTitle: string) => void
}

export function SidebarContent({ onDeleteRequest }: SidebarContentProps) {
  const { notes, activeNoteId } = useEditorState()
  const dispatch = useEditorDispatch()

  const groups = groupNotesByDate(notes)

  const handleSelect = (noteId: string) => {
    dispatch({ type: 'SET_ACTIVE_NOTE', noteId })
  }

  return (
    <div className={styles.container}>
      {groups.map(({ group, notes: groupNotes }) => (
        <div key={group} className={styles.section}>
          <span className={styles.sectionLabel}>{group}</span>
          <div className={styles.noteList}>
            {groupNotes.map((note) => (
              <NoteTab
                key={note.id}
                title={note.title}
                active={note.id === activeNoteId}
                onSelect={() => handleSelect(note.id)}
                onDelete={() => onDeleteRequest?.(note.id, note.title)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
