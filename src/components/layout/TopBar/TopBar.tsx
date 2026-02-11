import { IconBarsTwo } from '@/components/icons'
import { NewNoteButton } from '@/components/layout/NewNoteButton'
import styles from './TopBar.module.css'

export interface TopBarProps {
  /** Toggle sidebar drawer visibility */
  onToggleSidebar: () => void
  /** Create a new note */
  onNewNote?: () => void
}

export function TopBar({ onToggleSidebar, onNewNote }: TopBarProps) {
  return (
    <header className={styles.topBar}>
      <button
        className={styles.hamburger}
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <IconBarsTwo size={24} />
      </button>
      <NewNoteButton className={styles.newNote} onClick={onNewNote} />
    </header>
  )
}
