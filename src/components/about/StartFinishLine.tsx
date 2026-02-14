"use client";

import React, { useMemo } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { createTrackCurve, START_FINISH_POSITION, TRACK_WIDTH } from "./trackCurve";

const curve = createTrackCurve();

export function StartFinishLine() {
  const { position, quaternion } = useMemo(() => {
    const pos = START_FINISH_POSITION.clone();
    pos.y = 0.06;
    const tangent = curve.getTangentAt(0).normalize();
    const quat = new THREE.Quaternion();
    quat.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
    return { position: pos, quaternion: quat };
  }, []);

  const stripeWidth = TRACK_WIDTH * 0.7;
  
  // Create checkered pattern
  const stripes = useMemo(() => {
    const arr = [];
    const numStripes = 10;
    const stripeHeight = 0.5;
    const geo = new THREE.PlaneGeometry(stripeWidth / numStripes, stripeHeight);
    const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const blackMat = new THREE.MeshBasicMaterial({ color: 0x1a1a1a, side: THREE.DoubleSide });
    
    for (let i = 0; i < numStripes; i++) {
      const mesh = new THREE.Mesh(geo, i % 2 === 0 ? whiteMat : blackMat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.x = (i - numStripes / 2 + 0.5) * (stripeWidth / numStripes);
      arr.push(mesh);
    }
    return arr;
  }, [stripeWidth]);

  return (
    <group
      position={[position.x, position.y, position.z]}
      quaternion={quaternion}
    >
      {/* Checkered finish line */}
      {stripes.map((stripe, i) => (
        <primitive key={i} object={stripe} />
      ))}
      
      {/* START text painted on track - positioned along the Z axis */}
      <Text
        position={[0, 0.07, -4]}
        fontSize={2.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0]}
        fontWeight="black"
        letterSpacing={0.15}
      >
        START
      </Text>
      
      {/* FINISH text painted on track */}
      <Text
        position={[0, 0.07, 4]}
        fontSize={2.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0]}
        fontWeight="black"
        letterSpacing={0.15}
      >
        FINISH
      </Text>
    </group>
  );
}