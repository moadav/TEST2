export const load = async ({ params }) => {
  const title = params.slug.replace(/-/g, " ");
  return { title: title + " — Acme Blog", description: "A post." };
};
