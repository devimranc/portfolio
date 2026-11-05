import type { Metadata } from "next";
import { WorkCatalog } from "@/components/work/WorkCatalog";
import { coverMedia, isCategoryId } from "@/data/portfolio";
import { getWorkProjects } from "@/data/zain-drive";

export const metadata: Metadata = {
  title: "Creative Showcase",

};

type PageProps = {
  searchParams: Promise<{ category?: string | string[] }>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function WorkPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const raw = firstParam(query.category);
  const category = raw && isCategoryId(raw) ? raw : "all";
  const projects = getWorkProjects().map((project) => ({
    slug: project.slug,
    title: project.title,
    category: project.category,
    cover: coverMedia(project.media) ?? null,
  }));

  return (
    <main data-motion-root>
      <WorkCatalog projects={projects} category={category} />
    </main>
  );
}
