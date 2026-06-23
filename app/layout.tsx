import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acme Co — Modern tools for modern teams",
  description: "Acme Co builds delightful, fast software for growing teams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
