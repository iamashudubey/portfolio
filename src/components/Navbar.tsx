import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { FileText, Menu, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { profile } from "../data";
import { useActiveSection } from "../hooks/useActiveSection";
import { MagneticButton } from "./MagneticButton";
import { ResumeModal } from "./ResumeModal";

export const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];
const SECTION_IDS = ["home", ...NAV_ITEMS.map((item) => item.id)];

export function Navbar() {
  const active = useActiveSection(SECTION_IDS);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  // Stable, so the modal's effect doesn't re-run on every navbar render.
  const closeResume = useCallback(() => setResumeOpen(false), []);
  const openResume = () => {
    setOpen(false);
    setResumeOpen(true);
  };

  // Hide while scrolling down, come back on any scroll up.
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 40);
    setHidden(latest > previous && latest > 400);
  });

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <motion.header
        className={`nav${scrolled || open ? " scrolled" : ""}`}
        animate={{ y: hidden && !open ? -100 : 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <nav className="container nav-inner" aria-label="Main">
          <ul className="nav-links">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`nav-link${active === item.id ? " active" : ""}`}
                  aria-current={active === item.id ? "true" : undefined}
                >
                  {active === item.id ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="nav-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  ) : null}
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-cta">
            <MagneticButton variant="ghost" size="sm" onClick={openResume} ariaHasPopup="dialog">
              <FileText aria-hidden /> {profile.personal.resume.viewLabel}
            </MagneticButton>
            <button
              className="menu-btn"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.25 }}
          >
            {NAV_ITEMS.map((item, index) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                className={active === item.id ? "active" : undefined}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * index }}
              >
                <span className="mono">0{index + 1}.</span> {item.label}
              </motion.a>
            ))}
            <button
              type="button"
              className="btn btn-primary mobile-resume"
              onClick={openResume}
              aria-haspopup="dialog"
            >
              <FileText aria-hidden /> {profile.personal.resume.viewLabel}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <ResumeModal open={resumeOpen} onClose={closeResume} />
    </>
  );
}
