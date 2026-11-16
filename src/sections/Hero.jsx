import { lazy, Suspense, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowDownToLine, ArrowUpRight, Github, Linkedin } from "lucide-react";

const HeroScene = lazy(() => import("../three/HeroScene.jsx"));

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const [showScene, setShowScene] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 681px)");
    const updateScene = () => setShowScene(desktop.matches);
    updateScene();
    desktop.addEventListener("change", updateScene);
    return () => desktop.removeEventListener("change", updateScene);
  }, []);

  return (
    <section className="hero section-wrap" id="home" aria-labelledby="hero-title">
      <div className="hero__copy">
        <motion.div
          className="availability"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
        >
          <span className="availability__dot" />
          Open to conversations
        </motion.div>
        <motion.p
          className="hero__overline"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          FULL STACK WEB DEVELOPER <span>·</span> KARACHI, PK
        </motion.p>
        <motion.h1
          id="hero-title"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.34 }}
        >
          SYED AYAN
          <br />
          <span>AHMED JAFRI</span>
        </motion.h1>
        <motion.p
          className="hero__summary"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.48 }}
        >
          I build modern web applications and digital solutions that help businesses solve real-world problems.
        </motion.p>
        <motion.div
          className="hero__actions"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.58 }}
        >
          <a className="button button--primary" href="#projects">
            View my work <ArrowDown size={16} aria-hidden="true" />
          </a>
          <a
            className="button button--quiet"
            href="/cv.html"
            download="Syed-Ayan-Ahmed-Jafri-CV.html"
          >
            Download CV <ArrowDownToLine size={15} aria-hidden="true" />
          </a>
        </motion.div>
        <motion.div
          className="hero__socials"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.72 }}
        >
          <span>Find me on</span>
          <a href="https://github.com/ayaan2504d" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github size={17} aria-hidden="true" />
          </a>
          <a href="https://linkedin.com/in/ayaan2504d" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin size={17} aria-hidden="true" />
          </a>
          <span className="hero__social-rule" />
          <a className="hero__scroll" href="#about">Scroll to explore <ArrowDown size={13} /></a>
        </motion.div>
      </div>
      <motion.div
        className="hero__portrait-wrap"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
      >
        {!reduceMotion && showScene && (
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        )}
        <div className="portrait-card">
          <img
            className="portrait-card__image"
            src="/images/profile-placeholder.png"
            alt="Abstract AY monogram placeholder; replace with a profile photo"
            width="480"
            height="480"
            fetchPriority="high"
          />
          <div className="portrait-card__caption">
            <div>
              <span className="eyebrow">THE PERSON BEHIND THE CODE</span>
              <strong>Curious by nature. Builder by choice.</strong>
            </div>
            <span className="portrait-card__arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
          </div>
        </div>
        <span className="hero__figure-label">01 / BUILD WITH INTENTION</span>
        <span className="hero__orbit-label">CODE <i /> CRAFT <i /> CLARITY</span>
      </motion.div>
    </section>
  );
}
