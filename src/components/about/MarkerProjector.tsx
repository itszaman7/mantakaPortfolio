"use client";

import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollDrive } from "./ScrollDriveContext";
import { createTrackCurve } from "./trackCurve";
import { MARKER_OFFSET } from "./trackCurve";

const curve = createTrackCurve();
const upVector = new THREE.Vector3(0, 1, 0);
const _pos = new THREE.Vector3();
const _tangent = new THREE.Vector3();
const _side = new THREE.Vector3();
const _screen = new THREE.Vector3();

interface MarkerProjectorProps {
  trackPositions: number[];
}

export function MarkerProjector({ trackPositions }: MarkerProjectorProps) {
  const { camera } = useThree();
  const { setMarkerScreenPositions } = useScrollDrive();

  useFrame(() => {
    const positions = trackPositions.map((trackPos) => {
      curve.getPointAt(trackPos, _pos);
      curve.getTangentAt(trackPos, _tangent).normalize();
      _side.crossVectors(_tangent, upVector).normalize();
      const worldPos = _pos.clone().add(_side.multiplyScalar(MARKER_OFFSET));
      worldPos.y += 5;
      worldPos.project(camera);
      const x = (worldPos.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-(worldPos.y * 0.5) + 0.5) * window.innerHeight;
      // Show marker when in front of camera (z <= 1) or slightly behind so text is rarely missing
      const visible = worldPos.z <= 1.2;
      return { x, y, visible };
    });
    setMarkerScreenPositions(positions);
  });

  return null;
}
