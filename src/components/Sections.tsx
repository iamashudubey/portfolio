import { motion, useScroll, useSpring } from "framer-motion";
import { Briefcase, Calendar, Check, GraduationCap, MapPin } from "lucide-react";
import { useRef } from "react";
import { profile } from "../data";
import { EASE } from "../lib/motion";
import { Counter } from "./Counter";
import { LottiePlayer } from "./LottiePlayer";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { TiltCard } from "./TiltCard";

export function Stats() {
  return (
    <section className="stats" aria-label="Highlights in numbers">
      <div className="container stats-grid">
        {profile.stats.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 0.08} y={24}>
            <div className="stat-card">
              <div className="stat-value gradient-text">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function About() {
  const { about, personal } = profile;
  return (
    <section id="about">
      <div className="container">
        <SectionHeading index="01." eyebrow="About me" title={about.heading} />
        <div className="about-grid">
          <Reveal className="about-photo">
            <div className="photo-deco" aria-hidden />
            <TiltCard className="photo-tilt" max={6}>
              <div className="photo-frame">
                <img
                  src={personal.casualImage}
                  alt={`${personal.name}, casual`}
                  loading="lazy"
                  width={768}
                  height={1024}
                />
              </div>
              <div className="currently">
                <small>{about.currently.title}</small>
                <p>{about.currently.text}</p>
              </div>
            </TiltCard>
            <LottiePlayer src="/lottie/twinkle.json" className="about-twinkle" />
          </Reveal>

          <div className="about-copy">
            {about.paragraphs.map((paragraph, index) => (
              <Reveal key={index} delay={index * 0.1} y={24}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
            <ul className="highlights">
              {about.highlights.map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
                >
                  <Check size={18} aria-hidden />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  return (
    <section id="experience">
      <div className="container">
        <SectionHeading
          index="02."
          eyebrow="Experience"
          title="Where I've worked"
          subtitle="From agency apps to banking at scale: a timeline of the teams I've built with."
        />
        <div className="timeline" ref={ref}>
          <div className="timeline-track" aria-hidden>
            <motion.div className="timeline-fill" style={{ scaleY }} />
          </div>
          {profile.experience.map((job, index) => (
            <div className="tl-item" key={`${job.company}-${job.start}`}>
              <motion.span
                className={`tl-dot${job.current ? " current" : ""}`}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 16 }}
                aria-hidden
              >
                <Briefcase size={14} />
              </motion.span>
              <Reveal delay={index * 0.05} y={30}>
                <article className="tl-card">
                  <header className="tl-head">
                    <div>
                      <h3 className="tl-role">{job.role}</h3>
                      <p className="tl-company">{job.company}</p>
                    </div>
                    {job.current ? <span className="badge-now">Current</span> : null}
                  </header>
                  <div className="tl-meta">
                    <span>
                      <Calendar size={14} aria-hidden /> {job.start} - {job.end}
                    </span>
                    <span>
                      <MapPin size={14} aria-hidden /> {job.location}
                    </span>
                  </div>
                  <ul className="tl-points">
                    {job.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  {job.tech.length ? (
                    <div className="chips">
                      {job.tech.map((tech) => (
                        <span key={tech} className="chip">
                          {tech}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </article>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Education() {
  return (
    <section id="education">
      <div className="container">
        <SectionHeading index="05." eyebrow="Education" title="Where I learned the craft" />
        <div className="edu-grid">
          {profile.education.map((item, index) => (
            <Reveal key={item.degree} delay={index * 0.1}>
              <TiltCard className="edu-card" max={6}>
                <span className="edu-year" aria-hidden>
                  {item.year}
                </span>
                <span className="icon-tile">
                  <GraduationCap size={22} aria-hidden />
                </span>
                <h3>{item.degree}</h3>
                <p className="edu-inst">{item.institution}</p>
                <p className="edu-meta">
                  {item.location} · {item.year}
                </p>
                {item.details ? <p className="edu-details">{item.details}</p> : null}
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
