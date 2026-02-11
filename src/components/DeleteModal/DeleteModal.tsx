/**
 * DeleteModal — confirmation dialog for deleting a note.
 *
 * Composes the Modal base + Button primitives from Phase 1.
 * Pure presentation: props in, callbacks out, no global state.
 */

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import styles from './DeleteModal.module.css'

export interface DeleteModalProps {
  /** Whether the dialog is visible */
  open: boolean
  /** Title of the note being deleted (shown in the heading) */
  noteTitle: string
  /** Close the dialog without deleting */
  onClose: () => void
  /** Confirm deletion */
  onConfirm: () => void
}

export function DeleteModal({
  open,
  noteTitle,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  const displayTitle = noteTitle.trim() || 'Untitled'

  return (
    <Modal open={open} onClose={onClose} title={`Delete '${displayTitle}'?`}>
      <div className={styles.content}>
        <p className={styles.caption}>This action cannot be undone.</p>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  )
}
