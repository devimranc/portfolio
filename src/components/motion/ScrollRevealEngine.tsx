"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useMotionCapability } from "@/hooks/use-motion-capability";
import { ScrollTrigger, ensureGsapPlugins } from "@/lib/motion/gsap-client";
import { MOTION_REVEAL_REFRESH } from "@/lib/motion/fluid-events";
import { createScrollRevealContext } from "@/lib/motion/scroll-reveal";

export function ScrollRevealEngine() {
  const pathname = usePathname();
  const { scrollReveal } = useMotionCapability();
  const contextRef = useRef<ReturnType<typeof createScrollRevealContext> | null>(null);

  const mountReveal = useCallback(() => {
    ensureGsapPlugins();
    contextRef.current?.revert();
    contextRef.current = null;

    if (!scrollReveal) return;

    const root = document.querySelector<HTMLElement>("[data-motion-page]");
    if (!root) return;

    contextRef.current = createScrollRevealContext(root);
  }, [scrollReveal]);

  useEffect(() => {
    mountReveal();

    const onRefresh = () => ScrollTrigger.refresh();
    const onRevealRefresh = () => {
      mountReveal();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", onRefresh, { passive: true });
    window.addEventListener(MOTION_REVEAL_REFRESH, onRevealRefresh);

    return () => {
      window.removeEventListener("resize", onRefresh);
      window.removeEventListener(MOTION_REVEAL_REFRESH, onRevealRefresh);
      contextRef.current?.revert();
      contextRef.current = null;
    };
  }, [pathname, scrollReveal, mountReveal]);

  return null;
}
