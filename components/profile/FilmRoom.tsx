"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export type FilmEvent = {
  type: "Takedown" | "Escape" | "Tilt" | "Pin";
  time: number;
  label: string;
};

const EVENT_COLORS: Record<FilmEvent["type"], string> = {
  Takedown: "#D4A017",
  Escape: "#38bdf8",
  Tilt: "#f97316",
  Pin: "#dc2626",
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Concept preview of the auto-tagging feature -- events/timestamps are
 * illustrative sample data (see SAMPLE_FILM_EVENTS in the athlete page)
 * until real upload-time video analysis exists. The interaction pattern
 * (click a tag, jump the preview) is the real UX this is building toward.
 */
export function FilmRoom({
  bannerUrl,
  events,
  durationSeconds,
}: {
  bannerUrl?: string | null;
  events: FilmEvent[];
  durationSeconds: number;
}) {
  const [selected, setSelected] = useState(0);
  const active = events[selected];

  return (
    <Card className="mt-6 p-6">
      <div className="flex items-center gap-2">
        <h2 className="font-heading text-lg text-white">Film Room</h2>
        <Badge>Auto-tagged</Badge>
      </div>

      <div
        className="relative mt-4 overflow-hidden rounded-xl border border-white/10"
        style={{
          height: 220,
          background: bannerUrl
            ? `linear-gradient(180deg, rgba(2,6,23,0.25) 0%, rgba(2,6,23,0.9) 100%), url(${bannerUrl}) center/cover`
            : "linear-gradient(160deg, #1f2937 0%, #0b1220 100%)",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full"
            style={{
              background: "rgba(2,6,23,0.6)",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "9px solid transparent",
                borderBottom: "9px solid transparent",
                borderLeft: "14px solid white",
                marginLeft: 3,
              }}
            />
          </div>
        </div>
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between rounded-md bg-black/50 px-3 py-2 text-xs">
          <span className="font-bold" style={{ color: EVENT_COLORS[active.type] }}>
            {active.type}
          </span>
          <span className="text-slate-300">{active.label}</span>
          <span className="text-slate-400">{formatTime(active.time)}</span>
        </div>
      </div>

      <div className="relative mt-4 h-2 rounded-full bg-white/10">
        {events.map((e, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${e.type} at ${formatTime(e.time)}`}
            onClick={() => setSelected(i)}
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: `${(e.time / durationSeconds) * 100}%`,
              width: i === selected ? 14 : 10,
              height: i === selected ? 14 : 10,
              background: EVENT_COLORS[e.type],
              border: i === selected ? "2px solid white" : "none",
            }}
          />
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-slate-500">
        <span>0:00</span>
        <span>{formatTime(durationSeconds)}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {events.map((e, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelected(i)}
            className="rounded-full px-3 py-1.5 text-xs font-bold"
            style={{
              border: `1px solid ${EVENT_COLORS[e.type]}66`,
              background: i === selected ? `${EVENT_COLORS[e.type]}26` : "transparent",
              color: EVENT_COLORS[e.type],
            }}
          >
            {formatTime(e.time)} · {e.type}
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs text-slate-500">
        * Concept preview — these timestamps are illustrative sample data
        until real film-upload tagging ships. Every takedown, escape, tilt,
        and pin will be detected automatically the moment match film is
        uploaded to this profile.
      </p>
    </Card>
  );
}
