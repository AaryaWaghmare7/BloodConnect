import { Link } from 'react-router-dom'
import { Heart, ArrowUpRight } from 'lucide-react'
import Brand from './Brand'

export default function Footer() {
  return <footer className="site-footer"><div className="container">
    <div className="footer-top"><div className="footer-brand"><Brand /><p>Connecting donors. Bringing hope.<br />One meaningful connection at a time.</p></div>
      <div className="footer-links"><h3>Make a connection</h3><Link to="/find-donors">Find a donor</Link><Link to="/donate">Become a donor</Link><Link to="/request-blood">Request blood</Link><Link to="/blood-banks">Blood bank directory</Link><Link to="/camps">Donation camps</Link></div>
      <div className="footer-links"><h3>Get to know us</h3><Link to="/about">Our purpose</Link><Link to="/#how-it-works">How it works</Link><Link to="/faq">Common questions</Link><Link to="/contact">Contact</Link></div>
      <div className="footer-project"><span className="eyebrow">BUILT WITH PURPOSE</span><p>A college mini-project imagining a more connected donation community.</p><Link to="/about">About the project <ArrowUpRight size={14} aria-hidden="true" /></Link></div>
    </div>
    <div className="footer-disclaimer"><Heart size={17} aria-hidden="true" /><p>Demonstration only. Use fictional information. This is not an emergency service. Hospitals and qualified medical professionals must verify donor eligibility and transfusion compatibility.</p></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} BloodConnect. A college project.</span><span>Made with care. Designed for connection.</span><Link to="/admin">Admin demo</Link><Link to="/dashboard">User dashboard <ArrowUpRight size={13} aria-hidden="true" /></Link></div>
  </div></footer>
}
