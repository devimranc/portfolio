import { Fragment, type ReactNode } from "react";

function linkLabel(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host === "memsel.com") return "memsel.com";
    if (host === "theprison.com") return "theprison.com";
    return host;
  } catch {
    return url;
  }
}

/** Inline links for URLs in project sidebar copy. */
export function projectRichText(text: string): ReactNode {
  const pattern = /https:\/\/[^\s]+/g;
  const parts: ReactNode[] = [];
  let cursor = 0;
  let key = 0;

  for (const match of text.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > cursor) parts.push(text.slice(cursor, start));
    const url = match[0];
    parts.push(
      <a key={key++} href={url} className="project-inline-link" target="_blank" rel="noopener noreferrer">
        {linkLabel(url)}
      </a>,
    );
    cursor = start + url.length;
  }

  if (cursor < text.length) parts.push(text.slice(cursor));
  if (!parts.length) return text;
  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>{part}</Fragment>
      ))}
    </>
  );
}
