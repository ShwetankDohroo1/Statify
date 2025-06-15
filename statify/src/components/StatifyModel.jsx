import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export function Model({ url, rotation }) {
    const { scene } = useGLTF(url);

    useEffect(() => {
        const box = new THREE.Box3().setFromObject(scene);
        const center = box.getCenter(new THREE.Vector3());
        scene.position.x -= center.x;
        scene.position.y -= center.y;
        scene.position.z -= center.z;
    }, [scene]);

    return <primitive object={scene} rotation={[0, 0, 0]} />;
}
