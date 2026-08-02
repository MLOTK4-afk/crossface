"use client";

import { useCallback, useRef, useState } from "react";
import {
  FilmRoom,
  getYouTubeVideoId,
  type FilmPlayer,
} from "@/components/profile/FilmRoom";
import { FilmEventsEditor } from "@/components/profile/FilmEventsEditor";
import type { FilmEvent } from "@/lib/types";

/**
 * Owns the live YouTube player reference and the athlete's film-events
 * state, so the always-visible FilmRoom display and the owner-only
 * FilmEventsEditor (rendered separately below it) can share both without
 * either needing to know how the other works.
 */
export function FilmRoomSection({
  bannerUrl,
  highlightUrl,
  highlightVideoUrl,
  athleteId,
  initialFilmEvents,
  initialFilmCandidates,
  sampleEvents,
  sampleDurationSeconds,
  isOwner,
}: {
  bannerUrl?: string | null;
  highlightUrl?: string | null;
  highlightVideoUrl?: string | null;
  athleteId: string;
  initialFilmEvents: FilmEvent[];
  initialFilmCandidates: number[];
  sampleEvents: FilmEvent[];
  sampleDurationSeconds: number;
  isOwner: boolean;
}) {
  const [filmEvents, setFilmEvents] = useState(initialFilmEvents);
  const [filmCandidates, setFilmCandidates] = useState(initialFilmCandidates);
  const playerRef = useRef<FilmPlayer | null>(null);

  const hasReal = filmEvents.length > 0;
  const events = hasReal ? filmEvents : sampleEvents;
  const allTimes = [...filmEvents.map((e) => e.time), ...filmCandidates];
  const durationSeconds = hasReal
    ? Math.max(...allTimes) + 30
    : sampleDurationSeconds;

  const handlePlayerReady = useCallback((player: FilmPlayer) => {
    playerRef.current = player;
  }, []);

  const hasEmbeddablePlayer =
    !!highlightVideoUrl || !!(highlightUrl && getYouTubeVideoId(highlightUrl));

  return (
    <>
      <FilmRoom
        bannerUrl={bannerUrl}
        highlightUrl={highlightUrl}
        highlightVideoUrl={highlightVideoUrl}
        events={events}
        durationSeconds={durationSeconds}
        isSample={!hasReal}
        onPlayerReady={handlePlayerReady}
      />
      {isOwner && (
        <FilmEventsEditor
          athleteId={athleteId}
          events={filmEvents}
          onEventsChange={setFilmEvents}
          getCurrentTime={
            hasEmbeddablePlayer
              ? () => playerRef.current?.getCurrentTime() ?? null
              : undefined
          }
          candidates={filmCandidates}
          onCandidatesChange={setFilmCandidates}
          seekTo={
            hasEmbeddablePlayer
              ? (seconds) => {
                  playerRef.current?.seekTo(seconds, true);
                  playerRef.current?.playVideo();
                }
              : undefined
          }
        />
      )}
    </>
  );
}
