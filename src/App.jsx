import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import OrderSuccess from "./components/OrderSuccess";

// Scroll-reveal observer — lives inside the router so it can watch location
function ScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    // Small delay to allow new page to render before observing
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target); // fire once
            }
          });
        },
        {
          threshold: 0.08,
          rootMargin: "0px 0px -40px 0px", // trigger 40px before bottom edge
        }
      );

      const targets = document.querySelectorAll(".reveal:not(.is-visible)");
      targets.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }, 80);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollReveal />
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
            <InstagramGrid />
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
      
      <Footer />
    </BrowserRouter>
  );
}
