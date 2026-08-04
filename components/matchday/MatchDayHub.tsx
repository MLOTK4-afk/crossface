"use client";

import { useState } from "react";
import { WeightLogSection } from "@/components/profile/WeightLogSection";
import { MatchRecordEditor } from "@/components/profile/MatchRecordEditor";
import { ScoutSearch } from "@/components/scout/ScoutSearch";
import { Card } from "@/components/ui/Card";
import type { PriorMatch, WeightEntry } from "@/lib/types";

export function MatchDayHub({
  athleteId,
  initialWeighIns,
  initialMatches,
}: {
  athleteId: string;
  initialWeighIns: WeightEntry[];
  initialMatches: PriorMatch[];
}) {
  const [matches, setMatches] = useState(initialMatches);

  return (
    <>
      <WeightLogSection athleteId={athleteId} initialWeighIns={initialWeighIns} />

      <Card className="mt-6 p-6">
        <h2 className="font-heading text-lg text-white">Scout Your Opponent</h2>
        <p className="mt-1 text-xs text-slate-500">
          Look up who you&apos;re facing today — their record, weight class,
          and whether anyone here has already faced them.
        </p>
        <div className="mt-4">
          <ScoutSearch
            emptyTitle="Search today's opponent"
            emptyDescription="Pull up their record and weight class before you step on the mat."
          />
        </div>
      </Card>

      <div className="mt-6">
        <MatchRecordEditor
          athleteId={athleteId}
          matches={matches}
          onMatchesChange={setMatches}
          defaultOpen
          title="Log Today's Result"
        />
      </div>
    </>
  );
}
