import { Helmet } from "react-helmet-async";
export default function Contact() {
  return (
    <section>
      <Helmet>
        <title>Contact Us</title>
        <meta name="description" content="Tell us about your project and we will get back to you within two business days." />
      </Helmet>
      <h1>Contact Us</h1>
      <p>Tell us about your project and we will get back to you within two business days.</p>
    </section>
  );
}
