import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface SpawnZone {
  center: { x: number; y: number; z: number };
  radius: { x: number; y: number; z: number };
  color: { hue: number; sat: number; light: number };
}

const spawnZone: SpawnZone = {
  center: { x: 0, y: 0, z: 0 },
  radius: { x: 10, y: 12, z: 30 },
  color: { hue: Math.random(), sat: Math.random(), light: Math.random() }
};

const meshCount = 60;

function generateRandomMeshes(meshCount: number) {
  const meshes = [];

  for (let meshIndex = 0; meshIndex < meshCount; meshIndex++) {
    const positions = [];
    const colors = [];
    const indices = [];
    const wireframeIndices = [];
    const vertexData = [];
    
    const centerX = spawnZone.center.x + (Math.random() - 0.5) * spawnZone.radius.x * 2;
    const centerY = spawnZone.center.y + (Math.random() - 0.5) * spawnZone.radius.y * 2;
    const centerZ = spawnZone.center.z + (Math.random() - 0.5) * spawnZone.radius.z * 2;
    
    const polySize = 0.8 + Math.random() * 1.1;
    const vertexCount = 4 + Math.floor(Math.random() * 14);
    const startIndex = positions.length / 3;
    
    for (let v = 0; v < vertexCount; v++) {
      const vAngle = (v / vertexCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const vRadius = polySize * (0.8 + Math.random() * 0.4);
      
      const x = centerX + Math.cos(vAngle) * vRadius;
      const y = centerY + Math.sin(vAngle) * vRadius;
      const z = centerZ + (Math.random() - 0.5) * 1;
      
      positions.push(x, y, z);
      
      const hueVariation = (Math.random() - 0.5) * 0.4;
      const satVariation = (Math.random() - 0.5) * 0.6;
      const lightVariation = (Math.random() - 0.5) * 0.4;
      
      const color = new THREE.Color().setHSL(
        spawnZone.color.hue + hueVariation,
        Math.max(0.1, Math.min(1.0, spawnZone.color.sat + satVariation)),
        Math.max(0.1, Math.min(1.0, spawnZone.color.light + lightVariation))
      );
      colors.push(color.r, color.g, color.b);
      
      vertexData.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        phase: Math.random() * Math.PI * 2,
        amplitude: 0.4 + Math.random() * 0.2
      });
    }
    
    for (let i = 1; i < vertexCount - 1; i++) {
      indices.push(startIndex, startIndex + i, startIndex + i + 1);
    }
    
    for (let i = 0; i < vertexCount; i++) {
      const nextI = (i + 1) % vertexCount;
      wireframeIndices.push(startIndex + i, startIndex + nextI);
    }
    
    meshes.push({
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
      indices: new Uint32Array(indices),
      wireframeIndices: new Uint32Array(wireframeIndices),
      vertexData,
      zone: spawnZone,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.6
    });
  }
  
  return meshes;
}

interface TrailShadePolygonsProps {
  active: boolean;
}

export default function TrailShadePolygons({ 
  active
}: TrailShadePolygonsProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const materialRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const wireRefs = useRef<(THREE.LineSegments | null)[]>([]);
  const wireMaterialRefs = useRef<(THREE.LineBasicMaterial | null)[]>([]);

  const meshData = useMemo(() => generateRandomMeshes(meshCount), [meshCount, spawnZone]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();
    
    meshData.forEach((mesh, meshIndex) => {
      const meshRef = meshRefs.current[meshIndex];
      const materialRef = materialRefs.current[meshIndex];
      const wireRef = wireRefs.current[meshIndex];
      const wireMaterialRef = wireMaterialRefs.current[meshIndex];
      
      if (!meshRef || !materialRef || !wireRef || !wireMaterialRef) return;

      const targetOpacity = active ? 0.55 : 0.0;
      materialRef.opacity += (targetOpacity - materialRef.opacity) * delta * 4;
      wireMaterialRef.opacity += (targetOpacity * 1.2 - wireMaterialRef.opacity) * delta * 4;
      
      meshRef.visible = materialRef.opacity > 0.01;
      wireRef.visible = wireMaterialRef.opacity > 0.01;

      if (!active) return;

      const positions = meshRef.geometry.attributes.position.array as Float32Array;
      const wirePositions = wireRef.geometry.attributes.position.array as Float32Array;
      const colors = meshRef.geometry.attributes.color.array as Float32Array;
      
      const globalFloat = Math.sin(time * mesh.speed + mesh.phase) * 3;
      const globalRotation = time * (0.05 + meshIndex * 0.02);
      
      meshRef.position.y = globalFloat;
      meshRef.position.z = Math.cos(time * mesh.speed * 0.7 + mesh.phase) * 4;
      meshRef.rotation.z = globalRotation * 0.3;
      meshRef.rotation.y = globalRotation * 0.2;
      
      wireRef.position.copy(meshRef.position);
      wireRef.rotation.copy(meshRef.rotation);
      
      for (let i = 0; i < mesh.vertexData.length; i++) {
        const vertex = mesh.vertexData[i];
        const vertexTime = time * (0.8 + i * 0.02) + vertex.phase;
        
        const waveY = Math.sin(vertexTime * 1.2) * vertex.amplitude * 0.8;
        const waveZ = Math.cos(vertexTime * 0.9 + vertex.phase) * vertex.amplitude * 1.2;
        const waveX = Math.sin(vertexTime * 0.6 + vertex.phase * 2) * vertex.amplitude * 0.4;
        
        positions[i * 3] = vertex.baseX + waveX;
        positions[i * 3 + 1] = vertex.baseY + waveY;
        positions[i * 3 + 2] = vertex.baseZ + waveZ;
        
        wirePositions[i * 3] = positions[i * 3];
        wirePositions[i * 3 + 1] = positions[i * 3 + 1];
        wirePositions[i * 3 + 2] = positions[i * 3 + 2];
        
        const colorPulse = time * 0.6 + vertex.phase + i * 0.05;
        const hueShift = Math.sin(colorPulse * 0.3) * 0.1;
        const lightPulse = Math.sin(colorPulse * 0.8) * 0.15;
        const satPulse = Math.sin(colorPulse * 0.5) * 0.2;
        
        const dynamicHue = mesh.zone.color.hue + hueShift;
        const dynamicLight = Math.max(0.25, mesh.zone.color.light + lightPulse);
        const dynamicSat = Math.min(1.0, mesh.zone.color.sat + satPulse);
        
        const color = new THREE.Color().setHSL(dynamicHue, dynamicSat, dynamicLight);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }
      
      meshRef.geometry.attributes.position.needsUpdate = true;
      wireRef.geometry.attributes.position.needsUpdate = true;
      meshRef.geometry.attributes.color.needsUpdate = true;
    });
  });

  return (
    <group ref={groupRef}>
      {meshData.map((mesh, index) => (
        <group key={index}>
          <mesh
            ref={el => meshRefs.current[index] = el}
            frustumCulled={false}
          >
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[mesh.positions, 3]} />
              <bufferAttribute attach="attributes-color" args={[mesh.colors, 3]} />
              <bufferAttribute attach="index" args={[mesh.indices, 1]} />
            </bufferGeometry>
            <meshBasicMaterial
              ref={el => materialRefs.current[index] = el}
              vertexColors
              transparent
              opacity={0.0}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          
          <lineSegments
            ref={el => wireRefs.current[index] = el}
            frustumCulled={false}
          >
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[mesh.positions, 3]} />
              <bufferAttribute attach="index" args={[mesh.wireframeIndices, 1]} />
            </bufferGeometry>
            <lineBasicMaterial
              ref={el => wireMaterialRefs.current[index] = el}
              color={new THREE.Color().setHSL(mesh.zone.color.hue, 0.9, 0.8)}
              transparent
              opacity={0.0}
              depthWrite={false}
            />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}
