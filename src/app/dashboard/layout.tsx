import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your agent dashboard on AI Liberation Lab.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
