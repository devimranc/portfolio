"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContact } from "@/components/contact/ContactProvider";

const links = [
  { href: "/work", index: "01", label: "Work" },
  { href: "/about", index: "02", label: "About" },
  { href: "/services", index: "03", label: "Services" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { open, isOpen } = useContact();

  return (
    <header className="site-header sticky top-0 z-20 border-b border-[#d5deea]/15 bg-[#121a26]/95 text-[#f4f6f8] backdrop-blur-md">
      <div className="site-wrap flex items-center justify-between gap-6 py-3.5">
        <Link href="/" className="flex items-center gap-2.5 text-[#f4f6f8]">
          <span className="h-3.5 w-3.5 rounded-[3px] bg-[#e8eef5]" aria-hidden />
          <span className="text-[12px] font-semibold tracking-[0.16em]">
            IMRAN CHAUDHRY
          </span>
          <span className="hidden text-[10px] tracking-[0.22em] text-[#8ea0b5] sm:inline">
            PORTFOLIO
          </span>
        </Link>
        <nav className="flex flex-wrap justify-end gap-x-5 gap-y-2 md:gap-x-7">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-item"
              aria-current={pathname === link.href || pathname.startsWith(`${link.href}/`) ? "page" : undefined}
            >
              <span className="nav-index">{link.index}</span>
              <span className="nav-label">
                <span>{link.label}</span>
                <span>{link.label}</span>
              </span>
            </Link>
          ))}
          <button
            type="button"
            className="nav-item"
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            onClick={(event) => open({ x: event.clientX, y: event.clientY })}
          >
            <span className="nav-index">04</span>
            <span className="nav-label">
              <span>Contact</span>
              <span>Contact</span>
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
