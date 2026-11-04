import { type Transition } from "motion/react";

export const ACCENT_GRADIENTS = [
  "from-[#3a4d68] via-[#2a3b52] to-[#1e2c40]",
  "from-[#44586f] via-[#2e4158] to-[#243246]",
  "from-[#364a62] via-[#2c3d54] to-[#1c2a3c]",
  "from-[#4a5d74] via-[#314458] to-[#222f42]",
] as const;

export const STACK_SCALE_STEP = 0.05;
export const STACK_SCROLL_VH = 88;
export const STACK_OFFSET_REM = 1.25;

export const TILT_SPRING: Transition = { stiffness: 200, damping: 18 };
export const TILT_RANGE = {
  x: [10, -10] as [number, number],
  y: [-14, 14] as [number, number],
};
export const TRACK_SPRING: Transition = { stiffness: 60, damping: 20 };

export const MARQUEE = {
  forward: "[--duration:35s] [--gap:1rem]",
  reverse: "[--duration:40s] [--gap:1rem] mt-3",
  reviews: "[--duration:32s] [--gap:1rem]",
  reviewsReverse: "[--duration:38s] [--gap:1rem]",
} as const;
