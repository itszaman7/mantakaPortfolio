"use client";

import { useRef, Suspense, forwardRef } from "react";
import { Environment } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import RickshawModel, { type RickshawModelProps } from "./RickshawModel";
import TopographicScene from "./TopographicScene";
import CameraRig from "./CameraRig";

export interface RickshawHeroHandle {
    _?: unknown;
}

interface RickshawHeroProps {
    positionRef: { x: number; y: number; z: number };
    dissolveRef: React.MutableRefObject<{ value: number }>;
    heroContentOutRef?: React.MutableRefObject<{ value: number }>;
}

const RickshawHero = forwardRef<RickshawHeroHandle, RickshawHeroProps>(
    ({ positionRef, dissolveRef, heroContentOutRef }, ref) => {
        const { viewport } = useThree();

        // Responsive scale logic
        const desiredWidth = 10;
        const scale = Math.min(1, viewport.width / desiredWidth);

        return (
            <group>
                {/* Camera Rig reads from same object GSAP updates */}
                <CameraRig positionRef={positionRef} />

                {/* Topographic Background – dissolve driven by proxy */}
                <TopographicScene dissolveRef={dissolveRef} />

                {/* Simplified lighting - MeshBasicMaterial is self-illuminated */}
                <Environment preset="city" environmentIntensity={0.3} />
                {/* Minimal ambient for scene depth */}
                <ambientLight intensity={0.5} />
                {/* Red accent lights for neon atmosphere */}
                <pointLight position={[3, 2, 3]} intensity={3} color="#ff0000" distance={12} decay={2} />
                <pointLight position={[-3, 2, -3]} intensity={3} color="#ff0000" distance={12} decay={2} />
                <pointLight position={[0, 4, 0]} intensity={2} color="#ff1a1a" distance={10} decay={2} />

                {/* The Rickshaw 3D Model */}
                <group scale={scale}>
                    <Suspense fallback={null}>
                        <RickshawModel heroContentOutRef={heroContentOutRef} />
                    </Suspense>
                </group>
            </group>
        );
    }
);

RickshawHero.displayName = "RickshawHero";

export default RickshawHero;
