import { ArrowUpRight, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer section-wrap">
      <a className="brand footer__brand" href="#home" aria-label="Back to top">AYAN<span>.</span></a>
      <p>Made with intention <span>·</span> Karachi, Pakistan</p>
      <div className="footer__links">
        <a href="https://github.com/ayaan2504d" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={16} /></a>
        <a href="https://linkedin.com/in/ayaan2504d" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={16} /></a>
        <a className="footer__top" href="#home">Back to top <ArrowUpRight size={13} /></a>
      </div>
    </footer>
  );
}
