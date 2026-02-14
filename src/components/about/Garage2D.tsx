"use client";

import React, { useMemo } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { GARAGE_CENTER, GARAGE_WIDTH, GARAGE_DEPTH } from "./trackCurve";

/** Slightly above ground to avoid z-fight with grid. */
const PAD_Y = 0.01;

export function Garage2D() {
  const { outline, outlineGlow, fillPlane } = useMemo(() => {
    const hw = GARAGE_WIDTH / 2;
    const hd = GARAGE_DEPTH / 2;

    const points = [
      new THREE.Vector3(-hw, PAD_Y, -hd),
      new THREE.Vector3(hw, PAD_Y, -hd),
      new THREE.Vector3(hw, PAD_Y, hd),
      new THREE.Vector3(-hw, PAD_Y, hd),
      new THREE.Vector3(-hw, PAD_Y, -hd),
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const outlineGlow = new THREE.Line(
      lineGeo.clone(),
      new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.6,
      })
    );
    outlineGlow.renderOrder = 0;

    const outline = new THREE.Line(
      lineGeo,
      new THREE.LineBasicMaterial({ color: 0xeeeeee })
    );
    outline.renderOrder = 1;

    const planeGeo = new THREE.PlaneGeometry(GARAGE_WIDTH, GARAGE_DEPTH);
    const fillPlane = new THREE.Mesh(
      planeGeo,
      new THREE.MeshBasicMaterial({
        color: 0x888888,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      })
    );
    fillPlane.rotation.x = -Math.PI / 2;
    fillPlane.position.y = PAD_Y;
    fillPlane.renderOrder = 1;

    return { outline, outlineGlow, fillPlane };
  }, []);

  return (
    <group
      position={[GARAGE_CENTER.x, GARAGE_CENTER.y, GARAGE_CENTER.z]}
      rotation={[0, 0, 0]}
    >
      <primitive object={fillPlane} />
      <primitive object={outlineGlow} />
      <primitive object={outline} />
      <Text
        position={[0, PAD_Y + 0.02, 0]}
        fontSize={2.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0]}
        outlineWidth={0.03}
        outlineColor="#ffffff"
        outlineOpacity={0.5}
      >
        PIT
      </Text>
    </group>
  );
}