import { useState } from 'react'
import { MapPin, CalendarDays, Building2, ArrowRight } from 'lucide-react'
import { BLOOD_GROUPS } from '../data/mockData'
import { getDirectory } from '../services/demoService'
import PageHeading from '../components/PageHeading'
import Input from '../components/Input'
import Select from '../components/Select'
import Button from '../components/Button'
import Notice from '../components/Notice'
import EmptyState from '../components/EmptyState'
export default function Directory({ camps=false }) {
 const empty={city:'',bloodGroup:'',availableOnly:false}
 const [draft,setDraft]=useState(empty),[filters,setFilters]=useState(empty),[expanded,setExpanded]=useState(null)
 const records=getDirectory(camps?'camps':'banks',filters)
 function reset(){setDraft(empty);setFilters(empty);setExpanded(null)}
 return <div className="page-shell">
    <PageHeading eyebrow={camps?'COME TOGETHER. GIVE TOGETHER.':'FIND A PLACE OF CARE'} title={camps?'Blood Donation Camps':'Blood Bank Directory'} description={camps?'Explore fictional donation drives in your community.':'Browse fictional blood centres by city and sample blood group availability.'}/>
    <Notice>All listings are fictional. Hours, dates, and stock are simulated. This directory cannot confirm availability or arrange a donation.</Notice>
    <form className="filter-bar directory-filters" onSubmit={e=>{e.preventDefault();setFilters({...draft});setExpanded(null)}}>
    <Input label="City" value={draft.city} placeholder="Try Pune or Mumbai" onChange={e=>setDraft({...draft,city:e.target.value})} maxLength={100}/>{!camps&&<>
    <Select label="Blood group" value={draft.bloodGroup} onChange={e=>setDraft({...draft,bloodGroup:e.target.value})}>
    <option value="">All groups</option>{BLOOD_GROUPS.map(g=>
    <option key={g}>{g}</option>)}</Select>
    <label className="checkbox-row">
    <input type="checkbox" checked={draft.availableOnly} onChange={e=>setDraft({...draft,availableOnly:e.target.checked})}/>Sample availability only</label>
    </>}<div className="filter-actions">
    <Button type="submit">Search</Button>
    <Button variant="secondary" onClick={reset}>Reset</Button>
    </div>
    </form>
    <div className="results-heading">
    <h2 aria-live="polite">{records.length} fictional {camps?'camps':'blood banks'}</h2>
    <span>Demo listings only</span>
    </div>
    <div className="listing-grid">{records.map(r=>
    <article className="card directory-card" key={r.id}>
    <span className="directory-icon">{camps?<CalendarDays/>:<Building2/>}</span>
    <span className="sample-tag">FICTIONAL {camps?'EVENT':'BLOOD CENTRE'}</span>
    <h2>{r.name}</h2>
    <p>
    <MapPin size={15}/>{r.city} · {r.venue}</p>
    <p>{camps?`${new Date(r.date+'T12:00:00').toLocaleDateString('en-IN')} · ${r.time}`:`Demo hours: ${r.hours}`}</p>{!camps&&<>
    <div className="group-tags">{r.groups.map(g=>
    <span key={g}>{g}</span>)}</div>
    <span className={`status-pill ${r.available?'':'unavailable'}`}>{r.available?'Sample stock listed':'Sample stock unavailable'}</span>
    </>}<Button variant="secondary" onClick={()=>setExpanded(expanded===r.id?null:r.id)} aria-expanded={expanded===r.id} aria-controls={`details-${r.id}`}>{expanded===r.id?'Close details':'View demo details'}</Button>{expanded===r.id&&<div id={`details-${r.id}`} className="profile-detail">
    <p>{camps?'This fictional event cannot be booked. A real camp requires confirmation with its organiser.':'Stock is fictional. A real blood bank must verify availability and medical suitability.'}</p>
    <Button to={camps?'/donate':'/request-blood'} variant="text">{camps?'Try donor registration':'Try a demo request'}<ArrowRight size={16}/>
    </Button>
    </div>}</article>)}</div>{!records.length&&<EmptyState title="No fictional listings match" description="Try another city or reset your filters.">
    <Button onClick={reset}>Reset filters</Button>
    </EmptyState>}</div>
}
