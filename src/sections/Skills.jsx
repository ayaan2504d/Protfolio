import { ArrowUpRight } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { skillGroups } from "../data/skills.js";

export default function Skills() {
  return (
    <section className="section section-wrap section--bordered" id="skills" aria-labelledby="skills-title">
      <Reveal>
        <SectionHeading
          id="skills-title"
          index="02"
          eyebrow="TOOLS OF THE TRADE"
          title={<>A toolkit for turning<br />ideas into interfaces.</>}
          description="A growing set of technologies I use to build and learn."
        />
      </Reveal>
      <div className="skills-grid">
        {skillGroups.map((group, index) => (
          <Reveal className="skill-card" key={group.title} delay={index * 0.07}>
            <div className="skill-card__head">
              <span className="skill-card__index">{group.number}</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </div>
            <h3>{group.title}</h3>
            <ul className="skill-tags">
              {group.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
      <Reveal className="skills-note">
        <span className="skills-note__mark">+</span>
        <p>Tools are just the start — the most important part is knowing what to build and why.</p>
      </Reveal>
    </section>
  );
}
