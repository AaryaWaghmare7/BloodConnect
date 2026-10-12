import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import Brand from './Brand'
import { endDemoSession, getSession } from '../services/demoService'

const groups = { 'Find Blood': [['/find-donors', 'Find Donors'], ['/blood-banks', 'Blood Bank Directory'], ['/request-blood', 'Request Blood']], 'Donate Blood': [['/donate', 'Register as Donor'], ['/camps', 'Find a Camp']], Resources: [['/about', 'About'], ['/faq', 'FAQs'], ['/contact', 'Contact']], Dashboards: [['/dashboard', 'User Dashboard'], ['/admin', 'Admin Demo']] }

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [session, setSession] = useState(getSession)
  const [sessionError, setSessionError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    const refresh = () => setSession(getSession())
    window.addEventListener('bloodconnect:session', refresh)
    return () => window.removeEventListener('bloodconnect:session', refresh)
  }, [])
  function exitDemo() {
    try { endDemoSession(); setSessionError(''); navigate('/') }
    catch (error) { setSessionError(error.message) }
  }
  useEffect(() => { setOpen(false); document.querySelectorAll('.nav-dropdown[open]').forEach(d => d.open = false) }, [location.pathname])
  useEffect(() => {
    const close = event => { if (event.key === 'Escape') { setOpen(false); document.querySelectorAll('.nav-dropdown[open]').forEach(d => { d.open = false; d.querySelector('summary')?.focus() }) } }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])
  return <>
    <div className="announcement"><span className="announcement-dot" /> A small act. A second chance. <span className="announcement-divider">|</span> <Link to="/donate">Make a difference <ArrowUpRight size={12} aria-hidden="true" /></Link><span className="demo-tag">COLLEGE PROJECT · DEMO</span></div>
    <header className="site-header"><div className="container nav-inner">
      <Brand />
      <button type="button" className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <nav id="main-navigation" aria-label="Main navigation" className={`main-nav ${open ? 'is-open' : ''}`}>
        <div className="nav-links"><NavLink to="/" end>Home</NavLink>{Object.entries(groups).map(([label,items])=><details className="nav-dropdown" key={label}><summary>{label}<span aria-hidden="true">⌄</span></summary><div>{items.map(([to,text])=><NavLink key={to} to={to}>{text}</NavLink>)}</div></details>)}</div>
        <div className="nav-account">{session ? <><button className="login-link" type="button" onClick={exitDemo}>Exit demo</button><Link to="/dashboard" className="button button-primary nav-signup">Dashboard <ArrowUpRight size={15} aria-hidden="true" /></Link></> : <><NavLink to="/login" className="login-link">Log in</NavLink><Link to="/signup" className="button button-primary nav-signup">Sign up <ArrowUpRight size={15} aria-hidden="true" /></Link></>}{sessionError && <p role="alert" className="field-error">{sessionError}</p>}</div>
      </nav>
    </div></header>
  </>
}
