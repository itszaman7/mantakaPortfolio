"use client";

import { useGLTF, Text, Float } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";

export interface RickshawModelProps {
    heroContentOutRef?: React.MutableRefObject<{ value: number }>;
}

export default function RickshawModel(props: RickshawModelProps) {
    const { heroContentOutRef } = props;
    const { scene } = useGLTF("/3D_Assets/bangladeshi cycle rickshaw 3d model.glb");
    const groupRef = useRef<THREE.Group>(null);
    const textGroupRef = useRef<THREE.Group>(null);
    const { viewport } = useThree();

    // Clone and customize the rickshaw materials
    const customizedScene = useMemo(() => {
        const clonedScene = scene.clone();

        // Traverse and update materials
        clonedScene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                // Use MeshBasicMaterial for pure white - unaffected by lighting
                const whiteMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    toneMapped: false, // Prevents darkening
                });

                child.material = whiteMaterial;

                // Add bright red neon edges with strong emissive glow
                const edges = new THREE.EdgesGeometry(child.geometry, 15);

                // Main neon line - bright red with emissive
                const neonMaterial = new THREE.MeshBasicMaterial({
                    color: 0xff0000,
                    toneMapped: false,
                });

                // Multiple glow layers for intense neon effect
                const glowMaterial1 = new THREE.MeshBasicMaterial({
                    color: 0xff0000,
                    transparent: true,
                    opacity: 0.8,
                    toneMapped: false,
                });

                const glowMaterial2 = new THREE.MeshBasicMaterial({
                    color: 0xff3333,
                    transparent: true,
                    opacity: 0.5,
                    toneMapped: false,
                });

                const edgeLine = new THREE.LineSegments(edges, neonMaterial);
                const glowLine1 = new THREE.LineSegments(edges.clone(), glowMaterial1);
                const glowLine2 = new THREE.LineSegments(edges.clone(), glowMaterial2);

                // Scale glow layers for bloom effect
                glowLine1.scale.setScalar(1.003);
                glowLine2.scale.setScalar(1.006);

                child.add(edgeLine);
                child.add(glowLine1);
                child.add(glowLine2);
            }
        });

        return clonedScene;
    }, [scene]);

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

    // Low-sensitivity mouse follow: dead zone so clicks/small moves don't rotate
    const ROT_DEAD_ZONE = 0.35;
    const RICKSHAW_ROT_STRENGTH = 0.06;
    const TEXT_ROT_STRENGTH = 0.04;
    const LERP_SPEED = 0.04;

    useFrame((state) => {
        const { pointer } = state;
        const ptrLen = Math.sqrt(pointer.x * pointer.x + pointer.y * pointer.y);
        const inDeadZone = ptrLen < ROT_DEAD_ZONE;
        const t = heroContentOutRef?.current?.value ?? 0;

        // Disable mouse interaction when zooming (t > 0)
        const mouseDisabled = t > 0.01;

        if (groupRef.current) {
            const outScale = 1 - t * 0.08;
            const outY = t * 0.3;
            groupRef.current.scale.setScalar(
                THREE.MathUtils.lerp(groupRef.current.scale.x, outScale, 0.08)
            );
            const baseY = mouseDisabled ? 0.5 : (pointer.y * 0.3) + 0.5;
            groupRef.current.position.y = THREE.MathUtils.lerp(
                groupRef.current.position.y,
                baseY + outY,
                0.1
            );

            const targetRotationY = (inDeadZone || mouseDisabled) ? 0 : pointer.x * RICKSHAW_ROT_STRENGTH;
            const targetRotationX = (inDeadZone || mouseDisabled) ? 0 : -pointer.y * RICKSHAW_ROT_STRENGTH;
            groupRef.current.rotation.y = THREE.MathUtils.lerp(
                groupRef.current.rotation.y,
                targetRotationY,
                LERP_SPEED
            );
            groupRef.current.rotation.x = THREE.MathUtils.lerp(
                groupRef.current.rotation.x,
                targetRotationX,
                LERP_SPEED
            );

            const targetPosX = mouseDisabled ? 0 : pointer.x * 0.3;
            groupRef.current.position.x = THREE.MathUtils.lerp(
                groupRef.current.position.x,
                targetPosX,
                0.08
            );
        }

        // Scroll rotation: start = 0 (facing camera), end = -PI/4 (swapped from before)
        if (groupRef.current) {
            const targetScrollRotation = -t * (Math.PI / 4);

            groupRef.current.children[0].rotation.y = THREE.MathUtils.lerp(
                groupRef.current.children[0].rotation.y,
                targetScrollRotation,
                0.08
            );
        }

        // Text: fadeout only + parallax
        if (textGroupRef.current) {
            textGroupRef.current.rotation.x = THREE.MathUtils.lerp(
                textGroupRef.current.rotation.x,
                inDeadZone ? 0 : -pointer.y * TEXT_ROT_STRENGTH,
                LERP_SPEED
            );
            textGroupRef.current.rotation.y = THREE.MathUtils.lerp(
                textGroupRef.current.rotation.y,
                inDeadZone ? 0 : pointer.x * TEXT_ROT_STRENGTH,
                LERP_SPEED
            );
            textGroupRef.current.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material) {
                    const mat = Array.isArray(child.material) ? child.material[0] : child.material;
                    if (mat && "opacity" in mat) {
                        const m = mat as THREE.MeshBasicMaterial;
                        if (t > 0.01) m.transparent = true;
                        m.opacity = THREE.MathUtils.lerp(m.opacity, 1 - t, 0.15);
                    }
                }
            });
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
                        object={customizedScene}
                        scale={rickshawScale}
                        position={[0, 0, 0]}
                        rotation={[0, -Math.PI / 4, 0]}
                    />
                </Float>
            </group>

            {/* Typography Group — fadeout on scroll */}
            <group ref={textGroupRef}>
                <group position={[0, namePositionY, namePositionZ]}>
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
                <group position={[sidePositionX, rightSidePositionY, sidePositionZ]} rotation={[0, -0.5, 0]}>
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
                <group position={[-sidePositionX, leftSidePositionY, sidePositionZ]} rotation={[0, 0.5, 0]}>
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
