"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { useCart } from "./Cart";

const links = [
  { href: "#process", label: "Process" },
  { href: "#flavors", label: "Flavours" },
  { href: "#ingredients", label: "Ingredients" },
  { href: "#shop", label: "Shop" },
];

export default function Nav() {
  const { count, setOpen } = useCart();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);

  // tuck the bar away while reading down, bring it back on any scroll up
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 400);
    setSolid(y > 60);
  });

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-40"
      animate={{ y: hidden ? "-110%" : "0%" }}
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <nav
        className={`mx-auto flex items-center justify-between px-4 py-4 transition-colors duration-500 md:px-10 ${
          solid ? "bg-black/70 backdrop-blur-md" : ""
        }`}
        aria-label="Main"
      >
        <a href="#hero" className="font-display text-3xl font-black tracking-tight text-habanero" aria-label="Brasa, back to top">
          BRASA
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="group relative py-1 text-sm text-bone/80 transition-colors hover:text-bone">
                {l.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-habanero transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>
        <button
          onClick={() => setOpen(true)}
          className="group flex items-center gap-3 rounded-full border border-bone/20 py-2 pl-4 pr-2 text-sm transition-colors hover:border-habanero"
          aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
        >
          Cart
          <span className="relative grid h-7 min-w-7 place-items-center overflow-hidden rounded-full bg-habanero px-2 font-semibold text-black">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={count}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {count}
              </motion.span>
            </AnimatePresence>
          </span>
        </button>
      </nav>
    </motion.header>
  );
}
