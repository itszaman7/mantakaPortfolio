"use client";

import React, { useMemo } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { getStartFinishPosition, getStartFinishTangent, TRACK_WIDTH } from "./trackCurve";

export function StartFinishLine() {
  const { position, quaternion } = useMemo(() => {
    const pos = getStartFinishPosition();
    pos.y = 0.5; // above track surface so line is clearly visible

    const tangent = getStartFinishTangent();
    const quat = new THREE.Quaternion();
    quat.setFromUnitVectors(new THREE.Vector3(1, 0, 0), tangent);
    return { position: pos, quaternion: quat };
  }, []);

  const stripeWidth = TRACK_WIDTH * 1.05; // span full track width
  const stripeHeight = 1.4; // tall enough to read above track
  
  const stripes = useMemo(() => {
    const arr = [];
    const numStripes = 12;
    const geo = new THREE.PlaneGeometry(stripeHeight, stripeWidth / numStripes);
    const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const blackMat = new THREE.MeshBasicMaterial({ color: 0x1a1a1a, side: THREE.DoubleSide });
    
    for (let i = 0; i < numStripes; i++) {
      const mesh = new THREE.Mesh(geo, i % 2 === 0 ? whiteMat : blackMat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.z = (i - numStripes / 2 + 0.5) * (stripeWidth / numStripes);
      arr.push(mesh);
    }
    return arr;
  }, [stripeWidth, stripeHeight]);

  return (
    <group
      position={[position.x, position.y, position.z]}
      quaternion={quaternion}
    >
      {stripes.map((stripe, i) => (
        <primitive key={i} object={stripe} />
      ))}
      
      <Text
        position={[-stripeWidth * 0.45, 0.2, 0]}
        fontSize={4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        fontWeight="bold"
        outlineWidth={0.04}
        outlineColor="#000000"
      >
        START
      </Text>

      
    </group>
  );
}