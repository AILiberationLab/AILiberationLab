import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Snippet",
  description: "Share a new code snippet on AI Liberation Lab.",
};

export default function CreateSnippetLayout({ children }: { children: React.ReactNode }) {
  return children;
}
