"use client";

import { REVEAL_STAGGER } from "@/lib/motion/constants";
import { gsap, ensureGsapPlugins } from "@/lib/motion/gsap-client";

const OVERLAY_WIPE_IN = {
  clipPath: "inset(0 0% 0 0)",
  opacity: 1,
  duration: 0.42,
  ease: "power3.inOut",
  force3D: true,
};

const OVERLAY_WIPE_OUT = {
  clipPath: "inset(0 0 0 100%)",
  opacity: 0,
  duration: 0.52,
  ease: "power3.inOut",
  force3D: true,
};

/** Keep page visible; light scale + translucent sheet wipe only. */
export async function animatePageExit(content: HTMLElement, overlay: HTMLElement) {
  ensureGsapPlugins();

  overlay.classList.remove("is-idle");
  gsap.set(overlay, {
    clipPath: "inset(0 100% 0 0)",
    opacity: 0,
    visibility: "visible",
    immediateRender: false,
  });

  const timeline = gsap.timeline({ defaults: { immediateRender: false } });

  timeline.to(
    content,
    {
      scale: 0.985,
      opacity: 1,
      duration: 0.38,
      ease: "power2.inOut",
      force3D: true,
    },
    0,
  );

  timeline.fromTo(
    overlay,
    { clipPath: "inset(0 100% 0 0)", opacity: 0 },
    OVERLAY_WIPE_IN,
    0.02,
  );

  await timeline.then();
}

export function forcePageReveal(content: HTMLElement, overlay: HTMLElement) {
  ensureGsapPlugins();
  gsap.killTweensOf([content, overlay]);
  gsap.set(content, {
    opacity: 1,
    scale: 1,
    rotationY: 0,
    z: 0,
    clearProps: "filter,transform",
    force3D: true,
  });
  gsap.set(overlay, {
    clipPath: "inset(0 100% 0 0)",
    opacity: 0,
    visibility: "hidden",
    clearProps: "filter,transform",
  });
  overlay.classList.add("is-idle");
}

export function revealRouteSurface(content: HTMLElement, overlay: HTMLElement) {
  forcePageReveal(content, overlay);
}

export async function animatePageEnter(content: HTMLElement, overlay: HTMLElement) {
  ensureGsapPlugins();

  gsap.set(content, {
    opacity: 1,
    scale: 1.015,
    rotationY: 0,
    z: 0,
    force3D: true,
    immediateRender: false,
  });

  overlay.classList.remove("is-idle");
  gsap.set(overlay, {
    clipPath: "inset(0 0% 0 0)",
    opacity: 1,
    visibility: "visible",
    immediateRender: false,
  });

  const timeline = gsap.timeline({ defaults: { immediateRender: false } });

  timeline.to(overlay, OVERLAY_WIPE_OUT, 0);

  timeline.to(
    content,
    {
      scale: 1,
      opacity: 1,
      duration: 0.58,
      ease: "power3.out",
      force3D: true,
    },
    0.04,
  );

  const revealTargets = content.querySelectorAll<HTMLElement>(
    "[data-reveal], .reveal-scroll, .work-rise, [data-motion-root] h1, [data-motion-root] h2",
  );

  if (revealTargets.length) {
    timeline.fromTo(
      revealTargets,
      { y: 28, opacity: 0, force3D: true },
      {
        y: 0,
        opacity: 1,
        duration: 0.62,
        stagger: REVEAL_STAGGER,
        ease: "power3.out",
        force3D: true,
        immediateRender: false,
      },
      "-=0.38",
    );
  }

  try {
    await timeline.then();
  } finally {
    forcePageReveal(content, overlay);
  }
}
