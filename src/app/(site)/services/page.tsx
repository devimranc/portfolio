import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Services",
  description:
    "3D modeling, character rigging and animation, product visualization, Unreal Engine, VR, architectural visualization, and AI-assisted video.",
};

export default function ServicesPage() {
  return (
    <main className="site-wrap py-16">
      <h1 className="text-4xl font-medium tracking-tight">Services</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-black/75">
        The services below match the kinds of work in this portfolio.
      </p>
      <div className="mt-12 grid gap-12">
        {services.map((service, index) => (
          <section
            key={service.id}
            id={service.id}
            className="grid gap-3 border-t border-black/10 pt-8 md:grid-cols-[8rem_1fr]"
          >
            <p className="text-sm text-black/50">0{index + 1}</p>
            <div>
              <h2 className="text-2xl font-medium">{service.title}</h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-black/80">
                {service.body}
              </p>
            </div>
          </section>
        ))}
      </div>
      <Link href="/contact" className="mt-12 inline-block text-sm underline">
        Inquire about a project
      </Link>
    </main>
  );
}
