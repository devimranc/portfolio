"use client";

import dynamic from "next/dynamic";

const Hero3DCharacter = dynamic(
  () => import("@/components/hero-character/Hero3DCharacter"),
  { ssr: false }
);

export function HeroCharacterSlot() {
  return (
    <div className="hero-character-slot" aria-hidden>
      <Hero3DCharacter />
    </div>
  );
}
