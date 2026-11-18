import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  ArrowUpRight,
  Check,
  Copy,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { profile } from "../data";
import { EASE } from "../lib/motion";
import { SocialIconView } from "./Icons";
import { LottiePlayer } from "./LottiePlayer";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

type Status = "idle" | "sending" | "sent" | "error";

function ContactItem({
  icon,
  label,
  value,
  href,
  action,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
  action?: ReactNode;
}) {
  const body = (
    <>
      <span className="ci-icon">{icon}</span>
      <span className="ci-text">
        <small>{label}</small>
        <span>{value}</span>
      </span>
    </>
  );
  return (
    <div className="contact-item">
      {href ? (
        <a
          className="ci-main"
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
        >
          {body}
          {!action ? <ArrowUpRight className="ci-arrow" size={18} aria-hidden /> : null}
        </a>
      ) : (
        <div className="ci-main">{body}</div>
      )}
      {action}
    </div>
  );
}

export function Contact() {
  const { contact, socials } = profile;
  const [status, setStatus] = useState<Status>("idle");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setToast("Email copied to clipboard");
    } catch {
      setToast(contact.email);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    // No form service configured: hand the message to the visitor's email app.
    if (!contact.formEndpoint) {
      const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
      const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
      window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
      setStatus("sent");
      form.reset();
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(contact.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  const linkedin = socials.find((social) => social.icon === "linkedin" && social.url);
  const github = socials.find((social) => social.icon === "github" && social.url);

  return (
    <section id="contact">
      <div className="container">
        <SectionHeading index="06." eyebrow="Contact" title={contact.heading} subtitle={contact.text} />
        <div className="contact-wrap">
          <Reveal className="contact-list">
            <ContactItem
              icon={<Mail size={20} />}
              label="Email"
              value={contact.email}
              href={`mailto:${contact.email}`}
              action={
                <button className="ci-copy" onClick={copyEmail} aria-label="Copy email address">
                  <Copy size={16} />
                </button>
              }
            />
            {linkedin ? (
              <ContactItem
                icon={<SocialIconView name="linkedin" />}
                label="LinkedIn"
                value={linkedin.url.replace(/^https?:\/\/(www\.)?/, "")}
                href={linkedin.url}
              />
            ) : null}
            {github ? (
              <ContactItem
                icon={<SocialIconView name="github" />}
                label="GitHub"
                value={github.url.replace(/^https?:\/\/(www\.)?/, "")}
                href={github.url}
              />
            ) : null}
            {contact.showPhone && contact.phone ? (
              <ContactItem
                icon={<Phone size={20} />}
                label="Phone"
                value={contact.phone}
                href={`tel:${contact.phone}`}
              />
            ) : null}
            {contact.showWhatsapp && contact.whatsapp ? (
              <ContactItem
                icon={<MessageCircle size={20} />}
                label="WhatsApp"
                value="Chat on WhatsApp"
                href={`https://wa.me/${contact.whatsapp}`}
              />
            ) : null}
            <ContactItem icon={<MapPin size={20} />} label="Based in" value={contact.location} />
          </Reveal>

          <Reveal delay={0.1}>
            <form className="contact-form" onSubmit={onSubmit}>
              <div className="field">
                <label htmlFor="cf-name">Your name</label>
                <input id="cf-name" name="name" required autoComplete="name" placeholder="Jane Doe" />
              </div>
              <div className="field">
                <label htmlFor="cf-email">Your email</label>
                <input
                  id="cf-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="jane@company.com"
                />
              </div>
              <div className="field">
                <label htmlFor="cf-message">Message</label>
                <textarea
                  id="cf-message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Tell me about the role or project..."
                />
              </div>
              <motion.button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={status === "sending"}
                whileTap={{ scale: 0.97 }}
              >
                {status === "sending" ? "Sending..." : "Send message"} <Send size={18} aria-hidden />
              </motion.button>
              {status === "error" ? (
                <p className="form-status error" role="alert">
                  Something went wrong. Please email me directly at {contact.email}.
                </p>
              ) : null}

              <AnimatePresence>
                {status === "sent" ? (
                  <motion.div
                    className="form-success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    role="status"
                  >
                    <LottiePlayer src="/lottie/success.json" className="success-lottie" loop={false} />
                    <h3>Thank you!</h3>
                    <p>
                      {contact.formEndpoint
                        ? "Your message is on its way. I'll reply soon."
                        : "Your email app should open with the message ready to send."}
                    </p>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStatus("idle")}>
                      Send another
                    </button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </div>

      <AnimatePresence>
        {toast ? (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            transition={{ duration: 0.3, ease: EASE }}
            role="status"
          >
            <Check size={16} aria-hidden /> {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

export function Footer() {
  const { personal } = profile;
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>
          © {new Date().getFullYear()} {personal.name}. Designed & built with React, Framer Motion
          and Lottie.
        </p>
        <motion.a
          href="#home"
          className="to-top"
          aria-label="Back to top"
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.92 }}
        >
          <ArrowUp size={18} />
        </motion.a>
      </div>
    </footer>
  );
}
