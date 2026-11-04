"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useMotionCapability } from "@/hooks/use-motion-capability";
import { gsap, ensureGsapPlugins } from "@/lib/motion/gsap-client";

const GLOW_SELECTOR = "[data-glass-tilt], .work-project-card, .home-expertise-card, .service-card";
const MEDIA_TILT_SELECTOR = "[data-media-tilt]";

const MEDIA_TILT_MAX = { x: 5, y: 7 };

function bindCardGlow(card: HTMLElement, cleanups: (() => void)[]) {
  if (card.closest("[data-stack-card]")) return;

  if (!card.querySelector(".glass-tilt-glow")) {
    const glow = document.createElement("div");
    glow.className = "glass-tilt-glow";
    glow.setAttribute("aria-hidden", "true");
    card.prepend(glow);
  }

  const onMove = (event: PointerEvent) => {
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    card.style.setProperty("--glass-glow-x", `${px * 100}%`);
    card.style.setProperty("--glass-glow-y", `${py * 100}%`);

    card.querySelectorAll<HTMLElement>("[data-fluid]").forEach((fluid) => {
      const fluidRect = fluid.getBoundingClientRect();
      const fx = (event.clientX - fluidRect.left) / fluidRect.width;
      const fy = (event.clientY - fluidRect.top) / fluidRect.height;
      fluid.style.setProperty("--fluid-glow-x", `${fx * 100}%`);
      fluid.style.setProperty("--fluid-glow-y", `${fy * 100}%`);
    });
  };

  const onLeave = () => {
    card.style.setProperty("--glass-glow-x", "50%");
    card.style.setProperty("--glass-glow-y", "50%");
  };

  card.addEventListener("pointermove", onMove);
  card.addEventListener("pointerleave", onLeave);
  cleanups.push(() => {
    card.removeEventListener("pointermove", onMove);
    card.removeEventListener("pointerleave", onLeave);
  });
}

function bindMediaTilt(media: HTMLElement, cleanups: (() => void)[]) {
  if (media.closest("[data-tilt-frame-root]")) return;

  media.style.transformStyle = "preserve-3d";
  media.style.transform = "translate3d(0, 0, 0)";
  media.style.willChange = "transform";

  const onMove = (event: PointerEvent) => {
    const rect = media.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * MEDIA_TILT_MAX.y * 2;
    const rotateX = (0.5 - py) * MEDIA_TILT_MAX.x * 2;

    gsap.to(media, {
      rotateX,
      rotateY,
      duration: 0.45,
      ease: "power2.out",
      transformPerspective: 1100,
      force3D: true,
    });

    media.style.setProperty("--fluid-glow-x", `${px * 100}%`);
    media.style.setProperty("--fluid-glow-y", `${py * 100}%`);
  };

  const onLeave = () => {
    gsap.to(media, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.65,
      ease: "power3.out",
      force3D: true,
    });
    media.style.setProperty("--fluid-glow-x", "50%");
    media.style.setProperty("--fluid-glow-y", "50%");
  };

  media.addEventListener("pointermove", onMove);
  media.addEventListener("pointerleave", onLeave);
  cleanups.push(() => {
    media.removeEventListener("pointermove", onMove);
    media.removeEventListener("pointerleave", onLeave);
    gsap.set(media, { clearProps: "rotateX,rotateY" });
  });
}

export function GlassTiltEngine() {
  const pathname = usePathname();
  const { scrollReveal } = useMotionCapability();

  useEffect(() => {
    if (!scrollReveal) return;
    ensureGsapPlugins();

    const cleanups: (() => void)[] = [];

    document.querySelectorAll<HTMLElement>(GLOW_SELECTOR).forEach((card) => {
      bindCardGlow(card, cleanups);
    });

    document.querySelectorAll<HTMLElement>(MEDIA_TILT_SELECTOR).forEach((media) => {
      bindMediaTilt(media, cleanups);
    });

    return () => cleanups.forEach((fn) => fn());
  }, [pathname, scrollReveal]);

  return null;
}
