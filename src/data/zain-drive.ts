import fs from "fs";
import path from "path";
import {
  categories,
  projects as curatedProjects,
  type CategoryId,
  type MediaItem,
  type Project,
} from "@/data/portfolio";
import { zainDescriptions } from "@/data/zain-descriptions";

export type GalleryFile = {
  type: "file";
  name: string;
  src: string;
  kind: "image" | "video" | "audio" | "document" | "file";
};

export type GalleryFolder = {
  type: "folder";
  name: string;
  children: GalleryNode[];
};

export type GalleryNode = GalleryFolder | GalleryFile;

export type WorkProject = Project & {
  tree?: GalleryFolder;
};

const driveRoot = path.join(process.cwd(), "public", "data", "zain-drive");
const inventoryPath = path.join(process.cwd(), "ZAIN-DRIVE-ASSET-INVENTORY.md");

const imageExtensions = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif", "svg"]);
const videoExtensions = new Set(["mp4", "webm", "ogg", "mov", "mkv", "m4v"]);
const audioExtensions = new Set(["mp3", "wav", "m4a", "aac"]);
const documentExtensions = new Set(["pdf"]);

const descriptionSlugByFolder: Record<string, string> = {
  "Product Installation": "product-animation",
};

const gameCharacterFolders: Record<string, string> = {
  "damir-project": "Damir_s work",
  "sergio-project": "Sergio_s work",
  "character-rigs-for-unreal-engine": "Rachel Rig",
};

const foldersPublishedOnCuratedProjects = new Set(["VR work", "Product Installation"]);

function compareNames(a: string, b: string) {
  return a.localeCompare(b, "en", { sensitivity: "base" });
}

function extensionOf(name: string) {
  const dot = name.lastIndexOf(".");
  if (dot <= 0) return "";
  return name.slice(dot + 1).toLowerCase();
}

function kindFor(name: string): GalleryFile["kind"] {
  const extension = extensionOf(name);
  if (imageExtensions.has(extension)) return "image";
  if (videoExtensions.has(extension)) return "video";
  if (audioExtensions.has(extension)) return "audio";
  if (documentExtensions.has(extension)) return "document";
  return "file";
}

function publicSrc(parts: string[]) {
  return `/data/zain-drive/${parts.join("/")}`;
}

function readFolder(dir: string, name: string, parts: string[]): GalleryFolder {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const folders = entries.filter((entry) => entry.isDirectory()).sort((a, b) => compareNames(a.name, b.name));
  const files = entries.filter((entry) => entry.isFile()).sort((a, b) => compareNames(a.name, b.name));
  const children: GalleryNode[] = [
    ...folders.map((entry) => readFolder(path.join(dir, entry.name), entry.name, [...parts, entry.name])),
    ...files.map((entry) => ({
      type: "file" as const,
      name: entry.name,
      src: publicSrc([...parts, entry.name]),
      kind: kindFor(entry.name),
    })),
  ];
  return { type: "folder", name, children };
}

function flattenFiles(folder: GalleryFolder): GalleryFile[] {
  const files: GalleryFile[] = [];
  for (const child of folder.children) {
    if (child.type === "file") files.push(child);
    else files.push(...flattenFiles(child));
  }
  return files;
}

function coverItem(files: GalleryFile[]): MediaItem | undefined {
  const file = files.find((item) => item.kind === "image") ?? files.find((item) => item.kind === "video") ?? files[0];
  if (!file) return undefined;
  const kind = file.kind === "image" || file.kind === "video" ? file.kind : "file";
  return { src: file.src, alt: file.name, kind };
}

function driveSlug(name: string) {
  const base = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return `zain-${base || "folder"}`;
}

type AssignedFolder = { category: CategoryId; name: string };

function assignmentsFromInventory(markdown: string) {
  const labelToId = new Map(categories.map((category) => [category.label, category.id]));
  let category: CategoryId | null = null;
  let inTree = false;
  const assigned: AssignedFolder[] = [];
  const unmappedFolders: string[] = [];
  const unmappedFiles: string[] = [];

  for (const line of markdown.split(/\r?\n/)) {
    if (line.includes("INVENTORY-TREE-START")) {
      inTree = true;
      continue;
    }
    if (line.includes("INVENTORY-TREE-END")) break;
    if (!inTree) continue;
    const heading = /^## (.+)$/.exec(line);
    if (heading) {
      category = labelToId.get(heading[1]) ?? null;
      if (!labelToId.has(heading[1]) && heading[1] !== "Unmapped") {
        throw new Error(`Inventory heading is not a Work category: ${heading[1]}`);
      }
      continue;
    }
    const project = /^- (.+)\/ — \d+ folders?, \d+ files?$/.exec(line);
    if (project) {
      if (category) assigned.push({ category, name: project[1] });
      else unmappedFolders.push(project[1]);
      continue;
    }
    const rootFile = /^- ([^/].*)$/.exec(line);
    if (rootFile && !category) unmappedFiles.push(rootFile[1]);
  }

  return { assigned, unmappedFolders, unmappedFiles };
}

function buildDriveProjects(): WorkProject[] {
  const markdown = fs.readFileSync(inventoryPath, "utf8");
  const { assigned, unmappedFolders, unmappedFiles } = assignmentsFromInventory(markdown);
  const onDisk = fs.readdirSync(driveRoot, { withFileTypes: true });
  const diskFolders = new Set(onDisk.filter((entry) => entry.isDirectory()).map((entry) => entry.name));
  const diskRootFiles = new Set(onDisk.filter((entry) => entry.isFile()).map((entry) => entry.name));
  const seen = new Set<string>();

  for (const folder of assigned) {
    if (seen.has(folder.name)) throw new Error(`Inventory lists ${folder.name} more than once`);
    seen.add(folder.name);
    if (!diskFolders.has(folder.name)) throw new Error(`Inventory folder missing on disk: ${folder.name}`);
  }
  for (const folder of unmappedFolders) {
    if (!diskFolders.has(folder)) throw new Error(`Unmapped inventory folder missing on disk: ${folder}`);
    seen.add(folder);
  }
  for (const name of diskFolders) {
    if (!seen.has(name)) throw new Error(`Disk folder is not in the inventory: ${name}`);
  }
  for (const name of unmappedFiles) {
    if (!diskRootFiles.has(name)) throw new Error(`Unmapped inventory file missing on disk: ${name}`);
  }
  for (const name of diskRootFiles) {
    if (!unmappedFiles.includes(name)) throw new Error(`Root file is not in the inventory: ${name}`);
  }

  const usedSlugs = new Set(curatedProjects.map((project) => project.slug));
  const reserved = new Set(Object.values(gameCharacterFolders));
  return assigned
    .filter((folder) => !reserved.has(folder.name) && !foldersPublishedOnCuratedProjects.has(folder.name))
    .map((folder) => {
    const tree = readFolder(path.join(driveRoot, folder.name), folder.name, [folder.name]);
    for (const extra of extraDriveNodes(folder.name)) tree.children.push(extra);
    const files = flattenFiles(tree);
    const cover = coverItem(files);
    let slug = driveSlug(folder.name);
    if (usedSlugs.has(slug)) slug = `${slug}-folder`;
    if (usedSlugs.has(slug)) throw new Error(`Slug collision for ${folder.name}`);
    usedSlugs.add(slug);
    const source = curatedProjects.find((project) => project.slug === descriptionSlugByFolder[folder.name]);
    const summary = source?.summary || zainDescriptions[folder.name];
    if (!summary) throw new Error(`Missing description for ${folder.name}`);
    return {
      slug,
      title: folder.name,
      category: folder.category,
      summary,
      details: source?.details ?? [],
      media: cover ? [cover] : [],
      tree,
    };
  });
}

function looseFile(name: string, relativePath: string, kind: GalleryFile["kind"]): GalleryFile {
  return { type: "file", name, src: `/data/${relativePath}`, kind };
}

function extraDriveNodes(folderName: string): GalleryNode[] {
  if (folderName === "Character Animation") {
    return [
      {
        type: "folder",
        name: "Additional scenes",
        children: [
          looseFile("Building burn down.mp4", "imran-drive/Building burn down.mp4", "video"),
          looseFile("Scene 04 New Updated.mp4", "imran-drive/Scene 04 New Updated.mp4", "video"),
          looseFile("Scene 09 Updated 02.mp4", "imran-drive/Scene 09 Updated 02.mp4", "video"),
          looseFile("Snowy scene.mp4", "imran-drive/Snowy scene.mp4", "video"),
        ],
      },
    ];
  }
  if (folderName === "Environment") {
    return [looseFile("thumbnail.png", "imran-drive/thumbnail.png", "image")];
  }
  return [];
}

const driveProjects = buildDriveProjects();

export function getDriveProjects() {
  return driveProjects;
}

function dataFile(relativePath: string): GalleryFile {
  return {
    type: "file",
    name: path.basename(relativePath),
    src: `/data/${relativePath}`,
    kind: kindFor(relativePath),
  };
}

function folderSection(name: string, relativeDir: string, include: (file: GalleryFile) => boolean): GalleryFolder {
  const dir = path.join(process.cwd(), "public", "data", ...relativeDir.split("/"));
  const files = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => dataFile(`${relativeDir}/${entry.name}`))
    .filter(include)
    .sort((a, b) => compareNames(a.name, b.name));
  return { type: "folder", name, children: files };
}

function modelingRigTree(slug: string): GalleryFolder | undefined {
  if (slug === "full-body-facial-and-character-rigging") {
    return {
      type: "folder",
      name: "Full-Body, Facial and Character Rigging",
      children: [
        folderSection("Models", "zain-drive/Character Models/Cartoonish 3 (father)", () => true),
        folderSection("Rigging", "zain-drive/Rigging Stuff/(M)Rigged cartoon Father", (file) => file.kind === "video"),
        folderSection("Facial expressions", "zain-drive/Rigging Stuff/Facial rig", (file) => file.kind === "video"),
      ],
    };
  }
  if (slug === "animal-rigging-dinosaur-and-bird") {
    return {
      type: "folder",
      name: "Animal Rigging – Dinosaur and Bird",
      children: [
        {
          type: "folder",
          name: "Dinosaur",
          children: [dataFile("zain-drive/Rigging Stuff/Dino Rig/Dino Rig - video demo.mp4")],
        },
        {
          type: "folder",
          name: "Bird",
          children: [dataFile("zain-drive/Rigging Stuff/Bird rig/Bird rig.mp4")],
        },
      ],
    };
  }
  if (slug === "stylized-cartoon-character-models") {
    return {
      type: "folder",
      name: "Stylized / Cartoon Character Models",
      children: [
        folderSection("Models", "zain-drive/Character Models/Cartoonish 2", (file) => file.kind === "image"),
        folderSection("Showcase", "zain-drive/Character Models/Cartoonish 2", (file) => file.kind === "video"),
        folderSection("Cartoon models", "zain-drive/Character Models/Cartoonish", (file) => file.kind === "image"),
      ],
    };
  }
  return undefined;
}

function metaHumanTree(slug: string): GalleryFolder | undefined {
  if (slug !== "metahuman-and-3d-human-assets") return undefined;
  return {
    type: "folder",
    name: "MetaHuman and 3D Human Assets",
    children: [
      folderSection("Full-body human", "MetaHuman/full-body-human", () => true),
      folderSection("Realistic male", "MetaHuman/realistic-male", () => true),
      folderSection("Realistic female", "MetaHuman/realistic-female", () => true),
      folderSection("Low-poly 3D human", "MetaHuman/low-poly 3d", () => true),
    ],
  };
}

function vrProjectTree(slug: string): GalleryFolder | undefined {
  if (slug !== "vr-photo-gallery") return undefined;
  return {
    type: "folder",
    name: "VR Photo Gallery Environment",
    children: [
      folderSection("Models", "VR Project/model", () => true),
      folderSection("Environment", "zain-drive/VR work/PhotoStudio map", () => true),
      folderSection("Reference", "VR Project/reference", () => true),
      {
        type: "folder",
        name: "Animation",
        children: [dataFile("VR Project/Pan animation.mkv")],
      },
      folderSection("APK", "zain-drive/VR work/Magnus/updated APK", () => true),
      folderSection("Game development", "zain-drive/VR work/3D develop for game_", () => true),
      folderSection("Animal", "zain-drive/VR work/Animal", () => true),
      folderSection("Industrial bench", "zain-drive/VR work/Industrial bench", () => true),
      folderSection("Interiors", "zain-drive/VR work/Interior", () => true),
      folderSection("Mobile game", "zain-drive/VR work/Mobile game experience", () => true),
      {
        type: "folder",
        name: "Logos",
        children: [
          dataFile("zain-drive/VR work/Mermaid logo.mp4"),
          dataFile("zain-drive/VR work/Shark logo.mp4"),
        ],
      },
    ],
  };
}

function mergedSection(name: string, dirs: string[]): GalleryFolder {
  const children = dirs.flatMap((dir) => folderSection(name, dir, () => true).children);
  return { type: "folder", name, children };
}

function architectureShowcaseTree(slug: string): GalleryFolder | undefined {
  if (slug === "interior-visualization-collection") {
    return {
      type: "folder",
      name: "Interior Visualization",
      children: [
        mergedSection("Luxury kitchen", ["Architectural Visualization/luxury-kitchen"]),
        mergedSection("Modern kitchen", ["Architectural Visualization/modern-kitchen"]),
        mergedSection("Bathrooms", [
          "Architectural Visualization/bathroom render set 1",
          "Architectural Visualization/bathroom render set 2",
        ]),
        mergedSection("Offices", [
          "Architectural Visualization/office set 1",
          "Architectural Visualization/office set 2",
        ]),
        mergedSection("Living rooms", [
          "Architectural Visualization/living room set 1",
          "Architectural Visualization/living room set 2",
        ]),
        mergedSection("Bedrooms", [
          "Architectural Visualization/bedroom set 1",
          "Architectural Visualization/bedroom set 2",
        ]),
      ],
    };
  }
  if (slug === "exterior-visualization") {
    return {
      type: "folder",
      name: "Exterior Visualization",
      children: [
        mergedSection("Villa", [
          "zain-drive/Interior & Exterior/Exterior/Villa",
          "zain-drive/Interior & Exterior/Villa Interior-Exterior",
          "zain-drive/Visualization/Villa Exterior view",
        ]),
        mergedSection("House landscape", ["zain-drive/Interior & Exterior/Exterior/House landscape_"]),
        mergedSection("Japanese Zen garden", ["zain-drive/Interior & Exterior/Exterior/Japanese Zen Garden"]),
      ],
    };
  }
  return undefined;
}

function aiAssistedTree(slug: string): GalleryFolder | undefined {
  if (slug === "ai-character-animation-seedance") {
    return {
      type: "folder",
      name: "AI Character Animation – Seedance 2.5",
      children: [
        {
          type: "folder",
          name: "Sequence",
          children: [dataFile("AI-Assisted Video and Animation/AI Character/AI animation.mp4")],
        },
        folderSection("Character sheet", "AI-Assisted Video and Animation/AI Character", (file) => file.kind === "image"),
      ],
    };
  }
  if (slug === "ai-assisted-cinematic-product-shots") {
    return {
      type: "folder",
      name: "AI-Assisted Cinematic Product Shots",
      children: [
        {
          type: "folder",
          name: "Final",
          children: [dataFile("AI-Assisted Video and Animation/AI-Assisted Cinematic/final video (2).mp4")],
        },
        mergedSection("Product shots", [
          "imran-drive/AI product animation",
          "imran-drive/AI product animation/Potrait",
        ]),
      ],
    };
  }
  return undefined;
}

function ritaTree(slug: string): GalleryFolder | undefined {
  if (slug !== "rita-ai-scenes") return undefined;
  return {
    type: "folder",
    name: "Rita AI scenes",
    children: [
      folderSection("Monster", "imran-drive/Rita AI scenes/Monster", () => true),
      folderSection("Prom", "imran-drive/Rita AI scenes/Prom", () => true),
      folderSection("Saving the principle", "imran-drive/Rita AI scenes/Saving the principle", () => true),
      {
        type: "folder",
        name: "Scripts",
        children: [
          dataFile("imran-drive/PARASITE - VO - Monster - SCR Script.docx"),
          dataFile("imran-drive/Parasite lose control - WM.docx"),
        ],
      },
      {
        type: "folder",
        name: "Production",
        children: [
          dataFile("imran-drive/image (8).png"),
          dataFile("imran-drive/8WYmgYcP4yOKldhCTQl8u.webm"),
          dataFile("imran-drive/copy_8EABA9A8-6F26-4573-9E77-4A04575ED876.mov"),
        ],
      },
    ],
  };
}

function attachCuratedTree(project: Project): WorkProject {
  const folder = gameCharacterFolders[project.slug];
  if (folder) {
    return {
      ...project,
      tree: readFolder(path.join(driveRoot, folder), folder, [folder]),
    };
  }
  const tree =
    modelingRigTree(project.slug) ??
    metaHumanTree(project.slug) ??
    vrProjectTree(project.slug) ??
    architectureShowcaseTree(project.slug) ??
    aiAssistedTree(project.slug) ??
    ritaTree(project.slug);
  if (tree) return { ...project, tree };
  return project;
}

export function getWorkProjects() {
  return [...curatedProjects.map(attachCuratedTree), ...driveProjects];
}

export function getWorkProject(slug: string) {
  return getWorkProjects().find((project) => project.slug === slug);
}

export function workProjectsByCategory(id: CategoryId) {
  const curated = curatedProjects.filter((project) => project.category === id);
  const drive = driveProjects.filter((project) => project.category === id);
  return [...curated, ...drive];
}
