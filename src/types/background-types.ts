import { type HTMLAttributes } from "react";

export interface ParticlesProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

export interface ThemedGlobeProps {
  className?: string;
  /** Elements that drive the globe path. Defaults to `[data-bg-anchor]`. */
  anchorSelector?: string;
}

export interface GlowBlob {
  className: string;
}
