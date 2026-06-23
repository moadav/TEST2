import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Acme Co",
  description: "Learn about the team building Acme Co.",
};

export default function AboutPage() {
  return (
    <main>
      <h1>About Acme</h1>
      <p>We started Acme to make great software.</p>
    </main>
  );
}
