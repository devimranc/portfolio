import Link from "next/link";
import { ProjectMedia } from "@/components/work/ProjectMedia";
import { categoryLabel, coverMedia } from "@/data/portfolio";
import type { WorkProject } from "@/data/zain-drive";

function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 1.2 13.15 8.4 20.8 9.55 14.7 13.05 16.85 20.8 12 16.55 7.15 20.8 9.3 13.05 3.2 9.55 10.85 8.4 12 1.2Z"
      />
    </svg>
  );
}

export function CategoryProjects({ projects }: { projects: WorkProject[] }) {
  return (
    <div className="project-feature-list">
      {projects.map((project, index) => {
        const cover = coverMedia(project.media);
        return (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            className="project-feature-slot work-rise focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d5deea]"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <article className="project-feature">
              <div className="project-feature-shot">
                {cover ? (
                  <div className="work-card-media h-full w-full">
                    <ProjectMedia item={cover} cover priority={index === 0} />
                  </div>
                ) : (
                  <div className="flex h-full items-end p-6 text-sm text-[#d5deea]">Visuals withheld</div>
                )}
              </div>
              <div className="project-feature-copy">
                <p className="project-feature-kicker">{categoryLabel(project.category)}</p>
                <h2 className="project-feature-title">{project.title}</h2>
              </div>
              {project.summary ? <p className="project-feature-glass">{project.summary}</p> : null}
              <div className="project-feature-sparkles">
                <Sparkle />
                <Sparkle />
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
}
