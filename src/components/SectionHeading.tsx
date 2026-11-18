import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { EASE } from "../lib/motion";

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export function SectionHeading({ index, eyebrow, title, subtitle }: SectionHeadingProps) {
  return (
    <Reveal className="section-heading">
      <span className="eyebrow">
        <span className="mono">{index}</span>
        {eyebrow}
      </span>
      <h2>{title}</h2>
      <motion.span
        className="heading-line"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.25, ease: EASE }}
      />
      {subtitle ? <p>{subtitle}</p> : null}
    </Reveal>
  );
}
