"use client";

import { useEffect, useState } from "react";
import { LoadingScreen } from "@/components/loading/LoadingScreen";

export function HomeIntro({ children }: { children: React.ReactNode }) {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (showLoading) return;

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
  }, [showLoading]);

  return (
    <>
      {showLoading ? <LoadingScreen onDone={() => setShowLoading(false)} /> : null}
      <div className={showLoading ? "home-landing" : "home-landing home-ready"}>
        {children}
      </div>
    </>
  );
}
