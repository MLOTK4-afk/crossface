/**
 * Per-month accent for the "Athlete of the Month" card so the recurring
 * series doesn't reuse one static look forever -- each month gets its own
 * palette/motif while staying inside Snapdown's navy base. Add a new entry
 * here as each month's card gets made; anything not yet defined falls back
 * to the brand's own electric-blue so the card never breaks.
 */
export interface MonthTheme {
  label: string;
  kicker: string;
  accent: string;
  accentSoft: string;
  gradient: string;
}

const MONTH_THEMES: Partial<Record<number, MonthTheme>> = {
  7: {
    label: "July",
    kicker: "Summer Standout",
    accent: "#F59E0B",
    accentSoft: "rgba(245, 158, 11, 0.16)",
    gradient: "linear-gradient(100deg, #F59E0B 0%, #EF4444 55%, #3B82F6 100%)",
  },
};

const DEFAULT_THEME: Omit<MonthTheme, "label"> = {
  kicker: "Athlete of the Month",
  accent: "#3B82F6",
  accentSoft: "rgba(59, 130, 246, 0.16)",
  gradient: "linear-gradient(90deg, #3B82F6 0%, #4F46E5 100%)",
};

export function getMonthTheme(monthNumber: number): MonthTheme {
  const known = MONTH_THEMES[monthNumber];
  if (known) return known;
  const label = new Date(2000, monthNumber - 1, 1).toLocaleString("en-US", {
    month: "long",
  });
  return { label, ...DEFAULT_THEME };
}
