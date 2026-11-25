"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { jarState, pointer } from "@/lib/jarState";

type Particle = {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  rot: THREE.Euler;
  spin: THREE.Vector3;
  scale: THREE.Vector3;
};

function makeParticles(count: number, flat: number, size: [number, number]): Particle[] {
  return Array.from({ length: count }, () => {
    const a = Math.random() * Math.PI * 2;
    const r = 1.4 + Math.random() * 3.2;
    const s = size[0] + Math.random() * (size[1] - size[0]);
    return {
      pos: new THREE.Vector3(Math.cos(a) * r * 1.4, (Math.random() - 0.5) * 6, Math.sin(a) * r * 0.5 - 1.4),
      vel: new THREE.Vector3((Math.random() - 0.5) * 0.06, 0.05 + Math.random() * 0.12, (Math.random() - 0.5) * 0.04),
      rot: new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6),
      spin: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(1.6),
      scale: new THREE.Vector3(s, s * flat, s * (0.6 + Math.random() * 0.5)),
    };
  });
}

function Swarm({
  count,
  geometry,
  colors,
  flat,
  size,
  material,
  reducedMotion,
}: {
  count: number;
  geometry: THREE.BufferGeometry;
  colors: string[];
  flat: number;
  size: [number, number];
  material: THREE.Material;
  reducedMotion: boolean;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const particles = useMemo(() => makeParticles(count, flat, size), [count, flat, size]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { viewport } = useThree();

  useLayoutEffect(() => {
    const m = mesh.current!;
    const c = new THREE.Color();
    particles.forEach((_, i) => m.setColorAt(i, c.set(colors[i % colors.length])));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [particles, colors]);

  useFrame((state, dt) => {
    const m = mesh.current;
    if (!m) return;
    const speed = reducedMotion ? 0.15 : 1;
    const d = Math.min(dt, 0.05) * speed;
    const t = state.clock.elapsedTime;
    const halfH = 3.4;

    particles.forEach((p, i) => {
      p.pos.addScaledVector(p.vel, d);
      // a slow swirl, as if caught in rising heat
      p.pos.x += Math.sin(t * 0.3 + i) * 0.002 * speed;
      if (p.pos.y > halfH) p.pos.y = -halfH;
      p.rot.x += p.spin.x * d;
      p.rot.y += p.spin.y * d;
      p.rot.z += p.spin.z * d;

      dummy.position.copy(p.pos);
      // nearer particles drift more with the pointer, for depth
      const depth = 1 + p.pos.z * 0.35;
      dummy.position.x += pointer.x * 0.25 * depth;
      dummy.position.y += pointer.y * 0.15 * depth;
      dummy.rotation.copy(p.rot);
      dummy.scale.copy(p.scale);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;

    // the cloud follows the jar around the page, and fades with it
    const fit = Math.min(viewport.height / 5, viewport.width / 3.2);
    m.position.x += (jarState.x * viewport.width - m.position.x) * 0.06;
    m.position.y += (jarState.y * viewport.height - m.position.y) * 0.06;
    const s = fit * (0.6 + 0.4 * jarState.scale) * jarState.visible;
    m.scale.setScalar(Math.max(s, 0.0001));
    m.visible = jarState.visible > 0.05; // don't let a shrinking cloud collapse into a dot
  });

  return <instancedMesh ref={mesh} args={[geometry, material, count]} frustumCulled={false} />;
}

export default function Spices({ reducedMotion }: { reducedMotion: boolean }) {
  const flakeGeo = useMemo(() => {
    // irregular chilli flake: a squashed, jittered icosahedron
    const g = new THREE.IcosahedronGeometry(1, 0);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pos.setXYZ(i, pos.getX(i) * (0.7 + Math.random() * 0.6), pos.getY(i), pos.getZ(i) * (0.7 + Math.random() * 0.6));
    }
    g.computeVertexNormals();
    return g;
  }, []);
  const seedGeo = useMemo(() => new THREE.SphereGeometry(1, 10, 8), []);
  const flakeMat = useMemo(
    () => new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0, flatShading: true }),
    []
  );
  const seedMat = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0 }), []);

  return (
    <>
      <Swarm
        count={64}
        geometry={flakeGeo}
        material={flakeMat}
        colors={["#c81e06", "#ff4d00", "#8f1404", "#ff7a1a", "#3a0a03"]}
        flat={0.22}
        size={[0.028, 0.065]}
        reducedMotion={reducedMotion}
      />
      <Swarm
        count={36}
        geometry={seedGeo}
        material={seedMat}
        colors={["#f2d49b", "#e8c27a", "#fff0c8"]}
        flat={0.35}
        size={[0.016, 0.032]}
        reducedMotion={reducedMotion}
      />
    </>
  );
}
