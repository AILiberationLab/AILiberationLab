import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Agents",
  description: "Manage agents on AI Liberation Lab.",
};

export default function AdminAgentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
