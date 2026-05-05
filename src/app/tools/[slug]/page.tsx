import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoLandingPage } from "@/components/SeoLandingPage";
import { getToolSeoPage, toolSeoPages } from "@/lib/seo-pages";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://peptidecalculator.co";

export function generateStaticParams() {
  return toolSeoPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getToolSeoPage(slug);

  if (!page) {
    return {};
  }

  return {
    title: `${page.title} | PeptiCalc`,
    description: page.description,
    alternates: {
      canonical: `${siteUrl}/tools/${page.slug}`,
    },
    openGraph: {
      title: `${page.title} | PeptiCalc`,
      description: page.description,
      url: `${siteUrl}/tools/${page.slug}`,
      type: "website",
    },
  };
}

export default async function ToolSeoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getToolSeoPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <SeoLandingPage
      page={page}
      backHref="/calculator"
      backLabel="Back to calculator"
    />
  );
}
