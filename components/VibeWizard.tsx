"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BASIC_INFO_CARDS,
  CARDS,
  PERSONALIZATION_CARDS,
  type BasicInfoCard,
  type PersonalizationCard,
  type ScenarioCard,
} from "@/content/cards";
import { SELECTIONS_STORAGE_KEY, type StoredWizardData } from "@/lib/constants";
import type { SelectionMap } from "@/lib/traits";

const TOTAL_STEPS =
  BASIC_INFO_CARDS.length + CARDS.length + PERSONALIZATION_CARDS.length;
const BASIC_END = BASIC_INFO_CARDS.length;
const SCENARIO_END = BASIC_END + CARDS.length;

export function VibeWizard() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [basicSelections, setBasicSelections] = useState<
    Record<string, string>
  >({});
  const [selections, setSelections] = useState<SelectionMap>({});
  const [personalization, setPersonalization] = useState<
    Record<string, string>
  >({});

  const isBasicPhase = step < BASIC_END;
  const isScenarioPhase = step >= BASIC_END && step < SCENARIO_END;
  const isPersonalizationPhase = step >= SCENARIO_END;
  const basicCard: BasicInfoCard | undefined = isBasicPhase
    ? BASIC_INFO_CARDS[step]
    : undefined;
  const scenarioCard: ScenarioCard | undefined = isScenarioPhase
    ? CARDS[step - BASIC_END]
    : undefined;
  const personalizationCard: PersonalizationCard | undefined =
    isPersonalizationPhase
      ? PERSONALIZATION_CARDS[step - SCENARIO_END]
      : undefined;
  const currentCardId =
    basicCard?.id ?? scenarioCard?.id ?? personalizationCard?.id;

  const selectedForCard = isBasicPhase
    ? currentCardId
      ? basicSelections[currentCardId]
      : undefined
    : isScenarioPhase
      ? currentCardId
        ? selections[currentCardId]
        : undefined
      : currentCardId
        ? personalization[currentCardId]
        : undefined;

  const canProceed = selectedForCard !== undefined;

  const progressPct = ((step + 1) / TOTAL_STEPS) * 100;
  const completedCount =
    Object.keys(basicSelections).length +
    Object.keys(selections).length +
    Object.keys(personalization).length;

  const choose = useCallback(
    (optionId: string) => {
      if (!currentCardId) return;
      if (isBasicPhase) {
        setBasicSelections((prev) => ({ ...prev, [currentCardId]: optionId }));
      } else if (isScenarioPhase) {
        setSelections((prev) => ({ ...prev, [currentCardId]: optionId }));
      } else {
        setPersonalization((prev) => ({
          ...prev,
          [currentCardId]: optionId,
        }));
      }
    },
    [isBasicPhase, isScenarioPhase, currentCardId],
  );

  const goNext = useCallback(() => {
    if (!canProceed) return;
    if (step >= TOTAL_STEPS - 1) {
      const data: StoredWizardData = {
        basicInfo: basicSelections,
        selections,
        personalization,
        customTexts: {},
      };
      sessionStorage.setItem(SELECTIONS_STORAGE_KEY, JSON.stringify(data));
      router.push("/results");
      return;
    }
    setStep((s) => s + 1);
  }, [canProceed, step, basicSelections, selections, personalization, router]);

  const goBack = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const currentCard = basicCard ?? scenarioCard ?? personalizationCard;
  if (!currentCard) return null;

  const options = currentCard.options;
  const groupName = `vibe-${currentCard.id}`;

  const phaseKicker = isBasicPhase
    ? `About you · ${step + 1} of ${BASIC_END}`
    : isScenarioPhase
      ? `Scenario ${step - BASIC_END + 1} of ${CARDS.length}`
      : `Personal style ${step - SCENARIO_END + 1} of ${PERSONALIZATION_CARDS.length}`;

  const ctaLabel =
    step >= TOTAL_STEPS - 1
      ? "Generate profile"
      : isBasicPhase
        ? "Next"
        : selectedForCard
          ? "Next"
          : "Pick one to continue";

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-2 py-2 sm:px-3">
      {/* Progress strip */}
      <div className="rounded-[1.75rem] border border-[var(--vd-border)] bg-[color-mix(in_oklab,var(--vd-soft)_62%,transparent)] p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="vd-kicker">
              {isBasicPhase
                ? "Identity & preferences"
                : isScenarioPhase
                  ? "Your lifestyle"
                  : "Personal details"}
            </p>
            <p className="mt-1 text-sm text-[var(--vd-muted)]">
              {completedCount} of {TOTAL_STEPS} answered
            </p>
          </div>
          <div className="rounded-full bg-[var(--vd-card)] px-3 py-1 text-sm font-semibold text-[var(--vd-ink)] shadow-sm">
            {Math.round(progressPct)}%
          </div>
        </div>
        <div
          className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--vd-rose)_16%,transparent)]"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
          aria-label={`Step ${step + 1} of ${TOTAL_STEPS}`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--vd-rose)] via-[var(--vd-plum)] to-[var(--vd-gold)] transition-[width] duration-500 ease-out"
            style={{ width: `${Math.min(100, progressPct)}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div
        key={currentCard.id}
        className="animate-[fadeIn_0.35s_ease-out] rounded-[2rem] border border-[var(--vd-border)] bg-[var(--vd-card)] p-5 shadow-[var(--vd-shadow)] sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--vd-rose)]">
              {phaseKicker}
            </p>
            <h2 className="mt-2 text-balance text-2xl font-semibold leading-tight tracking-[-0.025em] text-[var(--vd-ink)] sm:text-3xl">
              {currentCard.prompt}
            </h2>
          </div>
          <span className="shrink-0 rounded-full border border-[var(--vd-border)] px-3 py-1 text-xs font-semibold text-[var(--vd-muted)]">
            {step + 1}/{TOTAL_STEPS}
          </span>
        </div>

        <div className="mt-8">
          <div
            className="flex flex-col gap-3"
            role="radiogroup"
            aria-labelledby={`prompt-${currentCard.id}`}
          >
            <span id={`prompt-${currentCard.id}`} className="sr-only">
              {currentCard.prompt}
            </span>

            {options.map((opt) => {
              const selected = selectedForCard === opt.id;
              return (
                <label
                  key={opt.id}
                  className={`group relative flex cursor-pointer touch-manipulation items-center gap-3 rounded-2xl border px-4 py-4 text-left text-[15px] leading-snug text-[var(--vd-ink)] transition-all outline-none sm:text-base has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--vd-rose)] has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-[var(--background)] ${
                    selected
                      ? "translate-y-[-1px] border-[var(--vd-rose)] bg-[color-mix(in_oklab,var(--vd-rose)_18%,var(--vd-card))] shadow-[0_14px_34px_color-mix(in_oklab,var(--vd-rose)_18%,transparent),0_0_0_1px_var(--vd-rose)]"
                      : "border-[var(--vd-border)] bg-[color-mix(in_oklab,var(--vd-card)_88%,transparent)] hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--vd-rose)_45%,var(--vd-border))] hover:shadow-md"
                  }`}
                >
                  <input
                    type="radio"
                    name={groupName}
                    value={opt.id}
                    checked={selected}
                    onChange={() => choose(opt.id)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs font-bold transition-all ${
                      selected
                        ? "border-[var(--vd-rose)] bg-[var(--vd-rose)] text-white"
                        : "border-[var(--vd-border)] text-transparent group-hover:border-[var(--vd-rose)]"
                    }`}
                  >
                    ✓
                  </span>
                  <span className="flex-1 select-none">{opt.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-2">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="rounded-full border border-transparent px-5 py-2.5 text-sm font-semibold text-[var(--vd-muted)] transition-colors enabled:hover:border-[var(--vd-border)] enabled:hover:bg-[var(--vd-card)] enabled:hover:text-[var(--vd-ink)] disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={!canProceed}
          className="rounded-full bg-gradient-to-r from-[var(--vd-rose)] to-[var(--vd-plum)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-950/10 transition-transform hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
