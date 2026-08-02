"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { FilmEvent } from "@/lib/types";
import { formatFilmTime as formatTime } from "@/lib/filmTime";

const EVENT_COLORS: Record<FilmEvent["type"], string> = {
  Takedown: "#D4A017",
  Escape: "#38bdf8",
  Tilt: "#f97316",
  Pin: "#dc2626",
};

/** Returns the video ID for youtube.com/watch, youtu.be, /shorts/, and
 * /embed/ links, or null if the URL isn't a recognizable YouTube link. */
export function getYouTubeVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2] ?? null;
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2] ?? null;
    }
    return null;
  } catch {
    return null;
  }
}

export type FilmPlayer = {
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  playVideo: () => void;
  getCurrentTime: () => number;
  destroy: () => void;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement,
        opts: {
          videoId: string;
          events?: { onReady?: () => void };
        }
      ) => FilmPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApiPromise: Promise<void> | null = null;
/** Loads the YouTube IFrame Player API script once per page, however many
 * FilmRoom instances mount (e.g. the athlete profile plus its Player Card
 * preview never both need it today, but this stays safe either way). */
function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });
  return ytApiPromise;
}

/**
 * The video area plays the athlete's real highlight film when
 * `highlightUrl` is set (embedded via the YouTube IFrame Player API so the
 * timeline below can seek it, otherwise a link out to the host). The event
 * timeline shows the athlete's own self-reported timestamps (`filmEvents`)
 * when they've added any; otherwise it falls back to illustrative sample
 * data (`isSample: true`, see SAMPLE_FILM_EVENTS in the athlete page) so
 * the section still demonstrates the interaction pattern on a profile with
 * no film tagged yet.
 */
export function FilmRoom({
  bannerUrl,
  highlightUrl,
  highlightVideoUrl,
  events,
  durationSeconds,
  isSample,
  onPlayerReady,
}: {
  bannerUrl?: string | null;
  highlightUrl?: string | null;
  /** An uploaded video file, preferred over `highlightUrl` when present --
   * it's the only source that can be scanned for candidate moments. */
  highlightVideoUrl?: string | null;
  events: FilmEvent[];
  durationSeconds: number;
  isSample: boolean;
  /** Fires once the real player is live, so an owner-only tagging UI
   * elsewhere on the page can read its current playback time. */
  onPlayerReady?: (player: FilmPlayer) => void;
}) {
  const [selected, setSelected] = useState(0);
  const active = events[selected];
  const videoId =
    !highlightVideoUrl && highlightUrl ? getYouTubeVideoId(highlightUrl) : null;

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<FilmPlayer | null>(null);
  // Kept in a ref (not the effect's deps) so a parent passing a fresh
  // inline callback each render doesn't tear down and recreate the player.
  const onPlayerReadyRef = useRef(onPlayerReady);
  onPlayerReadyRef.current = onPlayerReady;

  useEffect(() => {
    if (!videoId || !containerRef.current) return;
    let cancelled = false;
    loadYouTubeApi().then(() => {
      if (cancelled || !containerRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        events: {
          onReady: () => {
            if (playerRef.current) onPlayerReadyRef.current?.(playerRef.current);
          },
        },
      });
    });
    return () => {
      cancelled = true;
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [videoId]);

  useEffect(() => {
    if (!highlightVideoUrl || !videoRef.current) return;
    const el = videoRef.current;
    const player: FilmPlayer = {
      seekTo: (seconds) => {
        el.currentTime = seconds;
      },
      playVideo: () => {
        el.play().catch(() => {});
      },
      getCurrentTime: () => el.currentTime,
      destroy: () => {},
    };
    const handleReady = () => {
      playerRef.current = player;
      onPlayerReadyRef.current?.(player);
    };
    el.addEventListener("loadedmetadata", handleReady);
    return () => {
      el.removeEventListener("loadedmetadata", handleReady);
      playerRef.current = null;
    };
  }, [highlightVideoUrl]);

  function selectEvent(i: number) {
    setSelected(i);
    const target = events[i];
    if (target && playerRef.current) {
      playerRef.current.seekTo(target.time, true);
      playerRef.current.playVideo();
    }
  }

  return (
    <Card className="mt-6 p-6">
      <div className="flex items-center gap-2">
        <h2 className="font-heading text-lg text-white">Film Room</h2>
        {events.length > 0 && (
          <Badge>{isSample ? "Sample" : "Self-reported"}</Badge>
        )}
      </div>

      {highlightVideoUrl ? (
        <div className="relative mt-4 aspect-video overflow-hidden rounded-xl border border-white/10">
          <video
            ref={videoRef}
            src={highlightVideoUrl}
            controls
            playsInline
            className="h-full w-full"
          />
        </div>
      ) : videoId ? (
        <div className="relative mt-4 aspect-video overflow-hidden rounded-xl border border-white/10">
          <div ref={containerRef} className="h-full w-full" />
        </div>
      ) : (
        <a
          href={highlightUrl ?? undefined}
          target={highlightUrl ? "_blank" : undefined}
          rel={highlightUrl ? "noreferrer" : undefined}
          className="relative mt-4 block overflow-hidden rounded-xl border border-white/10"
          style={{
            height: 220,
            cursor: highlightUrl ? "pointer" : "default",
            background: bannerUrl
              ? `linear-gradient(180deg, rgba(2,6,23,0.25) 0%, rgba(2,6,23,0.9) 100%), url(${bannerUrl}) center/cover`
              : "linear-gradient(160deg, #1f2937 0%, #0b1220 100%)",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {highlightUrl ? (
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
            ) : (
              <span className="text-sm text-slate-400">
                No highlight film uploaded yet
              </span>
            )}
          </div>
          {highlightUrl && (
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between rounded-md bg-black/50 px-3 py-2 text-xs">
              <span className="text-slate-300">Watch on the original site</span>
              <span className="text-slate-400">↗</span>
            </div>
          )}
        </a>
      )}

      {events.length > 0 && (
        <div className="mt-4 rounded-md bg-black/30 px-3 py-2 text-xs">
          <span className="font-bold" style={{ color: EVENT_COLORS[active.type] }}>
            {active.type}
          </span>
          <span className="ml-2 text-slate-300">{active.label}</span>
          <span className="ml-2 text-slate-400">{formatTime(active.time)}</span>
        </div>
      )}

      <div className="relative mt-4 h-2 rounded-full bg-white/10">
        {events.map((e, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Jump to ${e.type} at ${formatTime(e.time)}`}
            onClick={() => selectEvent(i)}
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
            onClick={() => selectEvent(i)}
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
        {isSample
          ? "* Sample timeline — this athlete hasn't tagged their film yet. Every takedown, escape, tilt, and pin below is illustrative, not real."
          : events.length === 0
            ? "* This athlete hasn't tagged their film yet."
            : videoId || highlightVideoUrl
              ? "* Self-reported by the athlete against their own highlight film. Click a tag to jump the player to that moment."
              : "* Self-reported by the athlete against their own highlight film."}
      </p>
    </Card>
  );
}
