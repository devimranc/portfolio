"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ContactButton } from "@/components/contact/ContactProvider";
import { ProjectMedia } from "@/components/work/ProjectMedia";
import { categoryLabel, type CategoryId, type MediaItem } from "@/data/portfolio";
import { requestMotionRevealRefresh } from "@/lib/motion/fluid-events";

export type WorkCardData = {
  slug: string;
  title: string;
  category: CategoryId;
  cover: MediaItem | null;
};

const PAGE_SIZE = 12;

const filters: { id: string; label: string; categories: CategoryId[] | null }[] = [
  { id: "all", label: "All Projects", categories: null },
  {
    id: "animation",
    label: "3D Animation",
    categories: ["game-character", "character-showcase", "motion-2d"],
  },
  {
    id: "character",
    label: "Character & Rigging",
    categories: ["character-modeling-rigging", "character-modeling", "character-rigging"],
  },
  {
    id: "product",
    label: "Product Visualization",
    categories: ["product-animation-views", "product-modeling", "product-animation"],
  },
  {
    id: "architecture",
    label: "Architectural Viz",
    categories: ["architecture-showcase", "architecture"],
  },
  { id: "vr", label: "VR / Unreal", categories: ["vr-project", "unreal-vr"] },
  { id: "ai", label: "AI Video", categories: ["ai-assisted", "ai-video"] },
  { id: "metahuman", label: "MetaHuman", categories: ["metahuman"] },
];

const shortLabel: Partial<Record<CategoryId, string>> = {
  "game-character": "3D Animation",
  "character-showcase": "Character Animation",
  "character-modeling-rigging": "Character & Rigging",
  metahuman: "MetaHuman",
  "vr-project": "VR Project",
  "product-animation-views": "Product Visualization",
  "architecture-showcase": "Architectural Viz",
  "ai-assisted": "AI Video",
  "character-modeling": "Character Modeling",
  "character-rigging": "Character & Rigging",
  "product-modeling": "Product Visualization",
  "product-animation": "Product Visualization",
  "unreal-vr": "VR / Unreal",
  architecture: "Architectural Viz",
  "ai-video": "AI Video",
  "motion-2d": "3D Animation",
};

function pageList(current: number, total: number) {
  if (total <= 5) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 3) return [1, 2, 3, "…", total] as const;
  if (current >= total - 2) return [1, "…", total - 2, total - 1, total] as const;
  return [1, "…", current, "…", total] as const;
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14M13 6l6 6-6 6"
      />
    </svg>
  );
}

export function WorkCatalog({ projects }: { projects: WorkCardData[] }) {
  const [filterId, setFilterId] = useState("all");
  const [page, setPage] = useState(1);

  const activeFilter = filters.find((item) => item.id === filterId) ?? filters[0];

  const filtered = useMemo(() => {
    if (!activeFilter.categories) return projects;
    const allowed = new Set(activeFilter.categories);
    return projects.filter((project) => allowed.has(project.category));
  }, [activeFilter, projects]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const pages = pageList(current, pageCount);

  function selectFilter(id: string) {
    setFilterId(id);
    setPage(1);
  }

  useEffect(() => {
    requestMotionRevealRefresh();
  }, [filterId, current]);

  return (
    <div className="work-page" data-motion-root>
      <section className="work-hero site-wrap">
        <div className="work-hero-copy">
          <p className="work-kicker work-rise">Work</p>
          <h1 className="work-rise">
            Creative <span>Showcase</span>
          </h1>
          
        </div>
      </section>

      <section className="site-wrap work-catalog">
        <div className="work-filters" role="toolbar" aria-label="Filter projects">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              className="work-filter"
              aria-pressed={item.id === filterId}
              onClick={() => selectFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="work-empty">No projects in this category yet.</p>
        ) : (
          <div className="work-grid" data-reveal-stagger>
            {visible.map((project, index) => (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                className="work-project-card"
                data-glass-tilt
              >
                <div className="work-project-media" data-fluid data-media-tilt>
                  {project.cover ? (
                    <div className="work-card-media">
                      <ProjectMedia item={project.cover} cover priority={index < 3 && current === 1} />
                    </div>
                  ) : (
                    <div className="work-project-fallback">Visuals withheld</div>
                  )}
                </div>
                <div className="work-project-meta">
                  <div>
                    <p>{shortLabel[project.category] ?? categoryLabel(project.category)}</p>
                    <h2 data-split-heading>{project.title}</h2>
                  </div>
                  <span className="work-project-arrow" aria-hidden>
                    <Arrow />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {pageCount > 1 ? (
          <nav className="work-pages" aria-label="Project pages">
            <button type="button" aria-label="Previous page" disabled={current === 1} onClick={() => setPage(current - 1)}>
              <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
                <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M14 6 8 12l6 6" />
              </svg>
            </button>
            {pages.map((item, index) =>
              item === "…" ? (
                <span key={`gap-${index}`} className="work-page-gap">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  aria-current={item === current ? "page" : undefined}
                  onClick={() => setPage(item)}
                >
                  {item}
                </button>
              ),
            )}
            <button
              type="button"
              aria-label="Next page"
              disabled={current === pageCount}
              onClick={() => setPage(current + 1)}
            >
              <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
                <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="m10 6 6 6-6 6" />
              </svg>
            </button>
          </nav>
        ) : null}

        <section className="work-cta">
          <div className="work-cta-copy">
            <h2>Have a project in mind?</h2>
            <p>Let&apos;s bring your idea to life with 3D, animation, and visual storytelling.</p>
            <ContactButton className="btn-primary">
              Get in Touch
              <Arrow />
            </ContactButton>
          </div>
          <div className="work-orb work-orb-cta" aria-hidden />
        </section>
      </section>
    </div>
  );
}
