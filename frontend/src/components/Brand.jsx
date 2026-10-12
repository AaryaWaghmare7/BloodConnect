import { Link } from 'react-router-dom'

export default function Brand({ light = false }) {
  return <Link to="/" className={`brand ${light ? 'brand-light' : ''}`} aria-label="BloodConnect home"><svg viewBox="0 0 40 44" width="31" height="35" aria-hidden="true"><path d="M20 1C15 9 3 21 3 29a17 17 0 0 0 34 0C37 21 25 9 20 1Z" fill="currentColor"/><path d="M20 35s-9-5-9-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 11-9 11Z" fill="white"/></svg><span>Blood<span className="brand-accent">Connect</span><small>EVERY DROP CONNECTS US.</small></span></Link>
}
