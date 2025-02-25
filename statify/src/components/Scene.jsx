import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Model } from './StatifyModel';

export default function Scene() {
    return (
        <Canvas style={{ height: '100vh', width: '100%' }}camera={{ position: [0, 50, 0], fov: 5 }}>
            <ambientLight intensity={0.3} />
            <directionalLight intensity={0.1} position={[0, 50, 0]} />
            <Environment preset="studio" />
            <Model url="/models/Statify1.glb" rotation={[0, Math.PI, 0]} />
            <OrbitControls />
        </Canvas>
    );
}
