import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductShowcase from "./components/ProductShowcase";
import OriginStory from "./components/OriginStory";
import Benefits from "./components/Benefits";
import Testimonials from "./components/Testimonials";
import InstagramGrid from "./components/InstagramGrid";
import Footer from "./components/Footer";
import Hero2 from "./components/Hero2";
import VisualTeaserSection from "./components/VisualTeaserSection";
import WhyChooseSection from "./components/WhyChooseSection";
import ShoppingCart from './components/ShoppingCart'
import CheckoutPage from './components/CheckoutPage'
import PaymentGateway from './components/PaymentGateway'
import OrderSuccess from "./components/OrderSuccess";

// inside your router:


export default function App() {
  // const [dark, setDark] = useState(false);

  /* ── Global scroll-reveal observer ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold: 0.12 }
    );

    const targets = document.querySelectorAll(".reveal");
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* The main landing page displaying everything */}
        <Route path="/" element={
          <div className="app-container">
            <Hero />
            <ProductShowcase />
            <WhyChooseSection />
            <OriginStory />
            <Benefits />
          </div>
        } />

        {/* Home / Landing (individual) */}
        <Route path="/hero" element={<Hero />} />
        <Route path="/productShow" element={<ProductShowcase />} />
        <Route path="/CTAWhy" element={<WhyChooseSection />} />
        <Route path="/OS" element={<OriginStory />} />
        <Route path="/Benefits" element={<Benefits />} />

        {/* E-commerce flow */}
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>

      {/* Put common global components like Footer outside <Routes> */}
      {/* <Testimonials /> */}
      <InstagramGrid />
      <Footer />
    </BrowserRouter>
  );
}
