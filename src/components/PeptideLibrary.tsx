"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  Calculator,
  CheckCircle2,
  FlaskConical,
  LockKeyhole,
  Search,
  ShieldCheck,
} from "lucide-react";

const categories = [
  "All",
  "Metabolic",
  "Hormone axis",
  "Clinical",
  "Restricted",
];

const profiles = [
  {
    name: "Tesamorelin",
    category: "Metabolic",
    status: "Profile draft",
    tone: "sky",
    summary:
      "A structured profile page for calculator-ready vial math, storage notes, and source review.",
    usefulFor: ["Vial math", "Source review", "Saved notes"],
    protocolState: "Protocols locked until medical and legal review.",
  },
  {
    name: "Sermorelin",
    category: "Hormone axis",
    status: "Review needed",
    tone: "indigo",
    summary:
      "A future profile for educational context, calculators, and clinician-reviewed notes.",
    usefulFor: ["Dose unit math", "Personal notes", "Review queue"],
    protocolState: "No public protocol is shown until reviewed.",
  },
  {
    name: "Glucagon",
    category: "Clinical",
    status: "Prescription context",
    tone: "emerald",
    summary:
      "A profile format for prescription products where the calculator can help with unit clarity.",
    usefulFor: ["Unit clarity", "Safety reminders", "Label checks"],
    protocolState: "User must follow prescription labeling.",
  },
  {
    name: "Calcitonin",
    category: "Clinical",
    status: "Prescription context",
    tone: "cyan",
    summary:
      "A simple record style for legally reviewed medication profiles and calculator workflows.",
    usefulFor: ["Profile notes", "Reference links", "Calculator jump"],
    protocolState: "Protocol builder stays disabled by default.",
  },
  {
    name: "Oxytocin",
    category: "Clinical",
    status: "Review needed",
    tone: "violet",
    summary:
      "A profile placeholder for controlled, clinician-supervised contexts and safety notes.",
    usefulFor: ["Legal review", "Warnings", "Saved calculations"],
    protocolState: "Review gate required before publishing.",
  },
  {
    name: "BPC-157",
    category: "Restricted",
    status: "Protocols blocked",
    tone: "rose",
    summary:
      "Restricted or research-only compounds can be listed for education, but not for protocols.",
    usefulFor: ["Blocked status", "Safety policy", "User warnings"],
    protocolState: "Calculator protocols are intentionally disabled.",
  },
];

export function PeptideLibrary() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProfiles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return profiles.filter((profile) => {
      const matchesCategory =
        activeCategory === "All" || profile.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        `${profile.name} ${profile.category} ${profile.status} ${profile.summary}`
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <section className="grid gap-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-800">
            Browse profiles
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">
            Peptide library
          </h2>
        </div>

        <div className="flex h-12 min-w-0 items-center gap-3 rounded-full border border-sky-100 bg-white/90 px-4 shadow-sm">
          <Search size={18} className="shrink-0 text-sky-800" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search profiles"
            aria-label="Search peptide profiles"
            className="min-w-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`h-10 shrink-0 rounded-full px-4 text-sm font-semibold transition ${
              activeCategory === category
                ? "bg-slate-950 text-white shadow-[0_14px_35px_rgba(15,23,42,0.16)]"
                : "border border-sky-100 bg-white/85 text-slate-700 hover:bg-sky-50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredProfiles.map((profile) => (
          <article
            key={profile.name}
            className="min-w-0 rounded-[26px] border border-sky-100 bg-white/95 p-5 shadow-[0_18px_55px_rgba(14,165,233,0.08)] ring-1 ring-white/70"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <ProfileMark tone={profile.tone} />
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">
                    {profile.name}
                  </h3>
                  <p className="text-sm font-medium text-slate-500">
                    {profile.category}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-900 ring-1 ring-sky-100">
                {profile.status}
              </span>
            </div>

            <p className="mt-4 min-h-20 text-sm leading-6 text-slate-700">
              {profile.summary}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {profile.usefulFor.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-100"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-5 flex items-start gap-2 rounded-2xl bg-[linear-gradient(135deg,#f8fbff_0%,#fff7ed_100%)] p-3 text-xs leading-5 text-slate-700 ring-1 ring-sky-100">
              <LockKeyhole
                size={16}
                className="mt-0.5 shrink-0 text-sky-800"
                aria-hidden="true"
              />
              <span>{profile.protocolState}</span>
            </div>

            <Link
              href="/calculator"
              className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-sky-900"
            >
              <Calculator size={16} aria-hidden="true" />
              Use calculator
            </Link>
          </article>
        ))}
      </div>

      {!filteredProfiles.length ? (
        <div className="rounded-[26px] border border-sky-100 bg-white/90 p-6 text-sm text-slate-700">
          No profiles match that search yet.
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-3">
        <LibraryNote
          icon={<ShieldCheck size={19} />}
          title="Legal gate"
          text="Profiles are designed to stay unpublished or locked until U.S. legal and pharmacy review is complete."
        />
        <LibraryNote
          icon={<CheckCircle2 size={19} />}
          title="Calculator first"
          text="The calculator can support math without turning draft profiles into treatment instructions."
        />
        <LibraryNote
          icon={<FlaskConical size={19} />}
          title="Protocol builder"
          text="Future protocols can be saved to accounts after the safety policy and source data are ready."
        />
      </div>
    </section>
  );
}

function ProfileMark({ tone }: { tone: string }) {
  const colors: Record<string, string> = {
    sky: "from-sky-800 via-sky-500 to-cyan-300",
    indigo: "from-slate-950 via-indigo-700 to-sky-300",
    emerald: "from-slate-950 via-emerald-700 to-cyan-300",
    cyan: "from-sky-900 via-cyan-500 to-orange-300",
    violet: "from-slate-950 via-violet-700 to-fuchsia-300",
    rose: "from-slate-950 via-rose-700 to-orange-300",
  };

  return (
    <span
      className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${colors[tone] ?? colors.sky} text-white shadow-sm`}
    >
      <FlaskConical size={21} aria-hidden="true" />
    </span>
  );
}

function LibraryNote({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] border border-sky-100 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-sky-50 text-sky-800 ring-1 ring-sky-100">
          {icon}
        </span>
        {title}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}
