import { useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Github, Linkedin, LoaderCircle, Mail, MapPin } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

export default function Contact() {
  const [status, setStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const submissionInProgress = useRef(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submissionInProgress.current) return;

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      subject: String(formData.get("subject") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      website: String(formData.get("website") || "").trim(),
    };

    submissionInProgress.current = true;
    setStatus("sending");
    setStatusMessage("Sending your message...");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || result?.success !== true) {
        throw new Error(
          typeof result?.message === "string"
            ? result.message
            : "Your message could not be sent. Please try again or email me directly.",
        );
      }

      form.reset();
      setStatus("success");
      setStatusMessage("Thanks for reaching out. Your message has been sent.");
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setStatus("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Your message could not be sent. Please try again or email me directly.",
      );
    } finally {
      submissionInProgress.current = false;
    }
  };

  return (
    <section className="section section-wrap section--bordered contact" id="contact" aria-labelledby="contact-title">
      <Reveal>
        <SectionHeading
          id="contact-title"
          index="06"
          eyebrow="SAY HELLO"
          title={<>Have a good idea?<br /><span>Let&apos;s talk.</span></>}
          description="Questions, a project to discuss, or just want to connect? My inbox is open."
        />
      </Reveal>
      <div className="contact-layout">
        <Reveal className="contact-details">
          <p className="contact-details__intro">
            I&apos;m always interested in thoughtful conversations about technology, creative problem-solving, and useful web applications.
          </p>
          <a className="contact-email" href="mailto:ayaan2504d@aptechsite.net">
            <span><Mail size={18} aria-hidden="true" /></span>
            <span><small>WRITE ME AN EMAIL</small>ayaan2504d@aptechsite.net</span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <div className="contact-links">
            <a href="https://github.com/ayaan2504d" target="_blank" rel="noopener noreferrer">
              <Github size={16} aria-hidden="true" /> GitHub <ArrowUpRight size={13} aria-hidden="true" />
            </a>
            <a href="https://linkedin.com/in/ayaan2504d" target="_blank" rel="noopener noreferrer">
              <Linkedin size={16} aria-hidden="true" /> LinkedIn <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>
          <p className="contact-location"><MapPin size={15} aria-hidden="true" /> Karachi, Pakistan</p>
          <div className="contact-aside">
            <span>GOOD WORK STARTS WITH</span>
            <p>Clear questions. Open minds. A little curiosity.</p>
            <ArrowDownRight size={19} aria-hidden="true" />
          </div>
        </Reveal>
        <Reveal className="contact-form-wrap" delay={0.1}>
          <form className="contact-form" onSubmit={handleSubmit} aria-busy={status === "sending"}>
            <div className="form-heading">
              <h3>Send a note</h3>
              <span>SMTP EMAIL DELIVERY</span>
            </div>
            <div className="form-row">
              <label>
                <span>Your name</span>
                <input type="text" name="name" autoComplete="name" maxLength="100" placeholder="How should I address you?" required />
              </label>
              <label>
                <span>Email address</span>
                <input type="email" name="email" autoComplete="email" maxLength="254" placeholder="you@example.com" required />
              </label>
            </div>
            <label>
              <span>Subject</span>
              <input type="text" name="subject" maxLength="150" placeholder="What would you like to talk about?" required />
            </label>
            <label>
              <span>Message</span>
              <textarea name="message" rows="4" maxLength="5000" placeholder="A little context goes a long way..." required />
            </label>
            <label className="contact-form__honeypot" aria-hidden="true">
              <span>Leave this field empty</span>
              <input type="text" name="website" tabIndex="-1" autoComplete="off" />
            </label>
            <button type="submit" className="button button--primary contact-form__submit" disabled={status === "sending"}>
              {status === "sending" ? (
                <>Sending <LoaderCircle className="contact-form__spinner" size={16} aria-hidden="true" /></>
              ) : (
                <>Submit message <ArrowUpRight size={16} aria-hidden="true" /></>
              )}
            </button>
            <p
              className={`form-note${status === "error" ? " form-note--error" : ""}${status === "success" ? " form-note--success" : ""}`}
              role={status === "error" ? "alert" : "status"}
              aria-live={status === "error" ? "assertive" : "polite"}
            >
              {statusMessage || "Your message will be sent securely to the portfolio owner."}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
