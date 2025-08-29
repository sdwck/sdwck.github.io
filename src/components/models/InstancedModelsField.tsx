import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import type { GLTF } from 'three-stdlib';

const CUBE_COUNT = 50;

const GAME_MODELS = [
  { path: '/unlink-nl/clockwerk.glb', baseScale: 0.05 },
  { path: '/unlink-nl/aegis.gltf', baseScale: 4 },
  { path: '/unlink-nl/awp.gltf', baseScale: 0.18 },
  { path: '/unlink-nl/bomb.glb', baseScale: 0.5 },
  { path: '/unlink-nl/steam_deck.glb', baseScale: 0.8 },
  { path: '/unlink-nl/ds3.glb', baseScale: 0.002 },
];

GAME_MODELS.forEach((m) => useGLTF.preload(m.path));

type GLTFResult = GLTF & {
  nodes: { [key: string]: THREE.Mesh };
  materials: { [key: string]: THREE.Material };
};

export default function InstancedModelsField({ activeProject }: { activeProject: string | null }) {
  const models = useMemo(() => GAME_MODELS.map((m) => ({ ...m, gltf: useGLTF(m.path) as unknown as GLTFResult })), []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const instancesData = useMemo(() => {
    return Array.from({ length: CUBE_COUNT }, () => {
      const modelIndex = Math.floor(Math.random() * models.length);
      return {
        modelIndex,
        position: new THREE.Vector3((Math.random() - 0.5) * 75, (Math.random() - 0.5) * 75, (Math.random() - 0.5) * 75),
        rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
        scale: 0,
        targetScale: models[modelIndex].baseScale,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      };
    });
  }, [models]);

  const instancedGroups = useMemo(() => {
    return models.flatMap((model, modelIndex) =>
      Object.values(model.gltf.nodes)
        .filter((node): node is THREE.Mesh => (node as any).isMesh)
        .map((mesh) => ({
          key: `${modelIndex}-${mesh.uuid}`,
          geometry: mesh.geometry,
          material: mesh.material,
          instances: instancesData.filter((inst) => inst.modelIndex === modelIndex),
        }))
    );
  }, [models, instancesData]);

  const refs = useRef<(THREE.InstancedMesh | null)[]>([]);

  useFrame((_, delta) => {
    const isVisible = activeProject === 'unlinknl';

    instancedGroups.forEach((group, groupIndex) => {
      const mesh = refs.current[groupIndex];
      if (!mesh) return;

      group.instances.forEach((instance, i) => {
        const target = isVisible ? instance.targetScale : 0;
        instance.scale += (target - instance.scale) * delta * 4;

        instance.rotation.x += delta * instance.rotationSpeed;
        instance.rotation.y += delta * instance.rotationSpeed;

        dummy.position.copy(instance.position);
        dummy.rotation.copy(instance.rotation);
        dummy.scale.setScalar(instance.scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    });
  });

  return (
    <group>
      {instancedGroups.map((group, i) => (
        <instancedMesh key={group.key} ref={(el) => (refs.current[i] = el)} args={[group.geometry, group.material, group.instances.length]} />
      ))}
    </group>
  );
}
