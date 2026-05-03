import { NextResponse } from "next/server";
import {
  CARDS,
  PERSONALIZATION_CARDS,
  findOption,
  findPersonalizationOption,
} from "@/content/cards";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { composeProfile, type GeneratedProfile } from "@/lib/profileComposer";
import type { SelectionMap } from "@/lib/traits";
import { aggregateTraits, rankTraits } from "@/lib/traits";

type GenerateProfileResponse = {
  profile: GeneratedProfile;
  source: "openrouter" | "fallback";
  profileId?: string;
  model?: string;
  warning?: string;
};

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-4o-mini";

function isSelectionMap(value: unknown): value is SelectionMap {
  if (!value || typeof value !== "object") return false;
  const selections = value as Record<string, unknown>;
  return CARDS.every(
    (card) =>
      typeof selections[card.id] === "string" &&
      selections[card.id] !== undefined,
  );
}

function isPersonalizationMap(
  value: unknown,
): value is Record<string, string> {
  if (!value || typeof value !== "object") return false;
  const selections = value as Record<string, unknown>;
  return PERSONALIZATION_CARDS.every(
    (card) =>
      typeof selections[card.id] === "string" &&
      selections[card.id] !== undefined,
  );
}

function cleanProfileText(value: string): string {
  return value.trim().replace(/\s*\u2014\s*/g, ", ");
}

function normalizeProfile(
  value: unknown,
  fallback: GeneratedProfile,
): GeneratedProfile | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  const greenFlags = candidate.greenFlags;
  const traitLabels = candidate.traitLabels;

  if (
    typeof candidate.bio !== "string" ||
    typeof candidate.datingVibe !== "string" ||
    typeof candidate.communicationStyle !== "string" ||
    typeof candidate.firstDatePreference !== "string" ||
    typeof candidate.matchWellWith !== "string" ||
    !Array.isArray(greenFlags)
  ) {
    return null;
  }

  return {
    bio: cleanProfileText(candidate.bio) || cleanProfileText(fallback.bio),
    datingVibe:
      cleanProfileText(candidate.datingVibe) ||
      cleanProfileText(fallback.datingVibe),
    communicationStyle:
      cleanProfileText(candidate.communicationStyle) ||
      cleanProfileText(fallback.communicationStyle),
    firstDatePreference:
      cleanProfileText(candidate.firstDatePreference) ||
      cleanProfileText(fallback.firstDatePreference),
    greenFlags: greenFlags
      .filter((item): item is string => typeof item === "string")
      .map(cleanProfileText)
      .filter(Boolean)
      .slice(0, 4),
    matchWellWith:
      cleanProfileText(candidate.matchWellWith) ||
      cleanProfileText(fallback.matchWellWith),
    traitLabels: Array.isArray(traitLabels)
      ? traitLabels
          .filter((item): item is string => typeof item === "string")
          .map(cleanProfileText)
          .filter(Boolean)
          .slice(0, 4)
      : fallback.traitLabels,
  };
}

function parseJsonFromContent(content: string): unknown {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const rawJson = fenced?.[1] ?? trimmed;
  return JSON.parse(rawJson);
}

function parseSavedProfile(value: string): GeneratedProfile | null {
  try {
    return normalizeProfile(JSON.parse(value), composeProfile([]));
  } catch {
    return null;
  }
}

function getSelectedAnswers(
  selections: SelectionMap,
  customTexts: Record<string, string> = {},
) {
  return CARDS.map((card) => {
    const optionId = selections[card.id];
    if (optionId === "custom") {
      return {
        question: card.prompt,
        answer: customTexts[card.id]?.trim() || "(custom answer)",
        traitWeights: {},
      };
    }
    const option = optionId ? findOption(card.id, optionId) : undefined;
    return {
      question: card.prompt,
      answer: option?.label ?? optionId ?? "No answer",
      traitWeights: option?.traitWeights ?? {},
    };
  });
}

function getPersonalizationAnswers(personalization: Record<string, string>) {
  return PERSONALIZATION_CARDS.map((card) => {
    const optionId = personalization[card.id];
    const option = optionId
      ? findPersonalizationOption(card.id, optionId)
      : undefined;
    return {
      question: card.prompt,
      answer: option?.label ?? optionId ?? "No answer",
      promptHint: option?.promptHint ?? "",
    };
  });
}

const BASIC_INFO_LABELS: Record<string, string> = {
  man: "Man",
  woman: "Woman",
  nonbinary: "Non-binary",
  "other-identity": "Something else",
  "prefer-not-to-say": "Prefers not to say",
  women: "Women",
  men: "Men",
  everyone: "Everyone",
  "nonbinary-people": "Non-binary people",
  serious: "Something real and long-term",
  casual: "Casual and low-pressure",
  open: "Open to whatever feels right",
  "friends-first": "Friends first, maybe more",
};

function labelBasicInfo(basicInfo: Record<string, string>) {
  return {
    gender:
      BASIC_INFO_LABELS[basicInfo["gender"] ?? ""] ??
      basicInfo["gender"] ??
      "not specified",
    lookingFor:
      BASIC_INFO_LABELS[basicInfo["looking-for"] ?? ""] ??
      basicInfo["looking-for"] ??
      "not specified",
    intent:
      BASIC_INFO_LABELS[basicInfo["intent"] ?? ""] ??
      basicInfo["intent"] ??
      "not specified",
  };
}

function buildPrompt(
  selections: SelectionMap,
  customTexts: Record<string, string>,
  basicInfo: Record<string, string>,
  personalization: Record<string, string>,
  rankedTraits: ReturnType<typeof rankTraits>,
  fallback: GeneratedProfile,
  variationSeed: string,
) {
  const identity = labelBasicInfo(basicInfo);
  return [
    {
      role: "system" as const,
      content:
        "You are VibeDate, a tasteful dating-profile assistant. Generate specific, warm, non-cringey dating profile copy from the user's scenario choices. Write as if the user is describing themselves on a dating app, using first person only: I, me, my. Avoid therapy-speak, diagnoses, stereotypes, overclaiming, and second-person language. Use the user's gender and intent to inform tone naturally; do not mention them explicitly. Return only valid JSON.",
    },
    {
      role: "user" as const,
      content: JSON.stringify(
        {
          task: "Create a structured first-person dating profile snapshot.",
          userIdentity: {
            gender: identity.gender,
            interestedIn: identity.lookingFor,
            lookingFor: identity.intent,
          },
          outputSchema: {
            bio: "string, 1-2 first-person sentences, profile-ready",
            datingVibe: "string, short first-person phrase or one sentence",
            communicationStyle: "string, one first-person sentence",
            firstDatePreference: "string, one first-person sentence",
            greenFlags:
              "array of 3-4 concise strings describing what I appreciate in someone else",
            matchWellWith:
              "string, one first-person sentence about who I tend to connect with",
            traitLabels:
              "array of 3-4 short plain-language labels based on the traits",
          },
          constraints: [
            "Write ALL profile fields in first person (I / me / my). Never use you/your.",
            "Do not mention OpenRouter, LLMs, tools, hidden scoring, or JSON.",
            "Do not use em dashes. Use commas, periods, parentheses, or short sentences instead.",
            "Keep it modern and human, not overly polished or clinical.",
            "Use the personalization choices to make the copy specific, not cookie-cutter.",
            "Use the variation seed only to vary phrasing, sentence rhythm, and word choice. Do not invent new facts.",
            "Use the fallback only as a style reference, not as text to copy.",
          ],
          selectedAnswers: getSelectedAnswers(selections, customTexts),
          personalizationChoices: getPersonalizationAnswers(personalization),
          rankedTraits: rankedTraits.filter((trait) => trait.score > 0),
          variationSeed,
          fallbackStyleReference: fallback,
        },
        null,
        2,
      ),
    },
  ];
}

async function generateWithOpenRouter(
  selections: SelectionMap,
  fallback: GeneratedProfile,
  rankedTraits: ReturnType<typeof rankTraits>,
  customTexts: Record<string, string>,
  basicInfo: Record<string, string>,
  personalization: Record<string, string>,
  variationSeed: string,
): Promise<GenerateProfileResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL;

  if (!apiKey) {
    return {
      profile: fallback,
      source: "fallback",
      warning:
        "Personalized generation is not configured, so VibeDate used the local profile engine.",
    };
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer":
        process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      "X-Title": "VibeDate",
    },
    body: JSON.stringify({
      model,
      messages: buildPrompt(
        selections,
        customTexts,
        basicInfo,
        personalization,
        rankedTraits,
        fallback,
        variationSeed,
      ),
      temperature: 0.9,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    return {
      profile: fallback,
      source: "fallback",
      model,
      warning: `Personalized generation was unavailable (${response.status}), so VibeDate used the local profile engine.`,
    };
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    return {
      profile: fallback,
      source: "fallback",
      model,
      warning:
        "Personalized generation returned an empty response, so VibeDate used the local profile engine.",
    };
  }

  const parsed = parseJsonFromContent(content);
  const profile = normalizeProfile(parsed, fallback);
  if (!profile) {
    return {
      profile: fallback,
      source: "fallback",
      model,
      warning:
        "Personalized generation returned an unexpected response, so VibeDate used the local profile engine.",
    };
  }

  return { profile, source: "openrouter", model };
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in to generate a profile." },
      { status: 401 },
    );
  }

  const existingProfile = await prisma.profile.findFirst({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  if (existingProfile) {
    const profile = parseSavedProfile(existingProfile.generatedProfileJson);
    if (profile) {
      return NextResponse.json({
        profile,
        source: existingProfile.generationSource as "openrouter" | "fallback",
        profileId: existingProfile.id,
        model: existingProfile.generationModel ?? undefined,
        warning: existingProfile.generationWarning ?? undefined,
      } satisfies GenerateProfileResponse);
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const {
    selections,
    basicInfo = {},
    personalization = {},
    customTexts = {},
  } = (body ?? {}) as {
    selections?: unknown;
    basicInfo?: Record<string, string>;
    personalization?: unknown;
    customTexts?: Record<string, string>;
  };

  if (!isSelectionMap(selections)) {
    return NextResponse.json(
      { error: "Selections must include one valid option id per card." },
      { status: 400 },
    );
  }

  if (!isPersonalizationMap(personalization)) {
    return NextResponse.json(
      { error: "Personalization must include one valid option id per card." },
      { status: 400 },
    );
  }

  const scores = aggregateTraits(selections);
  const rankedTraits = rankTraits(scores);
  const fallback = composeProfile(rankedTraits);
  const variationSeed = `${user.id}:${Date.now()}`;

  const saveProfile = async (
    result: GenerateProfileResponse,
  ): Promise<string> => {
    const row = await prisma.profile.create({
      data: {
        userId: user.id,
        responsesJson: JSON.stringify(
          {
            scenarios: getSelectedAnswers(selections, customTexts),
            personalization: getPersonalizationAnswers(personalization),
          },
        ),
        traitScoresJson: JSON.stringify(scores),
        generatedProfileJson: JSON.stringify(result.profile),
        basicInfoJson: JSON.stringify(basicInfo),
        generationSource: result.source,
        generationModel: result.model,
        generationWarning: result.warning,
      },
      select: { id: true },
    });
    return row.id;
  };

  try {
    const result = await generateWithOpenRouter(
      selections,
      fallback,
      rankedTraits,
      customTexts,
      basicInfo,
      personalization,
      variationSeed,
    );
    const profileId = await saveProfile(result);
    return NextResponse.json({ ...result, profileId });
  } catch (error) {
    const result = {
      profile: fallback,
      source: "fallback",
      warning:
        error instanceof Error
          ? `Generation failed: ${error.message}`
          : "Generation failed.",
    } satisfies GenerateProfileResponse;

    const profileId = await saveProfile(result);
    return NextResponse.json({ ...result, profileId });
  }
}
