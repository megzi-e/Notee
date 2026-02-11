import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react'
import styles from './IconButton.module.css'

export type IconButtonVariant = 'default' | 'filled' | 'destructive'
export type IconButtonSize = 'sm' | 'md' | 'lg'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The icon element to render */
  icon: ReactNode
  /** Accessible label (required for icon-only buttons) */
  'aria-label': string
  /** Visual variant */
  variant?: IconButtonVariant
  /** Size controls padding around the icon */
  size?: IconButtonSize
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, variant = 'default', size = 'md', className, ...rest }, ref) => {
    const classNames = [
      styles.iconButton,
      styles[variant],
      styles[size],
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button ref={ref} className={classNames} {...rest}>
        {icon}
      </button>
    )
  },
)

IconButton.displayName = 'IconButton'
