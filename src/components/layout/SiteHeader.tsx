import Link from "next/link";

const links = [
  { href: "/work", index: "01", label: "Work" },
  { href: "/about", index: "03", label: "About" },
  { href: "/services", index: "02", label: "Services" },
  { href: "/contact", index: "04", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-20 border-b border-white/10 bg-[#1a2433]/90 text-[#f4f6f8] backdrop-blur-md">
      <div className="site-wrap flex items-center justify-between gap-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-[#f4f6f8]">
          <span className="h-2 w-2 bg-[#d5deea]" aria-hidden />
          <span className="text-[13px] font-semibold tracking-[0.14em]">
            IMRAN CHAUDHRY
          </span>
          <span className="hidden text-[11px] tracking-[0.22em] text-[#9aafc4] sm:inline">
            PORTFOLIO
          </span>
        </Link>
        <nav className="flex flex-wrap justify-end gap-x-5 gap-y-2 md:gap-x-7">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="nav-item">
              <span className="nav-index">{link.index}</span>
              <span className="nav-label">
                <span>{link.label}</span>
                <span>{link.label}</span>
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
