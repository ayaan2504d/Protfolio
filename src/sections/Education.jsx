import { GraduationCap } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

const education = [
  {
    status: "COMPLETED",
    title: "Matriculation",
    short: "SSC",
    institution: "Sindh Board",
    location: "Karachi",
    current: false,
  },
  {
    status: "CURRENTLY STUDYING",
    title: "Intermediate - First Year",
    short: "PRE-ENGINEERING",
    institution: "PECHS College",
    location: "Karachi",
    current: true,
  },
  {
    status: "CURRENTLY STUDYING",
    title: "ADSE (Advanced Diploma in Software Engineering)",
    short: "3RD SEMESTER",
    institution: "Aptech Learning",
    location: "Karachi",
    current: true,
  },
];

export default function Education() {
  return (
    <section className="section section-wrap section--bordered" id="education" aria-labelledby="education-title">
      <Reveal>
        <SectionHeading
          id="education-title"
          index="05"
          eyebrow="LEARNING FOUNDATIONS"
          title={<>Growing the<br />fundamentals.</>}
          description="Formal study that complements learning through practical projects."
        />
      </Reveal>
      <div className="education-timeline">
        {education.map((item, index) => (
          <Reveal className="education-item" key={item.title} delay={index * 0.1}>
            <div className="education-item__marker">
              <GraduationCap size={18} aria-hidden="true" />
            </div>
            <div className="education-item__content">
              <span className={item.current ? "education-item__status education-item__status--current" : "education-item__status"}>
                <i /> {item.status}
              </span>
              <h3>{item.title}</h3>
              <span className="education-item__short">{item.short}</span>
              <p>{item.institution}<span> · </span>{item.location}</p>
            </div>
            <span className="education-item__index">0{index + 1}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
