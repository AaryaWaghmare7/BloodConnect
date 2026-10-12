import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_PROFILE, sampleDonors, sampleRequests } from '../data/mockData.js';
import {
  STORAGE_KEY, SESSION_KEY, getDonors, getRequests, saveDonor, saveRequest,
  getProfile, updateProfile, getSession, startDemoSession, endDemoSession, clearDemoData, getDirectory,
} from './demoService.js';

class MemoryStorage {
  values = new Map();
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}

beforeEach(() => {
  Object.defineProperty(globalThis, 'localStorage', { value: new MemoryStorage(), configurable: true });
  Object.defineProperty(globalThis, 'sessionStorage', { value: new MemoryStorage(), configurable: true });
});

const donor = () => ({ ...DEMO_PROFILE, name: 'Fictional Local Person', consent: true });
const request = () => ({ name: 'Example Requester', bloodGroup: 'O+', city: 'Pune', hospital: 'Example Hospital', requiredDate: '2026-12-10', contact: 'fictional@example.com', notes: 'A fictional demonstration only.' });

test('donor filters combine group, case-insensitive city, and availability', () => {
  assert.deepEqual(getDonors({ bloodGroup: 'O+', city: '  PUNE ', availableOnly: true }).map((item) => item.id), ['sample-donor-1']);
  assert.equal(getDonors({ bloodGroup: 'O-', city: 'bengaluru' })[0].bloodGroup, 'O−');
  assert.equal(getDonors({ bloodGroup: 'B−', availableOnly: true }).length, 0);
  assert.equal(getDonors({ city: 'No-such-city' }).length, 0);
});

test('private registrations never appear in public donor search', () => {
  const saved = saveDonor({ ...donor(), password: 'must-not-persist', address: 'must-not-persist' });
  assert.equal(getDonors().length, sampleDonors.length);
  assert.ok(getDonors().every((item) => item.name !== saved.name && !('email' in item) && !('phone' in item) && !('address' in item)));
  assert.equal(localStorage.getItem(STORAGE_KEY).includes('must-not-persist'), false);
  assert.equal(getProfile().name, saved.name);
});

test('registration requires affirmative consent and does not save an invalid record', () => {
  assert.throws(() => saveDonor({ ...donor(), consent: false }), /consent/);
  assert.throws(() => saveDonor({ ...donor(), age: 17 }), /18 and 65/);
  assert.throws(() => saveDonor({ ...donor(), phone: '123' }), /7–18 digits/);
  assert.throws(() => saveDonor({ ...donor(), bloodGroup: 'XX' }), /blood group/);
  assert.equal(localStorage.getItem(STORAGE_KEY), null);
});

test('requests persist, retain source ownership, and appear before fictional samples', () => {
  const saved = saveRequest({ ...request(), source: 'sample', password: 'must-not-persist' });
  const requests = getRequests();
  assert.equal(requests.length, sampleRequests.length + 1);
  assert.equal(requests[0].id, saved.id);
  assert.equal(requests[0].source, 'local');
  assert.equal(localStorage.getItem(STORAGE_KEY).includes('must-not-persist'), false);
  assert.deepEqual(requests.slice(1), sampleRequests);
});

test('invalid calendar dates are rejected before storage changes', () => {
  assert.throws(() => saveRequest({ ...request(), requiredDate: '2026-02-30' }), /valid required date/);
  assert.throws(() => saveRequest({ ...request(), requiredDate: 'bad-date' }), /valid required date/);
  assert.equal(localStorage.getItem(STORAGE_KEY), null);
});

test('profile patches preserve existing fields and cannot persist credentials', () => {
  const saved = updateProfile({ city: 'Mumbai', availability: 'unavailable', password: 'never-save-this' });
  assert.equal(saved.name, DEMO_PROFILE.name);
  assert.equal(getProfile().city, 'Mumbai');
  assert.equal(getProfile().availability, 'unavailable');
  assert.equal(localStorage.getItem(STORAGE_KEY).includes('never-save-this'), false);
  assert.equal(getDonors()[0].city, 'Pune');
});

test('malformed saved JSON produces actionable errors and can be cleared safely', () => {
  localStorage.setItem(STORAGE_KEY, '{broken');
  assert.throws(() => getProfile(), /Clear saved demo data/);
  assert.throws(() => getRequests(), /Clear saved demo data/);
  assert.throws(() => saveDonor(donor()), /Clear saved demo data/);
  assert.equal(localStorage.getItem(STORAGE_KEY), '{broken');
  clearDemoData();
  assert.deepEqual(getProfile(), DEMO_PROFILE);
});

test('structurally invalid stored records are rejected without overwriting data', () => {
  const malformed = JSON.stringify({ version: 1, donors: [], requests: [{ id: 'bad', name: null }], profile: null });
  localStorage.setItem(STORAGE_KEY, malformed);
  assert.throws(() => getRequests(), /unreadable/);
  assert.equal(localStorage.getItem(STORAGE_KEY), malformed);
});

test('quota errors do not partially save a new registration or its profile', () => {
  saveDonor(donor());
  const before = localStorage.getItem(STORAGE_KEY);
  localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
  assert.throws(() => saveDonor({ ...donor(), name: 'Second Fictional Person' }), /No changes were saved/);
  assert.equal(localStorage.getItem(STORAGE_KEY), before);
  assert.equal(getProfile().name, 'Fictional Local Person');
});

test('storage access failures are friendly and public search still works', () => {
  Object.defineProperty(globalThis, 'localStorage', { get() { throw new Error('SecurityError'); }, configurable: true });
  assert.throws(() => getProfile(), /Allow browser storage/);
  assert.throws(() => clearDemoData(), /allow browser storage/);
  assert.equal(getDonors().length, sampleDonors.length);
});

test('demo sessions use a fixed marker and never store credentials', () => {
  assert.equal(getSession(), null);
  assert.equal(startDemoSession().isDemo, true);
  assert.equal(sessionStorage.getItem(SESSION_KEY), 'demo-active');
  assert.deepEqual(getSession(), { name: DEMO_PROFILE.name, email: DEMO_PROFILE.email, isDemo: true });
  assert.equal(localStorage.getItem(STORAGE_KEY), null);
  endDemoSession();
  assert.equal(getSession(), null);
});

test('disabled session storage fails visibly instead of claiming a login', () => {
  sessionStorage.setItem = () => { throw new Error('SecurityError'); };
  assert.throws(() => startDemoSession(), /could not be started/);
  assert.equal(getSession(), null);
});

test('clearing demo data preserves unrelated application storage and fixed samples', () => {
  localStorage.setItem('unrelated-app', 'keep-me');
  saveDonor(donor());
  saveRequest(request());
  clearDemoData();
  assert.equal(localStorage.getItem('unrelated-app'), 'keep-me');
  assert.deepEqual(getProfile(), DEMO_PROFILE);
  assert.deepEqual(getRequests(), sampleRequests);
});

test('returned values cannot mutate shared sample records or profile defaults', () => {
  getDonors()[0].name = 'Mutated';
  getRequests()[0].hospital = 'Mutated';
  getProfile().name = 'Mutated';
  assert.equal(getDonors()[0].name, sampleDonors[0].name);
  assert.equal(getRequests()[0].hospital, sampleRequests[0].hospital);
  assert.equal(getProfile().name, DEMO_PROFILE.name);
});


test('directory combines city, group and sample availability; camps filter by city', () => {
 assert.equal(getDirectory('banks', { city: '  PUNE ', bloodGroup: 'A+', availableOnly: true }).length, 1);
 assert.equal(getDirectory('banks', { city: 'Delhi', availableOnly: true }).length, 0);
 assert.equal(getDirectory('banks', { bloodGroup: 'O-' }).length, 1);
 assert.equal(getDirectory('camps', { city: 'Mumbai' })[0].id, 'camp-2');
 assert.equal(getDirectory('camps', { city: 'Unknown' }).length, 0);
});
test('directory results cannot mutate original sample groups', () => {
 const bank = getDirectory('banks')[0];
 bank.groups.push('Invalid');
 bank.name = 'Changed';
 assert.ok(!getDirectory('banks')[0].groups.includes('Invalid'));
 assert.notEqual(getDirectory('banks')[0].name, 'Changed');
});
