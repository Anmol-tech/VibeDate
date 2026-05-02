"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CARDS, PERSONALIZATION_CARDS } from "@/content/cards";
import { SELECTIONS_STORAGE_KEY, type StoredWizardData } from "@/lib/constants";
import type { GeneratedProfile } from "@/lib/profileComposer";

type GenerationSource = "openrouter" | "fallback";

type GenerateProfileResponse = {
  profile: GeneratedProfile;
  source: GenerationSource;
  profileId?: string;
  model?: string;
  warning?: string;
};

function isValidWizardData(raw: unknown): raw is StoredWizardData {
  if (!raw || typeof raw !== "object") return false;
  const d = raw as Record<string, unknown>;
  if (!d.selections || typeof d.selections !== "object") return false;
  if (!d.personalization || typeof d.personalization !== "object") return false;
  const sel = d.selections as Record<string, unknown>;
  const personalization = d.personalization as Record<string, unknown>;
  return (
    CARDS.every((c) => typeof sel[c.id] === "string") &&
    PERSONALIZATION_CARDS.every((c) => typeof personalization[c.id] === "string")
  );
}

export function ProfileResults() {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<GeneratedProfile | null>(null);
  const [source, setSource] = useState<GenerationSource | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const id = requestAnimationFrame(async () => {
      const raw = sessionStorage.getItem(SELECTIONS_STORAGE_KEY);
      if (!raw) {
        setProfile(null);
        setSource(null);
        setProfileId(null);
        setWarning(null);
        setReady(true);
        return;
      }
      try {
        const parsed: unknown = JSON.parse(raw);
        if (!isValidWizardData(parsed)) {
          setProfile(null);
          setSource(null);
          setProfileId(null);
          setWarning(null);
        } else {
          const response = await fetch("/api/generate-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              basicInfo: parsed.basicInfo ?? {},
              selections: parsed.selections,
              personalization: parsed.personalization,
              customTexts: parsed.customTexts ?? {},
            }),
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error(`Profile generation failed (${response.status})`);
          }

          const data = (await response.json()) as GenerateProfileResponse;
          setProfile(data.profile);
          setSource(data.source);
          setProfileId(data.profileId ?? null);
          setModel(data.model ?? null);
          setWarning(data.warning ?? null);
          sessionStorage.removeItem(SELECTIONS_STORAGE_KEY);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setProfile(null);
        setSource(null);
        setProfileId(null);
        setWarning("Profile generation failed. Please try again.");
      }
      setReady(true);
    });
    return () => {
      controller.abort();
      cancelAnimationFrame(id);
    };
  }, []);

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-6xl px-2 py-10">
        <div className="vd-glass rounded-[2rem] p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 animate-pulse rounded-full bg-[var(--vd-rose)]" />
            <p className="text-sm font-semibold text-[var(--vd-muted)]">
              Generating your OpenRouter profile snapshot...
            </p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="h-64 animate-pulse rounded-[1.75rem] bg-[var(--vd-border)]" />
            <div className="space-y-4">
              <div className="h-28 animate-pulse rounded-[1.75rem] bg-[var(--vd-border)]" />
              <div className="h-28 animate-pulse rounded-[1.75rem] bg-[var(--vd-border)]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="vd-glass mx-auto max-w-lg rounded-[2rem] px-6 py-12 text-center">
        <p className="vd-kicker">No snapshot yet</p>
        <h1 className="mt-3 text-2xl font-semibold text-[var(--vd-ink)]">
          Your latest onboarding answers were already saved.
        </h1>
        <p className="mt-3 text-[var(--vd-muted)]">
          Head to your profile to see the snapshot tied to your account.
        </p>
        <Link
          href="/profile"
          className="mt-6 inline-block rounded-full bg-[var(--vd-rose)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-950/10"
        >
          View saved profile
        </Link>
      </div>
    );
  }

  const copyBio = async () => {
    try {
      await navigator.clipboard.writeText(profile.bio);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      setCopyDone(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-2 pb-20 pt-3 sm:pt-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="vd-kicker">Generated snapshot</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-[var(--vd-ink)] sm:text-5xl">
            Your profile snapshot
          </h1>
          <p className="mt-2 text-sm text-[var(--vd-muted)]">
            {profileId
              ? "Saved to your dating profile"
              : source || model
                ? "Generated profile preview"
                : "Profile preview"}
          </p>
        </div>
        <button
          type="button"
          onClick={copyBio}
          className="rounded-full border border-[var(--vd-border)] bg-[var(--vd-card)] px-5 py-3 text-sm font-semibold text-[var(--vd-ink)] shadow-sm hover:border-[var(--vd-rose)]"
        >
          {copyDone ? "Copied!" : "Copy bio"}
        </button>
      </div>

      {warning && (
        <div className="mb-6 rounded-2xl border border-[var(--vd-border)] bg-[color-mix(in_oklab,var(--vd-rose)_8%,var(--vd-card))] px-4 py-3 text-sm font-medium text-[var(--vd-muted)]">
          {warning}
        </div>
      )}

      {profile.traitLabels.length > 0 && (
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--vd-muted)]">
            Based on your choices
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.traitLabels.map((label) => (
              <span
                key={label}
                className="rounded-full bg-[color-mix(in_oklab,var(--vd-rose)_14%,transparent)] px-3 py-1 text-sm font-medium text-[var(--vd-ink)]"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      <section className="grid gap-5 lg:grid-cols-[1.12fr_0.88fr]">
        <article className="relative overflow-hidden rounded-[2rem] border border-[var(--vd-border)] bg-[var(--vd-card)] p-6 shadow-[var(--vd-shadow)] sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--vd-rose)] via-[var(--vd-plum)] to-[var(--vd-gold)]" />
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--vd-muted)]">
            Bio
          </h2>
          <p className="mt-5 text-pretty text-2xl font-semibold leading-snug tracking-[-0.025em] text-[var(--vd-ink)] sm:text-3xl">
            {profile.bio}
          </p>
          <div className="mt-8 rounded-[1.5rem] border border-[var(--vd-border)] bg-[var(--vd-soft)] p-5">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--vd-muted)]">
              You may match well with
            </h3>
            <p className="mt-3 text-[17px] leading-relaxed text-[var(--vd-ink)]">
              {profile.matchWellWith}
            </p>
          </div>
        </article>

        <div className="grid gap-5">
          {[
            ["Dating vibe", profile.datingVibe],
            ["Communication style", profile.communicationStyle],
            ["First-date preference", profile.firstDatePreference],
          ].map(([title, value]) => (
            <article
              key={title}
              className="rounded-[1.75rem] border border-[var(--vd-border)] bg-[color-mix(in_oklab,var(--vd-card)_88%,transparent)] p-5 shadow-sm backdrop-blur"
            >
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--vd-muted)]">
                {title}
              </h2>
              <p className="mt-3 text-[17px] leading-relaxed text-[var(--vd-ink)]">
                {value}
              </p>
            </article>
          ))}

          <article className="rounded-[1.75rem] border border-[var(--vd-border)] bg-[color-mix(in_oklab,var(--vd-card)_88%,transparent)] p-5 shadow-sm backdrop-blur">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--vd-muted)]">
              Green flags you appreciate
            </h2>
            <ul className="mt-4 space-y-3 text-[16px] leading-relaxed text-[var(--vd-ink)]">
              {profile.greenFlags.map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--vd-rose)]" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/profile"
          className="rounded-full bg-gradient-to-r from-[var(--vd-rose)] to-[var(--vd-plum)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-950/10"
        >
          View saved profile
        </Link>
        <Link
          href="/"
          className="rounded-full px-4 py-2.5 text-sm font-medium text-[var(--vd-muted)] hover:text-[var(--vd-ink)]"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
