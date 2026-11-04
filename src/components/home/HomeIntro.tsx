"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { requestMotionRevealRefresh } from "@/lib/motion/fluid-events";

const INTRO_STORAGE_KEY = "home-intro-complete";

function readIntroComplete() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(INTRO_STORAGE_KEY) === "1";
}

export function HomeIntro({ children }: { children: React.ReactNode }) {
  const [introReady, setIntroReady] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useLayoutEffect(() => {
    if (readIntroComplete()) {
      setIntroReady(true);
      setShowLoader(false);
      requestAnimationFrame(() => requestMotionRevealRefresh());
    }
  }, []);

  useEffect(() => {
    if (!introReady) return;

    const nodes = document.querySelectorAll(".home-landing .reveal-scroll");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.18 },
    );
    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [introReady]);

  function handleIntroReveal() {
    setIntroReady(true);
    sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    requestAnimationFrame(() => requestMotionRevealRefresh());
  }

  function handleIntroDone() {
    setShowLoader(false);
    requestMotionRevealRefresh();
  }

  return (
    <>
      {showLoader ? (
        <LoadingScreen onReveal={handleIntroReveal} onDone={handleIntroDone} />
      ) : null}
      <div className={`home-landing${introReady ? " home-ready" : ""}`}>{children}</div>
    </>
  );
}
