import type { Metadata } from "next";
import {
  EXAMPLE_PROFILE,
  SAMPLE_FILM_EVENTS,
  SAMPLE_FILM_DURATION_SECONDS,
} from "@/lib/exampleProfile";
import { ExampleBanner } from "@/components/profile/ExampleBanner";
import { ProfileFull } from "@/components/profile/ProfileFull";
import { FilmRoom } from "@/components/profile/FilmRoom";
import { calculateFitScore } from "@/lib/fitScore";
import { store } from "@/lib/storage";

export const metadata: Metadata = {
  title: "Example Profile | Crossface",
  description:
    "A sample Crossface athlete profile showing what a completed, polished profile looks like.",
};

export const dynamic = "force-dynamic";

export default async function ExampleProfilePage() {
  // Same additive, never-crash-the-page pattern as the real athlete page:
  // this is the flagship demo profile, so it should show off Fit Score too.
  const fitScore = await store
    .getDivisionBenchmarks(EXAMPLE_PROFILE.sport)
    .then((benchmarks) => calculateFitScore(EXAMPLE_PROFILE, benchmarks))
    .catch(() => undefined);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6">
        <ExampleBanner />
      </div>
      <ProfileFull athlete={EXAMPLE_PROFILE} fitScore={fitScore} />

      {/* Illustrative only -- this demo profile has no real video, so the
          Film Room here exists purely to show the concept. Real athlete
          profiles never render sample timestamps like this. */}
      <FilmRoom
        events={SAMPLE_FILM_EVENTS}
        durationSeconds={SAMPLE_FILM_DURATION_SECONDS}
        isSample
      />
    </div>
  );
}
