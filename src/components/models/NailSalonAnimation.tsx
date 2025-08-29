
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';

useGLTF.preload('/nail-salon/dryer.gltf');
useGLTF.preload('/nail-salon/hand.glb');

type Vec3 = [number, number, number];

type Props = {
    active: boolean;
    basePosition?: Vec3;
    baseScale?: number;
    handScale?: number;
    dryerScale?: number;
    handRotation?: Vec3;
    handInsideRotation?: Vec3;
    dryerRotation?: Vec3;
    handPosition?: Vec3;
    dryerPosition?: Vec3;
    handMirror?: boolean;
    enterZ?: number;
    insideZ?: number;
    enterTime?: number;
    enterEndTime?: number;
    curingTime?: number;
    exitStartTime?: number;
    exitTime?: number;
    idleTime?: number;
    viewCameraOffset?: Vec3;
    viewLookAtOffset?: Vec3;
    dryerCameraOffset?: Vec3;
    cameraDistanceBase?: number;
    cameraLerpBase?: number;
    cameraRotLerpBase?: number;
};

const NAIL_TEXTURES = [
    '/nail-salon/textures/038F_05SET_04SHOT_DIFFUSE.png',
    '/nail-salon/textures/038F_05SET_04SHOT_DIFFUSE_1.png',
    '/nail-salon/textures/038F_05SET_04SHOT_DIFFUSE_2.png',
    '/nail-salon/textures/038F_05SET_04SHOT_DIFFUSE_3.png',
    '/nail-salon/textures/038F_05SET_04SHOT_DIFFUSE_4.png',
    '/nail-salon/textures/038F_05SET_04SHOT_DIFFUSE_5.png',
];

function clamp01(v: number) {
    return Math.max(0, Math.min(1, v));
}
function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function degIfLooksLikeDegrees(v: number) {
    if (Math.abs(v) > Math.PI * 2) return (v * Math.PI) / 180;
    return v;
}

export default function NailSalonAnimation({
    active,
    basePosition = [0, -1, 0],
    baseScale = 1.8,
    handScale = 0.1,
    dryerScale = 1.0,
    handRotation = [Math.PI * 1.55, Math.PI, 0],
    handInsideRotation = [Math.PI * 1.55, Math.PI, 0],
    dryerRotation = [0, -90, 0],
    handPosition = [0.1, 0.36, 2],
    dryerPosition = [0, 0, 0],
    handMirror = false,
    enterZ = 2,
    insideZ = 0.25,
    enterTime = 1.2,
    enterEndTime = 1.2,
    curingTime = 3.4,
    exitStartTime = 1.0,
    exitTime = 1.2,
    idleTime = 1.4,
    viewCameraOffset = [0, -1, -4.5],
    viewLookAtOffset = [0, -1.5, -4],
    dryerCameraOffset = [-2, 1, 3.4],
    cameraDistanceBase = 1.2,
    cameraLerpBase = 6.5,
    cameraRotLerpBase = 6.5,
}: Partial<Props> & Props) {
    if (!active) return null;

    const dryerGltf = useGLTF('/nail-salon/dryer.gltf') as any;
    const handGltf = useGLTF('/nail-salon/hand.glb') as any;
    const textures = useTexture(NAIL_TEXTURES) as THREE.Texture[];

    useEffect(() => {
        textures.forEach((t) => {
            if (!t) return;
            t.flipY = false;
            t.needsUpdate = true;
        });
    }, [textures]);

    const tEnter = enterTime;
    const tEnterEnd = enterEndTime;
    const tCuring = curingTime;
    const tExitStart = exitStartTime;
    const tExit = exitTime;
    const tIdle = idleTime;

    const threshold1 = tEnter;
    const threshold2 = threshold1 + tEnterEnd;
    const threshold3 = threshold2 + tCuring;
    const threshold4 = threshold3 + tExitStart;
    const threshold5 = threshold4 + tExit;
    const TOTAL = threshold5 + tIdle;

    const rootRef = useRef<THREE.Group | null>(null);
    const handRef = useRef<THREE.Group | null>(null);
    const lightRef = useRef<THREE.PointLight | null>(null);
    const particleRef = useRef<THREE.Points | null>(null);

    type NailRecord = { baseMesh: THREE.Mesh; overlayMesh: THREE.Mesh; originalMaterial: THREE.Material | THREE.Material[] };
    const nailsRef = useRef<NailRecord[]>([]);
    const currentNailIndexRef = useRef<number>(0);
    const nextNailIndexRef = useRef<number | null>(null);

    const loopTimeRef = useRef(0);
    const phaseRef = useRef<'enter' | 'enterEnd' | 'curing' | 'exitStart' | 'exit' | 'idle'>('idle');
    const phaseStartRef = useRef(0);
    const blendRef = useRef(0);

    const vDryerWorld = useRef(new THREE.Vector3());
    const vDesiredCam = useRef(new THREE.Vector3());
    const vNailWorld = useRef(new THREE.Vector3());
    const vHandWorld = useRef(new THREE.Vector3());
    const forwardRef = useRef(new THREE.Vector3());
    const tmpVec = useRef(new THREE.Vector3());

    const { camera } = useThree();
    const defaultCameraPosRef = useRef<THREE.Vector3 | null>(null);
    const cameraTargetRef = useRef(new THREE.Vector3());
    useEffect(() => {
        if (active) {
            if (!defaultCameraPosRef.current) {
                defaultCameraPosRef.current = new THREE.Vector3();
            }
            defaultCameraPosRef.current.copy(camera.position);
        }
    }, [active]);

    const normalizedHandRotation = useMemo(() => handRotation.map((v) => degIfLooksLikeDegrees(v)) as Vec3, [handRotation]);
    const normalizedInsideRotation = useMemo(
        () => handInsideRotation.map((v) => degIfLooksLikeDegrees(v)) as Vec3,
        [handInsideRotation]
    );
    const defaultHandQuat = useRef(new THREE.Quaternion());
    const insideHandQuat = useRef(new THREE.Quaternion());
    useEffect(() => {
        defaultHandQuat.current.setFromEuler(new THREE.Euler(...normalizedHandRotation));
        insideHandQuat.current.setFromEuler(new THREE.Euler(...normalizedInsideRotation));
    }, [normalizedHandRotation, normalizedInsideRotation]);

    const dampingAlpha = (lambda: number, dt: number) => 1 - Math.exp(-Math.max(0, lambda) * dt);

    useEffect(() => {
        const handScene: THREE.Object3D | undefined = handGltf?.scene;
        if (!handScene) return;
        nailsRef.current.forEach((rec) => {
            try {
                rec.baseMesh.remove(rec.overlayMesh);
                rec.overlayMesh.geometry.dispose();
                const mat = rec.overlayMesh.material as any;
                if (Array.isArray(mat)) mat.forEach((m) => m.dispose && m.dispose());
                else mat.dispose && mat.dispose();
            } catch { }
        });
        nailsRef.current = [];

        const meshes: THREE.Mesh[] = [];
        handScene.traverse((c: any) => c.isMesh && meshes.push(c as THREE.Mesh));
        if (!meshes.length) return;

        const named = meshes.filter((m) => /nail|nails|tip|fingernail|nail_tip/i.test(m.name));
        let candidates = named.length ? named : meshes.slice();

        if (!named.length) {
            const withVolume = candidates
                .map((m) => {
                    const geom = m.geometry;
                    if (!geom.boundingBox) geom.computeBoundingBox();
                    const bb = geom.boundingBox!;
                    const size = new THREE.Vector3();
                    bb.getSize(size);
                    const vol = size.x * size.y * size.z;
                    return { mesh: m, vol };
                })
                .sort((a, b) => a.vol - b.vol);
            candidates = withVolume.slice(0, Math.min(6, withVolume.length)).map((w) => w.mesh);
        }

        const initialIndex = currentNailIndexRef.current;
        candidates.forEach((mesh) => {
            const original = mesh.material;
            const geomClone = mesh.geometry.clone();
            const overlayMat = new THREE.MeshStandardMaterial({
                map: textures[initialIndex] || null,
                transparent: true,
                opacity: 0,
                metalness: 0.05,
                roughness: 0.2,
            });
            if (overlayMat.map) {
                overlayMat.map.flipY = false;
                overlayMat.map.needsUpdate = true;
            }
            const overlay = new THREE.Mesh(geomClone, overlayMat);
            overlay.renderOrder = 999;
            overlay.material.depthWrite = false;
            mesh.add(overlay);
            nailsRef.current.push({ baseMesh: mesh, overlayMesh: overlay, originalMaterial: original });
        });

        handScene.traverse((c: any) => {
            if (c.isMesh) {
                c.castShadow = true;
                c.receiveShadow = true;
            }
        });

        return () => {
            nailsRef.current.forEach((rec) => {
                try {
                    rec.baseMesh.remove(rec.overlayMesh);
                    rec.overlayMesh.geometry.dispose();
                    const mat = rec.overlayMesh.material as any;
                    if (Array.isArray(mat)) mat.forEach((m) => m.dispose && m.dispose());
                    else mat.dispose && mat.dispose();
                } catch { }
            });
            nailsRef.current = [];
        };
    }, [handGltf, textures.length]);

    const commitTextureToBase = (idx: number) => {
        nailsRef.current.forEach((rec) => {
            const orig = rec.originalMaterial;
            if (Array.isArray(orig)) {
                const cloned = (orig as THREE.Material[]).map((m) => {
                    const clone = (m as any).clone ? (m as any).clone() : (m as any);
                    if ((clone as any).map !== undefined) {
                        (clone as any).map = textures[idx] || null;
                        if ((clone as any).map) {
                            (clone as any).map.flipY = false;
                            (clone as any).map.needsUpdate = true;
                        }
                        (clone as any).needsUpdate = true;
                    } else {
                        const fallback = new THREE.MeshStandardMaterial({ map: textures[idx] || null });
                        fallback.needsUpdate = true;
                        return fallback;
                    }
                    return clone;
                });
                rec.baseMesh.material = cloned as unknown as THREE.Material;
            } else {
                const m = (orig as any).clone ? (orig as any).clone() : (orig as any);
                if ((m as any).map !== undefined) {
                    (m as any).map = textures[idx] || null;
                    if ((m as any).map) {
                        (m as any).map.flipY = false;
                        (m as any).map.needsUpdate = true;
                    }
                    (m as any).needsUpdate = true;
                    rec.baseMesh.material = m as THREE.Material;
                } else {
                    const fallback = new THREE.MeshStandardMaterial({ map: textures[idx] || null });
                    if (fallback.map) {
                        fallback.map.flipY = false;
                        fallback.map.needsUpdate = true;
                    }
                    rec.baseMesh.material = fallback;
                }
            }
        });
        currentNailIndexRef.current = idx;
    };

    const particleGeo = useMemo(() => {
        const count = 80;
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = Math.random() * 0.9;
            const ang = Math.random() * Math.PI * 2;
            pos[i * 3] = Math.cos(ang) * r * 0.6;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
            pos[i * 3 + 2] = Math.sin(ang) * r * 0.6;
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        return geometry;
    }, []);
    const particleMat = useMemo(() => new THREE.PointsMaterial({ size: 0.04, transparent: true, opacity: 0, depthWrite: false }), []);

    useEffect(() => {
        loopTimeRef.current = 0;
        phaseRef.current = 'idle';
        phaseStartRef.current = 0;
        blendRef.current = 0;
    }, []);

    useFrame((_, delta) => {
        loopTimeRef.current = (loopTimeRef.current + delta) % TOTAL;
        const t = loopTimeRef.current;

        let newPhase: typeof phaseRef.current = 'idle';
        if (t < threshold1) newPhase = 'enter';
        else if (t < threshold2) newPhase = 'enterEnd';
        else if (t < threshold3) newPhase = 'curing';
        else if (t < threshold4) newPhase = 'exitStart';
        else if (t < threshold5) newPhase = 'exit';
        else newPhase = 'idle';

        if (newPhase !== phaseRef.current && defaultCameraPosRef.current) {
            phaseRef.current = newPhase;
            phaseStartRef.current = t;

            if (newPhase === 'curing') {
                let next = Math.floor(Math.random() * textures.length);
                if (textures.length > 1) {
                    let attempts = 0;
                    while (next === currentNailIndexRef.current && attempts < 6) {
                        next = Math.floor(Math.random() * textures.length);
                        attempts++;
                    }
                }
                nextNailIndexRef.current = next;
                nailsRef.current.forEach((rec) => {
                    const mat = rec.overlayMesh.material as THREE.MeshStandardMaterial;
                    mat.map = textures[next] || null;
                    if (mat.map) {
                        mat.map.flipY = false;
                        mat.map.needsUpdate = true;
                    }
                    mat.opacity = 0;
                    mat.transparent = true;
                    mat.needsUpdate = true;
                });
                blendRef.current = 0;
                defaultCameraPosRef.current.copy(camera.position);
            }
        }

        const phaseDuration =
            newPhase === 'enter'
                ? tEnter
                : newPhase === 'enterEnd'
                    ? tEnterEnd
                    : newPhase === 'curing'
                        ? tCuring
                        : newPhase === 'exitStart'
                            ? tExitStart
                            : newPhase === 'exit'
                                ? tExit
                                : tIdle;
        const phaseProgress = clamp01((t - phaseStartRef.current) / Math.max(1e-6, phaseDuration));
        const easePhase = easeInOutCubic(phaseProgress);

        const speedMultiplier = 0.15 + 0.85 * easePhase;
        const camLambda = cameraLerpBase * speedMultiplier;
        const camRotLambda = cameraRotLerpBase * speedMultiplier;
        const camAlpha = dampingAlpha(camLambda, delta);
        const camRotAlpha = dampingAlpha(camRotLambda, delta);

        const handGroup = handRef.current;
        if (handGroup) {
            const outsideZ = enterZ + (handPosition ? handPosition[2] : 0);
            const targetZ = insideZ + (handPosition ? handPosition[2] : 0);

            if (phaseRef.current === 'enter' || phaseRef.current === 'enterEnd') {
                const entryTotal = tEnter + tEnterEnd;
                const entryProgress = clamp01(t / entryTotal);
                const localT = easeInOutCubic(entryProgress);
                const desiredZ = THREE.MathUtils.lerp(outsideZ, targetZ, localT);
                handGroup.position.z = THREE.MathUtils.lerp(handGroup.position.z, desiredZ, 1 - Math.exp(-12 * delta));
            } else if (phaseRef.current === 'curing') {
                handGroup.position.z = THREE.MathUtils.lerp(handGroup.position.z, targetZ, 1 - Math.exp(-10 * delta));
            } else if (phaseRef.current === 'exitStart' || phaseRef.current === 'exit') {
                const exitStartTimepoint = tEnter + tEnterEnd + tCuring;
                const exitTotal = tExitStart + tExit;
                const exitProgress = clamp01((t - exitStartTimepoint) / exitTotal);
                const localT = easeInOutCubic(exitProgress);
                const desiredZ = THREE.MathUtils.lerp(targetZ, outsideZ, localT);
                handGroup.position.z = THREE.MathUtils.lerp(handGroup.position.z, desiredZ, 1 - Math.exp(-12 * delta));
            } else {
                handGroup.position.z = THREE.MathUtils.lerp(handGroup.position.z, outsideZ, 1 - Math.exp(-12 * delta));
            }
        }

        if (handRef.current) {
            const targetQuat = phaseRef.current === 'enterEnd' || phaseRef.current === 'curing' || phaseRef.current === 'exitStart' ? insideHandQuat.current : defaultHandQuat.current;
            const slerpAlpha = dampingAlpha(8 * speedMultiplier, delta);
            handRef.current.quaternion.slerp(targetQuat, slerpAlpha);
        }

        if (lightRef.current) {
            if (phaseRef.current === 'curing' || phaseRef.current === 'enterEnd') {
                const localT = Math.max(0, t - threshold1);
                const pulse = 1.2 + 0.6 * Math.sin(localT * 10);
                lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, pulse * 1.5, 1 - Math.exp(-12 * delta));
                const hue = 0.72 + 0.03 * Math.sin(localT * 3.2);
                lightRef.current.color.setHSL(hue, 0.8, 0.6);
            } else {
                lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, 0, 1 - Math.exp(-8 * delta));
            }
        }
        if (particleRef.current) {
            const pm = particleRef.current.material as THREE.PointsMaterial;
            pm.opacity = phaseRef.current === 'curing' ? THREE.MathUtils.lerp(pm.opacity, 0.95, 1 - Math.exp(-6 * delta)) : THREE.MathUtils.lerp(pm.opacity, 0, 1 - Math.exp(-6 * delta));
        }

        if (phaseRef.current === 'curing' && nextNailIndexRef.current !== null) {
            const curingLocalT = clamp01((t - threshold2) / Math.max(1e-6, tCuring));
            const blendTarget = easeInOutCubic(clamp01(curingLocalT / 0.85));
            blendRef.current = THREE.MathUtils.lerp(blendRef.current, blendTarget, 1 - Math.exp(-8 * delta));
            nailsRef.current.forEach((rec) => {
                (rec.overlayMesh.material as THREE.MeshStandardMaterial).opacity = blendRef.current;
            });
            if (blendRef.current > 0.98) {
                const nextIdx = nextNailIndexRef.current!;
                commitTextureToBase(nextIdx);
                nailsRef.current.forEach((rec) => ((rec.overlayMesh.material as THREE.MeshStandardMaterial).opacity = 0));
                nextNailIndexRef.current = null;
            }
        } else {
            nailsRef.current.forEach((rec) => {
                const mat = rec.overlayMesh.material as THREE.MeshStandardMaterial;
                if (mat.opacity > 1e-3) mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0, 1 - Math.exp(-6 * delta));
            });
        }

        const focusingDryer = phaseRef.current === 'enterEnd' || phaseRef.current === 'curing' || phaseRef.current === 'exitStart';

        if (focusingDryer) {
            vDryerWorld.current.set(dryerPosition[0], dryerPosition[1], dryerPosition[2]);
            if (rootRef.current) rootRef.current.localToWorld(vDryerWorld.current);
            vDesiredCam.current.copy(vDryerWorld.current).add(new THREE.Vector3(dryerCameraOffset[0], dryerCameraOffset[1], dryerCameraOffset[2]));
            camera.position.lerp(vDesiredCam.current, camAlpha);
            tmpVec.current.copy(vDryerWorld.current).add(new THREE.Vector3(0, 0.12, 0));
            cameraTargetRef.current.lerp(tmpVec.current, camRotAlpha);
            camera.lookAt(cameraTargetRef.current);
        } else {
            if (handRef.current) {
                vNailWorld.current.set(0, 0.12, -0.12);
                handRef.current.localToWorld(vNailWorld.current);

                handRef.current.getWorldDirection(forwardRef.current);
                forwardRef.current.normalize();

                let desiredDistance = cameraDistanceBase / Math.max(0.001, handScale) * 0.92;
                desiredDistance = THREE.MathUtils.clamp(desiredDistance, 0.5, 3.5);

                vDesiredCam.current.copy(forwardRef.current).multiplyScalar(-desiredDistance).add(vNailWorld.current);
                vDesiredCam.current.y += 0.12 * handScale;
                vDesiredCam.current.add(new THREE.Vector3(viewCameraOffset[0], viewCameraOffset[1], viewCameraOffset[2]));

                handRef.current.getWorldPosition(vHandWorld.current);
                tmpVec.current.copy(vDesiredCam.current).sub(vHandWorld.current).normalize();
                const dot = tmpVec.current.dot(forwardRef.current);
                if (dot < 0.12) {
                    vDesiredCam.current.copy(vNailWorld.current).add(forwardRef.current.clone().multiplyScalar(-desiredDistance));
                    vDesiredCam.current.y += 0.12 * handScale;
                    vDesiredCam.current.add(new THREE.Vector3(viewCameraOffset[0], viewCameraOffset[1], viewCameraOffset[2]));
                }

                camera.position.lerp(vDesiredCam.current, camAlpha);
                tmpVec.current.copy(vNailWorld.current).add(new THREE.Vector3(viewLookAtOffset[0], viewLookAtOffset[1], viewLookAtOffset[2]));
                cameraTargetRef.current.lerp(tmpVec.current, camRotAlpha);
                camera.lookAt(cameraTargetRef.current);
            } else if (defaultCameraPosRef.current) {
                camera.position.lerp(defaultCameraPosRef.current, dampingAlpha(cameraLerpBase * 0.8, delta));
            }
        }
    });

    const toEuler = (r: Vec3) => new THREE.Euler(degIfLooksLikeDegrees(r[0]), degIfLooksLikeDegrees(r[1]), degIfLooksLikeDegrees(r[2]));

    return (
        <group ref={rootRef} position={basePosition} scale={baseScale}>
            <group position={[dryerPosition[0], dryerPosition[1], dryerPosition[2]]} rotation={toEuler(dryerRotation)} scale={[dryerScale, dryerScale, dryerScale]}>
                {dryerGltf && <primitive object={dryerGltf.scene} />}
            </group>

            <group ref={handRef} position={[handPosition[0], handPosition[1], enterZ + (handPosition[2] || 0)]} rotation={toEuler(handRotation)} scale={[handMirror ? -handScale : handScale, handScale, handScale]}>
                {handGltf && <primitive object={handGltf.scene} />}
            </group>

            <pointLight ref={lightRef} position={[dryerPosition[0], (dryerPosition[1] || 0) + 1.05, (dryerPosition[2] || 0) + 0.25]} distance={4.5} intensity={0} decay={2} color={new THREE.Color('#9f6bff')} />

            <mesh position={[dryerPosition[0], (dryerPosition[1] || 0), (dryerPosition[2] || 0) + 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.8, 1.6, 32]} />
                <meshBasicMaterial color={new THREE.Color(0x9f6bff)} transparent opacity={0.06} depthWrite={false} />
            </mesh>

            <points ref={particleRef} geometry={particleGeo} position={[dryerPosition[0], (dryerPosition[1] || 0) + 1.0, (dryerPosition[2] || 0) + 0.25]}>
                <pointsMaterial attach="material" {...(particleMat as any)} />
            </points>
        </group>
    );
}
