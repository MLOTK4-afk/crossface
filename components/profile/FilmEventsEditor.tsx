"use client";

import { useState } from "react";
import { Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/lib/toast/ToastContext";
import type { FilmEvent } from "@/lib/types";
import { formatFilmTime, parseFilmTime } from "@/lib/filmTime";

const EVENT_TYPES: FilmEvent["type"][] = ["Takedown", "Escape", "Tilt", "Pin"];

export function FilmEventsEditor({
  athleteId,
  initialEvents,
}: {
  athleteId: string;
  initialEvents: FilmEvent[];
}) {
  const [events, setEvents] = useState(
    [...initialEvents].sort((a, b) => a.time - b.time)
  );
  const [type, setType] = useState<FilmEvent["type"]>("Takedown");
  const [time, setTime] = useState("");
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  async function save(next: FilmEvent[]) {
    const sorted = [...next].sort((a, b) => a.time - b.time);
    setSaving(true);
    const res = await fetch(`/api/athletes/${athleteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filmEvents: sorted }),
    });
    if (res.ok) {
      setEvents(sorted);
      showToast("Profile updated");
    }
    setSaving(false);
  }

  return (
    <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-5">
      <h3 className="text-sm uppercase tracking-wider text-slate-400">
        Tag Your Film
      </h3>
      <p className="mt-1 text-xs text-slate-500">
        Add timestamps against your highlight film so coaches can jump
        straight to takedowns, escapes, tilts, and pins.
      </p>

      {events.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {events.map((e, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-2 rounded-md bg-white/5 px-3 py-1.5 text-sm"
            >
              <span className="text-slate-300">
                <span className="font-bold text-white">
                  {formatFilmTime(e.time)}
                </span>{" "}
                · {e.type} · {e.label}
              </span>
              <button
                type="button"
                onClick={() => save(events.filter((_, idx) => idx !== i))}
                className="text-slate-500 hover:text-red-400"
                aria-label={`Remove ${e.type} at ${formatFilmTime(e.time)}`}
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
          const seconds = parseFilmTime(time);
          if (seconds === null) {
            setError('Enter a timestamp like 1:23 or 83.');
            return;
          }
          if (!label.trim()) {
            setError("Add a short label for this moment.");
            return;
          }
          setError("");
          save([...events, { type, time: seconds, label: label.trim() }]);
          setTime("");
          setLabel("");
        }}
        className="mt-3 flex flex-wrap gap-2"
      >
        <Select
          value={type}
          onChange={(e) => setType(e.target.value as FilmEvent["type"])}
          className="w-32"
        >
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
        <Input
          placeholder="Time (1:23)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-28"
        />
        <Input
          placeholder="Label (e.g. Double leg, 1st period)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={saving}>
          Add
        </Button>
      </form>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
