import type { Level } from "@/lib/types";

export const LEVELS: { value: Level; label: string; blurb: string }[] = [
  {
    value: "youth",
    label: "Youth",
    blurb: "Not yet in high school? Start building your recruiting presence early.",
  },
  {
    value: "high-school",
    label: "High School",
    blurb: "Build your recruiting profile for college coaches",
  },
  {
    value: "college",
    label: "College",
    blurb: "Get discovered for transfer portal opportunities",
  },
  {
    value: "independent",
    label: "Independent",
    blurb: "Training or competing outside a school or college team",
  },
];

// Crossface is wrestling-only -- a single-entry list keeps every place that
// maps over SPORTS (wizard, leaderboard tabs) working without restructuring
// their UI, while making Wrestling the only possible value.
export const SPORTS = ["Wrestling"];

// Crossface is New Jersey/East Coast-focused -- North/Central/South Jersey
// are the core market (matching how NJ wrestling is regionally understood),
// with the surrounding East Coast states covering everyone else.
export const REGIONS = [
  "North Jersey",
  "Central Jersey",
  "South Jersey",
  "New York",
  "Pennsylvania",
  "Connecticut",
  "Delaware / Maryland",
  "Virginia / DC",
  "New England",
  "Other East Coast",
];

export const COUNTRIES = [
  "Argentina",
  "Australia",
  "Brazil",
  "Cameroon",
  "Canada",
  "Chile",
  "Colombia",
  "England",
  "France",
  "Germany",
  "Ghana",
  "Ireland",
  "Italy",
  "Ivory Coast",
  "Japan",
  "Kenya",
  "Mexico",
  "Netherlands",
  "Nigeria",
  "Poland",
  "Portugal",
  "Senegal",
  "South Africa",
  "South Korea",
  "Spain",
  "Sweden",
  "Serbia",
  "Other",
];

export const ENGLISH_PROFICIENCY_LEVELS = [
  "Native / Fluent",
  "IELTS 7.0+ / TOEFL 90+",
  "IELTS 5.5-6.5 / TOEFL 60-89",
  "Currently studying English",
];

export const ELIGIBILITY_STATUSES = [
  "NCAA Eligibility Center registered",
  "In progress",
  "Not yet registered",
];

export const DIVISIONS = ["D1", "D2", "D3", "NAIA"] as const;

export const LANGUAGES: { value: "en" | "pt" | "es" | "fr"; label: string }[] =
  [
    { value: "en", label: "English" },
    { value: "pt", label: "Português" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
  ];

export const BOARD_COLUMNS: { key: string; label: string }[] = [
  { key: "toContact", label: "To Contact" },
  { key: "contacted", label: "Contacted" },
  { key: "replied", label: "Replied" },
  { key: "offerReceived", label: "Offer Received" },
];
