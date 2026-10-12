export default function BloodBadge({ group, size = 'normal' }) {
  return <span className={`blood-badge blood-badge-${size}`} aria-label={`Blood group ${group}`}>{group}</span>
}
