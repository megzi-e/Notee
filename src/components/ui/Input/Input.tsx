import { type InputHTMLAttributes, forwardRef, useId } from 'react'
import styles from './Input.module.css'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Optional visible label above the input */
  label?: string
  /** Error message displayed below the input */
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id: idProp, ...rest }, ref) => {
    const autoId = useId()
    const id = idProp ?? autoId
    const errorId = `${id}-error`

    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={[
            styles.input,
            error ? styles.inputError : '',
            className ?? '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        />
        {error && (
          <span id={errorId} className={styles.errorText} role="alert">
            {error}
          </span>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
