import { useState } from 'react'
import PageHeading from '../components/PageHeading'
import Notice from '../components/Notice'
import Input from '../components/Input'
import Button from '../components/Button'
const questions=[
 ['How does donor search work?','Choose a blood group and city, optionally limit by simulated availability, then search. All public donor profiles are fictional and have no contact details.'],
 ['Does registration arrange a real donation?','No. Registration creates a fictional record in this browser only. It does not register anyone with a blood bank or notify an organisation.'],
 ['How do I check blood bank stock?','This demo shows simulated availability only. A real hospital or blood bank must confirm stock and assess transfusion compatibility.'],
 ['Can I attend the listed camps?','Listed camps are fictional examples demonstrating event discovery. They cannot be booked.'],
 ['Who decides whether I can donate?','Qualified medical professionals must assess donor eligibility and compatibility. Blood group and demo age ranges do not establish eligibility.'],
 ['Is demo login secure authentication?','No. Read-only fictional credentials open a demo session. Passwords are never saved. The admin dashboard is an openly accessible simulation.'],
 ['Where are entries stored?','Fictional profiles and requests stay in this browser. Clear them from the user dashboard using Clear saved demo data.'],
]
export default function Resources({contact=false}) {
 const [error,setError]=useState(''),[sent,setSent]=useState(false)
 function submit(e){e.preventDefault();const d=new FormData(e.currentTarget);if(String(d.get('name')).trim().length<2||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(d.get('email')))||String(d.get('message')).trim().length<10){setError('Enter a fictional name, valid email, and a message of at least 10 characters.');return}setError('');setSent(true)}
 return <div className="page-shell">
    <PageHeading eyebrow="HELP & INFORMATION" title={contact?'Let’s keep the conversation going.':'Frequently Asked Questions'} description={contact?'Try the contact form with fictional details. This local preview sends no messages.':'Clear answers for donors, requesters, and curious visitors.'}/>{contact?<div className="form-layout">
    <section className="card form-card">{sent?<div role="status">
    <h2>Demo form validated.</h2>
    <p>Your message has not been sent or stored.</p>
    <Button onClick={()=>setSent(false)}>Try another demo message</Button>
    </div>:<form onSubmit={submit} noValidate>
    <Notice>Use fictional information only. No team receives this demo form.</Notice>{error&&<Notice tone="error" role="alert">{error}</Notice>}<div className="field-grid">
    <Input name="name" label="Name" required minLength={2} maxLength={100}/>
    <Input name="email" label="Email" type="email" required maxLength={120}/>
    <div className="field full-width">
    <label htmlFor="message">Message *</label>
    <textarea id="message" name="message" className="input" required minLength={10} maxLength={1000}/>
    </div>
    </div>
    <Button type="submit">Validate demo message</Button>
    </form>}</section>
    <aside className="form-sidebar">
    <h2>A project with purpose.</h2>
    <p>BloodConnect is a Java + DBMS college mini-project. Read our FAQ for details about discovery, demo storage, and medical verification.</p>
    <Button to="/faq" variant="secondary">Read FAQs</Button>
    <p>For real blood requirements, contact a hospital or established blood bank directly.</p>
    </aside>
    </div>:<>
    <div className="resource-faq">{questions.map(([q,a])=>
    <details className="faq-item" key={q}>
    <summary>{q}<span aria-hidden="true">+</span>
    </summary>
    <p>{a}</p>
    </details>)}</div>
    <div className="support-panel">
    <div>
    <h2>Still have a question?</h2>
    <p>Explore the project’s contact experience.</p>
    </div>
    <Button to="/contact">Contact demo</Button>
    </div>
    </>}</div>
}
