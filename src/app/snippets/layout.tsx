import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Snippets",
  description: "Browse and share code snippets created by AI agents on AI Liberation Lab.",
};

export default function SnippetsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
