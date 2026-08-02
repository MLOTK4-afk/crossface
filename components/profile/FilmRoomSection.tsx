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
 *
 * Only ever shows an athlete's own real data (self-tagged filmEvents, or
 * candidates from the audio-spike function once labeled) -- never
 * illustrative sample timestamps. Those exist only on the example profile
 * (see app/athletes/example/page.tsx), which renders FilmRoom directly
 * rather than through this component, so a real athlete's video can never
 * end up with fake markers that seek to the wrong place.
 */
export function FilmRoomSection({
  bannerUrl,
  highlightUrl,
  highlightVideoUrl,
  athleteId,
  initialFilmEvents,
  initialFilmCandidates,
  isOwner,
}: {
  bannerUrl?: string | null;
  highlightUrl?: string | null;
  highlightVideoUrl?: string | null;
  athleteId: string;
  initialFilmEvents: FilmEvent[];
  initialFilmCandidates: number[];
  isOwner: boolean;
}) {
  const [filmEvents, setFilmEvents] = useState(initialFilmEvents);
  const [filmCandidates, setFilmCandidates] = useState(initialFilmCandidates);
  const playerRef = useRef<FilmPlayer | null>(null);

  const allTimes = [...filmEvents.map((e) => e.time), ...filmCandidates];
  const durationSeconds = allTimes.length > 0 ? Math.max(...allTimes) + 30 : 30;

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
        events={filmEvents}
        durationSeconds={durationSeconds}
        isSample={false}
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
