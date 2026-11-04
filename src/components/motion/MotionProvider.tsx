"use client";

import { MotionCapabilityProvider } from "@/hooks/use-motion-capability";
import { ClickPulseEngine } from "@/components/motion/ClickPulseEngine";
import { FluidCanvasOverlay } from "@/components/motion/FluidCanvasOverlay";
import { GlassTiltEngine } from "@/components/motion/GlassTiltEngine";
import { PageNavigationBridge } from "@/components/motion/PageNavigationBridge";
import { PageTransitionShell } from "@/components/motion/PageTransitionShell";
import { ScrollRevealEngine } from "@/components/motion/ScrollRevealEngine";
import { SmoothScrollLenis } from "@/components/motion/SmoothScrollLenis";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionCapabilityProvider>
      <SmoothScrollLenis />
      <ScrollRevealEngine />
      <GlassTiltEngine />
      <ClickPulseEngine />
      <PageNavigationBridge />
      <FluidCanvasOverlay />
      <PageTransitionShell>{children}</PageTransitionShell>
    </MotionCapabilityProvider>
  );
}
