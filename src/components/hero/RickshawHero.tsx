"use client";

import { useRef, Suspense } from "react";
import { Plane, Environment } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import RickshawModel from "./RickshawModel";

// Background Wave Shader Material
const WaveMaterial = {
    uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#ffffff") },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) }, // Normalized 0-1
        uClickTime: { value: -100.0 }, // Time of last click
        uResolution: { value: new THREE.Vector2(1, 1) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      uniform vec2 uMouse;
      uniform float uClickTime;
      uniform vec2 uResolution;
      varying vec2 vUv;

      // Simplex 2D noise
      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
          dot(x12.zw,x12.zw)), 0.0);
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
        vec2 uv = vUv;
        
        // 1. Mouse Interaction (Repel/Distort)
        // Convert uv to aspect-corrected or world space if possible, but raw UV 0-1 is fine for plane
        vec2 mouseDist = uv - uMouse;
        float dist = length(mouseDist);
        
        // Repulsion force
        float repel = smoothstep(0.5, 0.0, dist); // Effect radius 0.5
        uv += normalize(mouseDist) * repel * 0.02; // Small distortion
        
        // 2. Click Ripple
        float clickAge = uTime - uClickTime;
        if (clickAge > 0.0 && clickAge < 2.0) { // Ripple lasts 2 seconds
            float rippleRadius = clickAge * 1.5; // Speed
            float rippleWidth = 0.1;
            float ripple = smoothstep(rippleRadius, rippleRadius - rippleWidth, dist) - 
                           smoothstep(rippleRadius - rippleWidth, rippleRadius - 2.0 * rippleWidth, dist);
            
            // Apply ripple distortion
            uv += normalize(mouseDist) * ripple * 0.05;
        }

        // 3. Base Topo Gen (using distorted UV)
        // Slow organic movement
        float noiseVal = snoise(uv * 3.0 + uTime * 0.05);
        
        float height = noiseVal * 0.5 + 0.5;
        float lines = 10.0;
        float lineThickness = 0.02;
        float pattern = fract(height * lines);
        float line = smoothstep(0.0, 0.05, pattern) - smoothstep(lineThickness, lineThickness + 0.05, pattern);
        
        vec3 lineColor = vec3(1.0, 0.2, 0.2);
        vec3 bgColor = uColor;
        
        vec3 finalColor = mix(bgColor, lineColor, line);
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
};

function WaveBackground() {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { viewport, size } = useThree(); // Get viewport and canvas size

    useFrame((state, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value += delta;

            // Update mouse uniform (normalized 0-1)
            // state.pointer is -1 to 1. Convert to 0 to 1.
            const u = (state.pointer.x + 1) / 2;
            const v = (state.pointer.y + 1) / 2;
            materialRef.current.uniforms.uMouse.value.set(u, v);
        }
    });

    const handleClick = () => {
        if (materialRef.current) {
            // Set click time to current time
            materialRef.current.uniforms.uClickTime.value = materialRef.current.uniforms.uTime.value;
        }
    };

    return (
        <mesh
            ref={meshRef}
            position={[0, 0, -5]} // Pushed back further to give space for 3D model
            onClick={handleClick}
            onPointerMove={() => { }} // Catch pointer events
        >
            <planeGeometry args={[viewport.width * 2, viewport.height * 2]} />
            <shaderMaterial
                ref={materialRef}
                uniforms={WaveMaterial.uniforms}
                vertexShader={WaveMaterial.vertexShader}
                fragmentShader={WaveMaterial.fragmentShader}
            />
        </mesh>
    );
}

// Scene wrapper to handle mouse logic and shared state
function SceneContent() {
    const { viewport } = useThree();

    // Responsive scale logic can be kept or adjusted
    const desiredWidth = 10;
    const scale = Math.min(1, viewport.width / desiredWidth);

    return (
        <>
            <WaveBackground />

            {/* Lighting for the model */}
            <Environment preset="city" />
            <ambientLight intensity={2} />
            <directionalLight position={[5, 5, 5]} intensity={2} castShadow />
            <pointLight position={[-5, 5, -5]} intensity={1} color="#ff0000" /> {/* Artistic accent */}
            <spotLight position={[0, 10, 0]} intensity={3} angle={0.5} penumbra={1} />

            {/* The Rickshaw 3D Model */}
            <group scale={scale}>
                <Suspense fallback={null}>
                    <RickshawModel />
                </Suspense>
            </group>
        </>
    );
}

export default function RickshawHero() {
    return (
        <group>
            <SceneContent />
        </group>
    );
}
