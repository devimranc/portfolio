import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactButton } from "@/components/contact/ContactProvider";
import {
  BackgroundSystem,
  GlowField,
  ParticleLayer,
  ScrollAurora,
} from "@/components/background";
import { HeroAmbient } from "@/components/home/HeroAmbient";
import { PracticeMarquee, ServicesTimeline, WorkStack } from "@/components/home/HomeSections";
import { getWorkProjects } from "@/data/zain-drive";
import { HomeIntro } from "@/components/home/HomeIntro";

export const metadata: Metadata = {
  title: {
    absolute: "Imran Chaudhry — 3D Artist, Animator & Motion Designer",
  },
};

const featuredOrder = [
  "dragon-game-art",
  "zain-architectural-game-assets",
  "superhero-character",
];

const work = getWorkProjects();
const featured = featuredOrder.flatMap((slug) => {
  const project = work.find((item) => item.slug === slug);
  return project ? [project] : [];
});

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="h-3.5 w-3.5">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const stats = [
  { value: "5+", label: "Years Experience", icon: "case" },
  { value: "50+", label: "Projects Completed", icon: "stack" },
  { value: "20+", label: "Happy Clients", icon: "people" },
] as const;

function StatIcon({ icon }: { icon: (typeof stats)[number]["icon"] }) {
  if (icon === "case") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M8 7V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1h3v12H5V7h3zm2 0h4V6h-4v1z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  if (icon === "stack") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M12 4 4 8l8 4 8-4-8-4zm-8 8 8 4 8-4M4 16l8 4 8-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <circle cx="9" cy="9" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="10" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.5 18c.6-2.2 2.4-3.2 4.5-3.2s3.9 1 4.5 3.2M14 14.8c1.3-.5 2.6-.4 3.8.4 1 .6 1.6 1.6 1.8 2.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <HomeIntro>
    <BackgroundSystem>
    <main data-motion-root>
      <section id="home" data-bg-anchor className="home-hero relative h-[100vh] overflow-hidden">
        <HeroAmbient />
        <div className="hero-visual" aria-hidden>
          <Image
            src="/hero-img.png"
            alt=""
            fill
            priority
            sizes="(max-width: 767px) 100vw, 46vw"
            className="hero-visual-img"
          />
        </div>
        <div className="site-wrap relative z-10 flex h-full items-center py-16 md:py-20">
        <div className="hero-copy grid w-full gap-5">
        <p className="reveal text-[13px] font-medium tracking-[0.32em] text-white/60" style={{ animationDelay: "0.05s" }}>
          3D ANIMATION · MOTION DESIGN · AI VIDEO
        </p>
        <h1
          className="reveal font-black uppercase tracking-[-0.035em] text-white"
          style={{ animationDelay: "0.16s" }}
        >
          <span className="block">Imran</span>
          <span className="block text-[#c5d0dc]">Chaudhry</span>
        </h1>
        <p className="reveal text-base text-white/55" style={{ animationDelay: "0.22s" }}>
          Bolingbrook, IL, USA
        </p>
        <p
          className="reveal max-w-xl text-lg leading-relaxed text-white/75"
          style={{ animationDelay: "0.28s" }}
        >
          Imran Chaudhry works in 3D animation, motion design, AI video, and
          Unreal Engine. This portfolio shows character, product, environment,
          and real-time work.
        </p>
        <div className="reveal flex flex-wrap items-center gap-5" style={{ animationDelay: "0.4s" }}>
          <Link href="/work" className="btn-primary">
            View work
            <Arrow />
          </Link>
          <ContactButton className="home-text-link">
            Start a project
            <Arrow />
          </ContactButton>
        </div>
        <ul className="home-stats" data-reveal-stagger>
          {stats.map((stat, index) => (
            <li key={stat.label} className="reveal" style={{ animationDelay: `${0.48 + index * 0.08}s` }}>
              <span className="home-stat-icon">
                <StatIcon icon={stat.icon} />
              </span>
              <span>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </span>
            </li>
          ))}
        </ul>
        <a href="#work" className="home-scroll-hint" aria-label="Scroll">
          <span className="home-scroll-line" />
        </a>
        </div>
        </div>
      </section>

      <PracticeMarquee />

      <section id="work" data-bg-anchor data-parallax="0.06" className="site-wrap relative pb-4 pt-2 md:pt-4">
        <ScrollAurora preset="royalCoral" travel={["-10%", "10%"]} opacity={[0.2, 0.6, 0.2]} />
        <div className="reveal-scroll mb-5 flex items-end justify-between gap-4 md:mb-6">
          <h2 data-split-heading className="text-[1.65rem] font-semibold tracking-tight">
            Selected work
          </h2>
          <Link href="/work" className="home-text-link text-sm">
            All projects
            <Arrow />
          </Link>
        </div>
        <WorkStack projects={featured} />
      </section>

      <section id="services" data-bg-anchor className="relative">
        <ScrollAurora preset="lavenderAqua" travel={["-15%", "15%"]} opacity={[0.3, 0.7, 0.3]} />
        <div className="site-wrap pb-6 pt-0">
          <div className="reveal-scroll flex items-end justify-between gap-4">
            <h2 data-split-heading className="text-[1.65rem] font-semibold tracking-tight">
              Expertise
            </h2>
            <Link href="/services" className="home-text-link text-sm">
              Services
              <Arrow />
            </Link>
          </div>
          <ServicesTimeline />
        </div>
      </section>

      <section id="about" data-bg-anchor className="relative overflow-hidden">
        <ParticleLayer quantity={64} ease={80} size={0.28} color="#ffffff" refresh />
        <GlowField preset="contact" />
        <div className="site-wrap reveal-scroll grid items-center gap-5 py-6 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 data-split-heading className="text-[1.65rem] font-semibold tracking-tight">
              About
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/65">
              I am a 3D animator and motion designer based in Bolingbrook,
              Illinois. My work covers character rigging and animation, product
              visualization, architectural visualization, Unreal Engine, VR, and
              AI-assisted video.
            </p>
            <Link href="/about" className="home-text-link mt-5 text-sm">
              Read more
              <Arrow />
            </Link>
          </div>
          <div
            id="contact"
            className="home-cta glass-strong flex flex-col justify-center p-6 md:p-7"
            data-glass-tilt
          >
            <h2 className="text-[1.7rem] font-semibold tracking-tight">Available for new work</h2>
            <p className="mt-2 max-w-sm text-sm text-white/60">
              Open the contact popup to reach me on Upwork.
            </p>
            <ContactButton className="btn-primary mt-6 w-fit">
              Contact
              <Arrow />
            </ContactButton>
          </div>
        </div>
      </section>
    </main>
    </BackgroundSystem>
    </HomeIntro>
  );
}
