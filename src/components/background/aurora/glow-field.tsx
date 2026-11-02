import { type FC } from "react";
import { AURORA_PRESETS } from "@/constants/aurora-presets";
import { type GlowBlob } from "@/types/background-types";

interface GlowFieldProps {
  preset?: string;
  blobs?: GlowBlob[];
  className?: string;
}

/** Static color wash. Place it inside any `relative` region. */
export const GlowField: FC<GlowFieldProps> = ({
  preset = "contact",
  blobs,
  className = "pointer-events-none absolute inset-0 -z-10",
}) => {
  const layers = blobs ?? AURORA_PRESETS[preset] ?? AURORA_PRESETS.contact;

  return (
    <div aria-hidden className={className}>
      {layers.map((blob) => (
        <div key={blob.className} className={blob.className} />
      ))}
    </div>
  );
};
