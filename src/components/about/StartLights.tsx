"use client";

import React, { useMemo } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { createTrackCurve, START_FINISH_POSITION, TRACK_WIDTH } from "./trackCurve";

const curve = createTrackCurve();
const GANTRY_HEIGHT = 10;
const LIGHT_RADIUS = 0.55;
const LIGHT_SPACING = 1.8;
const LIGHT_COLOR = 0xff0000;
const BAR_THICKNESS = 0.35;
const PILLAR_THICKNESS = 0.35;

export function StartLights() {
  const { position, quaternion } = useMemo(() => {
    const pos = START_FINISH_POSITION.clone();
    pos.y = 0.05;
    const tangent = curve.getTangentAt(0).normalize();
    const quat = new THREE.Quaternion();
    quat.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
    return { position: pos, quaternion: quat };
  }, []);

  const lineStrip = useMemo(() => {
    const w = TRACK_WIDTH * 0.52;
    const g = new THREE.PlaneGeometry(w, 0.4);
    const m = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.rotation.x = -Math.PI / 2;
    return mesh;
  }, []);

  const lights = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 5; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: LIGHT_COLOR,
        emissive: LIGHT_COLOR,
        emissiveIntensity: 1.2,
      });
      const geo = new THREE.SphereGeometry(LIGHT_RADIUS, 12, 12);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.x = (i - 2) * LIGHT_SPACING;
      mesh.position.y = GANTRY_HEIGHT;
      mesh.position.z = BAR_THICKNESS / 2 + LIGHT_RADIUS + 0.15;
      mesh.castShadow = true;
      arr.push(mesh);
    }
    return arr;
  }, []);

  const gantryBar = useMemo(() => {
    const geo = new THREE.BoxGeometry(
      5 * LIGHT_SPACING + 0.8,
      BAR_THICKNESS,
      BAR_THICKNESS
    );
    const mat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.6,
      metalness: 0.3,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = GANTRY_HEIGHT;
    mesh.castShadow = true;
    return mesh;
  }, []);

  const gantryPillars = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.7,
      metalness: 0.2,
    });
    const geo = new THREE.BoxGeometry(
      PILLAR_THICKNESS,
      GANTRY_HEIGHT * 2,
      PILLAR_THICKNESS
    );
    const left = new THREE.Mesh(geo, mat);
    left.position.set(
      -(5 * LIGHT_SPACING) / 2 - 0.5,
      GANTRY_HEIGHT / 2,
      0
    );
    left.castShadow = true;
    const right = new THREE.Mesh(geo, mat);
    right.position.set(
      (5 * LIGHT_SPACING) / 2 + 0.5,
      GANTRY_HEIGHT / 2,
      0
    );
    right.castShadow = true;
    return [left, right];
  }, []);

  return (
    <group
      position={[position.x, position.y, position.z]}
      quaternion={quaternion}
    >
      <primitive object={lineStrip} />
      <primitive object={gantryBar} />
      {gantryPillars.map((p, i) => (
        <primitive key={i} object={p} />
      ))}
      {lights.map((light, i) => (
        <primitive key={i} object={light} />
      ))}
      <Text
        position={[0, GANTRY_HEIGHT + 1.8, 0.2]}
        fontSize={1.6}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        START
      </Text>
      <Text
        position={[0, GANTRY_HEIGHT + 0.6, 0.2]}
        fontSize={0.7}
        color="rgba(255,255,255,0.75)"
        anchorX="center"
        anchorY="middle"
      >
        START / FINISH
      </Text>
    </group>
  );
}
