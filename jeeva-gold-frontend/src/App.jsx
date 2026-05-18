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

function LoadingScreen({ visible }) {
  return (
    <div
      className={`site-loader${visible ? "" : " site-loader--hidden"}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Jeeva Gold"
    >
      <div className="site-loader__mark" aria-hidden="true">
        <span className="site-loader__leaf" />
      </div>
      <p className="site-loader__brand">Jeeva Gold</p>
    </div>
  );
}

function ScrollToTopOnRoute() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [pathname, hash]);

  return null;
}

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      className={`scroll-top-btn${visible ? " scroll-top-btn--visible" : ""}`}
      onClick={handleClick}
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      <span className="material-symbols-outlined" aria-hidden="true">
        keyboard_arrow_up
      </span>
    </button>
  );
}

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let loadComplete = document.readyState === "complete";
    let delayComplete = false;

    const hideWhenReady = () => {
      if (loadComplete && delayComplete) {
        setIsLoading(false);
      }
    };

    const handleLoad = () => {
      loadComplete = true;
      hideWhenReady();
    };

    const minimumDelay = window.setTimeout(() => {
      delayComplete = true;
      hideWhenReady();
    }, 900);

    if (loadComplete) {
      hideWhenReady();
    } else {
      window.addEventListener("load", handleLoad, { once: true });
    }

    return () => {
      window.clearTimeout(minimumDelay);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <BrowserRouter>
      <LoadingScreen visible={isLoading} />
      <ScrollToTopOnRoute />
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
      <ScrollToTopButton />
    </BrowserRouter>
  );
}
