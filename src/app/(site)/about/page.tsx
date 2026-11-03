import type { Metadata } from "next";
import { ContactButton } from "@/components/contact/ContactProvider";
import "@/styles/about.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "Imran Chaudhry is a 3D animator and motion designer in Bolingbrook, Illinois.",
};

const expertise = [
  { label: "Character Modeling & Cleanup", icon: "cube" },
  { label: "Rigging & Animation, including combat", icon: "run" },
  { label: "Product Modeling & PBR", icon: "layers" },
  { label: "Unity / Unreal Engine integration", icon: "screen" },
  { label: "VR environments, including a photo gallery", icon: "vr" },
  { label: "Architectural visualization", icon: "building" },
] as const;

const tools = ["Unreal Engine", "Unity", "Blender", "Substance Painter", "Photoshop"];

function ExpertiseIcon({ name }: { name: (typeof expertise)[number]["icon"] }) {
  if (name === "cube") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M12 3.5 19 7.5v9L12 20.5 5 16.5v-9L12 3.5Z" />
        <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M12 12.2 19 7.5M12 12.2 5 7.5M12 12.2v8.3" />
      </svg>
    );
  }
  if (name === "run") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle cx="14" cy="5" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="M8 20.5 11 14l3 1.2 2.2 5M11 14l-3.2-1.5M14 10.2 10.5 9 8 11.2" />
      </svg>
    );
  }
  if (name === "layers") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path fill="none" stroke="currentColor" strokeWidth="1.6" d="m4 9 8-4 8 4-8 4-8-4Z" />
        <path fill="none" stroke="currentColor" strokeWidth="1.6" d="m4 13 8 4 8-4M4 17l8 4 8-4" />
      </svg>
    );
  }
  if (name === "screen") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <rect x="3.5" y="4.5" width="17" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="M8 19.5h8M12 16.5v3" />
      </svg>
    );
  }
  if (name === "vr") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M4 9.5h16v6.2a2 2 0 0 1-2 2h-2.2L12 15.2 8.2 17.7H6a2 2 0 0 1-2-2V9.5Z" />
        <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M8 9.5V8a4 4 0 0 1 8 0v1.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="M4 20.5h16M6.5 20.5V10.2L12 6l5.5 4.2v10.3" />
      <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M10 20.5v-4.2h4v4.2" />
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

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-stage site-wrap">
        <div className="about-copy">
          <p className="about-kicker">About</p>
          <p className="about-place">Bolingbrook, IL, USA</p>
          <h1>
            Imran
            <span>Chaudhry</span>
          </h1>
          <p className="about-role">3D Animator & Motion Designer</p>
          <div className="about-bio">
            <p>
              Imran is a 3D artist, animator, and motion designer working with AI
              video and Unreal Engine.
            </p>
            <p>
              Documented work includes character cleanup, rigging, and Unity
              integration; combat animation for a retro game character; character
              rigs integrated into Unreal Engine; a VR photo gallery environment;
              medical animation for Memsel, with further detail withheld under NDA;
              product modeling, PBR materials, and photorealistic visualization;
              product animation; and architectural visualization.
            </p>
          </div>
          <div className="about-actions">
            <ContactButton className="btn-primary">
              Let&apos;s Work Together
              <Arrow />
            </ContactButton>
            <ContactButton className="btn-ghost">
              Contact
            </ContactButton>
          </div>
        </div>

        <aside className="about-panel">
          <h2>What I Do</h2>
          <p>
            Imran is a 3D artist, animator, and motion designer working with AI
            video and Unreal Engine.
          </p>
          <h3>Core Expertise</h3>
          <ul className="about-expertise">
            {expertise.map((item) => (
              <li key={item.label}>
                <ExpertiseIcon name={item.icon} />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
          <h3>Tools / Workflow</h3>
          <ul className="about-tools">
            {tools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </aside>
      </section>
    </main>
  );
}
