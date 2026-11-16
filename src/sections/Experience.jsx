import { ArrowUpRight, CircleDot, Code2, GraduationCap } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

const milestones = [
  {
    icon: Code2,
    type: "PROJECT WORK",
    title: "From idea to working application",
    body: "Built and iterated on full-stack projects around real-world workflows, including a masjid community platform and a service-business management application.",
  },
  {
    icon: CircleDot,
    type: "HOW I WORK",
    title: "Start with the problem",
    body: "I focus on understanding the task first, then use structured data, clear interfaces, and practical features to move toward a useful solution.",
  },
  {
    icon: GraduationCap,
    type: "IN PROGRESS",
    title: "Learning through every build",
    body: "Software engineering studies and hands-on practice go hand in hand — each new project gives me another way to sharpen the fundamentals.",
  },
];

export default function Experience() {
  return (
    <section className="section section-wrap section--bordered" id="experience" aria-labelledby="experience-title">
      <Reveal>
        <SectionHeading
          id="experience-title"
          index="04"
          eyebrow="THE JOURNEY SO FAR"
          title={<>Learning by doing.<br />Building with purpose.</>}
          description="A project-led path into web development — without borrowed titles or timelines."
        />
      </Reveal>
      <div className="journey-layout">
        <div className="journey-intro">
          <Reveal>
            <span className="journey-intro__accent">DEVELOPMENT, IN PRACTICE</span>
            <p>
              My experience comes from learning the craft and putting it to work in projects — especially web applications and business management software.
            </p>
            <a className="text-link" href="#projects">
              Explore selected projects <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </Reveal>
        </div>
        <div className="journey-list">
          {milestones.map(({ icon: Icon, type, title, body }, index) => (
            <Reveal className="journey-item" key={title} delay={index * 0.08}>
              <div className="journey-item__marker"><Icon size={17} aria-hidden="true" /></div>
              <div className="journey-item__content">
                <span>{type}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
              <span className="journey-item__number">0{index + 1}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
