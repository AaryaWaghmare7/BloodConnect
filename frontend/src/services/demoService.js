import { BLOOD_GROUPS, DEMO_PROFILE, sampleDonors, sampleRequests, sampleBanks, sampleCamps } from '../data/mockData.js';

// Replace this module with API calls when the Spring Boot backend is ready.
// This browser-only demo has no authentication, messaging, or hospital integration.
export const STORAGE_KEY = 'bloodconnect.demo.v1';
export const SESSION_KEY = 'bloodconnect.session.v1';
const MAX_RECORDS = 200;
const emptyStore = () => ({ version: 1, donors: [], requests: [], profile: null });

function storage(kind = 'localStorage') {
  try {
    const target = globalThis[kind];
    if (!target) throw new Error('Unavailable');
    return target;
  } catch {
    throw new Error('Browser storage is unavailable. Enable storage for this site to use the demo.');
  }
}

function announce(name) {
  if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') {
    window.dispatchEvent(new CustomEvent(name));
  }
}

function requiredText(value, label, max = 100) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) {
    throw new Error(`Enter a valid ${label.toLowerCase()} (up to ${max} characters).`);
  }
  return value.trim();
}

function bloodGroup(value) {
  // Accept the keyboard hyphen as well as the typographic minus shown in the UI.
  const group = typeof value === 'string' ? value.replace('-', '−') : value;
  if (!BLOOD_GROUPS.includes(group)) throw new Error('Choose a blood group from the list.');
  return group;
}

function availability(value) {
  if (value === true || value === 'available') return 'available';
  if (value === false || value === 'unavailable') return 'unavailable';
  throw new Error('Choose an availability preference.');
}

function profileFields(values) {
  if (!values || typeof values !== 'object') throw new Error('Please check your demo profile details.');
  const email = requiredText(values.email, 'email address', 120);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.');
  const phone = requiredText(values.phone, 'contact number', 24);
  const digits = phone.replace(/\D/g, '');
  if (!/^[+\d\s()-]+$/.test(phone) || digits.length < 7 || digits.length > 18) {
    throw new Error('Enter a valid demo contact number with 7–18 digits.');
  }
  const age = Number(values.age);
  if (!Number.isInteger(age) || age < 18 || age > 65) {
    throw new Error('For this demo, enter an age between 18 and 65. This does not confirm donor eligibility.');
  }
  return {
    name: requiredText(values.name, 'full name'), age,
    bloodGroup: bloodGroup(values.bloodGroup), city: requiredText(values.city, 'city'),
    email, phone, availability: availability(values.availability),
  };
}

function requestFields(values) {
  if (!values || typeof values !== 'object') throw new Error('Please check your demo request details.');
  const requiredDate = requiredText(values.requiredDate, 'required date', 10);
  const parsedDate = new Date(`${requiredDate}T12:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(requiredDate) || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== requiredDate) {
    throw new Error('Choose a valid required date.');
  }
  const notes = typeof values.notes === 'string' ? values.notes.trim() : '';
  if (notes.length > 1000) throw new Error('Keep demo notes to 1,000 characters or fewer.');
  return {
    name: requiredText(values.name, 'name'), bloodGroup: bloodGroup(values.bloodGroup),
    city: requiredText(values.city, 'city'), hospital: requiredText(values.hospital, 'hospital name'),
    requiredDate, contact: requiredText(values.contact, 'contact information', 120), notes,
  };
}

function metadata(record) {
  if (typeof record.id !== 'string' || !record.id || typeof record.createdAt !== 'string' || Number.isNaN(Date.parse(record.createdAt))) {
    throw new Error('Invalid saved record');
  }
  return { id: record.id, createdAt: record.createdAt, source: 'local' };
}

function readStore() {
  let raw;
  try { raw = storage().getItem(STORAGE_KEY); }
  catch { throw new Error('Saved demo data could not be read. Allow browser storage and try again.'); }
  if (raw === null) return emptyStore();
  try {
    const value = JSON.parse(raw);
    if (!value || value.version !== 1 || !Array.isArray(value.donors) || !Array.isArray(value.requests) || value.donors.length > MAX_RECORDS || value.requests.length > MAX_RECORDS) {
      throw new Error('Invalid saved data');
    }
    return {
      version: 1,
      donors: value.donors.map((record) => ({ ...profileFields(record), ...metadata(record), consent: record.consent === true })),
      requests: value.requests.map((record) => ({ ...requestFields(record), ...metadata(record) })),
      profile: value.profile === null ? null : profileFields(value.profile),
    };
  } catch {
    throw new Error('Saved demo data is unreadable. Use “Clear saved demo data” on the dashboard to start again.');
  }
}

function writeStore(value) {
  try { storage().setItem(STORAGE_KEY, JSON.stringify(value)); }
  catch { throw new Error('Your demo data could not be saved. Browser storage may be full or disabled. No changes were saved.'); }
  announce('bloodconnect:data');
}

function newMetadata() {
  const id = globalThis.crypto?.randomUUID?.() ?? `demo-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return { id, createdAt: new Date().toISOString(), source: 'local' };
}

export function getDonors({ bloodGroup: group = '', city = '', availableOnly = false } = {}) {
  const cityQuery = String(city).trim().toLocaleLowerCase();
  const groupQuery = String(group).replace('-', '−');
  return sampleDonors
    .filter((donor) => (!groupQuery || donor.bloodGroup === groupQuery) && (!cityQuery || donor.city.toLocaleLowerCase().includes(cityQuery)) && (!availableOnly || donor.available))
    // Explicit allowlist: private contact information and submitted profiles never enter search.
    .map(({ id, name, bloodGroup, city, available, availability, initials }) => ({ id, name, bloodGroup, city, available, availability, initials, source: 'sample' }));
}

export function getRequests() {
  const saved = readStore().requests;
  return [...saved.slice().reverse(), ...sampleRequests.map((request) => ({ ...request }))];
}

export function saveDonor(values) {
  const profile = profileFields(values);
  if (values.consent !== true) throw new Error('Please consent to saving fictional demo details in this browser.');
  const store = readStore();
  if (store.donors.length >= MAX_RECORDS) throw new Error('The demo record limit has been reached. Clear saved demo data before adding more.');
  const donor = { ...profile, consent: true, ...newMetadata() };
  writeStore({ ...store, donors: [...store.donors, donor], profile });
  return { ...donor };
}

export function saveRequest(values) {
  const fields = requestFields(values);
  const store = readStore();
  if (store.requests.length >= MAX_RECORDS) throw new Error('The demo record limit has been reached. Clear saved demo data before adding more.');
  const request = { ...fields, ...newMetadata() };
  writeStore({ ...store, requests: [...store.requests, request] });
  return { ...request };
}

export function getProfile() {
  return { ...(readStore().profile ?? DEMO_PROFILE) };
}

export function updateProfile(values) {
  const store = readStore();
  const profile = profileFields({ ...(store.profile ?? DEMO_PROFILE), ...values });
  writeStore({ ...store, profile });
  return { ...profile };
}

export function getSession() {
  try {
    const raw = storage('sessionStorage').getItem(SESSION_KEY);
    if (raw !== 'demo-active') return null;
    return { name: DEMO_PROFILE.name, email: DEMO_PROFILE.email, isDemo: true };
  } catch {
    return null;
  }
}

export function startDemoSession() {
  try { storage('sessionStorage').setItem(SESSION_KEY, 'demo-active'); }
  catch { throw new Error('The demo session could not be started. Enable browser session storage and try again.'); }
  announce('bloodconnect:session');
  return { name: DEMO_PROFILE.name, email: DEMO_PROFILE.email, isDemo: true };
}

export function endDemoSession() {
  try { storage('sessionStorage').removeItem(SESSION_KEY); }
  catch { throw new Error('The demo session could not be cleared. Please allow browser storage and try again.'); }
  announce('bloodconnect:session');
}

export function clearDemoData() {
  try { storage().removeItem(STORAGE_KEY); }
  catch { throw new Error('Saved demo data could not be cleared. Please allow browser storage and try again.'); }
  announce('bloodconnect:data');
}

export function getDirectory(kind, { city = '', bloodGroup = '', availableOnly = false } = {}) {
 const rows = kind === 'camps' ? sampleCamps : sampleBanks
 return rows.filter(r => r.city.toLowerCase().includes(city.trim().toLowerCase()) && (!bloodGroup || r.groups?.includes(bloodGroup.replace('-', '−'))) && (!availableOnly || r.available)).map(r => ({ ...r, ...(r.groups && { groups: [...r.groups] }) }))
}
