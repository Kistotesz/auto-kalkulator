"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  return (
    <footer className="layer-front relative overflow-hidden border-t border-bone/10 px-4 pt-24 md:px-10">
      <div className="grid gap-16 md:grid-cols-2">
        <div>
          <h2 className="font-display text-huge font-black uppercase leading-[0.85]">Get the next batch first.</h2>
          <p className="mt-4 max-w-md text-bone/70">
            New sauces sell out in days. We&rsquo;ll email you the morning a batch goes live, and that&rsquo;s it.
          </p>
          <form
            className="mt-8 max-w-md"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              setState(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "done" : "error");
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {state === "done" ? (
                <motion.p
                  key="done"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display text-3xl font-bold uppercase text-habanero"
                  role="status"
                >
                  You&rsquo;re on the list.
                </motion.p>
              ) : (
                <motion.div key="form" exit={{ opacity: 0, y: -10 }}>
                  <label htmlFor="email" className="mb-2 block text-sm text-bone/60">
                    Email address
                  </label>
                  <div className="flex gap-2 rounded-full border border-bone/25 p-1.5 transition-colors focus-within:border-habanero">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (state === "error") setState("idle");
                      }}
                      placeholder="you@example.com"
                      aria-invalid={state === "error"}
                      aria-describedby={state === "error" ? "email-error" : undefined}
                      className="min-w-0 flex-1 bg-transparent px-4 text-bone placeholder:text-bone/35 focus:outline-none"
                    />
                    <button type="submit" className="rounded-full bg-habanero px-5 py-3 font-semibold text-black transition-colors hover:bg-ember">
                      Join the list
                    </button>
                  </div>
                  {state === "error" && (
                    <p id="email-error" className="mt-2 text-sm text-ember">
                      That email looks incomplete. Check it has an @ and a domain, like name@site.com.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm md:justify-self-end">
          <div>
            <h3 className="mb-4 text-bone/50">Shop</h3>
            <ul className="space-y-2">
              <li><a className="hover:text-habanero" href="#shop">All sauces</a></li>
              <li><a className="hover:text-habanero" href="#shop">The Full Fire set</a></li>
              <li><a className="hover:text-habanero" href="#flavors">Heat guide</a></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-bone/50">Brasa</h3>
            <ul className="space-y-2">
              <li><a className="hover:text-habanero" href="#process">How it&rsquo;s made</a></li>
              <li><a className="hover:text-habanero" href="#ingredients">Ingredients</a></li>
              <li><a className="hover:text-habanero" href="#hero">Back to top</a></li>
            </ul>
          </div>
        </div>
      </div>

      <p
        className="mt-20 select-none whitespace-nowrap pb-[2vw] text-center font-display font-black leading-[0.8] tracking-tight text-habanero"
        style={{ fontSize: "39vw" }}
        aria-hidden
      >
        BRASA
      </p>
      <div className="flex flex-col gap-2 border-t border-bone/10 py-6 text-xs text-bone/45 md:flex-row md:justify-between">
        <p>© {new Date().getFullYear()} Brasa Sauce Co. A demo storefront.</p>
        <p>Keep refrigerated after opening. Use within 3 months, if it lasts that long.</p>
      </div>
    </footer>
  );
}
