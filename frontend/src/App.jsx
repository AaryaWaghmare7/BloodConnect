import { Component, useEffect } from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import FindDonors from './pages/FindDonors'
import Donate from './pages/Donate'
import RequestBlood from './pages/RequestBlood'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Directory from './pages/Directory'
import Resources from './pages/Resources'
import AdminDashboard from './pages/AdminDashboard'

const titles = { '/': 'Connecting Donors, Saving Lives', '/find-donors': 'Find a Donor', '/donate': 'Become a Donor', '/request-blood': 'Request Blood', '/login': 'Demo Login', '/signup': 'Demo Signup', '/dashboard': 'Your Demo Dashboard', '/about': 'Our Purpose', '/blood-banks': 'Blood Bank Directory', '/camps': 'Donation Camps', '/admin': 'Admin Demo', '/faq': 'FAQs', '/contact': 'Contact' }

function RouteEffects() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    document.title = `BloodConnect — ${titles[pathname] || 'Page Not Found'}`
    if (hash) { requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })) }
    else { window.scrollTo(0, 0); document.getElementById('main-content')?.focus({ preventScroll: true }) }
  }, [pathname, hash])
  return null
}

class ErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return <div className="page-shell empty-state"><h1>Something didn’t load.</h1><p>Try refreshing to reopen the demo.</p><button className="button button-primary" onClick={() => window.location.reload()}>Try again</button></div>
    return this.props.children
  }
}

export default function App() {
  return <><a href="#main-content" className="skip-link">Skip to content</a><Navbar /><main id="main-content" tabIndex={-1}><ErrorBoundary><RouteEffects /><Routes>
    <Route path="/" element={<Home />} /><Route path="/find-donors" element={<FindDonors />} /><Route path="/donate" element={<Donate />} /><Route path="/request-blood" element={<RequestBlood />} /><Route path="/login" element={<Auth mode="login" />} /><Route path="/signup" element={<Auth mode="signup" />} /><Route path="/dashboard" element={<Dashboard />} /><Route path="/about" element={<About />} />
    <Route path="/blood-banks" element={<Directory />} /><Route path="/camps" element={<Directory camps />} /><Route path="/faq" element={<Resources />} /><Route path="/contact" element={<Resources contact />} /><Route path="/admin" element={<AdminDashboard />} />
    <Route path="*" element={<div className="page-shell empty-state"><span className="eyebrow">404 · A LITTLE LOST?</span><h1>Let’s find your way back.</h1><p>The page you’re looking for doesn’t exist.</p><Link className="button button-primary" to="/">Back to home</Link></div>} />
  </Routes></ErrorBoundary></main><Footer /></>
}
