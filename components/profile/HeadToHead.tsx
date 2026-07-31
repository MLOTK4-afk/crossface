"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Field";
import type { PriorMatch } from "@/lib/types";

export type { PriorMatch };

/**
 * Searches this athlete's own self-reported match log (`matches`) for an
 * opponent name. Real, but scoped to what this athlete has submitted about
 * themselves -- it does not cross-reference other Crossface athletes'
 * profiles or any outside results database (see the athlete page for why:
 * no public wrestling-results API exists, and matching by name alone risks
 * attributing the wrong person's record).
 */
export function HeadToHead({ matches }: { matches: PriorMatch[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const found = q ? matches.filter((m) => m.opponent.toLowerCase().includes(q)) : [];

  return (
    <Card className="mt-6 p-6">
      <h2 className="font-heading text-lg text-white">Head-to-Head Check</h2>
      <p className="mt-1 text-xs text-slate-500">
        Search an opponent&apos;s name to see if these two have already met.
      </p>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. Alvarez"
        className="mt-3 max-w-xs"
      />

      {q && (
        <div className="mt-3">
          {found.length > 0 ? (
            <div className="space-y-2">
              {found.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm"
                >
                  <div>
                    <span className={m.result === "W" ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                      {m.result}
                    </span>{" "}
                    <span className="text-slate-200">vs {m.opponent}</span>
                    {m.school && <span className="text-slate-500"> · {m.school}</span>}
                  </div>
                  <div className="text-slate-400">
                    {m.method} {m.time}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              No previous meeting on record for &quot;{query}&quot;.
            </p>
          )}
        </div>
      )}

      <p className="mt-3 text-xs text-slate-500">
        {matches.length > 0
          ? "* Self-reported by this athlete against their own match log."
          : "* This athlete hasn't logged any prior matches yet."}
      </p>
    </Card>
  );
}
