/** Shared mm:ss <-> seconds helpers for Film Room timestamps. */

export function formatFilmTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.max(0, Math.round(seconds % 60));
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Parses "1:23" or "83" into seconds. Returns null if unparseable. */
export function parseFilmTime(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/^\d+$/.test(trimmed)) return parseInt(trimmed, 10);
  const match = trimmed.match(/^(\d+):([0-5]?\d)$/);
  if (!match) return null;
  return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
}
