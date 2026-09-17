import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Fade-and-rise on first scroll into view.
 *
 * The prerendered markup carries `opacity: 0`, so index.html pairs the
 * `data-reveal` hook with a <noscript> rule that forces these blocks visible —
 * the page still reads correctly if JS never runs. Reduced motion is honored
 * through the app-level <MotionConfig reducedMotion="user">.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
