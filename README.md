# VibeDate

**VibeDate** is a profile-building onboarding flow for a modern dating platform. Users create an account, answer **10 short dating-signal cards** (for example, “What does your ideal Saturday look like?” and “What do you want someone to notice from your profile?”), and receive a saved dating profile snapshot: **bio**, **dating vibe**, **communication style**, **first-date preference**, **green flags**, and **who you may match well with**.

## Why this exists

Open-ended prompts often produce skipped sections or generic answers. VibeDate tests whether **concrete situations + behavioral inference** yield richer onboarding data for matching and personalization later.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict + `noUncheckedIndexedAccess`)
- **Tailwind CSS v4**
- **Custom email/password auth** — `bcryptjs` password hashing, HTTP-only session cookie, and persisted sessions in SQLite
- **Prisma + SQLite** — users, sessions, and saved generated profiles in [`prisma/schema.prisma`](prisma/schema.prisma)
- **OpenRouter LLM generation** — [`app/api/generate-profile/route.ts`](app/api/generate-profile/route.ts) sends the selected card answers and ranked traits to OpenRouter from the server
- **Deterministic fallback engine** — [`lib/traits.ts`](lib/traits.ts) aggregates trait scores; [`lib/profileComposer.ts`](lib/profileComposer.ts) maps scores to copy if no API key is configured or the LLM response fails validation
- **Card content** lives in [`content/cards.ts`](content/cards.ts) so scenarios and weights stay editable
- **sessionStorage** temporarily carries onboarding answers from `/onboarding` to `/results`; the generated profile is persisted to the database

## Environment

Copy `.env.example` to `.env.local` and set an OpenRouter key:

```bash
cp .env.example .env.local
```

```bash
DATABASE_URL="file:./dev.db"
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=openai/gpt-4o-mini
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`OPENROUTER_MODEL` is optional. If `OPENROUTER_API_KEY` is missing, the app still returns a profile using the local deterministic composer and labels it as the fallback.

## Scripts

```bash
npm install
npm run db:push
npm run dev          # http://localhost:3000
npm run lint
npm run typecheck
npm run format       # Prettier write
npm run format:check
npm run build
npm run db:studio    # optional: inspect users/profiles
```

## Demo flow

1. Open `/signup` and create a test account; signup is the only normal entry into onboarding.
2. Continue to `/onboarding`, answer all scenario cards, and choose **Generate profile**.
3. `/results` calls `/api/generate-profile`, requires the signed-in session, uses OpenRouter first, falls back locally if needed, and saves the result to `Profile`.
4. Open `/profile` to view the latest saved profile for the authenticated user.

Direct navigation to `/onboarding`, `/results`, or `/profile` redirects unauthenticated users to `/login`. Users who already have a saved profile are redirected away from `/onboarding` to `/profile`, so onboarding behaves like a first-run dating-app setup step rather than a menu item.

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs **lint**, **typecheck**, **Prettier check**, and **`next build`** on pushes and PRs to `main` / `master`.

## Deploy

This repo is a standard Next.js app. Deploy on [Vercel](https://vercel.com/new): import the repo, default build (`npm run build`), output `.next`.

For a production-like deploy, replace local SQLite with a hosted database (Neon, Supabase, Turso, etc.) and set `DATABASE_URL` in project settings. Also add `OPENROUTER_API_KEY`, optional `OPENROUTER_MODEL`, and `NEXT_PUBLIC_SITE_URL`.

## Walkthrough video (≤5 min) — checklist

Use this outline when recording for reviewers (normal playback speed):

1. **Problem & research** — Blank bios / generic prompts; 2–3 quick learnings from friends or threads.
2. **Iteration** — What you kept (auth + onboarding + DB-backed profile) vs deferred (swiping, messaging, match ranking).
3. **Live demo** — Signup → onboarding wizard → generated results → saved `/profile`.
4. **Tools** — Why Next.js, TS, Tailwind, ESLint/Prettier, GitHub Actions, deploy target.
5. **Next metrics** — Completion rate, time-on-cards, A/B on scenario copy, edit-rate if users tweak generated text later.

## Project layout

| Path                                                                     | Role                                         |
| ------------------------------------------------------------------------ | -------------------------------------------- |
| [`prisma/schema.prisma`](prisma/schema.prisma)                           | User, Session, and Profile models            |
| [`lib/auth.ts`](lib/auth.ts)                                             | Cookie-session auth helpers                  |
| [`content/cards.ts`](content/cards.ts)                                   | Scenario deck + option → trait weights       |
| [`lib/traits.ts`](lib/traits.ts)                                         | Aggregate & rank traits                      |
| [`lib/profileComposer.ts`](lib/profileComposer.ts)                       | Local fallback profile composer              |
| [`app/api/generate-profile/route.ts`](app/api/generate-profile/route.ts) | Server-side OpenRouter + profile persistence |
| [`app/onboarding/page.tsx`](app/onboarding/page.tsx)                     | Authenticated onboarding flow                |
| [`app/profile/page.tsx`](app/profile/page.tsx)                           | Latest saved dating profile                  |
| [`components/VibeWizard.tsx`](components/VibeWizard.tsx)                 | Scenario-card onboarding UI                  |
| [`components/ProfileResults.tsx`](components/ProfileResults.tsx)         | Results + save/generation state              |
