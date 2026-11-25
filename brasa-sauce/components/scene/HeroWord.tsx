"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";

const DEPTH = -2.6;

/**
 * The giant wordmark lives in the 3D scene, behind the jar, so the glass
 * actually refracts it. It scrolls away 1:1 with the page.
 */
export default function HeroWord() {
  const group = useRef<THREE.Group>(null);
  const textWidth = useRef(2.4); // measured once troika has laid out the glyphs
  const { camera, viewport } = useThree();

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const vp = viewport.getCurrentViewport(camera, new THREE.Vector3(0, 0, DEPTH));
    const progress = window.scrollY / window.innerHeight;
    const isTall = vp.aspect < 0.8;
    // centred slightly above the middle on desktop, higher on phones
    g.position.set(0, (isTall ? 0.28 : 0.13) * vp.height + progress * vp.height, DEPTH);
    const w = vp.width * (isTall ? 0.96 : 0.92);
    g.scale.setScalar(w / textWidth.current);
    g.visible = progress < 1.3;
  });

  return (
    <group ref={group}>
      <Text
        font="/fonts/BigShoulders-Black.ttf"
        fontSize={1}
        onSync={(mesh: THREE.Mesh) => {
          mesh.geometry.computeBoundingBox();
          const bb = mesh.geometry.boundingBox;
          if (bb) textWidth.current = Math.max(bb.max.x - bb.min.x, 0.1);
        }}
        letterSpacing={-0.02}
        anchorX="center"
        anchorY="middle"
        maxWidth={10}
      >
        BRASA
        <meshBasicMaterial color="#ff5400" toneMapped={false} />
      </Text>
    </group>
  );
}
