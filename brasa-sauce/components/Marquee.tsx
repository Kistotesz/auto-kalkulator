"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useRef } from "react";

const phrases = ["Charred over oak", "Fermented 21 days", "Poured by hand", "No liquid smoke", "600 jars a week"];

function Flame() {
  return (
    <svg viewBox="0 0 20 28" className="mx-6 inline-block h-[0.7em] w-auto align-baseline md:mx-10" aria-hidden>
      <path d="M10 0C16 8 19 14 17 20c-1.5 4.5-5 8-7 8s-5.5-3.5-7-8C1 14 4 8 10 0z" fill="currentColor" />
    </svg>
  );
}

/** A heat band that runs faster, and flips direction, with your scrolling. */
export default function Marquee() {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-1500, 0, 1500], [-4, 0, 4], { clamp: false });
  const direction = useRef(1);
  const x = useTransform(base, (v) => `${((v % 25) - 25) % 25}%`); // four identical rows, so loop every 25%

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const b = boost.get();
    if (b < 0) direction.current = -1;
    else if (b > 0) direction.current = 1;
    base.set(base.get() - direction.current * (1.6 + Math.abs(b)) * (delta / 1000));
  });

  const row = (
    <span className="flex shrink-0 items-center">
      {phrases.map((p) => (
        <span key={p} className="flex items-center whitespace-nowrap">
          {p}
          <Flame />
        </span>
      ))}
    </span>
  );

  return (
    <div className="layer-front relative -my-6 overflow-hidden py-10" aria-label={phrases.join(", ")}>
      <div className="texture-paper -rotate-2 bg-habanero py-4 text-black md:py-6">
        <motion.div
          className="flex w-max font-display text-5xl font-black uppercase leading-none md:text-7xl"
          style={{ x }}
          aria-hidden
        >
          {row}
          {row}
          {row}
          {row}
        </motion.div>
      </div>
    </div>
  );
}
