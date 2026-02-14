"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollDrive } from "./ScrollDriveContext";
import { createTrackCurve, getStartFinishT } from "./trackCurve";

const curve = createTrackCurve();
const CAM_HEIGHT = 60;
const CAM_DISTANCE = 50;
const CAM_HEIGHT_END = 22;
const CAM_DISTANCE_END = 28;
const LERP_NORMAL = 0.05;
const LERP_END = 0.14; /* faster so zoom-in is clearly visible */

const _point = new THREE.Vector3();
const _tangent = new THREE.Vector3();
const _targetPos = new THREE.Vector3();
const _carLook = new THREE.Vector3();

export function CameraController() {
  const { camera } = useThree();
  const { carProgress, carAtGarage } = useScrollDrive();
  const posRef = useRef(new THREE.Vector3(0, 60, 60));
  const lookRef = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    // When journey ends, camera stays on car at start/finish line
    const t = carAtGarage ? getStartFinishT() : Math.max(0, Math.min(1, carProgress % 1));
    curve.getPointAt(t, _point);
    curve.getTangentAt(t, _tangent).normalize();

    _carLook.set(_point.x, _point.y + 0.25, _point.z);
    lookRef.current.lerp(_carLook, carAtGarage ? 0.12 : 0.1);

    if (carAtGarage) {
      _targetPos.set(
        _point.x,
        _point.y + CAM_HEIGHT_END,
        _point.z + CAM_DISTANCE_END
      );
      posRef.current.lerp(_targetPos, LERP_END);
    } else {
      _targetPos.set(
        _point.x,
        _point.y + CAM_HEIGHT,
        _point.z + CAM_DISTANCE
      );
      posRef.current.lerp(_targetPos, LERP_NORMAL);
    }
    camera.position.copy(posRef.current);
    camera.lookAt(lookRef.current);
  });

  return null;
}