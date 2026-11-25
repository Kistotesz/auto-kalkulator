"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ingredients } from "@/lib/products";

/** A typographic list; each ingredient opens up to tell you where it's from. */
export default function Ingredients() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="ingredients" aria-labelledby="ingredients-title" className="relative px-4 py-28 md:px-10 md:py-40">
      <div className="layer-front md:ml-[46%]">
        <h2 id="ingredients-title" className="font-display text-huge font-black uppercase leading-[0.85] tracking-tight">
          Six things.
          <br />
          <span className="text-habanero">Nothing else.</span>
        </h2>
        <p className="mt-6 max-w-md text-bone/70">
          No thickeners, no colouring, no flavourings. Just these, bought from people we know by name.
        </p>

        <ul className="mt-12 border-t border-bone/15">
          {ingredients.map((ing, i) => {
            const isOpen = open === i;
            return (
              <li key={ing.name} className="border-b border-bone/15">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  onMouseEnter={() => setOpen(i)}
                  aria-expanded={isOpen}
                  aria-controls={`ing-${i}`}
                  className="group flex w-full items-baseline justify-between gap-6 py-5 text-left"
                >
                  <span
                    className={`font-display text-[clamp(2.2rem,4.6vw,4.4rem)] font-extrabold uppercase leading-none transition-colors duration-300 ${
                      isOpen ? "text-habanero" : "text-bone group-hover:text-bone"
                    }`}
                  >
                    {ing.name}
                  </span>
                  <span className="shrink-0 text-sm text-bone/55">{ing.origin}</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`ing-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-end justify-between gap-6 pb-6">
                        <p className="max-w-sm text-bone/80">{ing.detail}</p>
                        <p className="shrink-0 font-display text-3xl font-black text-ember">{ing.stat}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
