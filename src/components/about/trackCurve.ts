import * as THREE from "three";

export const TRACK_POINTS = [
  new THREE.Vector3(0, 0, 60),
  new THREE.Vector3(40, 0, 40),
  new THREE.Vector3(80, 0, 0),
  new THREE.Vector3(120, 0, -40),
  new THREE.Vector3(100, 0, -80),
  new THREE.Vector3(40, 0, -100),
  new THREE.Vector3(-40, 0, -80),
  new THREE.Vector3(-80, 0, -40),
  new THREE.Vector3(-100, 0, 0),
  new THREE.Vector3(-120, 0, 40),
  new THREE.Vector3(-80, 0, 80),
  new THREE.Vector3(0, 0, 60),
];

export function createTrackCurve() {
  const curve = new THREE.CatmullRomCurve3(TRACK_POINTS);
  curve.closed = true;
  curve.tension = 0.5;
  return curve;
}

export const TRACK_WIDTH = 14;
export const MARKER_OFFSET = 15;

export const START_FINISH_POSITION = new THREE.Vector3(0, 0, 60);

/** Garage on the side of the track, well clear of track edge (no overlap). */
export const GROUND_Y = -0.19;
export const GARAGE_CENTER = new THREE.Vector3(-30, GROUND_Y, 60);
/** Car stops on the track (road) at start/finish, facing the garage. */
export const CAR_AT_GARAGE_POSITION = new THREE.Vector3(0, 0.25, 60);
export const GARAGE_WIDTH = 12;
export const GARAGE_DEPTH = 10;