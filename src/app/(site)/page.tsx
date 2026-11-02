import type { Metadata } from "next";
import Link from "next/link";
import {
  BackgroundSystem,
  GlowField,
  ParticleLayer,
  ScrollAurora,
} from "@/components/background";
import { HeroAmbient } from "@/components/home/HeroAmbient";
import { PracticeMarquee, ProjectStrip, ServicesTimeline, WorkStack } from "@/components/home/HomeSections";
import { projects } from "@/data/portfolio";
import { HomeIntro } from "@/components/home/HomeIntro";
import { HeroCharacterSlot } from "@/components/hero-character/HeroCharacterSlot";

export const metadata: Metadata = {
  title: {
    absolute: "Imran Chaudhry — 3D Artist, Animator & Motion Designer",
  },
};

const featured = projects.filter((project) => project.featured);

export default function HomePage() {
  return (
    <HomeIntro>
    <BackgroundSystem>
    <main>
      <section id="home" data-bg-anchor className="home-hero relative h-[100vh] overflow-hidden">
        <HeroAmbient />
        <HeroCharacterSlot />
        <div className="site-wrap relative z-10 flex h-full items-center py-20 md:py-28">
        <div className="hero-copy grid w-full gap-8">
        <p className="reveal text-xs font-medium tracking-[0.28em] text-white/70" style={{ animationDelay: "0.05s" }}>
          3D ANIMATION · MOTION DESIGN · AI VIDEO
        </p>
        <h1
          className="reveal max-w-5xl text-[3.4rem] font-black uppercase leading-[0.86] tracking-[-0.04em] sm:text-7xl md:text-8xl lg:text-[7.5rem]"
          style={{ animationDelay: "0.16s" }}
        >
          <span className="block text-white">Imran</span>
          <span className="block text-[#9aafc4]">Chaudhry</span>
        </h1>
        <p className="reveal text-sm tracking-wide text-white/55" style={{ animationDelay: "0.22s" }}>
          Bolingbrook, IL, USA
        </p>
        <p
          className="reveal max-w-2xl text-lg leading-relaxed text-white/75"
          style={{ animationDelay: "0.28s" }}
        >
          Imran Chaudhry works in 3D animation, motion design, AI video, and
          Unreal Engine. This portfolio shows character, product, environment,
          and real-time work.
        </p>
        <div className="reveal flex flex-wrap gap-3" style={{ animationDelay: "0.4s" }}>
          <Link href="/work" className="btn-primary">
            View work
          </Link>
          <Link href="/contact" className="btn-ghost">
            Start a project
          </Link>
        </div>
        <a href="#work" className="home-scroll-hint" aria-label="Scroll">
          <span className="home-scroll-line" />
        </a>
        </div>
        </div>
      </section>

      <PracticeMarquee />

      <section id="work" data-bg-anchor className="site-wrap relative pb-24">
        <ScrollAurora preset="royalCoral" travel={["-10%", "10%"]} opacity={[0.2, 0.6, 0.2]} />
        <div className="reveal-scroll mb-8 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-medium">Selected work</h2>
          <Link href="/work" className="text-sm underline">
            All projects
          </Link>
        </div>
        <ProjectStrip projects={featured} />
        <WorkStack projects={featured} />
      </section>

      <section id="services" data-bg-anchor className="relative border-t border-white/15">
        <ScrollAurora preset="lavenderAqua" travel={["-15%", "15%"]} opacity={[0.3, 0.7, 0.3]} />
        <div className="site-wrap py-20">
          <h2 className="reveal-scroll text-2xl font-medium">Expertise</h2>
          <ServicesTimeline />
          <Link href="/services" className="mt-8 inline-block text-sm underline">
            Services
          </Link>
        </div>
      </section>

      <section id="about" data-bg-anchor className="relative overflow-hidden border-t border-white/15">
        <ParticleLayer quantity={120} ease={80} color="#ffffff" refresh />
        <GlowField preset="contact" />
        <div className="site-wrap reveal-scroll grid gap-6 py-20 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-medium">About</h2>
            <p className="mt-4 max-w-xl leading-relaxed text-white/75">
              Imran Chaudhry is a 3D animator and motion designer based in
              Bolingbrook, Illinois. His work covers character rigging and
              animation, product visualization, architectural visualization,
              Unreal Engine, VR, and AI-assisted video.
            </p>
            <Link href="/about" className="mt-6 inline-block text-sm underline">
              Read more
            </Link>
          </div>
          <div id="contact" className="glass-strong flex flex-col justify-end p-8">
            <h2 className="text-2xl font-medium">Available for new work</h2>
            <p className="mt-3 text-white/75">
              Send a project inquiry from the contact page.
            </p>
            <Link
              href="/contact"
              className="mt-6 w-fit border border-white px-5 py-3 text-sm text-white"
            >
              Contact
            </Link>
          </div>
        </div>
      </section>
    </main>
    </BackgroundSystem>
    </HomeIntro>
  );
}
