"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { F1Car3D } from "./F1Car3D";

export default function CarScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.5], fov: 50 }}
      gl={{ alpha: true, antialias: true }}
      className="w-full h-full"
    >
      <ambient light intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <Suspense fallback={null}>
        <F1Car3D />
      </Suspense>
    </Canvas>
  );
}
