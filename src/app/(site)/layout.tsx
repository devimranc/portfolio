import { ContactProvider } from "@/components/contact/ContactProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ContactProvider>
      <SiteHeader />
      {children}
      <SiteFooter />
    </ContactProvider>
  );
}
