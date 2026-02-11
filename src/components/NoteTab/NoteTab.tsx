import { type MouseEvent } from 'react'
import { IconTrashCan } from '@/components/icons'
import styles from './NoteTab.module.css'

export interface NoteTabProps {
  /** Note title — falls back to "Untitled" when empty */
  title: string
  /** Whether this tab is the currently selected note */
  active?: boolean
  /** Called when the user clicks the tab body to select the note */
  onSelect: () => void
  /** Called when the user clicks the delete icon */
  onDelete: () => void
}

export function NoteTab({
  title,
  active = false,
  onSelect,
  onDelete,
}: NoteTabProps) {
  const displayTitle = title.trim() || 'Untitled'

  /** Stop the delete click from also triggering onSelect */
  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation()
    onDelete()
  }

  return (
    <button
      className={[styles.tab, active ? styles.active : styles.inactive]
        .filter(Boolean)
        .join(' ')}
      onClick={onSelect}
      aria-current={active ? 'true' : undefined}
    >
      <span className={styles.title}>{displayTitle}</span>
      <span
        role="button"
        tabIndex={0}
        className={styles.deleteBtn}
        onClick={handleDelete}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            e.stopPropagation()
            onDelete()
          }
        }}
        aria-label={`Delete ${displayTitle}`}
      >
        <IconTrashCan size={16} />
      </span>
    </button>
  )
}
