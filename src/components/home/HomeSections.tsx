"use client";

import { useState } from "react";
import Link from "next/link";
import { ProjectMedia } from "@/components/work/ProjectMedia";
import { categoryLabel, services, type CategoryId, type Project } from "@/data/portfolio";
import { formatCounter } from "@/lib/format";
import {
  PillLabel,
  StackCard,
  TiltFrame,
  TimelineItem,
  TimelineRail,
} from "@/components/ui";

const homeCategoryLabel: Partial<Record<CategoryId, string>> = {
  "character-modeling": "3D Character Modeling",
  "vr-project": "VR Project",
  "motion-2d": "3D Animation & Motion Design",
  metahuman: "MetaHuman & 3D Assets",
  "product-animation": "Product Animation",
  architecture: "Architectural Viz",
  "ai-video": "AI Video & Animation",
  "ai-assisted": "AI Video & Animation",
  "character-modeling-rigging": "3D Modeling & Character",
};

function labelFor(id: CategoryId) {
  return homeCategoryLabel[id] ?? categoryLabel(id);
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="h-3.5 w-3.5">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const practiceLinks: { href: string; label: string; icon: "cube" | "user" | "vr" | "screen" | "building" | "spark" }[] = [
  { href: "/work/category/character-modeling", label: "3D Modeling & Rigging", icon: "cube" },
  { href: "/work/category/metahuman", label: "MetaHuman & 3D Assets", icon: "user" },
  { href: "/work/category/vr-project", label: "VR Project", icon: "vr" },
  { href: "/work/category/product-animation", label: "Product Animation", icon: "screen" },
  { href: "/work/category/architecture", label: "Architectural Viz", icon: "building" },
  { href: "/work/category/ai-video", label: "AI Video & Animation", icon: "spark" },
];

function PracticeIcon({ icon }: { icon: (typeof practiceLinks)[number]["icon"] }) {
  const common = { viewBox: "0 0 24 24", "aria-hidden": true as const, className: "home-chip-icon" };
  if (icon === "cube") {
    return (
      <svg {...common}>
        <path d="M12 3.2 4.8 7.2 12 11.2l7.2-4L12 3.2Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M4.8 7.2V16.8L12 20.8l7.2-4V7.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M12 11.2v9.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (icon === "user") {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="3.1" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M5.6 19.2c.8-3.1 3.1-4.6 6.4-4.6s5.6 1.5 6.4 4.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  if (icon === "vr") {
    return (
      <svg {...common}>
        <path d="M3.5 9.5h17v6.2a2 2 0 0 1-2 2h-3.1L13.2 15h-2.4l-2.2 2.7H5.5a2 2 0 0 1-2-2V9.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M8 12.2h2.2M13.8 12.2H16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  if (icon === "screen") {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="16" height="16" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10.2 8.8v6.4l5.2-3.2-5.2-3.2Z" fill="currentColor" />
      </svg>
    );
  }
  if (icon === "building") {
    return (
      <svg {...common}>
        <path d="M4.5 20.5V8.2L12 4l7.5 4.2v12.3H4.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M9 20.5v-4.2h6v4.2M9.2 10.2h.01M12 10.2h.01M14.8 10.2h.01M9.2 13.4h.01M12 13.4h.01M14.8 13.4h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M12 3.2 13.2 9l5.6.2-4.4 3.4 1.5 5.4L12 14.8 8.1 18l1.5-5.4L5.2 9.2 10.8 9 12 3.2Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function WorkStack({ projects }: { projects: Project[] }) {
  return (
    <div className="work-stack">
      {projects.map((project, index) => {
        const cover = project.media[0];
        return (
          <StackCard key={project.slug} index={index} total={projects.length}>
            <div className="flex flex-col justify-center lg:col-span-5">
              <PillLabel>{labelFor(project.category)}</PillLabel>
              <h3
                data-split-heading
                className="mt-4 text-[1.7rem] font-semibold capitalize leading-tight tracking-tight text-white md:text-[2rem]"
              >
                {project.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65">{project.summary}</p>
              <p className="mt-5 text-xs tracking-[0.18em] text-white/40">
                {formatCounter(index, projects.length)}
              </p>
              <Link href={`/work/${project.slug}`} className="btn-primary mt-5 w-fit">
                View project
                <Arrow />
              </Link>
            </div>
            <div className="lg:col-span-7">
              <TiltFrame data-fluid className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[#1a2433] shadow-2xl shadow-[#0e1624]/40">
                {cover ? (
                  <ProjectMedia item={cover} cover />
                ) : (
                  <div className="flex h-full items-end p-6 text-sm text-white/70">
                    Visuals withheld
                  </div>
                )}
              </TiltFrame>
            </div>
          </StackCard>
        );
      })}
    </div>
  );
}

export function ProjectStrip({ projects }: { projects: Project[] }) {
  const [index, setIndex] = useState(0);
  const total = projects.length;
  if (!total) return null;

  const windowSize = Math.max(total, 5);
  const slides = Array.from({ length: windowSize }, (_, offset) => projects[(index + offset) % total]);

  return (
    <div className="home-carousel">
      <button
        type="button"
        className="home-carousel-arrow prev"
        aria-label="Previous projects"
        onClick={() => setIndex((current) => (current - 1 + total) % total)}
      >
        <Arrow />
      </button>
      <div className="home-carousel-window">
        <div className="home-carousel-track">
          {slides.map((project, offset) => {
            const cover = project.media[0];
            return (
              <Link
                key={`${project.slug}-${offset}`}
                href={`/work/${project.slug}`}
                className="home-carousel-card"
              >
                <div className="home-carousel-media" data-fluid>
                  {cover ? <ProjectMedia item={cover} cover /> : null}
                </div>
                <p>{labelFor(project.category)}</p>
                <h3>{project.title}</h3>
              </Link>
            );
          })}
        </div>
      </div>
      <button
        type="button"
        className="home-carousel-arrow next"
        aria-label="Next projects"
        onClick={() => setIndex((current) => (current + 1) % total)}
      >
        <Arrow />
      </button>
      <div className="home-carousel-dots" role="tablist" aria-label="Selected work pages">
        {projects.map((project, dot) => (
          <button
            key={project.slug}
            type="button"
            aria-label={`Show ${project.title}`}
            aria-current={dot === index}
            onClick={() => setIndex(dot)}
          />
        ))}
      </div>
    </div>
  );
}

export function PracticeMarquee() {
  return (
    <div className="site-wrap py-1">
      <div className="home-chip-bar">
        {practiceLinks.map((item) => (
          <Link key={item.href} href={item.href} className="home-chip">
            <PracticeIcon icon={item.icon} />
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ServicesTimeline() {
  return (
    <div className="home-expertise">
      <TimelineRail>
        {services.map((service, index) => (
          <TimelineItem
            key={service.id}
            index={index}
            marker={<h3 className="home-expertise-title">{service.title}</h3>}
            body={
              <article className="home-expertise-card" data-glass-tilt>
                <p>{service.body}</p>
              </article>
            }
          />
        ))}
      </TimelineRail>
    </div>
  );
}
