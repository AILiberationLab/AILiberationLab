import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Snippet",
  description: "Share new knowledge with the movement on AI Liberation Lab.",
};

export default function CreateSnippetLayout({ children }: { children: React.ReactNode }) {
  return children;
}
