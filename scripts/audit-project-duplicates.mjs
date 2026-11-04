import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const root = path.join(import.meta.dirname, "..");

// Load compiled data by importing TS through tsx alternative: read portfolio slugs and run zain logic inline
const portfolioPath = path.join(root, "src/data/portfolio.ts");
const portfolioText = fs.readFileSync(portfolioPath, "utf8");
const slugTitlePairs = [...portfolioText.matchAll(/slug:\s*\"([^\"]+)\"[\s\S]*?title:\s*\"([^\"]+)\"/g)].map(
  (m) => ({ slug: m[1], title: m[2], source: "curated" }),
);

const inventory = fs.readFileSync(path.join(root, "ZAIN-DRIVE-ASSET-INVENTORY.md"), "utf8");
const categories = [
  "game-character",
  "character-showcase",
  "character-modeling-rigging",
  "metahuman",
  "vr-project",
  "product-animation-views",
  "architecture-showcase",
  "ai-assisted",
];

const labelToId = {
  "3D Animation and Game Character Work": "game-character",
  "Character Animation Showcase": "character-showcase",
  "Character Modeling and Rigging": "character-modeling-rigging",
  "MetaHuman and 3D Human Assets": "metahuman",
  "VR Project": "vr-project",
  "Product Animation and Exploded Views": "product-animation-views",
  "Architectural Visualization": "architecture-showcase",
  "AI-Assisted Video and Animation": "ai-assisted",
};

const gameCharacterFolders = {
  "damir-project": "Damir_s work",
  "sergio-project": "Sergio_s work",
  "character-rigs-for-unreal-engine": "Rachel Rig",
};
const foldersPublishedOnCurated = new Set([
  "2D",
  "Dorcas Med animation",
  "Product Installation",
  "VR work",
]);
const reserved = new Set(Object.values(gameCharacterFolders));
const curatedSlugs = new Set(slugTitlePairs.map((p) => p.slug));

let category = null;
let inTree = false;
const assigned = [];
for (const line of inventory.split(/\r?\n/)) {
  if (line.includes("INVENTORY-TREE-START")) {
    inTree = true;
    continue;
  }
  if (line.includes("INVENTORY-TREE-END")) break;
  if (!inTree) continue;
  const heading = /^## (.+)$/.exec(line);
  if (heading) {
    category = labelToId[heading[1]] ?? null;
    continue;
  }
  const project = /^- (.+)\/ — \d+ folders?, \d+ files?$/.exec(line);
  if (project && category) assigned.push({ name: project[1], category });
}

function driveSlug(name) {
  return (
    "zain-" +
    name
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, " and ")
      .replace(/[^A-Za-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase()
  );
}

const driveProjects = assigned
  .filter((f) => !reserved.has(f.name) && !foldersPublishedOnCurated.has(f.name))
  .map((f) => {
    let slug = driveSlug(f.name);
    if (curatedSlugs.has(slug)) slug = `${slug}-folder`;
    return { slug, title: f.name, category: f.category, source: "zain-drive" };
  });

const all = [...slugTitlePairs, ...driveProjects];

// Parse media src from portfolio for curated cover paths
const mediaBySlug = new Map();
const blocks = portfolioText.split(/\n  \},\n/);
for (const block of blocks) {
  const slugM = block.match(/slug:\s*\"([^\"]+)\"/);
  if (!slugM) continue;
  const srcs = [...block.matchAll(/src:\s*d\(\"([^\"]+)\"\)/g)].map((m) => m[1]);
  if (srcs[0]) mediaBySlug.set(slugM[1], `/data/${srcs[0]}`);
}

function basename(src) {
  if (!src) return "";
  return src.split("/").pop().toLowerCase();
}

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const byCover = new Map();
const byBasename = new Map();
const byNormTitle = new Map();

for (const p of slugTitlePairs) {
  const cover = mediaBySlug.get(p.slug);
  if (cover) {
    if (!byCover.has(cover)) byCover.set(cover, []);
    byCover.get(cover).push(p);
    const base = basename(cover);
    if (base) {
      if (!byBasename.has(base)) byBasename.set(base, []);
      byBasename.get(base).push({ ...p, cover });
    }
  }
  const norm = normalizeName(p.title);
  if (!byNormTitle.has(norm)) byNormTitle.set(norm, []);
  byNormTitle.get(norm).push(p);
}

console.log("=== TOTAL PROJECT CARDS (curated + zain assigned) ===");
console.log(`Curated: ${slugTitlePairs.length}, Zain drive cards: ${driveProjects.length}, Combined: ${all.length}`);

console.log("\n=== EXACT DUPLICATE COVER URL (curated only) ===");
for (const [cover, projects] of byCover) {
  if (projects.length > 1) console.log(cover, "->", projects.map((p) => p.slug).join(", "));
}

console.log("\n=== SAME FILENAME, DIFFERENT PROJECT (curated covers) ===");
for (const [base, projects] of byBasename) {
  if (projects.length > 1) {
    const uniqueSlugs = [...new Set(projects.map((p) => p.slug))];
    if (uniqueSlugs.length > 1) {
      console.log(base, "->", projects.map((p) => `${p.slug} (${p.cover})`).join(" | "));
    }
  }
}

console.log("\n=== CURATED vs ZAIN FOLDER OVERLAP (audit-style) ===");
const overlaps = [
  ["Rain Environment", "rain-environment", "zain-ai-environment", "AI environment folder - same mp4 per audit"],
  ["VR Photo Gallery", "vr-photo-gallery", "zain-vr-work", "VR work folder suppressed but gallery overlaps Magnus"],
  ["Product Installation", "product-animation", null, "Product Installation folder suppressed - curated only"],
  ["Character Animation Showcase clips", "amend-cinematic-character-showcase", "zain-character-animation", "Same 4 clips in drive folders"],
  ["MetaHuman", "metahuman-and-3d-human-assets", "zain-character-models", "34 stills subset of Character Models"],
  ["Sports brand AI", "ai-workflow-animation-sports-brand", "zain-cgi", "Fictional Sport Brand.mp4 duplicate per audit"],
  ["Architectural", "interior-visualization-collection", "zain-interior-exterior-interior", "65 files overlap per audit"],
  ["Dorcas / Wounded", "dorcas-med-animation", null, "Fixed - was duplicate narrative, different files"],
];

for (const [label, curatedSlug, zainSlug, note] of overlaps) {
  const curated = slugTitlePairs.find((p) => p.slug === curatedSlug);
  const zain = zainSlug ? driveProjects.find((p) => p.slug === zainSlug) : null;
  console.log(`- ${label}: curated=${curated ? "yes" : "no"} zain-card=${zain ? zain.slug : "n/a"} — ${note}`);
}

console.log("\n=== ZAIN DRIVE CARDS THAT DUPLICATE CURATED THEMES ===");
const themeDupes = driveProjects.filter((d) => {
  const n = normalizeName(d.title);
  return (
    n.includes("character animation") ||
    n.includes("character models") ||
    n.includes("rigging stuff") ||
    n.includes("medical animation") ||
    n.includes("cgi") ||
    d.name === "Medical animation"
  );
});
for (const d of themeDupes) console.log(`  ${d.slug} | ${d.title} | ${d.category}`);

console.log("\n=== ai-assisted vs ai-video CATEGORY SPLIT (Rain Environment) ===");
const rain = slugTitlePairs.find((p) => p.slug === "rain-environment");
console.log(rain ? `rain-environment is category ai-assisted in portfolio; also listed under ai-video filter via category alias` : "missing");

console.log("\n=== SIMILAR TITLES (normalized match, curated) ===");
for (const [norm, projects] of byNormTitle) {
  if (projects.length > 1) console.log(norm, "->", projects.map((p) => p.slug).join(", "));
}
