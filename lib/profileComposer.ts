import type { TraitId } from "@/content/cards";
import type { RankedTrait } from "@/lib/traits";

export type GeneratedProfile = {
  bio: string;
  datingVibe: string;
  communicationStyle: string;
  firstDatePreference: string;
  greenFlags: string[];
  matchWellWith: string;
  traitLabels: string[];
};

const TRAIT_LABELS: Record<TraitId, string> = {
  calm: "grounded pace",
  thoughtful: "depth-first",
  adventurous: "novelty-seeking",
  social: "people-energy",
  curious: "explorer mindset",
  intentional: "structured clarity",
  playful: "lighthearted warmth",
  cozy: "homebody comfort",
  direct: "straightforward tone",
};

function pickVariant(seed: string, variants: string[]): string {
  if (variants.length === 0) return "";
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const idx = h % variants.length;
  const choice = variants[idx] ?? variants[0];
  return choice ?? "";
}

function bioFromTraits(
  primary: TraitId,
  secondary: TraitId,
  seed: string,
): string {
  const templates: Record<string, string[]> = {
    calm_thoughtful: [
      "I recharge with quiet rituals and prefer dating that doesn’t feel like a performance, more listening, less rushing.",
      "I’m warm but unhurried, and I like chemistry that builds through real conversation, not constant stimulation.",
    ],
    adventurous_social: [
      "I collect stories, nights out, new neighborhoods, friends in the mix, and I want someone who can match that momentum.",
      "I’m energized by people and novelty; I’m happiest when plans feel a little spontaneous but still kind.",
    ],
    curious_intentional: [
      "I’m constantly tinkering with life, new skills, new spots, but I still like knowing what I’m signing up for.",
      "I approach dating like a curious project: learn fast, iterate, and be honest about what works.",
    ],
    cozy_social: [
      "I’m homebody-leaning but not antisocial, small groups, good food, and meaningful hangs beat loud crowds.",
      "I like intimacy over spectacle: a dinner table, inside jokes, and people who show up consistently.",
    ],
    direct_intentional: [
      "I respect people’s time, mine included, and I prefer clarity over guessing games.",
      "I’m upfront about intent and pace; kindness, to me, includes being honest early.",
    ],
    playful_curious: [
      "I flirt through curiosity and humor, banter, hypotheticals, and not taking myself too seriously.",
      "I want dating to feel fun again: discovery, laughter, and low-stakes courage.",
    ],
    default: [
      "I’m multifaceted, not easily summed up by one vibe, but I care more about authenticity than polish.",
      "I’m trying to show up as myself, not a highlight reel, and I want the same from someone else.",
    ],
  };

  const key = `${primary}_${secondary}`;
  const pool: string[] =
    templates[key] ??
    templates[`${secondary}_${primary}`] ??
    templates.default ??
    [];
  return pickVariant(seed + key, pool);
}

function datingVibe(primary: TraitId, seed: string): string {
  const map: Record<TraitId, string[]> = {
    calm: [
      "I’m a slow-burn romantic, chemistry over chaos.",
      "Soft launch energy: cozy, consistent, low drama.",
    ],
    thoughtful: [
      "I’m meaning-forward, I fall for minds before aesthetics.",
      "Emotionally literate, you notice subtext and care about it.",
    ],
    adventurous: [
      "I’m plot-twist positive, I like dates that become stories.",
      "Yes-and energy, plans are a playground, not a test.",
    ],
    social: [
      "I’m community-connected, my world has room for “our people.”",
      "High-trust extroversion, loud rooms, soft boundaries.",
    ],
    curious: [
      "Always experimenting, new cuisines, skills, rabbit holes.",
      "I’m wonder-led, I ask “what if?” out loud.",
    ],
    intentional: [
      "I bring architect energy, I design a life on purpose.",
      "Serious about compatibility, playful about the details.",
    ],
    playful: [
      "I’m joy-forward, silliness is a love language.",
      "Teasing-with-care, affection sounds like laughter.",
    ],
    cozy: [
      "I’m a blanket-fort romantic, intimacy beats spectacle.",
      "Small-circle loyal, depth over breadth.",
    ],
    direct: [
      "I’m a no-subtext zone, I say what I mean.",
      "Efficient heart, fewer games, more clarity.",
    ],
  };
  return pickVariant(seed + primary, map[primary]);
}

function communicationStyle(top: TraitId[], seed: string): string {
  const [a, b] = top;
  const key = [a, b].filter(Boolean).join("|");
  const variants = [
    "I communicate best when there’s room for nuance, voice notes, long texts, or real-time talks when it matters.",
    "I like steady check-ins rather than constant pings; quality threads beat endless small talk.",
    "I’m okay being direct when something’s off, respect includes naming friction kindly.",
    "I mirror energy thoughtfully: playful when it’s light, grounded when it’s serious.",
  ];
  return pickVariant(seed + key, variants);
}

function firstDatePreference(primary: TraitId, seed: string): string {
  const map: Record<TraitId, string[]> = {
    calm: [
      "I’m into coffee, a walk, or something low-pressure where conversation can breathe.",
      "A quiet corner spot, enough stimulation to connect, not enough to overwhelm.",
    ],
    thoughtful: [
      "I’m happiest at a museum, bookstore browse, or anywhere we can trade recommendations.",
      "Dinner with time blocked after, you hate feeling rushed mid-story.",
    ],
    adventurous: [
      "I’d say yes to a mini-adventure: trivia night, climbing gym, or a food crawl.",
      "Something active outdoors where awkward silence doesn’t exist.",
    ],
    social: [
      "I like a lively bar or group-adjacent hang, energy helps me open up.",
      "Game night energy: playful competition breaks the ice.",
    ],
    curious: [
      "I’d pick a cooking class, tasting menu, or niche exhibit, learning together beats small talk.",
      "Spontaneous pivot plans, start small, see where curiosity pulls you.",
    ],
    intentional: [
      "I relax with a clear plan and a backup, logistics don’t need to be a mystery.",
      "Structured time box: one great hour beats an ambiguous “maybe later.”",
    ],
    playful: [
      "I’m into mini-golf, arcades, comedy, anything where laughter does the heavy lifting.",
      "Dessert-first chaos, life’s short, order the weird flavor.",
    ],
    cozy: [
      "I love a farmer’s market plus home-cooking fantasy, domestic without rushing intimacy.",
      "Tea shop or bakery date, sweet, soft, easy exit ramps.",
    ],
    direct: [
      "I like a straight-up dinner where we can talk intentions without making it an interview.",
      "Phone-call-first optional, you like tone clarity early.",
    ],
  };
  return pickVariant(seed + primary, map[primary]);
}

function greenFlags(top: TraitId[], seed: string): string[] {
  const pool: Record<TraitId, string> = {
    calm: "I notice patience when plans shift, small friction doesn’t become a crisis.",
    thoughtful:
      "I love when someone remembers details and follows up naturally.",
    adventurous:
      "I appreciate someone who says yes to a thoughtful wildcard plan.",
    social:
      "I like when someone includes me comfortably without making it a performance.",
    curious:
      "I’m drawn to people who ask good questions, the kind that don’t feel scripted.",
    intentional:
      "I appreciate someone who names what they want without turning it into pressure.",
    playful:
      "I like people who can laugh at themselves, humor without meanness.",
    cozy: "I value someone who respects downtime and doesn’t treat rest like laziness.",
    direct:
      "I appreciate clear communication when something’s wrong, repair over ego.",
  };

  const flags = top.map((t) => pool[t]).filter(Boolean);
  const extras = [
    "I notice consistent follow-through, words and actions line up.",
    "I value emotional generosity, celebrating wins without competing.",
  ];
  const combined = [...flags, ...extras];
  const out: string[] = [];
  let h = 0;
  for (const s of seed) h = (h + s.charCodeAt(0)) % combined.length;
  for (let i = 0; i < Math.min(4, combined.length); i++) {
    const idx = (h + i) % combined.length;
    const item = combined[idx];
    if (item && !out.includes(item)) out.push(item);
  }
  return out.slice(0, 4);
}

function matchWellWith(
  top: TraitId[],
  ranked: RankedTrait[],
  fallbackPrimary: TraitId,
): string {
  const labels =
    top.length > 0
      ? top.map((t) => TRAIT_LABELS[t]).filter(Boolean)
      : [TRAIT_LABELS[fallbackPrimary]];
  const traitLine = labels.join(", ");
  const wildcard =
    ranked.find((r) => r.score > 0 && !top.includes(r.trait))?.trait ??
    top[0] ??
    fallbackPrimary;
  const complement =
    wildcard === "adventurous"
      ? "people who balance novelty with follow-through"
      : wildcard === "calm"
        ? "people who bring gentle momentum without rushing me"
        : wildcard === "social"
          ? "people who love people but still prioritize one-on-one depth"
          : wildcard === "intentional"
            ? "people who appreciate clarity and match my follow-through"
            : "people who enjoy depth, kindness, and a little courage";

  return `I tend to match with ${traitLine} energy, especially ${complement}.`;
}

export function composeProfile(ranked: RankedTrait[]): GeneratedProfile {
  const seed = ranked.map((r) => `${r.trait}:${r.score}`).join(",");
  const top = ranked.filter((r) => r.score > 0).slice(0, 3);
  const primary = top[0]?.trait ?? "thoughtful";
  const secondary = top[1]?.trait ?? "curious";
  const topIds = top.map((t) => t.trait);

  const traitLabels = topIds.map((id) => TRAIT_LABELS[id]);

  return {
    bio: bioFromTraits(primary, secondary, seed),
    datingVibe: datingVibe(primary, seed),
    communicationStyle: communicationStyle(topIds, seed),
    firstDatePreference: firstDatePreference(primary, seed),
    greenFlags: greenFlags(topIds, seed),
    matchWellWith: matchWellWith(topIds, ranked, primary),
    traitLabels,
  };
}
