import { useMemo, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';

const DEFAULT_POSTER_PATH = '/moviebot/bg/';
const DEFAULT_POSTER_COUNT = 62;
const DEFAULT_POSTERS = Array.from({ length: DEFAULT_POSTER_COUNT }, (_, i) => `${DEFAULT_POSTER_PATH}${i + 1}.webp`);
const TOTAL_IMAGES = 120;

function onIdle(cb: () => void) {
  if (typeof window === 'undefined') return () => {};
  const ric = (window as any).requestIdleCallback;
  if (typeof ric === 'function') {
    const id = (window as any).requestIdleCallback(cb);
    return () => (window as any).cancelIdleCallback(id);
  } else {
    const id = window.setTimeout(cb, 120);
    return () => clearTimeout(id);
  }
}

function makeInitialPositions(count: number, spread = 40) {
  const arr: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = spread * Math.sin(phi) * Math.cos(theta);
    const y = spread * Math.sin(phi) * Math.sin(theta);
    const z = spread * Math.cos(phi);
    arr.push(new THREE.Vector3(x, y, z));
  }
  return arr;
}

export default function PosterParticles({ active }: { active: boolean }) {
  const textures = useLoader(TextureLoader, DEFAULT_POSTERS);
  const { camera } = useThree();

  const groups = useMemo(() => {
    const perTex = Math.ceil(TOTAL_IMAGES / textures.length);
    return Array.from({ length: textures.length }, (_, texIndex) => {
      const basePositions = makeInitialPositions(perTex, 9 + texIndex * 0.4);
      const baseX = new Float32Array(basePositions.length);
      const baseY = new Float32Array(basePositions.length);
      const baseZ = new Float32Array(basePositions.length);
      for (let i = 0; i < basePositions.length; i++) {
        baseX[i] = basePositions[i].x;
        baseY[i] = basePositions[i].y;
        baseZ[i] = basePositions[i].z;
      }
      const seeds = new Float32Array(basePositions.length);
      for (let i = 0; i < basePositions.length; i++) seeds[i] = Math.random() * 1000;
      return {
        length: basePositions.length,
        baseX,
        baseY,
        baseZ,
        seeds,
      };
    });
  }, [textures.length]);

  const materials = useMemo(
    () =>
      textures.map((t) =>
        new THREE.MeshBasicMaterial({
          map: t,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          toneMapped: false,
          side: THREE.DoubleSide,
        })
      ),
    [textures]
  );

  return (
    <group>
      {groups.map((g, gi) => (
        <TextureImageGroup
          key={gi}
          length={g.length}
          baseX={g.baseX}
          baseY={g.baseY}
          baseZ={g.baseZ}
          seeds={g.seeds}
          material={materials[gi]}
          planeScale={1.6}
          active={active}
          camera={camera}
        />
      ))}
    </group>
  );
}

function TextureImageGroup({
  length,
  baseX,
  baseY,
  baseZ,
  seeds,
  material,
  planeScale,
  active,
  camera,
}: {
  length: number;
  baseX: Float32Array;
  baseY: Float32Array;
  baseZ: Float32Array;
  seeds: Float32Array;
  material: THREE.Material;
  planeScale: number;
  active: boolean;
  camera: THREE.Camera;
}) {
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const tmp = useMemo(() => new THREE.Object3D(), []);
  const geom = useMemo(() => new THREE.PlaneGeometry(1, 1.5), []);
  const posX = useMemo(() => new Float32Array(length), [length]);
  const posY = useMemo(() => new Float32Array(length), [length]);
  const posZ = useMemo(() => new Float32Array(length), [length]);
  const velX = useMemo(() => new Float32Array(length), [length]);
  const velY = useMemo(() => new Float32Array(length), [length]);
  const velZ = useMemo(() => new Float32Array(length), [length]);
  const phase = useMemo(() => {
    const p = new Float32Array(length);
    for (let i = 0; i < length; i++) p[i] = Math.random() * Math.PI * 2;
    return p;
  }, [length]);
  const wob = useMemo(() => {
    const w = new Float32Array(length);
    for (let i = 0; i < length; i++) w[i] = Math.random() * 0.8;
    return w;
  }, [length]);

  useEffect(() => {
    for (let i = 0; i < length; i++) {
      posX[i] = baseX[i];
      posY[i] = baseY[i];
      posZ[i] = baseZ[i];
      velX[i] = 0;
      velY[i] = 0;
      velZ[i] = 0;
    }
  }, [length, baseX, baseY, baseZ, posX, posY, posZ, velX, velY, velZ]);

  const INITIAL_ACTIVE = Math.max(20, Math.min(120, Math.floor(length * 0.2)));
  const [activeCount, setActiveCount] = useState(() => INITIAL_ACTIVE);

  useEffect(() => {
    const cancel = onIdle(() => {
      let next = INITIAL_ACTIVE;
      const step = Math.max(5, Math.floor(length / 8));
      const tick = () => {
        next = Math.min(length, next + step);
        setActiveCount(next);
        if (next < length) {
          onIdle(tick);
        }
      };
      tick();
    });
    return () => cancel();
  }, [length]);

  useFrame((st, delta) => {
    if (!meshRef.current) return;
    const t = st.clock.getElapsedTime();
    const mat: any = material as any;
    const targetOpacity = active ? 1.0 : 0.0;
    mat.opacity = (mat.opacity ?? 0) + (targetOpacity - (mat.opacity ?? 0)) * Math.min(1, delta * 5);
    mat.transparent = true;
    mat.depthWrite = false;
    meshRef.current.visible = mat.opacity > 0.01;
    const camPos = (camera as any).position;
    const camX = camPos.x;
    const camY = camPos.y;
    const camZ = camPos.z;

    for (let i = 0; i < activeCount; i++) {
      const ph = phase[i];
      const wb = wob[i];
      const noiseX = Math.sin(ph + t * (0.2 + wb * 0.5)) * (1.5 + wb);
      const noiseY = Math.cos(ph * 1.1 + t * (0.15 + wb * 0.35)) * (0.8 + wb * 0.6);
      const noiseZ = Math.sin(ph * 0.7 + t * (0.18 + wb * 0.3)) * 0.7;
      const targetX = baseX[i] + noiseX;
      const targetY = baseY[i] + noiseY;
      const targetZ = baseZ[i] + noiseZ;
      let vx = velX[i];
      let vy = velY[i];
      let vz = velZ[i];
      const toX = (targetX - posX[i]) * 1.0;
      const toY = (targetY - posY[i]) * 1.0;
      const toZ = (targetZ - posZ[i]) * 1.0;
      vx += toX * (delta * 2.2);
      vy += toY * (delta * 2.2);
      vz += toZ * (delta * 2.2);
      vx *= 0.88;
      vy *= 0.88;
      vz *= 0.88;
      posX[i] += vx * (delta * 60);
      posY[i] += vy * (delta * 60);
      posZ[i] += vz * (delta * 60);
      velX[i] = vx;
      velY[i] = vy;
      velZ[i] = vz;
      tmp.position.set(posX[i], posY[i], posZ[i]);
      tmp.lookAt(camX, camY, camZ);
      tmp.rotation.z += 0.02 * Math.sin((seeds[i] ?? 0) + t * 1.25);
      const scale = planeScale * (0.8 + 0.3 * Math.sin(phase[i] + t * 0.9));
      tmp.scale.setScalar(scale);
      tmp.updateMatrix();
      meshRef.current.setMatrixAt(i, tmp.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geom, material, length]} frustumCulled={false} />;
}
