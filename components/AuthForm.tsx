"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    setLoading(false);

    if (!response.ok) {
      setError(data?.error ?? "Something went wrong. Please try again.");
      return;
    }

    router.push("/onboarding");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {isSignup && (
        <label className="block">
          <span className="text-sm font-semibold text-[var(--vd-ink)]">
            Name
          </span>
          <input
            name="name"
            autoComplete="name"
            required
            minLength={2}
            className="mt-2 w-full rounded-2xl border border-[var(--vd-border)] bg-[var(--vd-card)] px-4 py-3 text-[var(--vd-ink)] outline-none ring-[var(--vd-rose)] transition focus:ring-2"
            placeholder="John Doe"
          />
        </label>
      )}

      <label className="block">
        <span className="text-sm font-semibold text-[var(--vd-ink)]">
          Email
        </span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-2 w-full rounded-2xl border border-[var(--vd-border)] bg-[var(--vd-card)] px-4 py-3 text-[var(--vd-ink)] outline-none ring-[var(--vd-rose)] transition focus:ring-2"
          placeholder="you@example.com"
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-[var(--vd-ink)]">
          Password
        </span>
        <input
          name="password"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          required
          minLength={8}
          className="mt-2 w-full rounded-2xl border border-[var(--vd-border)] bg-[var(--vd-card)] px-4 py-3 text-[var(--vd-ink)] outline-none ring-[var(--vd-rose)] transition focus:ring-2"
          placeholder="8+ characters"
        />
      </label>

      {error && (
        <p className="rounded-2xl border border-[var(--vd-border)] bg-[color-mix(in_oklab,var(--vd-rose)_10%,var(--vd-card))] px-4 py-3 text-sm font-medium text-[var(--vd-muted)]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-gradient-to-r from-[var(--vd-rose)] to-[var(--vd-plum)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-950/10 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Working..." : isSignup ? "Create account" : "Log in"}
      </button>

      <p className="text-center text-sm text-[var(--vd-muted)]">
        {isSignup ? "Already have an account?" : "New to VibeDate?"}{" "}
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="font-semibold text-[var(--vd-rose)] underline-offset-4 hover:underline"
        >
          {isSignup ? "Log in" : "Create one"}
        </Link>
      </p>
    </form>
  );
}
