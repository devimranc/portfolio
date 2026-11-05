"use client";

export const ROUTE_PREFETCH_MAX_MS = 2400;

function waitFrames(count = 2): Promise<void> {
  return new Promise((resolve) => {
    let left = count;
    const step = () => {
      left -= 1;
      if (left <= 0) resolve();
      else requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

function prefetchDocument(href: string): Promise<void> {
  return new Promise((resolve) => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "document";
    link.href = href;
    const finish = () => resolve();
    link.addEventListener("load", finish, { once: true });
    link.addEventListener("error", finish, { once: true });
    document.head.appendChild(link);
    window.setTimeout(finish, ROUTE_PREFETCH_MAX_MS);
  });
}

/** Warm the target route before playing exit / calling router.push. */
export async function prepareRouteNavigation(
  router: { prefetch: (href: string) => void },
  href: string,
): Promise<void> {
  router.prefetch(href);
  await Promise.race([
    prefetchDocument(href),
    waitFrames(3),
    new Promise<void>((resolve) => window.setTimeout(resolve, 180)),
  ]);
}
