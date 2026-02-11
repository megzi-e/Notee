import { type ElementType, type HTMLAttributes, type ReactNode, forwardRef } from 'react'
import styles from './Text.module.css'

export type TextVariant = 'title' | 'h1' | 'h2' | 'h3' | 'body' | 'label-lg' | 'label-sm'
export type TextColor = 'primary' | 'secondary' | 'inverse' | 'destructive'

/** Default HTML element per variant */
const defaultElementMap: Record<TextVariant, ElementType> = {
  title: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  body: 'p',
  'label-lg': 'span',
  'label-sm': 'span',
}

/** CSS module class per variant */
const variantClassMap: Record<TextVariant, string> = {
  title: styles.title,
  h1: styles.h1,
  h2: styles.h2,
  h3: styles.h3,
  body: styles.body,
  'label-lg': styles.labelLg,
  'label-sm': styles.labelSm,
}

/** CSS module class per color */
const colorClassMap: Record<TextColor, string> = {
  primary: styles.colorPrimary,
  secondary: styles.colorSecondary,
  inverse: styles.colorInverse,
  destructive: styles.colorDestructive,
}

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** Typography variant from the design system */
  variant?: TextVariant
  /** Semantic color override */
  color?: TextColor
  /** Override the rendered HTML element */
  as?: ElementType
  children?: ReactNode
}

export const Text = forwardRef<HTMLElement, TextProps>(
  ({ variant = 'body', color, as, className, children, ...rest }, ref) => {
    const Component = as ?? defaultElementMap[variant]

    const classNames = [
      styles.text,
      variantClassMap[variant],
      color ? colorClassMap[color] : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <Component ref={ref} className={classNames} {...rest}>
        {children}
      </Component>
    )
  },
)

Text.displayName = 'Text'
