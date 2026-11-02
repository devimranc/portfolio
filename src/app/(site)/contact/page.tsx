import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Imran Chaudhry in Bolingbrook, Illinois.",
};

export default function ContactPage() {
  return (
    <main className="site-wrap py-16">
      <h1 className="text-4xl font-medium tracking-tight">Contact</h1>
      <p className="mt-4 max-w-xl leading-relaxed text-black/75">
        Imran Chaudhry · Bolingbrook, IL, USA. Use the form to draft an
        inquiry. It stays in the browser because no email service is connected.
      </p>
      <div className="mt-10">
        <ContactForm />
      </div>
    </main>
  );
}
