import { AnimatePresence, motion } from "framer-motion";
import { Download, ExternalLink, FileText, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { profile } from "../data";
import { EASE } from "../lib/motion";

// Desktop browsers render PDFs inline; most phones (Android Chrome, in-app
// browsers) can't, so they get Open / Download buttons instead.
const canShowPdfInline = () =>
  typeof navigator !== "undefined" &&
  (navigator as Navigator & { pdfViewerEnabled?: boolean }).pdfViewerEnabled === true &&
  !window.matchMedia("(max-width: 640px)").matches;

export function ResumeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { resume, name } = profile.personal;
  const closeRef = useRef<HTMLButtonElement>(null);
  const [inline, setInline] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!open) return;
    setInline(canShowPdfInline());
    setLoaded(false);
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className="resume-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-title"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.4, ease: EASE }}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="resume-head">
              <div className="resume-title">
                <span className="icon-tile resume-icon">
                  <FileText size={18} aria-hidden />
                </span>
                <div>
                  <h2 id="resume-title">Resume</h2>
                  <small>{name}</small>
                </div>
              </div>
              <div className="resume-actions">
                <a className="btn btn-ghost btn-sm" href={resume.downloadUrl} download>
                  <Download aria-hidden /> <span className="hide-xs">Download</span>
                </a>
                <a
                  className="btn btn-ghost btn-sm"
                  href={resume.viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open resume in a new tab"
                >
                  <ExternalLink aria-hidden /> <span className="hide-xs">Open</span>
                </a>
                <button
                  ref={closeRef}
                  type="button"
                  className="icon-btn resume-close"
                  onClick={onClose}
                  aria-label="Close resume"
                >
                  <X size={18} />
                </button>
              </div>
            </header>

            <div className="resume-body">
              {inline ? (
                <>
                  {!loaded ? (
                    <div className="resume-loading" aria-hidden>
                      <span />
                      <span />
                      <span />
                    </div>
                  ) : null}
                  <iframe
                    title={`${name} resume`}
                    src={`${resume.viewUrl}#view=FitH&toolbar=0`}
                    onLoad={() => setLoaded(true)}
                    className={loaded ? "is-loaded" : undefined}
                  />
                </>
              ) : (
                <div className="resume-fallback">
                  <FileText size={44} aria-hidden />
                  <p>Open the resume in your PDF viewer, or download a copy.</p>
                  <div className="resume-fallback-actions">
                    <a
                      className="btn btn-primary"
                      href={resume.viewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open resume <ExternalLink aria-hidden />
                    </a>
                    <a className="btn btn-ghost" href={resume.downloadUrl} download>
                      {resume.downloadLabel} <Download aria-hidden />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
