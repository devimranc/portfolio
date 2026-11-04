"use client";

export const FLUID_RIPPLE_EVENT = "motion:fluid-ripple";

export type FluidRippleDetail = {
  x: number;
  y: number;
  strength?: number;
};

export function triggerFluidRipple(x: number, y: number, strength = 1) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<FluidRippleDetail>(FLUID_RIPPLE_EVENT, {
      detail: { x, y, strength },
    }),
  );
}

export const MOTION_REVEAL_REFRESH = "motion:reveal-refresh";
export const FLUID_RESYNC_EVENT = "motion:fluid-resync";

export function requestMotionRevealRefresh() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(MOTION_REVEAL_REFRESH));
}

export function requestFluidResync() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(FLUID_RESYNC_EVENT));
}
