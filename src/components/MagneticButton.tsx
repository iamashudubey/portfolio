import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useRef, type MouseEvent, type ReactNode, type Ref } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  // With href it renders a link; without, a button that calls onClick.
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  size?: "md" | "sm";
  download?: boolean;
  external?: boolean;
  ariaHasPopup?: "dialog";
}

/** A button-styled link or button that leans toward the pointer. */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  download,
  external,
  ariaHasPopup,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 15, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 220, damping: 15, mass: 0.3 });

  const onMove = (event: MouseEvent<HTMLElement>) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.3);
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.4);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const shared = {
    className: `btn btn-${variant}${size === "sm" ? " btn-sm" : ""}`,
    style: { x: springX, y: springY },
    onMouseMove: onMove,
    onMouseLeave: reset,
    whileTap: { scale: 0.95 },
  };

  if (!href) {
    return (
      <motion.button
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
        onClick={onClick}
        aria-haspopup={ariaHasPopup}
        {...shared}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.a
      ref={ref as Ref<HTMLAnchorElement>}
      href={href}
      onClick={onClick}
      download={download || undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      {...shared}
    >
      {children}
    </motion.a>
  );
}
