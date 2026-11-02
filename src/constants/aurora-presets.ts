import { type GlowBlob } from "@/types/background-types";

/** Soft color washes taken from the original page, without section names. */
export const AURORA_PRESETS: Record<string, GlowBlob[]> = {
  royalCoral: [
    { className: "absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-royal/30 blur-[120px]" },
    { className: "absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-coral/20 blur-[140px]" },
  ],
  lavenderAqua: [
    { className: "absolute right-10 top-10 h-80 w-80 rounded-full bg-lavender/20 blur-[140px]" },
    { className: "absolute bottom-10 left-10 h-72 w-72 rounded-full bg-aqua/15 blur-[140px]" },
  ],
  contact: [
    { className: "absolute left-1/3 top-10 h-72 w-72 rounded-full bg-royal/15 blur-[140px]" },
    { className: "absolute bottom-20 right-1/4 h-64 w-64 rounded-full bg-coral/15 blur-[140px]" },
  ],
  centerLavender: [
    { className: "absolute top-1/3 left-1/2 h-72 w-[60%] -translate-x-1/2 rounded-full bg-lavender/10 blur-[140px]" },
  ],
  aquaLeft: [
    { className: "absolute top-1/3 left-1/4 h-72 w-72 rounded-full bg-aqua/10 blur-[140px]" },
  ],
  split: [
    { className: "absolute left-0 top-1/3 h-72 w-72 rounded-full bg-royal/10 blur-[140px]" },
    { className: "absolute bottom-1/3 right-0 h-80 w-80 rounded-full bg-coral/10 blur-[140px]" },
  ],
  footer: [
    { className: "absolute bottom-[-50%] left-1/2 h-72 w-[80%] -translate-x-1/2 rounded-full bg-royal/10 blur-[140px]" },
  ],
};
