"use client";

import { useGLTF, Text, Float } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function RickshawModel() {
    const { scene } = useGLTF("/3D_Assets/bangladeshi cycle rickshaw 3d model.glb");
    const groupRef = useRef<THREE.Group>(null);
    const textGroupRef = useRef<THREE.Group>(null);
    const { viewport } = useThree();

    // Responsive scaling based on viewport width
    const isMobile = viewport.width < 7;
    const rickshawScale = isMobile ? 10.5 : 4.5;
    const nameFontSize = isMobile ? 1.2 : 1.5;
    const namePositionY = isMobile ? 5 : 2.5;
    const namePositionZ = isMobile ? -1 : -2;
    const sideFontSize = isMobile ? 0.5 : 0.6;
    const sidePositionX = isMobile ? 1.8 : 2.5;
    const sidePositionZ = isMobile ? -0.5 : -1;
    const rightSidePositionY = isMobile ? 1 : 0; // SOFTWARE ENGINEER - higher on mobile
    const leftSidePositionY = isMobile ? -5 : 0; // CREATIVE DEVELOPER - lower on mobile

    // Mouse interaction - smooth rotation and floating position
    useFrame((state) => {
        const { pointer } = state;

        if (groupRef.current) {
            // Rotation (existing logic)
            const targetRotationY = pointer.x * 0.3;
            const targetRotationX = -pointer.y * 0.2;

            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.2);
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.2);

            // Position 
            const targetPosX = pointer.x * 0.5;
            const targetPosY = (pointer.y * 0.5) + 0.5;

            groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPosX, 0.1);
            groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, 0.1);
        }

        // Text interaction (Parallax / Tilt)
        if (textGroupRef.current) {
            // Subtle parallax opposite to mouse
            const targetTextRotX = -pointer.y * 0.2;
            const targetTextRotY = pointer.x * 0.2;

            textGroupRef.current.rotation.x = THREE.MathUtils.lerp(textGroupRef.current.rotation.x, targetTextRotX, 0.05);
            textGroupRef.current.rotation.y = THREE.MathUtils.lerp(textGroupRef.current.rotation.y, targetTextRotY, 0.05);
        }
    });

    // Typography Generation
    const renderArcText = (text: string, radius: number, angleSpread: number, positionY: number, inverted: boolean = false, color: string = "#000000") => {
        const chars = text.split("");
        const totalAngle = angleSpread; // Total angle covered by text
        const startAngle = inverted ? (Math.PI - totalAngle) / 2 + Math.PI : -totalAngle / 2;

        return (
            <group position={[0, positionY, 0]}>
                {chars.map((char, i) => {
                    // Calculate angle for each character
                    // We want to center the text, so we map i (0 to length-1) to (-totalAngle/2 to totalAngle/2)
                    const progress = i / (chars.length - 1);
                    const angle = inverted
                        ? startAngle - (progress * totalAngle) // Go backwards for inverted
                        : startAngle + (progress * totalAngle);

                    const charX = Math.sin(angle) * radius;
                    const charZ = Math.cos(angle) * radius;

                    return (
                        <Text
                            key={i}
                            position={[charX, 0, charZ]}
                            rotation={[0, angle + Math.PI, 0]} // Face inward/outward
                            fontSize={0.8}
                            color={color}
                            anchorX="center"
                            anchorY="middle"
                            font="/fonts/Inter-Bold.woff" // Try to use the bold font if available, or fallback
                        >
                            {char}
                        </Text>
                    );
                })}
            </group>
        );
    }

    // Manual layout for "Cool Typography"
    return (
        <group>
            {/* Floating Rickshaw context */}
            <group ref={groupRef}>
                <Float
                    speed={3}
                    rotationIntensity={0.5}
                    floatIntensity={1}
                    floatingRange={[-0.1, 0.1]}
                >
                    <primitive
                        object={scene}
                        scale={rickshawScale}
                        position={[0, 0, 0]}
                        rotation={[0, -Math.PI / 4, 0]}
                    />
                </Float>
            </group>

            {/* Typography Group */}
            <group ref={textGroupRef}>
                {/* Upper Arc: ZAMAN MANTAKA */}
                {/* Rendered manually for control */}
                <group position={[0, namePositionY, namePositionZ]}> {/* Behind and above */}
                    <Text
                        fontSize={nameFontSize}
                        color="#E63946"
                        anchorX="center"
                        anchorY="middle"
                        position={[0, 0, 0]}
                    >
                        ZAMAN MANTAKA
                    </Text>
                </group>

                {/* Lower / Side Text: SOFTWARE ENGINEER */}
                <group position={[sidePositionX, rightSidePositionY, sidePositionZ]} rotation={[0, -0.5, 0]}> {/* Right side */}
                    <Text
                        fontSize={sideFontSize}
                        color="black"
                        anchorX="left"
                        anchorY="middle"
                        maxWidth={3}
                        lineHeight={1}
                    >
                        SOFTWARE{'\n'}ENGINEER
                    </Text>
                </group>

                {/* Left Side: CREATIVE */}
                <group position={[-sidePositionX, leftSidePositionY, sidePositionZ]} rotation={[0, 0.5, 0]}> {/* Left side */}
                    <Text
                        fontSize={sideFontSize}
                        color="black"
                        anchorX="right"
                        anchorY="middle"
                        maxWidth={3}
                        lineHeight={1}
                    >
                        CREATIVE{'\n'}DEVELOPER
                    </Text>
                </group>
            </group>
        </group>
    );
}

useGLTF.preload("/3D_Assets/bangladeshi cycle rickshaw 3d model.glb");
