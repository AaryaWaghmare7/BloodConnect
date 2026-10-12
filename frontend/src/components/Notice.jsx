import { Info, CircleCheck, CircleAlert } from 'lucide-react'

export default function Notice({ children, tone = 'info', className = '', ...props }) {
  const Icon = tone === 'success' ? CircleCheck : tone === 'error' ? CircleAlert : Info
  return <div className={`notice notice-${tone} ${className}`} {...props}><Icon size={18} aria-hidden="true" /><div>{children}</div></div>
}
