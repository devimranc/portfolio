import { type FC } from "react";

const PAGE = "26, 36, 51";

export const GlobeScrim: FC = () => (
  <>
    <div
      className="absolute inset-0"
      style={{ background: `rgba(${PAGE}, 0.08)` }}
    />
    <div
      className="absolute inset-0"
      style={{
        background: `radial-gradient(130% 110% at 50% 40%, rgba(${PAGE}, 0) 55%, rgba(${PAGE}, 0.18) 100%)`,
      }}
    />
    <div
      className="absolute inset-x-0 top-0 h-28"
      style={{
        background: `linear-gradient(to bottom, rgba(${PAGE}, 0.9), rgba(${PAGE}, 0))`,
      }}
    />
  </>
);
