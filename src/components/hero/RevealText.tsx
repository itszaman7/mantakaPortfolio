"use client";

import { useMemo, useRef } from "react";
import { Text3D, useTexture, Center } from "@react-three/drei";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

// Custom ShaderMaterial for the Magic Reveal effect
const RevealMaterial = {
    uniforms: {
        uBaseColor: { value: new THREE.Color("#ffffff") },
        uTexture: { value: null },
        uMousePos: { value: new THREE.Vector3(99, 99, 99) },
        uRadius: { value: 1.5 },
        uFeather: { value: 0.5 },
        uTime: { value: 0 },
    },
    vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform vec3 uBaseColor;
    uniform sampler2D uTexture;
    uniform vec3 uMousePos;
    uniform float uRadius;
    uniform float uFeather;
    uniform float uTime;

    varying vec2 vUv;
    varying vec3 vPosition;

    // Simple 2D Noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                            0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                            -0.577350269189626, // -1.0 + 2.0 * C.x
                            0.024390243902439); // 1.0 / 41.0
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);

        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;

        i = mod289(i); // Avoid truncation effects in permutation
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));

        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;

        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;

        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }

    void main() {
      // Calculate basic distance
      float dist = distance(vPosition, uMousePos);
      
      // Add noise to the edge of the reveal
      // Scale noise by standard UV or Position + Time
      // We distort the distance field check
      float noiseVal = snoise(vPosition.xy * 2.0 + uTime * 0.5);
      
      // Modulate distance with noise
      float noisyDist = dist + noiseVal * 0.2; // 0.2 strength

      float spot = 1.0 - smoothstep(uRadius, uRadius + uFeather, noisyDist);

      vec4 artColor = texture2D(uTexture, vUv * 0.5); 
      vec3 finalColor = mix(uBaseColor, artColor.rgb, spot);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

interface RevealTextProps {
    mousePos: THREE.Vector3;
}

export default function RevealText({ mousePos }: RevealTextProps) {
    const rickshawTexture = useTexture("/pattern.png");
    rickshawTexture.wrapS = rickshawTexture.wrapT = THREE.RepeatWrapping;

    const groupRef = useRef<THREE.Group>(null);
    const { viewport } = useThree();

    // Shader Refs
    const shaderMatRef = useRef<THREE.ShaderMaterial>(null);
    const bevelMatRef = useRef<THREE.ShaderMaterial>(null);

    // Smooth Parallax Tilt
    useFrame((state, delta) => {
        if (groupRef.current) {
            const x = (state.pointer.x * viewport.width) / 2;
            const y = (state.pointer.y * viewport.height) / 2;

            // Subtle Lando-like parallax with correct orientation
            // Mouse Right (positive X) -> Tilt Right (rotate Y negative)
            const targetRotX = y * 0.05; // Mouse Down -> Look Down (X negative) - wait. 
            // Mouse Y is +1 at top? No, R3F pointer is normalized.
            // state.pointer.y is +1 top, -1 bottom.
            // Look UP (rot X positive) when mouse is top?
            // Let's try: Mouse Top -> Tilt Up. 
            // Standard parallax usually "looks" at mouse. 
            // If eye follows mouse, object tilts to face eye.
            // Mouse Top -> Object rotates X positive (top backward).

            // Updated multipliers for corrected "Looking at Mouse" feel
            const targetRotY = x * 0.03;

            // Dampen rotation
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 3);
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 3);
        }

        if (shaderMatRef.current && bevelMatRef.current) {
            const targetPos = mousePos;

            // Update Uniforms for Face
            shaderMatRef.current.uniforms.uMousePos.value.lerp(targetPos, delta * 8);
            shaderMatRef.current.uniforms.uTime.value += delta;

            // Sync Bevel Uniforms
            bevelMatRef.current.uniforms.uMousePos.value.copy(shaderMatRef.current.uniforms.uMousePos.value);
            bevelMatRef.current.uniforms.uTime.value = shaderMatRef.current.uniforms.uTime.value;

            const isActive = targetPos.x < 50;
            const targetRadius = isActive ? 1.5 : 0.0;
            const currentRadius = THREE.MathUtils.lerp(shaderMatRef.current.uniforms.uRadius.value, targetRadius, delta * 5);

            shaderMatRef.current.uniforms.uRadius.value = currentRadius;
            bevelMatRef.current.uniforms.uRadius.value = currentRadius;
        }
    });

    const revealMaterial = useMemo(() => {
        const mat = new THREE.ShaderMaterial({
            uniforms: {
                ...THREE.UniformsUtils.clone(RevealMaterial.uniforms),
                uBaseColor: { value: new THREE.Color("#ffffff") }, // Face: White
            },
            vertexShader: RevealMaterial.vertexShader,
            fragmentShader: RevealMaterial.fragmentShader,
        });
        mat.uniforms.uTexture.value = rickshawTexture;
        return mat;
    }, [rickshawTexture]);

    // Red Reveal Material for Bevel (Sides)
    // Same reveal logic, but Base Color is RED.
    // So distinct Red outline -> Reveals Pattern on hover.
    const bevelMaterial = useMemo(() => {
        const mat = new THREE.ShaderMaterial({
            uniforms: {
                ...THREE.UniformsUtils.clone(RevealMaterial.uniforms),
                uBaseColor: { value: new THREE.Color("#ff0000") }, // Bevel: Red
            },
            vertexShader: RevealMaterial.vertexShader,
            fragmentShader: RevealMaterial.fragmentShader,
        });
        mat.uniforms.uTexture.value = rickshawTexture;
        return mat;
    }, [rickshawTexture]);

    return (
        <group ref={groupRef}>
            {/* Main Text */}
            <Center top>
                <Text3D
                    font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
                    size={0.6}
                    height={0.05} // Thickness
                    curveSegments={12}
                    bevelEnabled
                    bevelThickness={0.03}
                    bevelSize={0.005}
                    bevelOffset={0}
                    bevelSegments={3}
                >
                    HEY, IT'S ZAMAN MANTAKA
                    {/* Material 0: Front Face (White Reveal) */}
                    <primitive object={revealMaterial} attach="material-0" ref={shaderMatRef} />
                    {/* Material 1: Bevel/Sides (Red Reveal) replaced std material */}
                    <primitive object={bevelMaterial} attach="material-1" ref={bevelMatRef} />
                </Text3D>
            </Center>

            <Center top position={[0, -1, 0]}>
                <Text3D
                    font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
                    size={0.4}
                    height={0.05}
                    curveSegments={12}
                    bevelEnabled
                    bevelThickness={0.03}
                    bevelSize={0.005}
                >
                    WELCOME TO MY PORTFOLIO
                    <primitive object={revealMaterial} attach="material-0" />
                    <primitive object={bevelMaterial} attach="material-1" />
                </Text3D>
            </Center>

            {/* Drop Shadow Text (Static offset behind) */}
            <group position={[0.05, -0.05, -0.1]}>
                <Center top>
                    <Text3D
                        font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
                        size={0.6}
                        height={0.01}
                        bevelEnabled={false}
                    >
                        HEY, IT'S ZAMAN MANTAKA
                        <meshBasicMaterial color="#d1d5db" transparent opacity={0.6} /> {/* Gray Shadow */}
                    </Text3D>
                </Center>
                <Center top position={[0, -1, 0]}>
                    <Text3D
                        font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
                        size={0.4}
                        height={0.01}
                        bevelEnabled={false}
                    >
                        WELCOME TO MY PORTFOLIO
                        <meshBasicMaterial color="#d1d5db" transparent opacity={0.6} />
                    </Text3D>
                </Center>
            </group>
        </group>
    );
}
