"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useScrollDrive } from "./ScrollDriveContext";
import { createTrackCurve, getStartFinishT } from "./trackCurve";

const MODEL_URL = "/3D_Assets/f1BDLivery.glb";
const curve = createTrackCurve();
const CAR_Y = 0.25;
const _point = new THREE.Vector3();
const _tangent = new THREE.Vector3();

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

    const t = carAtGarage ? getStartFinishT() : Math.max(0, Math.min(1, carProgress % 1));
    curve.getPointAt(t, _point);
    curve.getTangentAt(t, _tangent).normalize();

    groupRef.current.position.copy(_point);
    groupRef.current.position.y = CAR_Y;
    const angle = Math.atan2(_tangent.x, _tangent.z) - Math.PI / 2;
    groupRef.current.rotation.y = angle;
  });

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={cloned} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);