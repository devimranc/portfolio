import type { Metadata } from "next";
import { ContactButton } from "@/components/contact/ContactProvider";
import { services } from "@/data/portfolio";
import "@/styles/services.css";

export const metadata: Metadata = {
  title: "Services",
  description:
    "3D modeling, character rigging and animation, product visualization, Unreal Engine, VR, architectural visualization, and AI-assisted video.",
};

const icons = {
  "3d-modeling": "cube",
  "character-rigging": "run",
  "product-visualization": "box",
  "unreal-vr": "engine",
  architecture: "building",
  "ai-video": "spark",
} as const;

function ServiceIcon({ id }: { id: keyof typeof icons }) {
  const name = icons[id];
  if (name === "cube") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path fill="none" stroke="currentColor" strokeWidth="1.6" d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
        <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M12 12.5 20 7.5M12 12.5 4 7.5M12 12.5V21" />
      </svg>
    );
  }
  if (name === "run") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle cx="15" cy="5" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="M7.5 20 11 14l3.2 1.4 2.3 4.6M11 14 7.8 12.2M15.2 10.4 11.2 9.2 8.4 11.6" />
      </svg>
    );
  }
  if (name === "box") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M4 8.5 12 4.5l8 4v7l-8 4-8-4v-7Z" />
        <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M12 12.5V19.5M12 12.5 4 8.5M12 12.5l8-4" />
      </svg>
    );
  }
  if (name === "engine") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <rect x="4" y="7" width="12" height="10" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="M16 10h3.5v4H16M7 7V4.5M11 7V4.5M7 17v2.5M11 17v2.5" />
      </svg>
    );
  }
  if (name === "building") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="M4 20h16M7 20V9l5-4 5 4v11" />
        <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M10 20v-4h4v4M10 11h.01M14 11h.01M10 14.5h.01M14 14.5h.01" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3M6.2 6.2l2.1 2.1M15.7 15.7l2.1 2.1M17.8 6.2l-2.1 2.1M8.3 15.7l-2.1 2.1" />
      <circle cx="12" cy="12" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
      <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function ServicesPage() {
  return (
    <main className="services-page site-wrap">
      <header className="services-head">
        <h1>Services</h1>
        <p>The services below match the kinds of work in this portfolio.</p>
      </header>
      <div className="services-list">
        {services.map((service, index) => (
          <article key={service.id} id={service.id} className="service-card">
            <span className="service-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="service-icon">
              <ServiceIcon id={service.id as keyof typeof icons} />
            </span>
            <h2 className="service-title">{service.title}</h2>
            <p className="service-body">{service.body}</p>
            <ContactButton className="service-arrow" ariaLabel={`Inquire about ${service.title}`}>
              <Arrow />
            </ContactButton>
          </article>
        ))}
      </div>
      <section className="service-cta">
        <div>
          <h2>Need a custom service?</h2>
          <p>Inquire about a project.</p>
        </div>
        <div className="service-orb" aria-hidden />
        <ContactButton className="btn-primary">
          Start a Project
          <Arrow />
        </ContactButton>
      </section>
    </main>
  );
}
