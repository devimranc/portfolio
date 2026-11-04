"use client";

import { REVEAL_STAGGER, SPLIT_HEADING_STAGGER } from "@/lib/motion/constants";
import { gsap, ScrollTrigger, ensureGsapPlugins } from "@/lib/motion/gsap-client";

const REVEAL_FROM = { y: 50, opacity: 0, force3D: true };
const REVEAL_TO = {
  y: 0,
  opacity: 1,
  duration: 0.85,
  ease: "power3.out",
  force3D: true,
  immediateRender: false,
};

const CARD_ENTER_FROM = {
  y: 70,
  opacity: 0,
  rotateX: 10,
  z: -48,
  force3D: true,
};

const CARD_ENTER_TO = {
  y: 0,
  opacity: 1,
  rotateX: 0,
  z: 0,
  duration: 0.9,
  ease: "power3.out",
  force3D: true,
  immediateRender: false,
};

const REVEAL_SELECTOR = [
  "[data-reveal]",
  ".reveal-scroll",
  ".work-rise",
  "[data-motion-root] h1",
  "[data-motion-root] h2",
  "[data-motion-root] h3",
  "[data-motion-root] h4",
  "[data-motion-root] p",
  "[data-motion-root] li",
  "[data-motion-root] article",
  "[data-motion-root] .glass-strong",
].join(",");

const GLASS_CARD_SELECTOR =
  "[data-glass-tilt]:not([data-stack-card]), .work-project-card, .home-expertise-card, .service-card";

const SCROLL_TRIGGER = { immediateRender: false };

const SPLIT_CHAR_FROM = { y: 20, opacity: 0, force3D: true };
const SPLIT_CHAR_TO = {
  y: 0,
  opacity: 1,
  duration: 0.72,
  ease: "power3.out",
  force3D: true,
  immediateRender: false,
};

const SPLIT_HEADING_SELECTOR = "[data-split-heading]";

function splitText(el: HTMLElement, mode: "chars" | "words") {
  if (el.dataset.motionSplit === "done") return;
  const source = el.textContent?.trim() ?? "";
  if (!source) return;

  el.textContent = "";
  el.dataset.motionSplit = "done";
  el.style.overflow = "hidden";

  const units =
    mode === "words"
      ? source.split(/(\s+)/).filter(Boolean)
      : [...source];

  units.forEach((unit) => {
    const wrap = document.createElement("span");
    wrap.className = "motion-split-unit";
    wrap.style.display = "inline-block";
    wrap.style.willChange = "transform, opacity";
    if (/^\s+$/.test(unit)) {
      wrap.innerHTML = "\u00a0".repeat(unit.length);
      wrap.classList.add("motion-split-space");
    } else {
      wrap.textContent = unit;
    }
    el.appendChild(wrap);
  });
}

function isInsideStaggerGroup(node: Element) {
  return Boolean(node.closest("[data-reveal-stagger]"));
}

function isHeroLoadReveal(node: Element) {
  return node.classList.contains("reveal") && Boolean(node.closest(".home-landing"));
}

function isSplitHeading(node: Element) {
  return node.matches(SPLIT_HEADING_SELECTOR) || Boolean(node.closest(SPLIT_HEADING_SELECTOR));
}

function bindSplitHeadingReveals(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>(SPLIT_HEADING_SELECTOR).forEach((el) => {
    splitText(el, "chars");
    const units = el.querySelectorAll(".motion-split-unit");
    if (!units.length) return;

    gsap.fromTo(units, SPLIT_CHAR_FROM, {
      ...SPLIT_CHAR_TO,
      stagger: SPLIT_HEADING_STAGGER,
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none reverse",
        ...SCROLL_TRIGGER,
      },
    });
  });
}

function isolateMediaSurfaces(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("[data-fluid], .work-card-media, .work-project-media").forEach((el) => {
    el.style.backfaceVisibility = "hidden";
    el.style.transformStyle = "flat";
  });
}

function bindDepthLayers(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>(GLASS_CARD_SELECTOR).forEach((card) => {
    if (card.closest("[data-stack-card]") || card.matches("[data-stack-card]")) return;
    const meta = card.querySelector<HTMLElement>(".work-project-meta");
    if (meta) {
      meta.style.transformStyle = "preserve-3d";
    }

    gsap.set(card, { transformPerspective: 1100, immediateRender: false });

    const layers = card.querySelectorAll<HTMLElement>("[data-depth-layer]");
    layers.forEach((layer) => {
      const depth = Number(layer.dataset.depthLayer ?? "1") * 22;
      layer.style.willChange = "transform";
      gsap.fromTo(
        layer,
        { z: 0, force3D: true },
        {
          z: depth,
          ease: "none",
          force3D: true,
          immediateRender: false,
          scrollTrigger: {
            trigger: card,
            start: "top 92%",
            end: "center 55%",
            scrub: 0.65,
            ...SCROLL_TRIGGER,
          },
        },
      );
    });

    if (meta && !meta.querySelector("[data-depth-layer]")) {
      const tags = meta.querySelectorAll<HTMLElement>("p, h2, h3, .work-project-arrow");
      tags.forEach((tag, index) => {
        tag.dataset.depthLayer = String(index + 1);
        const depth = (index + 1) * 20;
        tag.style.willChange = "transform";
        gsap.fromTo(
          tag,
          { z: 0, force3D: true },
          {
            z: depth,
            ease: "none",
            force3D: true,
            immediateRender: false,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              end: "center 50%",
              scrub: 0.55,
              ...SCROLL_TRIGGER,
            },
          },
        );
      });
    }
  });
}

function bindGlassCardEntrance(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>(GLASS_CARD_SELECTOR).forEach((card) => {
    if (card.closest("[data-reveal-stagger]")) return;
    if (card.closest("[data-stack-card]") || card.matches("[data-stack-card]")) return;

    gsap.fromTo(card, CARD_ENTER_FROM, {
      ...CARD_ENTER_TO,
      scrollTrigger: {
        trigger: card,
        start: "top 88%",
        toggleActions: "play none none reverse",
        ...SCROLL_TRIGGER,
      },
    });
  });
}

function bindStaggerDetails(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("[data-reveal-stagger]").forEach((group) => {
    const children = gsap.utils.toArray<HTMLElement>(group.children);
    if (!children.length) return;

    children.forEach((child) => {
      const details = gsap.utils
        .toArray<HTMLElement>(
          child.querySelectorAll("p, h2, h3, [data-depth-layer], .work-project-meta > *"),
        )
        .filter((el) => !el.matches(SPLIT_HEADING_SELECTOR));
      if (!details.length) return;

      gsap.fromTo(
        details,
        { y: 18, opacity: 0, z: 0, force3D: true },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: "power3.out",
          stagger: REVEAL_STAGGER,
          force3D: true,
          immediateRender: false,
          scrollTrigger: {
            trigger: child,
            start: "top 86%",
            toggleActions: "play none none reverse",
            ...SCROLL_TRIGGER,
          },
        },
      );
    });
  });
}

function isHomeIntroPending(root: HTMLElement) {
  return Boolean(root.querySelector(".home-landing:not(.home-ready)"));
}

export function createScrollRevealContext(root: HTMLElement) {
  ensureGsapPlugins();
  isolateMediaSurfaces(root);

  return gsap.context(() => {
    if (isHomeIntroPending(root)) return;

    root.querySelectorAll<HTMLElement>("[data-reveal-split]").forEach((el) => {
      const mode = el.dataset.revealSplit === "words" ? "words" : "chars";
      splitText(el, mode);
      const units = el.querySelectorAll(".motion-split-unit");
      gsap.fromTo(units, REVEAL_FROM, {
        ...REVEAL_TO,
        stagger: REVEAL_STAGGER,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none reverse",
          ...SCROLL_TRIGGER,
        },
      });
    });

    root.querySelectorAll<HTMLElement>("[data-reveal-stagger]").forEach((group) => {
      const children = gsap.utils.toArray<HTMLElement>(group.children);
      if (!children.length) return;

      gsap.fromTo(children, CARD_ENTER_FROM, {
        ...CARD_ENTER_TO,
        stagger: REVEAL_STAGGER,
        scrollTrigger: {
          trigger: group,
          start: "top 85%",
          toggleActions: "play none none reverse",
          ...SCROLL_TRIGGER,
        },
      });
    });

    bindSplitHeadingReveals(root);
    bindStaggerDetails(root);
    bindGlassCardEntrance(root);
    bindDepthLayers(root);

    const nodes = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(REVEAL_SELECTOR));
    nodes.forEach((node) => {
      if (isInsideStaggerGroup(node)) return;
      if (isHeroLoadReveal(node)) return;
      if (isSplitHeading(node)) return;
      if (node.dataset.revealSplit !== undefined) return;
      if (node.matches(GLASS_CARD_SELECTOR)) return;

      gsap.fromTo(node, REVEAL_FROM, {
        ...REVEAL_TO,
        scrollTrigger: {
          trigger: node,
          start: "top 90%",
          toggleActions: "play none none reverse",
          ...SCROLL_TRIGGER,
        },
      });
    });

    root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
      if (el.classList.contains("home-hero") || el.closest(".hero-character-slot")) return;
      const depth = Number(el.dataset.parallax ?? "0.12");
      gsap.fromTo(
        el,
        { yPercent: 0, force3D: true },
        {
          yPercent: depth * -100,
          ease: "none",
          force3D: true,
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            ...SCROLL_TRIGGER,
          },
        },
      );
    });

    ScrollTrigger.refresh();
  }, root);
}
