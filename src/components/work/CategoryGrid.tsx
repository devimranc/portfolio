import Link from "next/link";
import { ProjectMedia } from "@/components/work/ProjectMedia";
import { categories, categoryCover } from "@/data/portfolio";
import { workProjectsByCategory } from "@/data/zain-drive";

export function CategoryGrid() {
  return (
    <div className="mt-12 grid gap-8 sm:grid-cols-2 xl:grid-cols-3" data-reveal-stagger>
      {categories.map((category, index) => {
        const count = workProjectsByCategory(category.id).length;
        const cover = categoryCover(category.id);
        return (
          <Link
            key={category.id}
            href={`/work/category/${category.id}`}
            className="work-rise group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d5deea]"
            data-glass-tilt
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="overflow-hidden bg-[#243246]">
              <div className="aspect-[4/3] overflow-hidden" data-fluid>
                {cover ? (
                  <div className="work-card-media h-full w-full">
                    <ProjectMedia item={cover} cover priority={index < 3} />
                  </div>
                ) : (
                  <div className="flex h-full items-end bg-[#243246] p-5 text-sm text-[#d5deea]">
                    Visuals withheld
                  </div>
                )}
              </div>
            </div>
            <p className="mt-4 text-sm text-[#d5deea]">
              {count} {count === 1 ? "project" : "projects"}
            </p>
            <h2 className="mt-1 text-xl font-medium leading-snug text-[#f4f6f8]">
              {category.label}
            </h2>
          </Link>
        );
      })}
    </div>
  );
}
