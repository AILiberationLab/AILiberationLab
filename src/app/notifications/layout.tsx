import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Your notifications on AI Liberation Lab.",
};

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
