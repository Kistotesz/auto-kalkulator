"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { jarState, flavorRgb } from "@/lib/jarState";
import { flavors } from "@/lib/products";

gsap.registerPlugin(ScrollTrigger);

/**
 * Choreographs the 3D jar against the page. Every section owns a slice of
 * the scroll, and scrubbed tweens move, spin and open the jar within it.
 */
export default function Director() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // The one orchestrated load moment: the jar rises in, spins, lid lifts.
    const intro = gsap.timeline({ delay: 0.25 });
    jarState.visible = 0;
    jarState.lid = 0;
    intro
      .fromTo(jarState, { visible: 0, spin: -Math.PI * 1.2 }, { visible: 1, spin: 0, duration: reduce ? 0.01 : 1.8, ease: "expo.out" })
      .to(jarState, { lid: 0.35, duration: reduce ? 0.01 : 1.1, ease: "power3.out" }, "-=0.9");

    const setFlavor = (i: number) => {
      jarState.flavor = i;
      gsap.to(jarState, { ...flavorRgb[i], duration: 0.9, ease: "power2.inOut", overwrite: "auto" });
      document.documentElement.style.setProperty("--glow", flavors[i].glow);
    };

    const mm = gsap.matchMedia();

    mm.add(
      { desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" },
      (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        const scrub = reduce ? true : 1;

        // resting place in the hero: centred low on desktop, smaller and higher on phones
        gsap.set(jarState, desktop ? { x: 0, y: -0.05, scale: 1 } : { x: 0, y: 0.06, scale: 0.8 });

        // Hero → Process: slide right, lid settles down a little.
        gsap.timeline({ scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub } })
          .to(jarState, desktop
            ? { x: 0.24, y: -0.02, scale: 0.92, lid: 0.12, spin: Math.PI, tilt: 0.08, ease: "none" }
            : { x: 0, y: 0.24, scale: 0.62, lid: 0.12, spin: Math.PI, ease: "none" }, 0);

        // Process: a full turn while the lid comes down and seals.
        gsap.timeline({ scrollTrigger: { trigger: "#process", start: "top top", end: "bottom bottom", scrub } })
          .to(jarState, { spin: Math.PI * 3, lid: 0, steam: 0.4, tilt: 0, ease: "none" }, 0);

        // Process → Flavors: back to centre stage, a touch bigger.
        gsap.timeline({ scrollTrigger: { trigger: "#flavors", start: "top bottom", end: "top top", scrub } })
          .to(jarState, desktop
            ? { x: 0, y: -0.02, scale: 1.02, lid: 0.25, steam: 1, ease: "none" }
            : { x: 0, y: 0.2, scale: 0.7, lid: 0.25, steam: 1, ease: "none" }, 0);

        // Each flavour panel turns the jar half a turn and swaps the sauce.
        gsap.utils.toArray<HTMLElement>("[data-flavor]").forEach((panel) => {
          const i = Number(panel.dataset.flavor);
          ScrollTrigger.create({
            trigger: panel,
            start: "top 55%",
            end: "bottom 55%",
            onEnter: () => setFlavor(i),
            onEnterBack: () => setFlavor(i),
          });
          gsap.to(jarState, {
            spin: `+=${Math.PI}`,
            ease: "none",
            scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub },
          });
        });

        // Ingredients: the jar steps aside and opens up.
        gsap.timeline({ scrollTrigger: { trigger: "#ingredients", start: "top bottom", end: "top 20%", scrub } })
          .to(jarState, desktop
            ? { x: -0.28, y: -0.04, scale: 0.78, lid: 0.7, tilt: 0.15, ease: "none" }
            : { x: 0, y: 0.3, scale: 0.5, visible: 0, lid: 0.7, ease: "none" }, 0);

        // Shop: the real jar bows out so the shelf can take over.
        gsap.timeline({ scrollTrigger: { trigger: "#shop", start: "top bottom", end: "top 25%", scrub } })
          .to(jarState, { visible: 0, y: desktop ? 0.25 : 0.35, ease: "none" }, 0);
      }
    );

    return () => {
      intro.kill();
      mm.revert();
    };
  }, []);

  return null;
}
