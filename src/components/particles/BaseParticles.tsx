import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const MAX_PARTICLES = 5000;

function getSpawnAttributes() {
  const positions = new Float32Array(MAX_PARTICLES * 3);
  const colors = new Float32Array(MAX_PARTICLES * 3);
  const color = new THREE.Color(0xffffff);
  for (let i = 0; i < MAX_PARTICLES; i++) {
    const i3 = i * 3;
    positions.set([0, 0, 0], i3);
    color.toArray(colors, i3);
  }
  return { positions, colors };
}

function getStarfieldAttributes() {
  const positions = new Float32Array(MAX_PARTICLES * 3);
  const colors = new Float32Array(MAX_PARTICLES * 3);
  for (let i = 0; i < MAX_PARTICLES; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 120;
    positions[i3 + 1] = (Math.random() - 0.5) * 120;
    positions[i3 + 2] = (Math.random() - 0.5) * 120;
    const color = new THREE.Color().setHSL(Math.random(), 0.7, 0.85);
    color.toArray(colors, i3);
  }
  return { positions, colors };
}

function getYouTubeAttributes() {
  const positions = new Float32Array(MAX_PARTICLES * 3);
  const colors = new Float32Array(MAX_PARTICLES * 3);
  const colorRed = new THREE.Color(0xff0033);
  const colorWhite = new THREE.Color(0xffffff);

  const scale = 6.5;
  const v1 = new THREE.Vector3(2.5 * scale, 0, 0);
  const v2 = new THREE.Vector3(-1.5 * scale, 2 * scale, 0);
  const v3 = new THREE.Vector3(-1.5 * scale, -2 * scale, 0);

  for (let i = 0; i < MAX_PARTICLES; i++) {
    const i3 = i * 3;
    if (i < MAX_PARTICLES * 0.75) {
      positions[i3] = (Math.random() - 0.5) * 16 * scale;
      positions[i3 + 1] = (Math.random() - 0.5) * 10 * scale;
      positions[i3 + 2] = (Math.random() - 0.5) * 2 * scale;
      colorRed.toArray(colors, i3);
    } else {
      const r1 = Math.random(), r2 = Math.random();
      const s1 = 1 - Math.sqrt(r1), s2 = Math.sqrt(r1) * (1 - r2), s3 = Math.sqrt(r1) * r2;
      positions[i3] = s1 * v1.x + s2 * v2.x + s3 * v3.x;
      positions[i3 + 1] = s1 * v1.y + s2 * v2.y + s3 * v3.y;
      positions[i3 + 2] = (Math.random() - 0.5) * 2 * scale;
      colorWhite.toArray(colors, i3);
    }
  }
  return { positions, colors };
}

export default function BaseParticles({ activeProject }: { activeProject: string | null }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.PointsMaterial>(null!);

  const particleRandomness = useMemo(() => {
    const randomness = new Float32Array(MAX_PARTICLES);
    for (let i = 0; i < MAX_PARTICLES; i++) randomness[i] = Math.random() * Math.PI * 2;
    return randomness;
  }, []);

  const targetAttributes = useMemo(() => {
    switch (activeProject) {
      case 'youtube-dm':
        return getYouTubeAttributes();
      default:
        return getStarfieldAttributes();
    }
  }, [activeProject]);

  useFrame((state, delta) => {
    const points = pointsRef.current;
    if (!points || !materialRef.current) return;

    const hideFor = activeProject === 'unlinknl' || activeProject === 'mental-reset' || activeProject === 'voxnl' || activeProject === 'nail-salon' || activeProject === 'moviebot';
    const targetOpacity = hideFor ? 0 : 0.85;
    materialRef.current.opacity += (targetOpacity - materialRef.current.opacity) * delta * 5;
    points.visible = materialRef.current.opacity > 0.01;

    const time = state.clock.getElapsedTime();
    const lerpFactor = Math.min(delta * 1.5, 1);
    const currentPositions = points.geometry.attributes.position.array as Float32Array;
    const currentColors = points.geometry.attributes.color.array as Float32Array;
    const targetPositions = targetAttributes.positions;
    const targetColors = targetAttributes.colors;

    for (let i = 0; i < MAX_PARTICLES; i++) {
      const i3 = i * 3;
      let targetX = targetPositions[i3], targetY = targetPositions[i3 + 1], targetZ = targetPositions[i3 + 2];

      if (activeProject === 'youtube-dm') {
        const randomOffset = particleRandomness[i];
        const noiseFactor = Math.sin(time * 1.5 + targetX * 0.1 + randomOffset);
        targetZ += noiseFactor * 1.3;
      }

      currentPositions[i3] += (targetX - currentPositions[i3]) * lerpFactor;
      currentPositions[i3 + 1] += (targetY - currentPositions[i3 + 1]) * lerpFactor;
      currentPositions[i3 + 2] += (targetZ - currentPositions[i3 + 2]) * lerpFactor;

      currentColors[i3] += (targetColors[i3] - currentColors[i3]) * lerpFactor;
      currentColors[i3 + 1] += (targetColors[i3 + 1] - currentColors[i3 + 1]) * lerpFactor;
      currentColors[i3 + 2] += (targetColors[i3 + 2] - currentColors[i3 + 2]) * lerpFactor;
    }
    points.geometry.attributes.position.needsUpdate = true;
    points.geometry.attributes.color.needsUpdate = true;
  });

  const initialAttributes = useMemo(() => getSpawnAttributes(), []);

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[initialAttributes.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[initialAttributes.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial ref={materialRef} size={0.12} vertexColors transparent opacity={0.85} sizeAttenuation depthWrite={false} />
    </points>
  );
}
