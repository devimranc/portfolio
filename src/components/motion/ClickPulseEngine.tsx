"use client";

import { useEffect } from "react";
import { useMotionCapability } from "@/hooks/use-motion-capability";
import { CLICK_PULSE_SCALE } from "@/lib/motion/constants";
import { triggerFluidRipple } from "@/lib/motion/fluid-events";
import { gsap, ensureGsapPlugins } from "@/lib/motion/gsap-client";

const PULSE_SELECTOR = "[data-pulse], button.btn-primary, button.btn-ghost, button.service-arrow";

export function ClickPulseEngine() {
  const { pageTransition } = useMotionCapability();

  useEffect(() => {
    if (!pageTransition) return;
    ensureGsapPlugins();

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const target = event.target;
      if (!(target instanceof Element)) return;

      const pulseEl = target.closest<HTMLElement>(PULSE_SELECTOR);
      if (!pulseEl) return;

      triggerFluidRipple(event.clientX, event.clientY, 0.85);

      gsap.fromTo(
        pulseEl,
        { scale: 1, force3D: true },
        {
          scale: CLICK_PULSE_SCALE,
          duration: 0.12,
          ease: "power2.out",
          force3D: true,
          yoyo: true,
          repeat: 1,
        },
      );
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [pageTransition]);

  return null;
}
