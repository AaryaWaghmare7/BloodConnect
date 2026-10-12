import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ClipboardPlus, LoaderCircle, ShieldCheck } from 'lucide-react';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import Input from '../components/Input.jsx';
import Select from '../components/Select.jsx';
import PageHeading from '../components/PageHeading.jsx';
import Notice from '../components/Notice.jsx';
import BloodBadge from '../components/BloodBadge.jsx';
import { BLOOD_GROUPS } from '../data/mockData.js';
import { saveRequest } from '../services/demoService.js';

const emptyForm = { name: '', bloodGroup: '', city: '', hospital: '', requiredDate: '', contact: '', notes: '' };
const fieldLabels = { name: 'Requester name', bloodGroup: 'Blood group', city: 'City', hospital: 'Hospital', requiredDate: 'Required date', contact: 'Contact information', notes: 'Additional notes' };

function localDateString(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function validate(form) {
  const errors = {};
  if (form.name.trim().length < 2) errors.name = 'Enter a fictional requester name with at least 2 characters.';
  if (!BLOOD_GROUPS.includes(form.bloodGroup)) errors.bloodGroup = 'Choose the required blood group.';
  if (form.city.trim().length < 2) errors.city = 'Enter a city with at least 2 characters.';
  if (form.hospital.trim().length < 2) errors.hospital = 'Enter a fictional hospital name.';
  const date = new Date(`${form.requiredDate}T12:00:00`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(form.requiredDate) || Number.isNaN(date.getTime()) || localDateString(date) !== form.requiredDate) errors.requiredDate = 'Choose a valid required date.';
  else if (form.requiredDate < localDateString()) errors.requiredDate = 'Choose today or a future date.';
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact.trim());
  const digits = form.contact.replace(/\D/g, '');
  const isPhone = /^[+\d\s()-]+$/.test(form.contact) && digits.length >= 7 && digits.length <= 15;
  if (!isEmail && !isPhone) errors.contact = 'Enter a fictional email address or a phone number with 7 to 15 digits.';
  if (form.notes.length > 1000) errors.notes = 'Keep notes under 1,000 characters.';
  return errors;
}

export default function RequestBlood() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(() => ({ ...emptyForm, bloodGroup: BLOOD_GROUPS.includes(searchParams.get('bloodGroup')) ? searchParams.get('bloodGroup') : '', city: (searchParams.get('city') || '').slice(0, 100) }));
  const [errors, setErrors] = useState({});
  const [storageError, setStorageError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [savedRequest, setSavedRequest] = useState(null);
  const successRef = useRef(null);

  useEffect(() => { if (savedRequest) successRef.current?.focus(); }, [savedRequest]);

  function update(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
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
      requestAnimationFrame(() => document.getElementById(`request-${Object.keys(nextErrors)[0]}`)?.focus());
      return;
    }
    setSubmitting(true);
    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const record = saveRequest(Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()])));
      setSavedRequest(record);
    } catch (error) {
      setStorageError(error.message || 'Your browser could not save this demo request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function startAgain() {
    setForm(emptyForm);
    setErrors({});
    setSavedRequest(null);
    requestAnimationFrame(() => document.getElementById('request-name')?.focus());
  }

  return (
    <div className="page-shell">
      <PageHeading eyebrow="A CONNECTION BEGINS HERE" title="When care brings us together." description="Explore a simpler way to describe a blood request. Use fictional details to see how the experience works." />
      <div className="form-layout">
        {savedRequest ? (
          <Card className="form-card success-panel">
            <div ref={successRef} tabIndex={-1} className="success-content" role="status">
              <div className="success-icon"><CheckCircle2 size={34} aria-hidden="true" /></div>
              <span className="eyebrow">SAVED IN THIS BROWSER</span>
              <h2>Your demo request is saved.</h2>
              <p>This fictional request is now part of your local demo dashboard.</p>
              <div className="success-details"><BloodBadge group={savedRequest.bloodGroup} /><div><strong>{savedRequest.hospital}</strong><p className="muted">{savedRequest.city} · {new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${savedRequest.requiredDate}T12:00:00`))}</p></div></div>
              <Notice>No hospital or donor has been notified. This demo does not arrange blood, reserve donations, or provide emergency assistance.</Notice>
            </div>
            <div className="form-actions"><Button to="/dashboard">View demo dashboard <ArrowRight size={16} aria-hidden="true" /></Button><Button type="button" variant="secondary" onClick={startAgain}>Create another demo request</Button></div>
          </Card>
        ) : (
          <Card className="form-card">
            <div className="form-card-heading"><h2>Create a demo blood request</h2><p className="muted">A clearer picture of what is needed.</p></div>
            <Notice><ShieldCheck size={19} aria-hidden="true" /><span><strong>Use fictional information only.</strong> Entries stay in this browser’s localStorage. Do not enter real patient details, contact information, or medical records.</span></Notice>
            <form onSubmit={submit} noValidate aria-busy={submitting}>
              {Object.values(errors).some(Boolean) && (
                <div className="error-summary" role="alert"><strong>Please check these details:</strong><ul>{Object.entries(errors).filter(([, message]) => message).map(([field, message]) => <li key={field}><a href={`#request-${field}`}>{fieldLabels[field]}: {message}</a></li>)}</ul></div>
              )}
              {storageError && <div className="error-summary" role="alert">{storageError}</div>}
              <div className="field-grid">
                <Input id="request-name" name="name" label="Patient or requester name" placeholder="Jordan Taylor" autoComplete="off" maxLength={100} value={form.name} onChange={update} error={errors.name} required />
                <Select id="request-bloodGroup" name="bloodGroup" label="Required blood group" value={form.bloodGroup} onChange={update} error={errors.bloodGroup} required><option value="">Select blood group</option>{BLOOD_GROUPS.map((group) => <option key={group} value={group}>{group}</option>)}</Select>
                <Input id="request-city" name="city" label="City" placeholder="Pune" autoComplete="off" maxLength={100} value={form.city} onChange={update} error={errors.city} required />
                <Input id="request-hospital" name="hospital" label="Hospital name" placeholder="Example Community Hospital" autoComplete="off" maxLength={100} value={form.hospital} onChange={update} error={errors.hospital} required />
                <Input id="request-requiredDate" name="requiredDate" label="Required date" type="date" min={localDateString()} value={form.requiredDate} onChange={update} error={errors.requiredDate} required />
                <Input id="request-contact" name="contact" label="Contact information" placeholder="jordan@example.com" autoComplete="off" maxLength={120} value={form.contact} onChange={update} error={errors.contact} hint="A fictional email or phone number." required />
              </div>
              <div className="field"><label htmlFor="request-notes">Additional notes <span className="muted">(optional)</span></label><textarea id="request-notes" className="input" name="notes" rows={4} maxLength={1000} value={form.notes} onChange={update} placeholder="Add a fictional note for this demo request…" aria-invalid={Boolean(errors.notes)} aria-describedby={errors.notes ? 'request-notes-error' : 'request-notes-hint'} />{errors.notes ? <p id="request-notes-error" className="field-error">{errors.notes}</p> : <p id="request-notes-hint" className="field-hint">{form.notes.length}/1,000 characters. Please leave out real medical information.</p>}</div>
              <div className="form-actions"><Button type="submit" disabled={submitting}>{submitting ? <><LoaderCircle className="spin" size={17} aria-hidden="true" /> Saving demo request…</> : <>Save demo request <ArrowRight size={17} aria-hidden="true" /></>}</Button></div>
              <p className="field-hint">All fields except notes are required. Saving does not notify a hospital or arrange blood.</p>
            </form>
          </Card>
        )}
        <aside className="form-sidebar">
          <div className="form-sidebar-icon"><ClipboardPlus size={32} aria-hidden="true" /></div>
          <span className="eyebrow">CARE, WITH CLARITY</span>
          <h2>Every detail helps<br />tell the story.</h2>
          <p>Explore the concept of bringing the right information into one place.</p>
          <ol className="form-steps">
            <li className="form-step"><span className="step-number">01</span><div><strong>Add fictional request details</strong><p>Choose a group, city, and required date.</p></div></li>
            <li className="form-step"><span className="step-number">02</span><div><strong>Save a local demo record</strong><p>Your browser keeps it for this experience.</p></div></li>
            <li className="form-step"><span className="step-number">03</span><div><strong>Review your dashboard</strong><p>See the request alongside sample records.</p></div></li>
          </ol>
          <div className="sidebar-note"><ShieldCheck size={20} aria-hidden="true" /><p>Hospitals and qualified medical professionals must verify all donor eligibility and transfusion compatibility.</p></div>
          <p className="sidebar-disclaimer">BloodConnect is not an emergency service. For an actual urgent need, contact the treating hospital or local emergency services directly.</p>
        </aside>
      </div>
    </div>
  );
}
