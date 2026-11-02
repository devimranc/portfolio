"use client";

import { useRef, type FC } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { AURORA_PRESETS } from "@/constants/aurora-presets";
import { type GlowBlob } from "@/types/background-types";

interface ScrollAuroraProps {
  /** Named wash from `AURORA_PRESETS`, or pass `blobs` directly. */
  preset?: keyof typeof AURORA_PRESETS | string;
  blobs?: GlowBlob[];
  /** Vertical travel across the host element as it scrolls through the viewport. */
  travel?: [string, string];
  opacity?: [number, number, number];
}

/**
 * Scroll-linked color wash. Place it inside any `relative` region.
 * It measures that region, not a named page section.
 */
export const ScrollAurora: FC<ScrollAuroraProps> = ({
  preset = "royalCoral",
  blobs,
  travel = ["-12%", "12%"],
  opacity = [0.25, 0.65, 0.25],
}) => {
  const regionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: regionRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], travel);
  const fade = useTransform(scrollYProgress, [0, 0.5, 1], opacity);
  const layers = blobs ?? AURORA_PRESETS[preset] ?? AURORA_PRESETS.royalCoral;

  return (
    <motion.div
      ref={regionRef}
      aria-hidden
      style={{ y, opacity: fade }}
      className="pointer-events-none absolute inset-0 -z-10"
    >
      {layers.map((blob) => (
        <div key={blob.className} className={blob.className} />
      ))}
    </motion.div>
  );
};
