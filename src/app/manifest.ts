import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PeptiCalc Peptide Calculator",
    short_name: "PeptiCalc",
    description:
      "A simple peptide calculator for concentration, syringe marks, BAC water math, and saved calculation notes.",
    start_url: "/calculator?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#effaff",
    theme_color: "#075985",
    categories: ["health", "medical", "utilities"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
    shortcuts: [
      {
        name: "Open calculator",
        short_name: "Calculator",
        description: "Start a new peptide calculator entry.",
        url: "/calculator",
        icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
      },
      {
        name: "Peptide library",
        short_name: "Library",
        description: "Browse compound calculator pages.",
        url: "/peptides",
        icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
      },
      {
        name: "Saved calculations",
        short_name: "Account",
        description: "Open saved calculations and notes.",
        url: "/account",
        icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
      },
    ],
  };
}
