"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { jarState, pointer } from "@/lib/jarState";
import { flavors } from "@/lib/products";
import { makeLabelTexture } from "./labelTexture";
import Steam from "./Steam";

const JAR_HEIGHT = 2.45;

/** Outer + inner wall of a heavy glass jar, as one closed lathe profile. */
function glassProfile() {
  const p: [number, number][] = [
    [0, 0],
    [0.86, 0],
    [0.96, 0.03],
    [1.0, 0.12],
    [1.0, 1.88],
    [0.97, 2.02],
    [0.88, 2.12],
    [0.8, 2.18],
    [0.8, 2.3],
    [0.82, 2.32], // thread
    [0.82, 2.36],
    [0.8, 2.38],
    [0.8, 2.45],
    [0.765, 2.45],
    [0.765, 2.18],
    [0.85, 2.1],
    [0.935, 2.0],
    [0.955, 1.88],
    [0.955, 0.17],
    [0.9, 0.1],
    [0, 0.1],
  ];
  return p.map(([x, y]) => new THREE.Vector2(x, y));
}

function sauceProfile() {
  const p: [number, number][] = [
    [0, 0.105],
    [0.88, 0.105],
    [0.948, 0.17],
    [0.948, 1.72],
    [0.93, 1.76], // meniscus
    [0.6, 1.775],
    [0, 1.78],
  ];
  return p.map(([x, y]) => new THREE.Vector2(x, y));
}

/** Knurled lid: a cylinder whose side vertices are pushed in and out. */
function lidGeometry() {
  const g = new THREE.CylinderGeometry(0.875, 0.875, 0.32, 240, 4, false);
  const pos = g.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const r = Math.hypot(v.x, v.z);
    if (r > 0.86 && Math.abs(v.y) < 0.13) {
      const a = Math.atan2(v.z, v.x);
      const k = 1 + Math.sign(Math.sin(a * 60)) * 0.006;
      pos.setXYZ(i, v.x * k, v.y, v.z * k);
    }
  }
  g.computeVertexNormals();
  return g;
}

function lidTopTexture() {
  const s = 512;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#0a0604";
  ctx.fillRect(0, 0, s, s);
  ctx.strokeStyle = "#ff5400";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(s / 2, s / 2, s * 0.42, 0, Math.PI * 2);
  ctx.stroke();
  // flame mark
  ctx.fillStyle = "#ff5400";
  ctx.beginPath();
  const cx = s / 2;
  const cy = s / 2 + 20;
  ctx.moveTo(cx, cy - 150);
  ctx.bezierCurveTo(cx + 110, cy - 40, cx + 90, cy + 90, cx, cy + 100);
  ctx.bezierCurveTo(cx - 90, cy + 90, cx - 110, cy - 40, cx, cy - 150);
  ctx.fill();
  ctx.fillStyle = "#0a0604";
  ctx.beginPath();
  ctx.moveTo(cx, cy - 30);
  ctx.bezierCurveTo(cx + 50, cy + 20, cx + 40, cy + 80, cx, cy + 82);
  ctx.bezierCurveTo(cx - 40, cy + 80, cx - 50, cy + 20, cx, cy - 30);
  ctx.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export default function Jar({ reducedMotion }: { reducedMotion: boolean }) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const sauceMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const labelMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const shownFlavor = useRef(-1);
  const { viewport, size } = useThree();

  const glassGeo = useMemo(() => new THREE.LatheGeometry(glassProfile(), 160), []);
  const sauceGeo = useMemo(() => new THREE.LatheGeometry(sauceProfile(), 120), []);
  const lidGeo = useMemo(lidGeometry, []);

  // Label and lid textures use the page fonts, so wait for them to load.
  const [textures, setTextures] = useState<THREE.Texture[] | null>(null);
  const [lidTex, setLidTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let alive = true;
    document.fonts.ready.then(() => {
      if (!alive) return;
      setTextures(flavors.map((_, i) => makeLabelTexture(i)));
      setLidTex(lidTopTexture());
    });
    return () => {
      alive = false;
    };
  }, []);

  const smooth = useRef({ x: 0, y: 0, s: 1, px: 0, py: 0, lid: 0.35 });

  useFrame((state, dt) => {
    const g = root.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const s = smooth.current;
    const k = 1 - Math.pow(0.0015, dt); // frame-rate independent easing

    s.x += (jarState.x * viewport.width - s.x) * k;
    s.y += (jarState.y * viewport.height - s.y) * k;
    s.px += (pointer.x - s.px) * k * 0.6;
    s.py += (pointer.y - s.py) * k * 0.6;
    s.lid += (jarState.lid - s.lid) * k;

    // Fit the jar to the viewport: by height on desktop, by width on phones.
    const fit = Math.min(viewport.height / 5, viewport.width / 3.2);
    const target = fit * jarState.scale * jarState.visible;
    s.s += (target - s.s) * k;

    const bob = reducedMotion ? 0 : Math.sin(t * 0.9) * 0.04 * fit;
    g.position.set(s.x, s.y + bob, 0);
    g.scale.setScalar(Math.max(s.s, 0.0001));
    g.visible = s.s > 0.01;

    if (body.current) {
      const idle = reducedMotion ? 0 : t * 0.22;
      body.current.rotation.y = idle + jarState.spin + s.px * 0.35;
      body.current.rotation.x = jarState.tilt - s.py * 0.12;
      body.current.rotation.z = -s.px * 0.05;
    }
    if (lid.current) {
      lid.current.position.y = JAR_HEIGHT - 0.04 + s.lid * 0.9;
      lid.current.rotation.y = s.lid * 1.4;
      lid.current.rotation.z = s.lid * 0.12;
    }

    sauceMat.current?.color.setRGB(jarState.r, jarState.g, jarState.b);
    sauceMat.current?.emissive.setRGB(jarState.r * 0.18, jarState.g * 0.1, jarState.b * 0.05);

    const fi = Math.round(jarState.flavor);
    if (textures && labelMat.current && fi !== shownFlavor.current) {
      labelMat.current.map = textures[fi];
      labelMat.current.needsUpdate = true;
      shownFlavor.current = fi;
    }
  });

  const isSmall = size.width < 768;

  return (
    <group ref={root}>
      <group ref={body}>
        {/* everything is built from the jar's base; shift so it pivots at its middle */}
        <group position={[0, -JAR_HEIGHT / 2 - 0.15, 0]}>
          <mesh geometry={glassGeo} renderOrder={2}>
            <MeshTransmissionMaterial
              samples={isSmall ? 4 : 8}
              resolution={isSmall ? 512 : 1024}
              transmission={1}
              roughness={0.03}
              thickness={0.35}
              ior={1.5}
              chromaticAberration={0.05}
              anisotropy={0.2}
              distortion={0.08}
              distortionScale={0.4}
              temporalDistortion={0}
              clearcoat={1}
              clearcoatRoughness={0.05}
              attenuationColor="#fff3e6"
              attenuationDistance={2.5}
              envMapIntensity={1.4}
              backside
              backsideThickness={0.2}
            />
          </mesh>

          <mesh geometry={sauceGeo}>
            <meshPhysicalMaterial
              ref={sauceMat}
              roughness={0.22}
              clearcoat={1}
              clearcoatRoughness={0.15}
              sheen={0.35}
              sheenColor="#ffb070"
              envMapIntensity={1.1}
            />
          </mesh>

          {/* wrap-around label, sitting just proud of the glass */}
          {/* turned so one printed face points at the camera when spin is 0 */}
          <mesh position={[0, 0.98, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <cylinderGeometry args={[1.006, 1.006, 1.02, 160, 1, true]} />
            <meshPhysicalMaterial
              ref={labelMat}
              color={textures ? "#ffffff" : "#050302"}
              roughness={0.62}
              clearcoat={0.35}
              clearcoatRoughness={0.4}
              side={THREE.FrontSide}
            />
          </mesh>

          <group ref={lid} position={[0, JAR_HEIGHT, 0]}>
            <mesh geometry={lidGeo} position={[0, 0.16, 0]}>
              <meshPhysicalMaterial
                color="#0c0907"
                metalness={0.85}
                roughness={0.32}
                clearcoat={0.6}
                clearcoatRoughness={0.25}
              />
            </mesh>
            <mesh position={[0, 0.321, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.82, 96]} />
              <meshPhysicalMaterial
                map={lidTex}
                color={lidTex ? "#ffffff" : "#0a0604"}
                metalness={0.5}
                roughness={0.35}
                clearcoat={1}
              />
            </mesh>
          </group>

          <Steam position={[0, JAR_HEIGHT + 0.3, 0]} reducedMotion={reducedMotion} />
        </group>
      </group>
    </group>
  );
}
