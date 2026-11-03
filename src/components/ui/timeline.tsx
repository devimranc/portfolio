"use client";

import { useEffect, useRef, useState, type FC, type ReactNode } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";

export const TimelineItem: FC<{ index: number; marker: ReactNode; body: ReactNode }> = ({
  index,
  marker,
  body,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const inView = useInView(itemRef, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.05, ease: "easeOut" }}
      className="home-expertise-row flex items-center justify-start pt-2 md:gap-8 md:pt-2.5"
    >
      <div className="sticky top-28 z-40 flex max-w-[15rem] flex-col items-center self-center md:w-64 md:max-w-none md:flex-row">
        <div className="absolute -left-[11px] flex h-6 w-6 items-center justify-center rounded-full bg-[#102033]">
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.05 + 0.2 }}
            className="h-2.5 w-2.5 rounded-full border border-white/30 bg-[#d5deea] shadow-[0_0_12px_rgba(186,214,230,0.45)]"
          />
        </div>
        <div className="hidden md:block md:pl-10">{marker}</div>
      </div>
      <div className="relative min-w-0 flex-1 pl-12 pr-1 md:pl-2">
        <div className="mb-4 md:hidden">{marker}</div>
        {body}
      </div>
    </motion.div>
  );
};

export const TimelineRail: FC<{ children: ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) setHeight(ref.current.getBoundingClientRect().height);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });
  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div ref={containerRef}>
      <div ref={ref} className="relative mt-6 pb-6">
        {children}
        <div
          style={{ height: `${height}px` }}
          className="absolute left-1 top-0 w-[2px] overflow-hidden bg-gradient-to-b from-transparent from-[0%] via-neutral-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-[#9aafc4] via-[#7d93ab]/50 to-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export const BulletLine: FC<{ children: ReactNode; index: number; itemIndex: number }> = ({
  children,
  index,
  itemIndex,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.p
      ref={ref}
      initial={{ opacity: 0, x: 20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: itemIndex * 0.05 + 0.25 + index * 0.08 }}
      className="flex gap-3 font-normal text-neutral-400"
    >
      <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-[#9aafc4]" />
      <span>{children}</span>
    </motion.p>
  );
};
