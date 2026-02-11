import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import styles from './Surface.module.css'

export type SurfacePadding = 'none' | 'sm' | 'md' | 'lg'

const paddingClassMap: Record<SurfacePadding, string> = {
  none: styles.paddingNone,
  sm: styles.paddingSm,
  md: styles.paddingMd,
  lg: styles.paddingLg,
}

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  /** Show a border (outline) */
  bordered?: boolean
  /** Apply elevation shadow (shadow.md) */
  elevated?: boolean
  /** Padding size mapped to spacing tokens */
  padding?: SurfacePadding
  children?: ReactNode
}

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
  (
    { bordered = false, elevated = false, padding = 'md', className, children, ...rest },
    ref,
  ) => {
    const classNames = [
      styles.surface,
      bordered ? styles.bordered : '',
      elevated ? styles.elevated : '',
      paddingClassMap[padding],
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div ref={ref} className={classNames} {...rest}>
        {children}
      </div>
    )
  },
)

Surface.displayName = 'Surface'
