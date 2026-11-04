"use client";

import type Lenis from "lenis";

let lenisRef: Lenis | null = null;
let scrollLockDepth = 0;

export function setLenisInstance(instance: Lenis | null) {
  lenisRef = instance;
}

export function lockMotionScroll() {
  scrollLockDepth += 1;
  if (scrollLockDepth > 1) return;

  lenisRef?.stop();
  document.documentElement.classList.add("lenis-stopped");
  document.body.classList.add("motion-scroll-locked");
}

export function unlockMotionScroll() {
  scrollLockDepth = Math.max(0, scrollLockDepth - 1);
  if (scrollLockDepth > 0) return;

  document.body.classList.remove("motion-scroll-locked");
  document.documentElement.classList.remove("lenis-stopped");
  lenisRef?.start();
}

export function scrollMotionToTop() {
  if (lenisRef) {
    lenisRef.scrollTo(0, { immediate: true });
    return;
  }
  window.scrollTo({ top: 0, behavior: "auto" });
}
