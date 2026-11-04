"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { UPWORK_PROFILE_URL } from "@/constants/contact";
import { useMotionCapability } from "@/hooks/use-motion-capability";
import { lockMotionScroll, unlockMotionScroll } from "@/lib/motion/lenis-instance";
import { gsap, ensureGsapPlugins } from "@/lib/motion/gsap-client";
import "@/styles/contact-modal.css";

type ContactOrigin = { x: number; y: number };

type ContactContextValue = {
  open: (origin?: ContactOrigin) => void;
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
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      onClick={(event: MouseEvent<HTMLButtonElement>) =>
        open({ x: event.clientX, y: event.clientY })
      }
    >
      {children}
    </button>
  );
}

export function ContactProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const floatTween = useRef<gsap.core.Tween | null>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const openOrigin = useRef<ContactOrigin>({ x: 0, y: 0 });
  const [portalReady, setPortalReady] = useState(false);
  const { scrollReveal } = useMotionCapability();
  const upworkReady = UPWORK_PROFILE_URL.trim().length > 0;

  useEffect(() => {
    setPortalReady(true);
  }, []);

  const open = useCallback((origin?: ContactOrigin) => {
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    openOrigin.current = origin ?? {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
    setVisible(true);
    requestAnimationFrame(() => setIsOpen(true));
  }, []);

  const close = useCallback(() => {
    const modal = modalRef.current;
    const overlay = overlayRef.current;

    if (scrollReveal && modal && overlay) {
      ensureGsapPlugins();
      floatTween.current?.kill();
      floatTween.current = null;

      gsap.to(modal, {
        scale: 0.94,
        opacity: 0,
        y: 12,
        duration: 0.22,
        ease: "power2.in",
        force3D: true,
      });
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => {
          setIsOpen(false);
          setVisible(false);
          previousFocus.current?.focus();
        },
      });
      return;
    }

    setIsOpen(false);
    window.setTimeout(() => {
      setVisible(false);
      previousFocus.current?.focus();
    }, 280);
  }, [scrollReveal]);

  useEffect(() => {
    if (!isOpen || !visible) return;

    const modal = modalRef.current;
    const overlay = overlayRef.current;
    if (!modal || !overlay) return;

    if (!scrollReveal) {
      modal.classList.add("motion-modal-active");
      return;
    }

    ensureGsapPlugins();
    modal.classList.add("motion-modal-active");

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const originX = openOrigin.current.x - centerX;
    const originY = openOrigin.current.y - centerY;

    gsap.set(overlay, { opacity: 0 });
    gsap.set(modal, {
      x: originX,
      y: originY,
      scale: 0.2,
      opacity: 0,
      force3D: true,
    });

    gsap.to(overlay, { opacity: 1, duration: 0.35, ease: "power2.out" });
    gsap.to(modal, {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 0.95,
      ease: "elastic.out(1, 0.75)",
      force3D: true,
      onComplete: () => {
        floatTween.current?.kill();
        floatTween.current = gsap.to(modal, {
          y: "+=10",
          duration: 2.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          force3D: true,
        });
      },
    });

    return () => {
      floatTween.current?.kill();
      floatTween.current = null;
    };
  }, [isOpen, visible, scrollReveal]);

  useEffect(() => {
    if (!visible) return;

    lockMotionScroll();
    document.documentElement.classList.add("contact-modal-open");

    return () => {
      document.documentElement.classList.remove("contact-modal-open");
      unlockMotionScroll();
    };
  }, [visible]);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  return (
    <ContactContext.Provider value={{ open, close, isOpen }}>
      {children}
      {visible && portalReady
        ? createPortal(
            <div
              ref={overlayRef}
              className={`contact-overlay${isOpen ? " is-open" : ""}${scrollReveal ? " contact-overlay-motion" : ""}`}
              onClick={close}
              onWheel={(event) => {
                if (event.target === event.currentTarget) event.preventDefault();
              }}
              onTouchMove={(event) => {
                if (event.target === event.currentTarget) event.preventDefault();
              }}
            >
              <div
                ref={modalRef}
                className="contact-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                data-lenis-prevent
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
                  <p>Have a project in mind? Connect on Upwork to start a conversation.</p>
                  <p className="contact-place">
                    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
                      <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
                      <circle cx="12" cy="11" r="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                    Bolingbrook, IL, USA
                  </p>
                </div>
                <div className="contact-action-pane">
                  <p className="contact-action-lead">
                    New inquiries go through Upwork so scope, timeline, and contracts stay in one place.
                  </p>
                  {upworkReady ? (
                    <a
                      href={UPWORK_PROFILE_URL}
                      className="btn-primary contact-upwork-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Upwork profile
                      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 17 17 7M9 7h8v8"
                        />
                      </svg>
                    </a>
                  ) : null}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </ContactContext.Provider>
  );
}
