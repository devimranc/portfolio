import type { MediaItem } from "@/data/portfolio";

export function mediaSrc(src: string) {
  return src
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

export function ProjectMedia({
  item,
  priority = false,
  cover = false,
}: {
  item: MediaItem;
  priority?: boolean;
  cover?: boolean;
}) {
  if (item.kind === "video") {
    return (
      <video
        className={`fluid-media-host ${cover ? "pointer-events-none" : ""} h-full w-full bg-neutral-100 object-cover`}
        controls={!cover}
        muted={cover}
        playsInline
        preload="metadata"
        aria-label={item.alt}
      >
        <source src={mediaSrc(item.src)} />
      </video>
    );
  }

  if (item.kind === "file") {
    const className = "flex h-full w-full items-end bg-[#1a2433] p-5 text-sm text-[#f4f6f8]";
    if (cover) return <div className={className}>{item.alt}</div>;
    return (
      <a href={mediaSrc(item.src)} className={className}>
        {item.alt}
      </a>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={mediaSrc(item.src)}
      alt={item.alt}
      className="fluid-media-host h-full w-full object-cover"
      loading={priority ? "eager" : "lazy"}
    />
  );
}
