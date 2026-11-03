import type { Metadata } from "next";
import { WorkCatalog } from "@/components/work/WorkCatalog";
import { coverMedia } from "@/data/portfolio";
import { getWorkProjects } from "@/data/zain-drive";

export const metadata: Metadata = {
  title: "Creative Showcase",

};

export default function WorkPage() {
  const projects = getWorkProjects().map((project) => ({
    slug: project.slug,
    title: project.title,
    category: project.category,
    cover: coverMedia(project.media) ?? null,
  }));

  return (
    <main>
      <WorkCatalog projects={projects} />
    </main>
  );
}
