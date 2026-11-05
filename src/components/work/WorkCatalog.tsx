"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ContactButton } from "@/components/contact/ContactProvider";
import { ProjectMedia } from "@/components/work/ProjectMedia";
import { categories, categoryLabel, isCategoryId, type CategoryId, type MediaItem } from "@/data/portfolio";
import { requestMotionRevealRefresh } from "@/lib/motion/fluid-events";

export type WorkCardData = {
  slug: string;
  title: string;
  category: CategoryId;
  cover: MediaItem | null;
};

const PAGE_SIZE = 12;

type MainIcon = "grid" | "cube" | "run" | "boxes" | "mountain" | "vr" | "box" | "building";

const mainCategories: { id: CategoryId; label: string; icon: MainIcon; match: CategoryId[] }[] = [
  { id: "game-character", label: "3D Animation", icon: "cube", match: ["game-character"] },
  { id: "character-showcase", label: "Character Animation", icon: "run", match: ["character-showcase"] },
  {
    id: "character-modeling-rigging",
    label: "Modeling & Rigging",
    icon: "boxes",
    match: ["character-modeling-rigging"],
  },
  { id: "unreal-vr", label: "Unreal Engine", icon: "mountain", match: ["unreal-vr"] },
  { id: "vr-project", label: "VR / Real-Time", icon: "vr", match: ["vr-project"] },
  {
    id: "product-animation-views",
    label: "Product Visualization",
    icon: "box",
    match: ["product-animation-views"],
  },
  {
    id: "architecture",
    label: "Architectural Viz",
    icon: "building",
    match: ["architecture-showcase", "architecture"],
  },
];

const mainBarIds = new Set(mainCategories.map((item) => item.id));

type MoreEntry = {
  id: CategoryId;
  label: string;
  match: CategoryId[];
};

const moreCategories: MoreEntry[] = categories
  .filter(
    (item) =>
      !mainCategories.some((main) => main.match.includes(item.id)) && item.id !== "ai-assisted",
  )
  .flatMap((item): MoreEntry[] => {
    if (item.id === "ai-video") {
      return [{ id: "ai-video", label: "AI-Assisted Video & Animation", match: ["ai-assisted", "ai-video"] }];
    }
    return [{ id: item.id, label: item.label, match: [item.id] }];
  });

const allSelectOptions: { value: "all" | CategoryId; label: string; match: CategoryId[] | null }[] = [
  { value: "all", label: "All Projects", match: null },
  ...mainCategories.map((item) => ({ value: item.id, label: item.label, match: item.match })),
  ...moreCategories.map((item) => ({ value: item.id, label: item.label, match: item.match })),
];

function resolveActiveCategory(category: "all" | CategoryId): "all" | CategoryId {
  if (category === "all") return "all";
  if (category === "ai-assisted") return "ai-video";
  const main = mainCategories.find((item) => item.match.includes(category));
  if (main) return main.id;
  const more = moreCategories.find((item) => item.match.includes(category));
  return more?.id ?? category;
}

function projectsForCategory(projects: WorkCardData[], active: "all" | CategoryId) {
  if (active === "all") return projects;
  const option = allSelectOptions.find((item) => item.value === active);
  if (!option?.match) return projects;
  const allowed = new Set(option.match);
  return projects.filter((project) => allowed.has(project.category));
}

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
  medical: "Medical",
};

function pageList(current: number, total: number) {
  if (total <= 5) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 3) return [1, 2, 3, "…", total] as const;
  if (current >= total - 2) return [1, "…", total - 2, total - 1, total] as const;
  return [1, "…", current, "…", total] as const;
}

function FilterIcon({ name }: { name: MainIcon }) {
  const common = { viewBox: "0 0 24 24", "aria-hidden": true as const, className: "work-filter-icon" };
  if (name === "grid") {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="6.5" height="6.5" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    );
  }
  if (name === "cube") {
    return (
      <svg {...common}>
        <path d="M12 3.5 5 7.2v9.6L12 20.5l7-3.7V7.2L12 3.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M12 12.2 5 8.4M12 12.2l7-3.8M12 12.2v8.3" fill="none" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    );
  }
  if (name === "run") {
    return (
      <svg {...common}>
        <circle cx="14" cy="5" r="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8 21l2.2-5.2 3.2.4 2.2-3.2-2.4-1.2-2.6 1.4-1.8-2.4 3.6-1.6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "boxes") {
    return (
      <svg {...common}>
        <path d="M8 4.5 4 6.6v7.2L8 16l4-2.2V6.6L8 4.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M16 8.2 12 10.3v7.2L16 19.7l4-2.2v-7.2L16 8.2Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "mountain") {
    return (
      <svg {...common}>
        <path d="M3.5 18.5 9 8.5l3.2 5.2 2.2-3.2L20.5 18.5H3.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "vr") {
    return (
      <svg {...common}>
        <path d="M4 9.5h16v5.8a2 2 0 0 1-2 2h-2.6l-2.2-2.4h-2.4L8.6 17.3H6a2 2 0 0 1-2-2V9.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M8.2 12.4h2.2M13.6 12.4h2.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "building") {
    return (
      <svg {...common}>
        <path d="M5.5 19.5V8.8L12 5.2l6.5 3.6v10.7H5.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M9.2 19.5v-4.2h5.6v4.2M9.4 10.8h.01M12 10.8h.01M14.6 10.8h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M4 8.2 12 4.5l8 3.7v8.2L12 20l-8-3.6V8.2Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M12 12.2 4.4 8.6M12 12.2 19.6 8.6M12 12.2V20" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
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

export function WorkCatalog({
  projects,
  category,
}: {
  projects: WorkCardData[];
  category: "all" | CategoryId;
}) {
  const router = useRouter();
  const moreRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number; minWidth: number } | null>(null);
  const [page, setPage] = useState(1);

  const activeCategory = resolveActiveCategory(category);
  const isMoreActive = activeCategory !== "all" && !mainBarIds.has(activeCategory);
  const filterKey = activeCategory;

  const filtered = useMemo(
    () => projectsForCategory(projects, activeCategory),
    [activeCategory, projects],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const pages = pageList(current, pageCount);

  const updateMenuPosition = useCallback(() => {
    const button = moreButtonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 8,
      left: rect.right,
      minWidth: Math.max(rect.width, 15 * 16),
    });
  }, []);

  function selectCategory(id: "all" | CategoryId) {
    setPage(1);
    setMoreOpen(false);
    router.replace(id === "all" ? "/work" : `/work?category=${id}`, { scroll: false });
  }

  useEffect(() => {
    setPage(1);
  }, [filterKey]);

  useLayoutEffect(() => {
    if (!moreOpen) {
      setMenuPosition(null);
      return;
    }
    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [moreOpen, updateMenuPosition]);

  useEffect(() => {
    if (!moreOpen) return;
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (moreRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setMoreOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMoreOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [moreOpen]);

  useEffect(() => {
    requestMotionRevealRefresh();
  }, [filterKey, current]);

  return (
    <div className="work-page" data-motion-root>
      <section className="work-hero site-wrap">
        <div className="work-hero-copy">
          <p className="work-kicker work-rise">Work</p>
          <h1 className="work-rise">
            Creative <span>Showcase</span>
          </h1>
          <p className="work-lead work-rise">
            A curated collection of my work across 3D animation, motion design, visualization, and real-time experiences.
          </p>
        </div>
      </section>

      <section className="site-wrap work-catalog">
        <label className="work-filter-mobile">
          Categories
          <select
            value={activeCategory}
            aria-label="Filter projects by category"
            onChange={(event) => {
              const value = event.target.value;
              selectCategory(value === "all" || isCategoryId(value) ? value : "all");
            }}
          >
            {allSelectOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <div className="work-filter-shell">
          <div className="work-filter-bar" role="toolbar" aria-label="Filter projects">
            <div className="work-filter-track">
              <button
                type="button"
                className="work-filter-pill"
                aria-pressed={activeCategory === "all"}
                onClick={() => selectCategory("all")}
              >
                <FilterIcon name="grid" />
                <span className="work-filter-label">All Projects</span>
              </button>
              {mainCategories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="work-filter-pill"
                  aria-pressed={activeCategory === item.id}
                  onClick={() => selectCategory(item.id)}
                >
                  <FilterIcon name={item.icon} />
                  <span className="work-filter-label">{item.label}</span>
                </button>
              ))}
              <div className="work-filter-more" ref={moreRef}>
                <button
                  ref={moreButtonRef}
                  type="button"
                  className="work-filter-pill work-filter-pill-more"
                  aria-expanded={moreOpen}
                  aria-haspopup="menu"
                  aria-controls="work-filter-more-menu"
                  aria-label={
                    isMoreActive
                      ? `More categories, filtered by ${categoryLabel(activeCategory)}`
                      : "More categories"
                  }
                  title={isMoreActive ? categoryLabel(activeCategory) : undefined}
                  onClick={() => setMoreOpen((open) => !open)}
                >
                  <span className="work-filter-label">More</span>
                  <svg viewBox="0 0 24 24" aria-hidden className={`work-filter-chevron${moreOpen ? " is-open" : ""}`}>
                    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {moreOpen && menuPosition && typeof document !== "undefined"
          ? createPortal(
              <div
                id="work-filter-more-menu"
                ref={menuRef}
                className="work-filter-menu"
                role="menu"
                style={{
                  position: "fixed",
                  top: menuPosition.top,
                  left: menuPosition.left,
                  minWidth: menuPosition.minWidth,
                  transform: "translateX(-100%)",
                }}
              >
                {moreCategories.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="menuitem"
                    aria-current={activeCategory === item.id ? "true" : undefined}
                    onClick={() => selectCategory(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>,
              document.body,
            )
          : null}

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
