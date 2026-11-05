"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { requestMotionRevealRefresh } from "@/lib/motion/fluid-events";

const INTRO_STORAGE_KEY = "home-intro-complete";

type IntroState = {
  introReady: boolean;
  reveal: () => void;
  finish: () => void;
};

const IntroContext = createContext<IntroState | null>(null);

function readIntroComplete() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(INTRO_STORAGE_KEY) === "1";
}

export function HomeIntroFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [introReady, setIntroReady] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useLayoutEffect(() => {
    if (!isHome || readIntroComplete()) {
      setIntroReady(true);
      setShowLoader(false);
      if (isHome) requestAnimationFrame(() => requestMotionRevealRefresh());
    }
  }, [isHome]);

  function reveal() {
    setIntroReady(true);
    sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    requestAnimationFrame(() => requestMotionRevealRefresh());
  }

  function finish() {
    setShowLoader(false);
    requestMotionRevealRefresh();
  }

  return (
    <IntroContext.Provider value={{ introReady, reveal, finish }}>
      {children}
      {isHome && showLoader ? <LoadingScreen onReveal={reveal} onDone={finish} /> : null}
    </IntroContext.Provider>
  );
}

export function HomeIntro({ children }: { children: React.ReactNode }) {
  const intro = useContext(IntroContext);
  const introReady = intro?.introReady ?? true;

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

  return <div className={`home-landing${introReady ? " home-ready" : ""}`}>{children}</div>;
}
