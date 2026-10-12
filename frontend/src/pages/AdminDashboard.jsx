import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getRequests, getDonors, getDirectory } from '../services/demoService'
import PageHeading from '../components/PageHeading'
import Notice from '../components/Notice'
import Button from '../components/Button'
export default function AdminDashboard(){
 const [tab,setTab]=useState('Requests'),[reviewed,setReviewed]=useState([])
 let requests=[],error='';try{requests=getRequests()}catch(e){error=e.message}
 const collections={Requests:requests,Donors:getDonors(),'Blood banks':getDirectory('banks'),Camps:getDirectory('camps')},rows=collections[tab]
 return <div className="page-shell">
    <PageHeading eyebrow="ORGANISATION WORKSPACE · DEMO" title="Community at a glance." description="Explore the management side of BloodConnect. Statistics and interactions are simulated."/>
    <Notice>This admin demo is publicly accessible and provides no authentication or administrative privileges. No private donor contact information is displayed.</Notice>{error&&<Notice tone="error" role="alert">{error}</Notice>}<div className="dashboard-stats admin-stats">{Object.entries(collections).map(([label,items])=>
    <div className="card stat-card" key={label}>
    <div>
    <p className="stat-number">{items.length}</p>
    <p>{label}</p>
    <small>{label==='Requests'?'Samples + local demo records':'Fictional samples'}</small>
    </div>
    </div>)}</div>
    <div className="admin-layout">
    <nav className="admin-sidebar" aria-label="Admin sections">{Object.keys(collections).map(t=>
    <button key={t} aria-pressed={t===tab} onClick={()=>setTab(t)}>{t}</button>)}<Link to="/dashboard">User Dashboard →</Link>
    <Link to="/">Back to website →</Link>
    </nav>
    <section className="card admin-content">
    <h2>{tab}</h2>
    <p className="muted">Review marks last only while this page is open.</p>
    <div className="table-scroll">
    <table>
    <caption className="sr-only">{tab} demo records</caption>
    <thead>
    <tr>
    <th>Name</th>
    <th>City</th>
    <th>Demo information</th>
    <th>Action</th>
    </tr>
    </thead>
    <tbody>{rows.map(r=>
    <tr key={r.id}>
    <td>{tab==='Requests'?r.hospital:r.name}</td>
    <td>{r.city}</td>
    <td>{r.bloodGroup||r.date||r.hours}</td>
    <td>
    <Button variant="ghost" onClick={()=>setReviewed(reviewed.includes(r.id)?reviewed.filter(id=>id!==r.id):[...reviewed,r.id])}>{reviewed.includes(r.id)?'Undo review':'Mark reviewed'}</Button>{reviewed.includes(r.id)&&<span role="status" className="reviewed-mark">Reviewed in demo</span>}</td>
    </tr>)}</tbody>
    </table>
    </div>{!rows.length&&<p>No demo records to display.</p>}</section>
    </div>
    </div>
}
