import {
  type ReactNode,
  type MouseEvent,
  useEffect,
  useCallback,
  useRef,
} from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.css'

export interface ModalProps {
  /** Whether the modal is visible */
  open: boolean
  /** Callback when the modal should close */
  onClose: () => void
  /** Optional heading rendered at the top of the panel */
  title?: string
  /** Modal body content */
  children: ReactNode
}

/**
 * Base modal structure.
 * Renders into a portal, traps focus on Escape, and closes on overlay click.
 */
export function Modal({ open, onClose, title, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  /* Close on Escape key */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, handleKeyDown])

  /* Prevent body scroll while open */
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  /* Close when clicking the overlay (not the panel) */
  const handleOverlayClick = (e: MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  if (!open) return null

  return createPortal(
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={title ?? 'Dialog'}
      onClick={handleOverlayClick}
    >
      <div ref={panelRef} className={styles.panel}>
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close dialog"
            >
              {/* 24×24 X icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body,
  )
}
