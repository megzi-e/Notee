import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { IconPlusSmall } from '@central-icons-react/square-outlined-radius-0-stroke-2/IconPlusSmall'
import styles from './NewNoteButton.module.css'

export interface NewNoteButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Whether to show the keyboard shortcut hint (hidden in tight spaces) */
  showShortcut?: boolean
}

export const NewNoteButton = forwardRef<HTMLButtonElement, NewNoteButtonProps>(
  ({ showShortcut = true, className, ...rest }, ref) => {
    const classNames = [styles.button, className ?? ''].filter(Boolean).join(' ')

    return (
      <button ref={ref} className={classNames} {...rest}>
        <span className={styles.left}>
          <IconPlusSmall size={24} />
          <span className={styles.label}>New Note</span>
        </span>
        {showShortcut && (
          <span className={styles.shortcut}>
            <span className={styles.shortcutKey}>⌘</span>
            <span className={styles.shortcutKey}>N</span>
          </span>
        )}
      </button>
    )
  },
)

NewNoteButton.displayName = 'NewNoteButton'
