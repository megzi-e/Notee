import { type ReactNode } from 'react'
import { NewNoteButton } from '@/components/layout/NewNoteButton'
import styles from './Sidebar.module.css'

export interface SidebarProps {
  /** Whether the drawer is open (only used on tablet / mobile) */
  open: boolean
  /** Close the drawer */
  onClose: () => void
  /** Callback when "New Note" is clicked */
  onNewNote?: () => void
  /** Note list content rendered below the New Note button */
  children?: ReactNode
}

export function Sidebar({ open, onClose, onNewNote, children }: SidebarProps) {
  return (
    <>
      {/* Backdrop — only visible on tablet/mobile when drawer is open */}
      <div
        className={[styles.backdrop, open ? styles.backdropVisible : '']
          .filter(Boolean)
          .join(' ')}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={[styles.sidebar, open ? styles.open : '']
          .filter(Boolean)
          .join(' ')}
        aria-label="Sidebar"
      >
        <NewNoteButton onClick={onNewNote} />
        <div className={styles.content}>{children}</div>
      </aside>
    </>
  )
}
