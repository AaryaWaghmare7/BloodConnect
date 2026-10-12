import { useState } from 'react';
import { ArrowRight, CalendarDays, Check, Heart, MapPin, Pencil, Plus, Search, ShieldCheck, Trash2, Users } from 'lucide-react';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Select from '../components/Select.jsx';
import Card from '../components/Card.jsx';
import PageHeading from '../components/PageHeading.jsx';
import Notice from '../components/Notice.jsx';
import BloodBadge from '../components/BloodBadge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { BLOOD_GROUPS, DEMO_PROFILE, sampleDonors, sampleRequests } from '../data/mockData.js';
import { clearDemoData, getProfile, getRequests, updateProfile } from '../services/demoService.js';

function readDashboard() {
  try {
    return { profile: getProfile(), requests: getRequests(), error: '' };
  } catch (error) {
    return { profile: { ...DEMO_PROFILE }, requests: [...sampleRequests], error: error.message };
  }
}

function validateProfile(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = 'Enter at least two characters.';
  if (values.city.trim().length < 2) errors.city = 'Enter a city with at least two characters.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Enter a valid fictional email address.';
  const digits = values.phone.replace(/\D/g, '');
  if (!/^[+\d\s()-]+$/.test(values.phone) || digits.length < 7 || digits.length > 18) errors.phone = 'Use a fictional number with 7–18 digits.';
  if (!Number.isInteger(Number(values.age)) || Number(values.age) < 18 || Number(values.age) > 65) errors.age = 'Enter an age from 18 to 65 for this demo.';
  return errors;
}

export default function Dashboard() {
  const [data, setData] = useState(readDashboard);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(data.profile);
  const [fieldErrors, setFieldErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const { profile, requests } = data;
  const available = profile.availability === 'available';
  const firstName = profile.name.split(' ')[0];
  const initials = profile.name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('');

  function editField(event) {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: '' }));
  }

  function saveProfile(event) {
    event.preventDefault();
    const errors = validateProfile(draft);
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      setFeedback({ tone: 'error', message: 'Please check the highlighted profile fields.' });
      requestAnimationFrame(() => document.querySelector(`.profile-edit-form [name="${Object.keys(errors)[0]}"]`)?.focus());
      return;
    }
    try {
      const saved = updateProfile(draft);
      setData((current) => ({ ...current, profile: saved, error: '' }));
      setEditing(false);
      setFeedback({ tone: 'success', message: 'Your fictional demo profile was saved in this browser.' });
    } catch (error) {
      setFeedback({ tone: 'error', message: error.message });
    }
  }

  function toggleAvailability() {
    try {
      const saved = updateProfile({ availability: available ? 'unavailable' : 'available' });
      setData((current) => ({ ...current, profile: saved, error: '' }));
      setFeedback({ tone: 'success', message: `Demo availability set to ${saved.availability === 'available' ? 'available' : 'taking a break'}. This does not notify anyone.` });
    } catch (error) {
      setFeedback({ tone: 'error', message: error.message });
    }
  }

  function clearSavedData() {
    try {
      clearDemoData();
      const refreshed = readDashboard();
      setData(refreshed);
      setDraft(refreshed.profile);
      setEditing(false);
      setConfirmClear(false);
      setFeedback({ tone: 'success', message: 'Saved demo registrations, requests, and profile changes were cleared. Fictional sample data has been restored.' });
    } catch (error) {
      setFeedback({ tone: 'error', message: error.message });
    }
  }

  return <div className="page-shell dashboard-page">
    <div className="dashboard-heading">
      <PageHeading eyebrow="Your little corner of impact" title={`Welcome back, ${firstName}.`} description="Good to see you. Here’s a look at your demo donor profile and community." />
      <span className="demo-label"><ShieldCheck size={14} aria-hidden="true" /> Demo dashboard</span>
    </div>
    <Notice>This is a fictional demo. Profile changes stay in this browser, and sample requests do not represent real patients or hospital needs.</Notice>
    {data.error && <Notice tone="error" role="alert">{data.error}</Notice>}
    {feedback && <Notice tone={feedback.tone} role={feedback.tone === 'error' ? 'alert' : 'status'}>{feedback.message}</Notice>}

    <section className="dashboard-stats" aria-label="Fictional sample data statistics">
      <Card className="stat-card"><span className="stat-icon"><Users size={21} aria-hidden="true" /></span><div><p className="stat-number">{sampleDonors.length}</p><p>Sample donors</p><small>Fictional directory records</small></div></Card>
      <Card className="stat-card"><span className="stat-icon"><Heart size={21} aria-hidden="true" /></span><div><p className="stat-number">{sampleDonors.filter((donor) => donor.available).length}</p><p>Available in the sample</p><small>Illustrative availability only</small></div></Card>
      <Card className="stat-card"><span className="stat-icon"><CalendarDays size={21} aria-hidden="true" /></span><div><p className="stat-number">{sampleRequests.length}</p><p>Sample requests</p><small>No real blood requests</small></div></Card>
    </section>

    <div className="dashboard-grid">
      <Card className="profile-card">
        <div className="card-heading"><h2>Your donor profile</h2>{!editing && <Button variant="ghost" onClick={() => { setDraft({ ...profile }); setFieldErrors({}); setFeedback(null); setEditing(true); }}><Pencil size={15} aria-hidden="true" /> Edit</Button>}</div>
        {editing ? <form onSubmit={saveProfile} noValidate className="profile-edit-form">
          <p className="muted">Use fictional details only. Changes stay in this browser.</p>
          <Input label="Full name" name="name" value={draft.name} onChange={editField} error={fieldErrors.name} required maxLength={100} autoComplete="off" />
          <div className="field-grid">
            <Select label="Blood group" name="bloodGroup" value={draft.bloodGroup} onChange={editField} required>{BLOOD_GROUPS.map((group) => <option key={group}>{group}</option>)}</Select>
            <Input label="Age" name="age" value={draft.age} onChange={editField} error={fieldErrors.age} type="number" min="18" max="65" required />
          </div>
          <Input label="City" name="city" value={draft.city} onChange={editField} error={fieldErrors.city} required maxLength={100} autoComplete="off" />
          <Input label="Email" name="email" value={draft.email} onChange={editField} error={fieldErrors.email} type="email" maxLength={120} required autoComplete="off" />
          <Input label="Contact number" name="phone" value={draft.phone} onChange={editField} error={fieldErrors.phone} type="tel" maxLength={24} required autoComplete="off" />
          <Select label="Availability preference" name="availability" value={draft.availability} onChange={editField}><option value="available">Available</option><option value="unavailable">Taking a break</option></Select>
          <div className="form-actions"><Button type="submit"><Check size={16} aria-hidden="true" /> Save profile</Button><Button variant="secondary" onClick={() => { setEditing(false); setFieldErrors({}); setFeedback(null); }}>Cancel</Button></div>
        </form> : <>
          <div className="profile-identity"><span className="profile-avatar" aria-hidden="true">{initials}</span><div><h3>{profile.name}</h3><p><MapPin size={14} aria-hidden="true" /> {profile.city}</p><span className="sample-tag">Fictional demo profile</span></div><BloodBadge group={profile.bloodGroup} size="large" /></div>
          <dl className="profile-details"><div><dt>Email address</dt><dd>{profile.email}</dd></div><div><dt>Contact number</dt><dd>{profile.phone}</dd></div><div><dt>Age</dt><dd>{profile.age} years <span className="muted">· demo value</span></dd></div></dl>
          <div className="availability-setting"><div><strong>Donation availability</strong><p>{available ? 'Available in your demo profile' : 'Taking a break in your demo profile'}</p></div><button className={`toggle-switch ${available ? 'is-on' : ''}`} role="switch" aria-checked={available} aria-label="Donation availability" onClick={toggleAvailability}><span /></button></div>
          <p className="profile-fine-print">Your preference does not confirm eligibility. A qualified medical professional must assess every donation.</p>
        </>}
      </Card>

      <div className="dashboard-main">
        <Card className="requests-card">
          <div className="card-heading"><div><p className="eyebrow">For demonstration only</p><h2>Recent demo requests</h2></div><span className="count-pill">{requests.length}</span></div>
          {requests.length ? <ul className="request-list">{requests.slice(0, 4).map((request) => <li className="request-row" key={request.id}><BloodBadge group={request.bloodGroup} /><div className="request-info"><h3>{request.hospital}</h3><p><MapPin size={13} aria-hidden="true" /> {request.city}<span aria-hidden="true"> · </span>{new Date(`${request.requiredDate}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p><span className="sample-tag">{request.source === 'local' ? 'Saved in this browser' : 'Fictional sample'}</span></div><span className="status-pill">Demo</span></li>)}</ul> : <EmptyState title="No demo requests yet" description="Create a fictional request to see it here." />}
          <p className="requests-note">Submitting a demo request does not contact a hospital or arrange blood.</p>
          <Button to="/request-blood" variant="secondary">Create a demo request<ArrowRight size={15} aria-hidden="true" /></Button>
        </Card>

        <section className="quick-actions" aria-labelledby="quick-actions-title"><h2 id="quick-actions-title">Make your next move</h2><div className="quick-action-grid"><Button to="/find-donors" variant="secondary"><Search size={18} aria-hidden="true" /><span>Explore sample donors</span><ArrowRight size={15} aria-hidden="true" /></Button><Button to="/donate" variant="secondary"><Plus size={18} aria-hidden="true" /><span>Try donor registration</span><ArrowRight size={15} aria-hidden="true" /></Button></div></section>
      </div>
    </div>

    <section className="demo-data-controls" aria-labelledby="demo-data-title"><div><h2 id="demo-data-title">Your demo data, your control.</h2><p>Clear registrations, requests, and profile edits saved by BloodConnect in this browser.</p></div>{confirmClear ? <div className="clear-confirmation"><p>This will remove your saved demo records. Continue?</p><div className="form-actions"><Button variant="danger" onClick={clearSavedData}>Yes, clear demo data</Button><Button variant="secondary" onClick={() => setConfirmClear(false)}>Keep data</Button></div></div> : <Button variant="ghost" onClick={() => setConfirmClear(true)}><Trash2 size={16} aria-hidden="true" /> Clear saved demo data</Button>}</section>
  </div>;
}
