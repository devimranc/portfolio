"use client";

import Link from "next/link";
import { ProjectMedia } from "@/components/work/ProjectMedia";
import { categories, categoryLabel, services, type Project } from "@/data/portfolio";
import { formatCounter } from "@/lib/format";
import {
  GlassCard,
  Marquee,
  MarqueeFade,
  PillLabel,
  StackCard,
  TiltFrame,
  TimelineItem,
  TimelineRail,
} from "@/components/ui";

export function WorkStack({ projects }: { projects: Project[] }) {
  return (
    <div className="space-y-8">
      {projects.map((project, index) => {
        const cover = project.media[0];
        return (
          <StackCard key={project.slug} index={index} total={projects.length}>
            <div className="flex flex-col justify-center lg:col-span-5">
              <PillLabel>{categoryLabel(project.category)}</PillLabel>
              <h3 className="mt-4 text-3xl font-medium tracking-tight text-white md:text-5xl">
                {project.title}
              </h3>
              <p className="mt-4 max-w-md leading-relaxed text-white/70">{project.summary}</p>
              <p className="mt-6 text-sm tracking-[0.2em] text-white/45">
                {formatCounter(index, projects.length)}
              </p>
              <Link href={`/work/${project.slug}`} className="btn-ghost mt-8 w-fit">
                View project
              </Link>
            </div>
            <div className="lg:col-span-7">
              <TiltFrame>
                {cover ? (
                  <ProjectMedia item={cover} cover />
                ) : (
                  <div className="flex h-full items-end p-6 text-sm text-white/70">
                    Visuals withheld
                  </div>
                )}
              </TiltFrame>
            </div>
          </StackCard>
        );
      })}
    </div>
  );
}

export function ProjectStrip({ projects }: { projects: Project[] }) {
  return (
    <div className="relative mb-10 overflow-hidden">
      <Marquee pauseOnHover className="[--duration:42s] [--gap:1rem]">
        {projects.map((project) => {
          const cover = project.media[0];
          return (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="glass gradient-border block w-72 shrink-0 p-3 transition-transform hover:-translate-y-1"
            >
              <div className="aspect-[16/10] overflow-hidden rounded-xl">
                {cover ? <ProjectMedia item={cover} cover /> : null}
              </div>
              <p className="mt-3 text-xs tracking-wide text-white/55">
                {categoryLabel(project.category)}
              </p>
              <h3 className="mt-1 text-base font-medium text-white">{project.title}</h3>
            </Link>
          );
        })}
      </Marquee>
      <MarqueeFade />
    </div>
  );
}

export function PracticeMarquee() {
  return (
    <div className="relative overflow-hidden py-6">
      <Marquee pauseOnHover className="[--duration:36s] [--gap:0.75rem]">
        {categories.map((category) => (
          <span key={category.id} className="chip-lg">
            {category.label}
          </span>
        ))}
      </Marquee>
      <MarqueeFade />
    </div>
  );
}

export function ServicesTimeline() {
  return (
    <TimelineRail>
      {services.map((service, index) => (
        <TimelineItem
          key={service.id}
          index={index}
          marker={<h3 className="text-lg font-medium text-white md:text-2xl">{service.title}</h3>}
          body={
            <GlassCard delay={0.05}>
              <p className="leading-relaxed text-white/75">{service.body}</p>
            </GlassCard>
          }
        />
      ))}
    </TimelineRail>
  );
}
