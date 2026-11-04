"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";
import { gsap, ScrollTrigger, ensureGsapPlugins } from "@/lib/motion/gsap-client";
import { setLenisInstance } from "@/lib/motion/lenis-instance";
import { useMotionCapability } from "@/hooks/use-motion-capability";

export function SmoothScrollLenis() {
  const { smoothScroll } = useMotionCapability();

  useEffect(() => {
    if (!smoothScroll) return;

    ensureGsapPlugins();

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
      autoRaf: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    ScrollTrigger.defaults({ scroller: document.documentElement });

    document.documentElement.classList.add("lenis", "lenis-smooth");
    setLenisInstance(lenis);

    return () => {
      setLenisInstance(null);
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      gsap.ticker.remove(ticker);
      lenis.destroy();
      ScrollTrigger.scrollerProxy(document.documentElement, {});
      ScrollTrigger.refresh();
    };
  }, [smoothScroll]);

  return null;
}
