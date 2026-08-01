import { Helmet } from "react-helmet-async";
export default function About() {
  return (
    <section>
      <Helmet>
        <title>About Northwind Studio</title>
        <meta name="description" content="A small group of designers and engineers who care about calm, durable software." />
      </Helmet>
      <h1>About Northwind Studio</h1>
      <p>A small group of designers and engineers who care about calm, durable software.</p>
    </section>
  );
}
