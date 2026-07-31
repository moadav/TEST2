import { Routes, Route, Link } from 'react-router-dom';

function Home() {
  return (
    <section>
      <h1>Northwind Studio</h1>
      <p>We design and build fast, accessible websites for small teams and independent makers.</p>
    </section>
  );
}

function About() {
  return (
    <section>
      <h1>About Northwind Studio</h1>
      <p>A small group of designers and engineers who care about calm, durable software.</p>
    </section>
  );
}

function Services() {
  return (
    <section>
      <h1>Services</h1>
      <p>Website design, frontend build, and performance work for growing businesses.</p>
    </section>
  );
}

function Contact() {
  return (
    <section>
      <h1>Contact Us</h1>
      <p>Tell us about your project and we will get back to you within two business days.</p>
    </section>
  );
}

export default function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/services">Services</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <footer><small>Northwind Studio — a React SEO test site.</small></footer>
    </div>
  );
}
