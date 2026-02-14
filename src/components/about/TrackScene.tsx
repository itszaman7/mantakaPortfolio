"use client";

import React, { useMemo, Suspense } from "react";
import * as THREE from "three";
import { createTrackCurve, TRACK_WIDTH } from "./trackCurve";
import { F1CarOnTrack } from "./F1CarOnTrack";
import { MarkerProjector } from "./MarkerProjector";
import { CameraController } from "./CameraController";
import { StartFinishLine } from "./StartFinishLine";
import { Garage3D } from "./Garage3D";

const TRACK_COLOR = 0x9a9a9a;
const FOG_COLOR = 0xf8f8f8;
const GROUND_COLOR = 0xeeeeee;

interface TrackSceneProps {
  trackPositions: number[];
}

export function TrackScene({ trackPositions }: TrackSceneProps) {
  const curve = useMemo(() => createTrackCurve(), []);
  const trackGeo = useMemo(
    () => new THREE.TubeGeometry(curve, 400, TRACK_WIDTH / 2, 12, true),
    [curve]
  );
  const trackMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: TRACK_COLOR,
        roughness: 0.9,
        metalness: 0.1,
      }),
    []
  );
  const trackMesh = useMemo(() => {
    const m = new THREE.Mesh(trackGeo, trackMat);
    m.scale.y = 0.05;
    m.receiveShadow = true;
    return m;
  }, [trackGeo, trackMat]);

  const groundGeo = useMemo(() => new THREE.PlaneGeometry(3000, 3000), []);
  const groundMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: GROUND_COLOR,
        roughness: 1,
        metalness: 0,
      }),
    []
  );

  return (
    <>
      <color attach="background" args={[FOG_COLOR]} />
      <fog attach="fog" args={[FOG_COLOR, 80, 450]} />
      <ambientLight intensity={1.2} />
      <directionalLight
        position={[100, 150, 50]}
        intensity={1.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
        shadow-camera-near={0.5}
        shadow-camera-far={500}
        shadow-camera-left={-150}
        shadow-camera-right={150}
        shadow-camera-top={150}
        shadow-camera-bottom={-150}
      />
      <directionalLight position={[-80, 80, -80]} intensity={0.6} />
      <primitive object={trackMesh} />
      <StartFinishLine />
      <Suspense fallback={null}>
        <Garage3D milestoneCount={trackPositions.length} />
      </Suspense>
      <mesh
        geometry={groundGeo}
        material={groundMat}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.2, 0]}
        receiveShadow
      />
      <gridHelper
        args={[3000, 150, 0xe0e0e0, 0xeeeeee]}
        position={[0, -0.19, 0]}
      />
      <CameraController />
      <Suspense fallback={null}>
        <F1CarOnTrack />
      </Suspense>
      <MarkerProjector trackPositions={trackPositions} />
    </>
  );
}
