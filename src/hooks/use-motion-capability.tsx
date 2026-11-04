"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type MotionTier = "full" | "lite" | "static";

type MotionCapability = {
  tier: MotionTier;
  smoothScroll: boolean;
  scrollReveal: boolean;
  fluidWebGL: boolean;
  pageTransition: boolean;
};

const MotionCapabilityContext = createContext<MotionCapability>({
  tier: "static",
  smoothScroll: false,
  scrollReveal: false,
  fluidWebGL: false,
  pageTransition: false,
});

const SOFTWARE_RENDERER =
  /swiftshader|llvmpipe|softpipe|software|basic render|mesa offscreen/i;

function probeWebGL(): boolean {
  if (typeof window === "undefined") return false;
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
  if (!gl) return false;

  const debug = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = debug
    ? String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL))
    : "";

  gl.getExtension("WEBGL_lose_context")?.loseContext();
  return renderer ? !SOFTWARE_RENDERER.test(renderer) : true;
}

function computeTier(): MotionTier {
  if (typeof window === "undefined") return "static";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return "static";

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.matchMedia("(max-width: 767px)").matches;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } })
    .connection?.saveData;

  if (coarse || narrow || saveData) return "lite";

  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;

  if (cores < 4 || memory < 4 || !probeWebGL()) return "lite";

  return "full";
}

function tierToCapability(tier: MotionTier): MotionCapability {
  if (tier === "static") {
    return {
      tier,
      smoothScroll: false,
      scrollReveal: false,
      fluidWebGL: false,
      pageTransition: false,
    };
  }
  if (tier === "lite") {
    return {
      tier,
      smoothScroll: true,
      scrollReveal: true,
      fluidWebGL: false,
      pageTransition: true,
    };
  }
  return {
    tier,
    smoothScroll: true,
    scrollReveal: true,
    fluidWebGL: true,
    pageTransition: true,
  };
}

export function MotionCapabilityProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<MotionTier>("static");

  useEffect(() => {
    const sync = () => {
      const next = computeTier();
      setTier(next);
      document.documentElement.dataset.motionTier = next;
      document.documentElement.classList.toggle("motion-enhanced", next !== "static");
      document.documentElement.classList.toggle("motion-full", next === "full");
    };

    sync();

    const queries = [
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(pointer: coarse)"),
      window.matchMedia("(max-width: 767px)"),
    ];

    queries.forEach((mq) => mq.addEventListener("change", sync));
    window.addEventListener("resize", sync, { passive: true });

    return () => {
      queries.forEach((mq) => mq.removeEventListener("change", sync));
      window.removeEventListener("resize", sync);
    };
  }, []);

  const value = useMemo(() => tierToCapability(tier), [tier]);

  return (
    <MotionCapabilityContext.Provider value={value}>{children}</MotionCapabilityContext.Provider>
  );
}

export function useMotionCapability() {
  return useContext(MotionCapabilityContext);
}
