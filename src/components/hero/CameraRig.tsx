"use client";

import { useFrame } from "@react-three/fiber";

interface CameraRigProps {
    positionRef: { x: number; y: number; z: number };
}

export default function CameraRig({ positionRef }: CameraRigProps) {
    // Directly update camera position each frame from the mutable ref
    useFrame((state) => {
        state.camera.position.set(
            positionRef.x,
            positionRef.y,
            positionRef.z
        );
    });

    return null;
}
