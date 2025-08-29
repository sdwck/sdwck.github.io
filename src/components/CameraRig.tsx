import { useRef, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

const PROJECT_POSITIONS: Record<string, THREE.Vector3> = {
    'unlinknl': new THREE.Vector3(0, 0, 40),
    'youtube-dm': new THREE.Vector3(0, 0, 35),
    'mental-reset': new THREE.Vector3(0, 0, 30),
    'voxnl': new THREE.Vector3(-8, 6, 35),
    'nail-salon': new THREE.Vector3(0, 0, 32),
    'moviebot': new THREE.Vector3(0, 0, 1),
    'trail-shade': new THREE.Vector3(0, 0, 25),
};

function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function CameraRig({ activeProject }: { activeProject: string | null }) {
    const controlsRef = useRef<any>(null);
    const animRef = useRef({ playing: false, progress: 0, duration: 0.9, from: null as THREE.Vector3 | null, to: null as THREE.Vector3 | null });
    const { camera } = useThree();

    const lastProject = useRef<string | null>(null);
    useEffect(() => {
        if (lastProject.current === activeProject) return;
        lastProject.current = activeProject;

        const target = activeProject ? PROJECT_POSITIONS[activeProject] ?? new THREE.Vector3(0, 0, 35) : null;
        if (target) {
            animRef.current.playing = true;
            animRef.current.progress = 0;
            animRef.current.from = camera.position.clone();
            animRef.current.to = target.clone();
            animRef.current.duration = 0.9;
        } else {
            animRef.current.playing = true;
            animRef.current.progress = 0;
            animRef.current.from = camera.position.clone();
            animRef.current.to = new THREE.Vector3(0, 0, 25);
            animRef.current.duration = 1.0;
        }
    }, [activeProject, camera]);

    useFrame((state, delta) => {
        if (animRef.current.playing && animRef.current.from && animRef.current.to) {
            animRef.current.progress += delta / Math.max(0.001, animRef.current.duration);
            const p = Math.min(1, animRef.current.progress);
            const e = easeInOutCubic(p);
            const from = animRef.current.from;
            const to = animRef.current.to;
            state.camera.position.lerpVectors(from, to, e);
            if (controlsRef.current) controlsRef.current.update();
            if (p >= 1) {
                animRef.current.playing = false;
            }
        }

        if (controlsRef.current) {
            const projectAllowsAutoRotate = !activeProject || activeProject === 'unlinknl' || activeProject === 'voxnl' || activeProject === 'moviebot';
            controlsRef.current.autoRotate = !animRef.current.playing && projectAllowsAutoRotate;
            controlsRef.current.enableRotate = true;
            controlsRef.current.enableZoom = false;
        }
    });

    return <OrbitControls ref={controlsRef} enablePan={false} enableZoom={false} autoRotateSpeed={0.2} />;
}
