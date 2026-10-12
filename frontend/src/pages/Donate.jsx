import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, CheckCircle2, HeartHandshake, LoaderCircle, ShieldCheck } from 'lucide-react';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import Input from '../components/Input.jsx';
import Select from '../components/Select.jsx';
import PageHeading from '../components/PageHeading.jsx';
import Notice from '../components/Notice.jsx';
import BloodBadge from '../components/BloodBadge.jsx';
import { BLOOD_GROUPS } from '../data/mockData.js';
import { saveDonor } from '../services/demoService.js';

const emptyForm = { name: '', age: '', bloodGroup: '', city: '', email: '', phone: '', availability: 'available', consent: false };
const fieldLabels = { name: 'Full name', age: 'Age', bloodGroup: 'Blood group', city: 'City', email: 'Email address', phone: 'Contact number', consent: 'Consent' };

function validate(form) {
  const errors = {};
  if (form.name.trim().length < 2) errors.name = 'Enter a fictional full name with at least 2 characters.';
  if (!Number.isInteger(Number(form.age)) || Number(form.age) < 18 || Number(form.age) > 65) errors.age = 'For this demo form, enter a whole-number age from 18 to 65.';
  if (!BLOOD_GROUPS.includes(form.bloodGroup)) errors.bloodGroup = 'Choose a blood group.';
  if (form.city.trim().length < 2) errors.city = 'Enter a city with at least 2 characters.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Enter a valid fictional email, such as alex@example.com.';
  const digits = form.phone.replace(/\D/g, '');
  if (!/^[+\d\s()-]+$/.test(form.phone) || digits.length < 7 || digits.length > 15) errors.phone = 'Enter a fictional phone number with 7 to 15 digits.';
  if (!form.consent) errors.consent = 'Confirm that you are using fictional information for this demo.';
  return errors;
}

export default function Donate() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [storageError, setStorageError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [savedDonor, setSavedDonor] = useState(null);
  const successRef = useRef(null);

  useEffect(() => { if (savedDonor) successRef.current?.focus(); }, [savedDonor]);

  function update(event) {
    const { name, value, type, checked } = event.target;
    setForm((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
    setStorageError('');
  }

  async function submit(event) {
    event.preventDefault();
    if (submitting) return;
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setStorageError('');
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => document.getElementById(`donor-${Object.keys(nextErrors)[0]}`)?.focus());
      return;
    }
    setSubmitting(true);
    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const record = saveDonor({ ...form, name: form.name.trim(), age: Number(form.age), city: form.city.trim(), email: form.email.trim(), phone: form.phone.trim() });
      setSavedDonor(record);
    } catch (error) {
      setStorageError(error.message || 'Your browser could not save this demo profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function startAgain() {
    setForm(emptyForm);
    setErrors({});
    setSavedDonor(null);
    requestAnimationFrame(() => document.getElementById('donor-name')?.focus());
  }

  return (
    <div className="page-shell">
      <PageHeading eyebrow="MAKE ROOM FOR KINDNESS" title="Every helping hand matters." description="Take a look at the first step of becoming a donor. Create a fictional profile and explore the BloodConnect experience." />
      <div className="form-layout">
        {savedDonor ? (
          <Card className="form-card success-panel">
            <div ref={successRef} tabIndex={-1} className="success-content" role="status">
              <div className="success-icon"><CheckCircle2 size={34} aria-hidden="true" /></div>
              <span className="eyebrow">SAVED IN THIS BROWSER</span>
              <h2>Your demo donor profile is ready.</h2>
              <p>Thanks for exploring, {savedDonor.name.split(' ')[0]}. Your fictional profile is saved locally and is available on your demo dashboard.</p>
              <div className="success-details"><BloodBadge group={savedDonor.bloodGroup} /><div><strong>{savedDonor.name}</strong><p className="muted">{savedDonor.city} · {savedDonor.availability === 'available' ? 'Available' : 'Unavailable'}</p></div></div>
              <Notice>This does not register you with a real blood bank. No information has been sent to a hospital or donor organization.</Notice>
            </div>
            <div className="form-actions"><Button to="/dashboard">Go to demo dashboard <ArrowRight size={16} aria-hidden="true" /></Button><Button type="button" variant="secondary" onClick={startAgain}>Create another demo profile</Button></div>
          </Card>
        ) : (
          <Card className="form-card">
            <div className="form-card-heading"><h2>Create your donor profile</h2><p className="muted">A small step to explore a meaningful idea.</p></div>
            <Notice><ShieldCheck size={19} aria-hidden="true" /><span><strong>Fictional information only.</strong> This demo stores your entries in this browser’s localStorage. Do not enter real personal or medical information.</span></Notice>
            <form onSubmit={submit} noValidate aria-busy={submitting}>
              {Object.values(errors).some(Boolean) && (
                <div className="error-summary" role="alert"><strong>Please check these details:</strong><ul>{Object.entries(errors).filter(([, message]) => message).map(([field, message]) => <li key={field}><a href={`#donor-${field}`}>{fieldLabels[field]}: {message}</a></li>)}</ul></div>
              )}
              {storageError && <div className="error-summary" role="alert">{storageError}</div>}
              <div className="field-grid">
                <Input id="donor-name" name="name" label="Full name" placeholder="Alex Morgan" autoComplete="off" maxLength={100} value={form.name} onChange={update} error={errors.name} required />
                <Input id="donor-age" name="age" label="Age" type="number" min="18" max="65" step="1" placeholder="24" value={form.age} onChange={update} error={errors.age} hint="Demo range: 18–65; not an eligibility check." required />
                <Select id="donor-bloodGroup" name="bloodGroup" label="Blood group" value={form.bloodGroup} onChange={update} error={errors.bloodGroup} required><option value="">Select blood group</option>{BLOOD_GROUPS.map((group) => <option key={group} value={group}>{group}</option>)}</Select>
                <Input id="donor-city" name="city" label="City" placeholder="Pune" autoComplete="off" maxLength={100} value={form.city} onChange={update} error={errors.city} required />
                <Input id="donor-email" name="email" label="Email address" type="email" placeholder="alex@example.com" autoComplete="off" maxLength={120} value={form.email} onChange={update} error={errors.email} required />
                <Input id="donor-phone" name="phone" label="Contact number" type="tel" placeholder="+1 202 555 0147" autoComplete="off" maxLength={24} value={form.phone} onChange={update} error={errors.phone} hint="Stored locally; never shown in donor search." required />
                <Select id="donor-availability" name="availability" label="Availability preference" value={form.availability} onChange={update} required><option value="available">Available in the demo</option><option value="unavailable">Not available right now</option></Select>
              </div>
              <div className="consent-field">
                <label className="checkbox-row" htmlFor="donor-consent"><input id="donor-consent" name="consent" type="checkbox" checked={form.consent} onChange={update} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? 'donor-consent-error' : undefined} required /><span>I am using fictional information and agree to save this demo profile in this browser. I understand this is not a real donor registration.</span></label>
                {errors.consent && <p id="donor-consent-error" className="field-error">{errors.consent}</p>}
              </div>
              <div className="form-actions"><Button type="submit" disabled={submitting}>{submitting ? <><LoaderCircle className="spin" size={17} aria-hidden="true" /> Saving demo profile…</> : <>Create demo donor profile <ArrowRight size={17} aria-hidden="true" /></>}</Button></div>
              <p className="field-hint">All fields are required. Nothing is sent to a hospital or blood bank.</p>
            </form>
          </Card>
        )}
        <aside className="form-sidebar">
          <div className="form-sidebar-icon"><HeartHandshake size={32} aria-hidden="true" /></div>
          <span className="eyebrow">A SIMPLE START</span>
          <h2>Good intentions.<br />Thoughtful connections.</h2>
          <p>This is a preview of how a donor community could come together.</p>
          <ol className="form-steps">
            <li className="form-step"><span className="step-number">01</span><div><strong>Create a fictional profile</strong><p>Explore the details a donor might share.</p></div></li>
            <li className="form-step"><span className="step-number">02</span><div><strong>Choose your availability</strong><p>See how a simple preference appears.</p></div></li>
            <li className="form-step"><span className="step-number">03</span><div><strong>Make it your own</strong><p>Review and edit your demo dashboard.</p></div></li>
          </ol>
          <div className="sidebar-note"><Check size={18} aria-hidden="true" /><p>Eligibility and transfusion compatibility must always be verified by hospitals and qualified medical professionals.</p></div>
          <p className="sidebar-disclaimer">BloodConnect is a student project and is not an emergency service.</p>
        </aside>
      </div>
    </div>
  );
}
