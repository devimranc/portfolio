"use client";

import { useEffect, useRef, type RefObject } from "react";
import {
  INITIAL_GLOBE_KEY,
  stopsForAnchor,
  TAIL_KEY,
} from "@/constants/globe-constants";
import { catmullRom, clamp01 } from "@/lib/math-helpers";
import { type GlobeKey } from "@/types/globe-types";

/**
 * Scroll-linked globe pose. Anchors are any elements matching `anchorSelector`
 * (default `[data-bg-anchor]`), in document order. With six anchors the poses
 * match the original page. With none, the same poses are spread across the
 * document scroll height.
 */
export const useGlobePath = (
  snap: RefObject<boolean>,
  anchorSelector = "[data-bg-anchor]"
): RefObject<GlobeKey> => {
  const target = useRef<GlobeKey>({ ...INITIAL_GLOBE_KEY });

  useEffect(() => {
    let anchors: { at: number; key: GlobeKey }[] = [];
    let lastFocus = -Infinity;

    const resolve = () => {
      if (!anchors.length) return;
      const out = target.current;

      if (anchors.length === 1) {
        Object.assign(out, anchors[0].key);
        return;
      }

      const focus = window.scrollY + window.innerHeight / 2;

      if (Math.abs(focus - lastFocus) > window.innerHeight * 1.2) {
        snap.current = true;
      }
      lastFocus = focus;

      let i = 0;
      while (i < anchors.length - 2 && focus >= anchors[i + 1].at) i++;

      const a = anchors[i];
      const b = anchors[i + 1];
      const t = clamp01((focus - a.at) / Math.max(1, b.at - a.at));

      const p0 = (anchors[i - 1] ?? a).key;
      const p3 = (anchors[i + 2] ?? b).key;

      out.x = catmullRom(p0.x, a.key.x, b.key.x, p3.x, t);
      out.y = catmullRom(p0.y, a.key.y, b.key.y, p3.y, t);
      out.scale = Math.max(
        0.05,
        catmullRom(p0.scale, a.key.scale, b.key.scale, p3.scale, t)
      );
      out.presence = clamp01(
        catmullRom(p0.presence, a.key.presence, b.key.presence, p3.presence, t)
      );
    };

    const measure = () => {
      const elements = Array.from(document.querySelectorAll(anchorSelector));
      const placed: { at: number; key: GlobeKey }[] = [];

      if (elements.length > 0) {
        elements.forEach((element, index) => {
          const rect = element.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          for (const stop of stopsForAnchor(index, elements.length)) {
            const { at, ...key } = stop;
            placed.push({ at: top + rect.height * at, key });
          }
        });
      } else {
        const scrollable = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight
        );
        const sequence = [0, 1, 2, 3, 4, 5].flatMap((index) =>
          stopsForAnchor(index, 6)
        );
        sequence.forEach((stop, index) => {
          const { at, ...key } = stop;
          const span = sequence.length + 1;
          placed.push({
            at: scrollable * ((index + at) / span),
            key,
          });
        });
      }

      placed.push({
        at: document.documentElement.scrollHeight - window.innerHeight / 2,
        key: TAIL_KEY,
      });

      placed.sort((first, second) => first.at - second.at);
      anchors = placed.filter(
        (anchor, index) => index === 0 || anchor.at > placed[index - 1].at
      );

      resolve();
    };

    measure();
    window.addEventListener("scroll", resolve, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);

    return () => {
      window.removeEventListener("scroll", resolve);
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, [snap, anchorSelector]);

  return target;
};
