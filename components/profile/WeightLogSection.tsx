"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/lib/toast/ToastContext";
import type { WeightEntry } from "@/lib/types";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function formatShortDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

/** Small inline trend chart -- deliberately unscored: weight going up or
 * down isn't "good" or "bad" on its own, so this never color-codes
 * direction the way MomentumSparkline does for engagement. */
function WeightTrendChart({ entries }: { entries: WeightEntry[] }) {
  const width = 280;
  const height = 64;
  const values = entries.map((e) => e.weight);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = Math.max((max - min) * 0.15, 1);
  const lo = min - pad;
  const hi = max + pad;
  const step = entries.length > 1 ? width / (entries.length - 1) : width;

  const points = entries
    .map((e, i) => {
      const x = i * step;
      const y = height - ((e.weight - lo) / (hi - lo)) * (height - 8) - 4;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-16 w-full"
      preserveAspectRatio="none"
      role="img"
      aria-label="Weight trend"
    >
      <polygon points={areaPoints} className="fill-electric-500/10" />
      <polyline
        points={points}
        fill="none"
        className="stroke-electric-500"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WeightLogSection({
  athleteId,
  initialWeighIns,
}: {
  athleteId: string;
  initialWeighIns: WeightEntry[];
}) {
  const [weighIns, setWeighIns] = useState(
    [...initialWeighIns].sort((a, b) => a.date.localeCompare(b.date))
  );
  const [date, setDate] = useState(todayIso());
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  async function save(next: WeightEntry[], message: string) {
    const sorted = [...next].sort((a, b) => a.date.localeCompare(b.date));
    setSaving(true);
    const res = await fetch(`/api/athletes/${athleteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weighIns: sorted }),
    });
    if (res.ok) {
      setWeighIns(sorted);
      showToast(message);
    }
    setSaving(false);
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(weight);
    if (!date) {
      setError("Pick a date.");
      return;
    }
    if (!Number.isFinite(parsed) || parsed < 50 || parsed > 400) {
      setError("Enter a weight between 50 and 400 lbs.");
      return;
    }
    setError("");
    const withoutSameDate = weighIns.filter((w) => w.date !== date);
    const isUpdate = withoutSameDate.length !== weighIns.length;
    save(
      [...withoutSameDate, { date, weight: parsed }],
      isUpdate
        ? `Updated ${formatShortDate(date)} to ${parsed} lbs`
        : `Logged ${parsed} lbs for ${formatShortDate(date)}`
    );
    setWeight("");
  }

  function handleRemove(entryDate: string) {
    save(
      weighIns.filter((w) => w.date !== entryDate),
      "Removed"
    );
  }

  const current = weighIns[weighIns.length - 1];
  const previous = weighIns[weighIns.length - 2];
  const diff = current && previous ? current.weight - previous.weight : null;
  const recent = [...weighIns].reverse().slice(0, 7);

  return (
    <Card className="mt-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg text-white">Weight Log</h2>
        <span className="text-xs text-slate-500">Only visible to you</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Log your weight before or after practice to see your trend over the
        season. Just a log -- no targets, no cut advice.
      </p>

      {current ? (
        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <div className="font-heading text-3xl text-white">
              {current.weight}
              <span className="ml-1 text-base text-slate-400">lbs</span>
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {formatShortDate(current.date)}
              {diff !== null && (
                <span className="ml-2 text-slate-400">
                  {diff === 0
                    ? "→ no change"
                    : diff > 0
                      ? `↑ ${diff.toFixed(1)} lbs`
                      : `↓ ${Math.abs(diff).toFixed(1)} lbs`}{" "}
                  vs last log
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-400">
          No entries yet -- log today&apos;s weight below to start your
          trend.
        </p>
      )}

      {weighIns.length > 1 && (
        <div className="mt-3">
          <WeightTrendChart entries={weighIns} />
        </div>
      )}

      <form
        onSubmit={handleAdd}
        className="mt-4 flex flex-wrap items-end gap-2"
      >
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Date
          </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={todayIso()}
            className="w-40"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Weight (lbs)
          </label>
          <Input
            type="number"
            inputMode="decimal"
            step="0.1"
            placeholder="138.0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-28"
          />
        </div>
        <Button type="submit" size="sm" disabled={saving}>
          Log Weight
        </Button>
      </form>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

      {recent.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {recent.map((w) => (
            <li
              key={w.date}
              className="flex items-center justify-between rounded-md bg-white/5 px-3 py-1.5 text-sm"
            >
              <span className="text-slate-300">
                <span className="font-bold text-white">{w.weight} lbs</span>
                <span className="ml-2 text-slate-500">
                  {formatShortDate(w.date)}
                </span>
              </span>
              <button
                type="button"
                onClick={() => handleRemove(w.date)}
                className="shrink-0 text-slate-500 hover:text-red-400"
                aria-label={`Remove weigh-in from ${formatShortDate(w.date)}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
