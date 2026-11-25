"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { steps } from "@/lib/products";

gsap.registerPlugin(ScrollTrigger);

/**
 * A pinned chapter: the page holds still while scrolling walks through
 * the four steps from fire to jar. The 3D jar turns alongside.
 */
export default function Process() {
  const section = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: section.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const i = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
        setActive(i);
        if (bar.current) bar.current.style.transform = `scaleY(${self.progress})`;
      },
    });
    return () => st.kill();
  }, []);

  const step = steps[active];

  return (
    <section id="process" ref={section} className="relative" style={{ height: `${steps.length * 90 + 40}vh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-end px-4 pb-10 pt-24 md:justify-center md:px-10 md:pb-0">
        <div className="layer-front grid w-full gap-10 md:w-[58%] md:grid-cols-[auto_1fr]">
          {/* progress rail with the four steps */}
          <ol className="relative hidden flex-col justify-between py-2 md:flex" aria-label="Steps">
            <div className="absolute left-[5px] top-0 h-full w-px bg-bone/15" />
            <div ref={bar} className="absolute left-[5px] top-0 h-full w-px origin-top scale-y-0 bg-habanero" />
            {steps.map((s, i) => (
              <li key={s.title} className="relative flex items-center gap-4 text-sm">
                <span
                  className={`h-[11px] w-[11px] rounded-full border transition-colors duration-300 ${
                    i <= active ? "border-habanero bg-habanero" : "border-bone/30 bg-black"
                  }`}
                />
                <span className={`transition-colors ${i === active ? "text-bone" : "text-bone/40"}`}>{s.title}</span>
              </li>
            ))}
          </ol>

          <div>
            <h2 className="mb-6 text-sm text-bone/60 md:mb-10 md:text-base">
              From flame to jar, in four steps.
            </h2>
            <div className="relative min-h-[19rem] md:min-h-[26rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -40, filter: "blur(8px)" }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-start gap-4 md:gap-6">
                    <span className="font-display text-[clamp(3rem,7vw,7rem)] font-black leading-[0.8] text-outline">
                      {active + 1}
                    </span>
                    <h3 className="font-display text-[clamp(4.5rem,13vw,13rem)] font-black uppercase leading-[0.78] tracking-tight text-habanero">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-6 max-w-md text-base leading-relaxed text-bone/80 md:mt-8 md:text-lg">{step.body}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
