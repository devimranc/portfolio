import Link from "next/link";
import { categories, type CategoryId } from "@/data/portfolio";

export function CategoryNav({ active }: { active: CategoryId | "all" }) {
  const items = [
    { href: "/work", id: "all" as const, label: "Show All" },
    ...categories.map((category) => ({
      href: `/work/category/${category.id}`,
      id: category.id,
      label: category.label,
    })),
  ];

  return (
    <nav aria-label="Project categories" className="flex flex-wrap justify-center gap-x-6 gap-y-3">
      {items.map((item) => {
        const selected = item.id === active;
        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={selected ? "page" : undefined}
            className={`border-b-2 pb-1 text-center text-[13px] leading-snug tracking-wide transition-colors duration-300 sm:text-sm ${
              selected
                ? "border-[#f4f6f8] text-[#f4f6f8]"
                : "border-transparent text-[#9aafc4] hover:text-[#f4f6f8]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
