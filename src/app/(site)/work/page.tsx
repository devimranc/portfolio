import type { Metadata } from "next";
import { CategoryGrid } from "@/components/work/CategoryGrid";
import { CategoryNav } from "@/components/work/CategoryNav";

export const metadata: Metadata = {
  title: "My Work",
  description:
    "Selected 3D, animation, visualization, Unreal Engine, VR, and motion design projects by Imran Chaudhry.",
};

export default function WorkPage() {
  return (
    <main>
      <section className="site-wrap py-16 md:py-20">
        <p className="text-sm tracking-[0.16em] text-black/50 uppercase">Work</p>
        <h1 className="work-rise mt-4 max-w-3xl text-4xl font-medium tracking-tight md:text-5xl">
          My Work
        </h1>
        <p className="work-rise mt-6 max-w-2xl text-lg leading-relaxed text-black/75">
          Imran Chaudhry is a 3D animator and motion designer in Bolingbrook,
          Illinois. His work covers character modeling and rigging, product
          visualization and assembly animation, architectural stills and
          walkthroughs, Unreal Engine and VR, 2D motion design, and AI-assisted
          video. The categories below collect that work. Open a category to see
          its projects, then open a project for the stills, clips, and files
          that can be shown.
        </p>
      </section>
      <section className="bg-[#1a2433] text-[#f4f6f8]">
        <div className="site-wrap py-14 md:py-20">
          <CategoryNav active="all" />
          <CategoryGrid />
        </div>
      </section>
    </main>
  );
}
