"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { AthleteProfile, PriorMatch } from "@/lib/types";
import { LEVELS } from "@/lib/constants";
import { TierBadge } from "@/components/ui/Badge";
import { getAthleteTier } from "@/lib/tier";
import { StatCardGrid } from "@/components/profile/StatCardGrid";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";

function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[.]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Loose enough to catch a shorthand log ("T. Alvarez") against a full
 * profile name ("Tyler Alvarez") -- opponent names are free text typed by
 * a different athlete, not a reference to this profile, so this is a
 * best-effort match, not a guarantee. */
function namesMatch(a: string, b: string) {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb) return false;
  return na === nb || na.includes(nb) || nb.includes(na);
}

interface LoggedAgainst {
  loggedBy: AthleteProfile;
  match: PriorMatch;
}

/**
 * Search any published wrestler on Crossface and pull up their record,
 * weight class, and every match logged against them by any athlete (not
 * just the searcher's own log). Shared between the standalone /scout page
 * and the Match Day hub's "Scout Your Opponent" step.
 */
export function ScoutSearch({
  emptyTitle = "Search a wrestler to get started",
  emptyDescription = "Pull up anyone's record and weight class before you step on the mat — and see if a teammate has already logged a match against them.",
}: {
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const [athletes, setAthletes] = useState<AthleteProfile[] | null>(null);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/athletes")
      .then((res) => res.json())
      .then(setAthletes)
      .catch(() => setAthletes([]));
  }, []);

  const needle = query.trim();
  const results = useMemo(() => {
    if (!athletes || !needle) return [];
    const n = needle.toLowerCase();
    return athletes.filter((a) => a.name.toLowerCase().includes(n)).slice(0, 8);
  }, [athletes, needle]);

  const selected = athletes?.find((a) => a.id === selectedId) ?? null;

  const loggedAgainst: LoggedAgainst[] = useMemo(() => {
    if (!selected || !athletes) return [];
    const found: LoggedAgainst[] = [];
    for (const a of athletes) {
      if (a.id === selected.id) continue;
      for (const m of a.matches ?? []) {
        if (namesMatch(m.opponent, selected.name)) {
          found.push({ loggedBy: a, match: m });
        }
      }
    }
    return found;
  }, [selected, athletes]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelectedId(null);
        }}
        placeholder="Search a wrestler's name..."
        className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500"
      />

      {!selected && needle && results.length > 0 && (
        <ul className="mt-3 divide-y divide-white/5 overflow-hidden rounded-lg border border-white/10">
          {results.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => setSelectedId(a.id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium text-white">
                    {a.name}
                  </span>
                  <span className="block truncate text-xs text-slate-500">
                    {a.region}
                    {a.positions && ` · ${a.positions}`}
                  </span>
                </span>
                <TierBadge tier={getAthleteTier(a)} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {!selected && needle && athletes !== null && results.length === 0 && (
        <p className="mt-3 text-sm text-slate-500">
          No published profiles match &ldquo;{query}&rdquo;.
        </p>
      )}

      {!selected && !needle && (
        <div className="mt-6">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      )}

      {selected && (
        <Card className="mt-6 p-6">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="mb-4 text-xs text-slate-500 hover:text-white"
          >
            ← Back to search
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-heading text-2xl text-white">
              {selected.name}
            </h2>
            <TierBadge tier={getAthleteTier(selected)} />
          </div>
          <p className="mt-1 text-sm text-slate-400">
            {LEVELS.find((l) => l.value === selected.level)?.label ??
              selected.level}
            {" · "}
            {selected.region}
            {selected.positions && ` · ${selected.positions}`}
            {selected.gradYear && ` · Class of ${selected.gradYear}`}
          </p>

          {selected.scoutingReport?.tagline && (
            <p className="mt-3 italic text-skyline-300">
              &ldquo;{selected.scoutingReport.tagline}&rdquo;
            </p>
          )}

          {Object.keys(selected.stats).length > 0 && (
            <div className="mt-4">
              <StatCardGrid
                cards={Object.entries(selected.stats).map(
                  ([label, value]) => ({ label, value })
                )}
              />
            </div>
          )}

          {!!selected.scoutingReport?.strengths?.length && (
            <div className="mt-4">
              <h3 className="text-xs uppercase tracking-wider text-slate-400">
                Strengths
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-slate-300">
                {selected.scoutingReport.strengths.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 border-t border-white/10 pt-4">
            <h3 className="text-sm uppercase tracking-wider text-slate-400">
              Logged Matches Against {selected.name}
            </h3>
            {loggedAgainst.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">
                No one on Crossface has logged a match against{" "}
                {selected.name} yet.
              </p>
            ) : (
              <ul className="mt-2 space-y-1.5">
                {loggedAgainst.map(({ loggedBy, match }, i) => (
                  <li
                    key={i}
                    className="rounded-md bg-white/5 px-3 py-2 text-sm"
                  >
                    <Link
                      href={`/athletes/${loggedBy.id}`}
                      className="font-medium text-white hover:text-electric-400"
                    >
                      {loggedBy.name}
                    </Link>
                    <span className="text-slate-400">
                      {" "}
                      reported {match.result === "W" ? "a win over" : "a loss to"}{" "}
                      {selected.name} — {match.method}
                      {match.time ? `, ${match.time}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-xs text-slate-500">
              * Self-reported by each athlete against their own match log —
              not independently verified.
            </p>
          </div>

          <div className="mt-6">
            <LinkButton
              href={`/athletes/${selected.id}`}
              variant="outline"
              size="sm"
            >
              View Full Profile →
            </LinkButton>
          </div>
        </Card>
      )}
    </div>
  );
}
