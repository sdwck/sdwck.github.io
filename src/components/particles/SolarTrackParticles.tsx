import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const PARTICLE_COUNT = 600;

export default function SolarTrackParticles({ active }: { active: boolean }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.PointsMaterial>(null!);

  const { positions, phases, speeds } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const ph = new Float32Array(PARTICLE_COUNT);
    const sp = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 40;
      pos[i3 + 1] = (Math.random() - 0.5) * 20;
      pos[i3 + 2] = (Math.random() - 0.5) * 30;
      ph[i] = Math.random() * Math.PI * 2;
      sp[i] = 0.2 + Math.random() * 0.8;
    }
    return { positions: pos, phases: ph, speeds: sp };
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current || !materialRef.current) return;
    
    const targetOpacity = active ? 0.8 : 0.0;
    materialRef.current.opacity += (targetOpacity - materialRef.current.opacity) * delta * 5;
    pointsRef.current.visible = materialRef.current.opacity > 0.01;

    if (!active) return;

    const time = state.clock.getElapsedTime();
    const arr = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      arr[i3 + 1] += speeds[i] * delta * 2;
      arr[i3] += Math.sin(time * speeds[i] + phases[i]) * delta * 0.5;
      if (arr[i3 + 1] > 15) {
        arr[i3 + 1] = -15;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial 
        ref={materialRef} 
        size={0.15} 
        color="#fbbf24"
        transparent 
        opacity={0.0} 
        sizeAttenuation 
        depthWrite={false} 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}