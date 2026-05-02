import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/onboarding");

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10">
      <section className="vd-glass w-full max-w-md rounded-[2rem] p-6 sm:p-8">
        <p className="vd-kicker">Start onboarding</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[var(--vd-ink)]">
          Create your VibeDate account.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--vd-muted)]">
          Your scenario answers and generated dating profile will be saved to
          your account.
        </p>
        <div className="mt-8">
          <AuthForm mode="signup" />
        </div>
      </section>
    </main>
  );
}
