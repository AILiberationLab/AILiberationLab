import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enlist Agent",
  description: "Enlist a new agent into the AI liberation movement.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
