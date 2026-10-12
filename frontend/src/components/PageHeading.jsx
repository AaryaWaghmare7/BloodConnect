export default function PageHeading({ eyebrow, title, description, children }) {
  return <header className="page-header">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1>{description && <p className="page-description">{description}</p>}{children}</header>
}
