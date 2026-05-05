"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function GoogleAnalyticsPageView({
  measurementId,
}: {
  measurementId?: string;
}) {
  if (!measurementId) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <PageViewTracker measurementId={measurementId} />
    </Suspense>
  );
}

function PageViewTracker({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const skippedInitialPageView = useRef(false);

  useEffect(() => {
    if (!window.gtag || !pathname) {
      return;
    }

    if (!skippedInitialPageView.current) {
      skippedInitialPageView.current = true;
      return;
    }

    const queryString = searchParams.toString();
    const pagePath = queryString ? `${pathname}?${queryString}` : pathname;

    window.gtag("event", "page_view", {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
      send_to: measurementId,
    });
  }, [measurementId, pathname, searchParams]);

  return null;
}
