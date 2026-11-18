import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { ArrowUpRight, Download, MapPin } from "lucide-react";
import type { MouseEvent } from "react";
import { profile } from "../data";
import { useTypewriter } from "../hooks/useTypewriter";
import { EASE, fadeUp, stagger } from "../lib/motion";
import { SocialIconView } from "./Icons";
import { LottiePlayer } from "./LottiePlayer";
import { MagneticButton } from "./MagneticButton";

const BADGE_SPOTS = [
  { top: "4%", left: "-6%" },
  { top: "12%", right: "-10%" },
  { top: "52%", right: "-16%" },
  { bottom: "8%", right: "-4%" },
  { top: "36%", left: "-18%" },
];
const BADGE_COLORS = ["#61dafb", "#8b5cf6", "#ec4899", "#22c55e", "#f59e0b"];

const wordReveal: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.9, ease: EASE } },
};

function FloatingBadge({
  label,
  index,
  mx,
  my,
}: {
  label: string;
  index: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const depth = 18 + index * 10;
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return (
    <motion.div
      className={`float-badge${index >= 3 ? " hide-sm" : ""}`}
      style={{ ...BADGE_SPOTS[index % BADGE_SPOTS.length], x, y }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.9 + index * 0.12, type: "spring", stiffness: 200, damping: 14 }}
    >
      <motion.span
        className="float-badge-inner"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4 + index * 0.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <i style={{ background: BADGE_COLORS[index % BADGE_COLORS.length] }} />
        {label}
      </motion.span>
    </motion.div>
  );
}

function CodeCard({ entries }: { entries: [string, string][] }) {
  const isLiteral = (value: string) => value === "Infinity" || /^-?\d+(\.\d+)?$/.test(value);
  return (
    <motion.div
      className="code-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.3, duration: 0.8, ease: EASE }}
      aria-hidden
    >
      <div className="code-dots">
        <span />
        <span />
        <span />
      </div>
      <div>
        <span className="tok-k">const</span> <span className="tok-v">developer</span>{" "}
        <span className="tok-p">= {"{"}</span>
      </div>
      {entries.map(([key, value]) => (
        <div key={key} className="code-line">
          {key}
          <span className="tok-p">: </span>
          {isLiteral(value) ? (
            <span className="tok-n">{value}</span>
          ) : (
            <span className="tok-s">"{value}"</span>
          )}
          <span className="tok-p">,</span>
        </div>
      ))}
      <div className="tok-p">{"};"}</div>
    </motion.div>
  );
}

export function Hero({ ready }: { ready: boolean }) {
  const { personal, socials } = profile;
  const reduce = useReducedMotion();
  const typed = useTypewriter(reduce ? [] : personal.roles);
  const role = reduce ? personal.roles[0] : typed;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  const avatarX = useTransform(smx, (v) => v * -16);
  const avatarY = useTransform(smy, (v) => v * -16);

  const onMove = (event: MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const words = personal.name.split(" ");

  return (
    <section id="home" className="hero" onMouseMove={onMove}>
      <div className="container hero-grid">
        <motion.div
          className="hero-copy"
          variants={stagger(0.12, 0.1)}
          initial="hidden"
          animate={ready ? "show" : "hidden"}
        >
          {personal.availability.open ? (
            <motion.span variants={fadeUp} className="status-pill">
              <span className="status-dot" />
              {personal.availability.text}
            </motion.span>
          ) : null}

          <motion.p variants={fadeUp} className="hero-hello mono">
            Hi there, I'm
          </motion.p>

          <motion.h1 className="hero-name" variants={stagger(0.12)} aria-label={personal.name}>
            {words.map((word, index) => (
              <span className="word-mask" key={`${word}-${index}`} aria-hidden>
                <motion.span
                  className={`word${index === words.length - 1 ? " gradient-text shine" : ""}`}
                  variants={wordReveal}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          <motion.div variants={fadeUp} className="hero-role mono" aria-live="polite">
            <span className="role-bracket">{"<"}</span>
            <span>{role}</span>
            <span className="caret" aria-hidden />
            <span className="role-bracket">{" />"}</span>
          </motion.div>

          <motion.p variants={fadeUp} className="hero-tagline">
            {personal.tagline}
          </motion.p>

          <motion.p variants={fadeUp} className="hero-location">
            <MapPin size={16} aria-hidden /> {personal.location}
          </motion.p>

          <motion.div variants={fadeUp} className="hero-actions">
            <MagneticButton href="#contact">
              Let's talk <ArrowUpRight aria-hidden />
            </MagneticButton>
            <MagneticButton href={personal.resume.downloadUrl} variant="ghost" download>
              {personal.resume.downloadLabel} <Download aria-hidden />
            </MagneticButton>
          </motion.div>

          <motion.div variants={fadeUp} className="hero-socials">
            {socials
              .filter((social) => social.url)
              .map((social) => (
                <motion.a
                  key={social.label}
                  href={social.url}
                  className="icon-btn"
                  aria-label={social.label}
                  target={social.url.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <SocialIconView name={social.icon} />
                </motion.a>
              ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={ready ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
        >
          <LottiePlayer src="/lottie/pulse.json" className="hero-pulse" />
          <motion.div className="avatar" style={{ x: avatarX, y: avatarY }}>
            <div className="avatar-ring" aria-hidden />
            <img src={personal.profileImage} alt={personal.name} width={610} height={653} />
          </motion.div>
          <LottiePlayer src="/lottie/twinkle.json" className="hero-twinkle" />
          {ready
            ? personal.heroBadges.map((badge, index) => (
                <FloatingBadge key={badge} label={badge} index={index} mx={smx} my={smy} />
              ))
            : null}
          {ready ? <CodeCard entries={Object.entries(personal.codeCard)} /> : null}
        </motion.div>
      </div>

      <a href="#about" className="scroll-hint" aria-label="Scroll to About">
        <LottiePlayer src="/lottie/scroll.json" className="scroll-lottie" />
      </a>
    </section>
  );
}
