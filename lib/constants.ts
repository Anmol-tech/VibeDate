/** sessionStorage key — bumped to v2 when StoredWizardData shape changed */
export const SELECTIONS_STORAGE_KEY = "vibedate.wizard.v2";

export type StoredWizardData = {
  /** Answers to the basic-info questions (gender, looking-for, intent) */
  basicInfo: Record<string, string>;
  /** Scenario card selections: cardId → optionId (or "custom") */
  selections: Record<string, string>;
  /** Free-text answers when the user chose "Other": cardId → text */
  customTexts: Record<string, string>;
};
