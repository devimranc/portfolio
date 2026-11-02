import { type Vector3 } from "three";

export interface GlobeKey {
  x: number;
  y: number;
  scale: number;
  presence: number;
}

export interface GlobeStop extends GlobeKey {
  /** Fraction along the anchor element, or along the document when no anchors exist. */
  at: number;
}

export interface GlobeSceneProps {
  count: number;
  paused: boolean;
  compact: boolean;
  anchorSelector: string;
}

export interface Orbit {
  readonly axis: readonly [number, number, number];
  readonly speed: number;
  readonly phase: number;
  readonly dir: number;
  readonly radius: number;
}

export interface PlaneBasis {
  u: Vector3;
  v: Vector3;
}
