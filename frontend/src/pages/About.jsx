import { ArrowRight, BookOpen, Code2, Database, Heart, HeartHandshake, Layers3, MapPin, ShieldCheck, UsersRound } from 'lucide-react';
import Button from '../components/Button';
import PageHeading from '../components/PageHeading';

const objectives = [
  { icon: MapPin, title: 'Make discovery simpler', description: 'Help people explore potential donors by blood group, location, and availability through an approachable search experience.' },
  { icon: HeartHandshake, title: 'Encourage participation', description: 'Make the idea of becoming a donor feel welcoming, while keeping eligibility decisions with qualified medical professionals.' },
  { icon: ShieldCheck, title: 'Design with care', description: 'Keep contact details out of public donor cards and clearly distinguish a learning project from a real healthcare service.' },
  { icon: BookOpen, title: 'Build to learn', description: 'Apply reusable components, form validation, routing, and a separate service layer in a practical third-year CSE project.' },
];

const technologies = [
  { name: 'React', detail: 'Reusable interface components', icon: Layers3 },
  { name: 'Vite', detail: 'Fast development and builds', icon: Code2 },
  { name: 'JavaScript', detail: 'Accessible frontend interactions', icon: Code2 },
  { name: 'Tailwind CSS', detail: 'Responsive visual foundation', icon: Layers3 },
];

export default function About() {
  return (
    <div className="about-page container">
      <PageHeading eyebrow="THE PURPOSE BEHIND THE PROJECT" title={<>Built with care.<br /><em>Made to connect.</em></>} description="BloodConnect explores a simple idea: make it easier for people who want to help to find the people who need them.">
        <span className="page-demo-badge"><BookOpen size={15} />A college mini-project · Frontend demo</span>
      </PageHeading>

      <section className="about-mission-grid" aria-label="Our purpose and the problem">
        <article className="about-story-card mission-card"><span className="feature-icon"><Heart size={26} /></span><span className="section-kicker">OUR PURPOSE</span><h2>Connecting donors.<br /><em>Inspiring a little hope.</em></h2><p>BloodConnect is a learning project built around the human side of blood donation. It brings donor discovery, sample registration, and demo blood requests into one thoughtful interface.</p><p>Our aim is to explore how technology could support community connections while treating privacy, clarity, and medical oversight as essential parts of the experience.</p></article>
        <article className="about-story-card"><span className="feature-icon"><UsersRound size={26} /></span><span className="section-kicker">THE PROBLEM WE’RE EXPLORING</span><h2>Finding a starting point<br />should feel simpler.</h2><p>When someone needs blood, knowing where to begin can feel overwhelming. Potential donors may also be unsure how to express their interest or find a way to contribute.</p><p>This prototype demonstrates an organized way to explore potential donors by city and blood group. It does not verify donors, coordinate donations, or replace hospitals and established blood banks.</p></article>
      </section>

      <section className="about-concept section-space" aria-labelledby="concept-title"><div className="section-heading"><span className="section-kicker">THE CONCEPT</span><h2 id="concept-title">A thoughtful path from<br /><em>interest to connection.</em></h2><p>Explore fictional donor profiles, create a sample donor registration, and try submitting a demo request. Your dashboard brings your browser’s demo records together in one place.</p></div><div className="concept-flow"><div><span>01</span><h3>Discover</h3><p>Search sample profiles by city, blood group, and availability.</p></div><ArrowRight size={22} aria-hidden="true" /><div><span>02</span><h3>Participate</h3><p>Try donor registration or create a fictional blood request.</p></div><ArrowRight size={22} aria-hidden="true" /><div><span>03</span><h3>Understand</h3><p>See how a future service could organize community connections.</p></div></div></section>

      <section className="about-objectives section-space" aria-labelledby="objectives-title"><div className="section-heading"><span className="section-kicker">WHAT GUIDES US</span><h2 id="objectives-title">A useful project.<br /><em>A meaningful purpose.</em></h2></div><div className="objective-grid">{objectives.map(({ icon: Icon, title, description }) => <article className="objective-card" key={title}><span className="feature-icon"><Icon size={23} /></span><h3>{title}</h3><p>{description}</p></article>)}</div></section>

      <section className="tech-section section-space" aria-labelledby="tech-title"><div className="section-heading"><span className="section-kicker">UNDER THE HOOD</span><h2 id="tech-title">Simple tools. A solid foundation.</h2><p>A modular frontend that is easy to understand, maintain, and extend.</p></div><div className="tech-grid">{technologies.map(({ name, detail, icon: Icon }) => <div className="tech-item" key={name}><Icon size={23} /><strong>{name}</strong><span>{detail}</span></div>)}</div><p className="technology-note">React Router handles navigation. A separate demo service layer reads fictional sample data and browser localStorage. Passwords are never stored, and the demo session is not secure authentication.</p></section>

      <section className="roadmap-card" aria-labelledby="roadmap-title"><span className="feature-icon"><Database size={25} /></span><div><span className="section-kicker">A FOUNDATION FOR WHAT’S NEXT</span><h2 id="roadmap-title">Designed to grow. Honestly a demo.</h2><p>A future phase could connect this frontend to Java Spring Boot REST APIs, JDBC, and MySQL 8.4 using bloodconnect_db. That phase would need secure authentication, appropriate consent and access controls, server-side validation, and carefully designed verification workflows.</p><p>This version has no backend, database, live donor network, or medical verification service. Demo submissions stay in the current browser and do not notify anyone.</p></div></section>

      <div className="about-safety"><ShieldCheck size={22} /><p><strong>Medical care belongs with medical professionals.</strong> Hospitals and qualified medical professionals must verify donor eligibility and transfusion compatibility. BloodConnect is not an emergency service. For urgent care, contact your hospital or local emergency services directly.</p></div>
      <div className="about-bottom-actions"><Button to="/find-donors">Explore the demo <ArrowRight size={17} /></Button><Button to="/donate" variant="secondary">Become a demo donor</Button></div>
    </div>
  );
}
