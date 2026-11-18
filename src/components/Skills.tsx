import { motion } from "framer-motion";
import { profile } from "../data";
import { EASE } from "../lib/motion";
import { SkillIconView } from "./Icons";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { TiltCard } from "./TiltCard";

function Marquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  // Two identical copies; the track slides by exactly one copy for a seamless loop.
  const copy = (hidden: boolean) => (
    <div className="marquee-copy" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <span key={item} className="marquee-item">
          <i />
          {item}
        </span>
      ))}
    </div>
  );
  return (
    <div className={`marquee${reverse ? " reverse" : ""}`}>
      <div className="marquee-track">
        {copy(false)}
        {copy(true)}
      </div>
    </div>
  );
}

export function Skills() {
  const { skills } = profile;
  const all = skills.flatMap((group) => group.items);
  const half = Math.ceil(all.length / 2);

  return (
    <section id="skills">
      <div className="container">
        <SectionHeading
          index="04."
          eyebrow="Skills"
          title="My toolbox"
          subtitle="The languages, platforms and tools I use to take apps from Figma to the store."
        />
      </div>

      <Reveal y={20}>
        <Marquee items={all.slice(0, half)} />
        <Marquee items={all.slice(half)} reverse />
      </Reveal>

      <div className="container skills-grid">
        {skills.map((group, index) => (
          <Reveal key={group.group} delay={index * 0.08}>
            <TiltCard className="skill-card" max={6}>
              <span className="icon-tile">
                <SkillIconView name={group.icon} />
              </span>
              <h3>{group.group}</h3>
              <div className="chips">
                {group.items.map((item, i) => (
                  <motion.span
                    key={item}
                    className="chip"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.03, duration: 0.4, ease: EASE }}
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
