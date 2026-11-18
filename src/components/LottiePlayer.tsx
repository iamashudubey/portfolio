import { Component, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
// LottieLight: SVG engine without After Effects expressions (smaller, no eval).
// Use `Lottie` instead only if you add an animation that needs expressions.
import { LottieLight } from "lottie-react";

// A broken or missing animation file must never take the page down.
class SilentBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

interface LottiePlayerProps {
  // Path in /public, e.g. "/lottie/pulse.json". Swap in any LottieFiles JSON.
  src: string;
  className?: string;
  loop?: boolean;
}

/** Decorative Lottie animation; paused for visitors who prefer reduced motion. */
export function LottiePlayer({ src, className, loop = true }: LottiePlayerProps) {
  const reduce = useReducedMotion();
  return (
    <SilentBoundary>
      <LottieLight src={src} className={className} loop={loop} autoplay={!reduce} aria-hidden />
    </SilentBoundary>
  );
}
