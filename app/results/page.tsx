import Link from "next/link";
import { ProfileResults } from "@/components/ProfileResults";
import { requireUser } from "@/lib/auth";

export default async function ResultsPage() {
  await requireUser();

  return (
    <main className="flex flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8">
      <header className="mx-auto mb-5 w-full max-w-6xl rounded-full border border-[var(--vd-border)] bg-[color-mix(in_oklab,var(--vd-card)_72%,transparent)] px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="rounded-full px-3 py-1.5 text-sm font-semibold text-[var(--vd-muted)] hover:bg-[var(--vd-soft)] hover:text-[var(--vd-ink)]"
          >
            ← Home
          </Link>
          <span className="vd-kicker">Results</span>
        </div>
      </header>
      <ProfileResults />
    </main>
  );
}
