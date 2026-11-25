import { flavors } from "./products";

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

/**
 * A plain mutable object shared between GSAP (which tweens it on scroll)
 * and the three.js render loop (which reads it every frame).
 * Positions are fractions of the visible viewport so they work at any size.
 */
export const jarState = {
  x: 0, // -0.5 … 0.5 of viewport width
  y: -0.05, // -0.5 … 0.5 of viewport height
  scale: 1,
  spin: 0, // extra rotation around Y, radians
  tilt: 0, // lean toward camera, radians
  lid: 0.35, // 0 = sealed, 1 = lifted high
  steam: 1, // steam strength
  visible: 1, // 0 … 1 overall presence
  flavor: 0, // index into flavors for the label
  ...hexToRgb(flavors[0].sauce),
};

export const flavorRgb = flavors.map((f) => hexToRgb(f.sauce));

/** Live pointer position, -1 … 1 on both axes. */
export const pointer = { x: 0, y: 0 };
