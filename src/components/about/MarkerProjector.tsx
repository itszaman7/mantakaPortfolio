"use client";

import { useRef } from "react";
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
const _worldPos = new THREE.Vector3();
const POSITION_THRESHOLD = 3;
const FRAME_THROTTLE = 3;

interface MarkerProjectorProps {
  trackPositions: number[];
}

function positionsEqual(
  a: { x: number; y: number; visible: boolean }[],
  b: { x: number; y: number; visible: boolean }[]
): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (
      Math.abs(a[i].x - b[i].x) > POSITION_THRESHOLD ||
      Math.abs(a[i].y - b[i].y) > POSITION_THRESHOLD ||
      a[i].visible !== b[i].visible
    )
      return false;
  }
  return true;
}

export function MarkerProjector({ trackPositions }: MarkerProjectorProps) {
  const { camera } = useThree();
  const { setMarkerScreenPositions } = useScrollDrive();
  const lastPositionsRef = useRef<{ x: number; y: number; visible: boolean }[]>([]);
  const frameCountRef = useRef(0);

  useFrame(() => {
    frameCountRef.current++;
    if (frameCountRef.current % FRAME_THROTTLE !== 0) return;

    const positions = trackPositions.map((trackPos) => {
      curve.getPointAt(trackPos, _pos);
      curve.getTangentAt(trackPos, _tangent).normalize();
      _side.crossVectors(_tangent, upVector).normalize();
      _worldPos.copy(_pos).addScaledVector(_side, MARKER_OFFSET);
      _worldPos.y += 5;
      _worldPos.project(camera);
      const x = (_worldPos.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-(_worldPos.y * 0.5) + 0.5) * window.innerHeight;
      const visible = _worldPos.z <= 1.2;
      return { x, y, visible };
    });

    if (!positionsEqual(positions, lastPositionsRef.current)) {
      lastPositionsRef.current = positions;
      setMarkerScreenPositions(positions);
    }
  });

  return null;
}
