import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProjectGallery } from "@/components/work/ProjectGallery";
import { getWorkProject, getWorkProjects } from "@/data/zain-drive";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ asset?: string | string[] }>;
};

export function generateStaticParams() {
  return getWorkProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getWorkProject(slug);
  if (!project) return { title: "Project" };
  return {
    title: project.title,
    description: project.summary,
  };
}

function ProjectFallback() {
  return (
    <main className="bg-[#0c0e12]" aria-busy="true">
      <div className="grid gap-4 p-8 lg:grid-cols-[16rem_1fr]">
        <div className="h-24 bg-white/5" />
        <div className="h-80 bg-white/5" />
      </div>
    </main>
  );
}

async function ProjectContent({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { asset: assetQuery } = await searchParams;
  const asset = Array.isArray(assetQuery) ? assetQuery[0] : assetQuery;
  const project = getWorkProject(slug);
  if (!project) notFound();
  return (
    <main>
      <ProjectGallery project={project} asset={asset} />
    </main>
  );
}

export default function ProjectPage({ params, searchParams }: PageProps) {
  return (
    <Suspense fallback={<ProjectFallback />}>
      <ProjectContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
