"use client";

import { useRef, type FC, type ReactNode } from "react";
import { motion, useInView } from "motion/react";
import { fadeInUp } from "@/animations/scroll-animations";

export const GlassCard: FC<{ children: ReactNode; className?: string; delay?: number }> = ({
  children,
  className = "p-6 md:p-7",
  delay = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      data-glass-tilt
      className={`glass gradient-border ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const InfoRow: FC<{
  href?: string;
  icon: ReactNode;
  iconClassName?: string;
  children: ReactNode;
}> = ({ href, icon, iconClassName = "from-[#8ea3ba] to-[#4d647e]", children }) => {
  const className = "glass gradient-border flex items-center gap-4 p-4";
  const body = (
    <>
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-lg ${iconClassName}`}>
        {icon}
      </div>
      <div className="overflow-hidden">{children}</div>
    </>
  );

  return href ? (
    <a href={href} className={`${className} group transition-colors hover:bg-white/[0.06]`}>
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  );
};
