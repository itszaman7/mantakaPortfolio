"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useScrollDrive } from "./ScrollDriveContext";
import { createTrackCurve } from "./trackCurve";
import { CAR_AT_GARAGE_POSITION } from "./trackCurve";

const MODEL_URL = "/3D_Assets/f1BDLivery.glb";
const curve = createTrackCurve();
const GARAGE_LERP = 0.035;

export function F1CarOnTrack() {
  const groupRef = useRef<THREE.Group>(null);
  const { carProgress, carAtGarage } = useScrollDrive();
  const { scene } = useGLTF(MODEL_URL);

  const { cloned, scale } = useMemo(() => {
    const c = scene.clone();
    const box = new THREE.Box3().setFromObject(c);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const baseScale = 12 / maxDim;
    return { cloned: c, scale: baseScale };
  }, [scene]);

  useFrame(() => {
    if (!groupRef.current) return;

    if (carAtGarage) {
      groupRef.current.position.lerp(CAR_AT_GARAGE_POSITION.clone(), GARAGE_LERP);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        Math.PI / 2,
        0.02
      );
      return;
    }

    const t = Math.max(0, Math.min(1, carProgress % 1));
    const point = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();

    groupRef.current.position.copy(point);
    groupRef.current.position.y = 0.25;

    const angle = Math.atan2(tangent.x, tangent.z) - Math.PI / 2;
    groupRef.current.rotation.y = angle;
  });

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={cloned} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);