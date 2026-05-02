import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

export async function AppNav() {
  const user = await getCurrentUser();

  return (
    <nav className="mx-auto mb-8 flex w-full max-w-6xl items-center justify-between gap-4 rounded-[1.5rem] border border-[var(--vd-border)] bg-[color-mix(in_oklab,var(--vd-card)_82%,transparent)] px-4 py-3 shadow-sm backdrop-blur-xl">
      <Link
        href="/"
        className="rounded-full px-2 py-1 text-sm font-black uppercase tracking-[0.2em] text-[var(--vd-rose)]"
      >
        VibeDate
      </Link>
      <div className="flex items-center gap-1 rounded-full border border-[var(--vd-border)] bg-[color-mix(in_oklab,var(--vd-soft)_58%,transparent)] p-1">
        {user ? (
          <>
            <Link
              href="/profile"
              className="rounded-full bg-[var(--vd-card)] px-4 py-2 text-sm font-semibold text-[var(--vd-ink)] shadow-sm"
            >
              Profile
            </Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--vd-muted)] hover:bg-[var(--vd-soft)] hover:text-[var(--vd-ink)]"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-[var(--vd-rose)] px-4 py-2 text-sm font-semibold text-white"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
