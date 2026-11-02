"use client";

import { type FC } from "react";
import { useInViewOnce } from "@/hooks/use-in-view-once";
import { Particles } from "./particles";
import { type ParticlesProps } from "@/types/background-types";

/**
 * Particle canvas that mounts once its host scrolls near the viewport.
 * Fill any `relative` region; it does not know which section it is in.
 */
export const ParticleLayer: FC<ParticlesProps> = ({
  quantity = 120,
  ease = 80,
  color = "#ffffff",
  refresh = true,
  className,
  ...props
}) => {
  const [particlesRef, particlesInView] = useInViewOnce<HTMLDivElement>();

  return (
    <div ref={particlesRef} className="absolute inset-0 -z-10">
      {particlesInView && (
        <Particles
          className={className ?? "absolute inset-0"}
          quantity={quantity}
          ease={ease}
          color={color}
          refresh={refresh}
          {...props}
        />
      )}
    </div>
  );
};
