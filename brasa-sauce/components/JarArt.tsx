import { useId } from "react";

/** A drawn jar used in the shop and cart, matched to the 3D model. */
export default function JarArt({
  color,
  ink = color,
  className,
  name,
}: {
  color: string;
  ink?: string;
  className?: string;
  name?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 120 170" className={className} aria-hidden>
      <defs>
        <linearGradient id={`sauce-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.7" />
          <stop offset="0.35" stopColor={color} />
          <stop offset="0.8" stopColor={color} stopOpacity="0.85" />
          <stop offset="1" stopColor="#000" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id={`glass-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.12" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="0.85" stopColor="#fff" stopOpacity="0.02" />
          <stop offset="0.95" stopColor="#ff9a1f" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id={`lid-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#2a211b" />
          <stop offset="0.3" stopColor="#5a4a40" />
          <stop offset="0.55" stopColor="#0c0907" />
          <stop offset="1" stopColor="#1e1712" />
        </linearGradient>
      </defs>
      {/* sauce */}
      <path d="M14 58 h92 v90 q0 12 -12 12 h-68 q-12 0 -12 -12z" fill={`url(#sauce-${id})`} />
      {/* glass body */}
      <path
        d="M10 50 q0 -8 12 -12 l8 -4 v-6 h60 v6 l8 4 q12 4 12 12 v98 q0 16 -16 16 h-68 q-16 0 -16 -16z"
        fill={`url(#glass-${id})`}
        stroke="rgba(245,233,216,0.35)"
        strokeWidth="1.2"
      />
      {/* label */}
      <rect x="10" y="78" width="100" height="50" fill="#050302" />
      <rect x="10" y="82" width="100" height="42" fill="none" stroke={ink} strokeWidth="1" />
      <text
        x="60"
        y="104"
        textAnchor="middle"
        style={{ fontFamily: "var(--font-display)" }}
        fontWeight="900"
        fontSize="20"
        fill={ink}
      >
        BRASA
      </text>
      {name && (
        <text x="60" y="117" textAnchor="middle" style={{ fontFamily: "var(--font-display)" }} fontWeight="800" fontSize="8" fill="#f5e9d8">
          {name.toUpperCase()}
        </text>
      )}
      {/* lid with knurling */}
      <rect x="26" y="8" width="68" height="22" rx="3" fill={`url(#lid-${id})`} />
      {Array.from({ length: 22 }, (_, i) => (
        <line key={i} x1={29 + i * 3} x2={29 + i * 3} y1="11" y2="27" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      ))}
      {/* highlight streak */}
      <path d="M20 60 q-2 40 0 88" stroke="rgba(255,255,255,0.35)" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}
