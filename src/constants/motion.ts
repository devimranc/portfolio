import { type Transition } from "motion/react";

export const ACCENT_GRADIENTS = [
  "from-[#3a4d68] via-[#2a3b52] to-[#1e2c40]",
  "from-[#44586f] via-[#2e4158] to-[#243246]",
  "from-[#364a62] via-[#2c3d54] to-[#1c2a3c]",
  "from-[#4a5d74] via-[#314458] to-[#222f42]",
] as const;

export const STACK_SCALE_STEP = 0.05;

export const TILT_SPRING: Transition = { stiffness: 200, damping: 18 };
