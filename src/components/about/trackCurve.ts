import * as THREE from "three";

/** 
 * Dynamic track that scales based on number of milestones.
 * Creates a smooth oval circuit with garage beside the start/finish straight.
 */

/**
 * Generate track points dynamically based on milestone count.
 * More milestones = larger track to accommodate them.
 */
export function generateTrackPoints(milestoneCount: number): THREE.Vector3[] {
  // Base size + extra size per milestone
  const baseLength = 100;
  const lengthPerMilestone = 15; // Each milestone adds 15 units
  const totalLength = baseLength + (milestoneCount * lengthPerMilestone);
  
  const width = totalLength * 0.6; // Width proportional to length
  const halfLength = totalLength / 2;
  const halfWidth = width / 2;
  
  const points: THREE.Vector3[] = [];
  
  // BOTTOM STRAIGHT (where garage will be)
  const bottomZ = -halfLength;
  const numBottomPoints = 8;
  for (let i = 0; i <= numBottomPoints; i++) {
    const x = -halfWidth + (i / numBottomPoints) * width;
    points.push(new THREE.Vector3(x, 0, bottomZ));
  }
  
  // RIGHT CURVE (bottom to top)
  const curvePoints = 8;
  for (let i = 1; i <= curvePoints; i++) {
    const t = i / (curvePoints + 1);
    const angle = -Math.PI / 2 + t * Math.PI;
    const x = halfWidth + Math.cos(angle) * (width * 0.3);
    const z = bottomZ + (t * totalLength);
    points.push(new THREE.Vector3(x, 0, z));
  }
  
  // TOP STRAIGHT
  const topZ = halfLength;
  const numTopPoints = 8;
  for (let i = 0; i <= numTopPoints; i++) {
    const x = halfWidth - (i / numTopPoints) * width;
    points.push(new THREE.Vector3(x, 0, topZ));
  }
  
  // LEFT CURVE (top to bottom)
  for (let i = 1; i <= curvePoints; i++) {
    const t = i / (curvePoints + 1);
    const angle = Math.PI / 2 + t * Math.PI;
    const x = -halfWidth + Math.cos(angle) * (width * 0.3);
    const z = topZ - (t * totalLength);
    points.push(new THREE.Vector3(x, 0, z));
  }
  
  return points;
}

// Store the generated points globally so we can access them
let TRACK_POINTS: THREE.Vector3[] = [];
let MILESTONE_COUNT = 5; // Default

export function setMilestoneCount(count: number) {
  MILESTONE_COUNT = count;
  TRACK_POINTS = generateTrackPoints(count);
}

export function getTrackPoints(): THREE.Vector3[] {
  if (TRACK_POINTS.length === 0) {
    TRACK_POINTS = generateTrackPoints(MILESTONE_COUNT);
  }
  return TRACK_POINTS;
}

export function createTrackCurve(): THREE.CatmullRomCurve3 {
  const points = getTrackPoints();
  const curve = new THREE.CatmullRomCurve3(points);
  curve.closed = true;
  curve.tension = 0.5;
  return curve;
}

// Start/finish at center of bottom straight; use midpoint between points 4 and 5 for tangent
const START_FINISH_POINT_INDEX = 2.5;

/** Curve parameter t (0..1) where the car should stop when the journey ends. Slightly past center of bottom straight so car is clearly over the START line. */
export function getStartFinishT(): number {
  const points = getTrackPoints();
  if (points.length <= 0) return 0;
  return 2.5 / points.length; /* a bit past center (point 4) so stop is over the line */
}

/** Tangent at the start/finish line so the line can be aligned to the track. */
export function getStartFinishTangent(): THREE.Vector3 {
  const curve = createTrackCurve();
  const points = curve.points as THREE.Vector3[];
  const n = points.length;
  if (n === 0) return new THREE.Vector3(1, 0, 0);
  const t = START_FINISH_POINT_INDEX / n;
  return curve.getTangentAt(t).normalize();
}

export const TRACK_WIDTH = 14;
export const MARKER_OFFSET = 15;

// Start/Finish in the middle of the bottom straight (not on a corner)
export function getStartFinishPosition(): THREE.Vector3 {
  const points = getTrackPoints();
  if (points.length >= 9) {
    // Bottom straight is points 0..8; center is points[4]
    return points[4].clone().setY(0.06);
  }
  if (points.length > 0) return points[0].clone().setY(0.06);
  return new THREE.Vector3(-50, 0.06, -50);
}

export const START_FINISH_POSITION = getStartFinishPosition();

export const GROUND_Y = -0.19;

// Garage is BESIDE the track, at the center of the bottom straight — offset so fully off the road
export function getGarageCenter(): THREE.Vector3 {
  const points = getTrackPoints();
  if (points.length >= 9) {
    const centerBottom = points[4];
    const offsetFromCenter = 42; // well off the track so garage is not on the road
    return new THREE.Vector3(
      centerBottom.x + offsetFromCenter,
      GROUND_Y,
      centerBottom.z
    );
  }
  return new THREE.Vector3(42, GROUND_Y, -50);
}

export const GARAGE_CENTER = getGarageCenter();
export const GARAGE_CENTER_X = GARAGE_CENTER.x;
export const GARAGE_CENTER_Z = GARAGE_CENTER.z;

// Car parks inside the garage (same X, Z as garage)
export const CAR_AT_GARAGE_POSITION = new THREE.Vector3(
  GARAGE_CENTER.x,
  0.25,
  GARAGE_CENTER.z
);

export const GARAGE_WIDTH = 16;
export const GARAGE_DEPTH = 18;

// Initialize with default milestone count
setMilestoneCount(5);