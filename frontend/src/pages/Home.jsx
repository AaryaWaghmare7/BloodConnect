import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Heart, Search, ShieldCheck, MapPin, Building2, CalendarDays, Users } from 'lucide-react'
import Button from '../components/Button'
import Select from '../components/Select'
import Input from '../components/Input'
import { BLOOD_GROUPS, sampleDonors, sampleBanks, sampleCamps } from '../data/mockData'
import art from '../assets/donation-illustration.svg'
export default function Home() {
  const [group,setGroup]=useState(''),[city,setCity]=useState(''),navigate=useNavigate()
  return <>
    <section className="platform-hero">
    <img src={art} className="platform-art" alt="Original illustration of a donor and nurse"/>
    <div className="container platform-hero-inner">
    <div className="platform-copy">
    <span className="eyebrow-pill">
    <Heart size={15}/> A community connected by kindness</span>
    <h1>Become a donor.<br/>
    <span>Be someone’s hope.</span>
    </h1>
    <p>One thoughtful connection can make a difference. Discover a more connected blood donation community.</p>
    <Button to="/donate">
    <Heart size={18}/> Register as a Donor</Button>
    <Link to="/blood-banks" className="hero-bank-link">Explore nearby blood banks <ArrowRight size={16}/>
    </Link>
    </div>
    <form className="hero-search card" onSubmit={e=>{e.preventDefault();navigate(`/find-donors?${new URLSearchParams({bloodGroup:group,city:city.trim()})}`)}}>
    <span className="eyebrow">LOOKING FOR BLOOD?</span>
    <h2>Start with a search.</h2>
    <p>Explore fictional donors by group and city.</p>
    <Select label="Blood group" value={group} onChange={e=>setGroup(e.target.value)}>
    <option value="">All blood groups</option>{BLOOD_GROUPS.map(g=>
    <option key={g}>{g}</option>)}</Select>
    <Input label="City" placeholder="e.g. Pune" value={city} onChange={e=>setCity(e.target.value)} maxLength={100}/>
    <Button type="submit">
    <Search size={17}/> Find Donors</Button>
    <small>Demo only · No live stock or emergency response</small>
    </form>
    </div>
    </section>
  <section className="container platform-stats" aria-label="Fictional sample statistics">{[[Users,sampleDonors.length,'Sample donors'],[Building2,sampleBanks.length,'Sample blood banks'],[CalendarDays,sampleCamps.length,'Sample camps'],[MapPin,new Set(sampleBanks.map(b=>b.city)).size,'Demo cities']].map(([Icon,n,label])=>
    <div key={label}>
    <Icon size={25}/>
    <strong>{n}</strong>
    <span>{label}</span>
    </div>)}</section>
  <section className="container section-space">
    <div className="section-heading heading-row">
    <div>
    <span className="eyebrow">GIVE A LITTLE. MEAN A LOT.</span>
    <h2>Upcoming donation camps</h2>
    <p>Fictional events to explore the donation journey.</p>
    </div>
    <Button to="/camps" variant="secondary">View all camps <ArrowRight size={16}/>
    </Button>
    </div>
    <div className="listing-grid">{sampleCamps.map(c=>
    <article className="card camp-preview" key={c.id}>
    <div className="camp-date">
    <CalendarDays size={23}/>
    <strong>{new Date(c.date+'T12:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</strong>
    </div>
    <span className="sample-tag">FICTIONAL EVENT</span>
    <h3>{c.name}</h3>
    <p>
    <MapPin size={15}/>{c.city} · {c.venue}</p>
    <p>{c.time}</p>
    <Button to="/camps" variant="text">Explore details <ArrowRight size={16}/>
    </Button>
    </article>)}</div>
    </section>
  <section className="container organisation-panel">
    <div>
    <span className="eyebrow">FOR ORGANISATIONS</span>
    <h2>Bringing people and places<br/>of care together.</h2>
    <p>Explore blood banks, donation drives, and the management experience.</p>
    </div>
    <div className="organisation-actions">
    <Button to="/blood-banks" variant="secondary">
    <Building2 size={19}/> Blood Bank Directory</Button>
    <Button to="/admin" variant="secondary">Explore Admin Demo <ArrowRight size={16}/>
    </Button>
    </div>
    </section>
  <section id="how-it-works" className="container section-space">
    <div className="section-heading centered">
    <span className="eyebrow">HOW BLOODCONNECT WORKS</span>
    <h2>A simple start. A meaningful connection.</h2>
    </div>
    <div className="steps-grid">{[['01','Choose group & city','Search fictional donors by blood group, city, and simulated availability.'],['02','Explore your options','Discover sample donors, blood banks, and donation camps.'],['03','Let medical care lead','Qualified professionals must verify eligibility and transfusion compatibility.']].map(([n,t,p])=>
    <article key={n}>
    <span className="process-number">{n}</span>
    <h3>{t}</h3>
    <p className="muted">{p}</p>
    </article>)}</div>
    </section>
  <section className="container support-panel">
    <ShieldCheck size={32}/>
    <div>
    <h2>Care starts with clarity.</h2>
    <p>Fictional data, thoughtful design. Demo submissions stay in this browser and do not notify donors or hospitals.</p>
    </div>
    <Button to="/about" variant="secondary">About the project</Button>
    </section>
  <section id="faq" className="container section-space">
    <div className="section-heading heading-row">
    <div>
    <span className="eyebrow">YOUR QUESTIONS, ANSWERED</span>
    <h2>A little more clarity.</h2>
    </div>
    <Button to="/faq" variant="text">Read FAQs <ArrowRight size={16}/>
    </Button>
    </div>
    <div className="final-cta">
    <div>
    <h2>A small act can mean everything.</h2>
    <p>Explore the experience of becoming part of a donor community.</p>
    </div>
    <Button to="/donate" variant="light">Become a Donor <ArrowRight size={18}/>
    </Button>
    </div>
    </section>
    </>
}
