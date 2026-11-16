import { ArrowUpRight, Braces, Lightbulb, RefreshCw } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

const principles = [
  {
    icon: Braces,
    title: "Useful by design",
    text: "Thoughtful web experiences start with understanding the people and practical problems they serve.",
  },
  {
    icon: Lightbulb,
    title: "Solve, then simplify",
    text: "I like breaking a challenge into clear steps and shaping a solution that feels easy to use.",
  },
  {
    icon: RefreshCw,
    title: "Always in progress",
    text: "Each project is a chance to strengthen my foundations, explore new ideas, and keep improving.",
  },
];

export default function About() {
  return (
    <section className="section section-wrap" id="about" aria-labelledby="about-title">
      <Reveal>
        <SectionHeading
          id="about-title"
          index="01"
          eyebrow="A LITTLE ABOUT ME"
          title={<>The thinking behind<br />the build.</>}
          description="Developer, software engineering student, and lifelong problem-solver."
        />
      </Reveal>
      <div className="about-layout">
        <Reveal className="about-intro" delay={0.08}>
          <span className="about-intro__label">01 — MY APPROACH</span>
          <h3 id="about-approach-title">
            Building with <span>curiosity</span> and care.
          </h3>
          <p>
            I am a passionate Full Stack Web Developer and Software Engineering student with hands-on experience in building dynamic, user-friendly, and responsive web applications. I enjoy solving problems, learning new technologies, and developing practical digital solutions.
          </p>
          <a className="text-link" href="#experience">
            More about my journey <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </Reveal>
        <div className="principle-list">
          {principles.map(({ icon: Icon, title, text }, index) => (
            <Reveal className="principle" key={title} delay={0.1 + index * 0.08}>
              <span className="principle__icon"><Icon size={18} aria-hidden="true" /></span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
              <span className="principle__index">0{index + 1}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
