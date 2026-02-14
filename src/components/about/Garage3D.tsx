"use client";

import React, { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { getGarageCenter } from "./trackCurve";

const GARAGE_GLB_URL = "/3D_Assets/garage.glb";
const GARAGE_MAX_SIZE = 18;

/**
 * Garage positioned beside the track (not on it).
 * Opening faces the track.
 */
export function Garage3D({ milestoneCount = 5 }: { milestoneCount?: number }) {
  const { scene } = useGLTF(GARAGE_GLB_URL);

  const { cloned, scale, position, rotation } = useMemo(() => {
    const c = scene.clone();
    c.position.set(1, 0, -2.5);
    c.quaternion.identity();
    c.scale.setScalar(1);
    c.updateMatrixWorld(true);
    
    const box = new THREE.Box3().setFromObject(c);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const s = GARAGE_MAX_SIZE / maxDim;
    
    // Place on ground
    const baseY = 0 - box.min.y * s;
    
    // Position beside the track
    const garageCenter = getGarageCenter();
    const pos = new THREE.Vector3(
      garageCenter.x,
      baseY,
      garageCenter.z
    );
    
    // Rotation: garage opening faces the track (negative X); adjust if model forward differs
    const rot = new THREE.Euler(0, Math.PI / 2, 0);

    return { cloned: c, scale: s, position: pos, rotation: rot };
  }, [scene, milestoneCount]);

  return (
    <group
      position={[position.x, position.y, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      scale={[scale, scale, scale]}
    >
      <primitive object={cloned} />
    </group>
  );
}

useGLTF.preload(GARAGE_GLB_URL);