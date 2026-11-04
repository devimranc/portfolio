"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
import { forcePageReveal } from "@/lib/motion/page-transition";
import { requestFluidResync, requestMotionRevealRefresh } from "@/lib/motion/fluid-events";

export function PageTransitionShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstPaint = useRef(true);

  useLayoutEffect(() => {
    document.body.classList.remove("project-lightbox-open");
    const content = contentRef.current;
    const overlay = overlayRef.current;
    if (content && overlay) forcePageReveal(content, overlay);
  }, []);

  useEffect(() => {
    const onPageShow = () => {
      document.body.classList.remove("project-lightbox-open");
      const content = contentRef.current;
      const overlay = overlayRef.current;
      if (content && overlay) forcePageReveal(content, overlay);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  useLayoutEffect(() => {
    const content = contentRef.current;
    const overlay = overlayRef.current;
    if (!content || !overlay) return;
    forcePageReveal(content, overlay);
  }, [pathname]);

  useEffect(() => {
    if (firstPaint.current) {
      firstPaint.current = false;
      return;
    }
    requestFluidResync();
    requestMotionRevealRefresh();
  }, [pathname]);

  return (
    <>
      <div ref={overlayRef} className="motion-transition-overlay is-idle" aria-hidden />
      <div ref={contentRef} className="motion-page-content" data-motion-page>
        {children}
      </div>
    </>
  );
}
