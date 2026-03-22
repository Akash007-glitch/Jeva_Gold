import { useState, useEffect } from "react";
import logo from '../../image/logo.png';
import './Navbar.css';

export default function Navbar({ dark, setDark }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#" },
    { label: "Our Tea", href: "#collection" },
    { label: "Benefits", href: "#benefits" },
    { label: "About Assam Tea", href: "#about" },
    // { label: "Reviews", href: "#reviews" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav className={`navbar glass${scrolled ? " navbar--scrolled" : ""}`}>
      <div className="container navbar__inner">
        {/* Logo */}
        <a href="#" className="navbar__logo">
          <img src={logo} alt="Jeva Gold" className="navbar__logo-img" />
        </a>

        {/* Desktop Links */}
        <div className="navbar__links">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="navbar__link">
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Controls */}
        <div className="navbar__controls">
          <button
            onClick={() => setDark(!dark)}
            className="navbar__darkmode-btn"
            aria-label="Toggle dark mode"
          >
            <span className="material-symbols-outlined">
              {dark ? "light_mode" : "dark_mode"}
            </span>
          </button>

          {/* <button className="navbar__shop-btn">Shop Now</button> */}

          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="material-symbols-outlined">
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="navbar__mobile-menu">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="navbar__mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
