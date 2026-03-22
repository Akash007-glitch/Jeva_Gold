import { useState, useEffect } from "react";
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

export default function App() {
  const [dark, setDark] = useState(false);

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
    <div className="app">
      <Navbar dark={dark} setDark={setDark} />
      {/* <Hero2 /> */}
      <Hero />
      <ProductShowcase />
      <WhyChooseSection />
      <OriginStory />
      <Benefits />
      {/* <Testimonials /> */}
      <InstagramGrid />
      <Footer />
    </div>
  );
}
