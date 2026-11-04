"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function ensureGsapPlugins() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ immediateRender: false });
  ScrollTrigger.defaults({ immediateRender: false });
  registered = true;
}

export { gsap, ScrollTrigger };
