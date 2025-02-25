import { useGLTF } from '@react-three/drei';

export function Model({ url }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
}