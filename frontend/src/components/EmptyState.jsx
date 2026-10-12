import { Search } from 'lucide-react'

export default function EmptyState({ title = 'Nothing here just yet', description, children }) {
  return <div className="empty-state"><span className="empty-state-icon"><Search size={26} aria-hidden="true" /></span><h2>{title}</h2>{description && <p>{description}</p>}{children}</div>
}
