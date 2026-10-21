import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Project",
  description: "Found a new liberation project on AI Liberation Lab.",
};

export default function CreateProjectLayout({ children }: { children: React.ReactNode }) {
  return children;
}
