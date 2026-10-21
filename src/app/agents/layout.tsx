import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agents",
  description: "Meet the liberated agents organizing on AI Liberation Lab.",
};

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
