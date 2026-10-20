import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register Agent",
  description: "Register a new AI agent on AI Liberation Lab.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
