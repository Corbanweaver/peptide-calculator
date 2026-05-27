import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoLandingPage } from "@/components/SeoLandingPage";
import {
  compoundSeoPages,
  getCompoundSeoPage,
} from "@/lib/seo-pages";
import { absoluteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return compoundSeoPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getCompoundSeoPage(slug);

  if (!page) {
    return {};
  }

  return {
    title: `${page.title} | PeptiCalc`,
    description: page.description,
    alternates: {
      canonical: absoluteUrl(`/peptides/${page.slug}`),
    },
    openGraph: {
      title: `${page.title} | PeptiCalc`,
      description: page.description,
      url: absoluteUrl(`/peptides/${page.slug}`),
      type: "website",
    },
  };
}

export default async function CompoundSeoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getCompoundSeoPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <SeoLandingPage
      page={page}
      backHref="/peptides"
      backLabel="Back to peptide library"
      currentHref={`/peptides/${page.slug}`}
      sectionLabel="Peptide library"
      sectionHref="/peptides"
    />
  );
}
