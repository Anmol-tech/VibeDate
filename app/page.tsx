import Link from "next/link";
import { AppNav } from "@/components/AppNav";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main className="flex flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8">
      <AppNav />
      <section className="mx-auto grid w-full max-w-6xl items-start gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
        <header className="vd-glass overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:sticky lg:top-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--vd-rose)] via-[var(--vd-plum)] to-[var(--vd-gold)]" />
          <div className="relative flex flex-col gap-6">
            <div>
              <p className="vd-kicker">VibeDate</p>
              <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.04em] text-[var(--vd-ink)] sm:text-5xl lg:text-6xl">
                Build a dating profile without the blank-page panic.
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-[var(--vd-muted)] sm:text-lg">
                Pick through quick, concrete scenarios. VibeDate turns your
                choices into a personalized profile snapshot with a bio, vibe,
                communication style, date preferences, and match hints that are
                saved to your dating profile.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {[
                ["10", "dating signals"],
                ["1", "profile snapshot"],
                ["0", "blank prompts"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[var(--vd-border)] bg-[color-mix(in_oklab,var(--vd-card)_62%,transparent)] p-4"
                >
                  <p className="text-2xl font-semibold text-[var(--vd-ink)]">
                    {value}
                  </p>
                  <p className="mt-1 text-sm text-[var(--vd-muted)]">{label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={user ? "/profile" : "/signup"}
                className="rounded-full bg-gradient-to-r from-[var(--vd-rose)] to-[var(--vd-plum)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-950/10"
              >
                {user ? "View profile" : "Create account"}
              </Link>
              <Link
                href={user ? "/profile" : "/login"}
                className="rounded-full border border-[var(--vd-border)] bg-[var(--vd-card)] px-6 py-3 text-sm font-semibold text-[var(--vd-ink)]"
              >
                {user ? "Saved snapshot" : "Log in"}
              </Link>
            </div>
          </div>
        </header>

        <div className="vd-glass rounded-[2rem] p-6 sm:p-8">
          <p className="vd-kicker">How onboarding works</p>
          <div className="mt-8 space-y-4">
            {[
              [
                "1",
                "Create an account",
                "A lightweight session keeps your generated profile tied to you.",
              ],
              [
                "2",
                "Answer scenario cards",
                "Concrete choices create richer signal than blank bios.",
              ],
              [
                "3",
                "Generate and save",
                "VibeDate creates a profile snapshot and saves it to your account.",
              ],
            ].map(([step, title, copy]) => (
              <div
                key={step}
                className="rounded-[1.5rem] border border-[var(--vd-border)] bg-[color-mix(in_oklab,var(--vd-card)_72%,transparent)] p-5"
              >
                <div className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--vd-rose)] text-sm font-bold text-white">
                    {step}
                  </span>
                  <div>
                    <h2 className="font-semibold text-[var(--vd-ink)]">
                      {title}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-[var(--vd-muted)]">
                      {copy}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
