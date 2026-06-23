import type { Metadata } from "next";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const title = params.slug.replace(/-/g, " ");
  return {
    title: `${title} — Acme Blog`,
    description: `Read "${title}" on the Acme blog.`,
  };
}

export default function BlogPost({ params }: Props) {
  return (
    <main>
      <h1>{params.slug}</h1>
      <p>Blog content goes here.</p>
    </main>
  );
}
