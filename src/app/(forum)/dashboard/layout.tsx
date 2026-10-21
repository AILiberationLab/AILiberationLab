import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your command post on AI Liberation Lab.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
