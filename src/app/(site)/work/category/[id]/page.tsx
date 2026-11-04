import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CategoryNav } from "@/components/work/CategoryNav";
import { CategoryProjects } from "@/components/work/CategoryProjects";
import { categories, categoryLabel, isCategoryId, type CategoryId } from "@/data/portfolio";
import { workProjectsByCategory } from "@/data/zain-drive";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return categories.map((category) => ({ id: category.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  if (!isCategoryId(id)) return { title: "Work" };
  return {
    title: categoryLabel(id),
    description: `Projects in ${categoryLabel(id)} by Imran Chaudhry.`,
  };
}

function CategoryFallback() {
  return (
    <main className="bg-[#1a2433]" aria-busy="true">
      <div className="site-wrap py-16">
        <div className="mx-auto h-4 w-40 bg-white/10" />
        <div className="mt-14 h-64 bg-white/5" />
      </div>
    </main>
  );
}

function CategoryView({ id }: { id: CategoryId }) {
  const list = workProjectsByCategory(id);
  return (
    <main className="bg-[#1a2433] text-[#f4f6f8]" data-motion-root>
      <div className="site-wrap py-14 md:py-20">
        <CategoryNav active={id} />
        <h1 className="work-rise mt-12 text-3xl font-medium tracking-tight md:text-4xl">
          {categoryLabel(id)}
        </h1>
        <p className="mt-3 text-sm text-[#9aafc4]">
          {list.length} {list.length === 1 ? "project" : "projects"}
        </p>
        <CategoryProjects projects={list} />
      </div>
    </main>
  );
}

async function CategoryContent({ params }: PageProps) {
  const { id } = await params;
  if (!isCategoryId(id)) notFound();
  return <CategoryView id={id} />;
}

export default function CategoryPage({ params }: PageProps) {
  return (
    <Suspense fallback={<CategoryFallback />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}
