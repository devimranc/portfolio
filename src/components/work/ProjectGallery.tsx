import Link from "next/link";
import { mediaSrc } from "@/components/work/ProjectMedia";
import { categoryLabel } from "@/data/portfolio";
import type { GalleryFile, GalleryFolder, WorkProject } from "@/data/zain-drive";

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

function GalleryAsset({ file }: { file: GalleryFile }) {
  const src = mediaSrc(file.src);
  const { extension } = assetLabel(file.name);
  const download = needsDownload(file) ? (
    <a href={src} download={file.name} className="mt-3 inline-block text-sm text-[#d5deea] underline-offset-4 hover:underline">
      Download {file.name}
    </a>
  ) : null;

  if (file.kind === "image") {
    return (
      <figure className="work-tile">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={file.name} className="block h-auto w-full" loading="lazy" />
      </figure>
    );
  }

  if (file.kind === "video") {
    return (
      <figure className="work-tile bg-black">
        <video className="block h-auto w-full bg-black" controls playsInline preload="none" aria-label={file.name}>
          <source src={src} type={videoType(file.name)} />
        </video>
        {download ? <figcaption className="px-3 pb-3">{download}</figcaption> : null}
      </figure>
    );
  }

  if (file.kind === "audio") {
    return (
      <figure className="work-tile bg-[#1a2433] p-5">
        <figcaption className="text-sm leading-snug text-[#f4f6f8]">{file.name}</figcaption>
        <audio className="mt-4 w-full" controls preload="none" aria-label={file.name} src={src} />
        {download}
      </figure>
    );
  }

  if (file.kind === "document") {
    return (
      <figure className="work-tile work-tile-span bg-[#1a2433] p-5">
        <figcaption className="text-sm leading-snug text-[#f4f6f8]">{file.name}</figcaption>
        <iframe title={file.name} src={src} className="mt-4 h-[36rem] w-full bg-white" />
        {download}
      </figure>
    );
  }

  return (
    <figure className="work-tile">
      <a href={src} download={file.name} className="flex min-h-40 flex-col justify-between bg-[#1a2433] p-5 text-[#f4f6f8]">
        <span className="text-xs tracking-[0.16em] text-[#d5deea]">{extension}</span>
        <span className="mt-6 text-sm leading-snug">{file.name}</span>
      </a>
    </figure>
  );
}

function fileCount(folder: GalleryFolder): number {
  return folder.children.reduce((total, child) => {
    if (child.type === "file") return total + 1;
    return total + fileCount(child);
  }, 0);
}

function FolderGallery({ folder, depth }: { folder: GalleryFolder; depth: number }) {
  const folders = folder.children.filter((child): child is GalleryFolder => child.type === "folder");
  const files = folder.children.filter((child): child is GalleryFile => child.type === "file");

  return (
    <section className={depth > 1 ? "ml-3 border-l border-white/10 pl-3" : undefined}>
      {depth > 0 ? <h2 className="px-2 pt-6 pb-2 text-sm font-medium text-[#f4f6f8]">{folder.name}</h2> : null}
      {folders.map((child) => (
        <FolderGallery key={child.name} folder={child} depth={depth + 1} />
      ))}
      {files.length > 0 ? (
        <div className="work-masonry">
          {files.map((file) => (
            <GalleryAsset key={file.src} file={file} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

type GallerySection = {
  id: string;
  label: string;
  folder?: GalleryFolder;
  file?: GalleryFile;
};

const groupedLabels = ["Videos", "Models", "References"] as const;
type GroupedLabel = (typeof groupedLabels)[number];

function groupFor(file: GalleryFile, parents: string[]): GroupedLabel {
  const context = `${parents.join(" ")} ${file.name}`.toLowerCase();
  if (context.includes("reference")) return "References";
  if (file.kind === "video") return "Videos";
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (["glb", "gltf", "fbx", "obj", "blend"].includes(extension)) return "Models";
  if (context.includes("model")) return "Models";
  if (file.kind === "image") return "Models";
  return "Videos";
}

function professionalSections(folder: GalleryFolder): GallerySection[] {
  const buckets: Record<GroupedLabel, GalleryFile[]> = { Videos: [], Models: [], References: [] };
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
      buckets[groupFor(child, parents)].push(child);
    }
  }

  walk(folder, []);

  return groupedLabels
    .filter((label) => buckets[label].length > 0)
    .map((label) => ({
      id: label.toLowerCase(),
      label,
      folder: { type: "folder", name: label, children: buckets[label] },
    }));
}

function gallerySections(folder: GalleryFolder, category: string): GallerySection[] {
  if (category === "game-character") return professionalSections(folder);
  return folder.children.map((child, index) => {
    if (child.type === "folder") {
      return { id: `${index}-${child.name}`, label: child.name, folder: child };
    }
    return { id: child.src, label: child.name, file: child };
  });
}

function FlatGallery({ project }: { project: WorkProject }) {
  return (
    <div className="work-masonry px-1 pb-6 sm:px-2 lg:py-2">
      {project.media.map((item, index) => {
        const name = decodeURIComponent(item.src.split("/").pop() ?? item.alt);
        const { extension } = assetLabel(name);
        if (item.kind === "image") {
          return (
            <figure key={item.src} className="work-tile work-rise" style={{ animationDelay: `${index * 40}ms` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mediaSrc(item.src)} alt={item.alt} className="block h-auto w-full" loading={index < 4 ? "eager" : "lazy"} />
            </figure>
          );
        }
        if (item.kind === "video") {
          return (
            <figure key={item.src} className="work-tile work-rise" style={{ animationDelay: `${index * 40}ms` }}>
              <video className="block h-auto w-full bg-black" controls playsInline preload="metadata" aria-label={item.alt}>
                <source src={mediaSrc(item.src)} />
              </video>
            </figure>
          );
        }
        return (
          <figure key={item.src} className="work-tile work-rise" style={{ animationDelay: `${index * 40}ms` }}>
            <a href={mediaSrc(item.src)} className="flex min-h-40 flex-col justify-between bg-[#1a2433] p-5 text-[#f4f6f8]">
              <span className="text-xs tracking-[0.16em] text-[#d5deea]">{extension}</span>
              <span className="mt-6 text-sm leading-snug">{name}</span>
            </a>
          </figure>
        );
      })}
    </div>
  );
}

export function ProjectGallery({ project, asset }: { project: WorkProject; asset?: string }) {
  const sections = project.tree ? gallerySections(project.tree, project.category) : [];
  const files = project.tree
    ? sections.reduce((total, section) => total + (section.folder ? fileCount(section.folder) : 1), 0)
    : project.media.length;
  const active = sections.find((section) => section.id === asset) ?? sections[0];
  const categoryName = categoryLabel(project.category);

  return (
    <div className="bg-[#0c0e12] text-[#f4f6f8] lg:grid lg:min-h-[calc(100vh-4.5rem)] lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="flex flex-col justify-between gap-10 px-6 py-8 sm:px-8 lg:sticky lg:top-[4.25rem] lg:max-h-[calc(100vh-4.25rem)] lg:overflow-y-auto lg:px-8 lg:py-10">
        <div className="work-rise">
          <h1 className="text-lg font-medium leading-snug">{project.title}</h1>
          <p className="mt-2 text-sm text-[#9aafc4]">{categoryName}</p>
          {project.tree ? (
            <p className="mt-2 text-sm text-[#9aafc4]">
              {files} {files === 1 ? "file" : "files"}
            </p>
          ) : null}
          {project.summary ? <p className="mt-6 text-sm leading-relaxed text-[#d5deea]">{project.summary}</p> : null}
          {project.details.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {project.details.map((detail) => (
                <p key={detail} className="text-sm leading-relaxed text-[#9aafc4]">
                  {detail}
                </p>
              ))}
            </div>
          ) : null}
          {sections.length > 0 ? (
            <nav className="mt-8 flex flex-col gap-2" aria-label="Project assets">
              {sections.map((section) => {
                const selected = section.id === active?.id;
                return (
                  <Link
                    key={section.id}
                    href={`/work/${project.slug}?asset=${encodeURIComponent(section.id)}`}
                    aria-current={selected ? "page" : undefined}
                    scroll={false}
                    className={`w-fit text-left text-sm leading-snug underline-offset-4 hover:underline ${
                      selected ? "text-[#f4f6f8] underline" : "text-[#9aafc4]"
                    }`}
                  >
                    {section.label}
                  </Link>
                );
              })}
            </nav>
          ) : null}
        </div>
        <nav className="flex flex-col gap-3 text-sm" aria-label="Project">
          <Link href={`/work/category/${project.category}`} className="w-fit text-[#d5deea] underline-offset-4 hover:underline">
            {categoryName}
          </Link>
          <Link href="/work" className="w-fit text-[#d5deea] underline-offset-4 hover:underline">
            All work
          </Link>
        </nav>
      </aside>
      {active?.folder ? (
        <div className="px-1 pb-10 sm:px-2 lg:py-2">
          <FolderGallery folder={active.folder} depth={1} />
        </div>
      ) : active?.file ? (
        <div className="px-1 pb-10 sm:px-2 lg:py-2">
          <h2 className="px-2 pt-6 pb-2 text-sm font-medium text-[#f4f6f8]">{active.file.name}</h2>
          <div className="work-masonry">
            <GalleryAsset file={active.file} />
          </div>
        </div>
      ) : project.media.length > 0 ? (
        <FlatGallery project={project} />
      ) : (
        <p className="m-6 border border-white/15 p-6 text-sm text-[#d5deea]">
          No public images, video, or files are attached to this project.
        </p>
      )}
    </div>
  );
}
