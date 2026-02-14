"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollDrive } from "./ScrollDriveContext";
import { createTrackCurve } from "./trackCurve";

const curve = createTrackCurve();
const CAM_HEIGHT = 45;
const CAM_DISTANCE = 35;
// Camera position when looking at car in garage - sideways view
const GARAGE_CAM_POSITION = new THREE.Vector3(-18, 10, 68);
const GARAGE_LOOK_AT = new THREE.Vector3(0, 1, 60);

const _point = new THREE.Vector3();
const _tangent = new THREE.Vector3();
const _targetPos = new THREE.Vector3();

export function CameraController() {
  const { camera } = useThree();
  const { carProgress, carAtGarage } = useScrollDrive();
  const posRef = useRef(new THREE.Vector3(0, 50, 50));
  const lookRef = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    if (carAtGarage) {
      posRef.current.lerp(GARAGE_CAM_POSITION, 0.04);
      lookRef.current.lerp(GARAGE_LOOK_AT, 0.06);
      camera.position.copy(posRef.current);
      camera.lookAt(lookRef.current);
      return;
    }

    const t = Math.max(0, Math.min(1, carProgress % 1));
    curve.getPointAt(t, _point);
    curve.getTangentAt(t, _tangent).normalize();
    _targetPos.set(
      _point.x,
      _point.y + CAM_HEIGHT,
      _point.z + CAM_DISTANCE
    );
    posRef.current.lerp(_targetPos, 0.05);
    lookRef.current.lerp(_point, 0.1);
    camera.position.copy(posRef.current);
    camera.lookAt(lookRef.current);
  });

  return null;
}