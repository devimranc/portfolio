import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <>
    <SiteHeader />
    <main className="site-wrap py-24">
      <p className="text-sm tracking-wide">404</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight">
        This page is not available
      </h1>
      <p className="mt-4 max-w-md text-black/75">
        The link may be out of date. The work, services, and contact pages are
        still available.
      </p>
      <Link href="/" className="mt-8 inline-block text-sm underline">
        Back to home
      </Link>
    </main>
    <SiteFooter />
    </>
  );
}
