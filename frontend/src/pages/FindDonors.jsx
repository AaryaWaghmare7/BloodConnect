import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronUp, MapPin, Search, ShieldCheck, SlidersHorizontal, Users } from 'lucide-react';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import PageHeading from '../components/PageHeading.jsx';
import Notice from '../components/Notice.jsx';
import BloodBadge from '../components/BloodBadge.jsx';
import { BLOOD_GROUPS } from '../data/mockData.js';
import { getDonors } from '../services/demoService.js';

const initialFilters = { bloodGroup: '', city: '', availableOnly: false };

function readFilters(searchParams) {
  const requestedGroup = (searchParams.get('bloodGroup') || '').replace('-', '−');
  return {
    bloodGroup: BLOOD_GROUPS.includes(requestedGroup) ? requestedGroup : '',
    city: (searchParams.get('city') || '').trim().slice(0, 100),
    availableOnly: searchParams.get('availableOnly') === 'true',
  };
}

export default function FindDonors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const appliedFilters = useMemo(() => readFilters(searchParams), [searchParams]);
  const [filters, setFilters] = useState(() => readFilters(searchParams));
  const [expandedId, setExpandedId] = useState(null);
  const donors = useMemo(() => getDonors(appliedFilters), [appliedFilters]);
  const hasFilters = Boolean(appliedFilters.bloodGroup || appliedFilters.city || appliedFilters.availableOnly);

  // The URL owns applied filters, so refresh, navigation, and browser Back agree.
  useEffect(() => {
    setFilters(appliedFilters);
    setExpandedId(null);
  }, [appliedFilters]);

  function resetFilters() {
    setFilters(initialFilters);
    setExpandedId(null);
    setSearchParams({});
  }

  function search(event) {
    event.preventDefault();
    const nextFilters = { ...filters, city: filters.city.trim() };
    const params = {};
    if (nextFilters.bloodGroup) params.bloodGroup = nextFilters.bloodGroup;
    if (nextFilters.city) params.city = nextFilters.city;
    if (nextFilters.availableOnly) params.availableOnly = 'true';
    setFilters(nextFilters);
    setExpandedId(null);
    setSearchParams(params);
  }

  return (
    <div className="page-shell donors-page">
      <PageHeading eyebrow="A COMMUNITY THAT CARES" title="A little search. A lot of hope." description="Explore our fictional donor community. Find a familiar city, choose a blood group, and see how connecting could work." />

      <form className="filter-bar" onSubmit={search} aria-label="Search fictional donors">
        <div className="filter-field">
          <label htmlFor="search-blood-group">Blood group</label>
          <select id="search-blood-group" className="input" value={filters.bloodGroup} onChange={(event) => setFilters({ ...filters, bloodGroup: event.target.value })}>
            <option value="">All blood groups</option>
            {BLOOD_GROUPS.map((group) => <option key={group} value={group}>{group}</option>)}
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="search-city">City</label>
          <input id="search-city" className="input" type="search" placeholder="Try Pune or Mumbai" maxLength={100} value={filters.city} onChange={(event) => setFilters({ ...filters, city: event.target.value })} />
        </div>
        <label className="checkbox-row availability-toggle" htmlFor="available-only">
          <input id="available-only" type="checkbox" checked={filters.availableOnly} onChange={(event) => setFilters({ ...filters, availableOnly: event.target.checked })} />
          Available only
        </label>
        <div className="filter-actions">
          <Button type="submit"><Search size={17} aria-hidden="true" /> Search</Button>
          <Button type="button" variant="secondary" onClick={resetFilters}>Reset</Button>
        </div>
      </form>

      <div className="results-heading">
        <div>
          <h2 aria-live="polite">{donors.length} {donors.length === 1 ? 'donor' : 'donors'} {hasFilters ? 'found' : 'to discover'}</h2>
          <p className="muted">Fictional sample profiles · No personal contact details</p>
        </div>
        <span className="sample-label"><SlidersHorizontal size={14} aria-hidden="true" /> {hasFilters ? 'Filtered results' : 'All sample donors'}</span>
      </div>

      {donors.length ? (
        <div className="donor-grid">
          {donors.map((donor) => {
            const isAvailable = donor.available ?? donor.availability === 'available';
            const isExpanded = expandedId === donor.id;
            const initials = donor.name.split(' ').map((part) => part[0]).slice(0, 2).join('');
            const requestLink = `/request-blood?${new URLSearchParams({ bloodGroup: donor.bloodGroup, city: donor.city }).toString()}`;
            return (
              <Card className="donor-card" key={donor.id}>
                <div className="donor-card-top">
                  <div className="avatar" aria-hidden="true">{initials}</div>
                  <BloodBadge group={donor.bloodGroup} />
                </div>
                <h3>{donor.name}</h3>
                <p className="donor-card-meta"><MapPin size={15} aria-hidden="true" />{donor.city}</p>
                <div className="donor-card-footer">
                  <span className={`status-pill ${isAvailable ? 'available' : 'unavailable'}`}><span aria-hidden="true" />{isAvailable ? 'Available' : 'Unavailable'}</span>
                  <span className="sample-label">Sample donor</span>
                </div>
                <Button variant="secondary" type="button" className="full-width" aria-expanded={isExpanded} aria-controls={`profile-${donor.id}`} onClick={() => setExpandedId(isExpanded ? null : donor.id)}>
                  {isExpanded ? 'Close demo profile' : 'View demo profile'} {isExpanded ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
                </Button>
                {isExpanded && (
                  <div className="profile-detail" id={`profile-${donor.id}`}>
                    <p><strong>A fictional member of the community.</strong> This profile demonstrates donor discovery. It cannot be contacted or booked.</p>
                    <p>Availability is sample data. A qualified medical team must verify donor eligibility and transfusion compatibility.</p>
                    <Button to={requestLink} variant="text">Try a demo blood request <ArrowRight size={15} aria-hidden="true" /></Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="empty-state">
          <div className="empty-state-icon"><Users size={30} aria-hidden="true" /></div>
          <h2>No sample donors found</h2>
          <p>Try a different city or blood group, or turn off the availability filter.</p>
          <Button onClick={resetFilters} type="button" variant="secondary">Show all sample donors</Button>
        </Card>
      )}

      <Notice><ShieldCheck size={20} aria-hidden="true" /><span>For demonstration only. Blood group alone does not establish compatibility. Hospitals and qualified medical professionals must verify donor eligibility and transfusion compatibility. BloodConnect is not an emergency service.</span></Notice>
    </div>
  );
}
