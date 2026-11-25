"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { jarState } from "@/lib/jarState";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uStrength;
  uniform float uSeed;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
               mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.18;
    // the column sways and widens as it rises
    float sway = sin(uv.y * 3.2 + uTime * 0.5 + uSeed) * 0.09 * uv.y;
    float dx = abs(uv.x - 0.5 - sway);
    float width = mix(0.12, 0.42, uv.y);
    float mask = smoothstep(width, 0.0, dx);
    mask *= smoothstep(0.0, 0.18, uv.y) * smoothstep(1.0, 0.4, uv.y);

    vec2 q = vec2(uv.x * 2.2 + uSeed, uv.y * 1.6 - t * 1.6);
    q.x += sin(uv.y * 5.0 - uTime * 0.7 + uSeed) * 0.22 * uv.y;
    float n = fbm(q * 1.7 + fbm(q * 2.3) * 0.6);
    float a = smoothstep(0.3, 0.85, n) * mask * uStrength;
    gl_FragColor = vec4(vec3(1.0, 0.94, 0.88), a * 0.85);
  }
`;

const PLUMES = 3;

export default function Steam({
  position,
  reducedMotion,
}: {
  position: [number, number, number];
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const materials = useMemo(
    () =>
      Array.from({ length: PLUMES }, (_, i) =>
        new THREE.ShaderMaterial({
          vertexShader: vertex,
          fragmentShader: fragment,
          uniforms: {
            uTime: { value: 0 },
            uStrength: { value: 1 },
            uSeed: { value: i * 3.7 },
          },
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      ),
    []
  );

  const parentQ = useMemo(() => new THREE.Quaternion(), []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    // keep the plumes facing the camera even while the jar spins
    g.parent?.getWorldQuaternion(parentQ);
    g.quaternion.copy(parentQ.invert()).multiply(state.camera.quaternion);

    const t = reducedMotion ? 4 : state.clock.elapsedTime;
    const strength = jarState.steam * (0.25 + jarState.lid * 0.9);
    for (const m of materials) {
      m.uniforms.uTime.value = t;
      m.uniforms.uStrength.value = strength;
    }
  });

  return (
    <group ref={group} position={position}>
      {materials.map((m, i) => (
        <mesh
          key={i}
          material={m}
          position={[(i - 1) * 0.28, 1.1 + i * 0.08, -0.05 * i]}
          renderOrder={5}
        >
          <planeGeometry args={[1.5, 2.6]} />
        </mesh>
      ))}
    </group>
  );
}
