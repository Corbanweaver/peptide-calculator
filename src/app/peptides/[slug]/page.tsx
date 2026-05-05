import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoLandingPage } from "@/components/SeoLandingPage";
import {
  compoundSeoPages,
  getCompoundSeoPage,
} from "@/lib/seo-pages";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://peptidecalculator.co";

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
      canonical: `${siteUrl}/peptides/${page.slug}`,
    },
    openGraph: {
      title: `${page.title} | PeptiCalc`,
      description: page.description,
      url: `${siteUrl}/peptides/${page.slug}`,
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
    />
  );
}
