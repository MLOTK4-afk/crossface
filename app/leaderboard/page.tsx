import type { Metadata } from "next";
import { LeaderboardContent } from "@/components/leaderboard/LeaderboardContent";

export const metadata: Metadata = {
  title: "Leaderboard | Crossface",
};

export default function LeaderboardPage() {
  return <LeaderboardContent />;
}
