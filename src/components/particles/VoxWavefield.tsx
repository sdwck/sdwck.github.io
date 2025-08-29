import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const VOX_X = 110;
const VOX_Z = 44;
const VOX_COUNT = VOX_X * VOX_Z;

export default function VoxWavefield({ active }: { active: boolean }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.PointsMaterial>(null!);

  const phasesX = useMemo(() => Float32Array.from({ length: VOX_X }, () => Math.random() * Math.PI * 2), []);
  const phasesZ = useMemo(() => Float32Array.from({ length: VOX_Z }, () => Math.random() * Math.PI * 2), []);

  const { positions, baseX, baseZ, colors } = useMemo(() => {
    const pos = new Float32Array(VOX_COUNT * 3);
    const col = new Float32Array(VOX_COUNT * 3);
    const bx = new Float32Array(VOX_COUNT);
    const bz = new Float32Array(VOX_COUNT);

    const dx = 0.42;
    const dz = 0.42;
    const ox = -((VOX_X - 1) * dx) / 2;
    const oz = -((VOX_Z - 1) * dz) / 2;

    let idx = 0;
    for (let iz = 0; iz < VOX_Z; iz++) {
      for (let ix = 0; ix < VOX_X; ix++) {
        const i3 = idx * 3;
        const x = ox + ix * dx;
        const z = oz + iz * dz;
        pos[i3] = x;
        pos[i3 + 1] = 0;
        pos[i3 + 2] = z;
        bx[idx] = x;
        bz[idx] = z;
        new THREE.Color().setHSL(0.07, 0.75, 0.5).toArray(col, i3);
        idx++;
      }
    }
    return { positions: pos, baseX: bx, baseZ: bz, colors: col };
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current || !materialRef.current) return;
    const targetOpacity = active ? 0.9 : 0.0;
    materialRef.current.opacity += (targetOpacity - materialRef.current.opacity) * delta * 5;
    pointsRef.current.visible = materialRef.current.opacity > 0.01;

    if (!active) return;

    const t = state.clock.getElapsedTime();
    const arr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const cols = pointsRef.current.geometry.attributes.color.array as Float32Array;

    const envelope = 0.8 + 0.2 * Math.sin(t * 0.5) * Math.sin(t * 0.37 + 1.2);
    const A = 1.7 * envelope;

    for (let i = 0; i < VOX_COUNT; i++) {
      const i3 = i * 3;
      const x = baseX[i];
      const z = baseZ[i];

      const ix = Math.floor(((x + 100) / 200) * VOX_X) % VOX_X;
      const iz = Math.floor(((z + 100) / 200) * VOX_Z) % VOX_Z;

      const w1 = Math.sin(x * 2.0 + t * 2.4 + phasesX[ix]);
      const w2 = Math.sin(z * 2.6 + t * 1.7 + phasesZ[iz]);
      const w3 = Math.sin((x + z) * 1.4 + t * 3.1);
      const y = A * (w1 * 0.55 + w2 * 0.35 + w3 * 0.25);

      arr[i3 + 1] = y;

      const amp = Math.min(1, Math.abs(y) / (A * 1.1));
      const hue = 0.02 + 0.08 * ((x + 25) / 50) + 0.02 * Math.sin(t * 0.2);
      const c = new THREE.Color().setHSL(hue % 1, 0.85, 0.45 + 0.35 * amp);
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
      <pointsMaterial ref={materialRef} size={0.09} vertexColors transparent opacity={0.0} sizeAttenuation depthWrite={false} />
    </points>
  );
}
