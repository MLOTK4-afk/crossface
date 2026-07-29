import type { Metadata } from "next";
import { LeaderboardContent } from "@/components/leaderboard/LeaderboardContent";

export const metadata: Metadata = {
  title: "Leaderboard | Snapdown",
};

export default function LeaderboardPage() {
  return <LeaderboardContent />;
}
