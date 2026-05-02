import { redirect } from "next/navigation";
import { AppNav } from "@/components/AppNav";
import { VibeWizard } from "@/components/VibeWizard";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function OnboardingPage() {
  const user = await requireUser();
  const hasProfile = await prisma.profile.findFirst({
    where: { userId: user.id },
    select: { id: true },
  });

  if (hasProfile) redirect("/profile");

  return (
    <main className="flex flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8">
      <AppNav />
      <section className="mx-auto grid w-full max-w-6xl items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <header className="vd-glass rounded-[2rem] p-6 sm:p-8 lg:sticky lg:top-6">
          <p className="vd-kicker">First-run onboarding</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[var(--vd-ink)] sm:text-5xl">
            Let’s turn choices into a profile, {user.name}.
          </h1>
          <p className="mt-5 text-base leading-7 text-[var(--vd-muted)]">
            Answer a few lightweight scenario cards. VibeDate converts the
            structured signal into a personalized profile snapshot and saves it
            to your account.
          </p>
          <div className="mt-8 rounded-[1.5rem] border border-[var(--vd-border)] bg-[var(--vd-soft)] p-5">
            <h2 className="font-semibold text-[var(--vd-ink)]">
              Why this is first
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--vd-muted)]">
              A dating platform can’t match well if profiles are empty or
              generic. This onboarding flow creates reusable structured signal
              before swiping, messaging, or recommendations exist.
            </p>
          </div>
        </header>

        <div className="vd-glass rounded-[2rem] p-3 sm:p-5">
          <VibeWizard />
        </div>
      </section>
    </main>
  );
}
