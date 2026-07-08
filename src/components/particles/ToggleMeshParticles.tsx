import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const NODE_COUNT = 450;
const MAX_DISTANCE = 7.5;

export default function ToggleMeshParticles({ active }: { active: boolean }) {
    const groupRef = useRef<THREE.Group>(null!);
    const pointsRef = useRef<THREE.Points>(null!);
    const linesRef = useRef<THREE.LineSegments>(null!);
    const pointsMatRef = useRef<THREE.PointsMaterial>(null!);
    const linesMatRef = useRef<THREE.LineBasicMaterial>(null!);

    const { positions, velocities, colors } = useMemo(() => {
        const positions = new Float32Array(NODE_COUNT * 3);
        const velocities: THREE.Vector3[] = [];
        const colors = new Float32Array(NODE_COUNT * 3);
        const color = new THREE.Color();

        for (let i = 0; i < NODE_COUNT; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 160;
            positions[i3 + 1] = (Math.random() - 0.5) * 40;
            positions[i3 + 2] = (Math.random() - 0.5) * 40;

            velocities.push(new THREE.Vector3(
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5
            ));

            const r = Math.random();
            if (r > 0.9) color.setHex(0xa855f7);
            else if (r > 0.8) color.setHex(0x22c55e);
            else color.setHex(0x3b82f6);

            color.toArray(colors, i3);
        }
        return { positions, velocities, colors };
    }, []);

    const maxLines = NODE_COUNT * 20;
    const linePositions = useMemo(() => new Float32Array(maxLines * 6), []);
    const lineColors = useMemo(() => new Float32Array(maxLines * 6), []);

    useFrame((_, delta) => {
        if (!groupRef.current) return;

        const targetOpacity = active ? 1 : 0;
        pointsMatRef.current.opacity += (targetOpacity - pointsMatRef.current.opacity) * delta * 3;
        linesMatRef.current.opacity += ((targetOpacity * 0.4) - linesMatRef.current.opacity) * delta * 3;

        groupRef.current.visible = pointsMatRef.current.opacity > 0.01;
        if (!groupRef.current.visible) return;

        groupRef.current.rotation.y += delta * 0.05;
        groupRef.current.rotation.x += delta * 0.02;

        const posAttr = pointsRef.current.geometry.attributes.position;
        const pts = posAttr.array as Float32Array;

        for (let i = 0; i < NODE_COUNT; i++) {
            const i3 = i * 3;
            pts[i3] += velocities[i].x * delta;
            pts[i3 + 1] += velocities[i].y * delta;
            pts[i3 + 2] += velocities[i].z * delta;

            if (Math.abs(pts[i3]) > 80) velocities[i].x *= -1;
            if (Math.abs(pts[i3 + 1]) > 20) velocities[i].y *= -1;
            if (Math.abs(pts[i3 + 2]) > 20) velocities[i].z *= -1;
        }
        posAttr.needsUpdate = true;

        let lineCount = 0;
        for (let i = 0; i < NODE_COUNT; i++) {
            const i3 = i * 3;
            for (let j = i + 1; j < NODE_COUNT; j++) {
                const j3 = j * 3;
                const dx = pts[i3] - pts[j3];
                const dy = pts[i3 + 1] - pts[j3 + 1];
                const dz = pts[i3 + 2] - pts[j3 + 2];
                const distSq = dx * dx + dy * dy + dz * dz;

                if (distSq < MAX_DISTANCE * MAX_DISTANCE) {
                    if (lineCount >= maxLines) break;
                    const l6 = lineCount * 6;
                    linePositions[l6] = pts[i3];
                    linePositions[l6 + 1] = pts[i3 + 1];
                    linePositions[l6 + 2] = pts[i3 + 2];
                    linePositions[l6 + 3] = pts[j3];
                    linePositions[l6 + 4] = pts[j3 + 1];
                    linePositions[l6 + 5] = pts[j3 + 2];

                    const c1 = colors[i3], c2 = colors[i3 + 1], c3 = colors[i3 + 2];
                    const c4 = colors[j3], c5 = colors[j3 + 1], c6 = colors[j3 + 2];

                    lineColors[l6] = c1; lineColors[l6 + 1] = c2; lineColors[l6 + 2] = c3;
                    lineColors[l6 + 3] = c4; lineColors[l6 + 4] = c5; lineColors[l6 + 5] = c6;

                    lineCount++;
                    if (lineCount >= maxLines) break;
                }
            }
            if (lineCount >= maxLines) break;
        }

        const lGeo = linesRef.current.geometry;
        lGeo.setDrawRange(0, lineCount * 2);
        lGeo.attributes.position.needsUpdate = true;
        lGeo.attributes.color.needsUpdate = true;
    });

    return (
        <group ref={groupRef}>
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                    <bufferAttribute attach="attributes-color" args={[colors, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    ref={pointsMatRef}
                    size={0.15}
                    vertexColors
                    transparent
                    opacity={0}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>
            <lineSegments ref={linesRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
                    <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
                </bufferGeometry>
                <lineBasicMaterial
                    ref={linesMatRef}
                    vertexColors
                    transparent
                    opacity={0}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </lineSegments>
        </group>
    );
}
