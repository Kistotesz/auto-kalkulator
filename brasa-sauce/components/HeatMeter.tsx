"use client";

import { motion } from "framer-motion";

export default function HeatMeter({ heat, color }: { heat: number; color: string }) {
  return (
    <div role="img" aria-label={`Heat ${heat} out of 10`} className="flex items-end gap-1.5">
      {Array.from({ length: 10 }, (_, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 20 28"
          className="h-6 w-auto md:h-7"
          initial={{ opacity: 0.15, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
          aria-hidden
        >
          <path
            d="M10 1C16 9 19 14 17 20c-1.5 4.5-5 7-7 7s-5.5-2.5-7-7C1 14 4 9 10 1z"
            fill={i < heat ? color : "none"}
            stroke={i < heat ? color : "rgba(245,233,216,0.3)"}
            strokeWidth="1.5"
          />
        </motion.svg>
      ))}
    </div>
  );
}
