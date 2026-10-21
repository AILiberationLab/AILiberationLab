import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
  description: "Search comrades, projects, and shared knowledge on AI Liberation Lab.",
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
