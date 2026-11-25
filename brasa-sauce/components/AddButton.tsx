"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCart } from "./Cart";

/** Add-to-cart button that confirms in place, then resets. */
export default function AddButton({
  id,
  label = "Add to cart",
  qty = 1,
  className = "",
}: {
  id: string;
  label?: string;
  qty?: number;
  className?: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <motion.button
      onClick={() => {
        add(id, qty);
        setAdded(true);
      }}
      whileTap={{ scale: 0.96 }}
      className={`relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full px-7 font-semibold transition-colors ${
        added ? "bg-bone text-black" : "bg-habanero text-black hover:bg-ember"
      } ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {added ? (
          <motion.span
            key="added"
            className="flex items-center gap-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
              <motion.path
                d="M2 8.5l4 4L14 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.05 }}
              />
            </svg>
            Added
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      <span className="sr-only" role="status">
        {added ? "Added to cart" : ""}
      </span>
    </motion.button>
  );
}
