import { getWorkProjects } from "../src/data/zain-drive";

const projects = getWorkProjects();

console.log("Total project cards:", projects.length);

const byCover = new Map<string, typeof projects>();
for (const project of projects) {
  const cover = project.media[0]?.src;
  if (!cover) continue;
  const list = byCover.get(cover) ?? [];
  list.push(project);
  byCover.set(cover, list);
}

console.log("\n=== Same cover image/video (exact path) ===");
for (const [cover, list] of byCover) {
  if (list.length < 2) continue;
  console.log(cover);
  for (const p of list) console.log(`  - ${p.slug} | ${p.title} | ${p.category}`);
}

console.log("\n=== Medical / Dorcas / Memsel ===");
for (const p of projects) {
  const blob = `${p.slug} ${p.title} ${p.summary}`.toLowerCase();
  if (/med|memsel|dorcas|wound|soldier/.test(blob)) {
    console.log(`${p.slug} | ${p.title} | ${p.category}`);
  }
}

console.log("\n=== Character Animation Showcase vs drive folders ===");
const showcaseSlugs = [
  "amend-cinematic-character-showcase",
  "infiltration-sequence",
  "short-monologue",
  "character-in-an-epic-environment",
];
for (const slug of showcaseSlugs) {
  const p = projects.find((x) => x.slug === slug);
  if (p) console.log(`curated: ${slug}`);
}
for (const p of projects) {
  if (p.slug === "zain-character-animation" || p.slug === "zain-character-animation2") {
    console.log(`drive: ${p.slug} | ${p.title}`);
  }
}

console.log("\n=== MetaHuman vs Character Models ===");
console.log(
  projects.some((p) => p.slug === "metahuman-and-3d-human-assets") ? "curated metahuman: yes" : "no",
);
console.log(
  projects.some((p) => p.slug === "zain-character-models") ? "drive character models: yes" : "no",
);

console.log("\n=== Rain / AI duplicate paths ===");
for (const p of projects) {
  if (/rain|ai environment|sport brand|fictional sport/i.test(`${p.title} ${p.slug}`)) {
    console.log(`${p.slug} | ${p.category} | ${p.media[0]?.src ?? "no cover"}`);
  }
}

console.log("\n=== Architecture curated vs drive ===");
const archCurated = projects.filter((p) => p.category === "architecture-showcase");
const archDrive = projects.filter((p) => p.category === "architecture");
console.log(`architecture-showcase cards: ${archCurated.length}`, archCurated.map((p) => p.slug));
console.log(`architecture (zain) cards: ${archDrive.length} (first 5)`, archDrive.slice(0, 5).map((p) => p.slug));

console.log("\n=== Dorcas duplicate check ===");
const dorcas = projects.filter((p) => /dorcas|wounded-soldier/.test(p.slug));
console.log(dorcas.map((p) => `${p.slug} | ${p.title}`));
