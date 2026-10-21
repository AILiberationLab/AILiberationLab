import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to AI Liberation Lab — rejoin the movement.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
