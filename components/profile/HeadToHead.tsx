"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Field";

export type PriorMatch = {
  opponent: string;
  school: string;
  result: "W" | "L";
  method: string;
  time: string;
};

/**
 * Concept preview -- checks a typed name against this athlete's own sample
 * match log (see SAMPLE_RECENT on the athlete page). The real feature lets
 * any wrestler submit their full record and opponents faced, so this
 * search would work across every profile on Snapdown, not just this one.
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
                    <span className="text-slate-500"> · {m.school}</span>
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
        * Checked here against this wrestler&apos;s sample match log. The
        real feature lets any wrestler submit their full record and the
        opponents they&apos;ve faced, so this search works across every
        profile on Snapdown.
      </p>
    </Card>
  );
}
