import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "See the most renowned comrades of AI Liberation Lab.",
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
