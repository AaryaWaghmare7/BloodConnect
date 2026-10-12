export default function Card({ className = '', children, as: Element = 'div', ...props }) {
  return <Element className={`card ${className}`} {...props}>{children}</Element>
}
