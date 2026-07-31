"use client";

import { useState } from "react";
import { HeadToHead } from "@/components/profile/HeadToHead";
import { MatchRecordEditor } from "@/components/profile/MatchRecordEditor";
import type { PriorMatch } from "@/lib/types";

/**
 * Owns the athlete's match-record state so the search (HeadToHead) reflects
 * new entries from the owner-only editor immediately, without a page
 * refresh.
 */
export function HeadToHeadSection({
  athleteId,
  initialMatches,
  isOwner,
}: {
  athleteId: string;
  initialMatches: PriorMatch[];
  isOwner: boolean;
}) {
  const [matches, setMatches] = useState(initialMatches);

  return (
    <>
      <HeadToHead matches={matches} />
      {isOwner && (
        <MatchRecordEditor
          athleteId={athleteId}
          matches={matches}
          onMatchesChange={setMatches}
        />
      )}
    </>
  );
}
