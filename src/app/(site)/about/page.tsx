import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Imran Chaudhry is a 3D animator and motion designer in Bolingbrook, Illinois.",
};

export default function AboutPage() {
  return (
    <main className="site-wrap py-16">
      <p className="text-sm tracking-wide">Bolingbrook, IL, USA</p>
      <h1 className="mt-4 max-w-3xl text-4xl font-medium tracking-tight">
        Imran Chaudhry
      </h1>
      <p className="mt-3 text-lg">3D Animator & Motion Designer</p>
      <div className="mt-10 grid max-w-2xl gap-5 text-lg leading-relaxed">
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
      <Link href="/contact" className="mt-10 inline-block text-sm underline">
        Contact
      </Link>
    </main>
  );
}
