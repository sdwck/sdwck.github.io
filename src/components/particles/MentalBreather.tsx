import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const MENTAL_COUNT = 4500;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export default function MentalBreather({ active }: { active: boolean }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.PointsMaterial>(null!);

  const { positions, angles, radii, colors } = useMemo(() => {
    const pos = new Float32Array(MENTAL_COUNT * 3);
    const ang = new Float32Array(MENTAL_COUNT);
    const rad = new Float32Array(MENTAL_COUNT);
    const col = new Float32Array(MENTAL_COUNT * 3);

    const maxR = 12;
    for (let i = 0; i < MENTAL_COUNT; i++) {
      const t = i + 1;
      const a = t * GOLDEN_ANGLE;
      const r = maxR * Math.sqrt(t / MENTAL_COUNT);
      ang[i] = a;
      rad[i] = r;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      const z = (Math.random() - 0.5) * 0.4;
      const i3 = i * 3;
      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;
      new THREE.Color().setHSL(0.58, 0.45, 0.72).toArray(col, i3);
    }
    return { positions: pos, angles: ang, radii: rad, colors: col };
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current || !materialRef.current) return;

    const targetOpacity = active ? 0.95 : 0.0;
    materialRef.current.opacity += (targetOpacity - materialRef.current.opacity) * delta * 5;
    pointsRef.current.visible = materialRef.current.opacity > 0.01;

    if (!active) return;

    const time = state.clock.getElapsedTime();
    const breath = 1 + 0.14 * Math.sin(time * 0.9);
    const swirl = 0.06 * Math.sin(time * 0.25);
    const ring = 6 + 5.5 * (0.5 + 0.5 * Math.sin(time * 0.18));

    const arr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const cols = pointsRef.current.geometry.attributes.color.array as Float32Array;

    for (let i = 0; i < MENTAL_COUNT; i++) {
      const i3 = i * 3;
      const a0 = angles[i] + swirl;
      const r0 = radii[i] * breath;
      const jitter = 0.06 * Math.sin(time * 0.8 + i * 0.025);

      arr[i3] = Math.cos(a0) * (r0 + jitter);
      arr[i3 + 1] = Math.sin(a0) * (r0 + jitter);
      arr[i3 + 2] = 0.25 * Math.sin(time * 0.3 + i * 0.05);

      const baseHue = 0.56 + 0.08 * Math.sin(time * 0.12 + r0 * 0.05);
      const baseLight = 0.65 + 0.15 * Math.sin(time * 0.18 + i * 0.01);
      const d = Math.abs(r0 - ring);
      const highlight = d < 0.4 ? 0.2 : d < 0.8 ? 0.1 : 0.0;
      const c = new THREE.Color().setHSL(baseHue, 0.5, Math.min(0.9, baseLight + highlight));
      c.toArray(cols, i3);
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial ref={materialRef} size={0.08} vertexColors transparent opacity={0.0} sizeAttenuation depthWrite={false} />
    </points>
  );
}
