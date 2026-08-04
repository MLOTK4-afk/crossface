"use client";

import { useState } from "react";
import { Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Disclosure } from "@/components/ui/Disclosure";
import { useToast } from "@/lib/toast/ToastContext";
import type { PriorMatch } from "@/lib/types";

export function MatchRecordEditor({
  athleteId,
  matches,
  onMatchesChange,
  defaultOpen = false,
  title = "Log Your Matches",
}: {
  athleteId: string;
  matches: PriorMatch[];
  onMatchesChange: (next: PriorMatch[]) => void;
  defaultOpen?: boolean;
  title?: string;
}) {
  const [opponent, setOpponent] = useState("");
  const [school, setSchool] = useState("");
  const [result, setResult] = useState<"W" | "L">("W");
  const [method, setMethod] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  async function save(next: PriorMatch[]) {
    setSaving(true);
    const res = await fetch(`/api/athletes/${athleteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matches: next }),
    });
    if (res.ok) {
      onMatchesChange(next);
      showToast("Profile updated");
    }
    setSaving(false);
  }

  return (
    <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-5">
      <Disclosure
        defaultOpen={defaultOpen}
        summary={
          <span className="flex items-center gap-2">
            <span className="text-sm uppercase tracking-wider text-slate-400">
              {title}
            </span>
            {matches.length > 0 && <Badge>{matches.length}</Badge>}
          </span>
        }
      >
        <p className="mt-1 text-xs text-slate-500">
          Add opponents you&apos;ve faced so coaches (and that opponent&apos;s
          own profile) can check whether you&apos;ve already met.
        </p>

        {matches.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {matches.map((m, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-2 rounded-md bg-white/5 px-3 py-1.5 text-sm"
              >
                <span className="text-slate-300">
                  <span
                    className={
                      m.result === "W"
                        ? "font-bold text-emerald-400"
                        : "font-bold text-red-400"
                    }
                  >
                    {m.result}
                  </span>{" "}
                  vs {m.opponent}
                  {m.school && <span className="text-slate-500"> · {m.school}</span>}
                  <span className="text-slate-500">
                    {" "}
                    · {m.method} {m.time}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => save(matches.filter((_, idx) => idx !== i))}
                  className="shrink-0 text-slate-500 hover:text-red-400"
                  aria-label={`Remove match vs ${m.opponent}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!opponent.trim()) {
              setError("Add the opponent's name.");
              return;
            }
            if (!method.trim() || !time.trim()) {
              setError("Add how it ended (e.g. Pin, 3:41 or Dec, 6-2).");
              return;
            }
            setError("");
            save([
              ...matches,
              {
                opponent: opponent.trim(),
                school: school.trim() || undefined,
                result,
                method: method.trim(),
                time: time.trim(),
              },
            ]);
            setOpponent("");
            setSchool("");
            setMethod("");
            setTime("");
          }}
          className="mt-3 flex flex-wrap gap-2"
        >
          <Input
            placeholder="Opponent (e.g. T. Alvarez)"
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Their school (optional)"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="flex-1"
          />
          <Select
            value={result}
            onChange={(e) => setResult(e.target.value as "W" | "L")}
            className="w-24"
          >
            <option value="W">Win</option>
            <option value="L">Loss</option>
          </Select>
          <Input
            placeholder="Method (Pin, Dec, Maj...)"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-40"
          />
          <Input
            placeholder="Time/score (3:41 or 6-2)"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-36"
          />
          <Button type="submit" size="sm" disabled={saving}>
            Add
          </Button>
        </form>
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </Disclosure>
    </div>
  );
}
