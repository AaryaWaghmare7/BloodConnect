import { useId } from 'react'

export default function Input({ label, error, hint, id: providedId, className = '', ...props }) {
  const generatedId = useId()
  const id = providedId || props.name || generatedId
  return <div className={`field ${className}`}>
    {label && <label htmlFor={id}>{label}{props.required && <span className="required-mark" aria-hidden="true"> *</span>}</label>}
    <input className={`input ${error ? 'input-error' : ''}`} id={id} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} {...props} />
    {error ? <p className="field-error" id={`${id}-error`}>{error}</p> : hint && <p className="field-hint" id={`${id}-hint`}>{hint}</p>}
  </div>
}
