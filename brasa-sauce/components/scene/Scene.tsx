"use client";

import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { pointer } from "@/lib/jarState";
import Jar from "./Jar";
import Spices from "./Spices";
import HeroWord from "./HeroWord";

/** Lights that move: a key light that follows the pointer and a fire flicker. */
function DynamicLights({ reducedMotion }: { reducedMotion: boolean }) {
  const key = useRef<THREE.SpotLight>(null);
  const fire = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (key.current) {
      key.current.position.x += (pointer.x * 6 - key.current.position.x) * 0.05;
      key.current.position.y += (3 + pointer.y * 3 - key.current.position.y) * 0.05;
    }
    if (fire.current) {
      // layered sines read as an uneven, living flame
      const flicker = reducedMotion
        ? 0
        : Math.sin(t * 7.3) * 0.5 + Math.sin(t * 13.1 + 1.3) * 0.3 + Math.sin(t * 2.1) * 0.6;
      fire.current.intensity = 22 + flicker * 5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.12} />
      <spotLight
        ref={key}
        position={[2, 3, 6]}
        angle={0.5}
        penumbra={1}
        intensity={70}
        color="#fff1e0"
        decay={2}
      />
      <pointLight ref={fire} position={[0, -2.6, 1.2]} color="#ff5a00" intensity={22} distance={9} decay={2} />
      <pointLight position={[-4, 1.5, -2]} color="#ff7a1a" intensity={30} distance={12} decay={2} />
    </>
  );
}

export default function Scene({ reducedMotion }: { reducedMotion: boolean }) {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 30 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <Suspense fallback={null}>
        <HeroWord />
        <Jar reducedMotion={reducedMotion} />
        <Spices reducedMotion={reducedMotion} />
        <DynamicLights reducedMotion={reducedMotion} />

        {/* studio light panels: these are what draw the long streaks on the glass */}
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={4} color="#ffffff" position={[-4, 1, 3]} rotation={[0, Math.PI / 3, 0]} scale={[1.2, 9, 1]} />
          <Lightformer form="rect" intensity={6} color="#ff5a00" position={[4.5, 0, 1]} rotation={[0, -Math.PI / 2.4, 0]} scale={[1.5, 9, 1]} />
          <Lightformer form="rect" intensity={1.5} color="#fff4ea" position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 3, 1]} />
          <Lightformer form="ring" intensity={2} color="#ff9a3c" position={[0, 0, -6]} scale={4} />
          <Lightformer form="rect" intensity={1} color="#ff3c00" position={[0, -4, 2]} rotation={[-Math.PI / 2, 0, 0]} scale={[10, 4, 1]} />
        </Environment>
      </Suspense>
    </Canvas>
  );
}
