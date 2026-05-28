"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

type SeoLandingMetadata = {
  pageSlug: string;
  pageSection: string;
  pageHref: string;
  searchPhrase?: string;
};

type SeoTrackedLinkProps = {
  action: string;
  children: ReactNode;
  className?: string;
  href: string;
  label?: string;
  metadata: SeoLandingMetadata;
};

export function SeoLandingAnalytics({
  metadata,
}: {
  metadata: SeoLandingMetadata;
}) {
  const trackedKey = useRef("");

  useEffect(() => {
    const key = `${metadata.pageSection}:${metadata.pageSlug}`;

    if (trackedKey.current === key) {
      return;
    }

    trackedKey.current = key;
    trackEvent("seo_landing_viewed", {
      page_slug: metadata.pageSlug,
      page_section: metadata.pageSection,
      page_href: metadata.pageHref,
      search_phrase: metadata.searchPhrase ?? null,
    });
  }, [metadata]);

  return null;
}

export function SeoTrackedLink({
  action,
  children,
  className,
  href,
  label,
  metadata,
}: SeoTrackedLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackSeoLandingAction("seo_landing_link_clicked", metadata, {
        action,
        destination: href,
        label,
      })}
    >
      {children}
    </Link>
  );
}

export function SeoTrackedAnchor({
  action,
  children,
  className,
  href,
  label,
  metadata,
}: SeoTrackedLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
      onClick={() => trackSeoLandingAction("seo_landing_link_clicked", metadata, {
        action,
        destination: href,
        label,
      })}
    >
      {children}
    </a>
  );
}

function trackSeoLandingAction(
  eventName: string,
  metadata: SeoLandingMetadata,
  action: {
    action: string;
    destination: string;
    label?: string;
  },
) {
  trackEvent(eventName, {
    page_slug: metadata.pageSlug,
    page_section: metadata.pageSection,
    page_href: metadata.pageHref,
    search_phrase: metadata.searchPhrase ?? null,
    action: action.action,
    destination: action.destination,
    label: action.label ?? null,
  });
}
