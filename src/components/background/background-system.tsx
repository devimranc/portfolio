"use client";

import { type FC, type ReactNode } from "react";
import { GlobeLayer } from "./globe/globe-layer";

interface BackgroundSystemProps {
  children?: ReactNode;
  /**
   * CSS selector for regions the globe travels between.
   * Defaults to `[data-bg-anchor]`. With six of those regions, in document
   * order, the path matches the original page. With none, the same poses are
   * spread across the document.
   */
  anchorSelector?: string;
  /** Fixed WebGL globe. The painted poster is used until the device is ready. */
  globe?: boolean;
}

/**
 * Fixed backdrop plus your own page. Content stays in normal flow at z-10.
 * Drop parallax, aurora, particles and the hero WebGL scene into whatever
 * regions you want — they are not tied to this portfolio's sections.
 */
export const BackgroundSystem: FC<BackgroundSystemProps> = ({
  children,
  anchorSelector = "[data-bg-anchor]",
  globe = true,
}) => (
  <div className="landing-background relative min-h-screen w-full">
    {globe && <GlobeLayer anchorSelector={anchorSelector} />}
    <div className="relative z-10 w-full">{children}</div>
  </div>
);
