import { ContactProvider } from "@/components/contact/ContactProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MotionProvider } from "@/components/motion/MotionProvider";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <ContactProvider>
        <SiteHeader />
        {children}
        <SiteFooter />
      </ContactProvider>
    </MotionProvider>
  );
}
