import { type ReactNode, useState, useCallback } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { MainEditorArea } from '@/components/layout/MainEditorArea'
import styles from './AppLayout.module.css'

export interface AppLayoutProps {
  /** Content rendered inside the Sidebar (note list, etc.) */
  sidebar?: ReactNode
  /** Content rendered inside the MainEditorArea (editor, etc.) */
  children: ReactNode
  /** Callback when "New Note" is clicked (from TopBar or Sidebar) */
  onNewNote?: () => void
}

export function AppLayout({ sidebar, children, onNewNote }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev)
  }, [])

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  return (
    <div className={styles.appWrapper}>
      {/* TopBar — only visible on tablet / mobile via CSS */}
      <TopBar onToggleSidebar={toggleSidebar} onNewNote={onNewNote} />

      {/* Note container — bounded box with Sidebar + Editor */}
      <div className={styles.noteContainer}>
        <Sidebar open={sidebarOpen} onClose={closeSidebar} onNewNote={onNewNote}>
          {sidebar}
        </Sidebar>
        <MainEditorArea>{children}</MainEditorArea>
      </div>
    </div>
  )
}
