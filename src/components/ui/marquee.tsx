"use client";

import { type FC, type HTMLAttributes, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
  repeat?: number;
  children?: ReactNode;
}

export const Marquee: FC<MarqueeProps> = ({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}) => (
  <div
    {...props}
    className={twMerge(
      `group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)] ${
        vertical ? "flex-col" : "flex-row"
      }`,
      className
    )}
  >
    {Array.from({ length: repeat }, (_, i) => (
      <div
        key={i}
        className={twMerge(
          "flex shrink-0 justify-around [gap:var(--gap)]",
          vertical ? "animate-marquee-vertical flex-col" : "animate-marquee flex-row",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]"
        )}
      >
        {children}
      </div>
    ))}
  </div>
);

/** Fades the left and right edges of a marquee into the page color. */
export const MarqueeFade: FC<{ width?: string }> = ({ width = "w-1/5" }) => (
  <>
    <div className={`pointer-events-none absolute inset-y-0 left-0 ${width} bg-gradient-to-r from-[#1a2433] to-transparent`} />
    <div className={`pointer-events-none absolute inset-y-0 right-0 ${width} bg-gradient-to-l from-[#1a2433] to-transparent`} />
  </>
);
