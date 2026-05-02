import Link from "next/link";
import { AppNav } from "@/components/AppNav";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { GeneratedProfile } from "@/lib/profileComposer";

function parseProfile(value: string): GeneratedProfile | null {
  try {
    const parsed = JSON.parse(value) as Partial<GeneratedProfile>;
    if (
      typeof parsed.bio !== "string" ||
      typeof parsed.datingVibe !== "string" ||
      typeof parsed.communicationStyle !== "string" ||
      typeof parsed.firstDatePreference !== "string" ||
      typeof parsed.matchWellWith !== "string" ||
      !Array.isArray(parsed.greenFlags) ||
      !Array.isArray(parsed.traitLabels)
    ) {
      return null;
    }

    return {
      bio: parsed.bio,
      datingVibe: parsed.datingVibe,
      communicationStyle: parsed.communicationStyle,
      firstDatePreference: parsed.firstDatePreference,
      greenFlags: parsed.greenFlags.filter(
        (item): item is string => typeof item === "string",
      ),
      matchWellWith: parsed.matchWellWith,
      traitLabels: parsed.traitLabels.filter(
        (item): item is string => typeof item === "string",
      ),
    };
  } catch {
    return null;
  }
}

const BASIC_DISPLAY: Record<string, string> = {
  man: "Man",
  woman: "Woman",
  nonbinary: "Non-binary",
  "other-identity": "Other",
  "prefer-not-to-say": "",
  women: "Women",
  men: "Men",
  everyone: "Open to everyone",
  "nonbinary-people": "Non-binary people",
  serious: "Seeking something serious",
  casual: "Keeping it casual",
  open: "Open to anything",
  "friends-first": "Friends first",
};

function basicInfoLine(basicInfo: Record<string, string>): string {
  const parts = [
    BASIC_DISPLAY[basicInfo["gender"] ?? ""] ?? "",
    basicInfo["looking-for"]
      ? `Interested in ${BASIC_DISPLAY[basicInfo["looking-for"]] ?? ""}`
      : "",
    BASIC_DISPLAY[basicInfo["intent"] ?? ""] ?? "",
  ].filter(Boolean);
  return parts.join(" · ");
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function ProfilePage() {
  const user = await requireUser();
  const latest = await prisma.profile.findFirst({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  const profile = latest ? parseProfile(latest.generatedProfileJson) : null;

  const basicInfo: Record<string, string> | null = (() => {
    if (!latest?.basicInfoJson) return null;
    try {
      return JSON.parse(latest.basicInfoJson) as Record<string, string>;
    } catch {
      return null;
    }
  })();

  return (
    <main className="flex flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8">
      <AppNav />
      <section className="mx-auto w-full max-w-6xl">
        <div className="mb-8">
          <div>
            <p className="vd-kicker">Saved dating profile</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-[var(--vd-ink)] sm:text-5xl">
              {user.name}’s VibeDate profile
            </h1>
            <p className="mt-3 text-[var(--vd-muted)]">
              This is the latest snapshot generated during onboarding.
            </p>
          </div>
        </div>

        {!profile ? (
          <div className="vd-glass rounded-[2rem] p-8 text-center">
            <p className="vd-kicker">No profile yet</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--vd-ink)]">
              Start onboarding to generate your first saved profile.
            </h2>
            <Link
              href="/onboarding"
              className="mt-6 inline-block rounded-full bg-[var(--vd-rose)] px-6 py-3 text-sm font-semibold text-white"
            >
              Complete signup onboarding
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <article className="overflow-hidden rounded-[2.5rem] border border-[var(--vd-border)] bg-[var(--vd-card)] shadow-[var(--vd-shadow)]">
              <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                <div className="relative min-h-[360px] overflow-hidden bg-[radial-gradient(circle_at_22%_18%,color-mix(in_oklab,var(--vd-gold)_52%,transparent),transparent_32%),radial-gradient(circle_at_82%_12%,color-mix(in_oklab,var(--vd-plum)_55%,transparent),transparent_36%),linear-gradient(145deg,var(--vd-rose),#421622_58%,#0d0908)] p-6 text-white sm:p-8">
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0_/_0.78),transparent_54%)]" />
                  <div className="relative flex items-center justify-between">
                    <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur">
                      Profile preview
                    </span>
                    <span className="rounded-full border border-white/20 bg-black/15 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur">
                      Live snapshot
                    </span>
                  </div>

                  <div className="relative mt-12 flex items-center gap-5">
                    <div className="grid h-28 w-28 shrink-0 place-items-center rounded-full border border-white/25 bg-white/15 text-4xl font-semibold shadow-2xl backdrop-blur">
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <h2 className="text-4xl font-semibold tracking-[-0.05em]">
                        {user.name}
                      </h2>
                      <p className="mt-2 text-sm font-medium text-white/78">
                        {basicInfo
                          ? basicInfoLine(basicInfo)
                          : "Profile built from onboarding"}
                      </p>
                    </div>
                  </div>

                  <div className="relative mt-10 flex flex-wrap gap-2">
                    {profile.traitLabels.slice(0, 4).map((label) => (
                      <span
                        key={label}
                        className="rounded-full bg-white/16 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-center p-6 sm:p-8">
                  <div>
                    <p className="vd-kicker">About me</p>
                    <p className="mt-4 max-w-2xl text-2xl font-semibold leading-tight tracking-[-0.035em] text-[var(--vd-ink)]">
                      {profile.bio}
                    </p>
                  </div>
                </div>
              </div>
            </article>

            <section className="grid gap-4 lg:grid-cols-4">
              {[
                ["Dating vibe", profile.datingVibe],
                ["Texting energy", profile.communicationStyle],
                ["First date", profile.firstDatePreference],
                ["Best match", profile.matchWellWith],
              ].map(([title, value]) => (
                <article
                  key={title}
                  className="rounded-[1.75rem] border border-[var(--vd-border)] bg-[color-mix(in_oklab,var(--vd-card)_86%,transparent)] p-5 shadow-sm backdrop-blur"
                >
                  <h3 className="text-lg font-semibold tracking-[-0.03em] text-[var(--vd-ink)]">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--vd-muted)]">
                    {value}
                  </p>
                </article>
              ))}
            </section>

            <article className="rounded-[2.5rem] border border-[var(--vd-border)] bg-[var(--vd-card)] p-6 shadow-[var(--vd-shadow)] sm:p-8">
              <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                <div>
                  <p className="vd-kicker">Green flags I notice</p>
                  <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--vd-ink)]">
                    What makes someone stand out
                  </h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {profile.greenFlags.map((line) => (
                    <div
                      key={line}
                      className="rounded-[1.35rem] border border-[var(--vd-border)] bg-[var(--vd-soft)] p-4 text-sm font-medium leading-6 text-[var(--vd-ink)]"
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        )}
      </section>
    </main>
  );
}
