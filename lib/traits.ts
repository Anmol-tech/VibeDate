import { CARDS, KNOWN_TRAITS, type TraitId, findOption } from "@/content/cards";

export type SelectionMap = Record<string, string>;

export type TraitScores = Record<TraitId, number>;

function emptyScores(): TraitScores {
  return {
    calm: 0,
    thoughtful: 0,
    adventurous: 0,
    social: 0,
    curious: 0,
    intentional: 0,
    playful: 0,
    cozy: 0,
    direct: 0,
  };
}

/**
 * Sum trait weights for each chosen option. Unknown trait keys in content are ignored.
 */
export function aggregateTraits(selections: SelectionMap): TraitScores {
  const scores = emptyScores();

  for (const card of CARDS) {
    const optionId = selections[card.id];
    if (!optionId) continue;
    const option = findOption(card.id, optionId);
    if (!option) continue;

    for (const [trait, weight] of Object.entries(option.traitWeights)) {
      if (!KNOWN_TRAITS.has(trait)) continue;
      const id = trait as TraitId;
      const w = typeof weight === "number" ? weight : 0;
      scores[id] += w;
    }
  }

  return scores;
}

export type RankedTrait = { trait: TraitId; score: number };

export function rankTraits(scores: TraitScores): RankedTrait[] {
  return (Object.entries(scores) as [TraitId, number][])
    .map(([trait, score]) => ({ trait, score }))
    .sort((a, b) => b.score - a.score);
}

export function topTraits(ranked: RankedTrait[], count = 3): TraitId[] {
  const slice = ranked.slice(0, count);
  const minScore = slice[count - 1]?.score ?? 0;
  if (minScore <= 0 && ranked[0]) {
    return [ranked[0].trait];
  }
  return slice.filter((t) => t.score > 0).map((t) => t.trait);
}
