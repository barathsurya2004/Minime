type ContextInput = {
    inferredMood?: string;
    affectionLevel: number;
    affectionBand: string;
    interactionGapHours?: number;
};

export function buildContextPrompt({
    inferredMood = "neutral",
    affectionLevel,
    affectionBand,
    interactionGapHours = 0,
}: ContextInput) {
    return `
CURRENT CONTEXT:
- User mood (inferred): ${inferredMood}
- Affection level: ${affectionLevel}
- Affection band: ${affectionBand}
- Time since last interaction: ${interactionGapHours} hours

GREETING RULES:
- Match greeting tone to affection band.
- Never mention affection, distance, or absence.
- Low affection = relief and softness.
- High affection = confidence and warmth.
`.trim();
}
