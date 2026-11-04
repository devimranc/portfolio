"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useMotionCapability } from "@/hooks/use-motion-capability";
import { scrollMotionToTop } from "@/lib/motion/lenis-instance";
import { requestFluidResync, requestMotionRevealRefresh, triggerFluidRipple } from "@/lib/motion/fluid-events";
import { animatePageExit, forcePageReveal } from "@/lib/motion/page-transition";
import { prepareRouteNavigation } from "@/lib/motion/route-transition";
import { gsap, ensureGsapPlugins } from "@/lib/motion/gsap-client";
import { CLICK_PULSE_SCALE } from "@/lib/motion/constants";

function isInternalLink(anchor: HTMLAnchorElement) {
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  try {
    const url = new URL(href, window.location.href);
    return url.origin === window.location.origin;
  } catch {
    return false;
  }
}

export function PageNavigationBridge() {
  const router = useRouter();
  const { pageTransition } = useMotionCapability();
  const busy = useRef(false);

  useEffect(() => {
    if (!pageTransition) return;

    const onClick = async (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement) || !isInternalLink(anchor)) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const nextUrl = new URL(href, window.location.href);
      if (nextUrl.pathname === window.location.pathname && nextUrl.hash) return;
      if (nextUrl.pathname === window.location.pathname && !nextUrl.hash) return;

      const content = document.querySelector<HTMLElement>(".motion-page-content");
      const overlay = document.querySelector<HTMLElement>(".motion-transition-overlay");
      if (!content || !overlay || busy.current) return;

      event.preventDefault();
      busy.current = true;

      const destination = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;

      try {
        ensureGsapPlugins();
        triggerFluidRipple(event.clientX, event.clientY, 1.15);

        const pulseTarget =
          anchor.closest<HTMLElement>(".work-project-card, .home-carousel-card, [data-glass-tilt]") ??
          anchor;

        await gsap.to(pulseTarget, {
          scale: CLICK_PULSE_SCALE,
          duration: 0.1,
          ease: "power2.out",
          force3D: true,
        });

        await prepareRouteNavigation(router, destination);
        await animatePageExit(content, overlay);
        router.push(destination);
        scrollMotionToTop();
        forcePageReveal(content, overlay);
        requestAnimationFrame(() => {
          forcePageReveal(content, overlay);
          requestFluidResync();
          requestMotionRevealRefresh();
        });
      } finally {
        busy.current = false;
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pageTransition, router]);

  return null;
}
