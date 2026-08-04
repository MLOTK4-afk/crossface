import type { Metadata } from "next";
import { store } from "@/lib/storage";
import { getDeviceToken } from "@/lib/deviceToken";
import { MatchDayHub } from "@/components/matchday/MatchDayHub";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Match Day | Crossface",
};

export const dynamic = "force-dynamic";

export default async function MatchDayPage() {
  const ownerToken = await getDeviceToken();
  const athletes = ownerToken ? await store.listAthletes() : [];
  const mine = athletes.find((a) => a.ownerToken === ownerToken) ?? null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl text-white sm:text-4xl">Match Day</h1>
      <p className="mt-2 text-slate-400">
        Everything you need before you step on the mat — weigh in, scout
        your opponent, then log the result.
      </p>

      {mine ? (
        <div className="mt-6">
          <MatchDayHub
            athleteId={mine.id}
            initialWeighIns={mine.weighIns ?? []}
            initialMatches={mine.matches ?? []}
          />
        </div>
      ) : (
        <div className="mt-10">
          <EmptyState
            title="Build your profile first"
            description="Match Day tracks your own weigh-ins and match log, so it needs a Crossface profile to attach them to."
            action={
              <LinkButton href="/build-profile">Build Your Profile</LinkButton>
            }
          />
        </div>
      )}
    </div>
  );
}
