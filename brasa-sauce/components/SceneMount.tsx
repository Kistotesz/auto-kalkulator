"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";

const Scene = dynamic(() => import("./scene/Scene"), { ssr: false });

/** Fixed, full-screen WebGL layer that sits between the backdrop and the copy. */
export default function SceneMount() {
  const reduced = useReducedMotion() ?? false;
  return (
    <div className="pointer-events-none fixed inset-0 z-10" aria-hidden>
      <Scene reducedMotion={reduced} />
    </div>
  );
}
