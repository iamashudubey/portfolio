import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Smartphone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { profile } from "../data";
import type { Project } from "../types";
import { EASE } from "../lib/motion";
import { SocialIconView } from "./Icons";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { TiltCard } from "./TiltCard";

const SHOWCASE_MS = 4500;
const LINK_LABELS: Record<keyof Project["links"], string> = {
  live: "Live",
  github: "Code",
  playStore: "Play Store",
  appStore: "App Store",
};

function ProjectLinks({ project }: { project: Project }) {
  const links = (Object.keys(LINK_LABELS) as (keyof Project["links"])[]).filter(
    (key) => project.links[key]
  );
  if (!links.length) return null;
  return (
    <div className="p-links">
      {links.map((key) => (
        <a
          key={key}
          className="p-link"
          href={project.links[key]}
          target="_blank"
          rel="noopener noreferrer"
        >
          {key === "github" ? (
            <SocialIconView name="github" size={14} />
          ) : key === "live" ? (
            <ArrowUpRight size={14} aria-hidden />
          ) : (
            <Smartphone size={14} aria-hidden />
          )}
          {LINK_LABELS[key]}
        </a>
      ))}
    </div>
  );
}

/** A phone frame whose "app" screen is drawn from the project's data. */
function PhoneMockup({ project }: { project: Project }) {
  return (
    <div className="phone-wrap">
      <div className="phone-glow" style={{ background: project.color }} aria-hidden />
      <div className="phone" aria-hidden>
        <div className="phone-notch" />
        <div className="phone-screen">
          <div className="phone-status">
            <span>9:41</span>
            <span className="status-icons">
              <i />
              <i />
              <i />
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={project.title}
              className="phone-app"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.96 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <div
                className="app-hero"
                style={{ background: `linear-gradient(140deg, ${project.color}, #1a1a2e 85%)` }}
              >
                <motion.span
                  className="app-icon"
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 14 }}
                >
                  {project.icon}
                </motion.span>
                <strong>{project.title}</strong>
                <small>{project.subtitle}</small>
              </div>
              <div className="app-body">
                {project.tech.slice(0, 4).map((tech, index) => (
                  <motion.div
                    key={tech}
                    className="app-row"
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + index * 0.08, ease: EASE }}
                  >
                    <span className="app-row-dot" style={{ background: project.color }} />
                    <span className="app-row-label">{tech}</span>
                    <span className="app-row-bar">
                      <motion.span
                        style={{ background: project.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${55 + ((index * 23) % 40)}%` }}
                        transition={{ delay: 0.35 + index * 0.1, duration: 0.9, ease: EASE }}
                      />
                    </span>
                  </motion.div>
                ))}
              </div>
              <div className="app-tabbar">
                {[0, 1, 2, 3].map((tab) => (
                  <span key={tab} style={tab === 0 ? { background: project.color } : undefined} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Showcase({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const current = projects[active];

  useEffect(() => {
    if (paused || reduce || projects.length < 2) return;
    const timer = setTimeout(() => setActive((i) => (i + 1) % projects.length), SHOWCASE_MS);
    return () => clearTimeout(timer);
  }, [active, paused, reduce, projects.length]);

  if (!current) return null;
  return (
    <div
      className="showcase"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Reveal>
        <PhoneMockup project={current} />
      </Reveal>
      <Reveal delay={0.1}>
        <div className="showcase-tabs" role="tablist" aria-label="Featured projects">
          {projects.map((project, index) => (
            <button
              key={project.title}
              role="tab"
              aria-selected={index === active}
              className={`showcase-tab${index === active ? " active" : ""}`}
              onClick={() => setActive(index)}
            >
              <span className="tab-icon" aria-hidden>
                {project.icon}
              </span>
              <span>
                <strong>{project.title}</strong>
                <small>{project.subtitle}</small>
              </span>
              {index === active ? (
                // Fills over the auto-advance time; snaps full while paused.
                <motion.span
                  key={`${active}-${paused}`}
                  className="tab-progress"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: paused || reduce ? 0.3 : SHOWCASE_MS / 1000,
                    ease: "linear",
                  }}
                />
              ) : null}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={current.title}
            className="showcase-detail"
            role="tabpanel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            <span className="p-cat">{current.category}</span>
            <h3>{current.title}</h3>
            <p>{current.description}</p>
            <ul className="tl-points">
              {current.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="chips">
              {current.tech.map((tech) => (
                <span key={tech} className="chip">
                  {tech}
                </span>
              ))}
            </div>
            <ProjectLinks project={current} />
          </motion.div>
        </AnimatePresence>
      </Reveal>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const shown = project.tech.slice(0, 4);
  const extra = project.tech.length - shown.length;
  return (
    <TiltCard className="project-card">
      <div
        className="project-top"
        style={{ background: `radial-gradient(circle at 30% 20%, ${project.color}55, transparent 65%), linear-gradient(160deg, ${project.color}22, transparent)` }}
      >
        <span className="p-icon" aria-hidden>
          {project.icon}
        </span>
      </div>
      <div className="project-body">
        <span className="p-cat">{project.category}</span>
        <h3>{project.title}</h3>
        <p className="p-sub">{project.subtitle}</p>
        <p className="p-desc">{project.description}</p>
        <div className="chips">
          {shown.map((tech) => (
            <span key={tech} className="chip">
              {tech}
            </span>
          ))}
          {extra > 0 ? <span className="chip chip-more">+{extra}</span> : null}
        </div>
        <ProjectLinks project={project} />
      </div>
    </TiltCard>
  );
}

export function Projects() {
  const { projects } = profile;
  const featured = projects.filter((project) => project.featured);
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((project) => project.category)))],
    [projects]
  );
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects">
      <div className="container">
        <SectionHeading
          index="03."
          eyebrow="Projects"
          title="Things I've built"
          subtitle="A few apps and tools I've shipped or led. Tap a project to preview it on the phone."
        />

        {featured.length ? <Showcase projects={featured} /> : null}

        <Reveal className="filters" y={20}>
          {categories.map((category) => (
            <button
              key={category}
              className={`filter${filter === category ? " active" : ""}`}
              onClick={() => setFilter(category)}
              aria-pressed={filter === category}
            >
              {filter === category ? (
                <motion.span layoutId="filter-pill" className="filter-pill" />
              ) : null}
              <span>{category}</span>
            </button>
          ))}
        </Reveal>

        <motion.div layout className="projects-grid">
          <AnimatePresence mode="popLayout">
            {visible.map((project) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
