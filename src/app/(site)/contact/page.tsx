"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useContact } from "@/components/contact/ContactProvider";

export default function ContactPage() {
  const { open } = useContact();
  const router = useRouter();

  useEffect(() => {
    open();
    router.replace("/");
  }, [open, router]);

  return null;
}
