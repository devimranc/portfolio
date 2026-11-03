import { ContactButton } from "@/components/contact/ContactProvider";

const social = [
  { label: "YouTube", icon: "youtube" },
  { label: "LinkedIn", icon: "linkedin" },
  { label: "Instagram", icon: "instagram" },
  { label: "Email", icon: "mail" },
] as const;

function SocialIcon({ icon }: { icon: (typeof social)[number]["icon"] }) {
  if (icon === "youtube") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
        <path d="M23 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C19.2 5.4 12 5.4 12 5.4s-7.2 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6zM9.8 15.5v-6.6l6.2 3.3-6.2 3.3z" />
      </svg>
    );
  }
  if (icon === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
        <path d="M4.7 3.3A2.2 2.2 0 1 0 4.7 7.7 2.2 2.2 0 0 0 4.7 3.3zM3 9h3.4v12H3zM9.2 9h3.2v1.6h.1c.4-.8 1.5-1.7 3.2-1.7 3.4 0 4 2.2 4 5.1V21H16.4v-5.3c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21H9.2z" />
      </svg>
    );
  }
  if (icon === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
        <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 1.8H7A2.2 2.2 0 0 0 4.8 7v10A2.2 2.2 0 0 0 7 19.2h10a2.2 2.2 0 0 0 2.2-2.2V7A2.2 2.2 0 0 0 17 4.8zM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8zm4.6-2.9a.9.9 0 1 1-.9.9.9.9 0 0 1 .9-.9z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
      <path d="M3 5.5h18v13H3v-13zm1.6 1.4v.3l7.4 5.2 7.4-5.2v-.3H4.6zm14.8 10.2V9.1l-6.8 4.8a1 1 0 0 1-1.2 0L4.6 9.1v7.9h14.8z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer border-t border-black/10">
      <div className="site-wrap flex flex-wrap items-center justify-between gap-3 py-5 text-sm">
        <p>Imran Chaudhry · Bolingbrook, IL, USA</p>
        <div className="flex items-center gap-4">
          {social.map((item) => (
            <ContactButton key={item.label} ariaLabel={item.label} className="opacity-80 hover:opacity-100">
              <SocialIcon icon={item.icon} />
            </ContactButton>
          ))}
        </div>
      </div>
    </footer>
  );
}
