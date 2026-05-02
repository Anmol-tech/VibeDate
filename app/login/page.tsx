import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/profile");

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10">
      <section className="vd-glass w-full max-w-md rounded-[2rem] p-6 sm:p-8">
        <p className="vd-kicker">Welcome back</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[var(--vd-ink)]">
          Log in to continue.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--vd-muted)]">
          Keep onboarding or review the profile snapshot saved from your latest
          VibeDate run.
        </p>
        <div className="mt-8">
          <AuthForm mode="login" />
        </div>
      </section>
    </main>
  );
}
