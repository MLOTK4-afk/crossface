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
  events,
  onEventsChange,
  getCurrentTime,
}: {
  athleteId: string;
  events: FilmEvent[];
  onEventsChange: (next: FilmEvent[]) => void;
  /** Reads the live player's current playback second, if a video is loaded
   * and ready. Powers the "tag while you watch" quick-capture buttons. */
  getCurrentTime?: () => number | null;
}) {
  const [type, setType] = useState<FilmEvent["type"]>("Takedown");
  const [time, setTime] = useState("");
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [labelDrafts, setLabelDrafts] = useState<Record<number, string>>({});
  const { showToast } = useToast();

  async function save(next: FilmEvent[], message = "Profile updated") {
    const sorted = [...next].sort((a, b) => a.time - b.time);
    setSaving(true);
    const res = await fetch(`/api/athletes/${athleteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filmEvents: sorted }),
    });
    if (res.ok) {
      onEventsChange(sorted);
      showToast(message);
    }
    setSaving(false);
  }

  function captureNow(eventType: FilmEvent["type"]) {
    const current = getCurrentTime?.();
    if (current == null) return;
    save(
      [...events, { type: eventType, time: Math.round(current), label: eventType }],
      `Tagged ${eventType.toLowerCase()} at ${formatFilmTime(Math.round(current))}`
    );
  }

  function updateLabel(i: number, nextLabel: string) {
    const trimmed = nextLabel.trim();
    if (!trimmed || trimmed === events[i].label) return;
    const next = events.map((e, idx) => (idx === i ? { ...e, label: trimmed } : e));
    save(next, "Label updated");
  }

  const canCapture = !!getCurrentTime;

  return (
    <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-5">
      <h3 className="text-sm uppercase tracking-wider text-slate-400">
        Tag Your Film
      </h3>

      {canCapture ? (
        <>
          <p className="mt-1 text-xs text-slate-500">
            Play the video above, then tap a move the moment it happens —
            we&apos;ll grab the timestamp for you.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {EVENT_TYPES.map((t) => (
              <Button
                key={t}
                type="button"
                variant="outline"
                size="sm"
                disabled={saving}
                onClick={() => captureNow(t)}
              >
                Tag {t}
              </Button>
            ))}
          </div>
        </>
      ) : (
        <p className="mt-1 text-xs text-slate-500">
          Add timestamps against your highlight film so coaches can jump
          straight to takedowns, escapes, tilts, and pins.
        </p>
      )}

      {events.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {events.map((e, i) => (
            <li
              key={i}
              className="flex items-center gap-2 rounded-md bg-white/5 px-3 py-1.5 text-sm"
            >
              <span className="shrink-0 font-bold text-white">
                {formatFilmTime(e.time)}
              </span>
              <span className="shrink-0 text-slate-400">· {e.type} ·</span>
              <input
                value={labelDrafts[i] ?? e.label}
                onChange={(ev) =>
                  setLabelDrafts((d) => ({ ...d, [i]: ev.target.value }))
                }
                onBlur={(ev) => updateLabel(i, ev.target.value)}
                className="min-w-0 flex-1 bg-transparent text-slate-300 outline-none focus:text-white"
              />
              <button
                type="button"
                onClick={() => save(events.filter((_, idx) => idx !== i))}
                className="shrink-0 text-slate-500 hover:text-red-400"
                aria-label={`Remove ${e.type} at ${formatFilmTime(e.time)}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <details className="mt-4">
        <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-300">
          Add a timestamp manually instead
        </summary>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            const seconds = parseFilmTime(time);
            if (seconds === null) {
              setError("Enter a timestamp like 1:23 or 83.");
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
            onChange={(ev) => setType(ev.target.value as FilmEvent["type"])}
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
            onChange={(ev) => setTime(ev.target.value)}
            className="w-28"
          />
          <Input
            placeholder="Label (e.g. Double leg, 1st period)"
            value={label}
            onChange={(ev) => setLabel(ev.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="sm" disabled={saving}>
            Add
          </Button>
        </form>
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </details>
    </div>
  );
}
