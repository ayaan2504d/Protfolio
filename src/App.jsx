import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import CustomCursor from "./components/CustomCursor.jsx";
import Footer from "./components/Footer.jsx";
import Loader from "./components/Loader.jsx";
import Navbar from "./components/Navbar.jsx";
import About from "./sections/About.jsx";
import Contact from "./sections/Contact.jsx";
import Education from "./sections/Education.jsx";
import Experience from "./sections/Experience.jsx";
import Hero from "./sections/Hero.jsx";
import Projects from "./sections/Projects.jsx";
import Skills from "./sections/Skills.jsx";

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 24);
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  return (
    <>
      <Loader />
      <CustomCursor />
      <div className="site-shell">
        <div className="ambient ambient--blue" aria-hidden="true" />
        <div className="ambient ambient--violet" aria-hidden="true" />
        <div className={scrolled ? "header-spacer header-spacer--scrolled" : "header-spacer"}>
          <Navbar />
        </div>
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Education />
          <Contact />
        </main>
        <Footer />
      </div>
      <Analytics />
    </>
  );
}
