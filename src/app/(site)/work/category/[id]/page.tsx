import { notFound, redirect } from "next/navigation";
import { categories, isCategoryId } from "@/data/portfolio";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return categories.map((category) => ({ id: category.id }));
}

export default async function CategoryPage({ params }: PageProps) {
  const { id } = await params;
  if (!isCategoryId(id)) notFound();
  redirect(`/work?category=${id}`);
}
