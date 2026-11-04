import { Vector3 } from "three";
import { type GlobeKey, type Orbit, type GlobeStop } from "@/types/globe-types";

export const THEME = {
  deep: "#1a1a1a",
  base: "#d4d4d4",
  hot: "#ffffff",
  spark: "#a3a3a3",
  rim: "#f5f5f5",
  core: "#050505",
} as const;

export const ORB_COLORS = ["#ffffff", "#d4d4d4", "#737373", "#a3a3a3"] as const;

export const GLOBE = {
  sphereRadius: 1.5,
  spikeScale: 0.06,
  push: 0.52,
  fitFraction: 0.11,
  falloff: 4,
  glow: 1.35,
  introDuration: 1.8,

  travelStiffness: 5,

  compactDrop: -0.15,
  compactScale: 0.82,

  idleSpin: 0.075,
  scrollYaw: 0.00006,
  yawStiffness: 3.5,
  baseTilt: -0.22,
  pointerTiltX: 0.12,
  pointerTiltY: 0.16,

  hoverRadius: 1.45,
  hoverBulge: 0.4,
  hoverSmoothing: 0.22,
  hoverSpin: 0.16,
} as const;

export const GLOBE_OUTER_RADIUS = GLOBE.sphereRadius + GLOBE.push;

export const INSTANCE_COUNT = {
  mobile: 1200,
  tablet: 2200,
  desktop: 3000,
} as const;

export const LIGHT_POSITION = new Vector3(-1, 0.8, 0.25)
  .normalize()
  .multiplyScalar(5);

export const CAMERA_FOV = 45;
const CAMERA_VIEW_HALF_HEIGHT = Math.tan((75 / 2) * (Math.PI / 180)) * 5;
export const CAMERA_DISTANCE =
  CAMERA_VIEW_HALF_HEIGHT / Math.tan((CAMERA_FOV / 2) * (Math.PI / 180));

const DIP = { x: 0, y: -0.66, scale: 1.06, presence: 1 } as const;

/** Pose used before the first measured anchor resolves. */
export const INITIAL_GLOBE_KEY: GlobeKey = {
  x: -0.46,
  y: -0.58,
  scale: 1,
  presence: 0,
};

/**
 * Stops per anchor, in document order, when the page has six
 * `[data-bg-anchor]` regions. These are the original poses, with section
 * ids removed so any page can reproduce them.
 */
export const SIX_ANCHOR_STOPS: GlobeStop[][] = [
  [{ at: 0.5, x: -0.46, y: -0.58, scale: 1.0, presence: 0 }],
  [
    { at: 0.5, x: -0.47, y: -0.32, scale: 1.1, presence: 1 },
    { at: 1, ...DIP },
  ],
  [
    { at: 0.5, x: 0.47, y: -0.3, scale: 1.0, presence: 1 },
    { at: 1, ...DIP },
  ],
  [
    { at: 0.5, x: -0.46, y: -0.34, scale: 0.63, presence: 1 },
    { at: 1, ...DIP },
  ],
  [
    { at: 0.5, x: 0.46, y: -0.31, scale: 0.56, presence: 1 },
    { at: 1, ...DIP },
  ],
  [{ at: 0.5, x: -0.47, y: -0.33, scale: 0.62, presence: 1 }],
];

const LEFT_STOPS = SIX_ANCHOR_STOPS[1];
const RIGHT_STOPS = SIX_ANCHOR_STOPS[2];
const OPENING_STOPS = SIX_ANCHOR_STOPS[0];
const CLOSING_STOPS = SIX_ANCHOR_STOPS[5];

/** Stops for one anchor. Six anchors use the original poses; any other count alternates the same left, right and dip rhythm. */
export const stopsForAnchor = (index: number, count: number): GlobeStop[] => {
  if (count === SIX_ANCHOR_STOPS.length) return SIX_ANCHOR_STOPS[index];
  if (count <= 1) return index === 0 ? OPENING_STOPS : CLOSING_STOPS;
  if (index === 0) return OPENING_STOPS;
  if (index === count - 1) return CLOSING_STOPS;
  return index % 2 === 1 ? LEFT_STOPS : RIGHT_STOPS;
};

export const TAIL_KEY: GlobeKey = { x: 0.3, y: -0.44, scale: 1.2, presence: 1 };

export const ORBITS: readonly Orbit[] = [
  { axis: [0.2, 1, 0.15], speed: 0.95, phase: 2.85, dir: 1, radius: 1.9 },
  { axis: [1, 0.25, -0.4], speed: 0.72, phase: 0.92, dir: -1, radius: 2.0 },
  { axis: [-0.35, 0.5, 1], speed: 0.54, phase: 1.43, dir: 1, radius: 1.85 },
  { axis: [0.7, -0.6, 0.5], speed: 1.18, phase: 1.85, dir: -1, radius: 1.95 },
] as const;
