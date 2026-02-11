import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import styles from './MainEditorArea.module.css'

export interface MainEditorAreaProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode
}

export const MainEditorArea = forwardRef<HTMLElement, MainEditorAreaProps>(
  ({ className, children, ...rest }, ref) => {
    const classNames = [styles.main, className ?? ''].filter(Boolean).join(' ')

    return (
      <main ref={ref} className={classNames} {...rest}>
        {children}
      </main>
    )
  },
)

MainEditorArea.displayName = 'MainEditorArea'
