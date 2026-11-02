"use client";

import { type FC, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { TILT_RANGE, TILT_SPRING } from "@/constants/motion";

interface TiltFrameProps {
  children: ReactNode;
  /** Lifted overlay (badges, actions). Rendered in front of the media. */
  chrome?: ReactNode;
  className?: string;
}

/** Pointer-tilt media frame with depth layers for badges. */
export const TiltFrame: FC<TiltFrameProps> = ({ children, chrome, className }) => {
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(pointerY, [0, 1], TILT_RANGE.x), TILT_SPRING);
  const rotateY = useSpring(useTransform(pointerX, [0, 1], TILT_RANGE.y), TILT_SPRING);

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width);
    pointerY.set((event.clientY - bounds.top) / bounds.height);
  };

  return (
    <div style={{ perspective: "1400px" }} className="relative">
      <motion.div
        onMouseMove={handleMove}
        onMouseLeave={() => {
          pointerX.set(0.5);
          pointerY.set(0.5);
        }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={
          className ??
          "relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-[#243246] shadow-2xl shadow-[#0e1624]/40 md:aspect-[16/10]"
        }
      >
        {children}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_45%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(12,20,32,0.28),transparent_45%)]" />
        {chrome}
        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
      </motion.div>
    </div>
  );
};

export const LiveDot: FC = () => (
  <span className="relative flex h-1.5 w-1.5">
    <span className="absolute inset-0 animate-ping rounded-full bg-[#b7c6d6] opacity-75" />
    <span className="relative h-1.5 w-1.5 rounded-full bg-[#d5deea]" />
  </span>
);

export const MEDIA_BADGE =
  "rounded-full border border-white/15 bg-[#1a2433]/70 px-3 py-1 text-[10px] uppercase tracking-[0.3em] backdrop-blur-md";
