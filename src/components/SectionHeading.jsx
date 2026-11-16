export default function SectionHeading({ id, index, eyebrow, title, description }) {
  return (
    <div className="section-heading">
      <div className="section-heading__meta">
        <span className="eyebrow">{eyebrow}</span>
        <span className="section-heading__index">{index}</span>
      </div>
      <h2 id={id}>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
