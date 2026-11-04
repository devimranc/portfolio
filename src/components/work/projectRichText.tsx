import { Fragment, type ReactNode } from "react";

/** Highlights Memsel + memsel.com in project sidebar copy. */
export function projectRichText(text: string): ReactNode {
  const pattern = /Memsel\s+(https:\/\/www\.memsel\.com)/gi;
  const parts: ReactNode[] = [];
  let cursor = 0;
  let key = 0;

  for (const match of text.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > cursor) parts.push(text.slice(cursor, start));
    parts.push(
      <a
        key={key++}
        href={match[1]}
        className="project-inline-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        Memsel — memsel.com
      </a>,
    );
    cursor = start + match[0].length;
  }

  if (cursor < text.length) parts.push(text.slice(cursor));
  if (!parts.length) return text;
  return <>{parts.map((part, index) => <Fragment key={index}>{part}</Fragment>)}</>;
}
