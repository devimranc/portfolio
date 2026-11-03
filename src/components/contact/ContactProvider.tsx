"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import "@/styles/contact-modal.css";

type ContactContextValue = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

const ContactContext = createContext<ContactContextValue | null>(null);

export function useContact() {
  const value = useContext(ContactContext);
  if (!value) throw new Error("useContact must be used within ContactProvider");
  return value;
}

export function ContactButton({
  className,
  children,
  ariaLabel,
}: {
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  const { open } = useContact();
  return (
    <button type="button" className={className} aria-label={ariaLabel} onClick={open}>
      {children}
    </button>
  );
}

function FieldIcon({ kind }: { kind: "user" | "mail" | "message" }) {
  if (kind === "user") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
        <circle cx="12" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M6 19c1.1-2.6 3.1-3.8 6-3.8s4.9 1.2 6 3.8" />
      </svg>
    );
  }
  if (kind === "mail") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
        <rect x="3.5" y="5.5" width="17" height="13" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path fill="none" stroke="currentColor" strokeWidth="1.6" d="m4.5 7 7.5 6L19.5 7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
      <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M6 16.5 4.5 20l3.8-1.4A8.5 8.5 0 1 0 6 16.5Z" />
    </svg>
  );
}

export function ContactProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setNotice("");
    setVisible(true);
    requestAnimationFrame(() => setIsOpen(true));
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    window.setTimeout(() => {
      setVisible(false);
      previousFocus.current?.focus();
    }, 280);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("This form is not connected to an email service, so the message was not sent.");
  }

  return (
    <ContactContext.Provider value={{ open, close, isOpen }}>
      {children}
      {visible ? (
        <div className={`contact-overlay${isOpen ? " is-open" : ""}`} onClick={close}>
          <div
            className="contact-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(event) => event.stopPropagation()}
          >
            <button ref={closeRef} type="button" className="contact-close" aria-label="Close" onClick={close}>
              <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
                <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
            <div className="contact-info">
              <p className="contact-kicker">Get in touch</p>
              <h2 id={titleId}>
                Let&apos;s Work
                <span>Together</span>
              </h2>
              <p>Have a project in mind? Use the form to draft an inquiry.</p>
              <p className="contact-place">
                <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
                  <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
                  <circle cx="12" cy="11" r="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                Bolingbrook, IL, USA
              </p>
              <p className="contact-note">
                It stays in the browser because no email service is connected.
              </p>
            </div>
            <div className="contact-form-pane">
              <form className="contact-form" onSubmit={onSubmit}>
                <label>
                  Name
                  <span className="contact-field">
                    <FieldIcon kind="user" />
                    <input name="name" required placeholder="Your name" autoComplete="name" />
                  </span>
                </label>
                <label>
                  Email
                  <span className="contact-field">
                    <FieldIcon kind="mail" />
                    <input name="email" type="email" required placeholder="Your email" autoComplete="email" />
                  </span>
                </label>
                <label>
                  Message
                  <span className="contact-field">
                    <FieldIcon kind="message" />
                    <textarea name="message" required rows={5} placeholder="Tell me about your project..." />
                  </span>
                </label>
                <button type="submit" className="btn-primary">
                  Send Inquiry
                  <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
                    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
                <p className="contact-status" role="status">
                  {notice || "Submitting this form does not send a message. No mail service is connected."}
                </p>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </ContactContext.Provider>
  );
}
