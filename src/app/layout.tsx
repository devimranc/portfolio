import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Imran Chaudhry — 3D Artist, Animator & Motion Designer",
    template: "%s — Imran Chaudhry",
  },
  description:
    "Portfolio of Imran Chaudhry, a 3D animator and motion designer in Bolingbrook, Illinois. Character animation, product visualization, Unreal Engine, VR, and AI video.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
