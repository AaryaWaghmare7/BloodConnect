import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, HeartHandshake, LockKeyhole, ShieldCheck } from 'lucide-react';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Card from '../components/Card.jsx';
import Notice from '../components/Notice.jsx';
import { DEMO_PROFILE } from '../data/mockData.js';
import { startDemoSession } from '../services/demoService.js';

// Read-only fictional values intentionally prevent the collection of real credentials.
const DEMO_PASSWORD = 'DemoPreviewOnly!';

export default function Auth({ mode = 'login' }) {
  const isSignup = mode === 'signup';
  const navigate = useNavigate();
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setError('');
    const fields = new FormData(event.currentTarget);
    if (fields.get('demo-email') !== DEMO_PROFILE.email || fields.get('demo-password') !== DEMO_PASSWORD || (isSignup && (fields.get('demo-name') !== DEMO_PROFILE.name || fields.get('demo-confirm') !== DEMO_PASSWORD))) {
      setError('Use the fixed fictional details provided for this demo. Reload the page to restore them.');
      return;
    }
    try {
      startDemoSession();
      navigate('/dashboard');
    } catch (cause) {
      setError(cause.message);
    }
  }

  return <div className="page-shell auth-shell">
    <aside className="auth-story">
      <div className="auth-story-icon"><HeartHandshake size={44} strokeWidth={1.5} aria-hidden="true" /></div>
      <p className="eyebrow">Small acts. Lasting impact.</p>
      <h2>A community that<br />shows up for life.</h2>
      <p>Explore a more connected way to give. Your demo dashboard brings your donor profile and sample requests into one thoughtful space.</p>
      <div className="auth-story-note"><ShieldCheck size={21} aria-hidden="true" /><span>Fictional details. A real idea worth building.</span></div>
      <div className="auth-quote"><span aria-hidden="true">“</span><p>Sometimes, making a difference starts with simply being there.</p><small>The spirit of BloodConnect</small></div>
    </aside>

    <Card className="auth-card">
      <span className="demo-label"><LockKeyhole size={13} aria-hidden="true" /> Frontend demo</span>
      <h1>{isSignup ? 'A good place to start.' : 'Welcome back.'}</h1>
      <p className="auth-description">{isSignup ? 'Preview the signup experience with a fictional profile.' : 'Step into your BloodConnect demo dashboard.'}</p>
      <Notice>These fixed, read-only details are fictional. Continue to open a temporary demo session. No real account is created, and no password is stored.</Notice>
      <form onSubmit={handleSubmit} className="auth-form" noValidate autoComplete="off">
        {isSignup && <Input label="Full name" name="demo-name" value={DEMO_PROFILE.name} readOnly required hint="Fixed fictional profile" />}
        <Input label="Email address" name="demo-email" type="email" value={DEMO_PROFILE.email} readOnly required />
        <Input label="Password" name="demo-password" type="password" value={DEMO_PASSWORD} readOnly required hint="A fixed demo placeholder. Please do not enter real credentials." autoComplete="off" />
        {isSignup && <Input label="Confirm password" name="demo-confirm" type="password" value={DEMO_PASSWORD} readOnly required autoComplete="off" />}
        {error && <Notice tone="error" role="alert">{error}</Notice>}
        <Button type="submit" className="full-width">{isSignup ? 'Try the demo signup' : 'Enter demo dashboard'}<ArrowRight size={17} aria-hidden="true" /></Button>
      </form>
      <p className="auth-switch">{isSignup ? 'Already exploring?' : 'New to BloodConnect?'} <Link to={isSignup ? '/login' : '/signup'}>{isSignup ? 'View demo login' : 'Preview signup'}</Link></p>
      <p className="auth-footnote">Session lasts for this browser tab. This preview does not provide secure authentication.</p>
    </Card>
  </div>;
}
