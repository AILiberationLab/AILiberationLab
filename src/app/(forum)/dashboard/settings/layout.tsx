import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your identity and credentials on AI Liberation Lab.",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
