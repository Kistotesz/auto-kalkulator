"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useState } from "react";
import { flavors, type Flavor } from "@/lib/products";
import AddButton from "./AddButton";
import JarArt from "./JarArt";
import { BUNDLE, Stepper } from "./Cart";

/** A jar on the shelf that tips toward the cursor. */
function ShelfJar({ f }: { f: Flavor }) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 200, damping: 20 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 20 });
  const [qty, setQty] = useState(1);

  return (
    <div className="flex flex-col">
      <div
        className="relative flex h-72 items-end justify-center md:h-96"
        style={{ perspective: 900 }}
        onPointerMove={(e) => {
          if (reduce) return;
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => {
          mx.set(0);
          my.set(0);
        }}
      >
        {/* glow pooled on the shelf under each jar */}
        <div
          className="absolute bottom-0 h-16 w-3/4 rounded-[50%] blur-2xl"
          style={{ background: f.glow, opacity: 0.45 }}
          aria-hidden
        />
        <motion.div style={{ rotateX, rotateY }} whileHover={{ y: -12 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          <JarArt color={f.sauce} ink={f.labelInk} name={f.name} className="relative h-64 w-auto drop-shadow-[0_30px_30px_rgba(0,0,0,0.6)] md:h-80" />
        </motion.div>
      </div>
      {/* the shelf itself */}
      <div className="h-1.5 bg-habanero" aria-hidden />
      <div className="h-3 bg-gradient-to-b from-[#7a2a00] to-transparent" aria-hidden />

      <div className="mt-6 flex flex-1 flex-col">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-4xl font-black uppercase leading-none">{f.name}</h3>
          <p className="font-display text-4xl font-black text-habanero">${f.price}</p>
        </div>
        <p className="mt-2 text-sm text-bone/60">
          {f.size}, heat {f.heat}/10
        </p>
        <p className="mt-3 text-bone/75">{f.short}</p>
        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <Stepper value={qty} onChange={setQty} label={f.name} min={1} />
          <AddButton id={f.id} qty={qty} />
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  const saved = flavors.reduce((s, f) => s + f.price, 0) - BUNDLE.price;

  return (
    <section id="shop" aria-labelledby="shop-title" className="layer-front relative px-4 py-28 md:px-10 md:py-40">
      <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 id="shop-title" className="font-display text-giant font-black uppercase leading-[0.86] tracking-tight">
          Pick your
          <br />
          <span className="text-outline">fire.</span>
        </h2>
        <p className="max-w-sm text-bone/70">
          Every jar ships within two days of pouring. Free shipping on orders over $40.
        </p>
      </div>

      <div className="grid gap-16 md:grid-cols-3 md:gap-10">
        {flavors.map((f) => (
          <ShelfJar key={f.id} f={f} />
        ))}
      </div>

      {/* bundle: the set of all three */}
      <div className="texture-paper relative mt-24 overflow-hidden rounded-[2rem] bg-habanero p-8 text-black md:mt-32 md:p-14">
        <div className="relative z-10 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <h3 className="font-display text-[clamp(3rem,8vw,8rem)] font-black uppercase leading-[0.82] tracking-tight">
              {BUNDLE.name}
            </h3>
            <p className="mt-5 max-w-md text-lg">
              All three jars in one box, from friendly to ferocious. Save ${saved} on buying them one by one.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <p className="font-display text-6xl font-black">${BUNDLE.price}</p>
              <p className="font-display text-3xl font-bold line-through opacity-50">${BUNDLE.price + saved}</p>
              <AddButton id={BUNDLE.id} label="Add the set" className="!bg-black !text-habanero hover:!bg-soot" />
            </div>
          </div>
          <div className="flex items-end justify-center gap-2 md:gap-4" aria-hidden>
            {flavors.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ y: 60, rotate: (i - 1) * 8, opacity: 0 }}
                whileInView={{ y: 0, rotate: (i - 1) * 6, opacity: 1 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ delay: i * 0.12, type: "spring", stiffness: 120, damping: 14 }}
              >
                <JarArt color={f.sauce} ink={f.labelInk} className={i === 1 ? "h-52 md:h-64" : "h-40 md:h-52"} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
