"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [notice, setNotice] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(
      "This form is not connected to an email service, so the message was not sent.",
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-xl gap-4">
      <label className="grid gap-2 text-sm">
        Name
        <input
          name="name"
          required
          className="border border-black/20 px-3 py-3"
        />
      </label>
      <label className="grid gap-2 text-sm">
        Email
        <input
          name="email"
          type="email"
          required
          className="border border-black/20 px-3 py-3"
        />
      </label>
      <label className="grid gap-2 text-sm">
        Message
        <textarea
          name="message"
          required
          rows={6}
          className="border border-black/20 px-3 py-3"
        />
      </label>
      <button
        type="submit"
        className="w-fit border border-black bg-black px-5 py-3 text-sm text-white"
      >
        Submit inquiry
      </button>
      {notice ? (
        <p role="status" className="text-sm">
          {notice}
        </p>
      ) : (
        <p className="text-sm text-black/60">
          Submitting this form does not send a message. No mail service is
          connected.
        </p>
      )}
    </form>
  );
}
