/** sessionStorage key — bumped when StoredWizardData shape changes */
export const SELECTIONS_STORAGE_KEY = "vibedate.wizard.v3";

export type StoredWizardData = {
  /** Answers to the basic-info questions (gender, looking-for, intent) */
  basicInfo: Record<string, string>;
  /** Scenario card selections: cardId → optionId */
  selections: Record<string, string>;
  /** Choice-only personalization cards: cardId → optionId */
  personalization: Record<string, string>;
  /** Legacy support for old sessions that included "Other" free text. */
  customTexts: Record<string, string>;
};
