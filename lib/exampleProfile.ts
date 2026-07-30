import type { AthleteProfile } from "@/lib/types";

/**
 * The one hardcoded demo profile used to show visitors what a completed
 * Crossface profile looks like. This is never written to the JSON store and
 * never returned by any storage/API call — real listings (browse, trending,
 * spotlight, leaderboard, search) only ever read from the store, so this
 * object can't leak into them by construction. `published: false` and
 * `isExample: true` are extra belt-and-suspenders guards in case any future
 * code merges profile arrays together.
 */
export const EXAMPLE_PROFILE: AthleteProfile = {
  id: "example",
  ownerToken: null,
  level: "high-school",
  sport: "Wrestling",
  name: "Jordan Rivera",
  region: "North Jersey",
  positions: "132 lbs",
  team: "Example High School",
  gpa: "3.7",
  stats: {
    Wins: "32",
    Losses: "3",
    Pins: "18",
  },
  achievements: [
    "Region Champion, Senior Year",
    "Team Captain",
    "3x District Qualifier",
  ],
  contactEmail: "",
  committed: false,
  published: false,
  isInternational: false,
  isExample: true,
  scoutingReport: {
    tagline: "North Jersey 132-Pounder Building a Complete Résumé",
    summary:
      "Jordan Rivera is a high-pace 132-pounder out of North Jersey who wins the hand fight early and doesn't let go of it. Takedown volume and a high pin rate stand out on tape, and the results held up against the toughest district competition on the schedule.",
    strengths: [
      "Explosive first-step takedowns from neutral",
      "Relentless mat pace that breaks opponents down late",
      "Proven finisher with a high pin rate",
      "Battle-tested against North Jersey's toughest competition",
    ],
    statCards: [
      { label: "Wins", value: "32" },
      { label: "Losses", value: "3" },
      { label: "Pins", value: "18" },
      { label: "GPA", value: "3.7" },
    ],
    generatedAt: "2026-01-01T00:00:00.000Z",
  },
  combine: [
    { label: "Pro Agility (5-10-5)", value: "4.6s" },
    { label: "Vertical Jump", value: "28 in" },
    { label: "Pull-Ups", value: "18 reps" },
  ],
  combineVerified: false,
  endorsement: {
    name: "Coach T. Hendricks",
    title: "Head Coach, Example High School",
    quote: "This is what a strong coach endorsement looks like on a Crossface profile.",
  },
  previousSeasonStats: "Junior year: 27-4 record, 14 pins, Region Champion",
  targetSchools: ["State University", "Coastal Tech", "Valley College"],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};
