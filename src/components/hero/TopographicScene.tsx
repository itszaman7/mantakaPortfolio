"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { generateNoiseTexture } from "@/utils/noiseTexture";

interface TopographicSceneProps {
  dissolveRef: React.MutableRefObject<{ value: number }>;
}

export default function TopographicScene({ dissolveRef }: TopographicSceneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  // Generate noise texture once
  const noiseTexture = useMemo(() => generateNoiseTexture(256), []);

  // Shader material with dissolve effect
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#ffffff") },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uClickTime: { value: -100.0 },
      uDissolve: { value: 0.0 },
      uNoiseTexture: { value: noiseTexture },
    }),
    [noiseTexture]
  );

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
      materialRef.current.uniforms.uDissolve.value = dissolveRef.current.value;

      // Update mouse uniform (normalized 0-1)
      const u = (state.pointer.x + 1) / 2;
      const v = (state.pointer.y + 1) / 2;
      materialRef.current.uniforms.uMouse.value.set(u, v);
    }
  });

  const handleClick = () => {
    if (materialRef.current) {
      materialRef.current.uniforms.uClickTime.value =
        materialRef.current.uniforms.uTime.value;
    }
  };

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec2 uMouse;
    uniform float uClickTime;
    uniform float uDissolve;
    uniform sampler2D uNoiseTexture;
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
      vec2 mouseDist = uv - uMouse;
      float dist = length(mouseDist);
      
      // Repulsion force
      float repel = smoothstep(0.5, 0.0, dist);
      uv += normalize(mouseDist) * repel * 0.02;
      
      // 2. Click Ripple
      float clickAge = uTime - uClickTime;
      if (clickAge > 0.0 && clickAge < 2.0) {
          float rippleRadius = clickAge * 1.5;
          float rippleWidth = 0.1;
          float ripple = smoothstep(rippleRadius, rippleRadius - rippleWidth, dist) - 
                         smoothstep(rippleRadius - rippleWidth, rippleRadius - 2.0 * rippleWidth, dist);
          
          uv += normalize(mouseDist) * ripple * 0.05;
      }

      // 3. THANOS DISSOLVE EFFECT — multi-octave noise for more grain
      float n1 = texture2D(uNoiseTexture, uv * 2.0).r;
      float n2 = texture2D(uNoiseTexture, uv * 5.0 + 0.3).r;
      float n3 = texture2D(uNoiseTexture, uv * 9.0 - 0.1).r;
      float noiseValue = n1 * 0.5 + n2 * 0.35 + n3 * 0.15;
      
      // Discard pixels based on noise threshold
      if (noiseValue < uDissolve) {
        discard;
      }
      
      // 4. Base Topo Gen (using distorted UV)
      float noiseVal = snoise(uv * 3.0 + uTime * 0.05);
      
      float height = noiseVal * 0.5 + 0.5;
      float lines = 10.0;
      float lineThickness = 0.02;
      float pattern = fract(height * lines);
      float line = smoothstep(0.0, 0.05, pattern) - smoothstep(lineThickness, lineThickness + 0.05, pattern);
      
      vec3 lineColor = vec3(1.0, 0.2, 0.2);
      vec3 bgColor = uColor;
      
      vec3 finalColor = mix(bgColor, lineColor, line);
      
      // 5. Edge Glow (Burn Effect)
      float edgeWidth = 0.05;
      float edge = smoothstep(uDissolve - edgeWidth, uDissolve, noiseValue);
      vec3 burnColor = vec3(1.0, 0.2, 0.0); // Red-orange glow
      
      finalColor = mix(finalColor, burnColor, edge * (1.0 - step(uDissolve, noiseValue)));
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  return (
    <mesh
      ref={meshRef}
      position={[0, viewport.height * 0.25, -5]}
      onClick={handleClick}
      onPointerMove={() => { }}
    >
      <planeGeometry args={[viewport.width * 2.5, viewport.height * 2.5]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={false}
      />
    </mesh>
  );
}
