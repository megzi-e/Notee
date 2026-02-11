import { type ButtonHTMLAttributes, forwardRef } from 'react'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'destructive'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant mapped to design system button states */
  variant?: ButtonVariant
  /** Stretch to fill parent width */
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', fullWidth = false, className, children, ...rest }, ref) => {
    const classNames = [
      styles.button,
      styles[variant],
      fullWidth ? styles.fullWidth : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button ref={ref} className={classNames} {...rest}>
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
