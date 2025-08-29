import { Canvas } from '@react-three/fiber';
import BaseParticles from './particles/BaseParticles';
import MentalBreather from './particles/MentalBreather';
import VoxWavefield from './particles/VoxWavefield';
import InstancedModelsField from './models/InstancedModelsField';
import PosterParticles from './models/PosterParticles';
import NailSalonAnimation from './models/NailSalonAnimation';
import CameraRig from './CameraRig';
import { Suspense, useState } from 'react';
import LoadWatcher from './LoadWatcher';
import { useEffect } from 'react';
import TrailShadePolygons from './particles/TrailShadePolygons';

type Props = { activeProject: string | null };

export default function ThreeBackground({ activeProject }: Props) {
    const [assetsReady, setAssetsReady] = useState(false);
    const [showPosters, setShowPosters] = useState(() => activeProject === 'moviebot');

    useEffect(() => {
        if (activeProject === 'moviebot') {
            setShowPosters(true);
        } else {
            const FADE_OUT_MS = 600;
            const id = window.setTimeout(() => setShowPosters(false), FADE_OUT_MS);
            return () => window.clearTimeout(id);
        }
    }, [activeProject]);

    return (
        <div
            className="fixed inset-0 pointer-events-none"
            style={{
                transition: 'opacity 420ms ease, visibility 420ms',
                opacity: assetsReady ? 1 : 0,
                visibility: assetsReady ? 'visible' : 'hidden',
            }}>
            <Canvas camera={{ position: [0, 0, 25], fov: 75 }}>
                <LoadWatcher onReady={(ready: boolean) => setAssetsReady(ready)} activeProject={activeProject} />

                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 5]} intensity={1} />

                <BaseParticles activeProject={activeProject} />
                <InstancedModelsField activeProject={activeProject} />
                <MentalBreather active={activeProject === 'mental-reset'} />
                <VoxWavefield active={activeProject === 'voxnl'} />

                <TrailShadePolygons active={activeProject === 'trail-shade'} />

                {activeProject === 'nail-salon' && (
                    <Suspense fallback={null}>
                        <NailSalonAnimation active />
                    </Suspense>
                )}

                {showPosters && (
                    <Suspense fallback={null}>
                        <PosterParticles active={activeProject === 'moviebot'} />
                    </Suspense>
                )}
                <CameraRig activeProject={activeProject} />
            </Canvas>
        </div>
    );
}
