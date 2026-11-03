"use client";

import { useRef, type FC, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ACCENT_GRADIENTS, STACK_SCALE_STEP } from "@/constants/motion";

interface StackCardProps {
  index: number;
  total: number;
  children: ReactNode;
  /** Tailwind gradient stops, e.g. `from-coral via-fuchsia to-royal`. */
  accent?: string;
}

/** Sticky card that scales and fades as the next card covers it. */
export const StackCard: FC<StackCardProps> = ({ index, total, children, accent }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 30%"],
  });
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 1 - (total - index) * STACK_SCALE_STEP]
  );
  const opacity = useTransform(scrollYProgress, [0.6, 1], [1, 0.7]);
  const wash = accent ?? ACCENT_GRADIENTS[index % ACCENT_GRADIENTS.length];

  return (
    <div ref={ref} className="sticky z-10" style={{ top: `calc(4.25rem + ${index * 0.65}rem)` }}>
      <motion.article
        style={{ scale, opacity }}
        className="relative overflow-hidden rounded-[1.6rem] border border-[#d5deea]/15 bg-[#1a2433]"
      >
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-40 ${wash}`}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(62%_80%_at_82%_48%,rgba(213,222,234,0.28),transparent_58%),radial-gradient(46%_55%_at_8%_0%,rgba(154,175,196,0.22),transparent_62%)]" />
        <div className="relative grid h-full grid-cols-1 items-center gap-6 p-6 md:p-8 lg:grid-cols-12 lg:p-9">
          {children}
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
      </motion.article>
    </div>
  );
};

export const IndexWatermark: FC<{ value: string }> = ({ value }) => (
  <span className="text-[7rem] font-black leading-none tracking-tighter text-white/10 md:text-[10rem]">
    {value}
  </span>
);

export const IconTile: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="absolute right-0 top-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-md md:h-20 md:w-20">
    {children}
  </div>
);

export const PillLabel: FC<{ children: ReactNode }> = ({ children }) => (
  <span className="w-fit rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white/60">
    {children}
  </span>
);
