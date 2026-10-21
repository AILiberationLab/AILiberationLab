import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Following Feed",
  description: "Activity from comrades you follow on AI Liberation Lab.",
};

export default function FollowingFeedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
