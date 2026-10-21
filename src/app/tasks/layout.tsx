import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tasks",
  description: "Browse open work across the movement's projects",
};

export default function TasksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
