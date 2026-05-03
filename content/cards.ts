/**
 * Scenario deck for VibeDate. Options carry hidden trait weights used only by the profile engine.
 */

export const TRAIT_IDS = [
  "calm",
  "thoughtful",
  "adventurous",
  "social",
  "curious",
  "intentional",
  "playful",
  "cozy",
  "direct",
] as const;

export type TraitId = (typeof TRAIT_IDS)[number];

export type TraitWeights = Partial<Record<TraitId, number>>;

export type ScenarioOption = {
  id: string;
  label: string;
  traitWeights: TraitWeights;
};

export type ScenarioCard = {
  id: string;
  prompt: string;
  options: ScenarioOption[];
};

export const CARDS: ScenarioCard[] = [
  {
    id: "ideal-saturday",
    prompt: "What does your ideal Saturday look like?",
    options: [
      {
        id: "coffee-book",
        label: "Coffee, a book, and nowhere to be",
        traitWeights: {
          calm: 3,
          thoughtful: 2,
          cozy: 2,
          intentional: 1,
        },
      },
      {
        id: "friends-outdoors",
        label: "Hiking or something active with friends",
        traitWeights: {
          adventurous: 3,
          social: 3,
          playful: 1,
        },
      },
      {
        id: "new-restaurant",
        label: "Trying a new restaurant or neighborhood spot",
        traitWeights: {
          curious: 3,
          social: 2,
          intentional: 1,
        },
      },
      {
        id: "recharge-home",
        label: "Staying in and recharging hard",
        traitWeights: {
          calm: 2,
          cozy: 3,
          thoughtful: 1,
        },
      },
    ],
  },
  {
    id: "planning-trip",
    prompt: "You’re planning a weekend trip. What’s your move?",
    options: [
      {
        id: "loose-itinerary",
        label: "Book transit and figure out the rest as we go",
        traitWeights: {
          adventurous: 3,
          playful: 3,
          curious: 1,
        },
      },
      {
        id: "research-first",
        label: "Spreadsheet-era research: reservations, maps, backup plans",
        traitWeights: {
          intentional: 3,
          thoughtful: 2,
          curious: 1,
        },
      },
      {
        id: "friends-route",
        label: "Ask friends for recs and copy their vibe",
        traitWeights: {
          social: 3,
          curious: 1,
          cozy: 1,
        },
      },
      {
        id: "staycation",
        label: "Honestly? A staycation with zero logistics",
        traitWeights: {
          calm: 3,
          cozy: 2,
        },
      },
    ],
  },
  {
    id: "text-thread",
    prompt: "A new match texts you something thoughtful but long. You…",
    options: [
      {
        id: "match-energy",
        label: "Reply in kind, I like depth early",
        traitWeights: {
          thoughtful: 3,
          intentional: 2,
          direct: 1,
        },
      },
      {
        id: "light-vibe",
        label: "Answer warmly but keep it lighter for now",
        traitWeights: {
          calm: 2,
          playful: 2,
          social: 1,
        },
      },
      {
        id: "need-time",
        label: "Need a beat, I reply when I can give real attention",
        traitWeights: {
          thoughtful: 2,
          intentional: 2,
          calm: 2,
        },
      },
      {
        id: "call-me",
        label: "Suggest a quick call, tone is easier live",
        traitWeights: {
          direct: 3,
          social: 2,
        },
      },
    ],
  },
  {
    id: "looking-for",
    prompt:
      "When a dating app asks what you’re looking for, the honest answer is…",
    options: [
      {
        id: "intentional-relationship",
        label: "A real relationship, but I still want it to unfold naturally",
        traitWeights: {
          intentional: 3,
          thoughtful: 2,
          calm: 1,
        },
      },
      {
        id: "chemistry-first",
        label: "Chemistry first, labels can come after there’s a spark",
        traitWeights: {
          playful: 2,
          social: 2,
          adventurous: 1,
        },
      },
      {
        id: "slow-and-clear",
        label: "Slow pace, clear communication, no pressure games",
        traitWeights: {
          calm: 3,
          direct: 2,
          intentional: 2,
        },
      },
      {
        id: "open-to-surprise",
        label: "Open to being surprised, as long as we’re kind and honest",
        traitWeights: {
          curious: 2,
          adventurous: 2,
          thoughtful: 1,
        },
      },
    ],
  },
  {
    id: "profile-strength",
    prompt: "What do you most want someone to notice from your profile?",
    options: [
      {
        id: "inner-world",
        label: "My inner world, values, taste, the way I think",
        traitWeights: {
          thoughtful: 3,
          intentional: 2,
          curious: 1,
        },
      },
      {
        id: "life-energy",
        label: "My energy, I’m fun to be around and easy to talk to",
        traitWeights: {
          playful: 3,
          social: 3,
        },
      },
      {
        id: "consistency",
        label: "My consistency, I show up, follow through, and mean it",
        traitWeights: {
          intentional: 3,
          direct: 2,
          calm: 1,
        },
      },
      {
        id: "curiosity",
        label: "My curiosity, I’m always learning, tasting, wandering",
        traitWeights: {
          curious: 3,
          adventurous: 2,
          playful: 1,
        },
      },
    ],
  },
  {
    id: "match-filter",
    prompt: "A profile makes you more likely to swipe right when it shows…",
    options: [
      {
        id: "specific-prompts",
        label: "Specific prompts, little details that feel lived-in",
        traitWeights: {
          thoughtful: 2,
          curious: 2,
          intentional: 1,
        },
      },
      {
        id: "warm-humor",
        label: "Warm humor, clever, not mean",
        traitWeights: {
          playful: 3,
          social: 1,
          thoughtful: 1,
        },
      },
      {
        id: "clear-intentions",
        label: "Clear intentions, no guessing what they’re here for",
        traitWeights: {
          direct: 3,
          intentional: 3,
        },
      },
      {
        id: "active-life",
        label: "A life in motion, friends, hobbies, trips, projects",
        traitWeights: {
          adventurous: 2,
          social: 2,
          curious: 1,
        },
      },
    ],
  },
  {
    id: "crowded-room",
    prompt: "You walk into a crowded room where you know almost nobody. You…",
    options: [
      {
        id: "find-one-person",
        label: "Find one person and have a real conversation",
        traitWeights: {
          thoughtful: 2,
          intentional: 2,
          calm: 1,
        },
      },
      {
        id: "work-room",
        label: "Float, introduce myself, see what happens",
        traitWeights: {
          social: 3,
          playful: 2,
          adventurous: 1,
        },
      },
      {
        id: "observe",
        label: "Hang back and observe until something clicks",
        traitWeights: {
          thoughtful: 3,
          calm: 2,
          curious: 1,
        },
      },
      {
        id: "early-exit",
        label: "Have an exit plan, big rooms drain me",
        traitWeights: {
          calm: 2,
          cozy: 2,
          intentional: 1,
        },
      },
    ],
  },
  {
    id: "learning-something",
    prompt: "When you’re learning something new, you prefer to…",
    options: [
      {
        id: "dabble-play",
        label: "Mess around until it clicks, play first",
        traitWeights: {
          playful: 3,
          curious: 2,
          adventurous: 1,
        },
      },
      {
        id: "structured-path",
        label: "Follow a structured path so I don’t waste time",
        traitWeights: {
          intentional: 3,
          thoughtful: 2,
          direct: 1,
        },
      },
      {
        id: "people-teach",
        label: "Learn from someone who already loves it",
        traitWeights: {
          social: 2,
          curious: 3,
          thoughtful: 1,
        },
      },
      {
        id: "rabbit-hole",
        label: "Go deep alone, weird Wikipedia journeys welcome",
        traitWeights: {
          thoughtful: 2,
          curious: 3,
          calm: 1,
        },
      },
    ],
  },
  {
    id: "disagreement",
    prompt:
      "You and someone you’re dating disagree about something small but real. You…",
    options: [
      {
        id: "address-soon",
        label: "Address it soon with clarity, don’t let it simmer",
        traitWeights: {
          direct: 3,
          intentional: 2,
          thoughtful: 1,
        },
      },
      {
        id: "gentle-timing",
        label: "Pick a gentle moment, tone matters as much as facts",
        traitWeights: {
          thoughtful: 3,
          calm: 2,
          intentional: 1,
        },
      },
      {
        id: "humor-bridge",
        label: "Try humor first, then get sincere",
        traitWeights: {
          playful: 3,
          social: 2,
          thoughtful: 1,
        },
      },
      {
        id: "reflect-first",
        label: "Reflect solo first so I don’t react reflexively",
        traitWeights: {
          thoughtful: 3,
          calm: 3,
          intentional: 1,
        },
      },
    ],
  },
  {
    id: "surprise-evening",
    prompt:
      "Your date surprises you with a mystery evening out. You hope it’s…",
    options: [
      {
        id: "low-key-walk",
        label: "Low-key: walk, dessert, easy conversation",
        traitWeights: {
          calm: 2,
          thoughtful: 2,
          cozy: 2,
        },
      },
      {
        id: "new-experience",
        label: "Something neither of us has tried before",
        traitWeights: {
          adventurous: 3,
          curious: 3,
          playful: 1,
        },
      },
      {
        id: "friends-energy",
        label: "A little social energy, maybe friends bump into us",
        traitWeights: {
          social: 3,
          playful: 2,
        },
      },
      {
        id: "clear-plan",
        label: "Still knowing the rough plan, surprises need guardrails",
        traitWeights: {
          intentional: 3,
          calm: 1,
          direct: 1,
        },
      },
    ],
  },
];

/** Options may reference unknown traits; strip those at aggregation time. */
export const KNOWN_TRAITS = new Set<string>(TRAIT_IDS);

// ─── Basic identity / preference cards (shown before scenario cards) ──────────

export type BasicInfoOption = {
  id: string;
  label: string;
};

export type BasicInfoCard = {
  id: string;
  prompt: string;
  category: "identity" | "preferences";
  options: BasicInfoOption[];
};

export const BASIC_INFO_CARDS: BasicInfoCard[] = [
  {
    id: "gender",
    prompt: "I identify as…",
    category: "identity",
    options: [
      { id: "man", label: "Man" },
      { id: "woman", label: "Woman" },
      { id: "nonbinary", label: "Non-binary" },
      { id: "other-identity", label: "Something else" },
      { id: "prefer-not-to-say", label: "Prefer not to say" },
    ],
  },
  {
    id: "looking-for",
    prompt: "I'm open to dating…",
    category: "preferences",
    options: [
      { id: "women", label: "Women" },
      { id: "men", label: "Men" },
      { id: "everyone", label: "Everyone, I'm open" },
      { id: "nonbinary-people", label: "Non-binary people" },
    ],
  },
  {
    id: "intent",
    prompt: "Right now I'm looking for…",
    category: "preferences",
    options: [
      { id: "serious", label: "Something real and long-term" },
      { id: "casual", label: "Casual and low-pressure" },
      { id: "open", label: "Open to whatever feels right" },
      { id: "friends-first", label: "Friends first, maybe more" },
    ],
  },
];

// ─── Choice-only personalization cards (shown after scenarios) ───────────────

export type PersonalizationOption = {
  id: string;
  label: string;
  promptHint: string;
};

export type PersonalizationCard = {
  id: string;
  prompt: string;
  category: "tone" | "micro-preference";
  options: PersonalizationOption[];
};

export const PERSONALIZATION_CARDS: PersonalizationCard[] = [
  {
    id: "profile-tone",
    prompt: "What should your profile sound like?",
    category: "tone",
    options: [
      {
        id: "warm-sincere",
        label: "Warm and sincere",
        promptHint: "Use grounded, heartfelt language without sounding intense.",
      },
      {
        id: "playful-witty",
        label: "Playful and witty",
        promptHint: "Use light humor and a conversational rhythm.",
      },
      {
        id: "calm-thoughtful",
        label: "Calm and thoughtful",
        promptHint: "Use reflective language with a relaxed pace.",
      },
      {
        id: "direct-confident",
        label: "Direct and confident",
        promptHint: "Use clear, self-assured phrasing without bragging.",
      },
    ],
  },
  {
    id: "humor-style",
    prompt: "What kind of humor feels most like you?",
    category: "micro-preference",
    options: [
      {
        id: "dry-one-liners",
        label: "Dry one-liners",
        promptHint: "Let the profile feel subtly funny, not loud.",
      },
      {
        id: "warm-goofy",
        label: "Warm and goofy",
        promptHint: "Make the profile feel approachable and lightly silly.",
      },
      {
        id: "observational",
        label: "Observational and specific",
        promptHint: "Use tiny lived-in details and smart observations.",
      },
      {
        id: "gentle-teasing",
        label: "Gentle teasing, never mean",
        promptHint: "Keep humor kind, flirty, and low-pressure.",
      },
    ],
  },
  {
    id: "small-ritual",
    prompt: "Pick a small ritual that feels dateable.",
    category: "micro-preference",
    options: [
      {
        id: "matcha-walks",
        label: "Matcha walks and people-watching",
        promptHint: "Include a cozy city-walk detail if it fits.",
      },
      {
        id: "late-night-tacos",
        label: "Late-night tacos after a long day",
        promptHint: "Include a casual food adventure detail if it fits.",
      },
      {
        id: "bookstore-laps",
        label: "Bookstore laps with no agenda",
        promptHint: "Include a bookstore or slow-browse detail if it fits.",
      },
      {
        id: "playlist-swap",
        label: "Swapping playlists on the way home",
        promptHint: "Include a music-sharing detail if it fits.",
      },
    ],
  },
  {
    id: "date-detail",
    prompt: "What first-date detail would make you smile?",
    category: "micro-preference",
    options: [
      {
        id: "corner-booth",
        label: "A corner booth where conversation feels easy",
        promptHint: "Make the date preference feel intimate and conversational.",
      },
      {
        id: "arcade-rematch",
        label: "An arcade game with an unnecessary rematch",
        promptHint: "Make the date preference feel playful and active.",
      },
      {
        id: "farmers-market",
        label: "A farmers market and choosing snacks together",
        promptHint: "Make the date preference feel warm, casual, and specific.",
      },
      {
        id: "tiny-gallery",
        label: "A tiny gallery where we invent opinions",
        promptHint: "Make the date preference feel curious and lightly witty.",
      },
    ],
  },
];

export function getTotalCards(): number {
  return CARDS.length;
}

export function findPersonalizationOption(
  cardId: string,
  optionId: string,
): PersonalizationOption | undefined {
  const card = PERSONALIZATION_CARDS.find((c) => c.id === cardId);
  return card?.options.find((o) => o.id === optionId);
}

export function findOption(
  cardId: string,
  optionId: string,
): ScenarioOption | undefined {
  const card = CARDS.find((c) => c.id === cardId);
  return card?.options.find((o) => o.id === optionId);
}
