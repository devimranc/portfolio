"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mediaSrc } from "@/components/work/ProjectMedia";
import { categoryLabel, type MediaItem } from "@/data/portfolio";
import { projectRichText } from "@/components/work/projectRichText";
import type { GalleryFile, GalleryFolder, WorkProject } from "@/data/zain-drive";
import "@/styles/project-detail.css";

const PAGE_SIZE = 6;
const tabs = ["Models", "Videos", "References"] as const;
type TabLabel = (typeof tabs)[number];

type ListedFile = GalleryFile & { folder?: string };

function assetLabel(name: string) {
  const extension = name.includes(".") ? name.split(".").pop() : "";
  return { file: name, extension: extension?.toUpperCase() ?? "FILE" };
}

function videoType(name: string) {
  const extension = name.split(".").pop()?.toLowerCase();
  if (extension === "mp4" || extension === "m4v") return "video/mp4";
  if (extension === "webm") return "video/webm";
  if (extension === "ogg") return "video/ogg";
  if (extension === "mov") return "video/quicktime";
  if (extension === "mkv") return "video/x-matroska";
  return undefined;
}

function needsDownload(file: GalleryFile) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return file.kind !== "image" && (file.kind !== "video" || extension === "mov" || extension === "mkv");
}

function groupFor(file: GalleryFile, parents: string[]): TabLabel {
  const context = `${parents.join(" ")} ${file.name}`.toLowerCase();
  if (context.includes("reference")) return "References";
  if (file.kind === "video") return "Videos";
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (["glb", "gltf", "fbx", "obj", "blend"].includes(extension)) return "Models";
  if (context.includes("model")) return "Models";
  if (file.kind === "image") return "Models";
  return "Videos";
}

function collectTree(folder: GalleryFolder) {
  const buckets: Record<TabLabel, ListedFile[]> = { Models: [], Videos: [], References: [] };
  const seen = new Set<string>();

  function walk(node: GalleryFolder, parents: string[]) {
    for (const child of node.children) {
      if (child.type === "folder") {
        walk(child, [...parents, child.name]);
        continue;
      }
      const key = child.name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      const label = groupFor(child, parents);
      buckets[label].push({ ...child, folder: parents.length ? parents.join(" / ") : undefined });
    }
  }

  walk(folder, []);
  return buckets;
}

function collectMedia(media: MediaItem[]) {
  const buckets: Record<TabLabel, ListedFile[]> = { Models: [], Videos: [], References: [] };
  for (const item of media) {
    const name = decodeURIComponent(item.src.split("/").pop() ?? item.alt);
    const kind = item.kind === "file" ? "file" : item.kind;
    const file: ListedFile = { type: "file", name, src: item.src, kind };
    buckets[groupFor(file, [])].push(file);
  }
  return buckets;
}

function pageList(current: number, total: number) {
  if (total <= 5) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 3) return [1, 2, 3, "…", total] as const;
  if (current >= total - 2) return [1, "…", total - 2, total - 1, total] as const;
  return [1, "…", current, "…", total] as const;
}

function DownloadLink({ file, src }: { file: ListedFile; src: string }) {
  if (!needsDownload(file)) return null;
  return (
    <a className="project-download" href={src} download={file.name}>
      Download {file.name}
    </a>
  );
}

function FilePreview({ file, expanded = false }: { file: ListedFile; expanded?: boolean }) {
  const src = mediaSrc(file.src);
  const { extension } = assetLabel(file.name);

  if (file.kind === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={file.name}
        className={expanded ? "project-lightbox-media" : undefined}
        decoding="async"
      />
    );
  }
  if (file.kind === "video") {
    return (
      <>
        <video
          controls
          playsInline
          preload={expanded ? "metadata" : "none"}
          aria-label={file.name}
          className={expanded ? "project-lightbox-media" : undefined}
        >
          <source src={src} type={videoType(file.name)} />
        </video>
        <DownloadLink file={file} src={src} />
      </>
    );
  }
  if (file.kind === "audio") {
    return <audio controls preload="none" aria-label={file.name} src={src} />;
  }
  if (file.kind === "document") {
    return <iframe title={file.name} src={src} className={expanded ? "h-[70vh] w-full bg-white" : "h-full w-full bg-white"} />;
  }
  return (
    <a href={src} download={file.name}>
      {extension} · {file.name}
    </a>
  );
}

function TabIcon({ label }: { label: TabLabel }) {
  if (label === "Videos") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
        <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M4 7h10v10H4zM14 10.5l6-3v9l-6-3Z" />
      </svg>
    );
  }
  if (label === "Models") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
        <path fill="none" stroke="currentColor" strokeWidth="1.6" d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
      <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

export function ProjectGallery({ project, asset }: { project: WorkProject; asset?: string }) {
  const router = useRouter();
  const buckets = useMemo(
    () => (project.tree ? collectTree(project.tree) : collectMedia(project.media)),
    [project],
  );
  const totalFiles = tabs.reduce((total, label) => total + buckets[label].length, 0);
  const initial = tabs.find((label) => label.toLowerCase() === asset) ?? "Models";
  const [tab, setTab] = useState<TabLabel>(initial);
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState<ListedFile | null>(null);
  const portalReady = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const files = buckets[tab];
  const pageCount = Math.max(1, Math.ceil(files.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = files.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const pages = pageList(current, pageCount);
  const previewIndex = preview ? files.findIndex((file) => file.src === preview.src) : -1;
  const canStepPreview = files.length > 1 && previewIndex >= 0;

  const stepPreview = useCallback(
    (delta: number) => {
      if (!preview || files.length <= 1) return;
      const index = files.findIndex((file) => file.src === preview.src);
      if (index < 0) return;
      const nextIndex = (index + delta + files.length) % files.length;
      setPage(Math.floor(nextIndex / PAGE_SIZE) + 1);
      setPreview(files[nextIndex]);
    },
    [files, preview],
  );

  useEffect(() => {
    if (!preview) return;
    const previousOverflow = document.body.style.overflow;
    document.body.classList.add("project-lightbox-open");
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreview(null);
      if (!canStepPreview) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        stepPreview(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        stepPreview(1);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("project-lightbox-open");
      document.body.style.overflow = previousOverflow;
    };
  }, [preview, canStepPreview, stepPreview]);

  function selectTab(label: TabLabel) {
    setTab(label);
    setPage(1);
    router.replace(`/work/${project.slug}?asset=${label.toLowerCase()}`, { scroll: false });
  }

  return (
    <div className="project-page site-wrap">
      <aside className="project-sidebar">
        <div>
          <Link href="/work" className="project-back">
            <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
              <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M14 6 8 12l6 6" />
            </svg>
            Back to Work
          </Link>
          <h1>{project.title}</h1>
          <p className="project-category">{categoryLabel(project.category)}</p>
          <p className="project-count">
            {totalFiles} {totalFiles === 1 ? "file" : "files"}
          </p>
          {project.summary ? <p className="project-summary">{projectRichText(project.summary)}</p> : null}
          {project.details.map((detail) => (
            <p key={detail} className="project-detail">
              {projectRichText(detail)}
            </p>
          ))}
          <nav className="project-side-nav" aria-label="Project assets">
            {tabs.map((label) => (
              <a
                key={label}
                href={`/work/${project.slug}?asset=${label.toLowerCase()}`}
                aria-current={label === tab ? "page" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  selectTab(label);
                }}
              >
                <TabIcon label={label} />
                {label}
              </a>
            ))}
          </nav>
        </div>
        <Link href={`/work/category/${project.category}`} className="project-category-link">
          {categoryLabel(project.category)}
        </Link>
      </aside>

      <section className="project-stage">
        <div className="project-toolbar">
          <div className="project-tabs" role="tablist" aria-label="Project files">
            {tabs.map((label) => (
              <button key={label} type="button" role="tab" aria-selected={label === tab} onClick={() => selectTab(label)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="project-panel" key={`${tab}-${current}`}>
          {visible.length === 0 ? (
            <p className="project-empty">No files in this group.</p>
          ) : (
            <div className="project-grid">
              {visible.map((file) => (
                <article key={file.src} className="project-card">
                  <div className="project-card-media">
                    <FilePreview file={file} />
                  </div>
                  <button type="button" className="project-expand" aria-label={`Open ${file.name}`} onClick={() => setPreview(file)}>
                    <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5">
                      <path fill="none" stroke="currentColor" strokeWidth="1.8" d="M9 5H5v4M15 5h4v4M9 19H5v-4M15 19h4v-4" />
                    </svg>
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>

        {pageCount > 1 ? (
          <nav className="project-pages" aria-label="Gallery pages">
            <button type="button" aria-label="Previous page" disabled={current === 1} onClick={() => setPage(current - 1)}>
              <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
                <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M14 6 8 12l6 6" />
              </svg>
            </button>
            {pages.map((item, index) =>
              item === "…" ? (
                <span key={`gap-${index}`}>…</span>
              ) : (
                <button key={item} type="button" aria-current={item === current ? "page" : undefined} onClick={() => setPage(item)}>
                  {item}
                </button>
              ),
            )}
            <button type="button" aria-label="Next page" disabled={current === pageCount} onClick={() => setPage(current + 1)}>
              <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
                <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="m10 6 6 6-6 6" />
              </svg>
            </button>
          </nav>
        ) : null}
      </section>

      {preview && portalReady
        ? createPortal(
            <div
              className="project-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={preview.name}
              onClick={() => setPreview(null)}
            >
              <button
                type="button"
                className="project-lightbox-close"
                aria-label="Close preview"
                onClick={() => setPreview(null)}
              >
                <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    d="M6 6l12 12M18 6 6 18"
                  />
                </svg>
              </button>
              {canStepPreview ? (
                <>
                  <button
                    type="button"
                    className="project-lightbox-nav prev"
                    aria-label="Previous asset"
                    onClick={(event) => {
                      event.stopPropagation();
                      stepPreview(-1);
                    }}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 6 8 12l6 6"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="project-lightbox-nav next"
                    aria-label="Next asset"
                    onClick={(event) => {
                      event.stopPropagation();
                      stepPreview(1);
                    }}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m10 6 6 6-6 6"
                      />
                    </svg>
                  </button>
                </>
              ) : null}
              <div className="project-lightbox-viewport" onClick={(event) => event.stopPropagation()}>
                <FilePreview key={preview.src} file={preview} expanded />
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
