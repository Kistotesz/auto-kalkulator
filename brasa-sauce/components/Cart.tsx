"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { flavors } from "@/lib/products";
import JarArt from "./JarArt";

export const BUNDLE = {
  id: "full-fire-set",
  name: "The Full Fire set",
  price: 42,
};

type Items = Record<string, number>;

type CartCtx = {
  items: Items;
  count: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside <CartProvider>");
  return c;
}

function lookup(id: string) {
  if (id === BUNDLE.id) return { name: BUNDLE.name, price: BUNDLE.price, color: "#ff5400", ink: "#ff5400", size: "3 × jars" };
  const f = flavors.find((x) => x.id === id)!;
  return { name: f.name, price: f.price, color: f.sauce, ink: f.labelInk, size: f.size };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Items>({});
  const [open, setOpen] = useState(false);

  const add = useCallback((id: string, qty = 1) => {
    setItems((s) => ({ ...s, [id]: (s[id] ?? 0) + qty }));
  }, []);
  const setQty = useCallback((id: string, qty: number) => {
    setItems((s) => {
      const next = { ...s };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  }, []);

  const count = Object.values(items).reduce((a, b) => a + b, 0);
  const value = useMemo(() => ({ items, count, open, setOpen, add, setQty }), [items, count, open, add, setQty]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <CartDrawer />
    </Ctx.Provider>
  );
}

function CartDrawer() {
  const { items, open, setOpen, setQty } = useCart();
  const [checkedOut, setCheckedOut] = useState(false);
  const entries = Object.entries(items);
  const subtotal = entries.reduce((sum, [id, q]) => sum + lookup(id).price * q, 0);
  const freeShippingAt = 40;

  useEffect(() => {
    if (!open) setCheckedOut(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            className="fixed right-0 top-0 z-[61] flex h-full w-full max-w-md flex-col bg-soot text-bone shadow-[-40px_0_80px_rgba(0,0,0,0.6)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
          >
            <div className="flex items-center justify-between border-b border-ash px-6 py-5">
              <h2 className="font-display text-4xl font-black uppercase">Your cart</h2>
              <button
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-ash transition-colors hover:border-habanero hover:text-habanero"
                aria-label="Close cart"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </button>
            </div>

            {entries.length === 0 ? (
              <div className="flex flex-1 flex-col items-start justify-center gap-4 px-6">
                <p className="font-display text-5xl font-black uppercase leading-none text-habanero">Nothing here yet</p>
                <p className="max-w-xs text-bone/70">Pick a jar or two. The set of all three saves you $5.</p>
                <a
                  href="#shop"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-full bg-habanero px-6 py-3 font-semibold text-black"
                >
                  Browse the sauces
                </a>
              </div>
            ) : (
              <>
                <div className="px-6 pt-5">
                  <p className="text-sm text-bone/70">
                    {subtotal >= freeShippingAt
                      ? "Shipping is on us."
                      : `Add $${freeShippingAt - subtotal} more for free shipping.`}
                  </p>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-ash">
                    <motion.div
                      className="h-full bg-habanero"
                      animate={{ width: `${Math.min(100, (subtotal / freeShippingAt) * 100)}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    />
                  </div>
                </div>
                <ul className="flex-1 space-y-1 overflow-y-auto px-6 py-4">
                  <AnimatePresence initial={false}>
                    {entries.map(([id, q]) => {
                      const p = lookup(id);
                      return (
                        <motion.li
                          key={id}
                          layout
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 30, height: 0 }}
                          className="flex items-center gap-4 border-b border-ash py-4"
                        >
                          <JarArt color={p.color} ink={p.ink} className="h-20 w-14 shrink-0" />
                          <div className="flex-1">
                            <p className="font-display text-2xl font-extrabold uppercase leading-none">{p.name}</p>
                            <p className="mt-1 text-sm text-bone/60">{p.size}</p>
                            <div className="mt-2">
                              <Stepper value={q} onChange={(v) => setQty(id, v)} label={p.name} />
                            </div>
                          </div>
                          <p className="font-display text-2xl font-bold">${p.price * q}</p>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
                <div className="border-t border-ash px-6 py-5">
                  <div className="mb-4 flex items-baseline justify-between">
                    <span className="text-bone/70">Subtotal</span>
                    <motion.span
                      key={subtotal}
                      initial={{ y: -8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="font-display text-4xl font-black"
                    >
                      ${subtotal}
                    </motion.span>
                  </div>
                  <button
                    onClick={() => setCheckedOut(true)}
                    className="w-full rounded-full bg-habanero py-4 text-lg font-semibold text-black transition-transform active:scale-[0.98]"
                  >
                    Check out
                  </button>
                  <AnimatePresence>
                    {checkedOut && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 text-sm text-bone/70"
                        role="status"
                      >
                        This is a demo store, so checkout isn&rsquo;t connected yet. No payment was taken.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function Stepper({
  value,
  onChange,
  label,
  min = 0,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  min?: number;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-ash">
      <button
        className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:text-habanero disabled:opacity-30"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={`One less ${label}`}
      >
        −
      </button>
      <span className="relative w-6 overflow-hidden text-center tabular-nums" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            className="block"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <button
        className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:text-habanero"
        onClick={() => onChange(value + 1)}
        aria-label={`One more ${label}`}
      >
        +
      </button>
    </div>
  );
}
