"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "@/styles/loading.css";

const roles = ["3D Animator", "Motion Designer"];

export function LoadingScreen({
  onReveal,
  onDone,
}: {
  onReveal?: () => void;
  onDone?: () => void;
}) {
  const [percent, setPercent] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);
  const opened = useRef(false);

  useEffect(() => {
    let value = 0;
    let timer = 0;
    let rush = 0;
    timer = window.setInterval(() => {
      if (value <= 50) {
        value += Math.round(Math.random() * 5);
        setPercent(value);
      } else {
        window.clearInterval(timer);
        timer = window.setInterval(() => {
          value += Math.round(Math.random());
          setPercent(Math.min(value, 92));
          if (value > 91) window.clearInterval(timer);
        }, 80);
      }
    }, 100);

    const finish = window.setTimeout(() => {
      window.clearInterval(timer);
      rush = window.setInterval(() => {
        value = Math.min(100, value + 1);
        setPercent(value);
        if (value >= 100) window.clearInterval(rush);
      }, 16);
    }, 1600);

    return () => {
      window.clearInterval(timer);
      window.clearInterval(rush);
      window.clearTimeout(finish);
    };
  }, []);

  useEffect(() => {
    if (percent < 100 || opened.current) return;
    opened.current = true;
    const welcome = window.setTimeout(() => setLoaded(true), 600);
    const ready = window.setTimeout(() => setClicked(true), 1600);
    return () => {
      window.clearTimeout(welcome);
      window.clearTimeout(ready);
    };
  }, [percent]);

  useEffect(() => {
    if (!clicked) return;
    onReveal?.();
    if (!onDone) return;
    const reveal = window.setTimeout(onDone, 480);
    return () => window.clearTimeout(reveal);
  }, [clicked, onDone, onReveal]);

  useEffect(() => {
    if (!onDone) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [onDone]);

  function handleMouseMove(event: React.MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
  }

  return (
    <div className="reference-loader">
      <div className="loading-header">
        <Link href="/" className="loader-title">
          IC
        </Link>
        <div className={`loaderGame ${clicked ? "loader-out" : ""}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {Array.from({ length: 27 }, (_, index) => (
                <div className="loaderGame-line" key={index} />
              ))}
            </div>
            <div className="loaderGame-ball" />
          </div>
        </div>
      </div>
      <div className="loading-screen">
        <div className="loading-marquee">
          <div className="loading-marquee-track">
            {[...roles, ...roles, ...roles, ...roles].map((role, index) => (
              <span key={`${role}-${index}`}>{role}</span>
            ))}
          </div>
        </div>
        <div
          className={`loading-wrap ${clicked ? "loading-clicked" : ""}`}
          onMouseMove={handleMouseMove}
        >
          <div className="loading-hover" />
          <div className={`loading-button ${loaded ? "loading-complete" : ""}`}>
            <div className="loading-container">
              <div className="loading-content">
                <div className="loading-content-in">
                  Loading <span>{percent}%</span>
                </div>
              </div>
              <div className="loading-box" />
            </div>
            <div className="loading-content2">
              <span>Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
