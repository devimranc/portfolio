import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/10">
      <div className="site-wrap flex flex-wrap items-center justify-between gap-3 py-8 text-sm">
        <p>Imran Chaudhry · Bolingbrook, IL, USA</p>
        <Link href="/contact" className="underline">
          Contact
        </Link>
      </div>
    </footer>
  );
}
