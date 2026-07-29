/**
 * Crossface is wrestling-only, so there's just one accent to carry across
 * every athlete's profile page (accent border, highlight-film button,
 * banner scrim tint) -- the brand gold, matching the rest of the site.
 * Kept as a lookup (rather than a bare constant) so call sites that pass
 * an athlete's sport don't need to change.
 */
export const SPORT_ACCENTS: Record<string, string> = {
  Wrestling: "#D4A017",
};

export function getSportAccent(sport: string): string {
  return SPORT_ACCENTS[sport] ?? "#D4A017";
}
