"use client";

import { motion } from "framer-motion";
import Magnetic from "./Magnetic";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section id="hero" className="relative flex min-h-[100svh] flex-col justify-between px-4 pb-8 pt-24 md:px-10 md:pb-10">
      {/* The giant wordmark is drawn in 3D behind the jar; this is its text for screen readers. */}
      <h1 className="sr-only">Brasa: fire-roasted sauces, charred over oak and poured by hand</h1>

      <span aria-hidden />

      <div className="layer-front flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <p className="font-display text-[clamp(2.1rem,4.4vw,4.4rem)] font-extrabold uppercase leading-[0.9] tracking-tight">
          {["Slow-fired sauce,", "built on open flame."].map((line, i) => (
            <span key={line} className="block overflow-hidden pb-1">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ delay: 1.1 + i * 0.12, duration: 1.1, ease }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </p>

        <motion.div
          className="flex max-w-md flex-col gap-5 md:items-end md:text-right"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.9, ease }}
        >
          <p className="text-sm leading-relaxed text-bone/70 md:text-base">
            Small-batch sauces from an oak fire. Charred, fermented for 21 days, poured by hand. 600 jars a week.
          </p>
          <div className="flex flex-wrap items-center gap-3">
          <Magnetic>
            <a
              href="#shop"
              className="inline-flex items-center gap-3 rounded-full bg-habanero px-5 py-4 font-semibold md:px-7 text-black transition-colors hover:bg-ember"
            >
              Shop the sauces
            </a>
          </Magnetic>
          <a
            href="#process"
            className="inline-flex items-center rounded-full border border-bone/30 px-5 py-4 font-medium md:px-7 transition-colors hover:border-bone"
          >
            See how it&rsquo;s made
          </a>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="layer-front pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-bone/50 md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        aria-hidden
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-bone/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-habanero"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
