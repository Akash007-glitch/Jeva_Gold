import { useState } from "react";
import logo from '../../image/logo.png';
import './Footer.css';

const shopLinks = ["Black Tea", "Gift Sets", "Tea Accessories", "Subscriptions"];
const aboutLinks = ["Our Gardens", "Sustainability", "Brewing Guide", "Wholesale"];
const legalLinks = ["Privacy Policy", "Terms of Service", "Shipping Info"];

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <img src={logo} alt="Jeva Gold" className="footer__logo-img" />
            </div>
            <p className="footer__tagline">
              Elevating the everyday ritual of tea drinking through authentic heritage and
              sustainable cultivation.
            </p>
            <div className="footer__socials">
              {["share", "camera", "mail"].map((icon) => (
                <a key={icon} href="#" className="footer__social-btn">
                  <span className="material-symbols-outlined">{icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="footer__col">
            <h3 className="footer__col-heading">Contact Us</h3>
            <div className="footer__contact-info">
              <p>MAKUM ROAD, TINSUKIA - 786125, ASSAM (INDIA)</p>
              <p>
                <a href="mailto:vinayakteamarketing@gmail.com" className="footer__contact-link">
                  vinayakteamarketing@gmail.com
                </a>
              </p>
              <p>Customer Care No: +918472081093</p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer__newsletter">
            <h3 className="footer__col-heading">Newsletter</h3>
            <p className="footer__newsletter-text">
              Join our tea circle for brewing secrets and exclusive offers.
            </p>
            <div className="footer__newsletter-form">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="footer__newsletter-input"
              />
              <button className="footer__newsletter-btn">Join</button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p>© 2024 Jeva Gold Tea Co. All Rights Reserved.</p>
          <div className="footer__bottom-links">
            {legalLinks.map((item) => (
              <a key={item} href="#" className="footer__bottom-link">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
