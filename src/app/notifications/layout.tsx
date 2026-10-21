import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Dispatches from the movement — your notifications on AI Liberation Lab.",
};

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
