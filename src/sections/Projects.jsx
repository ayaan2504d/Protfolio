import { ArrowUpRight, Github } from "lucide-react";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "../components/Reveal.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { projects } from "../data/projects.js";

function ProjectVisual({ project }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className={`project-visual project-visual--${project.tone}`} aria-label={`${project.title} project preview placeholder`}>
      {project.image && !imageFailed ? (
        <img
          src={project.image}
          alt={`Placeholder preview for ${project.title}; replace with a project screenshot`}
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className={`visual-art visual-art--${project.visual}`}>
          <div className="visual-art__window">
            <div className="visual-art__topbar"><i /><i /><i /><span>REPOSITORY PREVIEW</span></div>
            {project.visual === "map" && (
              <div className="map-art">
                <span className="map-art__road map-art__road--one" />
                <span className="map-art__road map-art__road--two" />
                <span className="map-art__road map-art__road--three" />
                <span className="map-art__pin map-art__pin--one" />
                <span className="map-art__pin map-art__pin--two" />
                <span className="map-art__pin map-art__pin--three" />
                <span className="map-art__water" />
              </div>
            )}
            {project.visual === "dashboard" && (
              <div className="dashboard-art">
                <div className="dashboard-art__side"><i /><i /><i /><i /></div>
                <div className="dashboard-art__main">
                  <span className="dashboard-art__heading" />
                  <div className="dashboard-art__stats"><i /><i /><i /></div>
                  <span className="dashboard-art__chart"><i /><i /><i /><i /><i /><i /><i /><i /></span>
                </div>
              </div>
            )}
            {project.visual === "workflow" && (
              <div className="workflow-art">
                <span className="workflow-art__node">01</span><i />
                <span className="workflow-art__node">02</span><i />
                <span className="workflow-art__node">03</span>
              </div>
            )}
            {project.visual === "editorial" && (
              <div className="editorial-art">
                <span className="editorial-art__image" />
                <span className="editorial-art__title" />
                <span className="editorial-art__line" />
                <span className="editorial-art__line editorial-art__line--short" />
              </div>
            )}
          </div>
          <span className="visual-art__caption">PROJECT PREVIEW <i /> REPLACEABLE</span>
        </div>
      )}
      <span className="project-visual__number">{project.number}</span>
    </div>
  );
}

function ProjectCard({ project, index }) {
  const reduceMotion = useReducedMotion();

  return (
    <Reveal className="project-card-wrap" delay={(index % 2) * 0.08}>
      <motion.article
        className="project-card"
        whileHover={reduceMotion ? undefined : { y: -5 }}
        transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
      >
        <ProjectVisual project={project} />
        <div className="project-card__body">
          <div className="project-card__meta">
            <span>{project.category}</span>
            <span>{project.number} / 04</span>
          </div>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          {project.tags.length > 0 && (
            <div className="project-card__tags" aria-label="Technologies">
              {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          )}
          <a
            className="project-card__link"
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title} on GitHub`}
          >
            <Github size={16} aria-hidden="true" />
            View repository
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </motion.article>
    </Reveal>
  );
}

export default function Projects() {
  return (
    <section className="section section-wrap section--bordered" id="projects" aria-labelledby="projects-title">
      <Reveal>
        <SectionHeading
          id="projects-title"
          index="03"
          eyebrow="SELECTED WORK"
          title={<>Made to solve<br />something real.</>}
          description="A few projects from the repositories — described only where their source supports it."
        />
      </Reveal>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
