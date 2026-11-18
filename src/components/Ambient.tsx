import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
} from "framer-motion";
import { useEffect, useState } from "react";
import { LottiePlayer } from "./LottiePlayer";

/** Fixed backdrop: fading grid plus slowly drifting colour blobs. */
export function Background() {
  return (
    <div className="bg" aria-hidden>
      <div className="bg-grid" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
    </div>
  );
}

/** Soft light that trails the mouse. Desktop pointers only. */
export function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const springX = useSpring(x, { stiffness: 120, damping: 25 });
  const springY = useSpring(y, { stiffness: 120, damping: 25 });

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    setEnabled(query.matches);
    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  if (!enabled) return null;
  return <motion.div className="cursor-glow" style={{ x: springX, y: springY }} aria-hidden />;
}

/** Thin gradient bar along the top showing how far the page is scrolled. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden />;
}

/** Intro screen that slides away once the page is ready. */
export function Preloader({ show, name }: { show: boolean; name: string }) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="preloader"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          role="status"
          aria-label="Loading"
        >
          <LottiePlayer src="/lottie/loader.json" className="preloader-lottie" />
          <motion.p
            className="preloader-name mono"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {"<"}
            <span className="gradient-text">{name}</span>
            {" />"}
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
