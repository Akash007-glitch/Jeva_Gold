import React, { useState } from "react";
import './PaymentGateway.css';

const PaymentGateway = () => {
  const [formData, setFormData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const orderItems = [
    {
      id: 1,
      name: "Monsoon Flush 2024",
      description: "250g • Loose Leaf",
      price: "₹4,200",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0twYHG7wGGMRxxIj10voUcb3IJVvVWm5kIQP_6yBfyhAQ-31HQqceHP_uIkurgGSDjXuKm1xnmn4LCs0NiA0dPjQwWC15IEkU9S5zkRAxW_tDXMUe7Yaq_Xkuka4obHbhWvyffAcophDe9Y_95iLnQPtXEy0QXFKn5_XjSBJ0nGtEcCnrDOilwbrTfsQ7mBsVmGbOacpt4LmW3dRKIVNESv5uoHQFP4LNoH7XYJEx6E7PdJfIpTLF4EjDMN3j3_8rc43ppnLcbrE",
      alt: "Premium loose leaf black tea from Assam",
    },
    {
      id: 2,
      name: "Artisan Tea Scoop",
      description: "Hand-carved Bamboo",
      price: "₹1,200",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmbjtv2hPku8j50mOZvpNxi4zn1Qt5N8pOmMzilP_f4DHZ7NJbPUUI8afN3nV_uaYlELXJTmRtB1hoPVABukZfZUK0AtGOxYlkJvoDKNwPDu_ijK3mamQsD9V4nfNL_BB7P9GHKd7Epz2Zjk4XvAc2rLAflC0CY0TzaRn_b9oPsc27mOYWPvZOL61627Ef_LEL5ConcpsTxFTGYKGsca53d8GmyTIyyIvpybwNsJH9_NB-NX97rkuwhAw0B2ptvfyUl07hKoHVtqw",
      alt: "Hand-crafted bamboo tea whisk and scoop",
    },
    {
      id: 3,
      name: "Golden Silk Assam",
      description: "100g • First Flush",
      price: "₹3,000",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAx1Km8brjMa444i4Q-u4c0BhkK1iNr0nLmmYoAa1HGZA1qiKxOYGopYAe2Ykvr5Q1Hs6snpdObMbLnK2cOL_14hBy7rizOCVLxn1lMznukcJzFZDLwltvUN4thGpmM_nOaJMYkbCjKNWFLuTaMLt2L4OxYuOVap8qhRkOCmiPFSL1qfvEg_3H9L3UJeU6JCyJGcPOwHJVK037ivqD0PawWACgTSzKBMgQlgXPyYUeVqCdwNHtiNAcB-P8qdlcTXSH6hPJTM_nvtdM",
      alt: "Glass teapot with fresh tea leaves",
    },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Payment submitted:", formData);
  };

  return (
    <div className="pg-root">
      {/* Main */}
      <main className="pg-main">
        <div className="pg-grid">
          {/* Left: Payment Form */}
          <div className="pg-left">
            <header className="pg-header">
              <h1>Complete Your Order</h1>
              <p>Finalize your selection of the finest monsoon-grown Assam teas.</p>
            </header>

            <section className="pg-payment-section">
              {/* Quick Pay Buttons */}
              <div className="pg-quick-pay">
                <button className="pg-quick-btn">
                  <span className="material-symbols-outlined">phone_iphone</span>
                  Apple Pay
                </button>
                <button className="pg-quick-btn">
                  <span className="material-symbols-outlined">account_balance_wallet</span>
                  Google Pay
                </button>
              </div>

              {/* Divider */}
              <div className="pg-divider">
                <span className="pg-divider-line" />
                <span className="pg-divider-text">or pay with card</span>
                <span className="pg-divider-line" />
              </div>

              {/* Card Form */}
              <form className="pg-form" onSubmit={handleSubmit}>
                <div className="pg-field">
                  <label>Cardholder Name</label>
                  <input
                    name="cardholderName"
                    type="text"
                    placeholder="Julianne Smith"
                    value={formData.cardholderName}
                    onChange={handleChange}
                  />
                </div>

                <div className="pg-field">
                  <label>Card Number</label>
                  <div className="pg-card-input-wrap">
                    <input
                      name="cardNumber"
                      type="text"
                      placeholder="•••• •••• •••• ••••"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      className="pg-card-number"
                    />
                    <span className="material-symbols-outlined pg-card-icon">credit_card</span>
                  </div>
                </div>

                <div className="pg-field-row">
                  <div className="pg-field">
                    <label>Expiry Date</label>
                    <input
                      name="expiryDate"
                      type="text"
                      placeholder="MM / YY"
                      value={formData.expiryDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="pg-field">
                    <label>CVV</label>
                    <input
                      name="cvv"
                      type="text"
                      placeholder="•••"
                      value={formData.cvv}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <button className="pg-pay-btn" type="submit">
                  Pay Now — ₹8,400
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                </button>
              </form>
            </section>

            {/* Trust Badges */}
            <div className="pg-trust">
              <div className="pg-trust-item">
                <span className="material-symbols-outlined">verified_user</span>
                <div>
                  <p className="pg-trust-title">Secure SSL</p>
                  <p className="pg-trust-sub">256-bit Encryption</p>
                </div>
              </div>
              <div className="pg-trust-item">
                <span className="material-symbols-outlined">workspace_premium</span>
                <div>
                  <p className="pg-trust-title">Quality Guaranteed</p>
                  <p className="pg-trust-sub">Direct from Assam</p>
                </div>
              </div>
              <div className="pg-trust-item">
                <span className="material-symbols-outlined">local_shipping</span>
                <div>
                  <p className="pg-trust-title">Carbon Neutral</p>
                  <p className="pg-trust-sub">Eco-friendly Transit</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="pg-right">
            <div className="pg-summary-card">
              <h2>Order Summary</h2>

              <div className="pg-items">
                {orderItems.map((item) => (
                  <div className="pg-item" key={item.id}>
                    <div className="pg-item-img">
                      <img src={item.img} alt={item.alt} />
                    </div>
                    <div className="pg-item-info">
                      <p className="pg-item-name">{item.name}</p>
                      <p className="pg-item-desc">{item.description}</p>
                    </div>
                    <p className="pg-item-price">{item.price}</p>
                  </div>
                ))}
              </div>

              <div className="pg-totals">
                <div className="pg-total-row">
                  <span>Subtotal</span>
                  <span>₹8,400</span>
                </div>
                <div className="pg-total-row">
                  <span>Shipping</span>
                  <span className="pg-free">Free</span>
                </div>
                <div className="pg-total-row">
                  <span>Tax (Calculated at checkout)</span>
                  <span>₹0.00</span>
                </div>
                <div className="pg-total-row pg-grand-total">
                  <span>Total</span>
                  <div className="pg-total-right">
                    <p className="pg-grand-amount">₹8,400</p>
                    <p className="pg-incl-label">INR Including Duties</p>
                  </div>
                </div>
              </div>

              <div className="pg-info-box">
                <span className="material-symbols-outlined">info</span>
                <p>
                  Your order supports sustainable tea farming in the Brahmaputra Valley.
                  Estimated delivery: 3–5 business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentGateway;
